"use client";

import { useEffect, useRef } from "react";

/**
 * Emergency Push Notification Engine
 * - Requests notification permission automatically
 * - Polls /api/notifications every 30s for unread EMERGENCY alerts
 * - Shows native phone notification via Service Worker when emergency found
 * - Works in Android WebView (APK) and all modern browsers
 * - Renders nothing visible
 */
export default function PushNotificationPrompt() {
  const shownIds = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const showNativeNotification = async (title: string, body: string, tag: string) => {
    try {
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, {
          body,
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
          vibrate: [300, 100, 300, 100, 500, 200, 500],
          tag,
          renotify: false,
          requireInteraction: true,
          data: { url: "/dashboard/emergency" },
          // @ts-ignore (actions not in all TS defs)
          actions: [
            { action: "open", title: "🚨 فتح نداء الطوارئ" },
            { action: "close", title: "إغلاق" },
          ],
        });
      } else {
        // Fallback: basic Notification API
        new Notification(title, {
          body,
          icon: "/icon-192x192.png",
          tag,
        });
      }
    } catch (_) {}
  };

  const checkNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      const emergencies = (data.notifications || []).filter(
        (n: any) => n.type === "EMERGENCY_REQUEST" && !n.isRead
      );

      for (const notif of emergencies) {
        if (shownIds.current.has(notif.id)) continue; // already shown this session
        shownIds.current.add(notif.id);
        await showNativeNotification(
          notif.title || "🚨 نداء طوارئ عاجل!",
          notif.message || "مستشفى بحاجة لمتبرعين — حضورك ينقذ حياة!",
          `emergency-${notif.id}`
        );
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Request permission
    const requestPermission = async () => {
      if (!("Notification" in window)) return;
      if (Notification.permission === "default") {
        try {
          await Notification.requestPermission();
        } catch (_) {}
      }
    };

    // 2. Register service worker
    const registerSW = async () => {
      if ("serviceWorker" in navigator) {
        try {
          await navigator.serviceWorker.register("/sw.js");
        } catch (_) {}
      }
    };

    requestPermission();
    registerSW();

    // 3. Start polling — immediately, then every 30s
    checkNotifications();
    intervalRef.current = setInterval(checkNotifications, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return null;
}
