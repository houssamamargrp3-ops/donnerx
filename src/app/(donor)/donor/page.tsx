import { Heart, Activity, Calendar, ShieldCheck, Droplet } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";

export const metadata = { title: "بوابة المتبرع" };

export default async function DonorPortalPage() {
  const session = await auth();
  
  return (
    <div className="min-h-screen auth-bg p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-card p-6 border border-white/10">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-400" />
              مرحباً بك، {session?.user?.name}
            </h1>
            <p className="text-slate-400 mt-1">هنا يمكنك متابعة سجل تبرعاتك ومواعيدك القادمة.</p>
          </div>
          <Link href="/api/auth/signout" className="px-5 py-2 rounded-xl text-slate-300 hover:text-white transition-colors border border-white/10 hover:bg-white/5">
            تسجيل الخروج
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stats-card border border-white/5 bg-white/2">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">عدد التبرعات</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
            <div className="text-sm text-slate-500 border-t border-white/5 pt-3">
              لم تقم بأي تبرع حتى الآن
            </div>
          </div>

          <div className="stats-card border border-white/5 bg-white/2">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">حالة الأهلية</p>
                <p className="text-xl font-bold text-white">قيد الفحص</p>
              </div>
            </div>
            <div className="text-sm text-slate-500 border-t border-white/5 pt-3">
              يرجى حجز موعد لفحص الأهلية
            </div>
          </div>

          <div className="stats-card border border-white/5 bg-white/2">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">النقاط</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
            <div className="text-sm text-slate-500 border-t border-white/5 pt-3">
              المستوى 1
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="glass-card p-12 text-center border border-white/10 mt-8">
          <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">جاري بناء باقي الميزات</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            ستتمكن قريباً من حجز المواعيد، الإجابة على استبيان الأهلية، واستعراض شهادات التبرع من خلال هذه البوابة.
          </p>
        </div>
      </div>
    </div>
  );
}
