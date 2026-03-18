'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Zap, CheckCircle2, Loader2 } from 'lucide-react'

interface CVGenerationLoaderProps {
  progress: number
  step: string
}

export default function CVGenerationLoader({ progress, step }: CVGenerationLoaderProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="relative mt-6 p-8 bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl shadow-2xl">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Animated Gradient Orbs - More dramatic */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-70 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 rounded-full shadow-lg">
              <Sparkles className="w-7 h-7 text-white animate-spin-slow" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Crafting Your Perfect CV</h3>
            <p className="text-sm text-gray-300">AI is working its magic...</p>
          </div>
        </div>

        {/* Current Step with Animation */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg border border-white/20">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <p className="text-sm font-black text-white animate-pulse">{step}</p>
          </div>
        </div>

        {/* Progress Bar with Glow Effect */}
        <div className="space-y-3">
          <div className="relative w-full bg-white/10 backdrop-blur-sm rounded-full h-5 overflow-hidden shadow-inner border border-white/20">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            
            {/* Progress fill with gradient */}
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden shadow-lg"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 blur-md bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60" />
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-white font-black">{progress}% Complete</span>
            <span className="text-gray-400">~{Math.max(0, Math.ceil((100 - progress) * 1.2))}s remaining</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className={`flex flex-col items-center p-4 rounded-xl transition-all duration-500 ${progress >= 30 ? 'bg-green-500/20 border-2 border-green-500/40 shadow-lg shadow-green-500/20' : 'bg-white/5 border border-white/20'}`}>
            {progress >= 30 ? (
              <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
            ) : (
              <Loader2 className="w-6 h-6 text-gray-400 mb-2 animate-spin" />
            )}
            <span className="text-xs font-black text-white">AI Analysis</span>
          </div>
          
          <div className={`flex flex-col items-center p-4 rounded-xl transition-all duration-500 ${progress >= 70 ? 'bg-green-500/20 border-2 border-green-500/40 shadow-lg shadow-green-500/20' : 'bg-white/5 border border-white/20'}`}>
            {progress >= 70 ? (
              <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
            ) : (
              <Loader2 className="w-6 h-6 text-gray-400 mb-2 animate-spin" />
            )}
            <span className="text-xs font-black text-white">ATS Optimization</span>
          </div>
          
          <div className={`flex flex-col items-center p-4 rounded-xl transition-all duration-500 ${progress >= 90 ? 'bg-green-500/20 border-2 border-green-500/40 shadow-lg shadow-green-500/20' : 'bg-white/5 border border-white/20'}`}>
            {progress >= 90 ? (
              <CheckCircle2 className="w-6 h-6 text-green-400 mb-2" />
            ) : (
              <Loader2 className="w-6 h-6 text-gray-400 mb-2 animate-spin" />
            )}
            <span className="text-xs font-black text-white">Formatting</span>
          </div>
        </div>

        {/* Reassurance Message */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-white mb-1">Why does this take time?</p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Our AI carefully analyzes every section of your CV, matches it with the job requirements, 
                optimizes for ATS systems, and ensures perfect formatting. Quality takes time! ⏱️
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-shine {
          animation: shine 2s infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  )
}
