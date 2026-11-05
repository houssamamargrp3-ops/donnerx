import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/donors/[id]/decision
// Staff decision to ACCEPT or REJECT a donor upon physical/QR verification
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    if (!["ADMIN", "SUPER_ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id: donorId } = await params;
    const body = await req.json();
    const { action, reason, notes, weight, bloodPressure, hemoglobin } = body;

    const donor = await prisma.donor.findUnique({
      where: { id: donorId },
      include: { user: true },
    });

    if (!donor) {
      return NextResponse.json({ error: "المتبرع غير موجود" }, { status: 404 });
    }

    if (action === "REJECT") {
      const rejectionReason = reason?.trim() || "غير لائق طبياً للتبرع حالياً بناءً على فحص المركز الطبي الميداني";
      const nextDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default deferral

      await prisma.$transaction([
        // 1. Create negative EligibilityCheck record
        prisma.eligibilityCheck.create({
          data: {
            donorId,
            age: Math.floor((Date.now() - new Date(donor.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
            weight: Number(weight) || donor.weight || 70,
            hemoglobin: hemoglobin ? Number(hemoglobin) : null,
            isPregnant: false,
            recentSurgery: false,
            hasRecentTattoo: false,
            isEligible: false,
            reason: rejectionReason,
            nextEligibleDate: nextDate,
          },
        }),
        // 2. Update Donor to INELIGIBLE
        prisma.donor.update({
          where: { id: donorId },
          data: {
            eligibilityStatus: "INELIGIBLE",
            eligibilityReason: rejectionReason,
            nextEligibleDate: nextDate,
            ...(weight ? { weight: Number(weight) } : {}),
          },
        }),
        // 3. Send notification to donor
        prisma.notification.create({
          data: {
            userId: donor.userId,
            type: "GENERAL",
            title: "تحديث الأهلية الطبية للتبرع",
            message: `نأسف لإبلاغك بأنه تعذر قبول التبرع حالياً بسبب: (${rejectionReason}). يمكنك إعادة الفحص لاحقاً.`,
          },
        }),
      ]);

      return NextResponse.json({ success: true, status: "INELIGIBLE", reason: rejectionReason });
    }

    if (action === "ACCEPT") {
      await prisma.$transaction([
        // 1. Create positive EligibilityCheck record
        prisma.eligibilityCheck.create({
          data: {
            donorId,
            age: Math.floor((Date.now() - new Date(donor.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
            weight: Number(weight) || donor.weight || 70,
            hemoglobin: hemoglobin ? Number(hemoglobin) : null,
            isPregnant: false,
            recentSurgery: false,
            hasRecentTattoo: false,
            isEligible: true,
            reason: notes || "تم الفحص السريري والتأكيد بنجاح",
            nextEligibleDate: null,
          },
        }),
        // 2. Update Donor to ELIGIBLE
        prisma.donor.update({
          where: { id: donorId },
          data: {
            eligibilityStatus: "ELIGIBLE",
            eligibilityReason: null,
            ...(weight ? { weight: Number(weight) } : {}),
          },
        }),
        // 3. Send notification to donor
        prisma.notification.create({
          data: {
            userId: donor.userId,
            type: "GENERAL",
            title: "✅ تم تأكيد أهليتك الطبية للتبرع!",
            message: `تم فحص بياناتك واعتماد أهليتك الطبية للتبرع بالدم. شكراً لاهتمامك بإنقاذ الأرواح.`,
          },
        }),
      ]);

      return NextResponse.json({ success: true, status: "ELIGIBLE" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Donor decision error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
