import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { PageTracker } from "@/components/PageTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mycvbuddy.com'),
  title: {
    default: "CV Adapter - AI-Powered CV Tailoring for Job Applications",
    template: "%s | CV Adapter"
  },
  description: "Tailor your CV to any job description with AI in 2 minutes. Get ATS-optimized CVs, professional templates, and cover letters. Try free - no credit card required.",
  keywords: ["CV generator UK", "AI CV maker", "ATS-friendly CV", "resume builder", "job application", "CV tailoring", "professional CV templates", "cover letter generator"],
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
    siteName: 'CV Adapter',
    title: 'CV Adapter - AI-Powered CV Tailoring',
    description: 'Tailor your CV to any job description with AI in 2 minutes. ATS-optimized, professional templates.',
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
    title: 'CV Adapter - AI-Powered CV Tailoring',
    description: 'Tailor your CV to any job description with AI in 2 minutes.',
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
      </body>
    </html>
  );
}
