import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const donor = await prisma.donor.findUnique({
      where: { userId: session.user.id },
      include: {
        appointments: {
          where: { scheduledAt: { gte: new Date() } },
          orderBy: { scheduledAt: "asc" },
          take: 1,
          include: { center: true }
        }
      }
    });

    if (!donor) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(donor);
  } catch (error: any) {
    console.error("Error fetching donor profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
