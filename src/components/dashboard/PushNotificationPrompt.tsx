"use client";

import { useState, useEffect } from "react";
import { Bell, Smartphone, Check, Sparkles, AlertCircle, MessageSquare } from "lucide-react";

export default function PushNotificationPrompt() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("متصفحك الحالي لا يدعم إشعارات النظام المباشرة.");
      return;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);

      if (res === "granted") {
        sendTestNotification();
      }
    } catch (e) {
      console.error("Permission error:", e);
    }
  };

  const sendTestNotification = async () => {
    setIsTesting(true);
    setTestSuccess(false);

    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if (reg && reg.showNotification) {
          await reg.showNotification("DONNER.X 🩸 - إشعار تجريبي!", {
            body: "تم تفعيل إشعارات الهاتف الفورية بنجاح! ستتلقى نداءات الطوارئ والتذكيرات مثل تطبيق دولينجو.",
            icon: "/icon-192x192.png",
            badge: "/icon-192x192.png",
            vibrate: [200, 100, 200, 100, 200],
            tag: "duolingo-test-alert",
          } as any);
          setTestSuccess(true);
          setTimeout(() => setTestSuccess(false), 4000);
          setIsTesting(false);
          return;
        }
      }

      // Fallback standard Notification
      if (Notification.permission === "granted") {
        new Notification("DONNER.X 🩸 - إشعار تجريبي!", {
          body: "تم تفعيل إشعارات الهاتف الفورية بنجاح! ستتلقى نداءات الطوارئ والتذكيرات مباشرة على شاشتك.",
          icon: "/icon-192x192.png",
        });
        setTestSuccess(true);
        setTimeout(() => setTestSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Test notification failed:", err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-indigo-800 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden my-4">
      <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-16 -mt-16 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Bell className="w-6 h-6 text-yellow-300 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base font-black flex items-center gap-2">
              <span>إشعارات الهاتف والرسائل النصية SMS 📱</span>
              <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                مثل دولينجو ⚡
              </span>
            </h3>
            <p className="text-xs text-red-100 mt-1 leading-relaxed max-w-xl">
              تلقي نداءات الطوارئ العاجلة وتذكيرات الحملات قبل 12 ساعة كرسالة نصية SMS وإشعار يظهر فوراً على شاشة قفل الهاتف وبصوت تنبيه مخصص.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {permission === "granted" ? (
            <button
              onClick={sendTestNotification}
              disabled={isTesting}
              className="bg-white hover:bg-slate-100 text-red-700 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isTesting ? (
                <Sparkles className="w-4 h-4 animate-spin text-red-600" />
              ) : (
                <Smartphone className="w-4 h-4 text-red-600" />
              )}
              تجربة إشعار الهاتف 🔔
            </button>
          ) : (
            <button
              onClick={requestPermission}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Bell className="w-4 h-4" />
              تفعيل الإشعارات الآن 🚀
            </button>
          )}
        </div>
      </div>

      {testSuccess && (
        <div className="mt-3 bg-white/20 border border-white/30 text-white font-bold text-xs p-2.5 rounded-xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-300" />
          تم إرسال إشعار التجربة بنجاح إلى شاشة هاتفك! تحقق من أعلى الشاشة 📱
        </div>
      )}
    </div>
  );
}
