'use client'

import Link from 'next/link'
import { Sparkles, FileText, Zap, Globe, CheckCircle, ArrowRight } from 'lucide-react'

export default function FrenchLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CV Adapter
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                English
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
              >
                Commencer Gratuitement
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Optimisé pour les CV en Français
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transformez Votre CV avec l'IA
            <span className="block mt-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              En Français
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Adaptez instantanément votre CV à n'importe quelle offre d'emploi. 
            Notre IA génère du contenu professionnel en français, optimisé pour les systèmes ATS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/signup"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Essayer Gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-gray-200"
            >
              Se Connecter
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            ✨ 1 génération gratuite • Aucune carte bancaire requise
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              IA en Français
            </h3>
            <p className="text-gray-600">
              Notre IA génère du contenu professionnel directement en français. 
              Pas de traduction maladroite, juste du français authentique.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Optimisation ATS
            </h3>
            <p className="text-gray-600">
              Optimisé pour passer les systèmes de suivi des candidatures (ATS) 
              utilisés par les entreprises françaises.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Export Multiple
            </h3>
            <p className="text-gray-600">
              Téléchargez votre CV en PDF, DOCX ou TXT. 
              Prêt à envoyer aux recruteurs français.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Comment Ça Marche
          </h2>
          <p className="text-xl text-gray-600">
            Trois étapes simples pour un CV parfait
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Téléchargez Votre CV
            </h3>
            <p className="text-gray-600">
              Importez votre CV actuel en français (PDF ou DOCX)
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Collez l'Offre d'Emploi
            </h3>
            <p className="text-gray-600">
              Ajoutez la description du poste qui vous intéresse
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Générez & Téléchargez
            </h3>
            <p className="text-gray-600">
              L'IA adapte votre CV en français et vous le téléchargez
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pourquoi Choisir CV Adapter?
            </h2>
            <div className="space-y-4">
              {[
                'Génération IA en français natif',
                'Optimisation pour le marché français',
                'Score ATS pour mesurer vos chances',
                'Lettres de motivation personnalisées',
                'Export professionnel (PDF, DOCX)',
                'Interface simple et intuitive'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-2xl">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Gratuit</div>
                  <div className="text-sm text-gray-600">1 génération</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">0€</div>
                <p className="text-gray-600 mb-4">Essayez sans engagement</p>
                <Link
                  href="/signup"
                  className="block w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold text-center"
                >
                  Commencer Maintenant
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Pro</div>
                  <div className="text-sm text-gray-600">100 générations</div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="text-3xl font-bold text-gray-900 mb-2">5€</div>
                <p className="text-gray-600 mb-4">Paiement unique, à vie</p>
                <Link
                  href="/subscription"
                  className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-center"
                >
                  Passer à Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à Transformer Votre CV?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des centaines de professionnels français qui utilisent CV Adapter
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg"
          >
            Commencer Gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p className="mb-4">© 2025 CV Adapter. Tous droits réservés.</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <Link href="/privacy" className="hover:text-gray-900">
                Confidentialité
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
                Conditions
              </Link>
              <Link href="/contact" className="hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
