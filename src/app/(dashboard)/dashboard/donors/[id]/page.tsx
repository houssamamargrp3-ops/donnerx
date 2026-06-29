import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, MapPin, Droplet, Calendar, HeartPulse, Activity, CalendarDays, ShieldCheck, Edit } from "lucide-react";
import Link from "next/link";
import { bloodTypeLabel } from "@/lib/utils";
import DeleteDonorButton from "./DeleteDonorButton";

export const metadata = { title: "ملف المتبرع" };

export default async function DonorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const donor = await prisma.donor.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: true,
      donations: {
        include: { center: true },
        orderBy: { donatedAt: "desc" }
      },
      appointments: {
        include: { center: true },
        orderBy: { scheduledAt: "desc" },
        take: 5
      },
      eligibilityChecks: {
        orderBy: { checkedAt: "desc" },
        take: 5
      }
    },
  });

  if (!donor) notFound();

  const age = donor.dateOfBirth ? Math.floor((new Date().getTime() - new Date(donor.dateOfBirth).getTime()) / 3.15576e+10) : 0;

  const getEligibilityBadge = (status: string) => {
    switch (status) {
      case "ELIGIBLE": return <span className="labo-badge-success flex items-center gap-1 w-fit"><ShieldCheck className="w-4 h-4" /> مؤهل للتبرع</span>;
      case "PENDING_CHECK": return <span className="labo-badge-warning flex items-center gap-1 w-fit"><CalendarDays className="w-4 h-4" /> قيد الفحص</span>;
      case "INELIGIBLE": return <span className="labo-badge-danger flex items-center gap-1 w-fit"><HeartPulse className="w-4 h-4" /> غير مؤهل</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Header */}
      <div className="labo-page-title mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            الملف الطبي للمتبرع
          </h1>
          <p className="text-slate-500 text-sm mt-1">عرض السجل الطبي الكامل وتاريخ التبرعات للمتبرع.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/donors" className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors bg-white px-4 py-2 border border-slate-200 rounded-lg shadow-sm">
            العودة للقائمة <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href={`/dashboard/donors/${resolvedParams.id}/eligibility`} className="labo-btn-primary">
            <ShieldCheck className="w-4 h-4" /> فحص طبي جديد
          </Link>
          <Link href={`/dashboard/donors/${resolvedParams.id}/edit`} className="labo-btn-outline">
            <Edit className="w-4 h-4" /> تعديل البيانات
          </Link>
          <DeleteDonorButton donorId={donor.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Basic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="labo-card p-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200 mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-3xl font-bold border border-blue-100 mb-4 shadow-sm">
                {donor.user?.name?.charAt(0) || "U"}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{donor.user?.name || "مستخدم غير معروف"}</h2>
              <div className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-2">
                <span className="bg-red-50 text-red-600 font-bold px-2 py-1 rounded border border-red-100" dir="ltr">
                  {bloodTypeLabel(donor.bloodType)}
                </span>
                <span>•</span>
                <span>{donor.gender === "MALE" ? "ذكر" : "أنثى"}</span>
                <span>•</span>
                <span>{age} سنة</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium">{donor.user?.email || "غير متوفر"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium" dir="ltr">{donor.phone || "غير متوفر"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium">{donor.city || "المدينة غير محددة"} {donor.address ? `- ${donor.address}` : ""}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Calendar className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium">تاريخ الانضمام: {donor.createdAt ? new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(new Date(donor.createdAt)) : "غير متوفر"}</span>
              </div>
            </div>
          </div>

          <div className="labo-card p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-red-500" />
              البيانات الصحية
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-500">حالة الأهلية</span>
                {getEligibilityBadge(donor.eligibilityStatus)}
              </div>
              {donor.nextEligibleDate && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm font-bold text-slate-500">مؤهل بعد</span>
                  <span className="text-sm font-bold text-slate-800 bg-blue-50 px-2 py-1 rounded">
                    {new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(donor.nextEligibleDate))}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-500">الوزن</span>
                <span className="text-sm font-bold text-slate-800">{donor.weight} كجم</span>
              </div>
              <div className="py-2 border-b border-slate-100 pb-4">
                <span className="text-sm font-bold text-slate-500 block mb-2">الأمراض المزمنة</span>
                {(donor.chronicDiseases || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(donor.chronicDiseases || []).map((disease, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                        {disease}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">لا يوجد سجل أمراض مزمنة.</span>
                )}
              </div>
              
              <div className="py-2">
                <span className="text-sm font-bold text-slate-500 block mb-2">آخر الفحوصات الطبية</span>
                {(donor.eligibilityChecks || []).length > 0 ? (
                  <div className="space-y-2">
                    {(donor.eligibilityChecks || []).map((check) => (
                      <div key={check.id} className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-500">{new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(check.checkedAt))}</span>
                        {check.isEligible ? (
                          <span className="text-emerald-600 font-bold">مؤهل (Hb: {check.hemoglobin || '-'})</span>
                        ) : (
                          <span className="text-red-600 font-bold truncate max-w-[150px]" title={check.reason || "غير مؤهل"}>مرفوض: {check.reason}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">لم يتم إجراء فحص أهلية لهذا المتبرع بعد.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* History and Stats */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="labo-stat-card border-none shadow-sm h-full">
              <div className="labo-stat-icon bg-red-50 text-red-600">
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <p className="labo-stat-title">إجمالي التبرعات</p>
                <p className="labo-stat-value">{(donor.donations || []).length}</p>
              </div>
            </div>
            <div className="labo-stat-card border-none shadow-sm h-full">
              <div className="labo-stat-icon bg-emerald-50 text-emerald-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="labo-stat-title">نقاط المتبرع</p>
                <p className="labo-stat-value">{donor.points}</p>
              </div>
            </div>
            <div className="labo-stat-card border-none shadow-sm h-full">
              <div className="labo-stat-icon bg-blue-50 text-blue-600">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="labo-stat-title">آخر تبرع</p>
                <p className="labo-stat-value text-xl">
                  {(donor.donations || []).length > 0 && donor.donations[0]?.donatedAt
                    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "short" }).format(new Date(donor.donations[0].donatedAt)) 
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="labo-card p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                سجل التبرعات
              </h3>
            </div>
            <div className="labo-table-wrapper">
              <table className="labo-table w-full">
                <thead>
                  <tr>
                    <th>المركز</th>
                    <th>التاريخ</th>
                    <th>الكمية (مل)</th>
                  </tr>
                </thead>
                <tbody>
                  {(donor.donations || []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400">
                        لم يقم هذا المتبرع بأي عملية تبرع حتى الآن.
                      </td>
                    </tr>
                  ) : (
                    (donor.donations || []).map((donation) => (
                      <tr key={donation.id}>
                        <td>
                          <div className="font-bold text-slate-800">{donation.center?.name || "مركز غير معروف"}</div>
                          <div className="text-xs text-slate-500">{donation.center?.address || ""}</div>
                        </td>
                        <td>
                          <div className="font-bold text-slate-800" dir="ltr">
                            {donation.donatedAt ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(donation.donatedAt)) : "-"}
                          </div>
                        </td>
                        <td>
                          <span className="font-bold text-slate-700">{donation.volumeMl}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
