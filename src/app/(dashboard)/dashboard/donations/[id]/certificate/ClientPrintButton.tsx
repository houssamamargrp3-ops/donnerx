"use client";

import { Printer, Download, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ClientPrintButton({ donorName = "donor" }: { donorName?: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Dynamic imports to prevent SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById("certificate-area");
      if (!element) {
        throw new Error("Element not found");
      }

      // Hide borders and decorations that might break html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      
      // Calculate dimensions for landscape A4
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, (pdfHeight - imgHeight) / 2, imgWidth, imgHeight);
      
      const fileName = `Donation_Certificate_${donorName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
      
    } catch (error: any) {
      console.error("Failed to generate PDF:", error);
      alert("حدث خطأ أثناء إنشاء ملف PDF: " + (error.message || ""));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
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
  );
}
