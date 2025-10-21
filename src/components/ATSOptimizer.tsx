'use client'

import { useState } from 'react'
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Loader2, X, Zap } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ATSOptimizerProps {
  generationId: string
  currentScore: number
  onOptimizationComplete: () => void
}

export default function ATSOptimizer({ generationId, currentScore, onOptimizationComplete }: ATSOptimizerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [result, setResult] = useState<any>(null)

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-50 border-green-200'
    if (score >= 50) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    setShowModal(true)

    try {
      const response = await fetch(`/api/optimize-ats?generation_id=${generationId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze')
      }

      setAnalysis(data)
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze CV')
      setShowModal(false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleOptimize = async () => {
    setIsOptimizing(true)

    try {
      const response = await fetch('/api/optimize-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generation_id: generationId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to optimize')
      }

      setResult(data)
      toast.success(`ATS score improved from ${data.beforeScore}% to ${data.afterScore}%!`)
      
      // Wait a moment to show results, then close and refresh
      setTimeout(() => {
        setShowModal(false)
        onOptimizationComplete()
      }, 3000)

    } catch (error) {
      console.error('Optimization error:', error)
      toast.error('Failed to optimize CV')
    } finally {
      setIsOptimizing(false)
    }
  }

  // Don't show button if score is already good
  if (currentScore >= 75) {
    return null
  }

  return (
    <>
      {/* Optimization Button */}
      <button
        onClick={handleAnalyze}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
          ${currentScore < 50 
            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 shadow-lg' 
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-md'
          }
        `}
      >
        <Zap className="w-4 h-4" />
        Optimize for ATS
        <span className="text-xs opacity-90">({currentScore}% → ~{Math.min(currentScore + 30, 95)}%)</span>
      </button>

      {/* Analysis & Optimization Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">ATS Optimization</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  disabled={isOptimizing}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Current Score */}
              <div className={`p-4 rounded-lg border-2 mb-6 ${getScoreBgColor(currentScore)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current ATS Score</p>
                    <p className={`text-3xl font-bold ${getScoreColor(currentScore)}`}>
                      {currentScore}%
                    </p>
                  </div>
                  {analysis && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated After</p>
                      <p className="text-3xl font-bold text-green-600">
                        {analysis.estimatedNewScore}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Loading State */}
              {isAnalyzing && (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Analyzing your CV for ATS optimization opportunities...</p>
                </div>
              )}

              {/* Analysis Results */}
              {analysis && !result && !isOptimizing && (
                <div className="space-y-6">
                  {/* Issues Found */}
                  {analysis.analysis.issues.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Issues Found ({analysis.analysis.issues.length})
                      </h3>
                      <div className="space-y-2">
                        {analysis.analysis.issues.slice(0, 5).map((issue: any, index: number) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-2">
                              <span className={`
                                px-2 py-0.5 text-xs font-bold rounded
                                ${issue.severity === 'high' ? 'bg-red-100 text-red-700' : 
                                  issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                  'bg-blue-100 text-blue-700'}
                              `}>
                                {issue.severity.toUpperCase()}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{issue.description}</p>
                                <p className="text-xs text-gray-600 mt-1">{issue.impact}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Keywords */}
                  {analysis.analysis.missingKeywords.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Missing Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.analysis.missingKeywords.slice(0, 10).map((keyword: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysis.analysis.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {analysis.analysis.recommendations.slice(0, 5).map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optimize Button */}
                  <button
                    onClick={handleOptimize}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Optimize My CV Now
                    <TrendingUp className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Optimizing State */}
              {isOptimizing && (
                <div className="text-center py-12">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
                    <Sparkles className="w-6 h-6 text-yellow-500 absolute top-0 left-1/2 -translate-x-1/2 animate-pulse" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">Optimizing Your CV...</p>
                  <p className="text-sm text-gray-600">AI is enhancing your content for maximum ATS compatibility</p>
                  <div className="mt-6 space-y-2 text-sm text-gray-600">
                    <p>✓ Adding missing keywords</p>
                    <p>✓ Quantifying achievements</p>
                    <p>✓ Optimizing structure</p>
                    <p>✓ Enhancing action verbs</p>
                  </div>
                </div>
              )}

              {/* Success Result */}
              {result && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Optimization Complete!</h3>
                  <p className="text-gray-600 mb-6">Your CV has been optimized for ATS systems</p>

                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Before</p>
                      <p className="text-3xl font-bold text-red-600">{result.beforeScore}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div className="text-center">
                      <p className="text-sm text-gray-600">After</p>
                      <p className="text-3xl font-bold text-green-600">{result.afterScore}%</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700">{result.changesSummary}</p>
                  </div>

                  {result.improvements && result.improvements.length > 0 && (
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 mb-2">Improvements Made:</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {result.improvements.slice(0, 5).map((imp: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
