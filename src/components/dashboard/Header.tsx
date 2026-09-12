"use client";

import { LogOut, Globe, Droplet, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 w-full z-50 px-4 sm:px-6 flex items-center justify-between shadow-xs print:hidden">
      
      {/* Brand & Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-sm shadow-red-200 flex items-center justify-center transition-transform group-hover:scale-105">
          <Droplet className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white fill-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center text-lg sm:text-xl font-black text-slate-900 leading-none tracking-tight">
            <span>DONNER</span>
            <span className="text-red-600">.X</span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold mt-0.5">لوحة التحكم</span>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Language Pill (hidden on very small screens to keep header clean) */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>عربي</span>
        </div>

        {/* User Info (Desktop) */}
        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <UserIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[140px]">{user?.name || "المستخدم"}</span>
        </div>

        {/* Proportional, Sleek Logout Button */}
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs"
          title="تسجيل الخروج"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
          <span className="hidden sm:inline">تسجيل الخروج</span>
          <span className="sm:hidden">خروج</span>
        </button>
      </div>
      
    </header>
  );
}
