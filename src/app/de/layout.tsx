import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kostenloser KI-Lebenslauf-Generator | MyCVBuddy',
  description: 'Erstellen Sie mit KI einen professionellen, ATS-optimierten Lebenslauf in Minuten. Laden Sie Ihren Lebenslauf hoch, fügen Sie die Stellenbeschreibung ein und erhalten Sie einen maßgeschneiderten Lebenslauf. Kostenlos starten, keine Kreditkarte erforderlich.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/de',
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
    title: 'Kostenloser KI-Lebenslauf-Generator | MyCVBuddy',
    description: 'Erstellen Sie mit KI einen professionellen, ATS-optimierten Lebenslauf in Minuten. Kostenlos starten, keine Kreditkarte erforderlich.',
    url: 'https://www.mycvbuddy.com/de',
    locale: 'de_DE',
  },
}

export default function GermanLayout({ children }: { children: React.ReactNode }) {
  return children
}
