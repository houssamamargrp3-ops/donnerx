"use client";

import { Search, ChevronDown, User } from "lucide-react";
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
      {/* Search */}
      <div className="relative max-w-xs w-full">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="البحث..."
          className="w-full pr-9 pl-4 py-2 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-slate-50 border border-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Menu */}
        <div className="relative">
          <button
            id="user-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all border border-slate-200 hover:bg-slate-50"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-800 font-medium leading-none">{user?.name || "مستخدم"}</p>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden shadow-xl z-50 bg-white border border-slate-100 animate-scale-in">
              <div className="p-2 space-y-1">
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  الملف الشخصي
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm transition-colors w-full"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
