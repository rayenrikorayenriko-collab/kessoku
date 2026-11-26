import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConfigProvider } from "@/components/providers/ConfigProvider";
import { PrefsProvider } from "@/components/providers/PrefsProvider";

export const metadata: Metadata = {
  title: "Kessoku Family — Portofolio & Registrasi Anggota",
  description:
    "Portofolio resmi dan gerbang pendaftaran anggota Kessoku Family (KSF).",
  applicationName: "Kessoku Family",
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConfigProvider>
          <PrefsProvider>{children}</PrefsProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
