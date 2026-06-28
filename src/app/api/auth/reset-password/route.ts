import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "بيانات غير صحيحة", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.used) {
      return NextResponse.json({ error: "رمز إعادة التعيين غير صحيح" }, { status: 404 });
    }

    if (resetRecord.expires < new Date()) {
      return NextResponse.json({ error: "رمز إعادة التعيين منتهي الصلاحية" }, { status: 410 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { token },
        data: { used: true },
      }),
    ]);

    return NextResponse.json({ message: "تم إعادة تعيين كلمة المرور بنجاح" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إعادة التعيين" }, { status: 500 });
  }
}
