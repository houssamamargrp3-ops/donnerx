"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import {
  Eye,
  EyeOff,
  Droplets,
  Mail,
  Lock,
  User,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams?.get("role") === "center" ? "CENTER_STAFF" : "DONOR";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const password = watch("password", "");

  const passwordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = passwordStrength(password);
  const strengthLabels = ["", "ضعيفة", "مقبولة", "جيدة", "قوية جداً"];
  const strengthColors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "حدث خطأ أثناء التسجيل");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 4000);
    } catch {
      setError("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-bg min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-10 text-center max-w-md w-full animate-scale-in">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: "rgba(16,185,129,0.1)", border: "2px solid #10b981" }}
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">تم التسجيل بنجاح! 🎉</h2>
          <p className="text-slate-400 mb-4">
            تم إرسال رابط التحقق إلى بريدك الإلكتروني. يرجى التحقق منه لتفعيل حسابك.
          </p>
          <div
            className="py-3 px-4 rounded-lg text-sm text-emerald-300"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            سيتم تحويلك لصفحة الدخول تلقائياً...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #dc2626, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }}
        />
      </div>

      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">العودة لتسجيل الدخول</span>
          </Link>
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-3"
            style={{
              background: "linear-gradient(135deg, #dc2626, #991b1b)",
              boxShadow: "0 0 30px rgba(220,38,38,0.35)",
            }}
          >
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black gradient-text tracking-widest">DONNER.X</h1>
          <p className="text-slate-400 text-sm mt-1">إنشاء حساب جديد</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-white mb-1">مرحباً بك 👋</h2>
          <p className="text-slate-400 text-sm mb-6">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              تسجيل الدخول
            </Link>
          </p>

          {error && (
            <div className="error-toast flex items-center gap-3 mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="name"
                  type="text"
                  placeholder="محمد عبدالله"
                  className={`form-input pr-10 ${errors.name ? "error" : ""}`}
                  {...register("name")}
                />
              </div>
              {errors.name && <p className="error-msg"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="example@email.com"
                  className={`form-input pr-10 ${errors.email ? "error" : ""}`}
                  style={{ direction: "ltr", textAlign: "right" }}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="error-msg"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">نوع الحساب</label>
              <select
                id="role"
                className="form-input"
                {...register("role")}
                style={{ background: "rgba(255,255,255,0.03)", cursor: "pointer" }}
              >
                <option value="DONOR" style={{ background: "#16162a" }}>🩸 متبرع بالدم</option>
                <option value="CENTER_STAFF" style={{ background: "#16162a" }}>🏥 موظف مركز الدم</option>
                <option value="HOSPITAL_STAFF" style={{ background: "#16162a" }}>🏨 موظف مستشفى</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`form-input pr-10 pl-10 ${errors.password ? "error" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          background: level <= strength ? strengthColors[strength] : "rgba(255,255,255,0.1)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: strengthColors[strength] }}>
                    قوة كلمة المرور: {strengthLabels[strength]}
                  </span>
                </div>
              )}
              {errors.password && <p className="error-msg"><AlertCircle className="w-3 h-3" /> {errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  className={`form-input pr-10 pl-10 ${errors.confirmPassword ? "error" : ""}`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="error-msg"><AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}</p>}
            </div>

            <button
              id="register-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <><span className="spinner" /><span>جاري التسجيل...</span></>
              ) : (
                <><span>إنشاء الحساب</span><ArrowLeft className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 text-xs mt-5">
            بالتسجيل، أنت توافق على{" "}
            <span className="text-red-400">شروط الاستخدام</span> و{" "}
            <span className="text-red-400">سياسة الخصوصية</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen auth-bg flex items-center justify-center"><div className="spinner"></div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
