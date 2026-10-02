import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const homeRequest = await prisma.homeDonationRequest.findUnique({
      where: { id },
      include: {
        donor: {
          include: {
            user: true,
          },
        },
        medicalTeam: {
          include: {
            visits: true,
          },
        },
        donation: {
          include: {
            certificate: true,
          },
        },
      },
    });

    if (!homeRequest) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json(homeRequest);
  } catch (error: any) {
    console.error("Error fetching request details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role === "DONOR") {
      return NextResponse.json({ error: "غير مصرح لك بإجراء هذا التعديل" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const { status, medicalTeamId, notes, cancelReason } = body;

    const existingRequest = await prisma.homeDonationRequest.findUnique({
      where: { id },
      include: { donor: true },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    let updateData: any = {};
    if (status) updateData.status = status;
    if (medicalTeamId) updateData.medicalTeamId = medicalTeamId;
    if (notes !== undefined) updateData.notes = notes;
    if (cancelReason !== undefined) updateData.cancelReason = cancelReason;

    if (status === "ARRIVED") {
      updateData.arrivedAt = new Date();
    } else if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    }

    const updated = await prisma.homeDonationRequest.update({
      where: { id },
      data: updateData,
      include: {
        donor: { include: { user: true } },
        medicalTeam: true,
      },
    });

    // Send Notification to donor if status or team updated
    let notifTitle = "تحديث طلب التبرع المنزلي 🏠";
    let notifMsg = `تم تحديث حالة طلب التبرع المنزلي رقم (${updated.bookingNumber}) إلى: ${updated.status}`;

    if (status === "CONFIRMED" && updated.medicalTeam) {
      notifTitle = "تم تأكيد طلب التبرع المنزلي وتعيين الفريق 🚑";
      notifMsg = `تم تأكيد موعد زيارتك وتعيين (${updated.medicalTeam.name}). سيصل الفريق في التاريخ الموعد.`;
    } else if (status === "IN_ROUTE") {
      notifTitle = "الفريق الطبي في الطريق إليك الآن 🚗";
      notifMsg = `الفريق الطبي المنزلي متوجه إلى عنوانك المسجل حاليًا. يرجى الاستعداد.`;
    } else if (status === "CANCELLED") {
      notifTitle = "تم إلغاء طلب التبرع المنزلي ❌";
      notifMsg = `تعذر إكمال طلبك رقم (${updated.bookingNumber}). ${cancelReason ? `السبب: ${cancelReason}` : ''}`;
    }

    if (updated.donor?.userId) {
      await prisma.notification.create({
        data: {
          userId: updated.donor.userId,
          type: "APPOINTMENT_CONFIRMED",
          title: notifTitle,
          message: notifMsg,
        },
      });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error: any) {
    console.error("Error updating request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
