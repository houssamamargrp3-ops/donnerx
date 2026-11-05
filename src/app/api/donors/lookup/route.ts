import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/donors/lookup?q=...
// Looks up a donor from ANY QR code format:
// 1. JSON payload from SmartDonorCard: {"id":"...", "donorId":"...", "name":"..."}
// 2. Full or partial donor ID
// 3. Home donation booking number: HD-YYYYMMDD-XXXX
// 4. Appointment QR code
// 5. Donor phone number or user email/name
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    if (!["ADMIN", "SUPER_ADMIN", "CENTER_STAFF", "HOSPITAL_STAFF"].includes(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let q = searchParams.get("q")?.trim() || "";

    if (!q) {
      return NextResponse.json({ error: "يرجى مسح أو إدخال كود الـ QR" }, { status: 400 });
    }

    let searchId = q;
    let searchName = "";

    // 1. Try parsing if it's JSON from SmartDonorCard
    if (q.startsWith("{") && q.endsWith("}")) {
      try {
        const parsed = JSON.parse(q);
        searchId = parsed.donorId || parsed.id || "";
        searchName = parsed.name || "";
      } catch (_) {}
    }

    // 2. Check if it's a Home Donation booking number
    if (q.startsWith("HD-") || q.includes("HD-")) {
      const homeReq = await prisma.homeDonationRequest.findFirst({
        where: {
          OR: [
            { bookingNumber: q },
            { bookingNumber: { contains: q } },
          ],
        },
        select: { donorId: true },
      });
      if (homeReq?.donorId) {
        searchId = homeReq.donorId;
      }
    }

    // 3. Check if it's an Appointment QR code
    const apptByQr = await prisma.appointment.findFirst({
      where: {
        OR: [
          { qrCode: q },
          { id: q },
        ],
      },
      select: { donorId: true },
    });
    if (apptByQr?.donorId) {
      searchId = apptByQr.donorId;
    }

    // 4. Query Donor
    let donor = await prisma.donor.findFirst({
      where: {
        OR: [
          { id: searchId },
          { id: { startsWith: searchId } },
          { id: { contains: searchId } },
          ...(searchName ? [{ user: { name: { contains: searchName, mode: "insensitive" as any } } }] : []),
          { phone: { contains: q } },
          { user: { email: { equals: q, mode: "insensitive" as any } } },
          { user: { name: { contains: q, mode: "insensitive" as any } } },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        donations: {
          orderBy: { donatedAt: "desc" },
          take: 3,
          include: { center: { select: { name: true } } },
        },
        appointments: {
          where: { status: "PENDING" },
          orderBy: { scheduledAt: "asc" },
          take: 1,
          include: { center: { select: { id: true, name: true } } },
        },
        emergencyResponses: {
          orderBy: { respondedAt: "desc" },
          take: 1,
          include: { request: true },
        },
        homeDonations: {
          orderBy: { scheduledDate: "desc" },
          take: 1,
        },
      },
    });

    if (!donor) {
      return NextResponse.json({ error: "لم يتم العثور على أي متبرع مطابق لرمز QR الممسوح" }, { status: 404 });
    }

    // Also get active centers for quick donation recording
    const centers = await prisma.bloodCenter.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      take: 10,
    });

    return NextResponse.json({
      donor: {
        id: donor.id,
        name: donor.user?.name || "متبرع كريم",
        email: donor.user?.email,
        phone: donor.phone,
        bloodType: donor.bloodType,
        city: donor.city,
        gender: donor.gender,
        weight: donor.weight,
        eligibilityStatus: donor.eligibilityStatus,
        eligibilityReason: donor.eligibilityReason,
        nextEligibleDate: donor.nextEligibleDate,
        totalDonations: donor.totalDonations,
        points: donor.points,
        level: donor.level,
        lastDonation: donor.donations?.[0] || null,
        recentDonations: donor.donations || [],
        pendingAppointment: donor.appointments?.[0] || null,
        latestEmergencyResponse: donor.emergencyResponses?.[0] || null,
        latestHomeDonation: donor.homeDonations?.[0] || null,
      },
      centers,
    });
  } catch (error: any) {
    console.error("Donor lookup error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
