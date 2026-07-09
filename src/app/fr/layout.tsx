import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Générateur de CV IA Gratuit | MyCVBuddy',
  description: "Créez un CV professionnel optimisé pour les systèmes ATS en quelques minutes grâce à l'IA. Importez votre CV, collez l'offre d'emploi et obtenez un CV sur mesure. Commencez gratuitement, sans carte bancaire.",
  alternates: {
    canonical: 'https://www.mycvbuddy.com/fr',
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
    title: 'Générateur de CV IA Gratuit | MyCVBuddy',
    description: "Créez un CV professionnel optimisé pour les systèmes ATS en quelques minutes grâce à l'IA. Commencez gratuitement, sans carte bancaire.",
    url: 'https://www.mycvbuddy.com/fr',
    locale: 'fr_FR',
  },
}

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  return children
}
