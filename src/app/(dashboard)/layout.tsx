import { auth } from "@/lib/auth";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/Header";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <DashboardHeader user={session.user} />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar role={(session.user as any)?.role || "DONOR"} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
