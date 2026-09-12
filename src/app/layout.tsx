import type { Metadata } from "next";
import "./globals.css";
import PwaManager from "@/components/PwaManager";

export const metadata: Metadata = {
  title: {
    default: "DONNER.X — منصة التبرع بالدم الوطنية",
    template: "%s | DONNER.X",
  },
  description:
    "منصة وطنية متكاملة لإدارة التبرع بالدم. سجّل الآن وساهم في إنقاذ الأرواح.",
  keywords: ["تبرع بالدم", "بنك الدم", "DONNER.X", "إنقاذ الأرواح"],
  authors: [{ name: "DONNER.X Team" }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    title: "DONNER.X — منصة التبرع بالدم الوطنية",
    description: "منصة وطنية متكاملة لإدارة التبرع بالدم",
    siteName: "DONNER.X",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#dc2626",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <PwaManager />
        {children}
      </body>
    </html>
  );
}
