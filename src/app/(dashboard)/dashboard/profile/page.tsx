import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FileText, User, Activity, AlertCircle, CheckCircle2, Calendar, Droplet, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "السجل الطبي" };

export default async function MedicalRecordPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const donor = await prisma.donor.findUnique({
    where: { userId: session.user.id },
    include: {
      donations: {
        orderBy: { donatedAt: "desc" },
        take: 3
      }
    }
  });

  if (!donor) {
    return (
      <div className="labo-card p-12 text-center max-w-2xl mx-auto mt-10">
        <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">السجل الطبي غير متوفر</h2>
        <p className="text-slate-500 mb-6">يبدو أنك لم تقم بإعداد ملفك الطبي بعد.</p>
        <Link href="/dashboard/setup" className="labo-btn-primary inline-block">
          إنشاء الملف الطبي
        </Link>
      </div>
    );
  }

  const isEligible = donor.eligibilityStatus === "ELIGIBLE";
  
  // Format Blood Type
  const formatBloodType = (type: string) => {
    return type.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="labo-page-title mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            السجل الطبي
          </h1>
          <p className="text-slate-500 text-sm mt-1">عرض وتحديث بياناتك الطبية وحالة أهليتك للتبرع بالدم.</p>
        </div>
        <Link href="/dashboard/eligibility" className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-md font-bold text-sm shadow-sm transition-colors flex items-center gap-2">
          <Activity className="w-4 h-4" />
          تحديث الفحص السريري
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Eligibility and Key Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="labo-card p-6 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-1.5 h-full ${isEligible ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              {isEligible ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
              حالة الأهلية للتبرع
            </h3>
            <div className={`p-4 rounded-lg flex items-start gap-4 ${isEligible ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
              <div className="flex-1">
                <h4 className={`text-lg font-bold mb-1 ${isEligible ? 'text-emerald-800' : 'text-red-800'}`}>
                  {isEligible ? "أنت مؤهل للتبرع حالياً" : "غير مؤهل للتبرع حالياً"}
                </h4>
                <p className={`text-sm ${isEligible ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isEligible 
                    ? "بناءً على فحصك السريري الأخير، يمكنك التبرع بالدم." 
                    : "يرجى الانتظار لحين انتهاء فترة النقاهة أو استشارة الطبيب."}
                </p>
                {!isEligible && donor.nextEligibleDate && (
                  <p className="mt-3 font-bold text-red-800 bg-red-100/50 inline-block px-3 py-1.5 rounded-md text-sm border border-red-200">
                    تاريخ الأهلية القادم: {new Intl.DateTimeFormat('ar-SA', { dateStyle: 'long' }).format(donor.nextEligibleDate)}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="labo-card p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">فصيلة الدم</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-xl border border-red-100">
                  {formatBloodType(donor.bloodType)}
                </div>
                <div>
                  <p className="text-slate-800 font-bold text-lg">معتمد ومؤكد</p>
                  <p className="text-slate-500 text-xs">تم التحقق من الفصيلة في المختبر.</p>
                </div>
              </div>
            </div>
            <div className="labo-card p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">تاريخ آخر تبرع</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  {donor.lastDonationDate ? (
                    <>
                      <p className="text-slate-800 font-bold text-lg">{new Intl.DateTimeFormat('ar-SA').format(donor.lastDonationDate)}</p>
                      <p className="text-slate-500 text-xs">منذ {Math.floor((Date.now() - donor.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24))} أيام</p>
                    </>
                  ) : (
                    <p className="text-slate-800 font-bold text-lg">لا يوجد تبرع سابق</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile details */}
        <div className="space-y-6">
          <div className="labo-card p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              البيانات الحيوية
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500">العمر</span>
                <span className="font-bold text-slate-800">{Math.floor((Date.now() - donor.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))} سنة</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500">الوزن</span>
                <span className="font-bold text-slate-800">{donor.weight} كجم</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-slate-500">الجنس</span>
                <span className="font-bold text-slate-800">{donor.gender === 'MALE' ? 'ذكر' : 'أنثى'}</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-slate-500">إجمالي التبرعات</span>
                <span className="font-bold text-blue-600 flex items-center gap-1">
                  <Droplet className="w-4 h-4 fill-blue-600" /> {donor.totalDonations}
                </span>
              </div>
            </div>
            
            <Link href="/dashboard/settings" className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 font-bold hover:text-blue-700 bg-blue-50 py-2.5 rounded-md transition-colors w-full">
              تعديل البيانات الأساسية <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
