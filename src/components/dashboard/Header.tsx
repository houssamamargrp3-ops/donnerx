"use client";

import { LogOut, Globe, User as UserIcon, Bell, Droplet } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardHeader({ user }: { user: any }) {
  return (
    <header
      className="h-16 fixed top-0 w-full z-50 px-4 sm:px-6 flex items-center justify-between print:hidden"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(226,232,240,0.8)",
        boxShadow: "0 1px 20px rgba(0,0,0,0.06)",
      }}
    >
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2.5 group">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center bg-black transition-transform group-hover:scale-105"
          style={{ boxShadow: "0 0 12px rgba(220,38,38,0.25)" }}
        >
          <img src="/logo.png" alt="HayatLink" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-lg sm:text-xl font-black text-slate-900 leading-none tracking-tight">
            <span className="text-emerald-600">Hayat</span>
            <span className="text-red-600">Link</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-0.5">نصل العطاء بالحياة</span>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">

        {/* User Info */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-xl"
          style={{ background: "rgba(248,250,252,1)", border: "1px solid #e2e8f0" }}>
          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[120px]">{user?.name || "المستخدم"}</span>
        </div>

        {/* Logout */}
        <button
          onClick={async () => {
            try {
              localStorage.removeItem("hayatlink_offline_donor");
              localStorage.removeItem("hayatlink_offline_profile");
              localStorage.removeItem("hayatlink_offline_donations");
            } catch (_) {}
            await signOut({ callbackUrl: "/login" });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
          style={{
            background: "rgba(254,242,242,1)",
            color: "#dc2626",
            border: "1px solid rgba(254,202,202,1)",
          }}
          title="تسجيل الخروج"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(254,226,226,1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(254,242,242,1)";
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
}
