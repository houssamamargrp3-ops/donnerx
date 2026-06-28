import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "رمز التحقق مفقود" }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "رمز التحقق غير صحيح" }, { status: 404 });
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ error: "رمز التحقق منتهي الصلاحية" }, { status: 410 });
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    });

    // Delete the token
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ message: "تم تأكيد البريد الإلكتروني بنجاح" });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء التحقق" }, { status: 500 });
  }
}
