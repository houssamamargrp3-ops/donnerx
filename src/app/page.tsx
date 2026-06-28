import Link from "next/link";
import { Droplets, ArrowLeft, Shield, Heart, Activity, Users } from "lucide-react";

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
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 0 20px rgba(220,38,38,0.35)" }}
          >
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black gradient-text tracking-wider">DONNER.X</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login"
            className="px-5 py-2 rounded-lg text-slate-300 hover:text-white text-sm font-medium transition-colors">
            تسجيل الدخول
          </Link>
          <Link href="/register"
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 4px 15px rgba(220,38,38,0.3)" }}>
            ابدأ الآن
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-red-300 mb-8"
          style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.15)" }}
        >
          🩸 منصة التبرع بالدم الوطنية الأولى
        </div>

        <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          كل قطرة دم<br />
          <span className="gradient-text">تُنقذ حياة</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mb-10 leading-relaxed">
          منصة متكاملة تربط المتبرعين بالدم بمراكز نقل الدم والمستشفيات في الوقت الفعلي.
          سجّل الآن وكن جزءًا من شبكة الأبطال.
        </p>

      {/* Portals Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Donor Portal */}
          <Link
            href="/login?type=donor"
            className="group relative overflow-hidden rounded-3xl p-8 md:p-12 transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            style={{
              background: "linear-gradient(145deg, rgba(220,38,38,0.1), rgba(153,27,27,0.05))",
              border: "1px solid rgba(220,38,38,0.2)",
              boxShadow: "0 10px 40px rgba(220,38,38,0.1)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-red-500/30 transition-all" />
            <div className="relative z-10 flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 10px 25px rgba(220,38,38,0.4)" }}
              >
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 group-hover:text-red-400 transition-colors">بوابة المتبرعين</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-sm">
                سجل كمتبرع جديد أو قم بتسجيل الدخول لحجز مواعيد التبرع ومتابعة نقاطك وسجلك الطبي.
              </p>
              <div className="mt-auto flex items-center gap-3 text-red-400 font-bold text-lg group-hover:gap-5 transition-all">
                <span>الدخول للمتبرعين</span>
                <ArrowLeft className="w-5 h-5" />
              </div>
            </div>
          </Link>

          {/* Medical Portal */}
          <Link
            href="/login?type=medical"
            className="group relative overflow-hidden rounded-3xl p-8 md:p-12 transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            style={{
              background: "linear-gradient(145deg, rgba(59,130,246,0.1), rgba(29,78,216,0.05))",
              border: "1px solid rgba(59,130,246,0.2)",
              boxShadow: "0 10px 40px rgba(59,130,246,0.1)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/30 transition-all" />
            <div className="relative z-10 flex flex-col items-center text-center h-full">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: "0 10px 25px rgba(59,130,246,0.4)" }}
              >
                <Activity className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">بوابة المراكز والمستشفيات</h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-sm">
                الوصول الخاص بالمراكز الطبية والمستشفيات لإدارة المخزون وطلب الدم واستقبال المتبرعين.
              </p>
              <div className="mt-auto flex items-center gap-3 text-blue-400 font-bold text-lg group-hover:gap-5 transition-all">
                <span>دخول الطاقم الطبي</span>
                <ArrowLeft className="w-5 h-5" />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} DONNER.X — منصة التبرع بالدم الوطنية 🩸</p>
      </footer>
    </div>
  );
}
