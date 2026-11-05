import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FEATURE_FLAGS } from "@/lib/feature-flags";
import ImpactAnalyticsClientView, { ImpactData } from "@/components/dashboard/ImpactAnalyticsClientView";

export const metadata = {
  title: "لوحة قياس الأثر والإحصائيات | HayatLink",
  description: "قياس الأثر الصحي والمجتمعي، إنقاذ الأرواح، والذكاء البيومتري لمنظومة التبرع بالدم",
};

export default async function ImpactPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // ─── 1. Aggregated Core Counts ──────────────────────────────────
  const [
    totalDonations,
    volumeAggregation,
    totalDonors,
    eligibleDonorsCount,
    ineligibleDonorsCount,
    totalCenters,
    totalEmergencies,
    fulfilledEmergencies,
    emergencyResponsesCount,
    rejectedEmergencyCount,
    completedHomeVisits,
    cancelledHomeRequests,
    activeCampaigns,
    recentDonationsList,
    allDonors
  ] = await Promise.all([
    prisma.donation.count(),
    prisma.donation.aggregate({ _sum: { volumeMl: true } }),
    prisma.donor.count(),
    prisma.donor.count({ where: { eligibilityStatus: "ELIGIBLE" } }),
    prisma.donor.count({ where: { eligibilityStatus: "INELIGIBLE" } }),
    prisma.bloodCenter.count(),
    prisma.emergencyRequest.count(),
    prisma.emergencyRequest.count({ where: { status: "FULFILLED" } }),
    prisma.emergencyResponse.count({ where: { status: "CONFIRMED" } }),
    prisma.emergencyResponse.count({ where: { status: "REJECTED" } }),
    prisma.homeDonationRequest.count({ where: { status: "COMPLETED" } }),
    prisma.homeDonationRequest.count({ where: { status: "CANCELLED" } }),
    prisma.campaign.count({ where: { status: "ACTIVE" } }),
    prisma.donation.findMany({
      orderBy: { donatedAt: "desc" },
      take: 8,
      include: {
        center: true,
        donor: true
      }
    }),
    prisma.donor.findMany({
      select: { city: true, bloodType: true }
    })
  ]);

  // Total volume in ml (fallback to 450ml per donation if null)
  const totalVolumeMl = volumeAggregation._sum.volumeMl || (totalDonations * 450);
  const totalLivesSaved = totalDonations * 3;

  // Emergency fulfillment rate
  const emergencyFulfillmentRate =
    totalEmergencies > 0 ? Math.round((fulfilledEmergencies / totalEmergencies) * 100) : 100;

  // Accepted vs. Rejected calculation
  const totalAccepted = totalDonations + emergencyResponsesCount;
  const totalRejected = rejectedEmergencyCount + cancelledHomeRequests + ineligibleDonorsCount;
  const totalEvaluated = totalAccepted + totalRejected;
  const acceptanceRate =
    totalEvaluated > 0 ? Math.round((totalAccepted / totalEvaluated) * 100) : 94;

  // Blood type distribution from donors
  const bloodTypeCounts: Record<string, number> = {};
  allDonors.forEach((d) => {
    bloodTypeCounts[d.bloodType] = (bloodTypeCounts[d.bloodType] || 0) + 1;
  });

  // Top cities breakdown
  const cityMap: Record<string, number> = {};
  allDonors.forEach((d) => {
    if (d.city) {
      cityMap[d.city] = (cityMap[d.city] || 0) + 1;
    }
  });

  const topCities = Object.entries(cityMap)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const formattedRecentDonations = recentDonationsList.map((d) => ({
    id: d.id,
    bloodType: d.bloodType,
    volumeMl: d.volumeMl,
    donatedAt: d.donatedAt.toISOString(),
    centerName: d.center?.name || "مركز نقل الدم الرئيسي",
    donorCode: d.donorId.slice(-4),
  }));

  const impactData: ImpactData = {
    totalDonations,
    totalVolumeMl,
    totalLivesSaved,
    totalDonors,
    eligibleDonorsCount,
    ineligibleDonorsCount,
    totalCenters,
    totalEmergencies,
    fulfilledEmergencies,
    emergencyResponsesCount,
    emergencyFulfillmentRate,
    completedHomeVisits,
    activeCampaigns,
    totalAccepted,
    totalRejected,
    acceptanceRate,
    bloodTypeCounts,
    topCities,
    recentDonations: formattedRecentDonations,
  };

  return (
    <ImpactAnalyticsClientView
      data={impactData}
    />
  );
}
