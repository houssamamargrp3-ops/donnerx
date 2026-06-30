"use client";

interface Props {
  donorName: string;
  bloodType: string;
  donorId: string;
  phone?: string;
  city?: string;
  gender?: string;
  age?: number;
  eligibilityStatus?: string;
}

export default function BloodTypeCard({
  donorName,
  bloodType,
  donorId,
  phone = "",
  city = "",
  gender = "",
  age = 0,
  eligibilityStatus = "",
}: Props) {
  const bt = bloodType.replace("_", " ");

  const btColors: Record<string, { bg: string; accent: string; glow: string }> = {
    "A POSITIVE":  { bg: "#7f1d1d", accent: "#dc2626", glow: "#ef4444" },
    "A NEGATIVE":  { bg: "#7f1d1d", accent: "#dc2626", glow: "#ef4444" },
    "B POSITIVE":  { bg: "#1e3a5f", accent: "#2563eb", glow: "#3b82f6" },
    "B NEGATIVE":  { bg: "#1e3a5f", accent: "#2563eb", glow: "#3b82f6" },
    "O POSITIVE":  { bg: "#14532d", accent: "#16a34a", glow: "#22c55e" },
    "O NEGATIVE":  { bg: "#14532d", accent: "#16a34a", glow: "#22c55e" },
    "AB POSITIVE": { bg: "#4a1d96", accent: "#7c3aed", glow: "#8b5cf6" },
    "AB NEGATIVE": { bg: "#4a1d96", accent: "#7c3aed", glow: "#8b5cf6" },
  };

  const colors = btColors[bt] || { bg: "#7f1d1d", accent: "#dc2626", glow: "#ef4444" };

  const eligibilityText =
    eligibilityStatus === "ELIGIBLE"
      ? "✅ مؤهل للتبرع"
      : eligibilityStatus === "INELIGIBLE"
      ? "❌ غير مؤهل حالياً"
      : "⏳ قيد الفحص";

  const genderText = gender === "MALE" ? "ذكر" : gender === "FEMALE" ? "أنثى" : "";

  const printCard = () => {
    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>بطاقة زمرة الدم - ${donorName}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      background: #1a1a2e;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: 'Segoe UI', Arial, sans-serif;
      padding: 20px;
    }
    .bar {
      background: #16213e;
      border: 1px solid #0f3460;
      color: #90cdf4;
      padding: 12px 24px;
      border-radius: 10px;
      margin-bottom: 24px;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      width: 100%;
      max-width: 760px;
    }
    .print-btn {
      background: ${colors.accent};
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      font-family: inherit;
      white-space: nowrap;
    }
    .cards-row {
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
    }
    .card-label {
      color: #94a3b8;
      font-size: 12px;
      text-align: center;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }
    .card {
      width: 323px;
      height: 204px;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .front {
      background: linear-gradient(135deg, ${colors.bg} 0%, ${colors.accent} 60%, ${colors.glow} 100%);
    }
    .front::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 180px; height: 180px;
      border-radius: 50%;
      background: rgba(255,255,255,0.07);
    }
    .front::after {
      content: '';
      position: absolute;
      bottom: -60px; left: -30px;
      width: 220px; height: 220px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }
    .front-content {
      position: relative;
      z-index: 2;
      padding: 18px 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .front-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 15px; font-weight: 900; color: rgba(255,255,255,0.9); letter-spacing: -0.5px; }
    .brand span { color: rgba(255,255,255,0.6); }
    .card-title { font-size: 9px; color: rgba(255,255,255,0.6); font-weight: bold; letter-spacing: 1.5px; text-align: left; }
    .blood-center { display: flex; align-items: center; justify-content: space-between; padding: 0 4px; }
    .blood-display { display: flex; flex-direction: column; align-items: flex-start; }
    .blood-label-sm { font-size: 9px; color: rgba(255,255,255,0.6); font-weight: bold; letter-spacing: 2px; margin-bottom: 2px; }
    .blood-type-big { font-size: 56px; font-weight: 900; color: white; line-height: 1; text-shadow: 0 4px 20px rgba(0,0,0,0.3); direction: ltr; }
    .drop-icon { font-size: 56px; opacity: 0.3; }
    .front-footer { display: flex; justify-content: space-between; align-items: flex-end; }
    .donor-name-card { font-size: 15px; font-weight: bold; color: white; }
    .donor-meta { font-size: 10px; color: rgba(255,255,255,0.65); margin-top: 2px; }
    .eligibility-badge { font-size: 10px; background: rgba(255,255,255,0.15); color: white; padding: 4px 10px; border-radius: 20px; font-weight: bold; border: 1px solid rgba(255,255,255,0.25); }
    .back { background: linear-gradient(160deg, #0f172a 0%, #1e293b 100%); border: 1px solid rgba(255,255,255,0.08); }
    .back-stripe { position: absolute; top: 30px; left: 0; right: 0; height: 44px; background: #000; }
    .back-content { position: relative; z-index: 2; padding: 16px 18px; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; gap: 10px; }
    .info-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.07); padding: 5px 0; }
    .info-label { font-size: 9px; color: #64748b; font-weight: bold; letter-spacing: 0.5px; }
    .info-value { font-size: 11px; color: #e2e8f0; font-weight: bold; }
    .back-brand { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
    .back-brand-text { font-size: 12px; font-weight: 900; color: ${colors.glow}; }
    .emergency-text { font-size: 9px; color: #ef4444; font-weight: bold; }
    .back-blood-chip { position: absolute; top: 8px; left: 18px; background: ${colors.accent}; color: white; font-size: 13px; font-weight: 900; padding: 4px 12px; border-radius: 8px; direction: ltr; }
    @media print {
      body { background: white; padding: 0; }
      .bar { display: none !important; }
      .cards-row { gap: 12px; }
      .card { box-shadow: none; }
      @page { size: A4; margin: 15mm; }
    }
  </style>
</head>
<body>
  <div class="bar">
    <span>🖨️ لطباعة أو حفظ كـ PDF: اضغط الزر ← اختر "Microsoft Print to PDF"</span>
    <button class="print-btn" onclick="window.print()">🖨️ طباعة / حفظ PDF</button>
  </div>
  <div class="cards-row">
    <div>
      <div class="card-label">الوجه الأمامي</div>
      <div class="card front">
        <div class="front-content">
          <div class="front-header">
            <div class="brand">DONNER<span>.X</span></div>
            <div class="card-title">BLOOD DONOR<br/>IDENTITY CARD</div>
          </div>
          <div class="blood-center">
            <div class="blood-display">
              <div class="blood-label-sm">BLOOD TYPE</div>
              <div class="blood-type-big">${bt}</div>
            </div>
            <div class="drop-icon">🩸</div>
          </div>
          <div class="front-footer">
            <div>
              <div class="donor-name-card">${donorName}</div>
              <div class="donor-meta">${genderText}${age ? ` • ${age} سنة` : ""}${city ? ` • ${city}` : ""}</div>
            </div>
            <div class="eligibility-badge">${eligibilityText}</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="card-label">الوجه الخلفي</div>
      <div class="card back">
        <div class="back-stripe"></div>
        <div class="back-blood-chip">${bt}</div>
        <div class="back-content">
          <div class="info-row">
            <div class="info-label">رقم المتبرع</div>
            <div class="info-value" style="direction:ltr;font-family:monospace">${donorId.slice(0, 16).toUpperCase()}</div>
          </div>
          ${phone ? `<div class="info-row"><div class="info-label">رقم الهاتف للطوارئ</div><div class="info-value" style="direction:ltr">${phone}</div></div>` : ""}
          <div class="info-row">
            <div class="info-label">المنصة</div>
            <div class="info-value">DONNER.X — منصة التبرع بالدم</div>
          </div>
          <div class="back-brand">
            <div class="back-brand-text">DONNER.X</div>
            <div class="emergency-text">🚨 في حالة الطوارئ — زمرة دمي: ${bt}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Use Blob URL to properly handle UTF-8 Arabic characters
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank", "width=900,height=700");
    if (!w) {
      alert("يرجى السماح بالنوافذ المنبثقة لهذا الموقع.");
    }
    // Revoke URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.accent} 100%)`,
        minHeight: "180px",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full opacity-10" style={{ background: "white" }} />
      <div className="absolute -bottom-14 -left-8 w-52 h-52 rounded-full opacity-[0.07]" style={{ background: "white" }} />

      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col justify-between h-full min-h-[180px]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-white font-black text-base tracking-tight">
            DONNER<span style={{ opacity: 0.7 }}>.X</span>
          </div>
          <div className="text-right text-[9px] font-bold text-white/60 tracking-widest uppercase">
            Blood Donor<br />Identity Card
          </div>
        </div>

        {/* Blood Type */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-bold text-white/60 tracking-widest mb-1">BLOOD TYPE</div>
            <div className="text-5xl font-black text-white leading-none" dir="ltr">{bt}</div>
          </div>
          <div className="text-5xl opacity-25">🩸</div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-white font-bold text-sm">{donorName}</div>
            <div className="text-white/60 text-[10px] mt-0.5">
              {genderText}{age ? ` • ${age} سنة` : ""}{city ? ` • ${city}` : ""}
            </div>
          </div>
          <button
            onClick={printCard}
            className="bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/30 transition-all flex items-center gap-1"
          >
            🖨️ طباعة / PDF
          </button>
        </div>
      </div>
    </div>
  );
}
