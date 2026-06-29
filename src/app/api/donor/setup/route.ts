import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { bloodType, weight, phone, chronicDiseases } = body;

    if (!bloodType || !weight || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Chronic diseases check to determine eligibility
    const isEligible = !chronicDiseases && weight >= 50;

    const donor = await prisma.donor.create({
      data: {
        userId: session.user.id!,
        bloodType,
        weight,
        phone,
        chronicDiseases: chronicDiseases ? ["UNSPECIFIED"] : [],
        eligibilityStatus: isEligible ? "ELIGIBLE" : "INELIGIBLE",
        eligibilityReason: isEligible ? null : "بناءً على الوزن أو الأمراض المزمنة، لا يمكنك التبرع حالياً.",
        
        // Gamification points (Task 14)
        points: 50,
        level: 1,

        // Required mock fields for fields not in the simplified form
        gender: "MALE",
        dateOfBirth: new Date("1990-01-01T00:00:00Z"),
      }
    });

    // Generate welcome notification
    await prisma.notification.create({
      data: {
        userId: session.user.id!,
        type: "GENERAL",
        title: "مرحباً بك في دونر.إكس",
        message: "شكراً لتسجيل بياناتك الطبية! لقد حصلت على 50 نقطة ترحيبية.",
      }
    });

    revalidatePath("/dashboard/donors");
    return NextResponse.json({ success: true, donor });
  } catch (error: any) {
    console.error("Error setting up donor:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
