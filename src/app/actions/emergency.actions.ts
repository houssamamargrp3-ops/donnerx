"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendSMS } from "@/lib/sms";

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

    // 2. Find eligible donors matching primary city, current location, secondary cities, or nationwide opt-in
    const cleanCity = city?.trim() || "";
    let matchingDonors = await prisma.donor.findMany({
      where: {
        OR: [
          { bloodType: bloodType },
          { bloodType: "O_NEGATIVE" }, // O- is universal donor
        ],
        eligibilityStatus: "ELIGIBLE",
        ...(cleanCity !== ""
          ? {
              OR: [
                { city: { contains: cleanCity, mode: "insensitive" } },
                { currentCity: { contains: cleanCity, mode: "insensitive" } },
                { secondaryCities: { has: cleanCity } },
                { notifyNationwide: true },
                { city: null },
                { city: "" },
              ],
            }
          : {}),
      },
    });

    // Fallback: If still no matches, notify all eligible donors with matching blood type nationwide
    if (matchingDonors.length === 0) {
      matchingDonors = await prisma.donor.findMany({
        where: {
          OR: [{ bloodType: bloodType }, { bloodType: "O_NEGATIVE" }],
          eligibilityStatus: "ELIGIBLE",
        },
      });
    }

    // 3. Send them all an EMERGENCY notification & SMS alert
    if (matchingDonors.length > 0) {
      const smsMessage = `[DONNER.X 🚨] نداء طوارئ عاجل! مستشفى ${hospitalName} في ${cleanCity || "المنطقة"} بحاجة ماسة لفصيلة دمك (${bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}). حضورك ينقذ حياة!`;

      const notifications = matchingDonors.map((donor) => {
        // Dispatch SMS if donor phone is available
        if (donor.phone) {
          sendSMS({ to: donor.phone, message: smsMessage, type: "EMERGENCY" }).catch(() => {});
        }

        return {
          userId: donor.userId,
          title: "🚨 نداء طوارئ عاجل!",
          message: `${hospitalName} في ${cleanCity || "المنطقة"} بحاجة ماسة لفصيلة دمك (${bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}). حضورك ينقذ حياة!`,
          type: "EMERGENCY_REQUEST" as any,
        };
      });

      await prisma.notification.createMany({
        data: notifications,
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
