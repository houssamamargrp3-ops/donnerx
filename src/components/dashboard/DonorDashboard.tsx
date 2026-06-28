import { prisma } from "@/lib/prisma";
import {
  Droplet,
  CalendarDays,
  Award,
  Heart,
  QrCode,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

async function getDonorStats(userId: string) {
  const donor = await prisma.donor.findUnique({
    where: { userId },
    include: {
      appointments: {
        where: { scheduledAt: { gte: new Date() } },
        orderBy: { scheduledAt: "asc" },
        take: 1,
        include: { center: true }
      }
    }
  });

  return donor;
}

export default async function DonorDashboard({ userId }: { userId: string }) {
  const donor = await getDonorStats(userId);

  if (!donor) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">ملف المتبرع غير مكتمل</h2>
        <p className="text-slate-400 mb-6">يرجى إكمال بياناتك الطبية للبدء في التبرع.</p>
        <Link href="/donor/setup" className="btn-primary inline-block">
          إكمال الملف الشخصي
        </Link>
      </div>
    );
  }

  const nextAppointment = donor.appointments[0];
  const isEligible = donor.eligibilityStatus === "ELIGIBLE" || !donor.lastDonationDate;

  return (
    <>
      {/* Donor Quick Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blood Type Card */}
        <div className="stats-card relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">فصيلة الدم</p>
              <h2 className="text-4xl font-black text-white">{donor.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}</h2>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 10px 25px rgba(220,38,38,0.4)" }}>
              <Droplet className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Points & Level */}
        <div className="stats-card relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">النقاط (مستوى {donor.level})</p>
              <h2 className="text-4xl font-black text-white">{donor.points}</h2>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #f59e0b, #b45309)", boxShadow: "0 10px 25px rgba(245,158,11,0.4)" }}>
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Total Donations */}
        <div className="stats-card relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1">إجمالي التبرعات</p>
              <h2 className="text-4xl font-black text-white">{donor.totalDonations}</h2>
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                 style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: "0 10px 25px rgba(59,130,246,0.4)" }}>
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Next Appointment or Book CTA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
            
            {nextAppointment ? (
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 mb-4">
                  <Clock className="w-3 h-3" />
                  موعد قادم
                </div>
                <h2 className="text-2xl font-bold text-white mb-6">لديك موعد تبرع مجدول</h2>
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-white">{nextAppointment.center.name}</h3>
                      <p className="text-slate-400 text-sm mt-1">{nextAppointment.center.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold text-lg">
                        {new Intl.DateTimeFormat("ar-SA", { weekday: "long", day: "numeric", month: "long" }).format(nextAppointment.scheduledAt)}
                      </p>
                      <p className="text-slate-300 text-sm mt-1">
                        الساعة {new Intl.DateTimeFormat("ar-SA", { hour: "2-digit", minute: "2-digit" }).format(nextAppointment.scheduledAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-sm text-slate-500">حالة الموعد: {nextAppointment.status === "CONFIRMED" ? "مؤكد" : "قيد الانتظار"}</span>
                    <button className="text-sm font-semibold text-red-400 hover:text-red-300">إلغاء أو تعديل الموعد</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 text-center py-6">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">لا توجد مواعيد قادمة</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                  تبرعك يمكن أن ينقذ 3 أرواح. احجز موعدك الآن في أقرب مركز تبرع.
                </p>
                <Link
                  href="/dashboard/appointments/new"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold transition-all hover:-translate-y-1"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                    boxShadow: "0 8px 25px rgba(220,38,38,0.3)",
                  }}
                >
                  حجز موعد تبرع
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Eligibility Status */}
        <div className="stats-card h-full">
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            حالة الأهلية
          </h2>
          
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 ${isEligible ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isEligible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {isEligible ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {isEligible ? "مؤهل للتبرع" : "غير مؤهل حالياً"}
            </h3>
            {!isEligible && donor.nextEligibleDate && (
              <p className="text-slate-400 text-sm">
                يمكنك التبرع بعد: {new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long" }).format(donor.nextEligibleDate)}
              </p>
            )}
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">آخر تبرع</span>
              <span className="text-white text-sm font-medium">
                {donor.lastDonationDate 
                  ? new Intl.DateTimeFormat("ar-SA").format(donor.lastDonationDate)
                  : "لا يوجد"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">الرقم المرجعي</span>
              <span className="text-white text-sm font-mono bg-slate-800 px-2 py-0.5 rounded">
                D-{donor.id.substring(donor.id.length - 6).toUpperCase()}
              </span>
            </div>
          </div>
          
          <button className="w-full mt-4 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
            <QrCode className="w-4 h-4" />
            إظهار بطاقة المتبرع (QR)
          </button>
        </div>
      </div>
    </>
  );
}
