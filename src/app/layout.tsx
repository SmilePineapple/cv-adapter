import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { PageTracker } from "@/components/PageTracker";
import CrispChat from "@/components/CrispChat";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mycvbuddy.com'),
  title: {
    default: "Free CV Builder UK | AI-Powered CV Maker & Generator | CV Adapter",
    template: "%s | CV Adapter - Free CV Builder UK"
  },
  description: "Free CV builder UK trusted by professionals. Create ATS-optimized CVs in 2 minutes with AI. Professional CV templates, cover letters & interview prep. No credit card required. Perfect for UK job seekers.",
  keywords: [
    "CV builder UK",
    "free CV builder",
    "CV maker UK",
    "CV generator UK",
    "AI CV builder",
    "ATS-friendly CV",
    "professional CV templates UK",
    "CV tailoring",
    "resume builder UK",
    "cover letter generator UK",
    "job application CV",
    "CV writing service",
    "online CV maker",
    "CV template UK",
    "ATS CV checker"
  ],
  authors: [{ name: "CV Adapter" }],
  creator: "CV Adapter",
  publisher: "CV Adapter",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.mycvbuddy.com',
    siteName: 'CV Adapter - Free CV Builder UK',
    title: 'Free CV Builder UK | AI-Powered CV Maker | CV Adapter',
    description: 'Free CV builder UK trusted by professionals. Create ATS-optimized CVs in 2 minutes with AI. No credit card required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CV Adapter - AI-Powered CV Tailoring',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free CV Builder UK | AI-Powered CV Maker',
    description: 'Free CV builder UK. Create ATS-optimized CVs in 2 minutes with AI. No credit card required.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <PageTracker />
        {children}
        <Toaster position="top-right" />
        <CrispChat />
      </body>
    </html>
  );
}
