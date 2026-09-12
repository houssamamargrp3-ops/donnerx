"use client";

import { useEffect, useState } from "react";
import { WifiOff, CheckCircle2, X } from "lucide-react";

export default function PwaManager() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for offline support
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // Check for updates
            reg.onupdatefound = () => {
              const installing = reg.installing;
              if (installing) {
                installing.onstatechange = () => {
                  if (installing.state === "installed" && navigator.serviceWorker.controller) {
                    console.log("DONNER.X PWA: New content available for offline use.");
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.error("DONNER.X PWA: Service Worker registration failed:", err);
          });
      });
    }

    // 2. Track Online / Offline connectivity
    const handleOnline = () => {
      setIsOffline(false);
      setDismissed(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setDismissed(false);
      setShowReconnected(false);
    };

    // Initial check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (dismissed) return null;

  return (
    <>
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-amber-500 text-slate-950 px-4 py-2 shadow-md flex items-center justify-between text-xs md:text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mx-auto">
            <WifiOff className="w-4 h-4 text-slate-950 animate-pulse" />
            <span>أنت في وضع عدم الاتصال (Offline) — يمكنك تصفح بياناتك وبطاقتك الصحية المحفوظة</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-black/10 rounded-lg transition-colors cursor-pointer"
            title="إخفاء التنبيه"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reconnected Toast */}
      {showReconnected && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs md:text-sm font-bold animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>تمت استعادة الاتصال بالإنترنت بنجاح ✅</span>
        </div>
      )}
    </>
  );
}
