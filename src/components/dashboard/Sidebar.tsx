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
  Building2
} from "lucide-react";

export default function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "الرئيسية",
      items: [
        { label: "لوحة التحكم", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF", "DONOR"] },
        { label: "سجل التبرعات", href: "/dashboard/donations", icon: <Droplet className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF"] },
        { label: "المواعيد", href: "/dashboard/appointments", icon: <CalendarDays className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF", "DONOR"] },
        { label: "المتبرعين", href: "/dashboard/donors", icon: <Users className="w-5 h-5" />, roles: ["SUPER_ADMIN", "ADMIN", "CENTER_STAFF"] },
        { label: "مساعد الذكاء الاصطناعي", href: "/dashboard/ai", icon: <Activity className="w-5 h-5 text-purple-500" />, roles: ["SUPER_ADMIN", "ADMIN"] },
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
      title: "قسم المتبرع",
      items: [
        { label: "سجلاتي الطبية", href: "/dashboard/profile", icon: <FileText className="w-5 h-5" />, roles: ["DONOR"] },
        { label: "شهاداتي", href: "/dashboard/profile/certificates", icon: <Award className="w-5 h-5" />, roles: ["DONOR"] },
        { label: "المكافآت", href: "/dashboard/gamification", icon: <Award className="w-5 h-5" />, roles: ["DONOR"] },
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
