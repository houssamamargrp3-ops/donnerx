import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Users,
  CalendarDays,
  Droplet,
  AlertTriangle,
  TrendingUp,
  Activity,
  Heart,
  Award,
} from "lucide-react";

export const metadata = {
  title: "لوحة التحكم",
};

async function getDashboardStats(userId: string, role: string) {
  const [totalDonors, totalAppointments, totalDonations, emergencyRequests] =
    await Promise.all([
      prisma.donor.count(),
      prisma.appointment.count({
        where: { scheduledAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.donation.count(),
      prisma.emergencyRequest.count({ where: { status: "OPEN" } }),
    ]);

  return { totalDonors, totalAppointments, totalDonations, emergencyRequests };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";
  const stats = await getDashboardStats(session.user.id!, role).catch(() => ({
    totalDonors: 0,
    totalAppointments: 0,
    totalDonations: 0,
    emergencyRequests: 0,
  }));

  const cards = [
    {
      icon: Users,
      label: "إجمالي المتبرعين",
      value: stats.totalDonors.toLocaleString("ar"),
      change: "+12% هذا الشهر",
      positive: true,
      color: "#dc2626",
    },
    {
      icon: CalendarDays,
      label: "حجوزات اليوم",
      value: stats.totalAppointments.toLocaleString("ar"),
      change: "موعد مؤكد",
      positive: true,
      color: "#3b82f6",
    },
    {
      icon: Droplet,
      label: "إجمالي التبرعات",
      value: stats.totalDonations.toLocaleString("ar"),
      change: "+8% هذا الأسبوع",
      positive: true,
      color: "#10b981",
    },
    {
      icon: AlertTriangle,
      label: "طلبات عاجلة مفتوحة",
      value: stats.emergencyRequests.toLocaleString("ar"),
      change: "يحتاج استجابة",
      positive: false,
      color: "#f59e0b",
    },
  ];

  const bloodTypes = [
    { type: "O+", units: 245, max: 400, color: "#dc2626" },
    { type: "A+", units: 180, max: 400, color: "#ef4444" },
    { type: "B+", units: 92, max: 400, color: "#f87171" },
    { type: "AB+", units: 45, max: 400, color: "#fca5a5" },
    { type: "O-", units: 28, max: 400, color: "#b91c1c" },
    { type: "A-", units: 67, max: 400, color: "#991b1b" },
    { type: "B-", units: 34, max: 400, color: "#7f1d1d" },
    { type: "AB-", units: 19, max: 400, color: "#450a0a" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          مرحباً، {session.user.name} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {new Intl.DateTimeFormat("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date())}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="stats-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm">{card.label}</p>
                <p className="text-3xl font-black text-white mt-1">{card.value}</p>
                <p
                  className="text-xs mt-2 font-medium"
                  style={{ color: card.positive ? "#10b981" : "#f59e0b" }}
                >
                  {card.positive ? "↑" : "⚠"} {card.change}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}18`, color: card.color }}
              >
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blood Inventory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 stats-card">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-400" />
            مخزون الدم — نظرة عامة
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {bloodTypes.map((bt) => (
              <div key={bt.type} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-white text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${bt.color}, ${bt.color}99)`,
                    boxShadow: `0 4px 15px ${bt.color}40`,
                  }}
                >
                  {bt.type}
                </div>
                <div className="text-white font-bold text-sm">{bt.units}</div>
                <div className="text-slate-500 text-xs">وحدة</div>
                <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(bt.units / bt.max) * 100}%`,
                      background: bt.units < 50 ? "#ef4444" : bt.units < 100 ? "#f59e0b" : "#10b981",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="stats-card">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            إجراءات سريعة
          </h2>
          <div className="space-y-3">
            {[
              { label: "إضافة متبرع", href: "/dashboard/donors/new", color: "#dc2626" },
              { label: "حجز موعد", href: "/dashboard/appointments/new", color: "#3b82f6" },
              { label: "تسجيل تبرع", href: "/dashboard/donations/new", color: "#10b981" },
              { label: "طلب عاجل", href: "/dashboard/emergency/new", color: "#f59e0b" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:-translate-y-0.5"
                style={{
                  background: `${action.color}10`,
                  border: `1px solid ${action.color}20`,
                  textDecoration: "none",
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: action.color }}
                />
                <span className="text-slate-300 text-sm font-medium">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="stats-card">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          النشاط الأخير
        </h2>
        <div className="space-y-3">
          {[
            { action: "تسجيل تبرع جديد", user: "محمد أحمد", time: "منذ 5 دقائق", type: "donation" },
            { action: "حجز موعد", user: "فاطمة علي", time: "منذ 12 دقيقة", type: "appointment" },
            { action: "طلب دم عاجل — O+", user: "مستشفى الملك فهد", time: "منذ 18 دقيقة", type: "emergency" },
            { action: "تسجيل متبرع جديد", user: "عبدالله سالم", time: "منذ 25 دقيقة", type: "donor" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                style={{
                  background:
                    item.type === "donation" ? "rgba(220,38,38,0.15)" :
                    item.type === "appointment" ? "rgba(59,130,246,0.15)" :
                    item.type === "emergency" ? "rgba(245,158,11,0.15)" :
                    "rgba(16,185,129,0.15)",
                  color:
                    item.type === "donation" ? "#ef4444" :
                    item.type === "appointment" ? "#60a5fa" :
                    item.type === "emergency" ? "#fbbf24" :
                    "#34d399",
                }}
              >
                {item.type === "donation" ? "🩸" : item.type === "appointment" ? "📅" : item.type === "emergency" ? "🚨" : "👤"}
              </div>
              <div className="flex-1">
                <p className="text-slate-200 text-sm font-medium">{item.action}</p>
                <p className="text-slate-500 text-xs">{item.user}</p>
              </div>
              <span className="text-slate-600 text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
