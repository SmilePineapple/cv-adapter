import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { PageTracker } from "@/components/PageTracker";
import CrispChat from "@/components/CrispChat";
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mycvbuddy.com'),
  title: {
    default: 'MyCVBuddy | Free AI CV Builder & CV Writer for UK Jobs 2026',
    template: '%s | MyCVBuddy',
  },
  description: 'MyCVBuddy is a free AI CV builder and mycv writer for UK jobs. Upload your CV, paste the job description, and get a tailored, ATS-optimised CV in minutes. No credit card required.',
  keywords: ['CV builder', 'AI CV', 'mycvbuddy', 'mycv', 'my cv buddy', 'mycv builder', 'cv ideas uk', 'marketing cv examples uk', 'cv uk sample', 'example cvs uk', 'cover letter generator', 'ATS optimiser', 'UK CV', 'resume builder', 'free cv builder uk'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://www.mycvbuddy.com',
    languages: {
      'en-US': 'https://www.mycvbuddy.com',
      'en-GB': 'https://www.mycvbuddy.com',
      'x-default': 'https://www.mycvbuddy.com',
    },
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
        {/* Trustpilot Widget Script */}
        <script
          type="text/javascript"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          async
        ></script>
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <PageTracker />
        {children}
        <Toaster position="top-right" />
        <CrispChat />
        <SpeedInsights />
      </body>
    </html>
  );
}
