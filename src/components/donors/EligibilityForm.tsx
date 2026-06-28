"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eligibilitySchema, EligibilityInput, EligibilityFormData } from "@/lib/validations/eligibility";
import { submitEligibilityCheck } from "@/app/actions/eligibility.actions";
import { HeartPulse, CheckCircle2, XCircle, AlertCircle, ArrowLeft, ArrowRight, Activity, Calendar, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EligibilityForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; isEligible: boolean; reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EligibilityInput>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: {
      isPregnant: "false",
      recentSurgery: "false",
      hasRecentTattoo: "false",
    }
  });

  const onSubmit = (data: any) => {
    setError(null);
    startTransition(async () => {
      const res = await submitEligibilityCheck(data);
      if (res.error) {
        setError(res.error);
      } else {
        setResult(res as any);
      }
    });
  };

  if (result) {
    return (
      <div className="glass-card p-8 md:p-12 text-center animate-scale-in max-w-2xl mx-auto border border-white/10">
        <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl ${
          result.isEligible ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {result.isEligible ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
        </div>
        
        <h2 className={`text-3xl font-bold mb-4 ${result.isEligible ? "text-emerald-400" : "text-red-400"}`}>
          {result.isEligible ? "أنت مؤهل للتبرع بالدم! 🎉" : "عذراً، لا يمكنك التبرع حالياً"}
        </h2>
        
        <p className="text-slate-300 text-lg mb-8 leading-relaxed">
          {result.isEligible 
            ? "شكراً لصدقك في الإجابة وحرصك على إنقاذ الأرواح. يمكنك الآن التوجه لأقرب مركز أو حجز موعد للتبرع."
            : result.reason || "بناءً على إجاباتك، وحرصاً على سلامتك وسلامة المرضى، لا يمكنك التبرع في الوقت الحالي."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/donor" className="btn-secondary px-8 py-3 rounded-xl flex items-center justify-center gap-2">
            العودة للوحة التحكم
          </Link>
          {result.isEligible && (
            <Link href="/donor/appointments/new" className="px-8 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-1" style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)" }}>
              حجز موعد للتبرع
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.2), rgba(153,27,27,0.2))", border: "1px solid rgba(220,38,38,0.3)" }}>
          <HeartPulse className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">الاستبيان الطبي للأهلية</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          يرجى الإجابة على الأسئلة التالية بصدق وشفافية. إجاباتك ستساعدنا في تحديد أهليتك للتبرع بالدم للحفاظ على صحتك وصحة المريض.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 animate-fade-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in-up">
        {/* Basic Stats */}
        <div className="glass-card p-6 md:p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-red-400" />
            البيانات الحيوية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2">العمر (بالسنوات)</label>
              <input 
                type="number" 
                className={`form-input text-lg ${errors.age ? 'border-red-500' : ''}`}
                placeholder="مثال: 25"
                {...register("age", { valueAsNumber: true })} 
              />
              {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
            </div>
            
            <div>
              <label className="block text-slate-300 font-medium mb-2">الوزن التقريبي (كجم)</label>
              <input 
                type="number" 
                className={`form-input text-lg ${errors.weight ? 'border-red-500' : ''}`}
                placeholder="مثال: 70"
                {...register("weight", { valueAsNumber: true })} 
              />
              {errors.weight && <p className="text-red-400 text-sm mt-1">{errors.weight.message}</p>}
            </div>
          </div>
        </div>

        {/* Medical History (Yes/No questions) */}
        <div className="glass-card p-6 md:p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            التاريخ الطبي والحالة الحالية
          </h3>
          
          <div className="space-y-6">
            {/* Pregnant */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
              <div>
                <p className="text-white font-medium">هل أنتِ حامل أو في فترة إرضاع؟ (للنساء فقط)</p>
                <p className="text-slate-400 text-sm mt-1">يمنع التبرع بالدم أثناء فترة الحمل ولفترة بعد الولادة</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register("isPregnant")} className="w-4 h-4 accent-red-500" />
                  <span className="text-slate-300">نعم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" defaultChecked {...register("isPregnant")} className="w-4 h-4 accent-red-500" />
                  <span className="text-slate-300">لا / ذكر</span>
                </label>
              </div>
            </div>

            {/* Surgery */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
              <div>
                <p className="text-white font-medium">هل خضعت لأي عملية جراحية كبرى خلال الـ 6 أشهر الماضية؟</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register("recentSurgery")} className="w-4 h-4 accent-red-500" />
                  <span className="text-slate-300">نعم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" defaultChecked {...register("recentSurgery")} className="w-4 h-4 accent-red-500" />
                  <span className="text-slate-300">لا</span>
                </label>
              </div>
            </div>

            {/* Tattoo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/2 border border-white/5">
              <div>
                <p className="text-white font-medium">هل قمت بعمل وشم (Tattoo) أو ثقب تجميلي خلال الـ 6 أشهر الماضية؟</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register("hasRecentTattoo")} className="w-4 h-4 accent-red-500" />
                  <span className="text-slate-300">نعم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" defaultChecked {...register("hasRecentTattoo")} className="w-4 h-4 accent-red-500" />
                  <span className="text-slate-300">لا</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="glass-card p-6 md:p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-amber-400" />
            معلومات إضافية
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-slate-300 font-medium mb-2">الأمراض المزمنة (إن وجدت)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="مثال: الضغط، السكري، أمراض القلب (افصل بينها بفاصلة)"
                {...register("chronicConditions")} 
              />
              <p className="text-slate-500 text-xs mt-1">اترك الحقل فارغاً إذا كنت لا تعاني من أي أمراض مزمنة.</p>
            </div>
            
            <div>
              <label className="block text-slate-300 font-medium mb-2">الأدوية الحالية</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="أذكر أسماء الأدوية التي تتناولها بانتظام"
                {...register("currentMedications")} 
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">السفر الحديث (خارج الدولة)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="أذكر الدول التي سافرت إليها خلال آخر 3 أشهر"
                {...register("recentTravel")} 
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors font-medium">
            إلغاء والعودة
          </button>
          
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
            style={{ background: "linear-gradient(135deg, #dc2626, #991b1b)", boxShadow: "0 8px 25px rgba(220,38,38,0.3)" }}
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
            تأكيد وتقييم الأهلية
          </button>
        </div>

      </form>
    </div>
  );
}
