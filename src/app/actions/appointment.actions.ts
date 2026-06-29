"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelAppointment(appointmentId: string, reason: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) return { error: "الموعد غير موجود" };
    if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
      return { error: "لا يمكن إلغاء هذا الموعد لأنه ملغي أو مكتمل مسبقاً" };
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelReason: reason,
      },
    });

    revalidatePath("/dashboard/appointments");
    revalidatePath(`/dashboard/appointments/${appointmentId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error cancelling appointment:", error);
    return { error: "حدث خطأ أثناء إلغاء الموعد" };
  }
}
