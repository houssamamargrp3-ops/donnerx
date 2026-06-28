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
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{
        background: "#111122",
        borderColor: "#1e1e3a",
        minHeight: "72px",
      }}
    >
      {/* Search */}
      <div className="relative max-w-xs w-full">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="البحث..."
          className="w-full pr-9 pl-4 py-2 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid #1e1e3a",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#dc2626";
            e.target.style.boxShadow = "0 0 0 2px rgba(220,38,38,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#1e1e3a";
            e.target.style.boxShadow = "none";
          }}
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
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
            style={{
              background: menuOpen ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
              border: "1px solid #1e1e3a",
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-white font-medium leading-none">{user?.name || "مستخدم"}</p>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            </div>
            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-48 rounded-xl overflow-hidden shadow-xl z-50 animate-scale-in"
              style={{
                background: "#16162a",
                border: "1px solid #1e1e3a",
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              <div className="p-2 space-y-1">
                <a
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-white/5 text-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  الملف الشخصي
                </a>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-950/30 text-sm transition-colors w-full"
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
