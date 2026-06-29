"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Hospital, Droplet, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { createEmergencyRequest } from "@/app/actions/emergency.actions";

const BLOOD_TYPES = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];

export default function NewEmergencyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createEmergencyRequest(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      alert(`تم إطلاق نداء الطوارئ بنجاح وتم إشعار ${result.matchedDonorsCount} متبرع(ين) متوافقين في نفس المدينة!`);
      router.push("/dashboard/emergency");
    }
  };

  const formatBloodType = (type: string) => {
    return type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-4">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            إطلاق نداء طوارئ جديد
          </h1>
          <p className="text-slate-500 text-sm mt-1">قم بتحديد الاحتياج العاجل لإرسال إشعارات فورية للمتبرعين.</p>
        </div>
        <Link href="/dashboard/emergency" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          رجوع <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="labo-card p-8 border-t-4 border-t-red-600">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-bold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Hospital className="w-4 h-4 text-blue-600" /> اسم المستشفى / المركز
              </label>
              <input type="text" name="hospitalName" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="مستشفى الملك فهد..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> المدينة
              </label>
              <input type="text" name="city" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="الرياض..." />
              <p className="text-[10px] text-slate-400">سيتم تنبيه المتبرعين الموجودين في هذه المدينة فقط.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-600" /> الفصيلة المطلوبة
              </label>
              <select name="bloodType" required className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                <option value="">اختر الفصيلة...</option>
                {BLOOD_TYPES.map(bt => (
                  <option key={bt} value={bt}>{formatBloodType(bt)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">عدد الأكياس المطلوبة</label>
              <input type="number" name="unitsNeeded" required min="1" max="100" defaultValue="1" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" /> اسم مسؤول التواصل (اختياري)
              </label>
              <input type="text" name="contactName" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="د. أحمد..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" /> رقم التواصل المباشر (اختياري)
              </label>
              <input type="text" name="contactPhone" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" placeholder="05XXXXXXXX" dir="ltr" />
            </div>
            
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button type="submit" disabled={isSubmitting} className="labo-btn-danger w-full flex justify-center items-center gap-2 py-4 text-lg">
              {isSubmitting ? <span className="spinner border-t-white" /> : "إطلاق نداء الطوارئ الآن"}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">بالضغط على هذا الزر، سيتم إرسال إشعار فوري لجميع المتبرعين المتوافقين.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
