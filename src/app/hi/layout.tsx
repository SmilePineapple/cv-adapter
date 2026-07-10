import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'मुफ़्त एआई सीवी बिल्डर | MyCVBuddy',
  description: 'एआई की मदद से मिनटों में एक पेशेवर, एटीएस-ऑप्टिमाइज़्ड सीवी बनाएं। अपना सीवी अपलोड करें, जॉब डिस्क्रिप्शन पेस्ट करें, और एक कस्टमाइज़्ड सीवी पाएं। बिना क्रेडिट कार्ड के मुफ़्त शुरू करें।',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/hi',
    languages: {
      'en-US': 'https://www.mycvbuddy.com',
      'de-DE': 'https://www.mycvbuddy.com/de',
      'es-ES': 'https://www.mycvbuddy.com/es',
      'fr-FR': 'https://www.mycvbuddy.com/fr',
      'ar': 'https://www.mycvbuddy.com/ar',
      'hi-IN': 'https://www.mycvbuddy.com/hi',
      'pt-PT': 'https://www.mycvbuddy.com/pt',
      'x-default': 'https://www.mycvbuddy.com',
    },
  },
  openGraph: {
    title: 'मुफ़्त एआई सीवी बिल्डर | MyCVBuddy',
    description: 'एआई की मदद से मिनटों में एक पेशेवर, एटीएस-ऑप्टिमाइज़्ड सीवी बनाएं। बिना क्रेडिट कार्ड के मुफ़्त शुरू करें।',
    url: 'https://www.mycvbuddy.com/hi',
    locale: 'hi_IN',
  },
}

export default function HindiLayout({ children }: { children: React.ReactNode }) {
  return children
}
