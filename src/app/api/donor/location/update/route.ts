import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { latitude, longitude, city } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "إحداثيات الموقع غير مكتملة" }, { status: 400 });
    }

    const updatedDonor = await prisma.donor.update({
      where: { userId: session.user.id },
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        ...(city ? { currentCity: city } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      currentCity: updatedDonor.currentCity,
      latitude: updatedDonor.latitude,
      longitude: updatedDonor.longitude,
    });
  } catch (error: any) {
    console.error("Error updating GPS location:", error);
    return NextResponse.json({ error: "فشل تحديث الموقع الجغرافي" }, { status: 500 });
  }
}
