import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ตรวจสอบเขตเลือกตั้งและประชามติ",
  description: "ตรวจสอบเขตเลือกตั้งและประชามติ",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ตรวจสอบเขตเลือกตั้งและประชามติ",
    description: "ตรวจสอบเขตเลือกตั้งและประชามติ",
    images: ["/og-image.svg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ตรวจสอบเขตเลือกตั้งและประชามติ",
    description: "ตรวจสอบเขตเลือกตั้งและประชามติ",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
