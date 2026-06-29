"use client";

import { Printer } from "lucide-react";

export default function ClientPrintButton() {
  return (
    <button onClick={() => window.print()} className="labo-btn-primary flex items-center gap-2">
      <Printer className="w-5 h-5" />
      طباعة الشهادة (PDF)
    </button>
  );
}
