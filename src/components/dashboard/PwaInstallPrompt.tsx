"use client";

import { useEffect, useState } from "react";
import { DownloadCloud } from "lucide-react";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between mb-6 animate-fade-in-up">
      <div>
        <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
          <DownloadCloud className="w-5 h-5" />
          تطبيق DONNER.X للأندرويد (APK)
        </h3>
        <p className="text-xs text-red-100 mt-1">حمل تطبيق أندرويد المستقل مباشرة بصيغة APK</p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="/donnerx.apk"
          download="DONNER.X.apk"
          className="bg-white text-red-700 px-4 py-2 rounded-xl text-xs md:text-sm font-bold shadow-sm hover:bg-red-50 transition-colors flex items-center gap-1"
        >
          <DownloadCloud className="w-4 h-4" />
          تحميل APK
        </a>
      </div>
    </div>
  );
}
