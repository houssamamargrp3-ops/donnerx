import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MedicalDashboard from "@/components/dashboard/MedicalDashboard";
import DonorDashboard from "@/components/dashboard/DonorDashboard";

export const metadata = {
  title: "لوحة التحكم",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";

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

      {role === "DONOR" ? (
        <DonorDashboard userId={session.user.id!} />
      ) : (
        <MedicalDashboard />
      )}
    </div>
  );
}
