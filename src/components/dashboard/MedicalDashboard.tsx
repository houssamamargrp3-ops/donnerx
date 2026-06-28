"use client";

import { Activity, Users, AlertTriangle, Syringe, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function MedicalDashboard() {
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
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="stats-card group relative overflow-hidden bg-gradient-to-br from-[#16162a] to-[#0a0a12] hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium tracking-wide">مخزون الدم الكلي</p>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">1,240 <span className="text-sm text-slate-500 font-normal">وحدة</span></h2>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #ef4444, #991b1b)" }}>
              <Syringe className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stats-card group relative overflow-hidden bg-gradient-to-br from-[#16162a] to-[#0a0a12] hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium tracking-wide">المواعيد اليوم</p>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-500">45</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #10b981, #047857)" }}>
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stats-card group relative overflow-hidden bg-gradient-to-br from-[#16162a] to-[#0a0a12] hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium tracking-wide">العمليات الناجحة</p>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-500">18</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)" }}>
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stats-card group relative overflow-hidden bg-gradient-to-br from-[#16162a] to-[#0a0a12] hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-slate-400 text-sm mb-1 font-medium tracking-wide">الطلبات العاجلة</p>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">3</h2>
            </div>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #f59e0b, #b45309)" }}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Inventory Critical Alerts */}
        <motion.div variants={itemVariants} className="glass-panel p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              نواقص المخزون الحرجة
            </h3>
            <Link href="/dashboard/inventory" className="text-sm text-red-400 hover:text-red-300 transition-colors">إدارة المخزون</Link>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
              <div className="flex items-center gap-4">
                <span className="blood-badge w-12 h-12 text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">O-</span>
                <div>
                  <h4 className="text-white font-bold">فصيلة O سالب</h4>
                  <p className="text-red-400 text-xs mt-1 animate-pulse">متبقي 2 وحدات فقط - تحت الحد الأدنى (10)</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-sm font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">طلب طارئ</button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
              <div className="flex items-center gap-4">
                <span className="blood-badge w-12 h-12 text-sm shadow-[0_0_15px_rgba(220,38,38,0.3)]">AB-</span>
                <div>
                  <h4 className="text-white font-bold">فصيلة AB سالب</h4>
                  <p className="text-yellow-400 text-xs mt-1">متبقي 5 وحدات - يقترب من الحد الأدنى</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-all">طلب طارئ</button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="glass-panel p-8">
          <h3 className="text-xl font-bold text-white mb-8">إجراءات سريعة</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/donations/new">
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 text-center hover:bg-emerald-500/20 transition-all cursor-pointer h-full flex flex-col justify-center">
                <Syringe className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-emerald-400 font-bold">تسجيل تبرع</h4>
              </motion.div>
            </Link>
            
            <Link href="/dashboard/campaigns">
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 text-center hover:bg-blue-500/20 transition-all cursor-pointer h-full flex flex-col justify-center">
                <Users className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                <h4 className="text-blue-400 font-bold">إدارة الحملات</h4>
              </motion.div>
            </Link>

            <Link href="/dashboard/appointments" className="col-span-2">
              <motion.div whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }} className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 flex items-center justify-between hover:bg-red-500/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="text-right">
                    <h4 className="text-red-400 font-bold text-lg">مواعيد اليوم</h4>
                    <p className="text-slate-400 text-sm">عرض قائمة المواعيد وجدولة الحضور</p>
                  </div>
                </div>
                <ChevronLeft className="w-6 h-6 text-red-500" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
