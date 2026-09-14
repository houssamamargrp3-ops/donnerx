"use client";

import { useState } from "react";
import { MapPin, Navigation, Globe2, Check, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";
import { updateDonorLocation } from "@/app/actions/donor.actions";

interface DonorLocationSettingsCardProps {
  userId: string;
  initialCity?: string | null;
  initialCurrentCity?: string | null;
  initialSecondaryCities?: string[];
  initialNotifyNationwide?: boolean;
}

export default function DonorLocationSettingsCard({
  userId,
  initialCity = "",
  initialCurrentCity = "",
  initialSecondaryCities = [],
  initialNotifyNationwide = true,
}: DonorLocationSettingsCardProps) {
  const [city, setCity] = useState(initialCity || "");
  const [currentCity, setCurrentCity] = useState(initialCurrentCity || "");
  const [secondaryCities, setSecondaryCities] = useState(initialSecondaryCities?.join(", ") || "");
  const [notifyNationwide, setNotifyNationwide] = useState(initialNotifyNationwide);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("city", city);
      formData.append("currentCity", currentCity);
      formData.append("secondaryCities", secondaryCities);
      formData.append("notifyNationwide", notifyNationwide ? "true" : "false");

      const res = await updateDonorLocation(formData);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (_) {
      setErrorMsg("حدث خطأ أثناء حفظ الإعدادات الجغرافية.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              النطاق الجغرافي وحرية التنقل 🚗
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              تحديد الولايات والمدن التي تتنقل إليها ليصلك أي نداء طوارئ أو حملة أينما كنت.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          تم حفظ إعدادات الموقع الجغرافي بنجاح!
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-800 border border-red-200 text-xs font-bold p-3 rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 text-sm">
        {/* Primary City */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            المدينة / ولاية الإقامة الأساسية:
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="مثال: ورقلة، الجزائر، وهران..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
            required
          />
        </div>

        {/* Current City Check-in */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-blue-500" />
            تتواجد مؤقتاً في مدينة أخرى حالياً؟ (سفر / عمل):
          </label>
          <input
            type="text"
            value={currentCity}
            onChange={(e) => setCurrentCity(e.target.value)}
            placeholder="أدخل اسم المدينة التي تتواجد فيها مؤقتاً لفتح إشعاراتها..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
          />
        </div>

        {/* Secondary Cities */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-emerald-500" />
            مدن إضافية تتنقل إليها بانتظام (مفصولة بفواصل):
          </label>
          <input
            type="text"
            value={secondaryCities}
            onChange={(e) => setSecondaryCities(e.target.value)}
            placeholder="مثال: غرداية، تقرت، وهران..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-xs"
          />
        </div>

        {/* Nationwide Emergency Toggle */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-800">
                استقبال نداءات الطوارئ العاجلة من كافة الولايات 🩸
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                تفعيل هذا الخيار يضمن وصول نداءات النقص الحاد في الدم إليك حتى عند التنقل بين الولايات.
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={notifyNationwide}
            onChange={(e) => setNotifyNationwide(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer shrink-0"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-400" />
          )}
          حفظ التفضيلات الجغرافية
        </button>
      </form>
    </div>
  );
}
