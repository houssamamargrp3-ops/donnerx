"use client";

import dynamic from "next/dynamic";
import { Printer, Download, Loader2 } from "lucide-react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register an Arabic-compatible font
Font.register({
  family: "Cairo",
  src: "https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvalIkTpumxdt0UX8.woff2",
});

Font.registerHyphenationCallback((word) => [word]);

interface CertificateData {
  donorName: string;
  centerName: string;
  serialNumber: string;
  bloodType: string;
  donatedAt: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Cairo",
    direction: "rtl",
    padding: 0,
  },
  outerBorder: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    border: "3px double #D4AF37",
    opacity: 0.85,
  },
  innerBorder: {
    position: "absolute",
    top: 28,
    left: 28,
    right: 28,
    bottom: 28,
    border: "1px solid #D4AF37",
    opacity: 0.45,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "40 60",
    height: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: -0.5,
    color: "#1e293b",
    marginBottom: 4,
  },
  logoX: {
    color: "#dc2626",
  },
  goldLine: {
    width: 80,
    height: 3,
    backgroundColor: "#D4AF37",
    borderRadius: 2,
    marginVertical: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginTop: 4,
  },
  body: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  bodyText: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    lineHeight: 2.2,
    marginBottom: 14,
  },
  bold: {
    fontWeight: "bold",
    color: "#1e293b",
  },
  centerName: {
    fontWeight: "bold",
    color: "#1e293b",
    borderBottom: "1.5px solid #D4AF37",
  },
  donorBox: {
    borderTop: "1.5px solid #fee2e2",
    borderBottom: "1.5px solid #fee2e2",
    backgroundColor: "#fff5f5",
    borderRadius: 10,
    paddingHorizontal: 50,
    paddingVertical: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  donorName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#b91c1c",
    textAlign: "center",
  },
  detailText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 2,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  footerBlock: {
    alignItems: "flex-end",
  },
  footerLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "bold",
    textAlign: "right",
  },
  footerValue: {
    fontSize: 12,
    color: "#1e293b",
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 6,
  },
  bloodCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff1f2",
    border: "1.5px solid #fecdd3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  bloodType: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#b91c1c",
    textAlign: "center",
  },
  bloodLabel: {
    fontSize: 10,
    color: "#991b1b",
    backgroundColor: "#fee2e2",
    padding: "3 8",
    borderRadius: 10,
    textAlign: "center",
  },
  signatureLine: {
    width: 110,
    borderBottom: "1.5px solid #cbd5e1",
    marginBottom: 4,
    height: 40,
  },
  signatureName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
});

function CertificatePDF({ donorName, centerName, serialNumber, bloodType, donatedAt }: CertificateData) {
  return (
    <Document title={`شهادة تبرع - ${donorName}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>
              <Text>DONNER</Text>
              <Text style={{ color: "#dc2626" }}>.X</Text>
            </Text>
            <View style={styles.goldLine} />
            <Text style={styles.title}>شهادة شكر وتقدير</Text>
            <Text style={styles.subtitle}>Certificate of Appreciation</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              تتقدم إدارة منصة{" "}
              <Text style={styles.bold}>DONNER.X</Text>
              {"  "}بالتعاون مع{" "}
              <Text style={styles.centerName}>{centerName}</Text>
              {"\n"}
              بعظيم الشكر وخالص الامتنان إلى المتبرع المعطاء:
            </Text>

            <View style={styles.donorBox}>
              <Text style={styles.donorName}>{donorName}</Text>
            </View>

            <Text style={styles.detailText}>
              لقاء عطائه الإنساني النبيل ومساهمته الفاعلة في إنقاذ الأرواح من خلال تبرعه بالدم.
              {"\n"}
              إن قطرات دمك هي شريان حياة للمرضى، سائلين المولى عز وجل أن يكتب أجرك ويجعلها في ميزان حسناتك!
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Serial + Date */}
            <View style={styles.footerBlock}>
              <Text style={styles.footerLabel}>رقم الشهادة (Serial):</Text>
              <Text style={styles.footerValue}>{serialNumber}</Text>
              <Text style={styles.footerLabel}>تاريخ التبرع:</Text>
              <Text style={styles.footerValue}>{donatedAt}</Text>
            </View>

            {/* Blood Type */}
            <View style={{ alignItems: "center" }}>
              <View style={styles.bloodCircle}>
                <Text style={styles.bloodType}>{bloodType.replace("_", " ")}</Text>
              </View>
              <Text style={styles.bloodLabel}>قطرة دم = حياة</Text>
            </View>

            {/* Signature */}
            <View style={{ alignItems: "center" }}>
              <Text style={styles.footerLabel}>الختم والتوقيع</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureName}>{centerName}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button disabled className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg flex items-center gap-2 text-sm opacity-50">
        <Loader2 className="w-5 h-5 animate-spin" />
        جاري التحضير...
      </button>
    ),
  }
);

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
  const fileName = `Certificate_${donorName.replace(/\s+/g, "_")}_${serialNumber}.pdf`;

  const doc = (
    <CertificatePDF
      donorName={donorName}
      centerName={centerName}
      serialNumber={serialNumber}
      bloodType={bloodType}
      donatedAt={donatedAt}
    />
  );

  return (
    <div className="flex gap-3">
      <PDFDownloadLink document={doc} fileName={fileName}>
        {({ loading }) => (
          <button
            disabled={loading}
            className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {loading ? "جاري تحضير PDF..." : "تحميل كملف PDF"}
          </button>
        )}
      </PDFDownloadLink>

      <button onClick={() => window.print()} className="labo-btn-primary flex items-center gap-2">
        <Printer className="w-5 h-5" />
        طباعة مباشرة
      </button>
    </div>
  );
}
