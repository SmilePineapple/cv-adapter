import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'منشئ السيرة الذاتية بالذكاء الاصطناعي مجانًا | MyCVBuddy',
  description: 'أنشئ سيرة ذاتية احترافية ومتوافقة مع أنظمة ATS في دقائق باستخدام الذكاء الاصطناعي. ارفع سيرتك الذاتية، الصق الوصف الوظيفي، واحصل على سيرة ذاتية مخصصة. ابدأ مجانًا بدون بطاقة ائتمان.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/ar',
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
    title: 'منشئ السيرة الذاتية بالذكاء الاصطناعي مجانًا | MyCVBuddy',
    description: 'أنشئ سيرة ذاتية احترافية ومتوافقة مع أنظمة ATS في دقائق باستخدام الذكاء الاصطناعي. ابدأ مجانًا بدون بطاقة ائتمان.',
    url: 'https://www.mycvbuddy.com/ar',
    locale: 'ar_AR',
  },
}

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return <div dir="rtl">{children}</div>
}
