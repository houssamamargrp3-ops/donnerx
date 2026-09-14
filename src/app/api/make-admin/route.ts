import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const targetEmail = searchParams.get("email") || "amar.houssam@univ-ouargla.dz";
    const newPassword = searchParams.get("pass") || "Admin123456!";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 1. Promote all existing users to ADMIN
    await prisma.user.updateMany({
      data: { role: "ADMIN", isActive: true },
    });

    // 2. Specific update for target email: set role ADMIN, active, and set password
    const existing = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (existing) {
      await prisma.user.update({
        where: { email: targetEmail },
        data: {
          role: "ADMIN",
          password: hashedPassword,
          isActive: true,
          emailVerified: new Date(),
        },
      });
    } else {
      await prisma.user.create({
        data: {
          name: "Houssam Amar",
          email: targetEmail,
          password: hashedPassword,
          role: "ADMIN",
          isActive: true,
          emailVerified: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `تم تحديث الحساب وترقيته إلى ADMIN وتعيين كلمة المرور بنجاح!`,
      account: {
        email: targetEmail,
        password: newPassword,
        role: "ADMIN",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
