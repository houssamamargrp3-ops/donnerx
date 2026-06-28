"use client";

import { Activity, Users, AlertTriangle, Syringe, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function MedicalDashboard() {
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold mb-1">إجمالي المتبرعين</p>
              <h2 className="text-3xl font-black text-slate-800">12,458</h2>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-100">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold mb-1">المتبرعون الجدد</p>
              <h2 className="text-3xl font-black text-slate-800">256</h2>
            </div>
          </div>
        </div>

        <div className="stats-card">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-100">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold mb-1">التبرعات اليوم</p>
              <h2 className="text-3xl font-black text-slate-800">78</h2>
            </div>
          </div>
        </div>

        <div className="stats-card border-t-4 border-t-red-500">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold mb-1">الطلبات العاجلة</p>
              <h2 className="text-3xl font-black text-slate-800">5</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Inventory Critical Alerts */}
        <div className="glass-panel">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              أحدث الطلبات العاجلة
            </h3>
            <Link href="/dashboard/emergency" className="text-sm text-blue-600 hover:underline">عرض جميع الطلبات</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>المستشفى</th>
                  <th>الفصيلة</th>
                  <th>الكمية</th>
                  <th>الحالة</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold text-slate-700">مستشفى الملك فهد</td>
                  <td><span className="font-bold text-red-600">O-</span></td>
                  <td>4 أكياس</td>
                  <td><span className="badge-danger">طارئ جداً</span></td>
                  <td><button className="btn-primary">تلبية</button></td>
                </tr>
                <tr>
                  <td className="font-bold text-slate-700">مستشفى التخصصي</td>
                  <td><span className="font-bold text-red-600">A+</span></td>
                  <td>2 أكياس</td>
                  <td><span className="badge-danger">طارئ</span></td>
                  <td><button className="btn-primary">تلبية</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="glass-panel">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800">المواعيد القادمة</h3>
            <Link href="/dashboard/appointments" className="text-sm text-blue-600 hover:underline">عرض جميع المواعيد</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>الوقت</th>
                  <th>الاسم</th>
                  <th>الفصيلة</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold text-slate-800">10:00 ص</td>
                  <td className="font-bold text-slate-700">أحمد محمد</td>
                  <td><span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-sm">O+</span></td>
                  <td><button className="btn-primary bg-slate-800 hover:bg-slate-700 text-xs">إدارة</button></td>
                </tr>
                <tr>
                  <td className="font-bold text-slate-800">10:30 ص</td>
                  <td className="font-bold text-slate-700">سارة علي</td>
                  <td><span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-sm">A+</span></td>
                  <td><button className="btn-primary bg-slate-800 hover:bg-slate-700 text-xs">إدارة</button></td>
                </tr>
                <tr>
                  <td className="font-bold text-slate-800">11:00 ص</td>
                  <td className="font-bold text-slate-700">محمد عبدالله</td>
                  <td><span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-sm">B+</span></td>
                  <td><button className="btn-primary bg-slate-800 hover:bg-slate-700 text-xs">إدارة</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
