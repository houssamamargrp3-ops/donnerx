import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "تأكيد البريد الإلكتروني — DONNER.X",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #0f0f1a; color: #e2e8f0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #dc2626, #991b1b); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 2px; }
          .body { padding: 40px; }
          .body p { line-height: 1.8; color: #94a3b8; }
          .btn { display: inline-block; background: linear-gradient(135deg, #dc2626, #991b1b); color: white !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #475569; font-size: 12px; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🩸 DONNER.X</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">منصة التبرع بالدم الوطنية</p>
          </div>
          <div class="body">
            <h2 style="color: #f1f5f9;">مرحباً ${name} 👋</h2>
            <p>شكراً لتسجيلك في منصة DONNER.X. كل تبرع بالدم ينقذ حياة!</p>
            <p>اضغط على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" class="btn">✅ تأكيد البريد الإلكتروني</a>
            </div>
            <p style="font-size: 13px;">أو انسخ هذا الرابط في متصفحك:</p>
            <p style="font-size: 12px; word-break: break-all; color: #dc2626;">${verifyUrl}</p>
            <p>هذا الرابط صالح لمدة <strong>24 ساعة</strong>.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DONNER.X — جميع الحقوق محفوظة</p>
            <p>إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "إعادة تعيين كلمة المرور — DONNER.X",
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #0f0f1a; color: #e2e8f0; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #dc2626, #991b1b); padding: 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; letter-spacing: 2px; }
          .body { padding: 40px; }
          .body p { line-height: 1.8; color: #94a3b8; }
          .btn { display: inline-block; background: linear-gradient(135deg, #dc2626, #991b1b); color: white !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #475569; font-size: 12px; border-top: 1px solid #1e293b; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🩸 DONNER.X</h1>
          </div>
          <div class="body">
            <h2 style="color: #f1f5f9;">إعادة تعيين كلمة المرور</h2>
            <p>مرحباً ${name}،</p>
            <p>تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="btn">🔐 إعادة تعيين كلمة المرور</a>
            </div>
            <p>هذا الرابط صالح لمدة <strong>ساعة واحدة</strong> فقط.</p>
            <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} DONNER.X — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
