import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FileText, Download, Activity, CheckCircle, Clock, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PrintReportButton from "@/components/dashboard/PrintReportButton";

export const metadata = { title: "التقارير الطبية" };

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const donor = await prisma.donor.findUnique({
    where: { userId: session.user.id },
    include: {
      donations: {
        orderBy: { donatedAt: "desc" },
        take: 1
      },
      appointments: {
        where: { status: "PENDING" },
        orderBy: { scheduledAt: "asc" },
        take: 1
      }
    }
  });

  if (!donor) {
    return (
      <div className="labo-card p-12 text-center text-slate-500 max-w-2xl mx-auto mt-10">
        <h2 className="text-xl font-bold text-slate-800 mb-2">الملف الطبي غير مكتمل</h2>
        <p>الرجاء إكمال ملفك الطبي أولاً لعرض تقاريرك الطبية.</p>
        <Link href="/dashboard/setup" className="labo-btn-primary mt-4 inline-block">
          إكمال الملف الطبي
        </Link>
      </div>
    );
  }

  const formatBloodType = (type: string) => {
    return type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  const hasDonated = donor.donations && donor.donations.length > 0;
  const hasAppointment = donor.appointments && donor.appointments.length > 0;

  return (
    <div className="space-y-6 mt-4">
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            التقارير الطبية والرسمية
          </h1>
          <p className="text-slate-500 text-sm mt-1">تحميل واستعراض تقاريرك الطبية وشهادات التبرع المعتمدة.</p>
        </div>
        <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
          العودة <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Report 1: Eligibility Certificate */}
        <div className="labo-card p-6 border-t-4 border-t-emerald-500 flex flex-col h-full relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500 opacity-5 rounded-full blur-3xl -translate-y-10 -translate-x-10 group-hover:opacity-10 transition-all"></div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">شهادة الفحص السريري</h3>
            <p className="text-slate-500 text-sm mb-4">
              شهادة رسمية تفيد بحالتك الصحية الحالية وقابليتك للتبرع بالدم بناءً على آخر فحص.
            </p>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-4 text-xs text-slate-600">
              <div className="flex justify-between mb-1">
                <span>تاريخ التحديث:</span>
                <span className="font-bold">{new Intl.DateTimeFormat('ar-SA').format(donor.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>الحالة:</span>
                <span className={`font-bold ${donor.eligibilityStatus === 'ELIGIBLE' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {donor.eligibilityStatus === 'ELIGIBLE' ? 'مؤهل للتبرع' : 'غير مؤهل حالياً'}
                </span>
              </div>
            </div>
          </div>
          <PrintReportButton label="طباعة الشهادة (PDF)" />
        </div>

        {/* Report 2: Blood Type Card */}
        <div className="labo-card p-6 border-t-4 border-t-red-600 flex flex-col h-full relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 left-0 w-32 h-32 bg-red-600 opacity-5 rounded-full blur-3xl -translate-y-10 -translate-x-10 group-hover:opacity-10 transition-all"></div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">بطاقة فصيلة الدم</h3>
            <p className="text-slate-500 text-sm mb-4">
              بطاقة طبية إلكترونية تحتوي على فصيلة دمك المعتمدة لاستخدامها في الحالات الطارئة.
            </p>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-4 text-xs text-slate-600">
              <div className="flex justify-between mb-1">
                <span>الفصيلة المعتمدة:</span>
                <span className="font-bold text-red-600 text-base">{formatBloodType(donor.bloodType)}</span>
              </div>
            </div>
          </div>
          <PrintReportButton label="طباعة البطاقة" />
        </div>

        {/* Report 3: Donation Certificate */}
        <div className="labo-card p-6 border-t-4 border-t-blue-600 flex flex-col h-full relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600 opacity-5 rounded-full blur-3xl -translate-y-10 -translate-x-10 group-hover:opacity-10 transition-all"></div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">شهادة تبرع شرفية</h3>
            <p className="text-slate-500 text-sm mb-4">
              شهادة رسمية تثبت إسهامك في إنقاذ الأرواح من خلال تبرعاتك السابقة.
            </p>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-4 text-xs text-slate-600">
              {hasDonated ? (
                <>
                  <div className="flex justify-between mb-1">
                    <span>إجمالي التبرعات:</span>
                    <span className="font-bold">{donor.totalDonations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاريخ آخر تبرع:</span>
                    <span className="font-bold">{new Intl.DateTimeFormat('ar-SA').format(donor.donations[0].donatedAt)}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-400 py-1">
                  لم تقم بأي تبرع بعد لإصدار هذه الشهادة.
                </div>
              )}
            </div>
          </div>
          {hasDonated ? (
            <Link href={`/dashboard/donations/${donor.donations[0].id}/certificate`} className="w-full">
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors rounded-b-xl border-t border-blue-100">
                <CheckCircle className="w-4 h-4" /> عرض وطباعة الشهادة
              </button>
            </Link>
          ) : (
            <PrintReportButton disabled={true} label="غير متاح حالياً" />
          )}
        </div>
        
        {/* Report 4: Appointment Confirmation */}
        <div className="labo-card p-6 border-t-4 border-t-purple-600 flex flex-col h-full relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600 opacity-5 rounded-full blur-3xl -translate-y-10 -translate-x-10 group-hover:opacity-10 transition-all"></div>
          <div className="flex-1">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">استدعاء / تأكيد موعد</h3>
            <p className="text-slate-500 text-sm mb-4">
              وثيقة تأكيد موعدك القادم للتبرع بالدم، يمكن استخدامها كعذر طبي أو إذن خروج.
            </p>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-4 text-xs text-slate-600">
              {hasAppointment ? (
                <>
                  <div className="flex justify-between mb-1">
                    <span>تاريخ الموعد:</span>
                    <span className="font-bold" dir="ltr">{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(donor.appointments[0].scheduledAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>وقت الحضور:</span>
                    <span className="font-bold">{new Intl.DateTimeFormat('ar-SA', { hour: '2-digit', minute: '2-digit' }).format(donor.appointments[0].scheduledAt)}</span>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-400 py-1">
                  لا يوجد موعد قادم حالياً.
                </div>
              )}
            </div>
          </div>
          <PrintReportButton disabled={!hasAppointment} label={hasAppointment ? "طباعة الاستدعاء" : "غير متاح حالياً"} />
        </div>

      </div>
    </div>
  );
}
