"use client";

import { useEffect, useState } from "react";
import {
  Shield, Droplet, Award, Heart, QrCode, Download, RefreshCw, Zap,
  Activity, Calendar, User, Copy, Check, Sparkles, CreditCard,
  Wifi, RotateCw, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const BLOOD_TYPE_LABEL: Record<string, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-",
  B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

// Card Color Themes inspired by Wise & RedotPay
const CARD_THEMES = {
  wise: {
    id: "wise",
    name: "Wise Neon",
    gradient: "from-emerald-950 via-slate-900 to-teal-950",
    border: "border-emerald-500/40",
    glow: "shadow-emerald-900/30",
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/20",
    pillBg: "bg-emerald-400 text-slate-950 font-black",
    chip: "#fbbf24",
  },
  redot: {
    id: "redot",
    name: "Redot Ruby",
    gradient: "from-zinc-950 via-slate-900 to-red-950",
    border: "border-red-500/40",
    glow: "shadow-red-950/40",
    accent: "text-red-400",
    accentBg: "bg-red-500/20",
    pillBg: "bg-red-600 text-white font-black",
    chip: "#e2e8f0",
  },
  obsidian: {
    id: "obsidian",
    name: "Obsidian Gold",
    gradient: "from-zinc-950 via-stone-900 to-zinc-950",
    border: "border-amber-500/40",
    glow: "shadow-amber-950/30",
    accent: "text-amber-400",
    accentBg: "bg-amber-500/20",
    pillBg: "bg-amber-400 text-zinc-950 font-black",
    chip: "#f59e0b",
  },
  sapphire: {
    id: "sapphire",
    name: "Cyber Sapphire",
    gradient: "from-slate-950 via-blue-950 to-indigo-950",
    border: "border-blue-500/40",
    glow: "shadow-blue-950/40",
    accent: "text-cyan-400",
    accentBg: "bg-cyan-500/20",
    pillBg: "bg-cyan-400 text-slate-950 font-black",
    chip: "#60a5fa",
  },
};

function FormatCardNumber({ id }: { id: string }) {
  const cleanId = (id || "0000000000000000").replace(/[^a-zA-Z0-9]/g, "").padEnd(16, "0").toUpperCase();
  const chunk1 = cleanId.slice(0, 4);
  const chunk2 = "••••";
  const chunk3 = "••••";
  const chunk4 = cleanId.slice(-4);

  return (
    <div className="font-mono text-base sm:text-lg md:text-xl font-extrabold tracking-widest text-white/95 drop-shadow flex items-center gap-2 sm:gap-3 dir-ltr select-none">
      <span>{chunk1}</span>
      <span>{chunk2}</span>
      <span>{chunk3}</span>
      <span>{chunk4}</span>
    </div>
  );
}

function EMVChip({ color = "#fbbf24" }: { color?: string }) {
  return (
    <div className="relative w-9 h-6 sm:w-10 sm:h-7 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 p-[1px] shadow-sm overflow-hidden flex-shrink-0">
      <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-amber-500 rounded-[5px] relative flex flex-col justify-between p-[2px]">
        <div className="w-full h-[1px] bg-amber-800/40 mt-1.5" />
        <div className="w-full h-[1px] bg-amber-800/40 mb-1.5" />
        <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-amber-800/40" />
        <div className="absolute top-0 bottom-0 right-1/3 w-[1px] bg-amber-800/40" />
        <div className="absolute inset-1 rounded-sm border border-amber-700/30" />
      </div>
    </div>
  );
}

function ContactlessIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/70 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" d="M8.5 14.5a5 5 0 0 1 0-5" />
      <path strokeLinecap="round" d="M11.5 17.5a9 9 0 0 1 0-11" />
      <path strokeLinecap="round" d="M14.5 20.5a13 13 0 0 1 0-17" />
    </svg>
  );
}

function TierBadge({ count }: { count: number }) {
  const tiers = [
    { min: 0,  max: 1,  label: "متبرع جديد",   icon: "🌱", color: "from-slate-500 to-slate-700",  text: "text-slate-200" },
    { min: 1,  max: 3,  label: "برونزي",        icon: "🥉", color: "from-amber-700 to-amber-900",  text: "text-amber-200" },
    { min: 3,  max: 7,  label: "فضي",           icon: "🥈", color: "from-slate-400 to-slate-600",  text: "text-slate-100" },
    { min: 7,  max: 15, label: "ذهبي",          icon: "🥇", color: "from-yellow-500 to-yellow-700", text: "text-yellow-100" },
    { min: 15, max: 30, label: "بلاتيني",       icon: "💎", color: "from-cyan-500 to-cyan-700",    text: "text-cyan-100"  },
    { min: 30, max: 9999, label: "أسطوري",      icon: "👑", color: "from-purple-500 to-pink-600",  text: "text-pink-100"  },
  ];
  const tier = tiers.find(t => count >= t.min && count < t.max) || tiers[0];
  const next = tiers[tiers.indexOf(tier) + 1];

  return (
    <div className={`bg-gradient-to-br ${tier.color} rounded-2xl p-4 text-center shadow-md border border-white/10`}>
      <div className="text-3xl mb-1">{tier.icon}</div>
      <div className={`font-black text-sm ${tier.text}`}>{tier.label}</div>
      {next && (
        <div className="mt-2 text-[10px] text-white/70 font-medium">
          التالي: {next.icon} {next.label} ({next.min - count} تبرع)
        </div>
      )}
    </div>
  );
}

export default function SmartDonorCard() {
  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrRefreshed, setQrRefreshed] = useState(Date.now());
  const [cardFlipped, setCardFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [themeKey, setThemeKey] = useState<keyof typeof CARD_THEMES>("wise");

  const fetchDonor = async () => {
    try {
      const res = await fetch("/api/donor/me");
      if (res.ok) setDonor(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonor();
    const interval = setInterval(() => setQrRefreshed(Date.now()), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshQR = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setQrRefreshed(Date.now());
  };

  const copyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!donor?.id) return;
    navigator.clipboard.writeText(donor.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[360px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">جاري تحميل بطاقة الدفع الرقمية...</p>
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="max-w-md mx-auto mt-6 text-center labo-card p-8 rounded-2xl shadow-sm">
        <User className="w-14 h-14 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-1">الملف الطبي غير مكتمل</h2>
        <p className="text-slate-500 text-xs mb-5">يرجى إكمال إعداد ملفك الطبي لإصدار بطاقتك الصحية الرقمية.</p>
        <Link href="/dashboard/setup" className="labo-btn-primary inline-block text-xs">إكمال الملف</Link>
      </div>
    );
  }

  const bt = BLOOD_TYPE_LABEL[donor.bloodType] || donor.bloodType || "O+";
  const totalDonations = donor.totalDonations || 0;
  const livesImpacted = totalDonations * 3;
  const currentTheme = CARD_THEMES[themeKey] || CARD_THEMES.wise;

  // Eligibility countdown
  let daysRemaining = 0;
  let eligibilityLabel = "مؤهل للتبرع ✅";
  let eligibilityPillBg = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  const hasAppointment = donor.appointments && donor.appointments.length > 0;

  if (donor.eligibilityStatus === "INELIGIBLE" && donor.nextEligibleDate) {
    const diff = Math.ceil((new Date(donor.nextEligibleDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, diff);
    if (daysRemaining > 0) {
      eligibilityLabel = `غير مؤهل (${daysRemaining}d)`;
      eligibilityPillBg = "bg-red-500/20 text-red-300 border-red-500/40";
    }
  } else if (donor.eligibilityStatus === "PENDING_CHECK") {
    eligibilityLabel = "فحص متبقي 🟡";
    eligibilityPillBg = "bg-amber-500/20 text-amber-300 border-amber-500/40";
  }

  if (hasAppointment) {
    eligibilityLabel = "موعد محجوز 🗓️";
    eligibilityPillBg = "bg-blue-500/20 text-blue-300 border-blue-500/40";
  }

  // QR payload
  const qrPayload = JSON.stringify({
    id: donor.id?.slice(0, 8),
    name: donor.user?.name,
    bt,
    status: donor.eligibilityStatus,
    lastDonation: donor.lastDonationDate
      ? new Date(donor.lastDonationDate).toISOString().split("T")[0]
      : null,
    ts: Math.floor(qrRefreshed / (5 * 60 * 1000)),
  });

  return (
    <div className="max-w-md mx-auto space-y-5">

      {/* Title Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            البطاقة الصحية الرقمية
          </h1>
          <p className="text-slate-500 text-xs">بطاقة تبرع بتصميم RedotPay / Wise الحديث</p>
        </div>
        <button
          onClick={() => setCardFlipped(!cardFlipped)}
          className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 text-red-600 transition-transform duration-500 ${cardFlipped ? "rotate-180" : ""}`} />
          {cardFlipped ? "الوجه الأمامي" : "تقليب البطاقة"}
        </button>
      </div>

      {/* ═══════════════ Wise / RedotPay Payment Card Container ═══════════════ */}
      <div className="perspective-1000 w-full">
        <div
          onClick={() => setCardFlipped(!cardFlipped)}
          className={`relative w-full aspect-[1.586/1] rounded-[22px] transition-all duration-700 cursor-pointer select-none shadow-xl ${currentTheme.glow} ${currentTheme.border} border`}
          style={{
            transformStyle: "preserve-3d",
            transform: cardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >

          {/* ----------------- FRONT SIDE (Credit Card View) ----------------- */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[22px] bg-gradient-to-br ${currentTheme.gradient} p-5 flex flex-col justify-between overflow-hidden`}
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            {/* Glossy Metallic Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div
              className="absolute -top-24 -left-24 w-60 h-60 rounded-full opacity-15 pointer-events-none"
              style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }}
            />

            {/* TOP ROW: Brand + Contactless + Blood Group Pill */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Left Brand */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <Droplet className="w-4 h-4 text-red-500 fill-red-500" />
                </div>
                <div>
                  <div className="text-white font-black text-sm tracking-wider">DONNER.X</div>
                  <div className="text-white/50 text-[8px] font-bold tracking-widest uppercase dir-ltr">SMART HEALTH PASS</div>
                </div>
              </div>

              {/* Center Wireless Symbol & Right Blood Group Badge */}
              <div className="flex items-center gap-2 sm:gap-3">
                <ContactlessIcon />
                <div className={`${currentTheme.pillBg} px-2.5 sm:px-3 py-1 rounded-xl shadow-md flex items-center gap-1`}>
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs sm:text-sm font-black dir-ltr">{bt}</span>
                </div>
              </div>
            </div>

            {/* MIDDLE ROW: EMV Microchip + Card Number */}
            <div className="relative z-10 my-auto pt-1">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <EMVChip color={currentTheme.chip} />
                <div className={`px-2.5 py-0.5 sm:py-1 rounded-lg border text-[10px] font-bold ${eligibilityPillBg}`}>
                  {eligibilityLabel}
                </div>
              </div>

              {/* Formatted Card Number */}
              <div className="flex items-center justify-between">
                <FormatCardNumber id={donor.id} />
                <button
                  onClick={copyId}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
                  title="نسخ معرف البطاقة"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* BOTTOM ROW: Holder Name + Expiry/Eligibility Date */}
            <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-2.5 mt-1">
              <div>
                <div className="text-white/40 text-[8px] font-bold tracking-widest uppercase">CARD HOLDER / المتبرع</div>
                <div className="text-white font-black text-xs sm:text-sm tracking-wide truncate max-w-[180px] sm:max-w-[200px]">
                  {donor.user?.name || "متبرع كريم"}
                </div>
              </div>

              <div className="text-left dir-ltr">
                <div className="text-white/40 text-[8px] font-bold tracking-widest uppercase text-right">POINTS / النقاط</div>
                <div className="text-amber-400 font-extrabold text-xs flex items-center gap-1 justify-end">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  <span>{donor.points || 0} PTS</span>
                </div>
              </div>
            </div>

            {/* Tap hint */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-white/25 text-[8px] font-bold tracking-wider pointer-events-none">
              TAP TO FLIP 🔄
            </div>
          </div>

          {/* ----------------- BACK SIDE (QR Code Scanner View) ----------------- */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[22px] bg-gradient-to-br ${currentTheme.gradient} flex flex-col justify-between overflow-hidden`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Magnetic Stripe */}
            <div className="w-full h-9 sm:h-10 bg-slate-950 mt-3 sm:mt-4 border-y border-white/10" />

            {/* Signature Bar & Security Details */}
            <div className="px-4 sm:px-5 py-2 flex items-center justify-between">
              {/* Signature Line */}
              <div className="flex-1 mr-3 sm:mr-4">
                <div className="w-full h-7 bg-white/90 rounded text-[9px] font-mono text-slate-800 flex items-center px-3 italic font-bold tracking-wider select-none border border-slate-300">
                  {donor.user?.name || "AUTHORIZED SIGNATURE"}
                </div>
                <div className="text-white/40 text-[7px] font-bold mt-0.5 uppercase">توقيع المتبرع المعتمد</div>
              </div>

              {/* QR Code Container */}
              <div className="relative bg-white p-1.5 sm:p-2 rounded-xl shadow-lg border border-slate-200 flex-shrink-0">
                <QRCodeSVG
                  value={qrPayload}
                  size={68}
                  level="M"
                  includeMargin={false}
                />
                <button
                  onClick={refreshQR}
                  className="absolute -top-2 -right-2 bg-slate-900 text-white p-1 rounded-full border border-white/30 shadow hover:scale-110 transition-transform cursor-pointer"
                  title="تحديث رمز QR"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="px-4 sm:px-5 pb-3 sm:pb-4 flex items-center justify-between text-white/70 text-[9px]">
              <div>
                <span className="text-white/40 font-bold block">رمز المتبرع</span>
                <span className="font-mono font-bold text-white text-xs">{donor.id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className="text-center">
                <span className="text-white/40 font-bold block">فصيلة الدم</span>
                <span className="font-black text-red-400 text-xs">{bt}</span>
              </div>
              <div className="text-left dir-ltr">
                <span className="text-white/40 font-bold block text-right">SECURED BY</span>
                <span className="font-bold text-white text-[10px]">DONNER.X VERIFIED</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════ Theme Selector & Actions ═══════════════ */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            اختر نمط ولون البطاقة (RedotPay / Wise):
          </span>
        </div>

        {/* Theme Pills */}
        <div className="grid grid-cols-4 gap-2">
          {Object.values(CARD_THEMES).map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeKey(t.id as keyof typeof CARD_THEMES)}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                themeKey === t.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${t.pillBg}`} />
              <span className="truncate">{t.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════ Stats Summary Widgets ═══════════════ */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-3.5 text-center shadow-sm border border-slate-200">
          <div className="text-slate-800 font-black text-2xl">{totalDonations}</div>
          <div className="text-slate-500 text-[10px] font-bold mt-1 flex items-center justify-center gap-1">
            <Activity className="w-3.5 h-3.5 text-blue-500" /> تبرعات
          </div>
        </div>
        <div className="bg-white rounded-2xl p-3.5 text-center shadow-sm border border-slate-200">
          <div className="text-red-600 font-black text-2xl">{livesImpacted}</div>
          <div className="text-slate-500 text-[10px] font-bold mt-1 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> حياة أنقذت
          </div>
        </div>
        <div className="bg-white rounded-2xl p-3.5 text-center shadow-sm border border-slate-200">
          <div className="text-amber-500 font-black text-2xl">{donor.points || 0}</div>
          <div className="text-slate-500 text-[10px] font-bold mt-1 flex items-center justify-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> نقطة
          </div>
        </div>
      </div>

      {/* ═══════════════ Donor Tier Progress ═══════════════ */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-500" /> رتبة المتبرع والمكافآت
        </h3>
        <TierBadge count={totalDonations} />
      </div>

    </div>
  );
}

