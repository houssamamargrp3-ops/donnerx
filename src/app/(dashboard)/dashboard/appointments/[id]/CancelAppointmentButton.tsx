"use client";

import { useTransition, useState } from "react";
import { cancelAppointment } from "@/app/actions/appointment.actions";
import { XCircle, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelAppointment(appointmentId, reason || "بدون سبب محدد");
      if (res.success) {
        setShowConfirm(false);
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  if (!showConfirm) {
    return (
      <button 
        onClick={() => setShowConfirm(true)}
        className="w-full flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg text-red-600 font-bold bg-white border border-red-200 hover:bg-red-50 transition-colors shadow-sm"
      >
        <XCircle className="w-5 h-5" />
        إلغاء الموعد
      </button>
    );
  }

  return (
    <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-3">
      <div className="flex items-center gap-2 text-red-700 font-bold">
        <AlertTriangle className="w-5 h-5" />
        تأكيد إلغاء الموعد
      </div>
      <p className="text-sm text-red-600">هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟ سيتم إشعار المركز بذلك.</p>
      
      <input 
        type="text" 
        placeholder="سبب الإلغاء (اختياري)" 
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full text-sm p-2 rounded border border-red-200 outline-none focus:border-red-400"
      />
      
      <div className="flex gap-2 pt-2">
        <button 
          onClick={handleCancel}
          disabled={isPending}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg text-sm transition-colors flex justify-center items-center"
        >
          {isPending ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "نعم، إلغاء الموعد"}
        </button>
        <button 
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 font-bold py-2 rounded-lg text-sm border border-slate-200 transition-colors"
        >
          تراجع
        </button>
      </div>
    </div>
  );
}
