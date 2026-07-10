import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criador de CV com IA Grátis | MyCVBuddy',
  description: 'Crie um currículo profissional e otimizado para ATS em minutos com inteligência artificial. Envie o seu CV, cole a descrição da vaga e obtenha um CV personalizado. Comece grátis, sem cartão de crédito.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/pt',
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
    title: 'Criador de CV com IA Grátis | MyCVBuddy',
    description: 'Crie um currículo profissional e otimizado para ATS em minutos com inteligência artificial. Comece grátis, sem cartão de crédito.',
    url: 'https://www.mycvbuddy.com/pt',
    locale: 'pt_PT',
  },
}

export default function PortugueseLayout({ children }: { children: React.ReactNode }) {
  return children
}
