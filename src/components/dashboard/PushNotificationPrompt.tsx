"use client";

import { useEffect } from "react";

/**
 * Implicit Native Phone Push Registration
 * Renders NOTHING (returns null).
 * Automatically requests native browser/mobile notification permission and registers Service Worker push handlers.
 * Notifications will pop up ONLY in the mobile phone's native notification bar & lock screen.
 */
export default function PushNotificationPrompt() {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    // Auto-request notification permission in background if not denied
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    // Ensure Service Worker is registered
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        // Ready for native system push notifications
      }).catch(() => {});
    }
  }, []);

  return null;
}
