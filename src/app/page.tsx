import Link from "next/link";
import { Droplets, ArrowLeft, Shield, Heart, Activity, Users } from "lucide-react";
import DownloadApkButton from "@/components/DownloadApkButton";

export default function HomePage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(220,38,38,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(153,27,27,0.05) 0%, transparent 60%), linear-gradient(180deg, #0a0a12 0%, #0d0d1f 100%)",
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              background: "radial-gradient(circle, #dc2626, transparent)",
              left: `${10 + i * 12}%`,
              top: `${15 + i * 10}%`,
              animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-black border border-white/10"
            style={{ boxShadow: "0 0 20px rgba(220,38,38,0.35)" }}
          >
            <img src="/logo.png" alt="HayatLink" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-wider text-white">
              <span className="text-emerald-400">Hayat</span>
              <span className="text-red-500">Link</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold -mt-1">نصل العطاء بالحياة</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"
            className="px-4 md:px-5 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="/register"
            className="px-4 md:px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 4px 15px rgba(220,38,38,0.3)" }}>
            ابدأ الآن
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-red-300 mb-4"
          style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.15)" }}
        >
          🩸 منصة التبرع بالدم الوطنية الأولى
        </div>

        <div className="mb-8 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
          <p className="text-white font-bold text-lg tracking-wide">
            من تأطير الأستاذة : <span className="text-white font-black underline decoration-red-500 decoration-2 underline-offset-4">زرقاط ربيعة</span>
          </p>
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          كل قطرة دم<br />
          <span className="gradient-text">تُنقذ حياة</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed">
          منصة متكاملة تربط المتبرعين بالدم بمراكز نقل الدم والمستشفيات في الوقت الفعلي.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          <Link
            href="/register?role=donor"
            className="px-8 py-3.5 rounded-xl text-white font-bold text-base shadow-xl hover:shadow-red-600/30 transition-all flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}
          >
            <Heart className="w-5 h-5" />
            <span>تبرع الآن</span>
          </Link>
          <DownloadApkButton />
        </div>
      </section>

      {/* Portals Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Donor Portal */}
          <div
            className="group relative overflow-hidden rounded-3xl p-8 md:p-12 transition-all hover:shadow-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(220,38,38,0.1), rgba(153,27,27,0.05))",
              border: "1px solid rgba(220,38,38,0.2)",
              boxShadow: "0 10px 40px rgba(220,38,38,0.1)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-red-500/30 transition-all" />
            <div className="relative z-10 flex flex-col items-center text-center h-full">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 10px 25px rgba(220,38,38,0.4)" }}
              >
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">بوابة المتبرعين</h2>
              <p className="text-slate-400 text-sm md:text-base mb-6 leading-relaxed max-w-sm">
                حجز مواعيد التبرع بالدم، متابعة النقاط والأوسمة، وعرض بطاقة المتبرع الرقمية الذكية.
              </p>
              <div className="w-full mt-auto grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login?type=donor"
                  className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm text-white bg-red-600 hover:bg-red-700 transition-all shadow-md shadow-red-600/30"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register?role=donor"
                  className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm text-red-200 bg-white/10 hover:bg-white/20 border border-red-400/30 transition-all"
                >
                  حساب جديد
                </Link>
              </div>
            </div>
          </div>

          {/* Medical & Admin Portal */}
          <div
            className="group relative overflow-hidden rounded-3xl p-8 md:p-12 transition-all hover:shadow-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(59,130,246,0.1), rgba(29,78,216,0.05))",
              border: "1px solid rgba(59,130,246,0.2)",
              boxShadow: "0 10px 40px rgba(59,130,246,0.1)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/30 transition-all" />
            <div className="relative z-10 flex flex-col items-center text-center h-full">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: "0 10px 25px rgba(59,130,246,0.4)" }}
              >
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">بوابة الإدارة والمراكز الطبية</h2>
              <p className="text-slate-400 text-sm md:text-base mb-6 leading-relaxed max-w-sm">
                الوصول الخاص بالمدراء والمراكز الطبية لإدارة المخزون وطلبات الطوارئ وسجلات التبرع والتقارير.
              </p>
              <div className="w-full mt-auto grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login?type=medical"
                  className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/30"
                >
                  دخول المدير / الكادر
                </Link>
                <Link
                  href="/register?role=center"
                  className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm text-blue-200 bg-white/10 hover:bg-white/20 border border-blue-400/30 transition-all"
                >
                  حساب مركز طبي
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} HayatLink (حياة لينك) — نصل العطاء بالحياة 🩸</p>
      </footer>
    </div>
  );
}
