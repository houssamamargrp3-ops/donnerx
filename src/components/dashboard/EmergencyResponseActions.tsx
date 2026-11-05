"use client";

import { useState } from "react";
import { CheckCircle, XCircle, MapPin, Loader2, Droplet, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  PENDING:   { label: "في الطريق 🚗",    color: "bg-amber-50 text-amber-800 border-amber-300", desc: "المتبرع استجاب وهو في طريقه" },
  ARRIVED:   { label: "وصل للمستشفى 📍", color: "bg-blue-50 text-blue-800 border-blue-300",   desc: "المتبرع متواجد حالياً في المركز/المستشفى" },
  CONFIRMED: { label: "تم التبرع والتسجيل ✅", color: "bg-emerald-50 text-emerald-800 border-emerald-300", desc: "تم سحب الدم بنجاح وصرف النقاط وإصدار الشهادة" },
  REJECTED:  { label: "مرفوض طبياً ✗",   color: "bg-rose-50 text-rose-800 border-rose-300",   desc: "تم فحص المتبرع وتبين عدم أهليته الطبية للنداء" },
};

export default function EmergencyResponseActions({
  requestId,
  responseId,
  currentStatus,
  donorName,
}: {
  requestId: string;
  responseId: string;
  currentStatus: string;
  donorName?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [modalMode, setModalMode] = useState<"CONFIRM" | "REJECT" | null>(null);

  // Form states
  const [volumeMl, setVolumeMl] = useState("450");
  const [rejectionReason, setRejectionReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const updateStatus = async (newStatus: string, payload: any = {}) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/emergency/${requestId}/response-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId,
          status: newStatus,
          ...payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "حدث خطأ أثناء تحديث الحالة");
      } else {
        setStatus(newStatus);
        setModalMode(null);
        router.refresh();
      }
    } catch (_) {
      setErrorMsg("خطأ في الاتصال بالشبكة");
    } finally {
      setLoading(false);
    }
  };

  const st = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${st.color}`}>
          {st.label}
        </span>

        {/* Action button 1: Mark Arrived */}
        {status === "PENDING" && (
          <button
            onClick={() => updateStatus("ARRIVED")}
            disabled={loading}
            title="تأكيد وصول المتبرع"
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
            <span>وصل 📍</span>
          </button>
        )}

        {/* Action button 2: Confirm donation & record */}
        {(status === "PENDING" || status === "ARRIVED") && (
          <button
            onClick={() => setModalMode("CONFIRM")}
            disabled={loading}
            title="توثيق وقبول التبرع"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 disabled:opacity-50"
          >
            <CheckCircle className="w-3 h-3" />
            <span>توثيق التبرع 🩸</span>
          </button>
        )}

        {/* Action button 3: Reject donor */}
        {(status === "PENDING" || status === "ARRIVED") && (
          <button
            onClick={() => setModalMode("REJECT")}
            disabled={loading}
            title="رفض المتبرع لسبب طبي أو تنظيمي"
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
          >
            <XCircle className="w-3 h-3" />
            <span>رفض ✗</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <p className="text-[10px] text-red-600 font-bold">{errorMsg}</p>
      )}

      {/* ─── MODAL: Confirm Donation ─── */}
      {modalMode === "CONFIRM" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4 text-right">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Droplet className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">تأكيد وقبول تبرع المتبرع</h4>
                  <p className="text-xs text-slate-500 font-medium">{donorName || "المتبرع"}</p>
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              سيتم تسجيل التبرع رسمياً في النظام، وزيادة رصيد مخزون الدم في المركز، وإصدار شهادة شكر رقمية وصرف +150 نقطة للمتبرع.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">حجم كيس الدم المسحوب (مل):</label>
              <input
                type="number"
                value={volumeMl}
                onChange={(e) => setVolumeMl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <button
                onClick={() => setModalMode(null)}
                className="w-1/3 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                onClick={() => updateStatus("CONFIRMED", { volumeMl })}
                disabled={loading}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>تأكيد التبرع والتسجيل</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: Reject Donor ─── */}
      {modalMode === "REJECT" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 space-y-4 text-right">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">رفض المتبرع (عدم اللياقة الطبية)</h4>
                  <p className="text-xs text-slate-500 font-medium">{donorName || "المتبرع"}</p>
                </div>
              </div>
              <button
                onClick={() => setModalMode(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              سيتم تسجيل حالة الرفض في الإحصائيات العامة للمرفوضين وتحديث حالة المتبرع كغير مؤهل مؤقتاً لحمايته طبياً.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">سبب الرفض الطبي / التنظيمي:</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="مثال: انخفاض نسبة الهيموجلوبين، ضغط دم غير ملائم، تناول أدوية مانعة للتبرع..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t">
              <button
                onClick={() => setModalMode(null)}
                className="w-1/3 bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-xs hover:bg-slate-200"
              >
                إلغاء
              </button>
              <button
                onClick={() => updateStatus("REJECTED", { rejectionReason })}
                disabled={loading}
                className="w-2/3 bg-rose-600 hover:bg-rose-700 text-white font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>تسجيل رفض المتبرع</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
