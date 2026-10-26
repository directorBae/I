import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  OG_IMAGE,
} from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "배정원: Bae Jeongwon",
    template: "%s | 배정원",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "배정원",
    "Bae Jeongwon",
    "Jeongwon Bae",
    "directorBae",
    "창업",
    "스타트업",
    "Entrepreneur",
    "Engineer",
    "포트폴리오",
    "UNIST",
  ],
  authors: [{ name: "배정원 (Bae Jeongwon)", url: SITE_URL }],
  creator: "배정원",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: SITE_NAME,
    title: "배정원: Bae Jeongwon",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "배정원: Bae Jeongwon",
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
