"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";
import { Mail, Droplets, ArrowLeft, AlertCircle, CheckCircle, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch("email");

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const json = await res.json();
        setError(json.error || "حدث خطأ");
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-bg min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-10 text-center max-w-md w-full animate-scale-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: "rgba(59,130,246,0.1)", border: "2px solid #3b82f6" }}>
            <Send className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">تم الإرسال! 📧</h2>
          <p className="text-slate-400 mb-2">
            إذا كان البريد الإلكتروني
          </p>
          <p className="text-red-400 font-semibold mb-2">{email}</p>
          <p className="text-slate-400 mb-6">
            مسجلاً في المنصة، ستصلك رسالة بتعليمات إعادة تعيين كلمة المرور.
          </p>
          <Link href="/login"
            className="btn-primary inline-flex items-center justify-center gap-2">
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #dc2626, transparent)" }} />
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 0 30px rgba(220,38,38,0.35)" }}>
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black gradient-text tracking-widest">DONNER.X</h1>
        </div>

        <div className="glass-card p-8">
          <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm mb-6">
            <ArrowLeft className="w-4 h-4" />
            العودة لتسجيل الدخول
          </Link>

          <h2 className="text-2xl font-bold text-white mb-2">نسيت كلمة المرور؟</h2>
          <p className="text-slate-400 text-sm mb-6">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
          </p>

          {error && (
            <div className="error-toast flex items-center gap-3 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="example@email.com"
                  className={`form-input pr-10 ${errors.email ? "error" : ""}`}
                  style={{ direction: "ltr", textAlign: "right" }}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="error-msg"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>}
            </div>

            <button id="forgot-submit" type="submit" disabled={isLoading} className="btn-primary flex items-center justify-center gap-2">
              {isLoading ? (
                <><span className="spinner" /><span>جاري الإرسال...</span></>
              ) : (
                <><Send className="w-4 h-4" /><span>إرسال رابط الاسترداد</span></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
