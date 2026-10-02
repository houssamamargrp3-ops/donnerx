"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, Heart, Activity,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portalType = searchParams?.get("type") === "medical" ? "medical" : "donor";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDonor = portalType === "donor";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      try {
        localStorage.removeItem("hayatlink_offline_donor");
        localStorage.removeItem("hayatlink_offline_profile");
        localStorage.removeItem("hayatlink_offline_donations");
      } catch (_) {}

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("حدث خطأ، يرجى المحاولة لاحقاً");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: isDonor
          ? "radial-gradient(ellipse at 30% 20%, rgba(220,38,38,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(153,27,27,0.08) 0%, transparent 55%), linear-gradient(160deg, #0f172a 0%, #1a0a0a 50%, #0f172a 100%)"
          : "radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.12) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(29,78,216,0.08) 0%, transparent 55%), linear-gradient(160deg, #0f172a 0%, #060d1f 50%, #0f172a 100%)",
      }}
    >
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float opacity-10"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              background: isDonor
                ? `radial-gradient(circle, #dc2626, transparent)`
                : `radial-gradient(circle, #3b82f6, transparent)`,
              right: `${5 + i * 20}%`,
              top: `${10 + i * 16}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${4 + i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-sm animate-scale-in relative z-10">

        {/* ── Logo ── */}
        <div className="text-center mb-7">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 bg-black overflow-hidden hover:scale-105 transition-transform cursor-pointer"
            style={{ boxShadow: isDonor ? "0 0 32px rgba(220,38,38,0.4)" : "0 0 32px rgba(59,130,246,0.4)" }}
          >
            <img src="/logo.png" alt="HayatLink" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-emerald-400">Hayat</span>
            <span className="text-red-500">Link</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            {isDonor ? "بوابة المتبرعين — نصل العطاء بالحياة" : "البوابة الطبية وإدارة المراكز"}
          </p>
        </div>

        {/* ── Card ── */}
        <div
          className="rounded-2xl p-7 relative"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* Back arrow */}
          <Link
            href="/"
            className="absolute top-5 left-5 w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Portal badge */}
          <div className="flex items-center gap-2 mb-5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDonor ? "bg-red-500/20" : "bg-blue-500/20"}`}
            >
              {isDonor
                ? <Heart className={`w-4 h-4 text-red-400`} />
                : <Activity className={`w-4 h-4 text-blue-400`} />}
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-none">تسجيل الدخول</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {isDonor ? "بوابة المتبرعين" : "البوابة الطبية"}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-slate-300 text-xs font-bold mb-1.5 tracking-wide">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  placeholder="example@email.com"
                  className={`w-full rounded-xl px-4 py-3 pr-10 text-sm font-medium outline-none transition-all ${
                    errors.email
                      ? "border-red-500/60 focus:border-red-400"
                      : isDonor
                        ? "border-white/10 focus:border-red-500/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                        : "border-white/10 focus:border-blue-500/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
                  }`}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: `1.5px solid ${errors.email ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                    color: "white",
                    direction: "ltr",
                    textAlign: "right",
                  }}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-xs font-bold mb-1.5 tracking-wide">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 pr-10 pl-10 text-sm font-medium outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: `1.5px solid ${errors.password ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                    color: "white",
                  }}
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
              {errors.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-left">
              <Link
                href="/forgot-password"
                className={`text-xs font-semibold transition-colors ${isDonor ? "text-red-400 hover:text-red-300" : "text-blue-400 hover:text-blue-300"}`}
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 mt-1"
              style={{
                background: isDonor
                  ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                  : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                boxShadow: isDonor
                  ? "0 8px 24px rgba(220,38,38,0.35)"
                  : "0 8px 24px rgba(37,99,235,0.35)",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  جاري الدخول...
                </>
              ) : (
                <>
                  <span>دخول</span>
                  {isDonor ? <Heart className="w-4 h-4 fill-white" /> : <Activity className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="px-3 text-slate-500 text-xs">أو</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Register */}
          <Link
            href={`/register?role=${isDonor ? "donor" : "center"}`}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/10"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            إنشاء حساب جديد
          </Link>
        </div>

        <p className="text-center text-slate-600 text-xs mt-5">
          © {new Date().getFullYear()} HayatLink —{" "}
          {isDonor ? "كل تبرع ينقذ حياة 🩸" : "شريكك في إنقاذ الأرواح 🏥"}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="spinner-red" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
