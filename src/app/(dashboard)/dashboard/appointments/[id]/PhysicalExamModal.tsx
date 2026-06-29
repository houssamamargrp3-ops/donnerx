"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Stethoscope, AlertTriangle, CheckCircle2, X } from "lucide-react";

export default function PhysicalExamModal({ appointmentId, donorName }: { appointmentId: string, donorName: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bloodPressure, setBloodPressure] = useState("");
  const [hemoglobin, setHemoglobin] = useState("");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [isPassed, setIsPassed] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPassed === null) {
      setError("يجب تحديد نتيجة الفحص (مؤهل / غير مؤهل).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/appointments/${appointmentId}/examine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPassed,
          notes: `الضغط: ${bloodPressure} | الهيموجلوبين: ${hemoglobin} | الوزن: ${weight} | ملاحظات: ${notes}`
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل تسجيل الفحص");

      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-white border-2 border-emerald-600 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-colors"
      >
        <Stethoscope className="w-5 h-5" />
        إجراء الفحص الطبي بالمقر
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-600" />
                الفحص الطبي السريري
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <p className="text-slate-500 text-sm mb-4">
                تسجيل القياسات الحيوية للمتبرع <strong className="text-slate-800">{donorName}</strong> للتأكد من قدرته البدنية على التبرع اليوم.
              </p>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">ضغط الدم</label>
                  <input type="text" placeholder="مثال: 120/80" value={bloodPressure} onChange={e => setBloodPressure(e.target.value)} className="labo-input" required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">قوة الدم (الهيموجلوبين)</label>
                  <input type="text" placeholder="مثال: 14.5" value={hemoglobin} onChange={e => setHemoglobin(e.target.value)} className="labo-input" required />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">الوزن الفعلي (كغ)</label>
                <input type="number" placeholder="يجب أن لا يقل عن 50 كغ" value={weight} onChange={e => setWeight(e.target.value)} className="labo-input" required />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">ملاحظات الطبيب (اختياري)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="labo-input min-h-[80px]" placeholder="أي ملاحظات حول صحة المتبرع اليوم..."></textarea>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-slate-700 block">نتيجة الفحص الطبي والقرار:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setIsPassed(true)} className={`px-4 py-3 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${isPassed === true ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200'}`}>
                    <CheckCircle2 className="w-5 h-5" /> مؤهل للتبرع
                  </button>
                  <button type="button" onClick={() => setIsPassed(false)} className={`px-4 py-3 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${isPassed === false ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-500 hover:border-red-200'}`}>
                    <X className="w-5 h-5" /> غير مؤهل
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors">
                  إلغاء
                </button>
                <button type="submit" disabled={isSubmitting} className="labo-btn-primary flex-1 justify-center">
                  {isSubmitting ? <span className="spinner border-t-white" /> : "حفظ النتيجة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
