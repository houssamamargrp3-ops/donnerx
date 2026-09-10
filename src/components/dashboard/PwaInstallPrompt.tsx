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

  if (!isInstallable || isInstalled) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between mb-6 animate-fade-in-up">
      <div>
        <h3 className="font-bold text-lg flex items-center gap-2">
          <DownloadCloud className="w-5 h-5" />
          حمّل تطبيق المتبرع
        </h3>
        <p className="text-xs text-red-100 mt-1">قم بتثبيت التطبيق على هاتفك لتجربة أسرع وأفضل</p>
      </div>
      <button
        onClick={handleInstallClick}
        className="bg-white text-red-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-red-50 transition-colors"
      >
        تثبيت
      </button>
    </div>
  );
}
