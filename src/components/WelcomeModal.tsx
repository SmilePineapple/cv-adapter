'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Zap, Download, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (!hasSeenWelcome) {
      // Delay modal slightly for better UX
      setTimeout(() => {
        setIsOpen(true)
      }, 500)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setIsOpen(false)
  }

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative animate-scale-in shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close welcome modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to CV Buddy! 👋
          </h2>
          <p className="text-lg text-gray-600">
            Create professional, ATS-friendly CVs in minutes with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Upload Your CV</h3>
            <p className="text-sm text-gray-600">
              Upload your existing CV in PDF, DOCX, or TXT format
            </p>
          </div>

          <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. AI Tailoring</h3>
            <p className="text-sm text-gray-600">
              Let AI optimize your CV for any job in seconds
            </p>
          </div>

          <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Download</h3>
            <p className="text-sm text-gray-600">
              Export in PDF, DOCX, or TXT format instantly
            </p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">✨ Free to start!</p>
              <p className="text-blue-700">
                Get 1 free CV generation. Upgrade to Pro for just £5 to unlock 100 generations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Link
            href="/upload"
            onClick={handleGetStarted}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
          <button
            onClick={handleClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
