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

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/register"
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:-translate-y-1"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 8px 30px rgba(220,38,38,0.4)",
            }}>
            <Droplets className="w-5 h-5" />
            سجّل كمتبرع
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link href="/login"
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-slate-300 font-bold text-lg transition-all hover:text-white hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            تسجيل الدخول
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "متبرع مسجّل", value: "+12,500", color: "#dc2626" },
            { icon: Heart, label: "حياة أُنقذت", value: "+37,000", color: "#10b981" },
            { icon: Activity, label: "مركز دم", value: "85+", color: "#3b82f6" },
            { icon: Shield, label: "عملية تبرع", value: "+45,000", color: "#f59e0b" },
          ].map((stat) => (
            <div key={stat.label} className="stats-card text-center">
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                style={{ background: `${stat.color}18`, color: stat.color }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          أربع واجهات متكاملة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              emoji: "📱",
              title: "تطبيق المتبرعين",
              desc: "التسجيل، الحجز، التذكيرات، الشهادات، النقاط والمكافآت",
              link: "/donor",
              color: "#dc2626",
            },
            {
              emoji: "🩸",
              title: "لوحة مراكز الدم",
              desc: "إدارة المتبرعين، المواعيد، الحملات، وإدارة المخزون",
              link: "/dashboard",
              color: "#3b82f6",
            },
            {
              emoji: "🏥",
              title: "بوابة المستشفيات",
              desc: "طلبات الدم العاجلة، متابعة الاستجابة، اطلع على التوفر الفوري",
              link: "/dashboard",
              color: "#10b981",
            },
            {
              emoji: "⚙️",
              title: "لوحة الإدارة المركزية",
              desc: "إدارة المستخدمين، الإحصائيات، التقارير والتحليلات بالذكاء الاصطناعي",
              link: "/dashboard",
              color: "#8b5cf6",
            },
          ].map((feat) => (
            <Link
              key={feat.title}
              href={feat.link}
              className="stats-card group cursor-pointer flex items-start gap-4"
              style={{ textDecoration: "none" }}
            >
              <div
                className="text-3xl w-14 h-14 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: `${feat.color}15` }}
              >
                {feat.emoji}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-red-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} DONNER.X — منصة التبرع بالدم الوطنية 🩸</p>
      </footer>
    </div>
  );
}
