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
  title: "CV Adapter - AI-Powered CV Tailoring",
  description: "Tailor your CV to any job description with AI. Upload your CV, paste the job description, and get an optimized version in minutes.",
  keywords: ["CV", "resume", "job application", "AI", "tailoring", "ATS optimization"],
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
