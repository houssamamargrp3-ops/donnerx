"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplet, Activity, Heart, AlertCircle, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
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
        <label className="text-slate-300 font-bold mb-4 flex items-center gap-2 text-lg">
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
              className={`relative h-16 rounded-2xl font-black text-xl flex items-center justify-center transition-all overflow-hidden ${
                bloodType === bt
                  ? "bg-gradient-to-br from-red-500 to-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] border-none"
                  : "bg-slate-800/50 border-2 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
              }`}
            >
              {bloodType === bt && (
                <motion.div 
                  layoutId="activeBloodType" 
                  className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 z-0" 
                  style={{ borderRadius: 16 }}
                />
              )}
              <span className="relative z-10">{formatBloodType(bt)}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/50">
        <div className="group relative">
          <label className="text-slate-300 font-bold mb-3 flex items-center gap-2">
            رقم الهاتف للتواصل *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
            placeholder="مثال: 05xxxxxxxxx"
            required
            dir="ltr"
          />
        </div>

        <div className="group relative">
          <label className="text-slate-300 font-bold mb-3 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><Activity className="w-4 h-4" /></div>
            الوزن (كجم) *
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
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
          className={`p-6 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
            chronicDiseases ? "bg-red-500/10 border-red-500/50" : "bg-slate-800/30 border-slate-700/50 hover:border-slate-600"
          }`}
        >
          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            chronicDiseases ? "bg-red-500 border-red-500" : "border-slate-500"
          }`}>
            {chronicDiseases && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><ChevronLeft className="w-4 h-4 text-white" /></motion.div>}
          </div>
          <div>
            <label className="text-white font-bold cursor-pointer text-lg">أعاني من أمراض مزمنة تمنع التبرع</label>
            <p className="text-slate-400 text-sm mt-1">يرجى التأشير هنا إذا كنت تعاني من أمراض القلب، أو أمراض معدية.</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-500/10 to-transparent border-r-4 border-emerald-500 rounded-lg p-5 flex items-start gap-4">
        <div className="p-2 bg-emerald-500/20 rounded-full animate-pulse">
          <Heart className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-emerald-400 font-bold mb-1">نقاط ترحيبية بانتظارك!</h4>
          <p className="text-slate-300 text-sm leading-relaxed">
            بمجرد إكمال ملفك وحفظه، ستحصل مباشرة على <span className="font-bold text-white px-1">50 نقطة</span> كنقطة بداية في رحلتك لإنقاذ الأرواح.
          </p>
        </div>
      </motion.div>

      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(220,38,38,0.5)" }}
        whileTap={{ scale: 0.98 }}
        type="submit" 
        disabled={isSubmitting} 
        className="btn-primary w-full py-5 text-xl rounded-2xl flex items-center justify-center gap-3"
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
