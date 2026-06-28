export const metadata = { title: 'الملف الشخصي' };
import { User } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-red-400" />
          الملف الشخصي
        </h1>
        <p className="text-slate-400 text-sm mt-1">Task 12 — قيد التطوير</p>
      </div>
      <div className="glass-card p-16 text-center">
        <User className="w-20 h-20 text-slate-700 mx-auto mb-6" />
        <h2 className="text-xl font-bold text-white mb-3">الملف الشخصي</h2>
        <p className="text-slate-400 max-w-md mx-auto">هذه الميزة قيد التطوير وستكون متاحة قريباً ضمن منصة DONNER.X</p>
        <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full text-xs font-semibold text-yellow-300" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
          🔧 قيد التطوير
        </div>
      </div>
    </div>
  );
}
