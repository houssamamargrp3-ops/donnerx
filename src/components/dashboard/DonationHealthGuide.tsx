"use client";

import { useState } from "react";
import {
  HeartPulse,
  Utensils,
  Moon,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  Info,
  Sparkles,
  Coffee,
  Check,
  X,
  Bell,
  Clock
} from "lucide-react";

export default function DonationHealthGuide({ compact = false }: { compact?: boolean }) {
  const [activeTab, setActiveTab] = useState<"diet" | "sleep" | "pressure" | "criteria">("diet");

  const guideSections = {
    diet: {
      title: "التغذية وشرب السوائل",
      icon: <Utensils className="w-5 h-5 text-emerald-600" />,
      color: "emerald",
      dos: [
        "تناول وجبة صحية خفيفة قبل التبرع بـ 2 إلى 3 ساعات (مثل: بيض، جبن قليل الدسم، تمر، شوفان).",
        "اشرب نصف لتر (500 مل) من الماء أو العصائر الطبيعية قبل التبرع مباشرة لتعزيز تدفق الدم ومنع الدوار.",
        "احرص على تناول الأغذية الغنية بالحديد (العدس، الفول، اللحوم الحمراء، السبانخ) في الأيام السابقة.",
      ],
      donts: [
        "ممنوع التبرع على معدة فارغة تماماً (صيام بدون طعام يسبب هبوط السكر والدوار).",
        "تجنب الأطعمة الدسمة والمقليات والوجبات السريعة قبل التبرع بـ 12 ساعة (الدهون تعكر نقاء البلازما وتؤدي لرفض العينة).",
        "تجنب الإكثار من المنبهات القوية (القهوة والشاي الثقيل ومشروبات الطاقة) قبل التبرع بساعتين.",
      ],
      badge: "ضروري لتفادي الدوار ورفض البلازما",
    },
    sleep: {
      title: "النوم والراحة البدنية",
      icon: <Moon className="w-5 h-5 text-indigo-600" />,
      color: "indigo",
      dos: [
        "احصل على قسط كافٍ من النوم العميق المتواصل (7 إلى 8 ساعات) في الليلة السابقة للتبرع.",
        "احرص على أخذ قسط من الراحة والاسترخاء لمدة 10-15 دقيقة بعد سحب الدم مباشرة في المركز.",
      ],
      donts: [
        "تجنب السهر والإرهاق وقلة النوم (النوم أقل من 6 ساعات يرفع احتمالية الإغماء أثناء السحب).",
        "تجنب التمارين الرياضية الشاقة والمجهود العضلي العنيف قبل التبرع بـ 12 ساعة ولمدة 24 ساعة بعده.",
      ],
      badge: "يحمي من الإغماء وهبوط الدورة الدموية",
    },
    pressure: {
      title: "ضغط الدم والمؤشرات الحيوية",
      icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
      color: "rose",
      dos: [
        "يجب أن يكون ضغط الدم في النطاق السليم: الانقباضي (100 - 140) والانبساطي (60 - 90 ملم زئبق).",
        "حافظ على هدوئك وتنفس بعمق قبل قياس الضغط داخل غرفة الفحص الطبي.",
        "أخبر الطبيب بأي أدوية تتناولها بانتظام قبل البدء.",
      ],
      donts: [
        "الامتناع عن التدخين قبل التبرع بساعتين وبعده بساعتين (التدخين يرفع الضغط ويقلل الأكسجين في الدم).",
        "عدم التبرع في حال وجود حمى، التهاب بالحلق، رشح، سعال أو أي نزلة برد نشطة.",
        "تجنب أخذ الأسبرين أو مضادات التخثر قبل التبرع بـ 48 ساعة (خاصة عند التبرع بالصفائح).",
      ],
      badge: "فحص إجباري قبل كل عملية سحب",
    },
    criteria: {
      title: "شروط الأهلية والقبول",
      icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
      color: "amber",
      dos: [
        "الوزن: 50 كغ فما فوق (لضمان سحب آمن لحجم 450 مل).",
        "العمر: بين 18 و 65 سنة.",
        "الهيموجلوبين: أكثر من 13 g/dL للرجال وأكثر من 12.5 g/dL للنساء.",
        "الفاصل الزمني: 3 أشهر بين كل تبرع للرجال، و 4 أشهر للنساء.",
      ],
      donts: [
        "ممنوع التبرع في حال إجراء عملية جراحية كبرى خلال آخر 6 أشهر.",
        "ممنوع التبرع أثناء فترة الحمل أو الرضاعة أو في حال وجود وشم/حجامة خلال آخر 6 أشهر.",
      ],
      badge: "معايير السلامة الطبية الوطنية",
    },
  };

  const current = guideSections[activeTab];

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-rose-50/40 to-amber-50 rounded-2xl p-4 border border-red-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                تذكير شروط التبرع بالدم 🩸
                <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">لضمان القبول</span>
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">نصائح ذهبية لتجنب الرفض يوم السحب والحملة</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
          <div className="bg-white/90 p-2 rounded-xl border border-red-100/60 shadow-2xs">
            <Utensils className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
            <div className="font-bold text-slate-800">وجبة خفيفة + ماء</div>
            <div className="text-[9px] text-slate-400">تجنب الدهون والجوع</div>
          </div>
          <div className="bg-white/90 p-2 rounded-xl border border-red-100/60 shadow-2xs">
            <Moon className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
            <div className="font-bold text-slate-800">نوم 8 ساعات</div>
            <div className="text-[9px] text-slate-400">تجنب السهر والإجهاد</div>
          </div>
          <div className="bg-white/90 p-2 rounded-xl border border-red-100/60 shadow-2xs">
            <HeartPulse className="w-4 h-4 text-rose-600 mx-auto mb-1" />
            <div className="font-bold text-slate-800">ضغط دم معتدل</div>
            <div className="text-[9px] text-slate-400">بدون حمى أو تدخين</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -ml-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-black text-red-100 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              دليل التثقيف الصحي والجاهزية
            </div>
            <h2 className="text-xl md:text-2xl font-black">
              شروط وتعليمات التبرع بالدم — كيف تتجنب الرفض يوم السحب؟
            </h2>
            <p className="text-xs md:text-sm text-red-100 mt-1 max-w-2xl font-medium">
              اتباع هذه النصائح المتعارف عليها طبياً يضمن سلامتك الصحية أولاً، ويجعل دمك صالحاً لإنقاذ حياة المرضى بنسبة 100%.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-center flex-shrink-0">
            <div className="flex items-center gap-1.5 justify-center text-xs font-black text-amber-300 mb-0.5">
              <Clock className="w-4 h-4" />
              <span>قبل الحملة بـ 12 ساعة</span>
            </div>
            <span className="text-[10px] text-white/80 font-bold block">ابدأ التحضير بالنوم وشرب الماء</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex flex-wrap gap-2">
        {(Object.keys(guideSections) as Array<keyof typeof guideSections>).map((key) => {
          const sec = guideSections[key];
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm scale-102"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {sec.icon}
              <span>{sec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
            {current.icon}
            <span>{current.title}</span>
          </h3>
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full border border-slate-200">
            {current.badge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* DO's */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>ما يجب عليك فعله (موصى به):</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-950 font-medium leading-relaxed">
              {current.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DONT's */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
              <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">
                <X className="w-3.5 h-3.5" />
              </div>
              <span>ما يجب تجنبه (محظورات):</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-950 font-medium leading-relaxed">
              {current.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 12-Hour Pre-Campaign Checklist Reminder Card */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
            <Bell className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-amber-950">
              جدول التذكير التلقائي: قبل الموعد أو الحملة بـ 12 ساعة
            </h4>
            <p className="text-[11px] text-amber-900/80 leading-relaxed font-medium">
              يرسل لك التطبيق تذكيراً ذكياً قبل بدء الحملة بـ 12 ساعة للتأكد من شرب الماء، النوم الباكر وتناول وجبة خفيفة لتكون جاهزاً بنسبة 100% للتبرع وتفادي أي سبب قد يمنع سحب الدم.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
