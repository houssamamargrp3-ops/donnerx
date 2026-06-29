"use client";

import { Download } from "lucide-react";

export default function PrintReportButton({ label, disabled = false }: { label: string, disabled?: boolean }) {
  const handlePrint = () => {
    // In a full application, this might trigger a PDF generation API.
    // For now, we trigger the browser's print dialog, relying on @media print CSS to format it.
    window.print();
  };

  return (
    <button 
      onClick={handlePrint}
      disabled={disabled}
      className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors mt-auto disabled:opacity-50 disabled:cursor-not-allowed print:hidden"
    >
      <Download className="w-4 h-4" /> {label}
    </button>
  );
}
