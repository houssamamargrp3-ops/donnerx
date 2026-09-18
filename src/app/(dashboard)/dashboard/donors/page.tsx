import { prisma } from "@/lib/prisma";
import DonorsRegistryView from "./DonorsRegistryView";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const metadata = { title: "سجل المتبرعين والمسجلين | HayatLink" };

export default async function DonorsPage() {
  const rawDonors = await prisma.donor.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  // Format dates safely for client component
  const donors = rawDonors.map((donor) => ({
    ...donor,
    lastDonationDate: donor.lastDonationDate ? donor.lastDonationDate.toISOString() : null,
    nextEligibleDate: donor.nextEligibleDate ? donor.nextEligibleDate.toISOString() : null,
  }));

  return <DonorsRegistryView donors={donors as any} />;
}
