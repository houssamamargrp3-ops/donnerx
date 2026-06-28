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
    <div className="min-h-screen bg-[#f1f5f9]">
      <DashboardHeader user={session.user} />
      <div className="flex pt-16">
        {/* The sidebar is fixed right, so we need pr-64 on main content to offset it */}
        <DashboardSidebar role={(session.user as any)?.role || "DONOR"} />
        
        {/* Main Content Area */}
        <main className="flex-1 pr-64 w-full">
          {/* A container to keep content centered or padded nicely */}
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
