import Link from "next/link";
import { Heart, Activity, Users, Shield, Droplets, Zap, Star, Award } from "lucide-react";
import DownloadApkButton from "@/components/DownloadApkButton";

export default function HomePage() {
  const stats = [
    { value: "١٢٠٠+", label: "متبرع مسجّل", icon: "👤" },
    { value: "٤٨٠٠+", label: "حياة أنقذت", icon: "❤️" },
    { value: "٣٢", label: "مركز طبي", icon: "🏥" },
    { value: "٢٤/٧", label: "خدمة مستمرة", icon: "⚡" },
  ];

  const features = [
    { icon: "🩸", title: "مطابقة فصائل الدم", desc: "نظام ذكي يربط المتبرع بالمريض فورياً" },
    { icon: "🏠", title: "تبرع منزلي", desc: "فريق طبي متخصص يصل إلى باب منزلك" },
    { icon: "🔔", title: "طوارئ فورية", desc: "إشعارات فورية لطلبات الدم العاجلة" },
    { icon: "🏆", title: "مكافآت وأوسمة", desc: "نقاط وجوائز حصرية لكل متبرع بطل" },
    { icon: "📊", title: "لوحة تحكم ذكية", desc: "إدارة متكاملة لمراكز نقل الدم" },
    { icon: "🔒", title: "أمان وخصوصية", desc: "بياناتك الطبية محمية بأعلى معايير الأمان" },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 30%, rgba(220,38,38,0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(153,27,27,0.06) 0%, transparent 50%), linear-gradient(180deg, #08080f 0%, #0d0d1f 60%, #080810 100%)",
      }}
    >
      {/* ── Floating ambient orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${120 + i * 50}px`,
              height: `${120 + i * 50}px`,
              background:
                i % 2 === 0
                  ? "radial-gradient(circle, rgba(220,38,38,0.06), transparent)"
                  : "radial-gradient(circle, rgba(5,150,105,0.04), transparent)",
              left: `${5 + i * 18}%`,
              top: `${10 + i * 13}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + i * 0.5}s`,
            }}
          />
        ))}
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="relative z-20 flex items-center justify-between px-5 md:px-10 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-black border border-white/10 group-hover:scale-105 transition-transform"
            style={{ boxShadow: "0 0 20px rgba(220,38,38,0.3)" }}
          >
            <img src="/logo.png" alt="HayatLink" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-xl font-black tracking-wide leading-none">
              <span className="text-emerald-400">Hayat</span>
              <span className="text-red-500">Link</span>
            </span>
            <span className="text-[10px] text-slate-500 font-bold">نصل العطاء بالحياة</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <DownloadApkButton variant="primary" label="تحميل APK" />
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-sm font-semibold transition-all hover:bg-white/5"
          >
            دخول
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl text-white text-sm font-bold transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
            }}
          >
            ابدأ الآن
          </Link>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <section className="relative z-10 flex flex-col items-center text-center px-5 pt-16 pb-12">

        {/* Supervisor badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5 text-white text-sm font-bold"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>
            من تأطير الأستاذة:{" "}
            <span className="text-white font-black underline decoration-red-500 decoration-2 underline-offset-4">
              زرقاط ربيعة
            </span>
          </span>
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        </div>

        {/* Pill badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-red-300 mb-6"
          style={{
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.25)",
          }}
        >
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
          🩸 منصة التبرع بالدم الوطنية الأولى في المملكة العربية السعودية
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-tight tracking-tight">
          كل قطرة دم
          <br />
          <span className="gradient-text-animated">تُنقذ حياة</span>
        </h1>

        <p className="text-base md:text-lg text-slate-400 max-w-xl mb-9 leading-relaxed">
          منصة متكاملة تربط المتبرعين بالدم بمراكز نقل الدم والمستشفيات في الوقت الفعلي —
          بسهولة، بأمان، بسرعة.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <Link
            href="/register?role=donor"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-black text-base transition-all hover:scale-105 active:scale-95 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 8px 30px rgba(220,38,38,0.4)",
            }}
          >
            <Heart className="w-5 h-5 fill-white" />
            تبرع الآن — أنقذ حياة
          </Link>
          <DownloadApkButton />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-4 px-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="text-2xl mb-1">{s.icon}</span>
              <span className="text-2xl font-black text-white leading-none">{s.value}</span>
              <span className="text-slate-500 text-xs font-semibold mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ PORTALS ══════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 pb-16">
        <div className="text-center mb-8">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">اختر بوابتك</p>
          <h2 className="text-2xl font-black text-white">انضم إلى مجتمع HayatLink</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Donor Portal */}
          <div
            className="group relative overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            style={{
              background: "linear-gradient(145deg, rgba(220,38,38,0.12), rgba(153,27,27,0.06))",
              border: "1px solid rgba(220,38,38,0.25)",
              boxShadow: "0 12px 40px rgba(220,38,38,0.12)",
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(220,38,38,0.15)", transform: "translate(30%, -30%)" }} />
            
            <div className="relative z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  boxShadow: "0 8px 24px rgba(220,38,38,0.4)",
                }}
              >
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">بوابة المتبرعين</h2>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                حجز مواعيد التبرع، متابعة نقاطك وأوسمتك، وعرض بطاقة المتبرع الرقمية الذكية. تبرع منزلياً بكل راحة وخصوصية.
              </p>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {["🏠 تبرع منزلي", "🏆 نقاط ومكافآت", "📱 بطاقة رقمية"].map((tag) => (
                  <span key={tag}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(220,38,38,0.15)", color: "#fca5a5", border: "1px solid rgba(220,38,38,0.2)" }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/login?type=donor"
                  className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", boxShadow: "0 4px 14px rgba(220,38,38,0.35)" }}>
                  تسجيل الدخول
                </Link>
                <Link href="/register?role=donor"
                  className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm transition-all hover:bg-white/15"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5" }}>
                  حساب جديد
                </Link>
              </div>
            </div>
          </div>

          {/* Medical Portal */}
          <div
            className="group relative overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            style={{
              background: "linear-gradient(145deg, rgba(59,130,246,0.12), rgba(29,78,216,0.06))",
              border: "1px solid rgba(59,130,246,0.25)",
              boxShadow: "0 12px 40px rgba(59,130,246,0.12)",
            }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(59,130,246,0.15)", transform: "translate(30%, -30%)" }} />

            <div className="relative z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  boxShadow: "0 8px 24px rgba(59,130,246,0.4)",
                }}
              >
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">بوابة الإدارة والمراكز</h2>
              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                الوصول الخاص بالمدراء والمراكز الطبية لإدارة المخزون، طلبات الطوارئ، سجلات التبرع والتقارير.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {["🚨 طوارئ فورية", "📊 تقارير متقدمة", "👥 إدارة المتبرعين"].map((tag) => (
                  <span key={tag}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.2)" }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/login?type=medical"
                  className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", boxShadow: "0 4px 14px rgba(59,130,246,0.35)" }}>
                  دخول المدير
                </Link>
                <Link href="/register?role=center"
                  className="w-full py-3 px-4 rounded-xl text-center font-bold text-sm transition-all hover:bg-white/15"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}>
                  تسجيل مركز
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="relative z-10 max-w-5xl mx-auto px-5 pb-20">
        <div className="text-center mb-8">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">ميزاتنا</p>
          <h2 className="text-2xl font-black text-white">منصة متكاملة من الألف إلى الياء</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl transition-all hover:scale-[1.03]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <span className="text-2xl mb-2 block">{f.icon}</span>
              <h3 className="text-white font-black text-sm mb-1">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer
        className="relative z-10 py-6 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="text-emerald-400 font-black text-sm">Hayat</span>
          <span className="text-red-500 font-black text-sm">Link</span>
          <span className="text-slate-600 text-sm">— نصل العطاء بالحياة 🩸</span>
        </div>
        <p className="text-slate-700 text-xs">
          © {new Date().getFullYear()} جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}
