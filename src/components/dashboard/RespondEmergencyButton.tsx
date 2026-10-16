"use client";

import { useState } from "react";
import { ShieldAlert, CheckCircle, Loader2, Phone } from "lucide-react";

export default function RespondEmergencyButton({
  requestId,
  donorId,
  contactPhone,
  hospitalName,
}: {
  requestId: string;
  donorId: string | null;
  contactPhone?: string | null;
  hospitalName?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  // No donor profile → redirect to setup
  if (!donorId) {
    return (
      <a
        href="/dashboard/setup"
        className="w-full py-3 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
          boxShadow: "0 6px 20px rgba(220,38,38,0.35)",
        }}
      >
        <ShieldAlert className="w-4 h-4" />
        أكمل ملفك أولاً للتبرع
      </a>
    );
  }

  // ── Success state — persists on screen ──────────────────────
  if (status === "done") {
    return (
      <div className="space-y-3">
        {/* Confirmation card — stays visible */}
        <div
          className="w-full rounded-xl p-4 flex items-start gap-3"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1.5px solid rgba(16,185,129,0.3)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.15)" }}
          >
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-emerald-700 font-black text-sm">✅ تم تسجيل استجابتك!</p>
            <p className="text-emerald-600 text-xs mt-0.5 leading-relaxed">
              شكراً بطلنا — توجّه إلى {hospitalName || "المستشفى"} في أقرب وقت ممكن.
            </p>
          </div>
        </div>

        {/* Direct call button if phone available */}
        {contactPhone && (
          <a
            href={`tel:${contactPhone}`}
            className="w-full py-2.5 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}
          >
            <Phone className="w-4 h-4" />
            اتصل بالمستشفى مباشرة: {contactPhone}
          </a>
        )}
      </div>
    );
  }

  // ── Main respond button ──────────────────────────────────────
  const handleRespond = async () => {
    setStatus("loading");
    try {
      const res = await fetch(`/api/emergency/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donorId }),
      });

      const data = await res.json();

      if (res.ok || data.error === "already_responded") {
        setStatus("done");
        // Vibrate as success confirmation
        try { navigator.vibrate?.([200, 100, 200, 100, 400]); } catch (_) {}
      } else {
        setStatus("error");
      }
    } catch (_) {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleRespond}
        disabled={status === "loading"}
        className="w-full py-3 rounded-xl text-white font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
        style={{
          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
          boxShadow: status === "loading" ? "none" : "0 6px 20px rgba(220,38,38,0.35)",
        }}
      >
        {status === "loading" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> جاري التسجيل...</>
        ) : (
          <><ShieldAlert className="w-4 h-4" /> أنا قادم للتبرع الآن 🩸</>
        )}
      </button>

      {status === "error" && (
        <p className="text-red-500 text-xs text-center font-bold bg-red-50 py-2 px-3 rounded-lg">
          ⚠️ حدث خطأ — تحقق من اتصالك وحاول مجدداً
        </p>
      )}
    </div>
  );
}
