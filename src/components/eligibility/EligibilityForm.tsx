"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eligibilitySchema, EligibilityFormData } from "@/lib/validations/eligibility";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Activity, ShieldCheck, HeartPulse, User, Save, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { submitEligibilityCheck } from "@/app/actions/eligibility.actions";

export default function EligibilityForm({ donorId, initialAge, initialWeight, gender }: { donorId: string; initialAge: number; initialWeight: number; gender: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ isEligible: boolean; reason: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EligibilityFormData>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues: {
      donorId,
      age: initialAge,
      weight: initialWeight,
      isPregnant: false,
      recentSurgery: false,
      hasRecentTattoo: false,
    },
  });

  const onSubmit = (data: EligibilityFormData) => {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const res = await submitEligibilityCheck(data);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setResult({ isEligible: res.isEligible!, reason: res.reason! });
        if (res.isEligible) {
          setTimeout(() => {
            router.push(`/dashboard/donors/${donorId}`);
            router.refresh();
          }, 2000);
        }
      }
    });
  };

  return (
    <div className="labo-card p-8 animate-fade-in-up border-t-4 border-t-blue-500">
      
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 font-bold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={`mb-8 p-6 rounded-2xl flex items-start gap-4 border ${result.isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="mt-1">
            {result.isEligible ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <AlertTriangle className="w-8 h-8 text-red-500" />}
          </div>
          <div>
            <h3 className="text-xl font-black mb-1">
              {result.isEligible ? "المتبرع مؤهل للتبرع بالدم 🎉" : "المتبرع غير مؤهل مؤقتاً"}
            </h3>
            {!result.isEligible && (
              <p className="font-bold opacity-80">السبب: {result.reason}</p>
            )}
            {!result.isEligible && (
              <button onClick={() => router.push(`/dashboard/donors/${donorId}`)} className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold text-sm transition-colors border border-red-200">
                العودة لملف المتبرع
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={`space-y-8 ${result?.isEligible ? 'opacity-50 pointer-events-none' : ''}`}>
        
        {/* Section 1: Vitals */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <Activity className="w-5 h-5 text-blue-600" />
            القياسات الحيوية (Vitals)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">العمر (سنوات)</label>
              <input type="number" {...register("age", { valueAsNumber: true })} className="form-input w-full bg-slate-50 border border-slate-200 rounded-lg py-2 focus:border-blue-500 outline-none" />
              {errors.age && <p className="text-red-500 text-xs mt-1 font-bold">{errors.age.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">الوزن (كجم)</label>
              <input type="number" step="0.1" {...register("weight", { valueAsNumber: true })} className="form-input w-full bg-slate-50 border border-slate-200 rounded-lg py-2 focus:border-blue-500 outline-none" />
              {errors.weight && <p className="text-red-500 text-xs mt-1 font-bold">{errors.weight.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">الضغط الانقباضي</label>
              <input type="number" placeholder="مثال: 120" {...register("bloodPressureSystolic", { valueAsNumber: true })} className="form-input w-full bg-white border border-slate-200 rounded-lg py-2 focus:border-blue-500 outline-none" />
              {errors.bloodPressureSystolic && <p className="text-red-500 text-xs mt-1 font-bold">{errors.bloodPressureSystolic.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">الضغط الانبساطي</label>
              <input type="number" placeholder="مثال: 80" {...register("bloodPressureDiastolic", { valueAsNumber: true })} className="form-input w-full bg-white border border-slate-200 rounded-lg py-2 focus:border-blue-500 outline-none" />
              {errors.bloodPressureDiastolic && <p className="text-red-500 text-xs mt-1 font-bold">{errors.bloodPressureDiastolic.message}</p>}
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">نسبة الهيموغلوبين (g/dL)</label>
              <input type="number" step="0.1" placeholder={gender === 'MALE' ? "الحد الأدنى للذكور: 13.0" : "الحد الأدنى للإناث: 12.5"} {...register("hemoglobin", { valueAsNumber: true })} className="form-input w-full md:w-1/4 bg-white border border-slate-200 rounded-lg py-2 focus:border-blue-500 outline-none" />
              {errors.hemoglobin && <p className="text-red-500 text-xs mt-1 font-bold">{errors.hemoglobin.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Questionnaire */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <HeartPulse className="w-5 h-5 text-red-500" />
            الاستبيان الطبي السريع
          </h3>
          <div className="space-y-4">
            
            {gender === "FEMALE" && (
              <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <input type="checkbox" {...register("isPregnant")} className="w-5 h-5 text-blue-600 rounded border-slate-300" />
                <span className="font-bold text-slate-700">هل يوجد حمل أو ولادة خلال الـ 6 أشهر الماضية؟</span>
              </label>
            )}

            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
              <input type="checkbox" {...register("recentSurgery")} className="w-5 h-5 text-blue-600 rounded border-slate-300" />
              <span className="font-bold text-slate-700">هل خضعت لأي عملية جراحية كبرى خلال الـ 6 أشهر الماضية؟</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
              <input type="checkbox" {...register("hasRecentTattoo")} className="w-5 h-5 text-blue-600 rounded border-slate-300" />
              <span className="font-bold text-slate-700">هل قمت بعمل وشم أو ثقب تجميلي أو حجامة خلال الـ 6 أشهر الماضية؟</span>
            </label>

          </div>
        </div>

        {/* Section 3: History */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <User className="w-5 h-5 text-emerald-600" />
            السجل والأدوية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">أمراض مزمنة أو سارية (افصل بفاصلة)</label>
              <input type="text" {...register("chronicConditions")} placeholder="مثال: السكري، الضغط..." className="form-input w-full bg-white border border-slate-200 rounded-lg py-2 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">الأدوية الحالية (افصل بفاصلة)</label>
              <input type="text" {...register("currentMedications")} placeholder="مثال: أسبرين، مضادات حيوية..." className="form-input w-full bg-white border border-slate-200 rounded-lg py-2 focus:border-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">سفر لمناطق موبوءة مؤخراً؟ (أذكر الدول إن وجد)</label>
              <input type="text" {...register("recentTravel")} placeholder="اتركه فارغاً إذا لم يوجد" className="form-input w-full bg-white border border-slate-200 rounded-lg py-2 focus:border-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors border border-slate-200"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-white font-bold transition-all bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            {isPending ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
            تقييم الأهلية وتحديث السجل
          </button>
        </div>

      </form>
    </div>
  );
}
