import Link from "next/link";
import { ArrowLeft, Clock, Sparkles, CheckCircle2, Hammer, Code, Shield } from "lucide-react";

interface UnderDevelopmentViewProps {
  title: string;
  description: string;
  iconName?: "inventory" | "gamification" | "ai";
  progressPercentage?: number;
  phaseName?: string;
}

export default function UnderDevelopmentView({
  title,
  description,
  iconName = "inventory",
  progressPercentage = 65,
  phaseName = "المرحلة الثانية من الهاكاثون",
}: UnderDevelopmentViewProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-6">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Animated Icon Box */}
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30 text-3xl animate-bounce">
            {iconName === "inventory" && "📦"}
            {iconName === "gamification" && "🏆"}
            {iconName === "ai" && "🤖"}
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-3.5 py-1.5 rounded-full text-xs font-black mt-5">
            <Hammer className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>ميزة قيد التطوير والتجهيز — {phaseName} 🚀</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 relative z-10">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            {title}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Phased Roadmap Timeline for Hackathon Committee */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-right space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-600" />
              <span>خارطة طريق تطوير الميزة (Hackathon Milestones):</span>
            </span>
            <span className="text-xs font-mono font-black text-amber-600 bg-amber-100/60 px-2.5 py-0.5 rounded-md">
              {progressPercentage}% منجز
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>المرحلة 1: النماذج الأولية</span>
              </div>
              <p className="text-[10px] text-slate-400">التصميم الهندسي وقواعد البيانات</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-300 shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-700">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>المرحلة 2: الربط البرمجي</span>
              </div>
              <p className="text-[10px] text-slate-500">جاري الإنجاز خلال فعاليات الهاكاثون</p>
            </div>

            <div className="p-3 bg-slate-100/60 rounded-xl border border-slate-200/50 space-y-1 opacity-70">
              <div className="flex items-center gap-1.5 font-bold text-slate-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المرحلة 3: الإطلاق النهائي</span>
              </div>
              <p className="text-[10px] text-slate-400">العرض النهائي أمام لجنة التحكيم</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-2 relative z-10 flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <span>العودة للوحة التحكم الرئيسية</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
