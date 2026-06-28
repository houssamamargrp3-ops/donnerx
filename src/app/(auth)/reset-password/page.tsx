"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { Eye, EyeOff, Lock, Droplets, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token || "" },
  });

  useEffect(() => {
    if (!token) setError("رمز إعادة التعيين غير صحيح أو مفقود");
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "حدث خطأ أثناء إعادة التعيين");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card p-10 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{ background: "rgba(16,185,129,0.1)", border: "2px solid #10b981" }}>
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">تم التغيير بنجاح! ✅</h2>
        <p className="text-slate-400 mb-4">تم تغيير كلمة مرورك بنجاح. سيتم تحويلك لتسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm mb-6">
        <ArrowLeft className="w-4 h-4" />
        العودة لتسجيل الدخول
      </Link>

      <h2 className="text-2xl font-bold text-white mb-2">إعادة تعيين كلمة المرور</h2>
      <p className="text-slate-400 text-sm mb-6">أدخل كلمة المرور الجديدة.</p>

      {error && (
        <div className="error-toast flex items-center gap-3 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("token")} value={token || ""} />

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">كلمة المرور الجديدة</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`form-input pr-10 pl-10 ${errors.password ? "error" : ""}`}
              {...register("password")}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="error-msg"><AlertCircle className="w-3 h-3" /> {errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">تأكيد كلمة المرور</label>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              id="confirm-new-password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              className={`form-input pr-10 pl-10 ${errors.confirmPassword ? "error" : ""}`}
              {...register("confirmPassword")}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="error-msg"><AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}</p>}
        </div>

        <button id="reset-submit" type="submit" disabled={isLoading || !token}
          className="btn-primary flex items-center justify-center gap-2">
          {isLoading ? (
            <><span className="spinner" /><span>جاري التغيير...</span></>
          ) : (
            <><Lock className="w-4 h-4" /><span>تغيير كلمة المرور</span></>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 0 30px rgba(220,38,38,0.35)" }}>
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black gradient-text tracking-widest">DONNER.X</h1>
        </div>
        <Suspense fallback={<div className="glass-card p-8 text-center text-slate-400">تحميل...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
