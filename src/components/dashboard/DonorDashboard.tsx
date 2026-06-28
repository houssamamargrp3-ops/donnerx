"use client";

import { useEffect, useState } from "react";
import {
  Droplet,
  CalendarDays,
  Award,
  Heart,
  QrCode,
  ArrowLeft,
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
        className="glass-card p-12 text-center max-w-2xl mx-auto border-dashed border-2 border-yellow-500/30"
      >
        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">ملفك الطبي غير مكتمل</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          لكي تتمكن من حجز مواعيد والتبرع بالدم، يرجى إكمال إعداد ملفك الطبي وتحديد فصيلة دمك.
        </p>
        <Link href="/donor/setup">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary inline-flex items-center gap-2">
            إكمال الملف الآن
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      className="space-y-6"
    >
      {/* Donor Quick Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blood Type Card */}
        <motion.div variants={itemVariants} className="stats-card group relative overflow-hidden bg-gradient-to-br from-[#16162a] to-[#0a0a12] hover:shadow-[0_0_40px_rgba(220,38,38,0.15)]">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium tracking-wide">فصيلة الدم</p>
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                {donor.bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}
              </h2>
            </div>
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-lg"
              style={{ background: "linear-gradient(135deg, #ef4444, #991b1b)" }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md" />
              <Droplet className="w-8 h-8 text-white relative z-10 drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>

        {/* Points & Level */}
        <motion.div variants={itemVariants} className="stats-card group relative overflow-hidden bg-gradient-to-br from-[#16162a] to-[#0a0a12] hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium tracking-wide">نقاط التميز</p>
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                {donor.points}
              </h2>
              <p className="text-amber-500/80 text-xs font-bold mt-1">المستوى {donor.level}</p>
            </div>
            <motion.div 
              whileHover={{ rotate: -15, scale: 1.1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-lg"
              style={{ background: "linear-gradient(135deg, #f59e0b, #b45309)" }}
            >
              <Award className="w-8 h-8 text-white relative z-10 drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>

        {/* Total Donations */}
        <motion.div variants={itemVariants} className="stats-card group relative overflow-hidden bg-gradient-to-br from-[#16162a] to-[#0a0a12] hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium tracking-wide">حياة تم إنقاذها</p>
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-500">
                {donor.totalDonations * 3} <span className="text-lg font-normal text-slate-500">أشخاص</span>
              </h2>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center relative shadow-lg"
              style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}
            >
              <Heart className="w-8 h-8 text-white relative z-10 drop-shadow-md" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Next Appointment */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-red-500" />
              الموعد القادم
            </h3>
            {nextAppointment && (
              <span className="bg-red-500/10 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold border border-red-500/20 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute" />
                <span className="w-2 h-2 rounded-full bg-red-500" />
                مؤكد
              </span>
            )}
          </div>

          {nextAppointment ? (
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center bg-slate-900/40 p-6 rounded-2xl border border-slate-700/50">
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">الوقت والتاريخ</p>
                    <p className="text-lg font-bold text-white">
                      {new Intl.DateTimeFormat("ar-SA", { dateStyle: "full", timeStyle: "short" }).format(new Date(nextAppointment.scheduledAt))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">المركز الطبي</p>
                    <p className="text-lg font-bold text-white">{nextAppointment.center.name}</p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-white rounded-2xl p-2 flex items-center justify-center shadow-lg shadow-white/5">
                  {/* Mock QR Code for premium look */}
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <span className="text-xs text-slate-400 font-bold">امسح الكود عند الوصول</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 relative z-10">
              <CalendarDays className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 mb-6 text-lg">ليس لديك أي مواعيد قادمة للتبرع.</p>
              <Link href="/dashboard/appointments/new">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary inline-flex items-center gap-2 px-8">
                  حجز موعد جديد
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Eligibility Status */}
        <motion.div variants={itemVariants} className="glass-panel p-8 relative overflow-hidden">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-8">
            <Activity className="w-6 h-6 text-emerald-500" />
            الحالة الطبية
          </h3>
          
          <div className="text-center">
            {isEligible ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h4 className="text-2xl font-bold text-emerald-400 mb-3">مؤهل للتبرع</h4>
                <p className="text-slate-400 leading-relaxed text-sm">
                  حالتك الصحية والمدة الزمنية تسمح لك بالتبرع الآن. شكراً لمساهمتك في إنقاذ الأرواح!
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-yellow-900/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <Clock className="w-12 h-12 text-yellow-500" />
                </div>
                <h4 className="text-2xl font-bold text-yellow-400 mb-3">فترة نقاهة</h4>
                <p className="text-slate-400 leading-relaxed text-sm mb-4">
                  {donor.eligibilityReason || "يرجى الانتظار لحين انتهاء فترة النقاهة بين التبرعات."}
                </p>
                {donor.nextEligibleDate && (
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-xs text-slate-500 mb-1">الموعد المتاح القادم:</p>
                    <p className="text-white font-bold">
                      {new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(new Date(donor.nextEligibleDate))}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
