"use client";

import { useEffect, useState, useRef } from "react";
import {
  Shield, Droplet, Star, Award, Heart, CheckCircle2,
  Clock, QrCode, Download, Share2, RefreshCw, Zap,
  Activity, Calendar, User
} from "lucide-react";
import Link from "next/link";

const BLOOD_TYPE_LABEL: Record<string, string> = {
  A_POSITIVE: "A+", A_NEGATIVE: "A-",
  B_POSITIVE: "B+", B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+", AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+", O_NEGATIVE: "O-",
};

function CircularProgress({ days, total }: { days: number; total: number }) {
  const pct = total === 0 ? 100 : Math.min(100, Math.max(0, ((total - days) / total) * 100));
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const strokeDash = (pct / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={128} height={128} className="-rotate-90">
        <circle cx={64} cy={64} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={8} />
        <circle
          cx={64} cy={64} r={radius} fill="none"
          stroke={days <= 0 ? "#22c55e" : days <= 30 ? "#f59e0b" : "#ef4444"}
          strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circ}`}
          style={{ transition: "stroke-dasharray 1.5s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        {days <= 0 ? (
          <div className="text-green-400 text-xs font-bold">جاهز<br />✅</div>
        ) : (
          <>
            <div className="text-white font-black text-2xl leading-none">{days}</div>
            <div className="text-white/60 text-[9px] font-bold mt-0.5">يوم</div>
          </>
        )}
      </div>
    </div>
  );
}

function QRDisplay({ data }: { data: string }) {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Use QR Server API to generate QR code
    const encoded = encodeURIComponent(data);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encoded}&bgcolor=1e293b&color=ffffff&margin=8`);
  }, [data]);

  return (
    <div className="relative">
      {qrUrl ? (
        <img
          src={qrUrl}
          alt="QR Code"
          width={120}
          height={120}
          className="rounded-xl border border-white/10"
          style={{ imageRendering: "pixelated" }}
        />
      ) : (
        <div className="w-[120px] h-[120px] rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
          <QrCode className="w-8 h-8 text-white/30 animate-pulse" />
        </div>
      )}
      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" title="QR حي وديناميكي" />
    </div>
  );
}

function Badge({ count }: { count: number }) {
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
    <div className={`bg-gradient-to-br ${tier.color} rounded-2xl p-4 text-center shadow-lg`}>
      <div className="text-3xl mb-1">{tier.icon}</div>
      <div className={`font-black text-sm ${tier.text}`}>{tier.label}</div>
      {next && (
        <div className="mt-2 text-[10px] text-white/50">
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
    // Auto-refresh QR every 5 minutes
    const interval = setInterval(() => setQrRefreshed(Date.now()), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const refreshQR = () => setQrRefreshed(Date.now());

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium">جاري تحميل البطاقة الذكية...</p>
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="max-w-lg mx-auto mt-10 text-center labo-card p-12">
        <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">الملف الطبي غير مكتمل</h2>
        <p className="text-slate-500 mb-6">يرجى إكمال إعداد ملفك الطبي أولاً.</p>
        <Link href="/dashboard/setup" className="labo-btn-primary inline-block">إكمال الملف</Link>
      </div>
    );
  }

  const bt = BLOOD_TYPE_LABEL[donor.bloodType] || donor.bloodType;
  const totalDonations = donor.totalDonations || 0;
  const livesImpacted = totalDonations * 3;
  const yearsAsDonor = donor.createdAt
    ? Math.max(0, Math.floor((Date.now() - new Date(donor.createdAt).getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
    : 0;

  // Eligibility countdown
  const DONATION_INTERVAL = 90; // days
  let daysRemaining = 0;
  let eligibilityLabel = "مؤهل للتبرع اليوم ✅";
  let eligibilityColor = "text-green-400";
  let eligibilityBg = "bg-green-400/10 border-green-400/30";
  let statusDot = "bg-green-400";

  if (donor.eligibilityStatus === "INELIGIBLE" && donor.nextEligibleDate) {
    const diff = Math.ceil((new Date(donor.nextEligibleDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, diff);
    if (daysRemaining > 0) {
      eligibilityLabel = `غير مؤهل مؤقتاً (${daysRemaining} يوم)`;
      eligibilityColor = "text-red-400";
      eligibilityBg = "bg-red-400/10 border-red-400/30";
      statusDot = "bg-red-400";
    }
  } else if (donor.eligibilityStatus === "PENDING_CHECK") {
    eligibilityLabel = "يستحق الفحص قريباً 🟡";
    eligibilityColor = "text-yellow-400";
    eligibilityBg = "bg-yellow-400/10 border-yellow-400/30";
    statusDot = "bg-yellow-400";
    daysRemaining = 14;
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
    ts: Math.floor(qrRefreshed / (5 * 60 * 1000)), // changes every 5 min
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Page Header */}
      <div className="labo-page-title">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-red-600" />
            البطاقة الصحية الذكية
          </h1>
          <p className="text-slate-500 text-sm mt-1">هويتك الرسمية كمتبرع بالدم — محمية ومشفرة</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshQR}
            className="labo-action-btn labo-action-edit flex items-center gap-1 px-3 py-2 text-xs"
            title="تحديث رمز QR"
          >
            <RefreshCw className="w-3.5 h-3.5" /> تحديث QR
          </button>
        </div>
      </div>

      {/* ═══════════════ SMART CARD ═══════════════ */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer select-none"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #1e0a1e 100%)",
          minHeight: 420,
        }}
        onClick={() => setCardFlipped(!cardFlipped)}
      >
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #ef4444, transparent)" }} />
          <div className="absolute -bottom-10 -right-20 w-80 h-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 opacity-5"
            style={{ background: "radial-gradient(ellipse, #60a5fa, transparent)" }} />
        </div>

        {/* Holographic shimmer */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, white 0px, transparent 1px, transparent 8px, white 9px)",
          }} />

        {/* Card content */}
        <div className="relative z-10 p-6 md:p-8">

          {/* Top row: Brand + Verification badge */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-red-400 fill-red-400" />
              </div>
              <div>
                <div className="text-white font-black text-base tracking-wide">DONNER.X</div>
                <div className="text-white/40 text-[9px] font-bold tracking-widest uppercase">Blood Donor Network</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-300">هوية موثقة</span>
            </div>
          </div>

          {/* Middle: Profile + Blood type + Countdown */}
          <div className="flex items-start gap-6 mb-6">

            {/* Avatar + info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  {donor.user?.image ? (
                    <img src={donor.user.image} alt="avatar"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-purple-700 border-2 border-white/20 flex items-center justify-center">
                      <span className="text-white font-black text-2xl">
                        {(donor.user?.name || "؟")[0]}
                      </span>
                    </div>
                  )}
                  {/* Status dot */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${statusDot} animate-pulse`} />
                </div>
                <div>
                  <h2 className="text-white font-black text-xl leading-tight">{donor.user?.name || "متبرع"}</h2>
                  <div className="text-white/50 text-xs mt-1 font-mono">
                    ID: {donor.id?.slice(-12).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Blood type pill */}
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 rounded-2xl px-4 py-2 mb-3">
                <Droplet className="w-4 h-4 text-red-400 fill-red-400" />
                <span className="text-white font-black text-3xl leading-none">{bt}</span>
                <span className="text-red-300 text-xs font-bold">فصيلة الدم</span>
              </div>

              {/* Eligibility badge */}
              <div className={`inline-flex items-center gap-2 ${eligibilityBg} border rounded-xl px-3 py-1.5`}>
                <div className={`w-2 h-2 rounded-full ${statusDot}`} />
                <span className={`text-xs font-bold ${eligibilityColor}`}>{eligibilityLabel}</span>
              </div>
            </div>

            {/* Countdown circle */}
            <div className="text-center">
              <CircularProgress days={daysRemaining} total={DONATION_INTERVAL} />
              <div className="text-white/50 text-[9px] font-bold mt-1 uppercase tracking-wider">
                {daysRemaining <= 0 ? "جاهز للتبرع" : "الوقت المتبقي"}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/5 border border-white/8 rounded-2xl p-3 text-center">
              <div className="text-white font-black text-2xl">{totalDonations}</div>
              <div className="text-white/50 text-[10px] font-bold mt-1 flex items-center justify-center gap-1">
                <Activity className="w-3 h-3" /> تبرعات
              </div>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl p-3 text-center">
              <div className="text-red-400 font-black text-2xl">{livesImpacted}</div>
              <div className="text-white/50 text-[10px] font-bold mt-1 flex items-center justify-center gap-1">
                <Heart className="w-3 h-3" /> حياة أنقذت
              </div>
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl p-3 text-center">
              <div className="text-white font-black text-2xl">{yearsAsDonor > 0 ? yearsAsDonor : "<1"}</div>
              <div className="text-white/50 text-[10px] font-bold mt-1 flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3" /> سنة متبرع
              </div>
            </div>
          </div>

          {/* Bottom row: QR + Last donation */}
          <div className="flex items-end justify-between pt-4 border-t border-white/10">
            <div className="space-y-1">
              {donor.lastDonationDate && (
                <div>
                  <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">آخر تبرع</div>
                  <div className="text-white/80 text-sm font-bold">
                    {new Date(donor.lastDonationDate).toLocaleDateString("ar-SA")}
                  </div>
                </div>
              )}
              <div>
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider">النقاط</div>
                <div className="text-yellow-400 text-sm font-black flex items-center gap-1">
                  <Zap className="w-3 h-3" /> {donor.points || 0} نقطة
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <QRDisplay data={qrPayload} />
              <div className="text-white/30 text-[9px] font-bold text-center">
                يتجدد تلقائياً كل 5 دقائق
              </div>
            </div>
          </div>
        </div>

        {/* Click hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/20 text-[9px] font-bold">
          اضغط لعرض التفاصيل
        </div>
      </div>

      {/* ═══════ Achievement + Lives Impact ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Badge */}
        <div className="labo-card p-6">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" /> مستوى المتبرع
          </h3>
          <Badge count={totalDonations} />

          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { icon: "🌱", label: "بداية", earned: totalDonations >= 1 },
              { icon: "🥉", label: "برونزي", earned: totalDonations >= 3 },
              { icon: "🥈", label: "فضي", earned: totalDonations >= 7 },
              { icon: "🥇", label: "ذهبي", earned: totalDonations >= 15 },
            ].map(b => (
              <div key={b.label} className={`text-center p-2 rounded-xl ${b.earned ? "bg-yellow-50 border border-yellow-200" : "bg-slate-50 border border-slate-200 opacity-40"}`}>
                <div className="text-xl">{b.icon}</div>
                <div className="text-[9px] font-bold text-slate-600 mt-1">{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lives Impact */}
        <div className="labo-card p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5"
            style={{ background: "radial-gradient(circle, #ef4444, transparent)" }} />
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" /> الأثر الإنساني
          </h3>
          <div className="text-center py-4">
            <div className="text-6xl font-black text-red-600 mb-2">{livesImpacted}</div>
            <div className="text-slate-600 font-bold">حياة أنقذتها 🎖️</div>
            <p className="text-slate-400 text-xs mt-3 leading-relaxed">
              كل كيس دم يتبرع به الإنسان يمكن أن ينقذ ما يصل إلى 3 أشخاص مختلفين.<br />
              لقد أجريت <strong>{totalDonations}</strong> عملية تبرع. أنت بطل حقيقي! ❤️
            </p>
          </div>
          {totalDonations === 0 && (
            <div className="mt-2 text-center">
              <Link href="/dashboard/appointments/new" className="labo-btn-danger text-sm inline-block">
                ابدأ رحلتك الآن
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Security features banner */}
      <div className="labo-card p-4">
        <div className="flex items-center flex-wrap gap-4 justify-center">
          {[
            { icon: "🔐", label: "هوية مشفرة" },
            { icon: "🔄", label: "QR ديناميكي" },
            { icon: "✅", label: "بيانات معتمدة" },
            { icon: "🛡️", label: "قراءة فقط" },
            { icon: "📡", label: "تحديث فوري" },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-1.5 text-slate-500">
              <span className="text-sm">{f.icon}</span>
              <span className="text-xs font-bold">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
