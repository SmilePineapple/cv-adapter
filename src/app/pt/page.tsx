'use client'

import Link from 'next/link'
import { Sparkles, FileText, Zap, Globe, CheckCircle, ArrowRight } from 'lucide-react'

export default function PortugueseLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">English</Link>
              <Link href="/signup" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium">
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
            <Globe className="w-4 h-4" />
            Otimizado para CVs em Português
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforme Seu CV com IA
            <span className="block mt-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Em Português
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Adapte instantaneamente seu CV para qualquer vaga de emprego. 
            Nossa IA gera conteúdo profissional em português, otimizado para sistemas ATS.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/signup" className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl">
              Experimentar Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-all font-semibold text-lg border-2 border-gray-200">
              Entrar
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            ✨ 1 geração grátis • Sem necessidade de cartão de crédito
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Pronto Para Transformar Seu CV?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de profissionais brasileiros e portugueses que usam CV Adapter
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg">
            Começar Grátis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-gray-600">
            <p className="mb-4">© 2025 CV Adapter. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
