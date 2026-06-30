"use client";

import { Printer, Download, FileDown } from "lucide-react";

interface Props {
  donorName?: string;
  centerName?: string;
  serialNumber?: string;
  bloodType?: string;
  donatedAt?: string;
}

export default function ClientPrintButton({
  donorName = "متبرع",
  centerName = "",
  serialNumber = "",
  bloodType = "",
  donatedAt = "",
}: Props) {

  const openPrintWindow = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>شهادة تبرع - ${donorName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #f0f0f0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    /* Instruction bar - hidden on print */
    .instruction-bar {
      background: #1e3a5f;
      color: white;
      padding: 14px 28px;
      border-radius: 10px;
      margin-bottom: 20px;
      width: 100%;
      max-width: 900px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      font-size: 15px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }

    .instruction-bar .steps {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .step {
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 6px 14px;
      font-weight: bold;
      font-size: 13px;
    }

    .arrow { color: #90cdf4; font-size: 18px; }

    .print-btn {
      background: #dc2626;
      color: white;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: bold;
      cursor: pointer;
      font-family: inherit;
      white-space: nowrap;
    }
    .print-btn:hover { background: #b91c1c; }

    /* Certificate */
    .certificate {
      width: 270mm;
      min-height: 190mm;
      background: white;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 18mm 22mm;
      box-shadow: 0 8px 40px rgba(0,0,0,0.15);
      border-radius: 8px;
      overflow: hidden;
    }

    .border-outer {
      position: absolute;
      inset: 8mm;
      border: 3px double #D4AF37;
      opacity: 0.85;
      pointer-events: none;
    }
    .border-inner {
      position: absolute;
      inset: 13mm;
      border: 1px solid #D4AF37;
      opacity: 0.4;
      pointer-events: none;
    }

    .watermark {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 200px;
      font-weight: 900;
      color: #7f1d1d;
      opacity: 0.025;
      user-select: none;
      pointer-events: none;
    }

    .corner { position: absolute; font-size: 48px; opacity: 0.15; }
    .tl { top: 16mm; right: 16mm; }
    .br { bottom: 16mm; left: 16mm; }

    .logo {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -1px;
      margin-bottom: 6px;
    }
    .logo .red { color: #dc2626; }
    .logo .dark { color: #1e293b; }

    .gold-line {
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #D4AF37, #f5d07a, #D4AF37);
      border-radius: 4px;
      margin: 8px auto 14px;
    }

    h1 {
      font-size: 42px;
      font-weight: 900;
      color: #1e293b;
      line-height: 1.15;
    }
    .subtitle {
      font-size: 16px;
      color: #64748b;
      margin-top: 4px;
      margin-bottom: 16px;
    }

    .body-text {
      font-size: 16px;
      color: #475569;
      line-height: 2;
      margin-bottom: 12px;
    }
    .body-text strong { color: #1e293b; border-bottom: 2px solid #D4AF37; }

    .donor-box {
      background: #fff5f5;
      border-top: 2px solid #fecdd3;
      border-bottom: 2px solid #fecdd3;
      border-radius: 14px;
      padding: 10px 60px;
      margin: 10px 40px;
      display: inline-block;
      position: relative;
    }
    .donor-name {
      font-size: 34px;
      font-weight: 900;
      color: #b91c1c;
    }
    .medal { position: absolute; top: -14px; right: -10px; font-size: 26px; }
    .drop  { position: absolute; bottom: -14px; left: -10px; font-size: 26px; }

    .detail-text {
      font-size: 14px;
      color: #64748b;
      line-height: 2;
      margin: 10px 20px 0;
    }

    .footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding: 0 10mm;
      padding-top: 14px;
    }

    .footer-block { text-align: right; }
    .footer-label { font-size: 11px; color: #94a3b8; font-weight: 700; }
    .footer-value { font-size: 13px; color: #1e293b; font-weight: 700; direction: ltr; text-align: right; margin-bottom: 8px; }

    .blood-badge { text-align: center; }
    .blood-circle {
      width: 78px; height: 78px;
      border-radius: 50%;
      background: #fff1f2;
      border: 2px solid #fecdd3;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 6px;
      font-size: 26px; font-weight: 900; color: #b91c1c;
    }
    .blood-label {
      font-size: 11px; font-weight: 700; color: #991b1b;
      background: #fee2e2; padding: 3px 10px; border-radius: 999px;
    }

    .sig-block { text-align: center; }
    .sig-line { width: 120px; height: 48px; border-bottom: 2px solid #cbd5e1; margin: 0 auto 4px; }
    .sig-name { font-size: 12px; font-weight: 700; color: #1e293b; }

    @media print {
      body { background: white; padding: 0; }
      .instruction-bar { display: none !important; }
      .certificate { box-shadow: none; border-radius: 0; width: 100%; min-height: auto; }
      @page { size: A4 landscape; margin: 0; }
    }
  </style>
</head>
<body>

  <div class="instruction-bar">
    <div class="steps">
      <span>🖨️ لحفظ كـ PDF:</span>
      <span class="step">① اضغط "طباعة" أدناه</span>
      <span class="arrow">←</span>
      <span class="step">② اختر "Microsoft Print to PDF"</span>
      <span class="arrow">←</span>
      <span class="step">③ اضغط "Print" وحدد مكان الحفظ</span>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ طباعة / حفظ PDF</button>
  </div>

  <div class="certificate">
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div class="watermark">★</div>
    <div class="corner tl">💗</div>
    <div class="corner br">🩸</div>

    <div class="logo">
      <span class="dark">DONNER</span><span class="red">.X</span>
    </div>
    <div class="gold-line"></div>
    <h1>شهادة شكر وتقدير</h1>
    <p class="subtitle">Certificate of Appreciation</p>

    <p class="body-text">
      تتقدم إدارة منصة <strong>DONNER.X</strong> بالتعاون مع <strong>${centerName}</strong><br/>
      بعظيم الشكر وخالص الامتنان إلى المتبرع المعطاء:
    </p>

    <div class="donor-box">
      <span class="medal">🏅</span>
      <div class="donor-name">${donorName}</div>
      <span class="drop">🩸</span>
    </div>

    <p class="detail-text">
      لقاء عطائه الإنساني النبيل ومساهمته الفاعلة في إنقاذ الأرواح من خلال تبرعه بالدم.<br/>
      إن قطرات دمك هي شريان حياة للمرضى، سائلين المولى عز وجل أن يكتب أجرك ويجعلها في ميزان حسناتك! ❤️
    </p>

    <div class="footer">
      <div class="footer-block">
        <div class="footer-label">رقم الشهادة (Serial):</div>
        <div class="footer-value">${serialNumber}</div>
        <div class="footer-label">تاريخ التبرع:</div>
        <div class="footer-value">${donatedAt}</div>
      </div>

      <div class="blood-badge">
        <div class="blood-circle">${bloodType.replace("_", " ")}</div>
        <div class="blood-label">قطرة دم = حياة 💗</div>
      </div>

      <div class="sig-block">
        <div class="footer-label">الختم والتوقيع</div>
        <div class="sig-line"></div>
        <div class="sig-name">${centerName}</div>
      </div>
    </div>
  </div>

</body>
</html>`;

    const w = window.open("", "_blank", "width=1200,height=860");
    if (!w) {
      alert("⚠️ يرجى السماح بالنوافذ المنبثقة في المتصفح لهذا الموقع.");
      return;
    }
    w.document.write(htmlContent);
    w.document.close();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={openPrintWindow}
        className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
      >
        <FileDown className="w-5 h-5" />
        تحميل كملف PDF
      </button>

      <button
        onClick={() => window.print()}
        className="labo-btn-primary flex items-center gap-2"
      >
        <Printer className="w-5 h-5" />
        طباعة مباشرة
      </button>
    </div>
  );
}
