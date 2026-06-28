"use client";

import { useEffect, useState } from "react";
import {
  Droplet,
  CalendarDays,
  Award,
  Heart,
  QrCode,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

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
        <span className="spinner border-t-red-500 w-10 h-10 border-4" />
      </div>
    );
  }

  if (!donor) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-12 text-center max-w-2xl mx-auto border border-yellow-200 shadow-sm"
      >
        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">ملفك الطبي غير مكتمل</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
          لكي تتمكن من حجز مواعيد والتبرع بالدم، يرجى إكمال إعداد ملفك الطبي وتحديد فصيلة دمك.
        </p>
        <Link href="/donor/setup">
          <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-colors inline-flex items-center gap-2">
            إكمال الملف الآن
            <ChevronLeft className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>
    );
  }

  const nextAppointment = donor.appointments?.[0];
  const isEligible = donor.eligibilityStatus === "ELIGIBLE" || !donor.lastDonationDate;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="max-w-md mx-auto sm:max-w-full sm:mx-0 space-y-6"
    >
      {/* Donor Quick Status - Mobile App Look */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile / Blood Type */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 text-center">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-lg font-bold text-slate-800">مرحباً {donor.user?.name || "بطل"}</h3>
              <p className="text-sm text-slate-500">فصيلة دمك</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100" />
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-20 relative flex items-center justify-center">
              {/* Blood bag shape mockup */}
              <div className="absolute inset-0 bg-red-50 border-2 border-red-200 rounded-t-full rounded-b-xl" />
              <Droplet className="w-8 h-8 text-red-600 relative z-10 fill-red-600" />
            </div>
            <h2 className="text-5xl font-black text-red-600">
              {donor.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
            </h2>
          </div>

          <div className="py-3 border-t border-slate-100">
            <p className="text-slate-500 text-sm">يمكنك التبرع بعد</p>
            <p className="text-xl font-bold text-slate-800 mt-1">يوم <span className="text-red-600 text-3xl">45</span></p>
          </div>
        </motion.div>

        {/* Eligibility Status */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 text-center flex flex-col justify-between">
          <div className="text-right w-full">
            <h3 className="text-lg font-bold text-slate-800">الأهلية للتبرع</h3>
          </div>
          
          <div className="my-6">
            {isEligible ? (
              <div className="relative w-40 h-40 mx-auto">
                {/* Green Progress Circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="283" strokeDashoffset="0" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h4 className="text-2xl font-bold text-slate-800">مؤهل</h4>
                  <p className="text-sm font-bold text-slate-800">للتبرع</p>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-2 fill-emerald-500 bg-white rounded-full" />
                </div>
              </div>
            ) : (
              <div className="relative w-40 h-40 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="283" strokeDashoffset="140" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h4 className="text-xl font-bold text-slate-800">فترة</h4>
                  <p className="text-sm font-bold text-slate-800">نقاهة</p>
                  <Clock className="w-6 h-6 text-yellow-500 mt-2" />
                </div>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-emerald-600 font-bold text-sm mb-4">
              {isEligible ? "مبروك، أنت مؤهل للتبرع" : "يرجى الانتظار لانتهاء فترة النقاهة"}
            </p>
            <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-50 transition-colors">
              إعادة التقييم
            </button>
          </div>
        </motion.div>

        {/* Next Appointment */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="text-right w-full mb-6">
            <h3 className="text-lg font-bold text-slate-800">تأكيد الموعد</h3>
          </div>
          
          {nextAppointment ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-emerald-600 font-bold mb-4">تم حجز موعدك بنجاح</h4>
              
              <p className="text-slate-800 font-bold text-sm">
                {new Intl.DateTimeFormat("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(nextAppointment.scheduledAt))}
              </p>
              <p className="text-slate-500 text-sm mt-1">{nextAppointment.center.name}</p>

              <div className="mt-6 w-32 h-32 mx-auto bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center justify-center">
                <QrCode className="w-24 h-24 text-slate-800" />
              </div>
              <p className="text-xs text-slate-400 mt-2 mb-6">يرجى إظهار هذا الرمز عند الوصول للمركز</p>

              <button className="w-full py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors">
                إضافة إلى التقويم
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 mb-6 font-medium">ليس لديك أي مواعيد قادمة.</p>
              <Link href="/dashboard/appointments/new">
                <button className="w-full py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors">
                  حجز موعد جديد
                </button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
