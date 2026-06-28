import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CampaignStatus, NotificationType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    // Only CENTER_STAFF and ADMIN can create campaigns
    if (!session || !session.user || ((session.user as any).role !== "CENTER_STAFF" && (session.user as any).role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, organizer, location, city, startDate, endDate, capacity } = body;

    if (!name || !organizer || !location || !city || !startDate || !endDate || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Since we don't have a linked center id for testing easily, we'll fetch the first center 
    // or just require the user to have a linked center. For demo purposes, fetch any center if none is linked.
    let center = await prisma.bloodCenter.findFirst();
    if (!center) {
       // Create a dummy center if db is empty
       center = await prisma.bloodCenter.create({
         data: { name: "المركز الرئيسي", address: "الشارع الأول", city: city }
       });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        organizer,
        location,
        city,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        capacity: parseInt(capacity),
        status: "PUBLISHED" as CampaignStatus,
        centerId: center.id
      }
    });

    // Notify all eligible donors in the same city about the campaign
    const localDonors = await prisma.donor.findMany({
      where: {
        city: { equals: city, mode: 'insensitive' },
        eligibilityStatus: "ELIGIBLE"
      }
    });

    if (localDonors.length > 0) {
      const notifications = localDonors.map(donor => ({
        userId: donor.userId,
        type: "CAMPAIGN_INVITE" as NotificationType,
        title: "📢 حملة تبرع جديدة في مدينتك!",
        message: `تم إطلاق حملة "${name}" في ${location}. شاركنا في إنقاذ الأرواح!`,
        data: { campaignId: campaign.id }
      }));

      await prisma.notification.createMany({
        data: notifications
      });
    }

    return NextResponse.json({ success: true, campaign, notifiedCount: localDonors.length });

  } catch (error: any) {
    console.error("Campaign API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { startDate: 'desc' }
    });
    return NextResponse.json(campaigns);
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
