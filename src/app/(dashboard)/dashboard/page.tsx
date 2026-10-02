import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MedicalDashboard from "@/components/dashboard/MedicalDashboard";
import DonorDashboard from "@/components/dashboard/DonorDashboard";
import { Sparkles, CalendarDays } from "lucide-react";

export const metadata = {
  title: "لوحة التحكم | HayatLink",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";
  const isDonor = role === "DONOR";

  const dayGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "صباح الخير";
    if (h < 17) return "مساء النور";
    return "مساء الخير";
  };

  const dateStr = new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl px-5 py-4 flex items-center justify-between overflow-hidden relative"
        style={{
          background: isDonor
            ? "linear-gradient(135deg, #0f172a 0%, #1a0a14 50%, #0f0f1a 100%)"
            : "linear-gradient(135deg, #0f172a 0%, #0a0f1a 50%, #0f172a 100%)",
          border: isDonor ? "1px solid rgba(220,38,38,0.2)" : "1px solid rgba(59,130,246,0.2)",
          boxShadow: isDonor
            ? "0 4px 24px rgba(220,38,38,0.1)"
            : "0 4px 24px rgba(59,130,246,0.1)",
        }}
      >
        {/* Glow blob */}
        <div
          className="absolute left-0 top-0 w-40 h-full pointer-events-none"
          style={{
            background: isDonor
              ? "radial-gradient(circle at 0% 50%, rgba(220,38,38,0.15), transparent)"
              : "radial-gradient(circle at 0% 50%, rgba(59,130,246,0.12), transparent)",
          }}
        />

        <div className="relative z-10">
          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-0.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {dateStr}
          </p>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {dayGreeting()}،{" "}
            <span className={isDonor ? "text-red-400" : "text-blue-400"}>
              {session.user.name?.split(" ")[0] || "أهلاً"} 👋
            </span>
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-medium">
            {isDonor
              ? "أنت بطل يُنقذ الأرواح — كل تبرع يصنع الفارق 🩸"
              : "مرحباً بك في لوحة تحكم المركز الطبي"}
          </p>
        </div>

        <div className="relative z-10 hidden sm:flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: isDonor ? "rgba(220,38,38,0.15)" : "rgba(59,130,246,0.15)",
              border: isDonor ? "1px solid rgba(220,38,38,0.3)" : "1px solid rgba(59,130,246,0.3)",
            }}
          >
            <Sparkles className={`w-6 h-6 ${isDonor ? "text-red-400" : "text-blue-400"}`} />
          </div>
        </div>
      </div>

      {role === "DONOR" ? (
        <DonorDashboard userId={session.user.id!} />
      ) : (
        <MedicalDashboard />
      )}
    </div>
  );
}
