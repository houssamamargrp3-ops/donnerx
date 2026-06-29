import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { donorId, centerId, scheduledAt } = await request.json();

    if (!donorId || !centerId || !scheduledAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Since the user asked for Auto-Confirm, we set the status directly to CONFIRMED
    const appointment = await prisma.appointment.create({
      data: {
        donorId,
        centerId,
        scheduledAt: new Date(scheduledAt),
        status: "CONFIRMED",
        confirmedAt: new Date(),
        // Generate a random payload for the QR Code
        qrCode: crypto.randomBytes(16).toString("hex"),
      },
    });

    // Create a notification for the donor
    await prisma.notification.create({
      data: {
        userId: session.user.id!,
        type: "APPOINTMENT_CONFIRMED",
        title: "تم تأكيد موعدك",
        message: `تم حجز موعدك وتأكيده بنجاح بتاريخ ${new Intl.DateTimeFormat("ar-SA", { dateStyle: "long", timeStyle: "short" }).format(new Date(scheduledAt))}.`,
      }
    });

    revalidatePath("/dashboard/appointments");
    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
