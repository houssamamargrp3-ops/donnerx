"use client";

import { useEffect, useState } from "react";
import {
  Droplet, Award, Heart, RefreshCw, Zap,
  Activity, User, Copy, Check, CreditCard, Gift, Sparkles, ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const BLOOD_TYPE_LABEL: Record<string, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-",
  B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

/* ──────────────────────── Card themes ──────────────────────── */
const THEMES = [
  { id: "dark",   label: "كلاسيكي", bg: "linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", accent: "#ef4444" },
  { id: "green",  label: "أخضر",    bg: "linear-gradient(145deg, #064e3b 0%, #065f46 50%, #022c22 100%)", accent: "#34d399" },
  { id: "blue",   label: "أزرق",    bg: "linear-gradient(145deg, #0c1a3d 0%, #1e3a8a 50%, #172554 100%)", accent: "#60a5fa" },
  { id: "gold",   label: "ذهبي",    bg: "linear-gradient(145deg, #1c1917 0%, #292524 50%, #1c1917 100%)", accent: "#f59e0b" },
];

export default function SmartDonorCard() {
  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [qrRefreshed, setQrRefreshed] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/donor/me");
        if (res.ok) setDonor(await res.json());
      } finally {
        setLoading(false);
      }
    })();
    const iv = setInterval(() => setQrRefreshed(Date.now()), 5 * 60 * 1000);
    return () => clearInterval(iv);
  }, []);

  const copyId = () => {
    if (!donor?.id) return;
    navigator.clipboard.writeText(donor.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── No donor profile ── */
  if (!donor) {
    return (
      <div className="max-w-sm mx-auto text-center bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800 mb-1">الملف الطبي غير مكتمل</h2>
        <p className="text-slate-500 text-xs mb-4">أكمل ملفك الطبي لإصدار بطاقتك.</p>
        <Link href="/dashboard/setup" className="bg-red-600 text-white text-xs font-bold px-5 py-2 rounded-xl inline-block">
          إكمال الملف
        </Link>
      </div>
    );
  }

  const bt = BLOOD_TYPE_LABEL[donor.bloodType] || donor.bloodType || "O+";
  const totalDonations = donor.totalDonations || 0;
  const livesImpacted = totalDonations * 3;
  const theme = THEMES[themeIdx];

  // Format card number from donor ID
  const rawId = (donor.id || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const cardNum = rawId.padEnd(16, "0");
  const numDisplay = `${cardNum.slice(0, 4)}  ••••  ••••  ${cardNum.slice(-4)}`;

  // Eligibility
  let eligText = "مؤهل للتبرع";
  let eligDotColor = "#34d399";
  const hasAppt = donor.appointments?.length > 0;
  if (donor.eligibilityStatus === "INELIGIBLE" && donor.nextEligibleDate) {
    const days = Math.max(0, Math.ceil((new Date(donor.nextEligibleDate).getTime() - Date.now()) / 86400000));
    if (days > 0) { eligText = `غير مؤهل · ${days} يوم`; eligDotColor = "#ef4444"; }
  } else if (donor.eligibilityStatus === "PENDING_CHECK") {
    eligText = "بحاجة لفحص"; eligDotColor = "#f59e0b";
  }
  if (hasAppt) { eligText = "موعد محجوز"; eligDotColor = "#60a5fa"; }

  // QR data
  const qrPayload = JSON.stringify({
    id: donor.id?.slice(0, 8), name: donor.user?.name, bt,
    status: donor.eligibilityStatus,
    ts: Math.floor(qrRefreshed / 300000),
  });

  // Donor tier (4 donations/year reaches Gold and unlocks rewards)
  const tiers = [
    { min: 0,  label: "متبرع جديد", icon: "🌱" },
    { min: 1,  label: "برونزي",     icon: "🥉" },
    { min: 2,  label: "فضي",        icon: "🥈" },
    { min: 4,  label: "ذهبي",       icon: "🥇" },
    { min: 10, label: "بلاتيني",    icon: "💎" },
    { min: 20, label: "أسطوري",     icon: "👑" },
  ];
  const tier = [...tiers].reverse().find(t => totalDonations >= t.min) || tiers[0];
  const nextTier = tiers.find(t => t.min > totalDonations);
  const remainingForGold = Math.max(0, 4 - totalDonations);

  return (
    <div className="max-w-sm mx-auto space-y-4">

      {/* ────────────── THE CARD ────────────── */}
      <div
        className="relative overflow-hidden select-none"
        style={{
          background: theme.bg,
          borderRadius: 20,
          padding: "24px 22px 20px",
          boxShadow: "0 20px 50px -12px rgba(0,0,0,0.4)",
          /* credit card aspect: not forced via aspect-ratio, 
             we let padding handle the natural height */
        }}
      >
        {/* subtle light overlay */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />

        {!showQR ? (
          /* ══════════ FRONT VIEW ══════════ */
          <div className="relative z-10 flex flex-col gap-5">
            {/* Row 1: Logo + Blood type */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                >
                  <Droplet className="w-4 h-4" style={{ color: theme.accent, fill: theme.accent }} />
                </div>
                <div>
                  <div className="text-white font-black text-xs tracking-widest" style={{ letterSpacing: 3 }}>DONNER.X</div>
                  <div className="text-white/40 text-[7px] font-bold tracking-wider">HEALTH PASS</div>
                </div>
              </div>
              <div
                className="px-3 py-1 rounded-lg font-black text-sm flex items-center gap-1.5"
                style={{ background: theme.accent, color: "#000" }}
              >
                <Droplet className="w-3.5 h-3.5 fill-current" />
                {bt}
              </div>
            </div>

            {/* Row 2: Chip + Contactless */}
            <div className="flex items-center gap-3">
              {/* EMV Chip */}
              <div
                className="rounded-md overflow-hidden"
                style={{
                  width: 40, height: 28,
                  background: "linear-gradient(135deg, #e8d5a3 0%, #c9a84c 40%, #e8d5a3 60%, #c9a84c 100%)",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.15)",
                }}
              >
                <div className="w-full h-full relative">
                  <div className="absolute top-[40%] left-0 right-0 h-[1px]" style={{ background: "rgba(0,0,0,0.12)" }} />
                  <div className="absolute top-0 bottom-0 left-[35%] w-[1px]" style={{ background: "rgba(0,0,0,0.12)" }} />
                  <div className="absolute top-0 bottom-0 right-[35%] w-[1px]" style={{ background: "rgba(0,0,0,0.12)" }} />
                </div>
              </div>
              {/* Contactless */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" style={{ transform: "rotate(90deg)" }}>
                <path strokeLinecap="round" d="M9 14a4 4 0 0 1 0-4" />
                <path strokeLinecap="round" d="M12 17a8 8 0 0 1 0-10" />
                <path strokeLinecap="round" d="M15 20a12 12 0 0 1 0-16" />
              </svg>
            </div>

            {/* Row 3: Card number */}
            <div className="flex items-center justify-between">
              <div
                className="font-mono font-bold tracking-[0.25em] text-white/90"
                style={{ fontSize: 16, direction: "ltr" }}
              >
                {numDisplay}
              </div>
              <button
                onClick={copyId}
                className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                style={{ background: "rgba(255,255,255,0.08)" }}
                title="نسخ"
              >
                {copied
                  ? <Check className="w-3.5 h-3.5 text-green-400" />
                  : <Copy className="w-3.5 h-3.5 text-white/60" />
                }
              </button>
            </div>

            {/* Row 4: Name + Status */}
            <div className="flex items-end justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <div className="text-white/35 text-[7px] font-bold tracking-widest uppercase mb-0.5">CARD HOLDER</div>
                <div className="text-white font-bold text-sm truncate" style={{ maxWidth: 180 }}>
                  {donor.user?.name || "متبرع كريم"}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: eligDotColor }} />
                <span className="text-white/60 text-[10px] font-bold">{eligText}</span>
              </div>
            </div>
          </div>
        ) : (
          /* ══════════ QR VIEW (BACK) ══════════ */
          <div className="relative z-10 flex flex-col items-center gap-4 py-2">
            {/* Magnetic stripe effect */}
            <div className="w-full h-8 -mx-6 rounded" style={{ background: "rgba(0,0,0,0.4)", marginTop: -4 }} />

            <div className="bg-white p-3 rounded-2xl shadow-lg">
              <QRCodeSVG value={qrPayload} size={120} level="M" includeMargin={false} />
            </div>

            <div className="text-center">
              <div className="text-white/80 text-xs font-bold">{donor.user?.name}</div>
              <div className="text-white/40 text-[10px] font-mono mt-0.5">{donor.id?.slice(-8).toUpperCase()} · {bt}</div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setQrRefreshed(Date.now()); }}
              className="flex items-center gap-1.5 text-white/50 text-[10px] font-bold cursor-pointer hover:text-white/80 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> تحديث QR
            </button>
          </div>
        )}
      </div>

      {/* ─── Toggle Front / QR ─── */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowQR(false)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            !showQR ? "bg-slate-900 text-white shadow" : "bg-white text-slate-500 border border-slate-200"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5 inline -mt-0.5 ml-1" /> البطاقة
        </button>
        <button
          onClick={() => setShowQR(true)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            showQR ? "bg-slate-900 text-white shadow" : "bg-white text-slate-500 border border-slate-200"
          }`}
        >
          رمز QR
        </button>
      </div>

      {/* ─── Theme picker (small dots) ─── */}
      <div className="flex justify-center gap-2">
        {THEMES.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setThemeIdx(i)}
            className="cursor-pointer transition-transform"
            style={{
              width: themeIdx === i ? 28 : 10,
              height: 10,
              borderRadius: 999,
              background: t.accent,
              opacity: themeIdx === i ? 1 : 0.4,
              transition: "all 0.3s ease",
            }}
            title={t.label}
          />
        ))}
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: totalDonations, label: "تبرعات", icon: <Activity className="w-3.5 h-3.5 text-blue-500" />, color: "text-slate-800" },
          { value: livesImpacted, label: "حياة أنقذت", icon: <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />, color: "text-red-600" },
          { value: donor.points || 0, label: "نقطة", icon: <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />, color: "text-amber-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
            <div className={`font-black text-xl ${s.color}`}>{s.value}</div>
            <div className="text-slate-400 text-[10px] font-bold mt-0.5 flex items-center justify-center gap-1">
              {s.icon} {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Annual Goal & Rewards Challenge ─── */}
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50 rounded-2xl p-4 border border-amber-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950 flex items-center gap-1">
                تحدي البطل الذهبي 🥇
                <span className="text-[9px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">جوائز حصرية</span>
              </h4>
              <p className="text-[10px] text-amber-800/80 font-medium">
                تبرع 4 مرات في العام، وصل للمستوى الذهبي واحصل على جوائز وتقدير شرفي!
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar towards 4 donations */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-amber-900">
              {remainingForGold === 0
                ? "🎉 رائع! حققت المستوى الذهبي هذا العام"
                : `متبقي ${remainingForGold} تبرع${remainingForGold > 2 ? "ات" : ""} للوصول للذهبي`}
            </span>
            <span className="text-amber-700 font-mono">{Math.min(totalDonations, 4)} / 4</span>
          </div>
          <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalDonations / 4) * 100)}%` }}
            />
          </div>
        </div>

        {/* Rewards pill list */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
          <div className="bg-white/80 rounded-xl p-1.5 border border-amber-200/50">
            <div className="text-xs">🎖️</div>
            <div className="text-[9px] font-bold text-amber-900 mt-0.5">شهادة شرفية</div>
          </div>
          <div className="bg-white/80 rounded-xl p-1.5 border border-amber-200/50">
            <div className="text-xs">⭐</div>
            <div className="text-[9px] font-bold text-amber-900 mt-0.5">أولوية ومكافآت</div>
          </div>
          <div className="bg-white/80 rounded-xl p-1.5 border border-amber-200/50">
            <div className="text-xs">🎁</div>
            <div className="text-[9px] font-bold text-amber-900 mt-0.5">درع التميز</div>
          </div>
        </div>
      </div>

      {/* ─── Current Tier badge ─── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{tier.icon}</div>
          <div>
            <div className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> رتبتك الحالية: {tier.label}
            </div>
            <div className="text-slate-400 text-[10px] font-bold">
              {totalDonations} تبرع مسجل · {donor.points || 0} نقطة
            </div>
          </div>
        </div>
        <Link
          href="/dashboard/gamification"
          className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-0.5"
        >
          <span>المكافآت</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

