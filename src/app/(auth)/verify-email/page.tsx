"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Droplets, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("رمز التحقق غير صحيح أو مفقود");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "تم تأكيد البريد الإلكتروني بنجاح");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.error || "حدث خطأ أثناء التحقق");
        }
      } catch {
        setStatus("error");
        setMessage("حدث خطأ في الاتصال");
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="glass-card p-10 text-center">
      {status === "loading" && (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: "rgba(59,130,246,0.1)", border: "2px solid #3b82f6" }}>
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">جاري التحقق...</h2>
          <p className="text-slate-400">يرجى الانتظار بينما نتحقق من بريدك الإلكتروني</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: "rgba(16,185,129,0.1)", border: "2px solid #10b981" }}>
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">تم التأكيد بنجاح! 🎉</h2>
          <p className="text-slate-400 mb-6">{message}</p>
          <p className="text-slate-500 text-sm mb-4">سيتم تحويلك لتسجيل الدخول تلقائياً...</p>
          <Link href="/login" className="btn-primary inline-flex items-center justify-center">
            تسجيل الدخول الآن
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: "rgba(220,38,38,0.1)", border: "2px solid #dc2626" }}>
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">فشل التحقق</h2>
          <p className="text-slate-400 mb-6">{message}</p>
          <Link href="/register" className="btn-primary inline-flex items-center justify-center">
            إنشاء حساب جديد
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 0 30px rgba(220,38,38,0.35)" }}>
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black gradient-text tracking-widest">DONNER.X</h1>
          <p className="text-slate-400 text-sm mt-1">تأكيد البريد الإلكتروني</p>
        </div>
        <Suspense fallback={
          <div className="glass-card p-10 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            جاري التحميل...
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
