"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Heart, Activity,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRoleParam = searchParams?.get("role");

  let initialRole: "DONOR" | "CENTER_STAFF" | "HOSPITAL_STAFF" | "ADMIN" | "SUPER_ADMIN" = "DONOR";
  if (rawRoleParam === "center") initialRole = "CENTER_STAFF";
  else if (rawRoleParam === "hospital") initialRole = "HOSPITAL_STAFF";
  else if (rawRoleParam === "admin") initialRole = "ADMIN";

  const portalType =
    initialRole === "CENTER_STAFF" || initialRole === "HOSPITAL_STAFF" || initialRole === "ADMIN"
      ? "medical"
      : "donor";
  const isDonor = portalType === "donor";

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
    defaultValues: { role: initialRole },
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
      if (!res.ok) { setError(json.error || "حدث خطأ أثناء التسجيل"); return; }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 4000);
    } catch {
      setError("حدث خطأ في الاتصال، يرجى المحاولة لاحقاً");
    } finally {
      setIsLoading(false);
    }
  };

  const pageBg = isDonor
    ? "radial-gradient(ellipse at 30% 20%, rgba(220,38,38,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(153,27,27,0.08) 0%, transparent 55%), linear-gradient(160deg, #0f172a 0%, #1a0a0a 50%, #0f172a 100%)"
    : "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(29,78,216,0.08) 0%, transparent 55%), linear-gradient(160deg, #0f172a 0%, #060d1f 50%, #0f172a 100%)";

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: pageBg }}>
        <div
          className="p-10 text-center max-w-md w-full animate-scale-in rounded-3xl"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{ background: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.4)" }}>
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">تم التسجيل بنجاح! 🎉</h2>
          <p className="text-slate-400 mb-5 text-sm leading-relaxed">
            أهلاً بك في مجتمع HayatLink! سيتم تحويلك إلى صفحة الدخول الآن.
          </p>
          <div className="py-3 px-4 rounded-xl text-sm text-emerald-300 font-medium"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
            ⏳ جاري التحويل...
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = (hasError: boolean) => ({
    background: "rgba(255,255,255,0.07)",
    border: `1.5px solid ${hasError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
    color: "white",
    outline: "none",
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: pageBg }}>
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-float opacity-10"
            style={{
              width: `${100 + i * 40}px`, height: `${100 + i * 40}px`,
              background: isDonor ? "radial-gradient(circle, #dc2626, transparent)" : "radial-gradient(circle, #3b82f6, transparent)",
              right: `${5 + i * 25}%`, top: `${5 + i * 20}%`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm animate-fade-in-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 bg-black overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            style={{ boxShadow: isDonor ? "0 0 24px rgba(220,38,38,0.4)" : "0 0 24px rgba(59,130,246,0.4)" }}
          >
            <img src="/logo.png" alt="HayatLink" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black">
            <span className="text-emerald-400">Hayat</span>
            <span className="text-red-500">Link</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-medium">إنشاء حساب جديد</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 relative"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* Back */}
          <Link href="/"
            className="absolute top-5 left-5 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Title row */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDonor ? "bg-red-500/20" : "bg-blue-500/20"}`}>
              {isDonor ? <Heart className="w-4 h-4 text-red-400" /> : <Activity className="w-4 h-4 text-blue-400" />}
            </div>
            <div>
              <h2 className="text-white font-black text-base leading-none">
                {initialRole === "DONOR" ? "سجل كمتبرع" :
                 initialRole === "CENTER_STAFF" ? "تسجيل مركز طبي" :
                 initialRole === "HOSPITAL_STAFF" ? "تسجيل مستشفى" : "تسجيل إداري"}
              </h2>
              <p className="text-slate-500 text-[11px] mt-0.5">
                لديك حساب؟{" "}
                <Link href={`/login?type=${portalType}`}
                  className={`font-bold ${isDonor ? "text-red-400 hover:text-red-300" : "text-blue-400 hover:text-blue-300"}`}>
                  سجّل دخولك
                </Link>
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="block text-slate-300 text-[11px] font-bold mb-1.5 tracking-wide">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input type="text" placeholder="محمد عبدالله"
                  className="w-full rounded-xl px-4 py-2.5 pr-10 text-sm transition-all"
                  style={inputStyle(!!errors.name)}
                  {...register("name")} />
              </div>
              {errors.name && <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-300 text-[11px] font-bold mb-1.5 tracking-wide">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input type="email" placeholder="example@email.com"
                  className="w-full rounded-xl px-4 py-2.5 pr-10 text-sm transition-all"
                  style={{ ...inputStyle(!!errors.email), direction: "ltr", textAlign: "right" }}
                  {...register("email")} />
              </div>
              {errors.email && <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-[11px] font-bold mb-1.5 tracking-wide">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-2.5 pr-10 pl-10 text-sm transition-all"
                  style={inputStyle(!!errors.password)}
                  {...register("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(level => (
                      <div key={level} className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{ background: level <= strength ? strengthColors[strength] : "rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: strengthColors[strength] }}>
                    قوة كلمة المرور: {strengthLabels[strength]}
                  </span>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-300 text-[11px] font-bold mb-1.5 tracking-wide">تأكيد كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input type={showConfirm ? "text" : "password"} placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-2.5 pr-10 pl-10 text-sm transition-all"
                  style={inputStyle(!!errors.confirmPassword)}
                  {...register("confirmPassword")} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full py-3 rounded-xl text-white font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 mt-1"
              style={{
                background: isDonor ? "linear-gradient(135deg, #dc2626, #b91c1c)" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                boxShadow: isDonor ? "0 8px 24px rgba(220,38,38,0.35)" : "0 8px 24px rgba(37,99,235,0.35)",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? <><span className="spinner" /> جاري التسجيل...</> : <>إنشاء الحساب</>}
            </button>
          </form>

          <p className="text-center text-slate-600 text-[10px] mt-4">
            بالتسجيل، أنت توافق على{" "}
            <span className={`${isDonor ? "text-red-400" : "text-blue-400"} hover:underline cursor-pointer`}>شروط الاستخدام</span>
            {" "}و{" "}
            <span className={`${isDonor ? "text-red-400" : "text-blue-400"} hover:underline cursor-pointer`}>سياسة الخصوصية</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="spinner-red" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
