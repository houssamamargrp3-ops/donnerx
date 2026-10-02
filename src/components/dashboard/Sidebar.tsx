"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Activity, 
  Settings,
  Droplet,
  Megaphone,
  AlertTriangle,
  Award,
  Bell,
  Building2,
  FileText,
  QrCode,
  Truck
} from "lucide-react";

import { useState } from "react";
import MobileBottomNav from "./MobileBottomNav";

export default function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuGroups = [
    {
      title: "الرئيسية",
      items: [
        { label: "لوحة التحكم", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF", "DONOR"] },
        { label: "سجل التبرعات", href: "/dashboard/donations", icon: <Droplet className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
        { label: "التبرع المنزلي 🏠", href: "/dashboard/home-donations", icon: <Truck className="w-5 h-5 text-emerald-500" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
        { label: "المواعيد", href: "/dashboard/appointments", icon: <CalendarDays className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF", "DONOR"] },
        { label: "المتبرعين", href: "/dashboard/donors", icon: <Users className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
        { label: "مساعد الذكاء الاصطناعي", href: "/dashboard/ai", icon: <Activity className="w-5 h-5 text-purple-500" />, roles: ["SUPER_ADMIN", "ADMIN"] },
      ]
    },
    {
      title: "الإدارة",
      items: [
        { label: "التبرع المنزلي (إدارة)", href: "/dashboard/home-donations", icon: <Truck className="w-5 h-5 text-emerald-500" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
        { label: "إدارة المتبرعين", href: "/dashboard/donors", icon: <Users className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
        { label: "المواعيد", href: "/dashboard/appointments", icon: <CalendarDays className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
        { label: "المخزون", href: "/dashboard/inventory", icon: <Droplet className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
        { label: "إدارة الحملات", href: "/dashboard/campaigns", icon: <Megaphone className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
        { label: "ماسح البطاقات (QR)", href: "/dashboard/qr", icon: <QrCode className="w-5 h-5 text-blue-500" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
      ]
    },
    {
      title: "قسم المتبرع",
      items: [
        { label: "طلب تبرع منزلي 🏠", href: "/dashboard/home-donations/new", icon: <Truck className="w-5 h-5 text-emerald-500" />, roles: ["DONOR"] },
        { label: "طلباتي المنزلية", href: "/dashboard/home-donations", icon: <FileText className="w-5 h-5 text-blue-500" />, roles: ["DONOR"] },
        { label: "سجل التبرعات", href: "/dashboard/donations", icon: <FileText className="w-5 h-5" />, roles: ["DONOR"] },
        { label: "البطاقة الذكية (QR)", href: "/dashboard/qr", icon: <QrCode className="w-5 h-5 text-red-500" />, roles: ["DONOR"] },
        { label: "سجلاتي الطبية", href: "/dashboard/profile", icon: <Activity className="w-5 h-5" />, roles: ["DONOR"] },
        { label: "شهاداتي", href: "/dashboard/profile/certificates", icon: <Award className="w-5 h-5" />, roles: ["DONOR"] },
        { label: "المكافآت", href: "/dashboard/gamification", icon: <Award className="w-5 h-5 text-amber-500" />, roles: ["DONOR"] },
        { label: "حملات التبرع", href: "/dashboard/campaigns", icon: <Megaphone className="w-5 h-5" />, roles: ["DONOR"] },
      ]
    },
    {
      title: "النظام",
      items: [
        { label: "المراكز الطبية", href: "/dashboard/settings/centers", icon: <Building2 className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN"] },
        { label: "الإعدادات", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF", "DONOR"] },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Toggle Button / Bottom Nav */}
      {role === "DONOR" ? (
        <MobileBottomNav role={role} onOpenMenu={() => setIsOpen(!isOpen)} />
      ) : (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-red-600 text-white p-4 rounded-full shadow-2xl hover:bg-red-700 transition-transform active:scale-95 flex items-center justify-center print:hidden"
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <aside className={`labo-sidebar print:hidden transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>

        {/* Sidebar Logo Header */}
        <div className="px-5 py-4 flex items-center gap-2.5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex-shrink-0"
            style={{ boxShadow: "0 0 10px rgba(220,38,38,0.25)" }}>
            <img src="/logo.png" alt="HayatLink" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-black text-sm leading-none">
              <span className="text-emerald-400">Hayat</span>
              <span className="text-red-400">Link</span>
            </div>
            <div className="text-[9px] text-slate-600 font-bold mt-0.5">منصة التبرع بالدم</div>
          </div>
        </div>

        <div className="py-4 flex-1 overflow-y-auto">
          {menuGroups.map((group, idx) => {
            const visibleItems = group.items.filter(item => item.roles.includes(role));
            if (visibleItems.length === 0) return null;
            
            return (
              <div key={idx} className="mb-5">
                <h3 className="px-4 mb-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                  {group.title}
                </h3>
                <nav className="flex flex-col gap-0.5 px-2">
                  {visibleItems.map((item, i) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`labo-sidebar-item ${isActive ? 'active' : ''}`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Sidebar footer */}
        <div className="px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="text-[10px] text-slate-600 font-bold text-center">
            HayatLink v2.0 · نصل العطاء بالحياة 🩸
          </div>
        </div>
      </aside>
    </>
  );
}
