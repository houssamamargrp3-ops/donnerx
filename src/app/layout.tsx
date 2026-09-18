import type { Metadata } from "next";
import "./globals.css";
import PwaManager from "@/components/PwaManager";

export const metadata: Metadata = {
  title: {
    default: "HayatLink — حياة لينك | نصل العطاء بالحياة",
    template: "%s | HayatLink",
  },
  description:
    "منصة حياة لينك (HayatLink) لإدارة التبرع بالدم. نصل العطاء بالحياة ونساهم في إنقاذ الأرواح.",
  keywords: ["تبرع بالدم", "بنك الدم", "HayatLink", "حياة لينك", "إنقاذ الأرواح"],
  authors: [{ name: "HayatLink Team" }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    title: "HayatLink — حياة لينك | نصل العطاء بالحياة",
    description: "منصة حياة لينك المتكاملة لإدارة التبرع بالدم",
    siteName: "HayatLink",
  },
  manifest: "/manifest.json?v=3",
  icons: {
    icon: [
      { url: "/icon-192x192.png?v=3", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png?v=3", sizes: "512x512", type: "image/png" },
      { url: "/logo.png?v=3" },
    ],
    shortcut: "/logo.png?v=3",
    apple: "/icon-192x192.png?v=3",
  },
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
        <link rel="icon" href="/logo.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png?v=3" />
        <meta name="apple-mobile-web-app-title" content="HayatLink" />
        <meta name="application-name" content="HayatLink" />
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
