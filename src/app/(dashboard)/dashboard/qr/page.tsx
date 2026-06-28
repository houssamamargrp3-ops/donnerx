export const metadata = { title: 'نظام QR' };
import { QrCode } from 'lucide-react';

export default function QrPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <QrCode className="w-6 h-6 text-red-400" />
          نظام QR
        </h1>
        <p className="text-slate-400 text-sm mt-1">Task 7 — قيد التطوير</p>
      </div>
      <div className="glass-card p-16 text-center">
        <QrCode className="w-20 h-20 text-slate-700 mx-auto mb-6" />
        <h2 className="text-xl font-bold text-white mb-3">نظام QR</h2>
        <p className="text-slate-400 max-w-md mx-auto">هذه الميزة قيد التطوير وستكون متاحة قريباً ضمن منصة DONNER.X</p>
        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-xs font-semibold text-yellow-300" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
          🔧 قيد التطوير
        </div>
      </div>
    </div>
  );
}
