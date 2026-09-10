"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Bell,
  Award,
  QrCode,
  MapPin,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import SmartDonorCard from "./SmartDonorCard";
import PwaInstallPrompt from "./PwaInstallPrompt";

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
        <span className="spinner border-t-red-600 w-10 h-10 border-4 rounded-full animate-spin" />
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-auto shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">الملف الطبي غير مكتمل</h2>
        <p className="text-slate-500 mb-6 text-sm">
          أهلاً بك في مجتمع أبطال التبرع. يرجى إكمال إعداد ملفك الطبي أولاً.
        </p>
        <Link href="/dashboard/setup">
          <button className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-md shadow-red-200">
            إكمال الملف الآن
          </button>
        </Link>
      </div>
    );
  }

  const gridItems = [
    { label: "سجل التبرعات", icon: <ClipboardList className="w-6 h-6 text-blue-500" />, href: "/dashboard/donations", bg: "bg-blue-50" },
    { label: "النقاط والمكافآت", icon: <Award className="w-6 h-6 text-yellow-500" />, href: "/dashboard/gamification", bg: "bg-yellow-50" },
    { label: "بطاقتي الرقمية", icon: <QrCode className="w-6 h-6 text-red-500" />, href: "/dashboard/qr", bg: "bg-red-50" },
    { label: "الإشعارات", icon: <Bell className="w-6 h-6 text-purple-500" />, href: "/dashboard/notifications", bg: "bg-purple-50" },
  ];

  const nextAppointment = donor.appointments?.[0];

  return (
    <div className="max-w-md mx-auto pb-20 space-y-6 animate-fade-in-up">
      
      {/* Install App Prompt */}
      <PwaInstallPrompt />

      {/* 1. Smart Card as Hero Section */}
      <div className="-mx-4 md:mx-0">
        <SmartDonorCard />
      </div>

      {/* 2. 2x2 Grid Actions */}
      <div className="grid grid-cols-2 gap-3 px-1">
        {gridItems.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] active:scale-95 transition-transform">
              <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-3`}>
                {item.icon}
              </div>
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. Upcoming Campaign / Appointment */}
      <div className="bg-white rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
        <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">حملة التبرع القادمة</h3>
        
        {nextAppointment ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{nextAppointment.center?.name || "مستشفى المدينة"}</p>
                <p className="text-xs text-slate-500 mt-1">{new Date(nextAppointment.scheduledAt).toLocaleDateString('ar-SA')} - {new Date(nextAppointment.scheduledAt).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>
            <Link href={`/dashboard/appointments/${nextAppointment.id}`}>
              <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-100">
                التفاصيل
              </button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-slate-500 mb-3">لا يوجد لديك موعد قادم. هل ترغب في إنقاذ حياة اليوم؟</p>
            <Link href="/dashboard/appointments/new">
              <button className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold w-full shadow-md shadow-red-200">
                سجل الآن
              </button>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
