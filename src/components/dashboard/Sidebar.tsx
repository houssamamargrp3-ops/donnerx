"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Droplets,
  LayoutDashboard,
  Users,
  CalendarDays,
  Droplet,
  Megaphone,
  AlertTriangle,
  Package,
  Bell,
  QrCode,
  BarChart3,
  Smartphone,
  Trophy,
  Brain,
  Settings,
  LogOut,
  Shield,
  Building2,
  Hospital,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles?: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "لوحة التحكم", href: "/dashboard" },
  { icon: Users, label: "المتبرعون", href: "/dashboard/donors", roles: ["ADMIN", "CENTER_STAFF"] },
  { icon: CalendarDays, label: "المواعيد", href: "/dashboard/appointments", roles: ["CENTER_STAFF"] },
  { icon: Droplet, label: "التبرعات", href: "/dashboard/donations", roles: ["CENTER_STAFF"] },
  { icon: Megaphone, label: "الحملات", href: "/dashboard/campaigns", roles: ["ADMIN", "CENTER_STAFF"] },
  { icon: AlertTriangle, label: "الطلبات العاجلة", href: "/dashboard/emergency", badge: "عاجل", roles: ["HOSPITAL_STAFF", "CENTER_STAFF", "ADMIN"] },
  { icon: Package, label: "المخزون", href: "/dashboard/inventory", roles: ["ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"] },
  { icon: Bell, label: "الإشعارات", href: "/dashboard/notifications" },
  { icon: QrCode, label: "نظام QR", href: "/dashboard/qr", roles: ["CENTER_STAFF"] },
  { icon: BarChart3, label: "التقارير", href: "/dashboard/reports", roles: ["ADMIN"] },
  { icon: Trophy, label: "التحفيز", href: "/dashboard/gamification", roles: ["ADMIN"] },
  { icon: Brain, label: "الذكاء الاصطناعي", href: "/dashboard/ai", roles: ["ADMIN"] },
  { icon: Settings, label: "الإعدادات", href: "/dashboard/settings" },
];

interface SidebarProps {
  role: string;
}

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  const getRoleLabel = (r: string) => {
    switch (r) {
      case "SUPER_ADMIN": return { label: "مدير عام", icon: Shield, color: "#8b5cf6" };
      case "ADMIN": return { label: "مدير", icon: Shield, color: "#f59e0b" };
      case "CENTER_STAFF": return { label: "مركز الدم", icon: Building2, color: "#3b82f6" };
      case "HOSPITAL_STAFF": return { label: "مستشفى", icon: Hospital, color: "#10b981" };
      default: return { label: "متبرع", icon: Droplets, color: "#dc2626" };
    }
  };

  const roleInfo = getRoleLabel(role);

  return (
    <aside
      className="w-64 flex flex-col flex-shrink-0 border-l"
      style={{
        background: "#111122",
        borderColor: "#1e1e3a",
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "#1e1e3a" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 0 20px rgba(220,38,38,0.3)",
            }}
          >
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black gradient-text tracking-wider">DONNER.X</h1>
            <p className="text-xs text-slate-500">منصة التبرع بالدم</p>
          </div>
        </div>

        {/* Role Badge */}
        <div
          className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg"
          style={{ background: `${roleInfo.color}12`, border: `1px solid ${roleInfo.color}25` }}
        >
          <roleInfo.icon className="w-3 h-3" style={{ color: roleInfo.color }} />
          <span className="text-xs font-semibold" style={{ color: roleInfo.color }}>
            {roleInfo.label}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-sm">{item.label}</span>
              {item.badge && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(220,38,38,0.15)", color: "#f87171" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: "#1e1e3a" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-950/30"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
