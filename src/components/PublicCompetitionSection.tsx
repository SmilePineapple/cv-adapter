'use client'

import { useState } from 'react'
import { Trophy, Sparkles, TrendingUp } from 'lucide-react'
import PublicCompetitionGame from './PublicCompetitionGame'

export default function PublicCompetitionSection() {
  const [showGame, setShowGame] = useState(false)

  return (
    <>
      <section id="competition" className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Monthly Competition</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Win 20 Free CV Generations!
              </h2>
              <p className="text-xl text-gray-600">
                Play our CV Clicker game and compete for the top 3 spots each month
              </p>
            </div>

            {/* Competition Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Trophy className="w-12 h-12" />
                  <h3 className="text-3xl font-bold">CV Clicker Challenge</h3>
                </div>
                <p className="text-center text-purple-100 text-lg">
                  Test your reflexes and win free CV generations!
                </p>
              </div>

              <div className="p-8">
                {/* How it Works */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-5xl mb-3">🎮</div>
                    <h4 className="font-bold text-lg mb-2">Play the Game</h4>
                    <p className="text-sm text-gray-600">
                      Click CVs and stars as fast as you can in 30 seconds
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl mb-3">🏆</div>
                    <h4 className="font-bold text-lg mb-2">Top 3 Win</h4>
                    <p className="text-sm text-gray-600">
                      Highest scores at month-end win 20 free generations
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl mb-3">✨</div>
                    <h4 className="font-bold text-lg mb-2">Monthly Reset</h4>
                    <p className="text-sm text-gray-600">
                      New competition starts every month - play again!
                    </p>
                  </div>
                </div>

                {/* Scoring */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
                  <h4 className="font-bold text-center mb-4 text-lg">How to Score</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                      <div className="text-4xl mb-2">📄</div>
                      <div className="font-bold text-green-600">+10 pts</div>
                      <div className="text-xs text-gray-600">CV Icons</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                      <div className="text-4xl mb-2">⭐</div>
                      <div className="font-bold text-yellow-600">+25 pts</div>
                      <div className="text-xs text-gray-600">Stars (Bonus!)</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                      <div className="text-4xl mb-2">💣</div>
                      <div className="font-bold text-red-600">-15 pts</div>
                      <div className="text-xs text-gray-600">Bombs (Avoid!)</div>
                    </div>
                  </div>
                </div>

                {/* Prize Details */}
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>🏆 Prize:</strong> Top 3 players each month win 20 free CV generations added to their account
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    Winners announced at the start of each month via email
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setShowGame(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Trophy className="w-6 h-6" />
                  <span>Play Now & Win!</span>
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Free to play • No signup required to try • Winners contacted via email
                </p>
              </div>
            </div>

            {/* Stats/Social Proof */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">Winners/Month</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-blue-600">20</div>
                <div className="text-sm text-gray-600">Free Generations</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-pink-600">30s</div>
                <div className="text-sm text-gray-600">Game Duration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Modal */}
      {showGame && <PublicCompetitionGame onClose={() => setShowGame(false)} />}
    </>
  )
}
