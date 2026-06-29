"use client";

import { LogOut, Globe, Droplet } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 w-full z-50 px-6 flex items-center justify-between shadow-sm print:hidden">
      
      {/* Right side (RTL left): Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
          <Droplet className="w-6 h-6 text-white" />
        </div>
        <Link href="/" className="flex flex-col">
          <span className="text-xl font-black text-slate-800 leading-none">DONNER.X</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Tableau de bord</span>
        </Link>
      </div>

      {/* Left side (RTL right): Actions */}
      <div className="flex items-center gap-4">
        
        {/* Language Pill */}
        <div className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-slate-600 border border-gray-200">
          <Globe className="w-4 h-4 text-slate-500" />
          <span>عربي</span>
        </div>

        {/* User Info (Optional, but good for dashboard) */}
        <div className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-700">
          <span>{user?.name || "المستخدم"}</span>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="labo-btn-danger"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
      
    </header>
  );
}
