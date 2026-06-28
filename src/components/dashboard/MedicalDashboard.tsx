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
    hidden: { opacity: 0, y: 10 },
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
        <motion.div variants={itemVariants} className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1 font-medium">إجمالي المتبرعين</p>
              <h2 className="text-3xl font-black text-slate-800">12,458</h2>
              <p className="text-xs text-blue-600 mt-1 font-bold">+12% من الشهر الماضي</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1 font-medium">المتبرعون الجدد</p>
              <h2 className="text-3xl font-black text-slate-800">256</h2>
              <p className="text-xs text-emerald-600 mt-1 font-bold">+8% من الشهر الماضي</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1 font-medium">التبرعات اليوم</p>
              <h2 className="text-3xl font-black text-slate-800">78</h2>
              <p className="text-xs text-emerald-600 mt-1 font-bold">+15% من أمس</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50">
              <Activity className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="stats-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1 font-medium">الطلبات العاجلة</p>
              <h2 className="text-3xl font-black text-slate-800">5</h2>
              <p className="text-xs text-red-500 mt-1 font-bold">طلبات نشطة</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Inventory Critical Alerts */}
        <motion.div variants={itemVariants} className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              أحدث الطلبات العاجلة
            </h3>
            <Link href="/dashboard/emergency" className="text-sm text-blue-600 hover:underline">عرض جميع الطلبات</Link>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">O-</span>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm">مستشفى الملك فهد</h4>
                  <p className="text-slate-500 text-xs mt-1">منذ 20 دقيقة</p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">طارئ جداً</span>
                <p className="text-slate-600 text-xs font-medium mt-1">4 أكياس</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">A+</span>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm">مستشفى التخصصي</h4>
                  <p className="text-slate-500 text-xs mt-1">منذ 45 دقيقة</p>
                </div>
              </div>
              <div className="text-left">
                <span className="text-red-500 font-bold text-sm bg-red-50 px-3 py-1 rounded-full">طارئ</span>
                <p className="text-slate-600 text-xs font-medium mt-1">2 أكياس</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div variants={itemVariants} className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">المواعيد القادمة</h3>
            <Link href="/dashboard/appointments" className="text-sm text-blue-600 hover:underline">عرض جميع المواعيد</Link>
          </div>
          
          <div className="space-y-0 divide-y divide-slate-100">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="text-center bg-slate-50 rounded-lg p-2 min-w-[70px]">
                  <p className="text-slate-800 font-bold text-sm">10:00</p>
                  <p className="text-slate-500 text-xs">ص</p>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm">أحمد محمد</h4>
                  <p className="text-slate-500 text-xs mt-1">مركز التبرع الرئيسي</p>
                </div>
              </div>
              <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-sm">O+</span>
            </div>
            
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="text-center bg-slate-50 rounded-lg p-2 min-w-[70px]">
                  <p className="text-slate-800 font-bold text-sm">10:30</p>
                  <p className="text-slate-500 text-xs">ص</p>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm">سارة علي</h4>
                  <p className="text-slate-500 text-xs mt-1">مركز التبرع الرئيسي</p>
                </div>
              </div>
              <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-sm">A+</span>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="text-center bg-slate-50 rounded-lg p-2 min-w-[70px]">
                  <p className="text-slate-800 font-bold text-sm">11:00</p>
                  <p className="text-slate-500 text-xs">ص</p>
                </div>
                <div>
                  <h4 className="text-slate-800 font-bold text-sm">محمد عبدالله</h4>
                  <p className="text-slate-500 text-xs mt-1">مركز التبرع الرئيسي</p>
                </div>
              </div>
              <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-sm">B+</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
