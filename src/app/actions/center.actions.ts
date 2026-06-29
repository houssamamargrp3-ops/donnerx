"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCenter(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const city = formData.get("city") as string;
    const address = formData.get("address") as string;
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const phone = formData.get("phone") as string;

    if (!name || !city || !address) {
      return { error: "يرجى تعبئة جميع الحقول الإلزامية." };
    }

    const newCenter = await prisma.bloodCenter.create({
      data: {
        name,
        city,
        address,
        capacity: isNaN(capacity) ? 20 : capacity,
        phone: phone || null,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/settings/centers");
    revalidatePath("/dashboard/appointments/new");
    return { success: true, center: newCenter };
  } catch (error: any) {
    console.error("Error adding center:", error);
    return { error: "حدث خطأ أثناء إضافة المركز." };
  }
}

export async function toggleCenterStatus(centerId: string, currentStatus: boolean) {
  try {
    await prisma.bloodCenter.update({
      where: { id: centerId },
      data: { isActive: !currentStatus },
    });

    revalidatePath("/dashboard/settings/centers");
    revalidatePath("/dashboard/appointments/new");
    return { success: true };
  } catch (error: any) {
    console.error("Error toggling center:", error);
    return { error: "حدث خطأ أثناء تحديث حالة المركز." };
  }
}
