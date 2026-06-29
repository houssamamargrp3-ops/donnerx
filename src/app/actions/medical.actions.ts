"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function registerDonation(appointmentId: string) {
  try {
    const session = await auth();
    // In a real app, verify that session.user is HOSPITAL_STAFF or CENTER_STAFF
    if (!session?.user) {
      return { error: "غير مصرح لك بتنفيذ هذه العملية" };
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { donor: true }
    });

    if (!appointment) {
      return { error: "الموعد غير موجود" };
    }

    if (appointment.status === "COMPLETED") {
      return { error: "تم تسجيل هذا التبرع مسبقاً" };
    }

    // Process Donation transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark appointment as completed
      await tx.appointment.update({
        where: { id: appointmentId },
        data: { status: "COMPLETED", confirmedAt: new Date() }
      });

      // 2. Create Donation Record
      const donation = await tx.donation.create({
        data: {
          donorId: appointment.donorId,
          centerId: appointment.centerId,
          appointmentId: appointment.id,
          bloodType: appointment.donor.bloodType,
          volumeMl: 450, // Standard blood bag volume
          donatedAt: new Date(),
          nextDonationDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000) // 56 days (8 weeks) later
        }
      });

      // 3. Update Donor Points & Stats
      const newTotalDonations = appointment.donor.totalDonations + 1;
      const newLevel = Math.floor(newTotalDonations / 5) + 1;
      const pointsEarned = 100;

      await tx.donor.update({
        where: { id: appointment.donorId },
        data: {
          totalDonations: newTotalDonations,
          lastDonationDate: new Date(),
          points: { increment: pointsEarned },
          level: newLevel,
          eligibilityStatus: "INELIGIBLE", // They just donated, so they are ineligible for 56 days
          nextEligibleDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000)
        }
      });

      // 4. Create Notification for the Donor
      await tx.notification.create({
        data: {
          userId: appointment.donor.userId,
          title: "شكراً لتبرعك! 🎉",
          message: `لقد أتممت تبرعك بنجاح وحصلت على ${pointsEarned} نقطة. شكراً لمساهمتك في إنقاذ الأرواح.`,
          type: "DONATION_RECORDED"
        }
      });

      return donation;
    });

    revalidatePath("/dashboard");
    return { success: true, message: "تم تسجيل التبرع وصرف النقاط بنجاح!" };

  } catch (error: any) {
    console.error("Error registering donation:", error);
    return { error: "حدث خطأ أثناء تسجيل التبرع" };
  }
}
