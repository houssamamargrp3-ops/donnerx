"use client";

import { Activity, Users, AlertTriangle, FileText, CheckCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function MedicalDashboard() {
  return (
    <div className="space-y-6">
      
      {/* Page Title (Labo.dz style) */}
      <div className="labo-page-title">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">لوحة تحكم المركز الطبي</h1>
        </div>
        <Link href="/dashboard/emergency">
          <button className="labo-btn-danger">
            <ShieldAlert className="w-4 h-4" />
            نداء طوارئ جديد
          </button>
        </Link>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="labo-stat-card">
          <div className="labo-stat-icon bg-blue-100 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">إجمالي المتبرعين</p>
            <h2 className="text-2xl font-black text-slate-800">12,458</h2>
          </div>
        </div>

        <div className="labo-stat-card">
          <div className="labo-stat-icon bg-green-100 text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">تبرعات اليوم</p>
            <h2 className="text-2xl font-black text-slate-800">78</h2>
          </div>
        </div>

        <div className="labo-stat-card">
          <div className="labo-stat-icon bg-orange-100 text-orange-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">مواعيد بانتظار التأكيد</p>
            <h2 className="text-2xl font-black text-slate-800">14</h2>
          </div>
        </div>

        <div className="labo-stat-card border-t-4 border-t-red-500">
          <div className="labo-stat-icon bg-red-100 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase mb-1">طلبات طوارئ نشطة</p>
            <h2 className="text-2xl font-black text-slate-800">5</h2>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Emergency Requests Table */}
        <div className="labo-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              أحدث الطلبات العاجلة
            </h3>
            <Link href="/dashboard/emergency" className="text-xs text-blue-600 hover:underline font-bold">الكل</Link>
          </div>
          
          <div className="labo-table-wrapper">
            <table className="labo-table">
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
                  <td className="font-bold">مستشفى الملك فهد</td>
                  <td><span className="font-bold text-red-600">O-</span></td>
                  <td>4 أكياس</td>
                  <td><span className="labo-badge-danger">طارئ جداً</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="labo-action-btn labo-action-view" title="عرض التفاصيل"><FileText className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">مستشفى التخصصي</td>
                  <td><span className="font-bold text-red-600">A+</span></td>
                  <td>2 أكياس</td>
                  <td><span className="labo-badge-warning">طارئ</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="labo-action-btn labo-action-view"><FileText className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Appointments Table */}
        <div className="labo-card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800">المواعيد القادمة</h3>
            <Link href="/dashboard/appointments" className="text-xs text-blue-600 hover:underline font-bold">الكل</Link>
          </div>
          
          <div className="labo-table-wrapper">
            <table className="labo-table">
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
                  <td><span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">O+</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="labo-action-btn labo-action-edit"><CheckCircle className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="font-bold text-slate-800">10:30 ص</td>
                  <td className="font-bold text-slate-700">سارة علي</td>
                  <td><span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded text-xs">A+</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="labo-action-btn labo-action-edit"><CheckCircle className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
