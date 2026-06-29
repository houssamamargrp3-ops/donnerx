"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { registerDonation } from "@/app/actions/medical.actions";

export default function ConfirmDonationButton({ appointmentId }: { appointmentId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (confirm("هل أنت متأكد من تأكيد حضور المتبرع وإتمام عملية سحب الدم؟")) {
      setIsPending(true);
      setError(null);
      
      const res = await registerDonation(appointmentId);
      
      if (res.error) {
        setError(res.error);
        setIsPending(false);
      } else {
        setSuccess(true);
        // Page will naturally revalidate because of revalidatePath in server action
      }
    }
  };

  if (success) {
    return (
      <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
        <CheckCircle className="w-3 h-3" /> تم التبرع
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button 
        onClick={handleConfirm}
        disabled={isPending}
        className="labo-action-btn labo-action-edit disabled:opacity-50"
        title="تأكيد حضور المتبرع وإتمام التبرع"
      >
        {isPending ? <span className="spinner border-t-white w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
      </button>
      {error && <span className="text-red-500 text-[10px] max-w-[100px] leading-tight">{error}</span>}
    </div>
  );
}
