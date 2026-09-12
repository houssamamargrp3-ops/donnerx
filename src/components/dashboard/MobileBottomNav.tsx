"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Megaphone, Menu } from "lucide-react";

export default function MobileBottomNav({ role, onOpenMenu }: { role: string; onOpenMenu: () => void }) {
  const pathname = usePathname();

  if (role !== "DONOR") return null;

  const navItems = [
    { label: "الرئيسية", href: "/dashboard", icon: <Home className="w-6 h-6" /> },
    { label: "سجل", href: "/dashboard/donations", icon: <ClipboardList className="w-6 h-6" /> },
    { label: "حملات", href: "/dashboard/campaigns", icon: <Megaphone className="w-6 h-6" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? "text-red-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? "text-red-600" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        
        {/* More / Menu Button */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-gray-600"
        >
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-bold">المزيد</span>
        </button>
      </div>
    </div>
  );
}
