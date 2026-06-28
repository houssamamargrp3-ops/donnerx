"use server";

import { prisma } from "@/lib/prisma";
import { eligibilitySchema, EligibilityFormData } from "@/lib/validations/eligibility";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { EligibilityStatus } from "@prisma/client";

export async function submitEligibilityCheck(data: EligibilityFormData) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return { error: "يجب تسجيل الدخول أولاً" };
    }

    const validatedData = eligibilitySchema.parse(data);

    // Find the donor record associated with this user
    const donor = await prisma.donor.findFirst({
      where: { userId: session.user.id },
    });

    if (!donor) {
      return { error: "لم يتم العثور على ملف المتبرع" };
    }

    let isEligible = true;
    let reason = "";

    // Medical Logic
    if (validatedData.age < 18 || validatedData.age > 65) {
      isEligible = false;
      reason = "العمر يجب أن يكون بين 18 و 65 عاماً.";
    } else if (validatedData.weight < 50) {
      isEligible = false;
      reason = "الوزن يجب أن يكون 50 كجم على الأقل للتبرع بالدم.";
    } else if (validatedData.isPregnant) {
      isEligible = false;
      reason = "يمنع التبرع أثناء فترة الحمل والرضاعة.";
    } else if (validatedData.recentSurgery) {
      isEligible = false;
      reason = "يمنع التبرع لمدة 6 أشهر بعد العمليات الجراحية الكبرى.";
    } else if (validatedData.hasRecentTattoo) {
      isEligible = false;
      reason = "يمنع التبرع لمدة 6 أشهر بعد عمل وشم أو ثقب تجميلي (Piercing).";
    }

    // Process lists
    const chronicConditionsList = validatedData.chronicConditions
      ? validatedData.chronicConditions.split(",").map(s => s.trim()).filter(Boolean)
      : [];
    const currentMedicationsList = validatedData.currentMedications
      ? validatedData.currentMedications.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    // Further automatic disqualification based on keywords (Optional but good for demo)
    if (isEligible && chronicConditionsList.some(c => c.includes("سرطان") || c.includes("قلب") || c.includes("إيدز"))) {
      isEligible = false;
      reason = "وجود أمراض مزمنة تمنع التبرع بالدم حرصاً على سلامتك وسلامة المريض.";
    }

    await prisma.$transaction(async (tx) => {
      // 1. Create the EligibilityCheck record
      await tx.eligibilityCheck.create({
        data: {
          donorId: donor.id,
          age: validatedData.age,
          weight: validatedData.weight,
          isPregnant: validatedData.isPregnant,
          recentSurgery: validatedData.recentSurgery,
          hasRecentTattoo: validatedData.hasRecentTattoo,
          recentTravel: validatedData.recentTravel || null,
          chronicConditions: chronicConditionsList,
          currentMedications: currentMedicationsList,
          isEligible: isEligible,
          reason: reason || null,
        },
      });

      // 2. Update the Donor record
      await tx.donor.update({
        where: { id: donor.id },
        data: {
          eligibilityStatus: isEligible ? EligibilityStatus.ELIGIBLE : EligibilityStatus.INELIGIBLE,
          eligibilityReason: reason || null,
          // Calculate next eligible date (if eligible, usually they can donate now. If they just donated, it's 2-3 months.
          // For ineligible due to surgery/tattoo, we could set nextEligibleDate to 6 months from now, but for simplicity we leave it.)
        },
      });
    });

    revalidatePath("/donor");
    return { success: true, isEligible, reason };
  } catch (error: any) {
    console.error("Eligibility check error:", error);
    return { error: error.message || "حدث خطأ أثناء حفظ التقييم" };
  }
}
