"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  CalendarDays,
  Bell,
  Clock,
  CheckCircle,
  Download,
  Info,
  Trophy,
  Star,
  Award
} from "lucide-react";
import Link from "next/link";

export default function DonorDashboard({ userId }: { userId: string }) {
  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const res = await fetch("/api/donor/me");
        if (res.ok) {
          const data = await res.json();
          setDonor(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDonor();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="spinner border-t-blue-600 w-10 h-10 border-4" />
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="bg-white rounded-md p-12 text-center max-w-2xl mx-auto border border-gray-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">ملفك الطبي غير مكتمل</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
          لكي تتمكن من حجز مواعيد والتبرع بالدم، يرجى إكمال إعداد ملفك الطبي وتحديد فصيلة دمك.
        </p>
        <Link href="/dashboard/setup">
          <button className="labo-btn-primary mx-auto">
            إكمال الملف الآن
          </button>
        </Link>
      </div>
    );
  }

  const nextAppointment = donor.appointments?.[0];
  const isEligible = donor.eligibilityStatus === "ELIGIBLE" || !donor.lastDonationDate;

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div className="labo-page-title mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-800">مرحباً، {donor.user?.name || "متبرع"}</h1>
          <p className="text-slate-500 mt-1 text-sm">إليك الحالة الحالية لتبرعاتك ونتائجك المتاحة.</p>
        </div>
      </div>

      {/* History Pills */}
      {donor.donations && donor.donations.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-4 border-b border-gray-200">
          <span className="text-sm font-bold text-slate-600 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4" /> سجل الزيارات:
          </span>
          {donor.donations.map((donation: any, index: number) => (
            <Link key={donation.id} href="/dashboard/donations">
              <button className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ${index === 0 ? 'bg-blue-600 text-white' : 'border border-blue-600 text-blue-600 bg-white hover:bg-blue-50'}`}>
                {index === 0 ? `أحدث زيارة (#${donor.donations.length})` : `${new Date(donation.donatedAt).toISOString().split('T')[0]} (#${donor.donations.length - index})`}
              </button>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Details */}
          <div className="labo-card p-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              تفاصيل الموعد القادم
            </h3>
            
            {nextAppointment ? (
              <div className="grid grid-cols-4 gap-4 text-right">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">رقم الموعد</p>
                  <p className="text-sm font-bold text-slate-800">#{nextAppointment.id.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">التاريخ</p>
                  <p className="text-sm font-bold text-slate-800">{new Date(nextAppointment.scheduledAt).toISOString().split('T')[0]}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">الوقت</p>
                  <p className="text-sm font-bold text-slate-800">{new Date(nextAppointment.scheduledAt).toLocaleTimeString('ar-SA')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">الحالة</p>
                  <span className="badge-success">محجوز</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">لا يوجد موعد قادم حالياً.</p>
            )}
          </div>

          {/* Medical Results */}
          <div className="labo-card p-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-blue-600" />
              النتائج الطبية (الأهلية)
            </h3>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">
                  {isEligible ? "أنت مؤهل للتبرع!" : "يرجى الانتظار لانتهاء فترة النقاهة"}
                </h4>
                <p className="text-sm text-slate-500">
                  فصيلة دمك الحالية: <span className="font-bold text-red-600">{donor.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}</span>
                </p>
              </div>
              
              <Link href="/dashboard/reports">
                <button className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-md shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  التقرير الطبي (PDF)
                </button>
              </Link>
            </div>
          </div>
          
          {/* Gamification Widget */}
          <div className="labo-card p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                نظام التحفيز والنقاط
              </h3>
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 text-yellow-700 font-bold text-sm">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                {donor.points || 0} نقطة
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                <span>المستوى الحالي: {donor.level || 1}</span>
                <span>المستوى القادم: {(donor.level || 1) + 1}</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-l from-yellow-400 to-orange-500 rounded-full" style={{ width: `${Math.min(((donor.totalDonations % 5) / 5) * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-left">تبقى {5 - (donor.totalDonations % 5)} تبرعات للوصول للمستوى التالي</p>
            </div>

            {donor.badges && donor.badges.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3">شاراتك المميزة:</h4>
                <div className="flex flex-wrap gap-3">
                  {donor.badges.map((b: any) => (
                    <div key={b.id} className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 border border-slate-100 w-20 text-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white shadow-sm mb-1">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">{b.badge?.name || "شارة"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {(!donor.badges || donor.badges.length === 0) && (
              <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                <p className="text-sm text-slate-500">تبرع بالدم لتبدأ في كسب النقاط والشارات المميزة!</p>
              </div>
            )}
          </div>
          
        </div>

        {/* Right Column (Sidebar-like info) */}
        <div className="space-y-6">
          
          {/* Official Reports */}
          <div className="labo-card p-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-blue-600" />
              التقارير الرسمية
            </h3>
            <Link href="/dashboard/reports">
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                <FileText className="w-5 h-5 text-red-500" />
                <span className="text-sm text-slate-700 font-medium">عرض وطباعة التقارير</span>
              </div>
            </Link>
          </div>

          {/* Notifications */}
          <div className="labo-card p-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-yellow-500" />
              الإشعارات والتنبيهات
            </h3>
            
            <div className="space-y-3">
              {donor.user?.notifications?.length > 0 ? (
                donor.user.notifications.map((notif: any) => (
                  <div key={notif.id} className="bg-blue-50 border border-blue-100 rounded-md p-3 flex gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-blue-800 font-bold mb-1">{new Date(notif.createdAt).toLocaleString('ar-SA')}</p>
                      <p className="text-sm text-blue-900 font-bold">{notif.title}</p>
                      <p className="text-sm text-blue-800">{notif.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3 flex gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-emerald-800 font-bold mb-1">نصيحة عملية</p>
                      <p className="text-sm text-emerald-900">أنت بصحة جيدة! حافظ على شرب كمية كافية من الماء بانتظام.</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 text-center py-4">لا توجد إشعارات جديدة.</p>
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
