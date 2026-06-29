"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createWalkInDonation(donorId: string) {
  try {
    // 1. Get any active center (if admin isn't specifically tied to one, we'll just use the first available center)
    const center = await prisma.center.findFirst();
    if (!center) {
      return { error: "لا يوجد مراكز طبية مسجلة في النظام لتسجيل التبرع." };
    }

    // 2. Create an auto-confirmed, auto-examined appointment
    const appointment = await prisma.appointment.create({
      data: {
        donorId,
        centerId: center.id,
        scheduledAt: new Date(),
        status: "CONFIRMED",
        confirmedAt: new Date(),
        isExamined: true, // Auto-pass physical exam because it's a direct walk-in flow
        examinationNotes: "تسجيل زيارة مباشرة (Walk-in)",
        qrCode: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      },
    });

    revalidatePath("/dashboard/appointments");
    // 3. Return the ID so the client can redirect
    return { success: true, appointmentId: appointment.id };
  } catch (error: any) {
    console.error("Error creating walk-in appointment:", error);
    return { error: "حدث خطأ أثناء تهيئة الزيارة المباشرة." };
  }
}
