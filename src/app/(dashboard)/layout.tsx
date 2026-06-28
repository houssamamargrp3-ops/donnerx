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
    <div className="flex h-screen overflow-hidden" style={{ background: "#0a0a12" }}>
      <DashboardSidebar role={(session.user as any)?.role || "DONOR"} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "#0a0a12" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
