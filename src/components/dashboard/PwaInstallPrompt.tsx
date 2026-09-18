"use client";

import { useEffect, useState } from "react";
import { DownloadCloud, Smartphone } from "lucide-react";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    if (typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches) {
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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("لتثبيت تطبيق HayatLink:\n1. افتح قائمة المتصفح (⋮) في أعلى الصفحة\n2. اضغط على 'إضافة إلى الشاشة الرئيسية' أو 'تثبيت التطبيق'");
    }
  };

  if (isInstalled) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-700 to-emerald-800 text-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
            تطبيق HayatLink - حياة لينك 📱
          </h3>
          <p className="text-xs text-red-100 mt-0.5">ثبّت التطبيق الرسمي على هاتفك بضغطة زر وبدون متاجر</p>
        </div>
      </div>
      <button
        onClick={handleInstallClick}
        className="bg-white text-red-700 hover:bg-red-50 px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
      >
        <DownloadCloud className="w-4 h-4 text-red-600" />
        <span>تثبيت التطبيق على الهاتف</span>
      </button>
    </div>
  );
}
