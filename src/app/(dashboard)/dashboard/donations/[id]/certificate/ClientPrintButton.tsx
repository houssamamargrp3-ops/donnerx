"use client";

import { Printer, Download } from "lucide-react";

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

  const handleDownloadPDF = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>شهادة تبرع - ${donorName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
    
    body {
      font-family: 'Cairo', 'Arial', sans-serif;
      background: white;
      width: 297mm;
      height: 210mm;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .certificate {
      width: 285mm;
      height: 198mm;
      position: relative;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20mm 24mm;
      overflow: hidden;
    }

    /* Double gold border */
    .border-outer {
      position: absolute;
      inset: 6mm;
      border: 4px double #D4AF37;
      pointer-events: none;
      opacity: 0.85;
    }
    .border-inner {
      position: absolute;
      inset: 10mm;
      border: 1.5px solid #D4AF37;
      pointer-events: none;
      opacity: 0.45;
    }

    /* Watermark */
    .watermark {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.03;
      font-size: 220px;
      font-weight: 900;
      color: #7f1d1d;
      pointer-events: none;
      user-select: none;
    }

    /* Corner decor */
    .corner {
      position: absolute;
      font-size: 52px;
      opacity: 0.18;
    }
    .corner-tl { top: 14mm; right: 14mm; }
    .corner-br { bottom: 14mm; left: 14mm; }

    /* Logo */
    .logo {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -1px;
      margin-bottom: 4px;
    }
    .logo .x { color: #dc2626; }
    .logo .d { color: #1e293b; }

    .gold-line {
      width: 80px;
      height: 4px;
      background: #D4AF37;
      border-radius: 4px;
      margin: 6px auto 12px;
    }

    h1 {
      font-size: 42px;
      font-weight: 900;
      color: #1e293b;
      line-height: 1.1;
    }

    .subtitle {
      font-size: 16px;
      color: #64748b;
      font-weight: 500;
      margin-top: 4px;
      margin-bottom: 10px;
    }

    .body-text {
      font-size: 16px;
      color: #475569;
      line-height: 1.8;
      margin-bottom: 10px;
    }

    .body-text strong {
      color: #1e293b;
      border-bottom: 2px solid #D4AF37;
      font-weight: 900;
    }

    .donor-name {
      font-size: 36px;
      font-weight: 900;
      color: #b91c1c;
      border-top: 2px solid #fee2e2;
      border-bottom: 2px solid #fee2e2;
      padding: 8px 60px;
      background: #fff5f5;
      border-radius: 12px;
      margin: 8px 40px;
      position: relative;
    }

    .detail-text {
      font-size: 14px;
      color: #64748b;
      line-height: 1.9;
      padding: 0 20px;
    }

    .footer {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      padding: 0 8mm;
    }

    .footer-box {
      text-align: right;
    }

    .footer-label {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
    }

    .footer-value {
      font-size: 13px;
      font-weight: 700;
      color: #1e293b;
      direction: ltr;
      text-align: right;
    }

    .blood-badge {
      text-align: center;
    }

    .blood-circle {
      width: 80px;
      height: 80px;
      background: #fff1f2;
      border-radius: 50%;
      border: 2px solid #fecdd3;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 6px;
      font-size: 28px;
      font-weight: 900;
      color: #b91c1c;
    }

    .blood-label {
      font-size: 11px;
      font-weight: 700;
      color: #991b1b;
      background: #fee2e2;
      padding: 3px 10px;
      border-radius: 999px;
    }

    .signature-box { text-align: center; }
    .signature-line {
      width: 120px;
      height: 50px;
      border-bottom: 2px solid #cbd5e1;
      margin: 0 auto 4px;
    }
    .signature-name { font-size: 12px; font-weight: 700; color: #1e293b; }

    @media print {
      body { margin: 0; }
      @page { size: A4 landscape; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="border-outer"></div>
    <div class="border-inner"></div>
    <div class="watermark">★</div>
    <div class="corner corner-tl">💗</div>
    <div class="corner corner-br">🩸</div>

    <div class="logo">
      <span class="d">DONNER</span><span class="x">.X</span>
    </div>
    <div class="gold-line"></div>
    <h1>شهادة شكر وتقدير</h1>
    <p class="subtitle">Certificate of Appreciation</p>

    <p class="body-text">
      تتقدم إدارة منصة <strong>DONNER.X</strong> بالتعاون مع <strong>${centerName}</strong>
      <br/>بعظيم الشكر وخالص الامتنان إلى المتبرع المعطاء:
    </p>

    <div class="donor-name">🏅 ${donorName} 🩸</div>

    <p class="detail-text">
      لقاء عطائه الإنساني النبيل ومساهمته الفاعلة في إنقاذ الأرواح من خلال تبرعه بالدم.
      <br/>إن قطرات دمك هي شريان حياة للمرضى، سائلين المولى عز وجل أن يكتب أجرك ويجعلها في ميزان حسناتك! ❤️
    </p>

    <div class="footer">
      <div class="footer-box">
        <div class="footer-label">رقم الشهادة (Serial):</div>
        <div class="footer-value">${serialNumber}</div>
        <div class="footer-label" style="margin-top:10px">تاريخ التبرع:</div>
        <div class="footer-value">${donatedAt}</div>
      </div>

      <div class="blood-badge">
        <div class="blood-circle">${bloodType.replace('_', ' ')}</div>
        <div class="blood-label">قطرة دم = حياة 💗</div>
      </div>

      <div class="signature-box">
        <div class="footer-label">الختم والتوقيع</div>
        <div class="signature-line"></div>
        <div class="signature-name">${centerName}</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      alert("يرجى السماح بالنوافذ المنبثقة في المتصفح لتحميل الشهادة.");
      return;
    }
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="flex gap-3">
      <button 
        onClick={handleDownloadPDF} 
        className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
      >
        <Download className="w-5 h-5" />
        تحميل كملف PDF
      </button>
      <button onClick={() => window.print()} className="labo-btn-primary flex items-center gap-2">
        <Printer className="w-5 h-5" />
        طباعة مباشرة
      </button>
    </div>
  );
}
