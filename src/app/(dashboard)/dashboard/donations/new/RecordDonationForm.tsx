"use client";

import { useState } from "react";
import { recordDonation } from "@/app/actions/donation.actions";
import { Loader2, CheckCircle2, AlertCircle, User, Building2, Droplet, Calendar, HeartPulse, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

interface DonorOption {
  id: string;
  name: string;
  phone?: string;
  bloodType: string;
}

interface CenterOption {
  id: string;
  name: string;
  city: string;
}

export default function RecordDonationForm({
  appointmentId,
  donorId: initialDonorId,
  centerId: initialCenterId,
  staffId = "",
  donorBloodType: initialBloodType = "O_POSITIVE",
  defaultNextDate,
  donors = [],
  centers = [],
}: {
  appointmentId?: string;
  donorId?: string;
  centerId?: string;
  staffId?: string;
  donorBloodType?: string;
  defaultNextDate: string;
  donors?: DonorOption[];
  centers?: CenterOption[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedDonorId, setSelectedDonorId] = useState(initialDonorId || (donors.length > 0 ? donors[0].id : ""));
  const [selectedCenterId, setSelectedCenterId] = useState(initialCenterId || (centers.length > 0 ? centers[0].id : ""));
  const [selectedBloodType, setSelectedBloodType] = useState(initialBloodType);
  const [volumeMl, setVolumeMl] = useState(450);
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [hemoglobin, setHemoglobin] = useState("14.0");

  const handleDonorChange = (dId: string) => {
    setSelectedDonorId(dId);
    const found = donors.find((d) => d.id === dId);
    if (found && found.bloodType) {
      setSelectedBloodType(found.bloodType);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("appointmentId", appointmentId || "");
    formData.append("donorId", selectedDonorId || initialDonorId || "");
    formData.append("centerId", selectedCenterId || initialCenterId || "");
    formData.append("staffId", staffId);
    formData.append("bloodType", selectedBloodType);
    formData.append("volumeMl", String(volumeMl));

    // Append vitals to notes
    const rawNotes = (formData.get("notes") as string) || "";
    const fullNotes = `الضغط: ${bloodPressure} | الهيموجلوبين: ${hemoglobin} g/dL ${rawNotes ? " | " + rawNotes : ""}`;
    formData.set("notes", fullNotes);

    const res = await recordDonation(formData);

    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else if (res.success) {
      router.push(`/dashboard/donations/${res.donationId}/certificate`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-2xl border border-red-200 flex items-start gap-2 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Donor Selector (if not prefilled) */}
      {!initialDonorId && donors.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
            <User className="w-4 h-4 text-red-600" />
            اختر المتبرع *
          </label>
          <select
            value={selectedDonorId}
            onChange={(e) => handleDonorChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm font-bold outline-none focus:border-red-500"
            required
          >
            {donors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} {d.phone ? `(${d.phone})` : ""} - فصيلة: {d.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Center Selector (if not prefilled) */}
      {!initialCenterId && centers.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1.5 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            مركز نقل الدم / المستشفى *
          </label>
          <select
            value={selectedCenterId}
            onChange={(e) => setSelectedCenterId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-sm font-bold outline-none focus:border-red-500"
            required
          >
            {centers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.city}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Blood Type & Volume */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-red-600" />
            فصيلة الدم المسحوبة *
          </label>
          <select
            name="bloodType"
            value={selectedBloodType}
            onChange={(e) => setSelectedBloodType(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 text-sm font-black outline-none focus:border-red-500"
            dir="ltr"
            required
          >
            <option value="A_POSITIVE">A+</option>
            <option value="A_NEGATIVE">A-</option>
            <option value="B_POSITIVE">B+</option>
            <option value="B_NEGATIVE">B-</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="AB_NEGATIVE">AB-</option>
            <option value="O_POSITIVE">O+</option>
            <option value="O_NEGATIVE">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-amber-600" />
            كمية الدم المسحوبة (مليلتر) *
          </label>
          <input
            type="number"
            name="volumeMl"
            value={volumeMl}
            onChange={(e) => setVolumeMl(Number(e.target.value))}
            min={200}
            max={600}
            required
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 text-sm font-bold outline-none focus:border-red-500"
            dir="ltr"
          />
        </div>
      </div>

      {/* Vitals: Blood Pressure & Hemoglobin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
            ضغط الدم المقاس (ملم زئبق)
          </label>
          <input
            type="text"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="120/80"
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
            dir="ltr"
          />
          <span className="text-[10px] text-slate-400">الطبيعي: 100-140 / 60-90</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            الهيموجلوبين (g/dL)
          </label>
          <input
            type="text"
            value={hemoglobin}
            onChange={(e) => setHemoglobin(e.target.value)}
            placeholder="14.0"
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
            dir="ltr"
          />
          <span className="text-[10px] text-slate-400">الحد الأدنى: 12.5 نساء / 13 رجال</span>
        </div>
      </div>

      {/* Next Eligible Date */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600" />
          تاريخ التبرع القادم المسموح به طبياً *
        </label>
        <input
          type="date"
          name="nextEligibleDate"
          defaultValue={defaultNextDate}
          required
          className="w-full bg-emerald-50/50 border border-emerald-200 text-emerald-900 font-bold rounded-xl p-3 text-xs md:text-sm outline-none"
        />
        <p className="text-[11px] text-slate-400 mt-1">تم حسابه تلقائياً (بعد 3 أشهر). يمكن تعديله حسب الفحص الطبي.</p>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">ملاحظات طبية إضافية (اختياري)</label>
        <textarea
          name="notes"
          rows={2}
          placeholder="أي تفاصيل خاصة بحالة المتبرع أو عملية السحب..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 text-xs outline-none resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm md:text-base py-3.5 px-6 rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري حفظ التبرع وإصدار الشهادة...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>تأكيد تسجيل التبرع وإصدار شهادة الشكر 📜</span>
          </>
        )}
      </button>
    </form>
  );
}

