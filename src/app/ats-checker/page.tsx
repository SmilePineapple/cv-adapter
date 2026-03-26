'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, CheckCircle, XCircle, AlertCircle, Zap, FileText, Target, Award } from 'lucide-react'

export default function ATSCheckerPage() {
  const [cvText, setCvText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [email, setEmail] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showEmailCapture, setShowEmailCapture] = useState(false)

  const analyzeCV = () => {
    if (!cvText.trim() || !jobDescription.trim()) {
      return
    }

    setLoading(true)
    
    // Simulate analysis (in production, this would call your ATS scoring API)
    setTimeout(() => {
      const calculatedScore = calculateATSScore(cvText, jobDescription)
      setScore(calculatedScore)
      setAnalysis(generateAnalysis(cvText, jobDescription, calculatedScore))
      setShowEmailCapture(true)
      setLoading(false)
    }, 2000)
  }

  const calculateATSScore = (cv: string, jd: string): number => {
    let score = 0
    const cvLower = cv.toLowerCase()
    const jdLower = jd.toLowerCase()
    
    // Extract keywords from job description
    const jdWords = jdLower.split(/\s+/).filter(w => w.length > 3)
    const commonWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'will', 'your', 'our', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'does', 'did', 'can', 'could', 'would', 'should'])
    
    const keywords = jdWords.filter(w => !commonWords.has(w))
    const uniqueKeywords = [...new Set(keywords)]
    
    // Check keyword matches
    let matchedKeywords = 0
    uniqueKeywords.forEach(keyword => {
      if (cvLower.includes(keyword)) {
        matchedKeywords++
      }
    })
    
    const keywordScore = Math.min((matchedKeywords / Math.max(uniqueKeywords.length, 1)) * 40, 40)
    score += keywordScore
    
    // Check formatting
    const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(cv)
    const hasPhone = /\+?[\d\s()-]{10,}/i.test(cv)
    const hasSections = /experience|education|skills/i.test(cv)
    const hasBulletPoints = cv.includes('•') || cv.includes('-') || cv.includes('*')
    
    if (hasEmail) score += 10
    if (hasPhone) score += 10
    if (hasSections) score += 20
    if (hasBulletPoints) score += 10
    
    // Check length
    const wordCount = cv.split(/\s+/).length
    if (wordCount >= 300 && wordCount <= 800) {
      score += 10
    }
    
    return Math.min(Math.round(score), 100)
  }

  const generateAnalysis = (cv: string, jd: string, score: number) => {
    const cvLower = cv.toLowerCase()
    const jdLower = jd.toLowerCase()
    
    const issues = []
    const strengths = []
    const recommendations = []
    
    // Check for contact info
    if (!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(cv)) {
      issues.push('Missing email address')
      recommendations.push('Add your email address at the top of your CV')
    } else {
      strengths.push('Contact information present')
    }
    
    // Check for sections
    if (!/experience/i.test(cv)) {
      issues.push('No "Experience" section found')
      recommendations.push('Add a clear "Work Experience" or "Professional Experience" section')
    } else {
      strengths.push('Experience section included')
    }
    
    if (!/education/i.test(cv)) {
      issues.push('No "Education" section found')
      recommendations.push('Add an "Education" section with your qualifications')
    } else {
      strengths.push('Education section included')
    }
    
    if (!/skills/i.test(cv)) {
      issues.push('No "Skills" section found')
      recommendations.push('Add a "Skills" section with relevant technical and soft skills')
    } else {
      strengths.push('Skills section included')
    }
    
    // Check formatting
    if (!cv.includes('•') && !cv.includes('-') && !cv.includes('*')) {
      issues.push('No bullet points detected')
      recommendations.push('Use bullet points to list achievements and responsibilities')
    } else {
      strengths.push('Bullet points used effectively')
    }
    
    // Check length
    const wordCount = cv.split(/\s+/).length
    if (wordCount < 300) {
      issues.push('CV is too short')
      recommendations.push('Expand your CV with more details about your experience and achievements')
    } else if (wordCount > 800) {
      issues.push('CV might be too long')
      recommendations.push('Consider condensing to 1-2 pages for better ATS compatibility')
    } else {
      strengths.push('Good CV length')
    }
    
    // Keyword analysis
    const jdWords = jdLower.split(/\s+/).filter(w => w.length > 3)
    const commonWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'will', 'your', 'our', 'are', 'was', 'were', 'been', 'being', 'has', 'had', 'does', 'did', 'can', 'could', 'would', 'should'])
    const keywords = jdWords.filter(w => !commonWords.has(w))
    const uniqueKeywords = [...new Set(keywords)]
    
    let matchedKeywords = 0
    const missingKeywords: string[] = []
    
    uniqueKeywords.slice(0, 20).forEach(keyword => {
      if (cvLower.includes(keyword)) {
        matchedKeywords++
      } else {
        missingKeywords.push(keyword)
      }
    })
    
    if (matchedKeywords < uniqueKeywords.length * 0.3) {
      issues.push('Low keyword match with job description')
      recommendations.push(`Add these keywords from the job description: ${missingKeywords.slice(0, 5).join(', ')}`)
    } else if (matchedKeywords > uniqueKeywords.length * 0.6) {
      strengths.push('Strong keyword alignment with job description')
    }
    
    return {
      issues,
      strengths,
      recommendations,
      keywordMatch: Math.round((matchedKeywords / Math.max(uniqueKeywords.length, 1)) * 100),
      missingKeywords: missingKeywords.slice(0, 10)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-black text-white">Free ATS CV Checker</h1>
          </div>
          <p className="mt-2 text-gray-400">Check if your CV will pass Applicant Tracking Systems (ATS)</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Info Banner */}
        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 mb-12 rounded-r-lg">
          <div className="flex items-start space-x-4">
            <Zap className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-black text-white mb-2">What is an ATS?</h2>
              <p className="text-gray-300 mb-4">
                Applicant Tracking Systems (ATS) are software used by 95% of Fortune 500 companies to filter CVs before they reach human recruiters. 
                Our free ATS checker analyzes your CV against job descriptions to ensure it passes these systems.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Instant analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Keyword matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Formatting check</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>100% free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        {!score && (
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* CV Input */}
            <div>
              <label className="block text-lg font-bold text-white mb-3">
                <FileText className="w-5 h-5 inline mr-2" />
                Your CV Text
              </label>
              <textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV text here...

Include all sections: contact info, summary, experience, education, skills, etc."
                className="w-full h-96 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              />
              <p className="text-sm text-gray-400 mt-2">
                {cvText.split(/\s+/).filter(w => w.length > 0).length} words
              </p>
            </div>

            {/* Job Description Input */}
            <div>
              <label className="block text-lg font-bold text-white mb-3">
                <Target className="w-5 h-5 inline mr-2" />
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here...

Include requirements, responsibilities, qualifications, and any keywords mentioned."
                className="w-full h-96 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              />
              <p className="text-sm text-gray-400 mt-2">
                {jobDescription.split(/\s+/).filter(w => w.length > 0).length} words
              </p>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {!score && (
          <div className="text-center mb-12">
            <button
              onClick={analyzeCV}
              disabled={!cvText.trim() || !jobDescription.trim() || loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Check ATS Score
                </>
              )}
            </button>
            <p className="text-sm text-gray-400 mt-4">
              Free • No sign up required • Instant results
            </p>
          </div>
        )}

        {/* Results Section */}
        {score !== null && analysis && (
          <div className="space-y-8">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
              <Award className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Your ATS Score</h2>
              <div className={`text-7xl font-black mb-2 ${getScoreColor(score)}`}>
                {score}%
              </div>
              <p className="text-xl text-gray-300 mb-6">{getScoreLabel(score)}</p>
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Keyword Match */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Keyword Match: {analysis.keywordMatch}%
              </h3>
              <p className="text-gray-300 mb-4">
                Your CV matches {analysis.keywordMatch}% of the keywords from the job description.
              </p>
              {analysis.missingKeywords.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">Missing keywords:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword: string, idx: number) => (
                      <span key={idx} className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  Issues Found
                </h3>
                <ul className="space-y-2">
                  {analysis.issues.map((issue: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Email Capture CTA */}
            {showEmailCapture && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Want a Perfect ATS-Optimized CV?</h3>
                <p className="text-lg text-blue-100 mb-6">
                  Our AI Resume Adapter creates CVs that score 95%+ on ATS systems
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    href="/auth/signup"
                    className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5" />
                    Create Perfect CV Free
                  </Link>
                  <button
                    onClick={() => {
                      setScore(null)
                      setAnalysis(null)
                      setShowEmailCapture(false)
                      setCvText('')
                      setJobDescription('')
                    }}
                    className="bg-blue-700 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-800 transition-all"
                  >
                    Check Another CV
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How It Works */}
        <div className="mt-16 bg-white/5 border border-white/10 rounded-xl p-8">
          <h2 className="text-3xl font-black text-white mb-6">How Our ATS Checker Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-2">1. Keyword Analysis</h3>
              <p className="text-sm text-gray-400">
                We extract keywords from the job description and check how many appear in your CV
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">2. Format Check</h3>
              <p className="text-sm text-gray-400">
                We verify your CV has proper sections, contact info, and ATS-friendly formatting
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold text-white mb-2">3. Score & Recommendations</h3>
              <p className="text-sm text-gray-400">
                Get an instant ATS score with specific recommendations to improve your CV
              </p>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="mt-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-black text-white mb-4">📚 Related Resources</h3>
          <p className="text-gray-300 mb-6">Learn more about ATS optimization and CV writing:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/ats-optimization-guide" className="bg-black/50 p-4 rounded-lg hover:bg-black/70 transition-all border border-white/10">
              <p className="text-blue-400 hover:text-blue-300 font-semibold">ATS Optimization Guide →</p>
              <p className="text-sm text-gray-400 mt-1">Complete guide to beating ATS</p>
            </Link>
            <Link href="/cv-writing-guide" className="bg-black/50 p-4 rounded-lg hover:bg-black/70 transition-all border border-white/10">
              <p className="text-blue-400 hover:text-blue-300 font-semibold">CV Writing Guide →</p>
              <p className="text-sm text-gray-400 mt-1">Step-by-step CV tutorial</p>
            </Link>
            <Link href="/templates" className="bg-black/50 p-4 rounded-lg hover:bg-black/70 transition-all border border-white/10">
              <p className="text-blue-400 hover:text-blue-300 font-semibold">Free CV Templates →</p>
              <p className="text-sm text-gray-400 mt-1">12 ATS-friendly templates</p>
            </Link>
            <Link href="/cv-examples" className="bg-black/50 p-4 rounded-lg hover:bg-black/70 transition-all border border-white/10">
              <p className="text-blue-400 hover:text-blue-300 font-semibold">CV Examples →</p>
              <p className="text-sm text-gray-400 mt-1">15+ industry examples</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
