import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CampaignsClient from "./CampaignsClient";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "إدارة الحملات" };

export default async function CampaignsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role || "DONOR";

  const campaigns = await prisma.campaign.findMany({
    orderBy: { startDate: 'desc' }
  });

  return <CampaignsClient initialCampaigns={campaigns} userRole={role} />;
}
