"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, X, CheckCircle } from "lucide-react";

/**
 * Notification Permission Banner
 * Shows a visible button for the user to enable notifications.
 * Browser security requires a user gesture (tap) to request permission.
 * Hides automatically once permission is granted or denied.
 */
export default function NotificationPermissionBanner() {
  const [permState, setPermState] = useState<"loading" | "default" | "granted" | "denied">("loading");
  const [requesting, setRequesting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setPermState("denied"); // not supported → hide banner
      return;
    }
    setPermState(Notification.permission as any);
  }, []);

  const requestPermission = async () => {
    setRequesting(true);
    try {
      const result = await Notification.requestPermission();
      setPermState(result as any);

      if (result === "granted") {
        // Register SW + start polling immediately
        if ("serviceWorker" in navigator) {
          try {
            const reg = await navigator.serviceWorker.ready;
            reg.active?.postMessage({ type: "START_EMERGENCY_POLLING" });
          } catch (_) {}
        }
        // Vibrate as confirmation
        try { navigator.vibrate?.([100, 50, 100]); } catch (_) {}
      }
    } catch (_) {
      setPermState("denied");
    } finally {
      setRequesting(false);
    }
  };

  // Hide if: still loading, already granted, denied, or manually dismissed
  if (permState === "loading" || permState === "granted" || dismissed) return null;

  if (permState === "denied") {
    return (
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "rgba(100,116,139,0.08)", border: "1px solid rgba(100,116,139,0.2)" }}
      >
        <BellOff className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-slate-600 font-bold text-sm">الإشعارات معطّلة</p>
          <p className="text-slate-400 text-xs mt-0.5">
            فعّل إشعارات الهاتف من إعدادات المتصفح لتلقي نداءات الطوارئ فوراً.
          </p>
        </div>
      </div>
    );
  }

  // permState === "default" → show the activation banner
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a, #1a0a14)",
        border: "1.5px solid rgba(220,38,38,0.3)",
        boxShadow: "0 4px 20px rgba(220,38,38,0.12)",
      }}
    >
      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 left-3 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}
        >
          <Bell className="w-5 h-5 text-red-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-black text-sm">فعّل إشعارات الطوارئ 🔔</p>
          <p className="text-slate-400 text-xs mt-0.5 mb-3 leading-relaxed">
            استقبل نداءات الطوارئ العاجلة مباشرة على هاتفك مع اهتزاز حتى لو كان التطبيق مغلقاً.
          </p>
          <button
            onClick={requestPermission}
            disabled={requesting}
            className="px-4 py-2 rounded-xl text-white font-black text-xs transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              boxShadow: "0 4px 14px rgba(220,38,38,0.4)",
            }}
          >
            {requesting ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                جاري التفعيل...
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                تفعيل إشعارات الطوارئ
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
