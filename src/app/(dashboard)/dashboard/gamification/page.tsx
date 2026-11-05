export const metadata = { title: 'نظام التحفيز والجوائز | HayatLink' };
import { Trophy, Award, Gift, Sparkles, Heart, Star, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function GamificationPage() {
  const tiers = [
    { name: "متبرع جديد", min: "0 تبرع", icon: "🌱", color: "from-slate-500 to-slate-700", perks: "بطاقة صحية رقمية + تسجيل فصيلة الدم" },
    { name: "المستوى البرونزي", min: "1 تبرع", icon: "🥉", color: "from-amber-700 to-amber-900", perks: "شهادة شكر رقمية + 100 نقطة تحفيزية" },
    { name: "المستوى الفضي", min: "2 تبرعان", icon: "🥈", color: "from-slate-400 to-slate-600", perks: "أولوية حجز المواعيد + شارة فضية" },
    { name: "المستوى الذهبي 🏆", min: "4 تبرعات في العام", icon: "🥇", color: "from-yellow-500 to-amber-600", highlight: true, perks: "شهادة شرفية معتمدة + درع البطل + أولوية قصوى وجوائز تقديرية" },
    { name: "المستوى البلاتيني", min: "10 تبرعات", icon: "💎", color: "from-cyan-500 to-cyan-700", perks: "عضوية فخرية VIP + تكريم في اليوم العالمي للمتبرعين" },
    { name: "المستوى الأسطوري", min: "20+ تبرع", icon: "👑", color: "from-purple-600 to-pink-600", perks: "وسام الشرف الوطني لإنقاذ الأرواح" },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="labo-page-title">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            نظام التحفيز والجوائز الشرفية
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            كل قطرة دم تنقذ حياة — اكسب النقاط، ارتقِ في المستويات واحصل على تكريمات حصرية
          </p>
        </div>
      </div>

      {/* Featured Golden Challenge Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -ml-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-1.5 bg-black/15 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              تحدي العام للأبطال
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              تبرع 4 مرات في العام وصل للمستوى الذهبي 🥇
            </h2>
            <p className="text-sm md:text-base font-bold text-slate-900/85 max-w-xl">
              المتبرعون المنتظمون هم شريان الحياة الرئيسي لمستشفياتنا. عند إكمالك 4 تبرعات خلال 12 شهراً، تحصل تلقائياً على الرتبة الذهبية، شهادة شرفية رسمية، ودرع التميز الإنساني.
            </p>
          </div>
          <div className="flex-shrink-0 text-center bg-white/20 backdrop-blur-md p-5 rounded-2xl border border-white/30">
            <div className="text-4xl mb-1">🎁</div>
            <div className="text-xs font-black text-slate-950 uppercase tracking-wider">جوائز ذهبية</div>
            <Link
              href="/dashboard/appointments/new"
              className="inline-block mt-3 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              احجز موعدك الآن
            </Link>
          </div>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers.map((t, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl p-5 border transition-all ${
              t.highlight ? "border-amber-400 shadow-md ring-2 ring-amber-300/40" : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.icon}</span>
                <div>
                  <h3 className="font-black text-slate-900 text-base">{t.name}</h3>
                  <span className="text-xs text-slate-400 font-bold">{t.min}</span>
                </div>
              </div>
              {t.highlight && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full">
                  المستوى المستهدف
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
              🎁 المميزات: {t.perks}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
