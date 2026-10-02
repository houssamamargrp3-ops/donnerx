import { auth } from "@/lib/auth";
import HomeDonationsAdminView from "@/components/dashboard/HomeDonationsAdminView";
import { redirect } from "next/navigation";

export default async function HomeDonationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role || "DONOR";

  return <HomeDonationsAdminView role={role} />;
}
