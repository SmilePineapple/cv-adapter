'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseClient } from '@/lib/supabase'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Sparkles, 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Loader2
} from 'lucide-react'

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedIn?: string
  website?: string
}

interface WorkExperience {
  jobTitle: string
  company: string
  duration: string
  description: string
}

interface Education {
  degree: string
  institution: string
  year: string
  details?: string
}

export default function AutoCVPage() {
  const router = useRouter()
  const supabase = createSupabaseClient()
  
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateProgress, setGenerateProgress] = useState(0)
  const [generateStep, setGenerateStep] = useState('')
  
  // Form data
  const [jobDescription, setJobDescription] = useState('')
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: ''
  })
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([
    { jobTitle: '', company: '', duration: '', description: '' }
  ])
  const [education, setEducation] = useState<Education[]>([
    { degree: '', institution: '', year: '', details: '' }
  ])
  const [skills, setSkills] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const addWorkExperience = () => {
    setWorkExperience([...workExperience, { jobTitle: '', company: '', duration: '', description: '' }])
  }

  const removeWorkExperience = (index: number) => {
    if (workExperience.length > 1) {
      setWorkExperience(workExperience.filter((_, i) => i !== index))
    }
  }

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = [...workExperience]
    updated[index][field] = value
    setWorkExperience(updated)
  }

  const addEducation = () => {
    setEducation([...education, { degree: '', institution: '', year: '', details: '' }])
  }

  const removeEducation = (index: number) => {
    if (education.length > 1) {
      setEducation(education.filter((_, i) => i !== index))
    }
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education]
    updated[index][field] = value
    setEducation(updated)
  }

  const handleGenerate = async () => {
    // Validation
    if (!jobDescription.trim()) {
      toast.error('Please provide a job description')
      return
    }
    if (!personalInfo.fullName.trim() || !personalInfo.email.trim()) {
      toast.error('Please provide at least your name and email')
      return
    }

    setIsGenerating(true)
    setGenerateProgress(0)
    setGenerateStep('Analyzing job requirements...')

    try {
      setGenerateProgress(20)
      setGenerateStep('Processing your information...')

      const response = await fetch('/api/auto-cv-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_description: jobDescription,
          personal_info: personalInfo,
          work_experience: workExperience.filter(exp => exp.jobTitle.trim()),
          education: education.filter(edu => edu.degree.trim()),
          skills: skills,
          additional_info: additionalInfo,
        }),
      })

      setGenerateProgress(70)
      setGenerateStep('AI is building your CV...')

      const result = await response.json()

      if (!response.ok) {
        if (result.limit_reached) {
          toast.error('Monthly generation limit reached. Please upgrade to continue.')
          return
        }
        throw new Error(result.error || 'Generation failed')
      }

      setGenerateProgress(100)
      setGenerateStep('Complete!')
      toast.success('CV generated successfully!')

      // Redirect to review page
      setTimeout(() => {
        router.push(`/review/${result.generation_id}`)
      }, 500)

    } catch (error: any) {
      console.error('Generation error:', error)
      toast.error(error.message || 'Failed to generate CV')
    } finally {
      setIsGenerating(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && !jobDescription.trim()) {
      toast.error('Please provide a job description')
      return
    }
    if (step === 2 && (!personalInfo.fullName.trim() || !personalInfo.email.trim())) {
      toast.error('Please provide at least your name and email')
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900">Auto-CV Builder</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            {/* Step 1: Job Description */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Briefcase className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    What job are you applying for?
                  </h1>
                  <p className="text-gray-600">
                    Paste the job description and we'll build a CV tailored specifically for this role
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Include the full job posting for the best results. Our AI will analyze the requirements and build your CV accordingly.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next: Personal Info →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <User className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Personal Information
                  </h1>
                  <p className="text-gray-600">
                    Tell us about yourself so we can create your contact section
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                      placeholder="John Smith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                      placeholder="New York, NY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={personalInfo.linkedIn}
                      onChange={(e) => setPersonalInfo({...personalInfo, linkedIn: e.target.value})}
                      placeholder="https://linkedin.com/in/johnsmith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website/Portfolio
                    </label>
                    <input
                      type="url"
                      value={personalInfo.website}
                      onChange={(e) => setPersonalInfo({...personalInfo, website: e.target.value})}
                      placeholder="https://johnsmith.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next: Experience →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Work Experience & Education */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <Briefcase className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Experience & Education
                  </h1>
                  <p className="text-gray-600">
                    Add your work experience and education. Don't worry about perfect formatting - AI will optimize it.
                  </p>
                </div>

                {/* Work Experience */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                  {workExperience.map((exp, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                        {workExperience.length > 1 && (
                          <button
                            onClick={() => removeWorkExperience(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Job Title"
                          value={exp.jobTitle}
                          onChange={(e) => updateWorkExperience(index, 'jobTitle', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Duration (e.g., Jan 2020 - Present)"
                        value={exp.duration}
                        onChange={(e) => updateWorkExperience(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                      />
                      <textarea
                        placeholder="Brief description of your role and achievements..."
                        value={exp.description}
                        onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addWorkExperience}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add Another Experience
                  </button>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                  {education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                        {education.length > 1 && (
                          <button
                            onClick={() => removeEducation(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Degree/Qualification"
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Year (e.g., 2018-2022)"
                        value={edu.year}
                        onChange={(e) => updateEducation(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                      />
                      <textarea
                        placeholder="Additional details (GPA, honors, relevant coursework)..."
                        value={edu.details}
                        onChange={(e) => updateEducation(index, 'details', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add Another Education
                  </button>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next: Final Details →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Skills & Additional Info */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Skills & Additional Information
                  </h1>
                  <p className="text-gray-600">
                    Add your skills and any additional information to complete your profile
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <textarea
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="List your key skills (e.g., JavaScript, Project Management, Adobe Creative Suite, etc.)"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    List technical skills, soft skills, languages, certifications, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="Any additional information like volunteer work, projects, awards, interests, etc."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Include anything else that might be relevant to the job
                  </p>
                </div>

                {isGenerating ? (
                  <div className="text-center py-8">
                    <div className="space-y-4">
                      <Loader2 className="w-12 h-12 text-purple-600 mx-auto animate-spin" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">{generateStep}</p>
                        <p className="text-gray-600">This may take a few moments</p>
                      </div>
                      <div className="w-full max-w-md mx-auto">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{generateProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${generateProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate My CV
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
