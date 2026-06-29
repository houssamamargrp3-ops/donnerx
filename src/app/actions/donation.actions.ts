"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function recordDonation(formData: FormData) {
  try {
    const appointmentId = formData.get("appointmentId") as string;
    const centerId = formData.get("centerId") as string;
    const donorId = formData.get("donorId") as string;
    const volumeMl = parseInt(formData.get("volumeMl") as string, 10);
    const bloodType = formData.get("bloodType") as any; // From form (enum)
    const notes = formData.get("notes") as string;
    const staffId = formData.get("staffId") as string;
    
    // Custom Next Eligible Date (default is 3 months from now, but can be overridden)
    const nextEligibleDateStr = formData.get("nextEligibleDate") as string;
    const nextEligibleDate = new Date(nextEligibleDateStr);

    if (!centerId || !donorId || !volumeMl || !bloodType) {
      return { error: "يرجى تعبئة جميع الحقول الإلزامية." };
    }

    // Wrap in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Donation Record
      const donation = await tx.donation.create({
        data: {
          donorId,
          centerId,
          appointmentId,
          staffId,
          bloodType,
          volumeMl,
          notes,
          nextDonationDate: nextEligibleDate,
        },
      });

      // 2. Generate a unique Certificate Serial Number (e.g. DX-YYYYMMDD-Random)
      const datePart = new Date().toISOString().slice(0,10).replace(/-/g, "");
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const serialNumber = `DX-${datePart}-${randomPart}`;

      // 3. Create Certificate
      const certificate = await tx.certificate.create({
        data: {
          donorId,
          donationId: donation.id,
          serialNumber,
        }
      });

      // 4. Update Appointment Status to COMPLETED
      if (appointmentId) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: "COMPLETED" },
        });
      }

      // 5. Update Donor's nextEligibleDate and totalDonations
      await tx.donor.update({
        where: { id: donorId },
        data: { 
          nextEligibleDate,
          totalDonations: { increment: 1 } 
        },
      });

      return { donation, certificate };
    });

    revalidatePath("/dashboard/donations");
    revalidatePath("/dashboard/donors");
    revalidatePath("/dashboard/appointments");
    
    return { success: true, donationId: result.donation.id };
  } catch (error: any) {
    console.error("Error recording donation:", error);
    return { error: "حدث خطأ أثناء حفظ التبرع. قد يكون التبرع مسجلاً بالفعل لهذا الموعد." };
  }
}
