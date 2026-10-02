"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, QrCode, ShieldAlert, Truck } from "lucide-react";
import { useEffect, useState } from "react";

export default function MobileBottomNav({ role, onOpenMenu }: { role: string; onOpenMenu: () => void }) {
  const pathname = usePathname();
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for active emergencies and unread notifications every 30 seconds
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch active emergencies
        const eres = await fetch("/api/emergency?status=OPEN");
        if (eres.ok) {
          const data = await eres.json();
          setEmergencyCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (_) {}

      try {
        // Fetch unread notifications
        const nres = await fetch("/api/notifications");
        if (nres.ok) {
          const data = await nres.json();
          setUnreadCount(data.unreadCount || 0);

          // If there are unread EMERGENCY notifications, show a native browser notification
          const emergencyNotifs = (data.notifications || []).filter(
            (n: any) => n.type === "EMERGENCY_REQUEST" && !n.isRead
          );
          if (emergencyNotifs.length > 0 && typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              for (const notif of emergencyNotifs.slice(0, 2)) {
                try {
                  const reg = await navigator.serviceWorker?.ready;
                  if (reg?.showNotification) {
                    reg.showNotification(notif.title || "🚨 نداء طوارئ!", {
                      body: notif.message,
                      icon: "/icon-192x192.png",
                      badge: "/icon-192x192.png",
                      vibrate: [300, 100, 300, 100, 500],
                      tag: `emergency-${notif.id}`,
                      renotify: false,
                      requireInteraction: true,
                      data: { url: "/dashboard/emergency" },
                    } as any);
                  }
                } catch (_) {}
              }
            }
          }
        }
      } catch (_) {}
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

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
      label: "طوارئ",
      href: "/dashboard/emergency",
      icon: ShieldAlert,
      activeColor: "text-red-600",
      activeBg: "bg-red-50",
      badge: emergencyCount > 0 ? emergencyCount : undefined,
      badgeColor: "bg-red-500",
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
      <div
        className="flex justify-around items-center h-[62px] px-0.5"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(226,232,240,0.8)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full pt-1 pb-1"
            >
              {/* Top active indicator */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-7 rounded-b-full"
                  style={{ background: "linear-gradient(90deg, #dc2626, #ef4444)" }}
                />
              )}

              {/* Icon container */}
              <span
                className={`relative flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200 ${
                  isActive ? `${item.activeBg} scale-105` : "scale-100"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? item.activeColor : "text-slate-400"
                  }`}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
                {/* Badge (for emergency count) */}
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-white text-[9px] font-black flex items-center justify-center ${item.badgeColor}`}
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
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
      </div>

      {/* Safe area spacer */}
      <div style={{ height: "env(safe-area-inset-bottom, 0px)", background: "rgba(255,255,255,0.97)" }} />
    </div>
  );
}
