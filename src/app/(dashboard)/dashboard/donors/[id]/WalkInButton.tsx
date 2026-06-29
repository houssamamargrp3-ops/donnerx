"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplet } from "lucide-react";
import { createWalkInDonation } from "@/app/actions/walkin.actions";

export default function WalkInButton({ donorId }: { donorId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleWalkIn = async () => {
    setLoading(true);
    const res = await createWalkInDonation(donorId);
    
    if (res.error) {
      alert(res.error);
      setLoading(false);
    } else if (res.appointmentId) {
      // Redirect to the donation record form with the new auto-confirmed appointment
      router.push(`/dashboard/donations/new?appointmentId=${res.appointmentId}`);
    }
  };

  return (
    <button 
      onClick={handleWalkIn}
      disabled={loading}
      className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
    >
      <Droplet className="w-4 h-4" />
      {loading ? "جاري التهيئة..." : "سحب دم مباشر"}
    </button>
  );
}
