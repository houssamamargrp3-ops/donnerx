import { Users, ChevronLeft, Edit, Droplet, Calendar, Phone, Mail, Activity, MapPin, Heart, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { bloodTypeLabel } from "@/lib/utils";

export const metadata = { title: "الملف الشخصي للمتبرع" };

export default async function DonorProfilePage({ params }: { params: { id: string } }) {
  const donor = await prisma.donor.findUnique({
    where: { id: params.id },
    include: { 
      user: true,
      donations: {
        orderBy: { donatedAt: "desc" },
        take: 5
      }
    },
  });

  if (!donor) {
    notFound();
  }

  const age = Math.floor((new Date().getTime() - donor.dateOfBirth.getTime()) / 3.15576e+10);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/donors"
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
                 style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
              {donor.user.name[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                {donor.user.name}
              </h1>
              <p className="text-slate-400 text-sm mt-1">{donor.user.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/donors/${donor.id}/edit`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Edit className="w-4 h-4" />
            تعديل البيانات
          </Link>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 4px 15px rgba(220,38,38,0.3)" }}
          >
            <Droplet className="w-4 h-4" />
            تسجيل تبرع
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="stats-card">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-400" />
              البيانات الشخصية والطبية
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5" /> فصيلة الدم</p>
                <p className="text-white font-bold text-lg text-red-400">{bloodTypeLabel(donor.bloodType)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> العمر</p>
                <p className="text-slate-200 font-semibold">{age} سنة</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> الجنس</p>
                <p className="text-slate-200 font-semibold">{donor.gender === "MALE" ? "ذكر" : "أنثى"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> الوزن</p>
                <p className="text-slate-200 font-semibold">{donor.weight} كجم</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> الهاتف</p>
                <p className="text-slate-200 font-semibold" dir="ltr">{donor.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> المدينة</p>
                <p className="text-slate-200 font-semibold">{donor.city || "غير محدد"}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
              <div>
                <p className="text-slate-400 text-xs font-medium mb-1">أمراض مزمنة</p>
                {donor.chronicDiseases.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {donor.chronicDiseases.map((d, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-300 text-sm">لا يوجد</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="stats-card">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              سجل التبرعات الأخير
            </h3>
            
            {donor.donations.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/2">
                <Droplet className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 font-medium">لم يقم بأي تبرع بعد</p>
                <p className="text-slate-500 text-sm mt-1">سجل التبرعات فارغ حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donor.donations.map((donation) => (
                  <div key={donation.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center">
                        <Droplet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-medium">تبرع بالدم</p>
                        <p className="text-slate-400 text-xs">{new Intl.DateTimeFormat("ar-SA").format(donation.donatedAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-bold">{donation.volumeMl} مل</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ناجح
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Status & Stats */}
        <div className="space-y-6">
          <div className="stats-card bg-gradient-to-br from-[#1e1e3a] to-[#121225]">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-400" />
              حالة الأهلية
            </h3>
            
            <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/5">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                donor.eligibilityStatus === "ELIGIBLE" ? "bg-emerald-500/20 text-emerald-400" :
                donor.eligibilityStatus === "INELIGIBLE" ? "bg-red-500/20 text-red-400" :
                "bg-amber-500/20 text-amber-400"
              }`}>
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className={`text-xl font-bold mb-2 ${
                donor.eligibilityStatus === "ELIGIBLE" ? "text-emerald-400" :
                donor.eligibilityStatus === "INELIGIBLE" ? "text-red-400" :
                "text-amber-400"
              }`}>
                {donor.eligibilityStatus === "ELIGIBLE" ? "مؤهل للتبرع" :
                 donor.eligibilityStatus === "INELIGIBLE" ? "غير مؤهل" :
                 "قيد الفحص الطوعي"}
              </h4>
              {donor.eligibilityReason && (
                <p className="text-slate-400 text-sm mt-2">{donor.eligibilityReason}</p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-slate-400 text-xs font-medium mb-1">النقاط</p>
                <p className="text-2xl font-bold text-white">{donor.points}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-slate-400 text-xs font-medium mb-1">المستوى</p>
                <p className="text-2xl font-bold text-white">{donor.level}</p>
              </div>
              <div className="col-span-2 p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-slate-400 text-xs font-medium mb-1">إجمالي التبرعات</p>
                <p className="text-3xl font-bold text-red-400">{donor.totalDonations}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
