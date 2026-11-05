import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// PATCH /api/emergency/[id]/response-status
// Update status of an emergency response (PENDING → ARRIVED / CONFIRMED / REJECTED)
// If CONFIRMED: records the official donation, awards points, issues certificate, updates inventory
// If REJECTED: records rejection reason, updates donor eligibility status, creates notification
export async function PATCH(
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

    const { id: requestId } = await params;
    const body = await req.json();
    const { responseId, status, rejectionReason, volumeMl = 450 } = body;

    if (!responseId || !status) {
      return NextResponse.json({ error: "Missing responseId or status" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "ARRIVED", "CONFIRMED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const emergencyResponse = await prisma.emergencyResponse.findUnique({
      where: { id: responseId },
      include: {
        donor: { include: { user: true } },
        request: true,
      },
    });

    if (!emergencyResponse) {
      return NextResponse.json({ error: "استجابة النداء غير موجودة" }, { status: 404 });
    }

    const donor = emergencyResponse.donor;
    const emergencyReq = emergencyResponse.request;

    // ─── Status: CONFIRMED (Accepted & Donation Recorded) ───
    if (status === "CONFIRMED") {
      // Find or assign blood center
      const center = await prisma.bloodCenter.findFirst({
        where: { isActive: true },
      });

      const centerId = center?.id || (await prisma.bloodCenter.findFirst())?.id;

      await prisma.$transaction(async (tx) => {
        // 1. Update response status
        await tx.emergencyResponse.update({
          where: { id: responseId },
          data: { status: "CONFIRMED" },
        });

        if (centerId) {
          // 2. Create official Donation
          const donation = await tx.donation.create({
            data: {
              donorId: donor.id,
              centerId,
              bloodType: donor.bloodType,
              volumeMl: Number(volumeMl) || 450,
              donatedAt: new Date(),
              notes: `تبرع استجابة لنداء طوارئ عاجل: ${emergencyReq.hospitalName}`,
              nextDonationDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000),
            },
          });

          // 3. Generate Certificate
          const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
          const randomPart = Math.floor(1000 + Math.random() * 9000);
          const serialNumber = `DX-EMG-${datePart}-${randomPart}`;

          await tx.certificate.create({
            data: {
              donorId: donor.id,
              donationId: donation.id,
              serialNumber,
            },
          });

          // 4. Update Inventory
          await tx.bloodInventory.upsert({
            where: {
              centerId_bloodType: {
                centerId,
                bloodType: donor.bloodType,
              },
            },
            update: { units: { increment: 1 } },
            create: {
              centerId,
              bloodType: donor.bloodType,
              units: 1,
              minThreshold: 10,
            },
          });
        }

        // 5. Update Donor stats
        const nextDate = new Date(Date.now() + 56 * 24 * 60 * 60 * 1000);
        await tx.donor.update({
          where: { id: donor.id },
          data: {
            totalDonations: { increment: 1 },
            points: { increment: 150 }, // Bonus points for emergency response
            lastDonationDate: new Date(),
            eligibilityStatus: "INELIGIBLE",
            eligibilityReason: "لقد تبرعت حديثاً استجابة لنداء عاجل. موعدك القادم بعد 8 أسابيع.",
            nextEligibleDate: nextDate,
          },
        });

        // 6. Notification to donor
        if (donor.userId) {
          await tx.notification.create({
            data: {
              userId: donor.userId,
              type: "DONATION_RECORDED",
              title: "🎉 بطل حقيقي! تم توثيق تبرعك العاجل بنجاح",
              message: `شكراً لعطائك العظيم! تم تسجيل تبرعك استجابة لنداء مستشفى ${emergencyReq.hospitalName} وحصلت على +150 نقطة شرفية.`,
            },
          }).catch(() => {});
        }
      });

      return NextResponse.json({ success: true, status: "CONFIRMED" });
    }

    // ─── Status: REJECTED (Refused / Medically Ineligible) ───
    if (status === "REJECTED") {
      const reasonText = rejectionReason?.trim() || "غير لائق طبياً للتبرع حالياً بعد الفحص السريري للنداء العاجل";

      await prisma.$transaction(async (tx) => {
        // 1. Update response status
        await tx.emergencyResponse.update({
          where: { id: responseId },
          data: { status: "REJECTED" },
        });

        // 2. Mark donor as ineligible
        await tx.donor.update({
          where: { id: donor.id },
          data: {
            eligibilityStatus: "INELIGIBLE",
            eligibilityReason: reasonText,
            nextEligibleDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Re-check after 2 weeks
          },
        });

        // 3. Create EligibilityCheck record
        await tx.eligibilityCheck.create({
          data: {
            donorId: donor.id,
            age: Math.floor((Date.now() - new Date(donor.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)),
            weight: donor.weight || 70,
            isPregnant: false,
            recentSurgery: false,
            hasRecentTattoo: false,
            isEligible: false,
            reason: reasonText,
            nextEligibleDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });

        // 4. Notification to donor
        if (donor.userId) {
          await tx.notification.create({
            data: {
              userId: donor.userId,
              type: "GENERAL",
              title: "⚠️ تحديث حالة التبرع بالنداء العاجل",
              message: `نعتذر منك بطلنا، تعذر إتمام التبرع للنداء العاجل بسبب: (${reasonText}). صحتك تهمنا أولاً.`,
            },
          }).catch(() => {});
        }
      });

      return NextResponse.json({ success: true, status: "REJECTED" });
    }

    // ─── Status: ARRIVED or PENDING ───
    const updated = await prisma.emergencyResponse.update({
      where: { id: responseId },
      data: { status },
    });

    return NextResponse.json({ success: true, response: updated });
  } catch (error: any) {
    console.error("Emergency response status update error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
