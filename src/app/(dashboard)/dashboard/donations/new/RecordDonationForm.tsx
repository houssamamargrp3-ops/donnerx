"use client";

import { useState } from "react";
import { recordDonation } from "@/app/actions/donation.actions";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RecordDonationForm({ 
  appointmentId, 
  donorId, 
  centerId, 
  staffId,
  donorBloodType,
  defaultNextDate
}: { 
  appointmentId: string, 
  donorId: string, 
  centerId: string, 
  staffId: string,
  donorBloodType: string,
  defaultNextDate: string
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("appointmentId", appointmentId);
    formData.append("donorId", donorId);
    formData.append("centerId", centerId);
    formData.append("staffId", staffId);

    const res = await recordDonation(formData);
    
    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else if (res.success) {
      // Redirect to the certificate page!
      router.push(`/dashboard/donations/${res.donationId}/certificate`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">نموذج التسجيل الطبي</h2>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">فصيلة الدم المسحوبة</label>
          <select name="bloodType" defaultValue={donorBloodType} className="labo-input w-full bg-white" dir="ltr">
            <option value="A_POSITIVE">A+</option>
            <option value="A_NEGATIVE">A-</option>
            <option value="B_POSITIVE">B+</option>
            <option value="B_NEGATIVE">B-</option>
            <option value="AB_POSITIVE">AB+</option>
            <option value="AB_NEGATIVE">AB-</option>
            <option value="O_POSITIVE">O+</option>
            <option value="O_NEGATIVE">O-</option>
          </select>
          <p className="text-xs text-slate-400 mt-1">تأكد من مطابقتها لفصيلة المتبرع.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">كمية الدم (مليلتر)</label>
          <input 
            type="number" 
            name="volumeMl" 
            defaultValue={450} 
            min={100}
            max={600}
            required
            className="labo-input w-full" 
            dir="ltr"
          />
          <p className="text-xs text-slate-400 mt-1">الكمية القياسية هي 450ml.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">تاريخ التبرع القادم المسموح به</label>
        <input 
          type="date" 
          name="nextEligibleDate" 
          defaultValue={defaultNextDate}
          required
          className="labo-input w-full text-blue-700 font-bold bg-blue-50/50" 
        />
        <p className="text-xs text-slate-500 mt-1">
          تم حسابه تلقائياً ليكون بعد 3 أشهر. يمكنك تعديله إذا لزم الأمر طبياً.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">ملاحظات طبية (اختياري)</label>
        <textarea 
          name="notes" 
          rows={3} 
          placeholder="أي ملاحظات حول صحة المتبرع أو عملية السحب..."
          className="labo-input w-full resize-none" 
        />
      </div>

      <div className="pt-4 border-t">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="labo-btn-primary w-full py-3 flex justify-center items-center gap-2 text-lg"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
          تأكيد تسجيل التبرع وإصدار الشهادة
        </button>
      </div>
    </form>
  );
}
