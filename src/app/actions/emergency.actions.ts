"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createEmergencyRequest(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "غير مصرح" };

    const bloodType = formData.get("bloodType") as any;
    const unitsNeeded = parseInt(formData.get("unitsNeeded") as string);
    const hospitalName = formData.get("hospitalName") as string;
    const city = formData.get("city") as string;
    const contactName = formData.get("contactName") as string;
    const contactPhone = formData.get("contactPhone") as string;

    // 1. Create the Emergency Request
    const request = await prisma.emergencyRequest.create({
      data: {
        hospitalName,
        contactName,
        contactPhone,
        bloodType,
        unitsNeeded,
        city,
        status: "OPEN",
        urgencyLevel: "HIGH"
      }
    });

    // 2. Find eligible donors in the same city with the exact blood type
    // This is the core synchronization!
    const matchingDonors = await prisma.donor.findMany({
      where: {
        bloodType: bloodType,
        eligibilityStatus: "ELIGIBLE",
        city: {
          contains: city,
          mode: "insensitive"
        }
      }
    });

    // 3. Send them all an EMERGENCY notification
    if (matchingDonors.length > 0) {
      const notifications = matchingDonors.map(donor => ({
        userId: donor.userId,
        title: "🚨 نداء طوارئ عاجل!",
        message: `${hospitalName} في ${city} بحاجة ماسة لفصيلة دمك (${bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}). المتبرع ينقذ حياة!`,
        type: "EMERGENCY_REQUEST" as any
      }));

      await prisma.notification.createMany({
        data: notifications
      });
    }

    revalidatePath("/dashboard/emergency");
    return { success: true, matchedDonorsCount: matchingDonors.length };

  } catch (error) {
    console.error("Emergency broadcast failed:", error);
    return { error: "فشل في إطلاق نداء الطوارئ" };
  }
}

export async function closeEmergencyRequest(id: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "غير مصرح" };

    await prisma.emergencyRequest.update({
      where: { id },
      data: { status: "COMPLETED" }
    });

    revalidatePath("/dashboard/emergency");
    return { success: true };
  } catch (error) {
    console.error("Failed to close emergency request:", error);
    return { error: "فشل في إغلاق النداء" };
  }
}
