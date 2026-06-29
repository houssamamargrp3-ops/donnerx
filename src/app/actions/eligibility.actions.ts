"use server";

import { prisma } from "@/lib/prisma";
import { eligibilitySchema, EligibilityFormData } from "@/lib/validations/eligibility";
import { revalidatePath } from "next/cache";

export async function submitEligibilityCheck(data: EligibilityFormData) {
  try {
    const validatedData = eligibilitySchema.parse(data);
    const { donorId, ...checkData } = validatedData;

    const donor = await prisma.donor.findUnique({ where: { id: donorId } });
    if (!donor) return { error: "المتبرع غير موجود" };

    // --- Medical Algorithm ---
    let isEligible = true;
    let reasons: string[] = [];
    let waitMonths = 0; // Temporary deferral duration

    // 1. Age and Weight (Zod already catches basic bounds, but we check explicitly for reasons)
    if (checkData.age < 18 || checkData.age > 65) {
      isEligible = false;
      reasons.push(`العمر (${checkData.age}) غير مسموح به`);
    }
    if (checkData.weight < 50) {
      isEligible = false;
      reasons.push(`الوزن (${checkData.weight} كجم) أقل من الحد الأدنى (50 كجم)`);
    }

    // 2. Hemoglobin (General rule: < 12.5 is ineligible)
    if (checkData.hemoglobin && checkData.hemoglobin < 12.5) {
      isEligible = false;
      reasons.push(`الهيموغلوبين (${checkData.hemoglobin}) أقل من 12.5`);
      waitMonths = Math.max(waitMonths, 1); // Defer for 1 month
    }

    // 3. Blood Pressure
    if (checkData.bloodPressureSystolic && (checkData.bloodPressureSystolic < 100 || checkData.bloodPressureSystolic > 160)) {
      isEligible = false;
      reasons.push(`الضغط الانقباضي (${checkData.bloodPressureSystolic}) غير طبيعي`);
    }
    if (checkData.bloodPressureDiastolic && (checkData.bloodPressureDiastolic < 60 || checkData.bloodPressureDiastolic > 100)) {
      isEligible = false;
      reasons.push(`الضغط الانبساطي (${checkData.bloodPressureDiastolic}) غير طبيعي`);
    }

    // 4. Medical History Boolean Flags
    if (checkData.isPregnant) {
      isEligible = false;
      reasons.push("الحمل أو الرضاعة");
      waitMonths = Math.max(waitMonths, 6); 
    }
    if (checkData.recentSurgery) {
      isEligible = false;
      reasons.push("عملية جراحية قريبة");
      waitMonths = Math.max(waitMonths, 6);
    }
    if (checkData.hasRecentTattoo) {
      isEligible = false;
      reasons.push("وشم أو حجامة قريبة");
      waitMonths = Math.max(waitMonths, 6);
    }

    // Format final reason string
    const finalReason = reasons.length > 0 ? reasons.join("، ") : null;

    // Calculate next eligible date if temporarily deferred
    let nextEligibleDate: Date | null = null;
    if (!isEligible && waitMonths > 0) {
      nextEligibleDate = new Date();
      nextEligibleDate.setMonth(nextEligibleDate.getMonth() + waitMonths);
    }

    // Create EligibilityCheck record and update Donor in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the record
      const checkRecord = await tx.eligibilityCheck.create({
        data: {
          donorId,
          age: checkData.age,
          weight: checkData.weight,
          bloodPressureSystolic: checkData.bloodPressureSystolic,
          bloodPressureDiastolic: checkData.bloodPressureDiastolic,
          hemoglobin: checkData.hemoglobin,
          isPregnant: checkData.isPregnant,
          recentSurgery: checkData.recentSurgery,
          hasRecentTattoo: checkData.hasRecentTattoo,
          chronicConditions: checkData.chronicConditions ? checkData.chronicConditions.split(",").map(c => c.trim()).filter(Boolean) : [],
          currentMedications: checkData.currentMedications ? checkData.currentMedications.split(",").map(c => c.trim()).filter(Boolean) : [],
          recentTravel: checkData.recentTravel || null,
          isEligible,
          reason: finalReason,
          nextEligibleDate
        }
      });

      // Update Donor Status
      await tx.donor.update({
        where: { id: donorId },
        data: {
          eligibilityStatus: isEligible ? "ELIGIBLE" : "INELIGIBLE",
          eligibilityReason: finalReason,
          nextEligibleDate: nextEligibleDate,
          // Always keep their weight up to date
          weight: checkData.weight,
        }
      });

      return checkRecord;
    });

    revalidatePath(`/dashboard/donors/${donorId}`);
    revalidatePath(`/dashboard/donors`);
    return { success: true, isEligible, reason: finalReason };

  } catch (error: any) {
    console.error("Error submitting eligibility check:", error);
    return { error: error.message || "حدث خطأ أثناء حفظ التقييم الطبي" };
  }
}
