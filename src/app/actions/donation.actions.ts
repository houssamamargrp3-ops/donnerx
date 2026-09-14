"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function recordDonation(formData: FormData) {
  try {
    const rawAppointmentId = formData.get("appointmentId") as string;
    const appointmentId = rawAppointmentId && rawAppointmentId.trim() !== "" ? rawAppointmentId.trim() : null;
    const centerId = (formData.get("centerId") as string)?.trim();
    const donorId = (formData.get("donorId") as string)?.trim();
    const volumeMl = parseInt(formData.get("volumeMl") as string, 10) || 450;
    const bloodType = formData.get("bloodType") as any; // From form (enum)
    const notes = (formData.get("notes") as string)?.trim() || null;
    const staffId = (formData.get("staffId") as string)?.trim() || null;
    
    // Custom Next Eligible Date (default is 3 months from now, but can be overridden)
    const nextEligibleDateStr = formData.get("nextEligibleDate") as string;
    let nextEligibleDate = new Date();
    if (nextEligibleDateStr) {
      nextEligibleDate = new Date(nextEligibleDateStr);
    } else {
      nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3);
    }

    if (!centerId || !donorId || !volumeMl || !bloodType) {
      return { error: "يرجى تعبئة جميع الحقول الإلزامية (المتبرع، المركز، الفصيلة، الكمية)." };
    }

    // Wrap in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Donation Record
      const donation = await tx.donation.create({
        data: {
          donorId,
          centerId,
          appointmentId: appointmentId || undefined,
          staffId: staffId || undefined,
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

      // 4. Update Appointment Status to COMPLETED if linked
      if (appointmentId) {
        await tx.appointment.update({
          where: { id: appointmentId },
          data: { status: "COMPLETED" },
        }).catch((err) => {
          console.warn("Non-fatal: could not update appointment status", err);
        });
      }

      // 4.5. Update Inventory automatically
      await tx.bloodInventory.upsert({
        where: {
          centerId_bloodType: {
            centerId,
            bloodType,
          },
        },
        update: {
          units: { increment: 1 },
        },
        create: {
          centerId,
          bloodType,
          units: 1,
          minThreshold: 10,
        },
      });

      // 5. Update Donor's points, totalDonations, status and nextEligibleDate
      const updatedDonor = await tx.donor.update({
        where: { id: donorId },
        data: { 
          nextEligibleDate,
          lastDonationDate: new Date(),
          eligibilityStatus: "INELIGIBLE",
          eligibilityReason: "لقد تبرعت حديثاً بالدم. موعدك القادم متاح بعد 3 أشهر.",
          points: { increment: 100 },
          totalDonations: { increment: 1 } 
        },
      });

      // 6. Create in-app Notification for the Donor
      if (updatedDonor.userId) {
        await tx.notification.create({
          data: {
            userId: updatedDonor.userId,
            type: "DONATION_RECORDED",
            title: "🎉 شكراً لك! تم توثيق تبرعك بالدم بنجاح",
            message: `تم تسجيل تبرعك بنجاح وحصلت على +100 نقطة. شهادة الشكر والتقدير برقم (${serialNumber}) جاهزة الآن في سجل التبرعات.`,
          }
        }).catch(() => {});
      }

      return { donation, certificate };
    });

    revalidatePath("/dashboard/donations");
    revalidatePath("/dashboard/donors");
    revalidatePath("/dashboard/appointments");
    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard");
    
    return { success: true, donationId: result.donation.id };
  } catch (error: any) {
    console.error("Error recording donation:", error);
    return { error: `حدث خطأ أثناء حفظ التبرع: ${error.message || "تأكد من صحة البيانات المدخلة."}` };
  }
}
