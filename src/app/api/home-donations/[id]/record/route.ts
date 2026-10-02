import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      volume,
      hemoglobin,
      bloodPressure,
      weight,
      pulse,
      temperature,
      examinationNotes,
    } = body;

    if (!volume || !hemoglobin || !bloodPressure) {
      return NextResponse.json(
        { error: "الرجاء إدخال حجم الدم، قياس الهيموجلوبين، وضغط الدم" },
        { status: 400 }
      );
    }

    const homeRequest = await prisma.homeDonationRequest.findUnique({
      where: { id },
      include: { donor: true },
    });

    if (!homeRequest) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    // Find main center to associate for inventory (e.g. Central Blood Bank)
    let center = await prisma.bloodCenter.findFirst();
    if (!center) {
      center = await prisma.bloodCenter.create({
        data: {
          name: "وحدة التبرع المنزلي - المركز الرئيسي",
          address: "المركز الرئيسي لنقل الدم",
          city: homeRequest.city || "الرياض",
          capacity: 50,
        },
      });
    }

    // Execute atomic transaction for on-site donation completion & rewards
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Home Donation Request Status
      const updatedRequest = await tx.homeDonationRequest.update({
        where: { id },
        data: {
          status: "COMPLETED",
          isExamined: true,
          examinationNotes: `Hb: ${hemoglobin}, BP: ${bloodPressure}, Pulse: ${pulse || '-'}, Temp: ${temperature || '-'}, Weight: ${weight || '-'}kg. ${examinationNotes || ''}`,
          completedAt: new Date(),
        },
      });

      // 2. Create Donation Record
      const donation = await tx.donation.create({
        data: {
          donorId: homeRequest.donorId,
          centerId: center.id,
          homeRequestId: homeRequest.id,
          bloodType: homeRequest.bloodType,
          volumeMl: Number(volume) || 450,
          notes: `تبرع منزلي رقم (${homeRequest.bookingNumber}). Hb: ${hemoglobin}, BP: ${bloodPressure}`,
        },
      });

      // 3. Issue Digital Certificate of Appreciation
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const serialNumber = `HD-CERT-${datePart}-${randomPart}`;

      await tx.certificate.create({
        data: {
          donorId: homeRequest.donorId,
          donationId: donation.id,
          serialNumber,
        },
      });

      // 4. Update Donor Profile (Add +100 Points, Increment Total Donations, Level progression)
      const nextEligibleDate = new Date();
      nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 2); // 2 months eligibility rest

      const updatedDonor = await tx.donor.update({
        where: { id: homeRequest.donorId },
        data: {
          points: { increment: 100 },
          totalDonations: { increment: 1 },
          lastDonationDate: new Date(),
          eligibilityStatus: "INELIGIBLE",
          eligibilityReason: "تم التبرع المنزلي بنجاح. يجب الانتظار لمدة شهرين للتبرع القادم.",
          nextEligibleDate,
        },
      });

      // Recalculate Donor Level
      const newTotal = updatedDonor.totalDonations;
      let newLevel = 1;
      if (newTotal >= 10) newLevel = 4; // Legendary
      else if (newTotal >= 5) newLevel = 3; // Gold
      else if (newTotal >= 3) newLevel = 2; // Silver

      if (newLevel !== updatedDonor.level) {
        await tx.donor.update({
          where: { id: updatedDonor.id },
          data: { level: newLevel },
        });
      }

      // 5. Update Blood Inventory
      const inventory = await tx.bloodInventory.findFirst({
        where: { centerId: center.id, bloodType: homeRequest.bloodType },
      });

      if (inventory) {
        await tx.bloodInventory.update({
          where: { id: inventory.id },
          data: { units: { increment: 1 } },
        });
      } else {
        await tx.bloodInventory.create({
          data: {
            centerId: center.id,
            bloodType: homeRequest.bloodType,
            units: 1,
            minThreshold: 10,
          },
        });
      }

      // 6. Notify Donor
      await tx.notification.create({
        data: {
          userId: updatedDonor.userId,
          type: "DONATION_RECORDED",
          title: "تم توثيق تبرعك المنزلي بنجاح 🏠🏅",
          message: `شكراً لك! تم توثيق كيس الدم المجمع في منزلك وحصلت على +100 نقطة وتم إصدار شهادة شكر رقمية رصيداً لإنجازك الإنساني.`,
        },
      });

      return { donation, request: updatedRequest };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Error recording home donation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
