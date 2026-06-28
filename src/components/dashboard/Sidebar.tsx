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
  Bell
} from "lucide-react";

export default function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "الرئيسية",
      items: [
        { label: "لوحة التحكم", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF", "DONOR"] },
        { label: "حملات التبرع", href: "/dashboard/campaigns", icon: <Megaphone className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF"] },
        { label: "نداءات الطوارئ", href: "/dashboard/emergency", icon: <AlertTriangle className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "HOSPITAL_STAFF"] },
      ]
    },
    {
      title: "الإدارة",
      items: [
        { label: "إدارة المتبرعين", href: "/dashboard/donors", icon: <Users className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF"] },
        { label: "المواعيد", href: "/dashboard/appointments", icon: <CalendarDays className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF"] },
        { label: "سجل التبرعات", href: "/dashboard/donations", icon: <Activity className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF"] },
        { label: "المخزون", href: "/dashboard/inventory", icon: <Droplet className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF"] },
      ]
    },
    {
      title: "المتبرع",
      items: [
        { label: "سجلي الطبي", href: "/dashboard/profile", icon: <Activity className="w-5 h-5" />, roles: ["DONOR"] },
        { label: "مواعيدي", href: "/dashboard/appointments", icon: <CalendarDays className="w-5 h-5" />, roles: ["DONOR"] },
        { label: "الإشعارات", href: "/dashboard/notifications", icon: <Bell className="w-5 h-5" />, roles: ["DONOR"] },
        { label: "المكافآت (قريباً)", href: "/dashboard/gamification", icon: <Award className="w-5 h-5" />, roles: ["DONOR"] },
      ]
    },
    {
      title: "النظام",
      items: [
        { label: "الإعدادات", href: "/dashboard/settings", icon: <Settings className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF", "DONOR"] },
      ]
    }
  ];

  return (
    <aside className="labo-sidebar">
      <div className="py-6">
        {menuGroups.map((group, idx) => {
          const visibleItems = group.items.filter(item => item.roles.includes(role));
          if (visibleItems.length === 0) return null;
          
          return (
            <div key={idx} className="mb-6">
              <h3 className="px-6 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                {group.title}
              </h3>
              <nav className="flex flex-col">
                {visibleItems.map((item, i) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={i} 
                      href={item.href}
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
    </aside>
  );
}
