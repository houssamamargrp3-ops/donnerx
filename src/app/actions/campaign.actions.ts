"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function registerForCampaign(campaignId: string) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "يرجى تسجيل الدخول أولاً." };

    const userId = session.user.id;
    
    // Find the donor
    const donor = await prisma.donor.findUnique({
      where: { userId }
    });

    if (!donor) return { error: "حساب المتبرع غير موجود." };

    // Update campaign registration count
    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: { registered: { increment: 1 } }
    });

    // Notify the donor
    await prisma.notification.create({
      data: {
        userId: userId,
        type: "SYSTEM",
        title: "✅ تسجيل ناجح في الحملة!",
        message: `تم تسجيلك بنجاح في حملة "${campaign.name}". شكراً لمبادرتك في إنقاذ الأرواح!`,
        data: { campaignId }
      }
    });

    revalidatePath(`/dashboard/campaigns/${campaignId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error registering for campaign:", error);
    return { error: "حدث خطأ أثناء التسجيل في الحملة." };
  }
}
