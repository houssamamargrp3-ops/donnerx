import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session?.user || (role !== "ADMIN" && role !== "SUPER_ADMIN" && role !== "CENTER_STAFF" && role !== "HOSPITAL_STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { isPassed, notes } = await request.json();

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { donor: true }
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (isPassed) {
      // Pass: mark appointment as examined, allow donation step
      await prisma.appointment.update({
        where: { id },
        data: {
          isExamined: true,
          examinationNotes: notes,
        }
      });
    } else {
      // Fail: Cancel appointment and mark donor as ineligible
      await prisma.$transaction([
        prisma.appointment.update({
          where: { id },
          data: {
            isExamined: true,
            examinationNotes: notes,
            status: "CANCELLED",
            cancelReason: "فشل في الفحص الطبي السريري",
            cancelledAt: new Date(),
          }
        }),
        prisma.donor.update({
          where: { id: appointment.donorId },
          data: {
            eligibilityStatus: "INELIGIBLE",
            // Can't donate for 30 days if failed basic physical exam
            nextEligibleDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
          }
        })
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Examination Error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ نتيجة الفحص" }, { status: 500 });
  }
}
