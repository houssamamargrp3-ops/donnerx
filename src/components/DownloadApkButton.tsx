"use client";

import { Download } from "lucide-react";
import { useState } from "react";

interface DownloadApkButtonProps {
  className?: string;
  label?: string;
  variant?: "primary" | "secondary";
}

export default function DownloadApkButton({
  className,
  label = "تحميل التطبيق للاندرويد (APK)",
  variant = "secondary",
}: DownloadApkButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    setProgress(0);

    try {
      const response = await fetch("/api/download-apk", {
        cache: "no-store",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });

      if (!response.ok) throw new Error("HTTP " + response.status);

      const contentLength = response.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength) : 0;
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const chunks: Uint8Array[] = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total > 0) setProgress(Math.round((received / total) * 100));
      }

      const blob = new Blob(chunks, { type: "application/vnd.android.package-archive" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "HayatLink.apk";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setProgress(100);
    } catch (err) {
      console.error("Download error:", err);
      window.location.href = "/api/download-apk";
    } finally {
      setTimeout(() => { setDownloading(false); setProgress(0); }, 2000);
    }
  };

  const isPrimary = variant === "primary";

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={
        className || (isPrimary
          ? "hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/10 transition-all disabled:opacity-70 cursor-pointer"
          : "px-6 py-3.5 rounded-xl text-slate-200 hover:text-white font-bold text-sm bg-white/10 hover:bg-white/15 border border-white/15 backdrop-blur-sm transition-all flex items-center gap-2 disabled:opacity-70 cursor-pointer")
      }
      title={isPrimary ? "تحميل تطبيق أندرويد المستقل" : undefined}
    >
      <Download className={"w-4 h-4 text-red-400 " + (downloading ? "animate-bounce" : "")} />
      <span>
        {downloading ? (progress > 0 ? "جاري التحميل " + progress + "%..." : "جاري التحميل...") : label}
      </span>
    </button>
  );
}
