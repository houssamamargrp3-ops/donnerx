"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eligibilitySchema, EligibilityFormData } from "@/lib/validations/eligibility";
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
  } = useForm<EligibilityFormData>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: {
      isPregnant: "false",
      recentSurgery: "false",
      hasRecentTattoo: "false",
    }
  });

  const onSubmit = (data: EligibilityFormData) => {
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
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12 text-center animate-scale-in max-w-2xl mx-auto">
        <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm ${
          result.isEligible ? "bg-emerald-100 text-emerald-600 border border-emerald-200" : "bg-red-100 text-red-600 border border-red-200"
        }`}>
          {result.isEligible ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
        </div>
        
        <h2 className={`text-3xl font-bold mb-4 ${result.isEligible ? "text-emerald-700" : "text-red-700"}`}>
          {result.isEligible ? "أنت مؤهل للتبرع بالدم! 🎉" : "عذراً، لا يمكنك التبرع حالياً"}
        </h2>
        
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          {result.isEligible 
            ? "شكراً لصدقك في الإجابة وحرصك على إنقاذ الأرواح. يمكنك الآن التوجه لأقرب مركز أو حجز موعد للتبرع."
            : result.reason || "بناءً على إجاباتك، وحرصاً على سلامتك وسلامة المرضى، لا يمكنك التبرع في الوقت الحالي."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-3 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 transition-colors">
            العودة للوحة التحكم
          </Link>
          {result.isEligible && (
            <Link href="/dashboard/appointments" className="w-full sm:w-auto px-8 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-colors">
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
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-red-100 border border-red-200">
          <HeartPulse className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3">الاستبيان الطبي للأهلية</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          يرجى الإجابة على الأسئلة التالية بصدق وشفافية. إجاباتك ستساعدنا في تحديد أهليتك للتبرع بالدم للحفاظ على صحتك وصحة المريض.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 animate-fade-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in-up">
        {/* Basic Stats */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-red-500" />
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-red-600" />
            البيانات الحيوية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2">العمر (بالسنوات)</label>
              <input 
                type="number" 
                className={`w-full bg-slate-50 border ${errors.age ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg`}
                placeholder="مثال: 25"
                {...register("age", { valueAsNumber: true })} 
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
            </div>
            
            <div>
              <label className="block text-slate-700 font-medium mb-2">الوزن التقريبي (كجم)</label>
              <input 
                type="number" 
                className={`w-full bg-slate-50 border ${errors.weight ? 'border-red-500' : 'border-slate-300'} rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg`}
                placeholder="مثال: 70"
                {...register("weight", { valueAsNumber: true })} 
              />
              {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
            </div>
          </div>
        </div>

        {/* Medical History (Yes/No questions) */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-blue-500" />
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            التاريخ الطبي والحالة الحالية
          </h3>
          
          <div className="space-y-6">
            {/* Pregnant */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-slate-50 border border-slate-200">
              <div>
                <p className="text-slate-800 font-medium">هل أنتِ حامل أو في فترة إرضاع؟ (للنساء فقط)</p>
                <p className="text-slate-500 text-sm mt-1">يمنع التبرع بالدم أثناء فترة الحمل ولفترة بعد الولادة</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register("isPregnant")} className="w-4 h-4 accent-red-600" />
                  <span className="text-slate-700">نعم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" defaultChecked {...register("isPregnant")} className="w-4 h-4 accent-red-600" />
                  <span className="text-slate-700">لا / ذكر</span>
                </label>
              </div>
            </div>

            {/* Surgery */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-slate-50 border border-slate-200">
              <div>
                <p className="text-slate-800 font-medium">هل خضعت لأي عملية جراحية كبرى خلال الـ 6 أشهر الماضية؟</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register("recentSurgery")} className="w-4 h-4 accent-red-600" />
                  <span className="text-slate-700">نعم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" defaultChecked {...register("recentSurgery")} className="w-4 h-4 accent-red-600" />
                  <span className="text-slate-700">لا</span>
                </label>
              </div>
            </div>

            {/* Tattoo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-md bg-slate-50 border border-slate-200">
              <div>
                <p className="text-slate-800 font-medium">هل قمت بعمل وشم (Tattoo) أو ثقب تجميلي خلال الـ 6 أشهر الماضية؟</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="true" {...register("hasRecentTattoo")} className="w-4 h-4 accent-red-600" />
                  <span className="text-slate-700">نعم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="false" defaultChecked {...register("hasRecentTattoo")} className="w-4 h-4 accent-red-600" />
                  <span className="text-slate-700">لا</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full bg-amber-500" />
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-amber-600" />
            معلومات إضافية
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 font-medium mb-2">الأمراض المزمنة (إن وجدت)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: الضغط، السكري، أمراض القلب (افصل بينها بفاصلة)"
                {...register("chronicConditions")} 
              />
              <p className="text-slate-500 text-xs mt-1">اترك الحقل فارغاً إذا كنت لا تعاني من أي أمراض مزمنة.</p>
            </div>
            
            <div>
              <label className="block text-slate-700 font-medium mb-2">الأدوية الحالية</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أذكر أسماء الأدوية التي تتناولها بانتظام"
                {...register("currentMedications")} 
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2">السفر الحديث (خارج الدولة)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أذكر الدول التي سافرت إليها خلال آخر 3 أشهر"
                {...register("recentTravel")} 
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={() => router.back()} className="text-slate-500 hover:text-slate-700 transition-colors font-medium">
            إلغاء والعودة
          </button>
          
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors disabled:opacity-70 disabled:hover:bg-blue-600 shadow-sm"
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
