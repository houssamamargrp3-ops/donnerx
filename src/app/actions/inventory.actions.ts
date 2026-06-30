"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function adjustInventory(centerId: string, bloodType: any, action: "increase" | "decrease") {
  try {
    const current = await prisma.bloodInventory.findUnique({
      where: {
        centerId_bloodType: { centerId, bloodType }
      }
    });

    let currentUnits = current?.units || 0;

    if (action === "decrease" && currentUnits <= 0) {
      return { error: "لا يمكن إنقاص المخزون أقل من صفر." };
    }

    await prisma.bloodInventory.upsert({
      where: {
        centerId_bloodType: { centerId, bloodType }
      },
      update: {
        units: action === "increase" ? { increment: 1 } : { decrement: 1 }
      },
      create: {
        centerId,
        bloodType,
        units: action === "increase" ? 1 : 0,
        minThreshold: 10
      }
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Error adjusting inventory:", error);
    return { error: "حدث خطأ أثناء تعديل المخزون." };
  }
}
