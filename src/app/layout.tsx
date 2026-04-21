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
    default: 'My CV Buddy | Free AI CV Builder for UK Jobs 2026',
    template: '%s | My CV Buddy',
  },
  description: 'MyCVBuddy is a free AI CV builder for UK jobs. Upload your CV, paste the job description, and get a tailored, ATS-optimised CV in minutes. No credit card required.',
  keywords: ['CV builder', 'AI CV', 'mycvbuddy', 'my cv buddy', 'cover letter generator', 'ATS optimiser', 'UK CV', 'resume builder', 'free cv builder uk'],
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
      </body>
    </html>
  );
}
