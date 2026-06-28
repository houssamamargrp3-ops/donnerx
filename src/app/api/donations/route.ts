import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { donorId, appointmentId, centerId, volume, bloodType, hemoglobin, bloodPressure } = await request.json();

    if (!donorId || !appointmentId || !centerId || !volume || !hemoglobin || !bloodPressure) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Process Donation transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Donation Record
      const donation = await tx.donation.create({
        data: {
          donorId,
          centerId,
          bloodType,
          volumeMl: volume,
          notes: `Hemoglobin: ${hemoglobin}, BP: ${bloodPressure}`,
        }
      });

      // 2. Update Appointment Status to COMPLETED
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "COMPLETED" }
      });

      // 3. Update Donor Details (add points, increment total, set next eligible date)
      const nextEligibleDate = new Date();
      nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 2); // 2 months waiting period

      const updatedDonor = await tx.donor.update({
        where: { id: donorId },
        data: {
          points: { increment: 100 }, // +100 points for donating
          totalDonations: { increment: 1 },
          lastDonationDate: new Date(),
          eligibilityStatus: "INELIGIBLE",
          eligibilityReason: "لقد تبرعت حديثاً. يجب الانتظار لمدة شهرين.",
          nextEligibleDate,
        }
      });

      // 4. Update Blood Inventory for this center
      const inventory = await tx.bloodInventory.findFirst({
        where: { centerId, bloodType }
      });

      if (inventory) {
        await tx.bloodInventory.update({
          where: { id: inventory.id },
          data: { units: { increment: 1 } }
        });
      } else {
        await tx.bloodInventory.create({
          data: {
            centerId,
            bloodType,
            units: 1,
            minThreshold: 10, // Example threshold
          }
        });
      }

      // 5. Create Notification for Donor with a certificate link
      await tx.notification.create({
        data: {
          userId: updatedDonor.userId,
          type: "DONATION_RECORDED",
          title: "شكراً لك يا بطل!",
          message: `تم تسجيل تبرعك بنجاح وحصلت على 100 نقطة. يمكنك الآن تحميل شهادة الشكر الخاصة بك من سجل التبرعات.`,
        }
      });

      return donation;
    });

    return NextResponse.json({ success: true, donation: result });
  } catch (error: any) {
    console.error("Error creating donation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
