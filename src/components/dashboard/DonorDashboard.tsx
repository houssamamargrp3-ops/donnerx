"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  CalendarDays,
  Bell,
  Clock,
  CheckCircle,
  Download,
  Info
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
      <div className="flex items-center gap-3 overflow-x-auto pb-4 border-b border-gray-200">
        <span className="text-sm font-bold text-slate-600 uppercase flex items-center gap-2">
          <Clock className="w-4 h-4" /> سجل الزيارات:
        </span>
        <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-bold whitespace-nowrap">الزيارة الحالية (#4)</button>
        <button className="px-4 py-1.5 rounded-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 text-sm font-bold whitespace-nowrap">2026-03-08 (#3)</button>
        <button className="px-4 py-1.5 rounded-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 text-sm font-bold whitespace-nowrap">2026-03-07 (#2)</button>
      </div>

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
              
              <button className="bg-emerald-500 text-white font-bold py-2 px-6 rounded-md shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-2">
                <FileText className="w-5 h-5" />
                التقرير الطبي (PDF)
              </button>
            </div>
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
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer">
              <FileText className="w-5 h-5 text-red-500" />
              <span className="text-sm text-slate-700 font-medium">تأكيد الموعد</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="labo-card p-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-yellow-500" />
              الإشعارات والتنبيهات
            </h3>
            
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-800 font-bold mb-1">2026-06-28 12:50:07</p>
                  <p className="text-sm text-blue-900">يمكنك الآن تحميل تقرير التحليل الكامل الخاص بك.</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-md p-3 flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-emerald-800 font-bold mb-1">نصيحة عملية</p>
                  <p className="text-sm text-emerald-900">يوصى بشرب كمية طبيعية من الماء قبل التبرع.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
