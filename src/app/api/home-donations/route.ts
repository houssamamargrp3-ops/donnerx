import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const role = user.role || "DONOR";
    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city");
    const district = searchParams.get("district");
    const bloodType = searchParams.get("bloodType");
    const status = searchParams.get("status");
    const medicalTeamId = searchParams.get("medicalTeamId");
    const search = searchParams.get("search");
    const date = searchParams.get("date");
    const tab = searchParams.get("tab"); // NEW, COMPLETED, CANCELLED, ALL

    let whereClause: any = {};

    if (role === "DONOR") {
      const donor = await prisma.donor.findFirst({
        where: { OR: [{ userId: user.id }, { user: { email: user.email } }] },
      });

      if (!donor) return NextResponse.json([]);
      whereClause.donorId = donor.id;
    } else {
      // Admin / Staff filters
      if (district && district !== "ALL") {
        whereClause.district = { contains: district, mode: "insensitive" };
      }
      if (city && city !== "ALL") {
        whereClause.city = { contains: city, mode: "insensitive" };
      }
      if (bloodType && bloodType !== "ALL") {
        whereClause.bloodType = bloodType;
      }
      if (status && status !== "ALL") {
        whereClause.status = status;
      }
      if (medicalTeamId && medicalTeamId !== "ALL") {
        whereClause.medicalTeamId = medicalTeamId;
      }
      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        whereClause.scheduledDate = {
          gte: startDate,
          lte: endDate,
        };
      }

      if (tab === "NEW") {
        whereClause.status = { in: ["PENDING", "REVIEW"] };
      } else if (tab === "COMPLETED") {
        whereClause.status = "COMPLETED";
      } else if (tab === "CANCELLED") {
        whereClause.status = "CANCELLED";
      }

      if (search && search.trim() !== "") {
        whereClause.OR = [
          { bookingNumber: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
          { district: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
          { donor: { user: { name: { contains: search, mode: "insensitive" } } } },
        ];
      }
    }

    const requests = await prisma.homeDonationRequest.findMany({
      where: whereClause,
      include: {
        donor: {
          include: {
            user: true,
          },
        },
        medicalTeam: true,
        donation: {
          include: {
            certificate: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Error fetching home donation requests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as any;
    const body = await request.json();

    const {
      city,
      district,
      address,
      latitude,
      longitude,
      phone,
      scheduledDate,
      timeSlot,
      notes,
    } = body;

    if (!city || !district || !address || !phone || !scheduledDate || !timeSlot) {
      return NextResponse.json(
        { error: "الرجاء تعبئة كافة الحقول المطلوبة (المدينة، المنطقة، العنوان، رقم الهاتف، التاريخ، والفترة)" },
        { status: 400 }
      );
    }

    // Find donor record
    const donor = await prisma.donor.findFirst({
      where: { OR: [{ userId: user.id }, { user: { email: user.email } }] },
    });

    if (!donor) {
      return NextResponse.json(
        { error: "لم يتم العثور على الملف الطبي للمتبرع. يرجى إكمال إعداد الملف أولاً." },
        { status: 404 }
      );
    }

    // Generate unique Booking Code HD-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `HD-${dateStr}-${randomPart}`;
    const qrPayload = `HAYATLINK:HOME:${bookingNumber}:${donor.id}`;

    const homeRequest = await prisma.homeDonationRequest.create({
      data: {
        bookingNumber,
        donorId: donor.id,
        bloodType: donor.bloodType,
        city,
        district,
        address,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        phone,
        scheduledDate: new Date(scheduledDate),
        timeSlot,
        notes: notes || null,
        qrCode: qrPayload,
        status: "PENDING",
      },
      include: {
        donor: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "APPOINTMENT_CONFIRMED",
        title: "تم إرسال طلب التبرع المنزلي بنجاح 🏠🩸",
        message: `تم استلام طلبك رقم (${bookingNumber}) للتبرع المنزلي بتاريخ ${new Date(scheduledDate).toLocaleDateString('ar-SA')} - الفترة ${timeSlot}. سيقوم الفريق الطبي بمراجعة الطلب وتأكيده قريبًا.`,
      },
    });

    return NextResponse.json({ success: true, homeRequest });
  } catch (error: any) {
    console.error("Error creating home donation request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
