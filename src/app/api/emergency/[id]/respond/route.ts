import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/emergency/[id]/respond — donor responds to an emergency request
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { donorId } = body;

    if (!donorId || !id) {
      return NextResponse.json({ error: "Missing donorId or requestId" }, { status: 400 });
    }

    // Verify the emergency request exists and is still OPEN
    const emergencyRequest = await prisma.emergencyRequest.findUnique({
      where: { id },
    });

    if (!emergencyRequest) {
      return NextResponse.json({ error: "Emergency request not found" }, { status: 404 });
    }
    if (emergencyRequest.status !== "OPEN") {
      return NextResponse.json({ error: "This emergency request is closed" }, { status: 409 });
    }

    // Verify donor belongs to the session user
    const donor = await prisma.donor.findUnique({ where: { id: donorId } });
    if (!donor || donor.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized donor" }, { status: 403 });
    }

    // Check if already responded
    const existing = await prisma.emergencyResponse.findFirst({
      where: { requestId: id, donorId },
    });
    if (existing) {
      return NextResponse.json({ error: "already_responded", response: existing }, { status: 200 });
    }

    // Create the response
    const response = await prisma.emergencyResponse.create({
      data: {
        requestId: id,
        donorId,
        status: "PENDING",
      },
    });

    // Mark all pending EMERGENCY_REQUEST notifications for this user as read
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        type: "EMERGENCY_REQUEST",
        isRead: false,
      },
      data: { isRead: true },
    }).catch(() => {});

    // Create a confirmation notification for the donor
    prisma.notification.createMany({
      data: [{
        userId: session.user.id,
        type: "DONATION_RECORDED" as any,
        title: "✅ تم تسجيل استجابتك!",
        message: `شكراً بطلنا! تم تسجيل استجابتك لنداء طوارئ ${emergencyRequest.hospitalName}. يرجى التوجه للمستشفى في أقرب وقت.`,
      }],
    }).catch(() => {});

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error("Emergency respond error:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
