"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplet, Activity, Heart, AlertCircle, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
      setError("يرجى تعبئة جميع الحقول المطلوبة لبدء إنقاذ الأرواح.");
      return;
    }

    if (Number(weight) < 50) {
      setError("عذراً، يجب أن يكون الوزن 50 كجم على الأقل حفاظاً على سلامتك أثناء التبرع.");
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

      if (!res.ok) throw new Error("حدث خطأ أثناء حفظ البيانات.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "فشل الاتصال بالخادم.");
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }}
            className="error-toast flex items-center gap-3 overflow-hidden"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <label className="text-slate-700 font-bold mb-4 flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><Droplet className="w-5 h-5" /></div>
          ما هي فصيلة دمك؟ *
        </label>
        <div className="grid grid-cols-4 gap-4">
          {bloodTypes.map(bt => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={bt}
              type="button"
              onClick={() => setBloodType(bt)}
              className={`relative h-16 rounded-lg font-black text-xl flex items-center justify-center transition-all overflow-hidden border ${
                bloodType === bt
                  ? "bg-red-50 text-red-600 border-red-500 shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {bloodType === bt && (
                <motion.div 
                  layoutId="activeBloodType" 
                  className="absolute inset-0 bg-red-100 z-0 opacity-50" 
                  style={{ borderRadius: 8 }}
                />
              )}
              <span className="relative z-10">{formatBloodType(bt)}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
        <div className="group relative">
          <label className="text-slate-700 font-bold mb-3 flex items-center gap-2">
            رقم الهاتف للتواصل *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
            placeholder="مثال: 05xxxxxxxxx"
            required
            dir="ltr"
          />
        </div>

        <div className="group relative">
          <label className="text-slate-700 font-bold mb-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Activity className="w-4 h-4" /></div>
            الوزن (كجم) *
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
            className="w-full bg-slate-50 border border-slate-300 rounded-md px-4 py-3 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
            placeholder="مثال: 75"
            min={30}
            max={250}
            required
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setChronicDiseases(!chronicDiseases)}
          className={`p-6 rounded-md border flex items-center gap-4 cursor-pointer transition-all ${
            chronicDiseases ? "bg-red-50 border-red-500" : "bg-slate-50 border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            chronicDiseases ? "bg-red-500 border-red-500" : "border-slate-300 bg-white"
          }`}>
            {chronicDiseases && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><ChevronLeft className="w-4 h-4 text-white" /></motion.div>}
          </div>
          <div>
            <label className="text-slate-800 font-bold cursor-pointer text-lg">أعاني من أمراض مزمنة تمنع التبرع</label>
            <p className="text-slate-500 text-sm mt-1">يرجى التأشير هنا إذا كنت تعاني من أمراض القلب، أو أمراض معدية.</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-emerald-50 border-r-4 border-emerald-500 rounded-md p-5 flex items-start gap-4">
        <div className="p-2 bg-emerald-100 rounded-full animate-pulse">
          <Heart className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-emerald-700 font-bold mb-1">نقاط ترحيبية بانتظارك!</h4>
          <p className="text-emerald-600 text-sm leading-relaxed">
            بمجرد إكمال ملفك وحفظه، ستحصل مباشرة على <span className="font-bold text-emerald-800 px-1">50 نقطة</span> كنقطة بداية في رحلتك لإنقاذ الأرواح.
          </p>
        </div>
      </motion.div>

      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-md font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-sm"
      >
        {isSubmitting ? (
          <span className="spinner border-t-white" />
        ) : (
          <>
            حفظ البيانات والدخول
            <ChevronLeft className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
