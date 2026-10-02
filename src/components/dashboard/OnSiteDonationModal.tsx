"use client";

import { useState } from "react";
import {
  X,
  QrCode,
  Heart,
  Activity,
  Award,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  FileCheck
} from "lucide-react";

interface OnSiteDonationModalProps {
  requestItem: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OnSiteDonationModal({
  requestItem,
  isOpen,
  onClose,
  onSuccess,
}: OnSiteDonationModalProps) {
  const [volume, setVolume] = useState("450");
  const [hemoglobin, setHemoglobin] = useState("14.2");
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [weight, setWeight] = useState("72");
  const [pulse, setPulse] = useState("75");
  const [temperature, setTemperature] = useState("36.6");
  const [examinationNotes, setExaminationNotes] = useState("");
  const [isQrVerified, setIsQrVerified] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !requestItem) return null;

  const handleRecordDonation = async () => {
    setErrorMsg("");
    if (!volume || !hemoglobin || !bloodPressure) {
      setErrorMsg("يرجى إدخال حجم كيس الدم، نسبة الهيموجلوبين، وضغط الدم.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/home-donations/${requestItem.id}/record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          volume: Number(volume),
          hemoglobin: Number(hemoglobin),
          bloodPressure,
          weight: Number(weight),
          pulse: Number(pulse),
          temperature: Number(temperature),
          examinationNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ أثناء تسجيل عملية التبرع المنزلي.");
      } else {
        alert("تم توثيق التبرع المنزلي بنجاح! تم منح المتبرع +100 نقطة وإصدار الشهادة الرقمية 🎉");
        onSuccess();
        onClose();
      }
    } catch (err) {
      setErrorMsg("حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">توثيق وتنسيق التبرع المنزلي الميداني</h3>
              <p className="text-xs text-slate-500 font-mono">حجز: {requestItem.bookingNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* QR Code Verification Section */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="w-8 h-8 text-red-400" />
            <div>
              <div className="text-xs font-bold">التحقق الرقمي من هوية المتبرع (QR)</div>
              <div className="text-[11px] text-slate-400 font-mono">
                {requestItem.donor?.user?.name || "المتبرع المسجل"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsQrVerified(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              isQrVerified
                ? "bg-emerald-500 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {isQrVerified ? "✓ تم مسح الرمز وتأكيد الهوية" : "مسح رمز QR"}
          </button>
        </div>

        {/* On-Site Medical Screening Form */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-red-600" />
            <span>نتائج الفحص الطبي الميداني قبل التبرع:</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نسبة الهيموجلوبين (g/dL) *</label>
              <input
                type="text"
                value={hemoglobin}
                onChange={(e) => setHemoglobin(e.target.value)}
                placeholder="13.5 - 17.5"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ضغط الدم (mmHg) *</label>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                placeholder="120/80"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">حجم الدم المجمع (مل) *</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="450"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">الوزن (كجم)</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نبض القلب (bpm)</label>
              <input
                type="text"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="75"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">درجة الحرارة (°C)</label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="36.6"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات الفحص الطبي الميداني</label>
            <textarea
              value={examinationNotes}
              onChange={(e) => setExaminationNotes(e.target.value)}
              placeholder="تم سحب العينة بنجاح، حالة المتبرع مستقرة وممتازة..."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 outline-none focus:border-red-500 text-xs font-medium"
            />
          </div>
        </div>

        {/* Reward Summary Preview */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>مكافأة المتبرع الفورية:</span>
          </span>
          <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-0.5 rounded-lg">
            +100 نقطة + شهادة شكر رقمية
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
          >
            إلغاء
          </button>
          <button
            disabled={loading}
            onClick={handleRecordDonation}
            className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl shadow-md shadow-red-200 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <span className="spinner border-t-white w-4 h-4 border-2 rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>توثيق عملية التبرع وإصدار الشهادة</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
