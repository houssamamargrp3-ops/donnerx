import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: "إذا كان البريد مسجلاً، ستصلك رسالة لإعادة تعيين كلمة المرور",
      });
    }

    // Delete existing reset tokens for this user
    await prisma.passwordReset.deleteMany({ where: { userId: user.id } });

    // Create new reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: { token, userId: user.id, expires },
    });

    // Send email (non-blocking)
    sendPasswordResetEmail(email, user.name, token).catch(console.error);

    return NextResponse.json({
      message: "إذا كان البريد مسجلاً، ستصلك رسالة لإعادة تعيين كلمة المرور",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "حدث خطأ، يرجى المحاولة لاحقاً" }, { status: 500 });
  }
}
