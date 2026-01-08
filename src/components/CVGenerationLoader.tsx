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
    <div className="relative mt-6 p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-blue-100 overflow-hidden">
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
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
              <Sparkles className="w-6 h-6 text-white animate-spin-slow" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Crafting Your Perfect CV</h3>
            <p className="text-sm text-gray-600">AI is working its magic...</p>
          </div>
        </div>

        {/* Current Step with Animation */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-blue-100">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-gray-900 animate-pulse">{step}</p>
          </div>
        </div>

        {/* Progress Bar with Glow Effect */}
        <div className="space-y-3">
          <div className="relative w-full bg-white/50 backdrop-blur-sm rounded-full h-4 overflow-hidden shadow-inner border border-blue-100">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            
            {/* Progress fill with gradient */}
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 blur-sm bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50" />
            </div>
          </div>

          {/* Progress Percentage */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 font-medium">{progress}% Complete</span>
            <span className="text-gray-500">~{Math.max(0, Math.ceil((100 - progress) * 1.2))}s remaining</span>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className={`flex flex-col items-center p-3 rounded-lg transition-all duration-500 ${progress >= 30 ? 'bg-white/80 border-2 border-green-200' : 'bg-white/40 border border-gray-200'}`}>
            {progress >= 30 ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mb-1" />
            ) : (
              <Loader2 className="w-5 h-5 text-gray-400 mb-1 animate-spin" />
            )}
            <span className="text-xs font-medium text-gray-700">AI Analysis</span>
          </div>
          
          <div className={`flex flex-col items-center p-3 rounded-lg transition-all duration-500 ${progress >= 70 ? 'bg-white/80 border-2 border-green-200' : 'bg-white/40 border border-gray-200'}`}>
            {progress >= 70 ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mb-1" />
            ) : (
              <Loader2 className="w-5 h-5 text-gray-400 mb-1 animate-spin" />
            )}
            <span className="text-xs font-medium text-gray-700">ATS Optimization</span>
          </div>
          
          <div className={`flex flex-col items-center p-3 rounded-lg transition-all duration-500 ${progress >= 90 ? 'bg-white/80 border-2 border-green-200' : 'bg-white/40 border border-gray-200'}`}>
            {progress >= 90 ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 mb-1" />
            ) : (
              <Loader2 className="w-5 h-5 text-gray-400 mb-1 animate-spin" />
            )}
            <span className="text-xs font-medium text-gray-700">Formatting</span>
          </div>
        </div>

        {/* Reassurance Message */}
        <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-100">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Why does this take time?</p>
              <p className="text-xs text-gray-600 leading-relaxed">
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
