"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import Link from "next/link";

/**
 * Emergency Push Notification Engine
 * ────────────────────────────────────
 * 1. Requests notification permission on first open
 * 2. Registers Service Worker and sends START_EMERGENCY_POLLING message
 *    → SW polls /api/notifications every 30s IN THE BACKGROUND
 *    → SW shows native phone notification + vibration when emergency found
 * 3. Listens for SW → page messages (EMERGENCY_ALERT) to show in-app toast
 * 4. Registers Periodic Background Sync for Chrome Android (optional)
 * 5. Vibrates phone directly via navigator.vibrate() when app is foreground
 */
export default function PushNotificationPrompt() {
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ title, message });
    // Vibrate phone directly (foreground)
    try { navigator.vibrate?.([400, 150, 400, 150, 700]); } catch (_) {}
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 8000);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const init = async () => {
      // 1. Request notification permission
      if ("Notification" in window && Notification.permission === "default") {
        try { await Notification.requestPermission(); } catch (_) {}
      }

      if (!("serviceWorker" in navigator)) return;

      // 2. Register SW
      try {
        await navigator.serviceWorker.register("/sw.js");
      } catch (_) {}

      // 3. Get the active SW and tell it to START POLLING
      try {
        const reg = await navigator.serviceWorker.ready;

        // Send START message to SW
        if (reg.active) {
          reg.active.postMessage({ type: "START_EMERGENCY_POLLING" });
        }

        // 4. Register Periodic Background Sync (Chrome Android 80+)
        if ("periodicSync" in reg) {
          try {
            const status = await navigator.permissions.query({
              name: "periodic-background-sync" as PermissionName,
            });
            if (status.state === "granted") {
              await (reg as any).periodicSync.register("emergency-check", {
                minInterval: 30 * 1000, // 30 seconds
              });
            }
          } catch (_) {}
        }
      } catch (_) {}

      // 5. Listen for messages FROM the SW (EMERGENCY_ALERT → show in-app toast)
      const handleSWMessage = (event: MessageEvent) => {
        if (event.data?.type === "EMERGENCY_ALERT") {
          showToast(event.data.title || "🚨 نداء طوارئ!", event.data.message || "");
        }
      };
      navigator.serviceWorker.addEventListener("message", handleSWMessage);

      return () => {
        navigator.serviceWorker.removeEventListener("message", handleSWMessage);
      };
    };

    init();
  }, []);

  // ── In-app Emergency Toast ──────────────────────────────────
  if (!toast) return null;

  return (
    <div
      className="fixed top-20 right-0 left-0 mx-4 z-[9999] animate-fade-in-up"
      style={{ maxWidth: 420, margin: "0 auto" }}
    >
      <div
        className="rounded-2xl p-4 flex items-start gap-3 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #1a0a0a, #2d0000)",
          border: "1.5px solid rgba(239,68,68,0.5)",
          boxShadow: "0 8px 32px rgba(220,38,38,0.4)",
        }}
      >
        {/* Pulsing icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-glow"
          style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)" }}
        >
          <ShieldAlert className="w-5 h-5 text-red-400" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-white font-black text-sm leading-none mb-1">{toast.title}</p>
          <p className="text-red-200 text-xs leading-relaxed line-clamp-2">{toast.message}</p>
          <Link
            href="/dashboard/emergency"
            onClick={() => setToast(null)}
            className="inline-flex items-center gap-1 mt-2 text-xs font-black text-red-400 hover:text-red-300"
          >
            عرض النداء ←
          </Link>
        </div>

        <button
          onClick={() => setToast(null)}
          className="text-red-500 hover:text-red-300 transition-colors flex-shrink-0 mt-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
