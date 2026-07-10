import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Creador de CV con IA Gratis | MyCVBuddy',
  description: 'Crea un CV profesional y optimizado para ATS en minutos con inteligencia artificial. Sube tu CV, pega la descripción del puesto y obtén un CV adaptado. Empieza gratis, sin tarjeta de crédito.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/es',
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
    title: 'Creador de CV con IA Gratis | MyCVBuddy',
    description: 'Crea un CV profesional y optimizado para ATS en minutos con inteligencia artificial. Empieza gratis, sin tarjeta de crédito.',
    url: 'https://www.mycvbuddy.com/es',
    locale: 'es_ES',
  },
}

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return children
}
