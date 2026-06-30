"use client";

import { useState, useTransition } from "react";
import { registerForCampaign } from "@/app/actions/campaign.actions";
import { CheckCircle, HeartPulse } from "lucide-react";

export default function RegisterCampaignButton({ campaignId }: { campaignId: string }) {
  const [isPending, startTransition] = useTransition();
  const [registered, setRegistered] = useState(false);

  const handleRegister = () => {
    startTransition(async () => {
      const result = await registerForCampaign(campaignId);
      if (result.error) {
        alert(result.error);
      } else {
        setRegistered(true);
      }
    });
  };

  if (registered) {
    return (
      <div className="mt-6 bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center justify-center gap-2 border border-emerald-200">
        <CheckCircle className="w-5 h-5" />
        <span className="font-bold">تم تسجيلك في الحملة بنجاح! راجع إشعاراتك.</span>
      </div>
    );
  }

  return (
    <button 
      onClick={handleRegister} 
      disabled={isPending}
      className="mt-6 w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <HeartPulse className="w-5 h-5" />
      {isPending ? "جاري التسجيل..." : "سجل الآن للتبرع في هذه الحملة"}
    </button>
  );
}
