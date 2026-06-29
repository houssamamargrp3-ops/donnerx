export const metadata = { title: 'الإعدادات' };
import { Settings, Building2 } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';

export default async function SettingsPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  const isAdmin = role === 'SUPER_ADMIN' || role === 'ADMIN';

  return (
    <div className="space-y-6 mt-4 animate-fade-in-up">
      <div className="labo-page-title mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-red-600" />
            الإعدادات العامة
          </h1>
          <p className="text-slate-500 text-sm mt-1">تخصيص النظام وإدارة الموارد</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {isAdmin && (
          <Link href="/dashboard/settings/centers" className="labo-card p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors group cursor-pointer">
            <Building2 className="w-16 h-16 text-blue-100 group-hover:text-blue-500 mb-4 transition-colors" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">إدارة المراكز الطبية</h2>
            <p className="text-slate-500 text-sm">أضف وتحكم في المستشفيات ومراكز التبرع في النظام.</p>
          </Link>
        )}

        <div className="labo-card p-6 flex flex-col items-center justify-center text-center opacity-70">
          <Settings className="w-16 h-16 text-slate-200 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">إعدادات النظام (قيد التطوير)</h2>
          <p className="text-slate-500 text-sm">هذه الميزة ستكون متاحة قريباً.</p>
        </div>

      </div>
    </div>
  );
}

