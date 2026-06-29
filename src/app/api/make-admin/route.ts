import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  await prisma.user.updateMany({
    data: { role: 'ADMIN' },
  });
  return NextResponse.json({ success: true, message: "All users updated to ADMIN." });
}
