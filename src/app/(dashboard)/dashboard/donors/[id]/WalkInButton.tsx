"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplet, X } from "lucide-react";
import { createWalkInDonation } from "@/app/actions/walkin.actions";

export default function WalkInButton({ 
  donorId, 
  centers 
}: { 
  donorId: string, 
  centers: { id: string, name: string }[] 
}) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(centers[0]?.id || "");
  const router = useRouter();

  const handleWalkIn = async () => {
    if (!selectedCenter) {
      alert("الرجاء اختيار المركز أولاً.");
      return;
    }
    
    setLoading(true);
    const res = await createWalkInDonation(donorId, selectedCenter);
    
    if (res.error) {
      alert(res.error);
      setLoading(false);
      setShowModal(false);
    } else if (res.appointmentId) {
      router.push(`/dashboard/donations/new?appointmentId=${res.appointmentId}`);
    }
  };

  return (
    <>
      <button 
        onClick={() => {
          if (centers.length > 1) {
            setShowModal(true);
          } else {
            handleWalkIn(); // Auto select if only 1 center exists
          }
        }}
        disabled={loading}
        className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
      >
        <Droplet className="w-4 h-4" />
        {loading ? "جاري التهيئة..." : "سحب دم مباشر"}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="font-bold text-lg">اختيار مركز التبرع</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">في أي مركز يتم السحب الآن؟</label>
                <select 
                  className="labo-input" 
                  value={selectedCenter} 
                  onChange={(e) => setSelectedCenter(e.target.value)}
                >
                  <option value="" disabled>اختر المركز...</option>
                  {centers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={handleWalkIn}
                disabled={loading || !selectedCenter}
                className="labo-btn-primary w-full justify-center"
              >
                {loading ? "جاري..." : "متابعة تسجيل التبرع"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
