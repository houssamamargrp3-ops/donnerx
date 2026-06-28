"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplet, Activity, Heart, AlertCircle } from "lucide-react";

export default function DonorSetupForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [bloodType, setBloodType] = useState<string>("");
  const [weight, setWeight] = useState<number | "">("");
  const [phone, setPhone] = useState<string>("");
  const [chronicDiseases, setChronicDiseases] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bloodTypes = ["O_POSITIVE", "O_NEGATIVE", "A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE"];
  
  const formatBloodType = (bt: string) => bt.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodType || !weight || !phone) {
      setError("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    if (Number(weight) < 50) {
      setError("عذراً، يجب أن يكون الوزن 50 كجم على الأقل للتبرع بالدم.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/donor/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          bloodType,
          weight: Number(weight),
          phone,
          chronicDiseases,
        }),
      });

      if (!res.ok) {
        throw new Error("حدث خطأ أثناء حفظ البيانات.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "فشل الاتصال بالخادم.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="error-toast flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Blood Type */}
      <div>
        <label className="block text-slate-300 font-bold mb-3 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-red-500" />
          فصيلة الدم *
        </label>
        <div className="grid grid-cols-4 gap-3">
          {bloodTypes.map(bt => (
            <button
              key={bt}
              type="button"
              onClick={() => setBloodType(bt)}
              className={`py-3 rounded-xl border-2 font-bold transition-all ${
                bloodType === bt
                  ? "bg-red-500/10 border-red-500 text-red-400"
                  : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500"
              }`}
            >
              {formatBloodType(bt)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone */}
        <div>
          <label className="block text-slate-300 font-bold mb-3 flex items-center gap-2">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="form-input w-full"
            placeholder="مثال: 05xxxxxxxxx"
            required
            dir="ltr"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-slate-300 font-bold mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            الوزن (كجم) *
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
            className="form-input w-full"
            placeholder="الوزن بالكيلوجرام"
            min={30}
            max={250}
            required
          />
        </div>
      </div>

      {/* Chronic Diseases */}
      <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30 flex items-center gap-4 cursor-pointer"
           onClick={() => setChronicDiseases(!chronicDiseases)}>
        <input 
          type="checkbox" 
          checked={chronicDiseases}
          onChange={() => {}} // handled by div click
          className="w-5 h-5 accent-red-500 cursor-pointer"
        />
        <div>
          <label className="text-white font-bold cursor-pointer">هل تعاني من أي أمراض مزمنة تمنعك من التبرع؟</label>
          <p className="text-slate-400 text-sm">مثل أمراض القلب، الإيدز، التهاب الكبد الوبائي.</p>
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 text-emerald-400 text-sm">
        <Heart className="w-5 h-5 shrink-0" />
        <p>بمجرد إكمال ملفك، ستحصل على <strong>50 نقطة ترحيبية</strong> كهدية للبدء في رحلتك لإنقاذ الأرواح!</p>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-lg">
        {isSubmitting ? <span className="spinner" /> : "حفظ البيانات والبدء"}
      </button>
    </form>
  );
}
