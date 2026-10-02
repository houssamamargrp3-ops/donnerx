"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Award,
  QrCode,
  MapPin,
  ChevronLeft,
  Truck,
  Sparkles,
  Heart,
  Zap,
} from "lucide-react";
import Link from "next/link";
import SmartDonorCard from "./SmartDonorCard";
import DonationHealthGuide from "./DonationHealthGuide";
import LiveGPSLocation from "./LiveGPSLocation";
import PushNotificationPrompt from "./PushNotificationPrompt";

export default function DonorDashboard({ userId }: { userId: string }) {
  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const cached = localStorage.getItem("hayatlink_offline_donor");
        if (cached) { setDonor(JSON.parse(cached)); setLoading(false); }
      } catch (_) {}

      try {
        const res = await fetch("/api/donor/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.id) {
            setDonor(data);
            try { localStorage.setItem("hayatlink_offline_donor", JSON.stringify(data)); } catch (_) {}
          }
        }
      } catch {
        console.log("Offline mode: Using cached donor dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDonor();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-red-600 animate-spin" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">جاري تحميل ملفك...</p>
      </div>
    );
  }

  if (!donor) {
    return (
      <div
        className="rounded-3xl p-8 text-center max-w-sm mx-auto"
        style={{ background: "linear-gradient(135deg, #fff, #fef2f2)", border: "1px solid #fecaca" }}
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-black text-slate-800 mb-2">الملف الطبي غير مكتمل</h2>
        <p className="text-slate-500 mb-5 text-sm leading-relaxed">
          أهلاً بك في مجتمع أبطال التبرع. يرجى إكمال ملفك الطبي لتفعيل بطاقتك الرقمية.
        </p>
        <Link href="/dashboard/setup">
          <button className="w-full py-3 rounded-2xl text-white font-black text-sm transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", boxShadow: "0 8px 20px rgba(220,38,38,0.35)" }}>
            إكمال الملف الآن
          </button>
        </Link>
      </div>
    );
  }

  const gridItems = [
    {
      label: "طلب تبرع منزلي",
      icon: <Truck className="w-6 h-6" />,
      href: "/dashboard/home-donations/new",
      gradient: "linear-gradient(135deg, #059669, #047857)",
      shadow: "rgba(5,150,105,0.3)",
      badge: "جديد",
    },
    {
      label: "سجل التبرعات",
      icon: <ClipboardList className="w-6 h-6" />,
      href: "/dashboard/donations",
      gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      shadow: "rgba(37,99,235,0.3)",
    },
    {
      label: "النقاط والمكافآت",
      icon: <Award className="w-6 h-6" />,
      href: "/dashboard/gamification",
      gradient: "linear-gradient(135deg, #d97706, #b45309)",
      shadow: "rgba(217,119,6,0.3)",
    },
    {
      label: "بطاقتي الرقمية",
      icon: <QrCode className="w-6 h-6" />,
      href: "/dashboard/qr",
      gradient: "linear-gradient(135deg, #dc2626, #b91c1c)",
      shadow: "rgba(220,38,38,0.3)",
    },
  ];

  const nextAppointment = donor.appointments?.[0];

  return (
    <div className="max-w-md mx-auto pb-24 space-y-5">

      {/* GPS & Push */}
      <LiveGPSLocation />
      <PushNotificationPrompt />

      {/* Smart Donor Card */}
      <div className="-mx-4 md:mx-0">
        <SmartDonorCard />
      </div>

      {/* Home Donation Banner */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #059669 0%, #047857 40%, #065f46 100%)",
          boxShadow: "0 8px 28px rgba(5,150,105,0.3)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3" />
            <span>خدمة حصرية جديدة</span>
          </div>
          <h3 className="text-white font-black text-base leading-snug mb-1.5">
            🏠 تبرع من راحة منزلك
          </h3>
          <p className="text-emerald-100 text-xs font-medium mb-4 leading-relaxed">
            فريق طبي متخصص يصل إليك في الوقت المناسب لك بكل أمان وخصوصية.
          </p>
          <Link href="/dashboard/home-donations/new">
            <button
              className="bg-white text-emerald-700 font-black text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center gap-2"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            >
              <span>احجز فريقًا طبيًا</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* 2×2 Quick Actions Grid */}
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">الوصول السريع</p>
        <div className="grid grid-cols-2 gap-3">
          {gridItems.map((item, idx) => (
            <Link key={idx} href={item.href}>
              <div
                className="rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all active:scale-95 cursor-pointer relative overflow-hidden"
                style={{
                  background: "white",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                {item.badge && (
                  <span
                    className="absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                  >
                    {item.badge}
                  </span>
                )}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-white"
                  style={{ background: item.gradient, boxShadow: `0 6px 16px ${item.shadow}` }}
                >
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Appointment */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">الموعد القادم</h3>
          <Link href="/dashboard/appointments" className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-0.5">
            <span>الكل</span><ChevronLeft className="w-3 h-3" />
          </Link>
        </div>

        {nextAppointment ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.12), rgba(220,38,38,0.06))", border: "1px solid rgba(220,38,38,0.15)" }}>
                <MapPin className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="font-black text-slate-800 text-sm">{nextAppointment.center?.name || "مستشفى المدينة"}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(nextAppointment.scheduledAt).toLocaleDateString("ar-SA")} ·{" "}
                  {new Date(nextAppointment.scheduledAt).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            <Link href={`/dashboard/appointments/${nextAppointment.id}`}>
              <button className="text-xs font-bold text-red-600 px-3 py-1.5 rounded-xl transition-all hover:bg-red-50"
                style={{ border: "1px solid rgba(220,38,38,0.2)" }}>
                تفاصيل
              </button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-3">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CalendarEmpty />
            </div>
            <p className="text-sm text-slate-500 mb-3">لا يوجد لديك موعد قادم</p>
            <Link href="/dashboard/appointments/new">
              <button
                className="px-6 py-2.5 rounded-xl text-white text-sm font-black transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", boxShadow: "0 6px 16px rgba(220,38,38,0.3)" }}
              >
                سجل موعدًا الآن 🩸
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Donation Health Guide */}
      <DonationHealthGuide />
    </div>
  );
}

function CalendarEmpty() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
