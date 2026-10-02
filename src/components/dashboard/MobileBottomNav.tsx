"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Megaphone, Menu, Truck, QrCode } from "lucide-react";

export default function MobileBottomNav({ role, onOpenMenu }: { role: string; onOpenMenu: () => void }) {
  const pathname = usePathname();

  if (role !== "DONOR") return null;

  const navItems = [
    {
      label: "الرئيسية",
      href: "/dashboard",
      icon: Home,
      activeColor: "text-red-500",
      activeBg: "bg-red-50",
    },
    {
      label: "تبرع منزلي",
      href: "/dashboard/home-donations/new",
      icon: Truck,
      activeColor: "text-emerald-600",
      activeBg: "bg-emerald-50",
    },
    {
      label: "سجل",
      href: "/dashboard/donations",
      icon: ClipboardList,
      activeColor: "text-blue-600",
      activeBg: "bg-blue-50",
    },
    {
      label: "بطاقتي",
      href: "/dashboard/qr",
      icon: QrCode,
      activeColor: "text-violet-600",
      activeBg: "bg-violet-50",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 print:hidden">
      {/* Glass backdrop */}
      <div
        className="flex justify-around items-center h-[62px] px-1"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(226,232,240,0.8)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full pt-1 pb-1"
            >
              {/* Top active bar */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-b-full"
                  style={{ background: "linear-gradient(90deg, #dc2626, #ef4444)" }}
                />
              )}

              {/* Icon bubble */}
              <span
                className={`flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200 ${
                  isActive ? `${item.activeBg} scale-105` : "scale-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? item.activeColor : "text-slate-400"
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
              </span>

              <span
                className={`text-[9.5px] font-bold mt-0.5 transition-colors duration-200 ${
                  isActive ? item.activeColor : "text-slate-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* More / Menu Button */}
        <button
          onClick={onOpenMenu}
          className="relative flex flex-col items-center justify-center flex-1 h-full pt-1 pb-1 text-slate-400"
        >
          <span className="flex items-center justify-center w-10 h-7 rounded-xl">
            <Menu className="w-5 h-5" strokeWidth={1.8} />
          </span>
          <span className="text-[9.5px] font-bold mt-0.5">المزيد</span>
        </button>
      </div>

      {/* Safe area spacer for iOS notch */}
      <div
        style={{
          height: "env(safe-area-inset-bottom, 0px)",
          background: "rgba(255,255,255,0.96)",
        }}
      />
    </div>
  );
}
