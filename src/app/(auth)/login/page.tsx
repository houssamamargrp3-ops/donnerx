"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { Eye, EyeOff, Droplets, Mail, Lock, ArrowLeft, ArrowRight, AlertCircle, Activity, Heart } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portalType = searchParams?.get("type") === "medical" ? "medical" : "donor";
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("حدث خطأ، يرجى المحاولة لاحقاً");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: portalType === "donor" ? "radial-gradient(circle, #dc2626, transparent)" : "radial-gradient(circle, #3b82f6, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5"
          style={{ background: portalType === "donor" ? "radial-gradient(circle, #991b1b, transparent)" : "radial-gradient(circle, #1d4ed8, transparent)" }}
        />
        {/* Floating blood drops */}
        {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute opacity-20 text-2xl animate-float ${portalType === "donor" ? "text-red-900" : "text-blue-900"}`}
              style={{
                right: `${10 + i * 15}%`,
                top: `${20 + i * 12}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            >
              {portalType === "donor" ? "🩸" : "🏥"}
            </div>
          ))}
        </div>

        <div className="w-full max-w-md animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-pulse-red`}
              style={{
                background: portalType === "donor" ? "linear-gradient(135deg, #dc2626, #991b1b)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                boxShadow: portalType === "donor" ? "0 0 40px rgba(220,38,38,0.4)" : "0 0 40px rgba(59,130,246,0.4)",
              }}
            >
              {portalType === "donor" ? <Heart className="w-10 h-10 text-white" /> : <Activity className="w-10 h-10 text-white" />}
            </div>
            <h1 className="text-4xl font-black gradient-text tracking-widest">
              {portalType === "donor" ? "بوابة المتبرعين" : "البوابة الطبية"}
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              {portalType === "donor" ? "سجل دخولك كمتبرع بالدم" : "دخول المراكز والمستشفيات"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-8 relative">
            <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">تسجيل الدخول</h2>
            <p className="text-slate-500 text-sm mb-6">
              ليس لديك حساب؟{" "}
              <Link href={`/register?role=${portalType === 'donor' ? 'donor' : 'center'}`} className={`${portalType === 'donor' ? 'text-red-600 hover:text-red-700' : 'text-blue-600 hover:text-blue-700'} font-semibold transition-colors`}>
                سجّل الآن
              </Link>
            </p>

          {/* Error Alert */}
          {error && (
            <div className="error-toast flex items-center gap-3 mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className={`w-full bg-white border ${errors.email ? "border-red-500" : "border-slate-300"} rounded-md px-4 py-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  style={{ direction: "ltr", textAlign: "right" }}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-white border ${errors.password ? "border-red-500" : "border-slate-300"} rounded-md px-4 py-3 pr-10 pl-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-left">
              <Link
                href="/forgot-password"
                className={`text-slate-500 text-sm transition-colors ${portalType === "donor" ? "hover:text-red-600" : "hover:text-blue-600"}`}
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  <span>جاري الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="px-4 text-slate-400 text-xs">أو</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

            {/* Register Link */}
            <Link
              href={`/register?role=${portalType === 'donor' ? 'donor' : 'center'}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all font-medium text-sm"
            >
              إنشاء حساب جديد
            </Link>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            © {new Date().getFullYear()} DONNER.X — {portalType === "donor" ? "كل تبرع ينقذ حياة 🩸" : "شريكك في إنقاذ الأرواح 🏥"}
          </p>
        </div>
      </div>
    );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="spinner"></div></div>}>
      <LoginForm />
    </Suspense>
  );
}
