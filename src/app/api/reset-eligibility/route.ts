import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const updated = await prisma.donor.updateMany({
      data: {
        eligibilityStatus: "ELIGIBLE",
        nextEligibleDate: null
      }
    });
    return NextResponse.json({ success: true, count: updated.count });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
