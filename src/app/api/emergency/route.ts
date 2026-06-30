import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BloodType, NotificationType, UrgencyLevel, EmergencyStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || ((session.user as any).role !== "HOSPITAL_STAFF" && (session.user as any).role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { hospitalName, contactName, contactPhone, bloodType, unitsNeeded, urgencyLevel, city, notes } = body;

    if (!hospitalName || !bloodType || !unitsNeeded || !city) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create the Emergency Request
    const request = await prisma.emergencyRequest.create({
      data: {
        hospitalName,
        contactName,
        contactPhone,
        bloodType: bloodType as BloodType,
        unitsNeeded: parseInt(unitsNeeded),
        urgencyLevel: urgencyLevel as UrgencyLevel || "HIGH",
        status: "OPEN" as EmergencyStatus,
        city,
        notes,
      }
    });

    // 2. Find eligible donors
    // Rules: Exact match OR O- (Universal Donor). Must be in same city.
    // Must be ELIGIBLE.
    const donorsToNotify = await prisma.donor.findMany({
      where: {
        AND: [
          { city: { equals: city, mode: 'insensitive' } },
          { eligibilityStatus: "ELIGIBLE" },
          {
            OR: [
              { bloodType: bloodType as BloodType },
              { bloodType: "O_NEGATIVE" }
            ]
          }
        ]
      },
      include: { user: true }
    });

    // 3. Create Notifications for these donors
    if (donorsToNotify.length > 0) {
      const notifications = donorsToNotify.map(donor => ({
        userId: donor.userId,
        type: "EMERGENCY_REQUEST" as NotificationType,
        title: "🚨 نداء طوارئ عاجل!",
        message: `مستشفى ${hospitalName} في ${city} بحاجة ماسة لمتبرعين بفصيلة ${bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}. الرجاء التوجه للمستشفى أو الحجز فوراً.`,
        data: { requestId: request.id }
      }));

      await prisma.notification.createMany({
        data: notifications
      });
    }

    return NextResponse.json({ 
      success: true, 
      request, 
      notifiedCount: donorsToNotify.length 
    });

  } catch (error: any) {
    console.error("Emergency API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const status = searchParams.get("status");
    
    let whereClause: any = {};
    if (city) {
      whereClause.city = { equals: city, mode: 'insensitive' };
    }
    if (status) {
      whereClause.status = status;
    }

    const requests = await prisma.emergencyRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json(requests);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
