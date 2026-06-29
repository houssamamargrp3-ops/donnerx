"use client";

import { Printer, Download, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Script from "next/script";

export default function ClientPrintButton({ donorName = "donor" }: { donorName?: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const handleDownloadPDF = async () => {
    if (!isScriptLoaded || typeof window === 'undefined' || !(window as any).html2pdf) {
      alert("جاري تحميل مكتبة PDF، يرجى المحاولة بعد ثانية.");
      return;
    }

    setIsDownloading(true);
    try {
      const html2pdf = (window as any).html2pdf;
      const element = document.getElementById("certificate-area");
      
      if (element) {
        const opt = {
          margin: 0,
          filename: `Donation_Certificate_${donorName.replace(/\s+/g, '_')}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        };
        
        await html2pdf().set(opt).from(element).save();
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("حدث خطأ أثناء إنشاء ملف PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" 
        strategy="lazyOnload"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div className="flex gap-3">
        <button 
          onClick={handleDownloadPDF} 
          disabled={isDownloading}
          className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
        >
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          تحميل كملف PDF
        </button>
        <button onClick={() => window.print()} className="labo-btn-primary flex items-center gap-2">
          <Printer className="w-5 h-5" />
          طباعة مباشرة
        </button>
      </div>
    </>
  );
}
