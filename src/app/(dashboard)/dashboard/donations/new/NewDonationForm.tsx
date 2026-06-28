"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, UserCheck, Activity, FileCheck2, AlertCircle } from "lucide-react";

export default function NewDonationForm({ appointments, centerId }: { appointments: any[], centerId: string }) {
  const router = useRouter();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>("");
  const [volume, setVolume] = useState<string>("450");
  const [hemoglobin, setHemoglobin] = useState<string>("");
  const [bloodPressure, setBloodPressure] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId || !volume || !hemoglobin || !bloodPressure) {
      setError("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const appointment = appointments.find(a => a.id === selectedAppointmentId);

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: appointment?.donorId,
          appointmentId: appointment?.id,
          centerId,
          volume: Number(volume),
          bloodType: appointment?.donor.bloodType,
          hemoglobin: Number(hemoglobin),
          bloodPressure,
        }),
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء حفظ التبرع.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "فشل الاتصال بالخادم.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileCheck2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">تم تسجيل التبرع بنجاح!</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          تم تحديث مخزون الدم وإضافة النقاط للمتبرع. كما تم إصدار شهادة الشكر الخاصة به.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => window.print()} className="px-6 py-3 rounded-xl border border-emerald-500/50 text-emerald-400 font-bold hover:bg-emerald-500/10 transition-colors">
            طباعة الشهادة
          </button>
          <button onClick={() => router.push("/dashboard/donations")} className="btn-primary">
            سجل التبرعات
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="error-toast flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Select Donor from Today's Appointments */}
      <div>
        <label className="block text-slate-300 font-bold mb-3 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-500" />
          اختر المتبرع (مواعيد اليوم المؤكدة) *
        </label>
        {appointments.length === 0 ? (
          <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm">
            لا توجد مواعيد مؤكدة لهذا اليوم في هذا المركز.
          </div>
        ) : (
          <select
            value={selectedAppointmentId}
            onChange={(e) => setSelectedAppointmentId(e.target.value)}
            className="form-input w-full"
            required
          >
            <option value="">-- اختر المتبرع --</option>
            {appointments.map(apt => (
              <option key={apt.id} value={apt.id}>
                {apt.donor.user.name} - فصيلة: {apt.donor.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")} - هاتف: {apt.donor.phone}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Volume */}
        <div>
          <label className="block text-slate-300 font-bold mb-3 flex items-center gap-2">
            كمية الدم المسحوبة (مل) *
          </label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="form-input w-full"
            required
            min={300}
            max={500}
          />
        </div>

        {/* Hemoglobin */}
        <div>
          <label className="block text-slate-300 font-bold mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            الهيموجلوبين (g/dL) *
          </label>
          <input
            type="number"
            step="0.1"
            value={hemoglobin}
            onChange={(e) => setHemoglobin(e.target.value)}
            className="form-input w-full"
            placeholder="مثال: 14.5"
            required
          />
        </div>

        {/* Blood Pressure */}
        <div>
          <label className="block text-slate-300 font-bold mb-3 flex items-center gap-2">
            ضغط الدم *
          </label>
          <input
            type="text"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            className="form-input w-full"
            placeholder="مثال: 120/80"
            required
            dir="ltr"
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting || appointments.length === 0} className="btn-primary w-full py-4 text-lg">
        {isSubmitting ? <span className="spinner" /> : "تسجيل عملية التبرع وتحديث المخزون"}
      </button>
    </form>
  );
}
