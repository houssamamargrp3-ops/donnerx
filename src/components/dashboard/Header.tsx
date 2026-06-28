"use client";

import { Search, ChevronDown, User, Globe, LogOut, Droplet } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import type { User as NextAuthUser } from "next-auth";
import NotificationsDropdown from "./NotificationsDropdown";

interface HeaderProps {
  user: NextAuthUser | undefined;
}

export default function DashboardHeader({ user }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white"
      style={{
        minHeight: "72px",
      }}
    >
      {/* Left side: Logo & Title (Since RTL, it's on the right visually) */}
      <div className="flex items-center gap-3">
        <Droplet className="w-6 h-6 text-blue-600 fill-blue-600" />
        <h1 className="text-xl font-black text-slate-800 tracking-tight">DONNER.X <span className="font-medium text-slate-500 text-sm">Dashboard</span></h1>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Language Toggle Mockup */}
        <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
          <span className="px-3 py-1 text-xs font-bold text-slate-500">العربية</span>
          <span className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-full shadow-sm">FR</span>
        </div>

        {/* Notifications */}
        <NotificationsDropdown />

        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="btn-danger flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </header>
  );
}
