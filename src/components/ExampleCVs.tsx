'use client'

import { FileText, Briefcase, GraduationCap, Code } from 'lucide-react'

const exampleCVs = [
  {
    id: 1,
    title: 'Software Engineer',
    icon: Code,
    description: 'Tech professional with 5+ years experience',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    id: 2,
    title: 'Marketing Manager',
    icon: Briefcase,
    description: 'Digital marketing expert with proven results',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    id: 3,
    title: 'Recent Graduate',
    icon: GraduationCap,
    description: 'Entry-level CV with academic achievements',
    color: 'bg-green-50 border-green-200 text-green-700'
  }
]

export default function ExampleCVs() {
  return (
    <div className="mt-8 sm:mt-12">
      <div className="text-center mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          See What's Possible
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Join 500+ users who've created professional CVs this week
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {exampleCVs.map((example) => {
          const Icon = example.icon
          return (
            <div
              key={example.id}
              className={`
                p-4 sm:p-6 rounded-xl border-2 transition-all duration-200
                hover:shadow-lg hover:scale-105 cursor-pointer
                ${example.color}
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h4 className="font-semibold text-base sm:text-lg mb-2">
                  {example.title}
                </h4>
                <p className="text-xs sm:text-sm opacity-80">
                  {example.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Success Stats */}
      <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-4 sm:gap-6 text-center">
        <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">500+</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">CVs Created</div>
        </div>
        <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-xl sm:text-2xl font-bold text-green-600">95%</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Success Rate</div>
        </div>
        <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-xl sm:text-2xl font-bold text-purple-600">2 min</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Avg. Time</div>
        </div>
      </div>
    </div>
  )
}
