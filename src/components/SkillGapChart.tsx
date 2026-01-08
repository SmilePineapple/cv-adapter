'use client'

import { SkillGap } from '@/types/skills-assessment'
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface SkillGapChartProps {
  skillGaps: SkillGap[]
  onSkillClick?: (skill: string) => void
}

export default function SkillGapChart({ skillGaps, onSkillClick }: SkillGapChartProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4" />
      case 'medium': return <TrendingUp className="w-4 h-4" />
      case 'low': return <CheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  if (skillGaps.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          No Major Skill Gaps!
        </h3>
        <p className="text-sm text-green-700">
          You're well-prepared for this role. Keep practicing to maintain your skills.
        </p>
      </div>
    )
  }

  // Sort by priority and gap percentage
  const sortedGaps = [...skillGaps].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff
    return b.gap_percentage - a.gap_percentage
  })

  return (
    <div className="space-y-4">
      {sortedGaps.map((gap, index) => (
        <div
          key={index}
          onClick={() => onSkillClick?.(gap.skill)}
          className={`
            bg-white border-2 rounded-xl p-5 transition-all
            ${onSkillClick ? 'cursor-pointer hover:shadow-lg hover:border-blue-300' : ''}
          `}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {gap.skill}
                </h3>
                <span className={`
                  inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border
                  ${getPriorityBadge(gap.priority)}
                `}>
                  {getPriorityIcon(gap.priority)}
                  {gap.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Gap: {gap.gap_percentage}% to reach target level
              </p>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3">
            {/* Current Level */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Current Level</span>
                <span className="font-semibold">{gap.current_level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${gap.current_level}%` }}
                />
              </div>
            </div>

            {/* Target Level */}
            <div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Target Level</span>
                <span className="font-semibold">{gap.target_level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${gap.target_level}%` }}
                />
              </div>
            </div>
          </div>

          {/* Gap Indicator */}
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(gap.priority)}`} />
            <p className="text-xs text-gray-600">
              Focus on improving this skill to reach your target level
            </p>
          </div>

          {/* Resources Preview */}
          {gap.resources && gap.resources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                {gap.resources.length} learning resource{gap.resources.length > 1 ? 's' : ''} available
              </p>
              <div className="flex flex-wrap gap-2">
                {gap.resources.slice(0, 3).map((resource, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs"
                  >
                    {resource.resource_type === 'course' && '📚'}
                    {resource.resource_type === 'video' && '🎥'}
                    {resource.resource_type === 'article' && '📄'}
                    {resource.resource_type === 'certification' && '🏆'}
                    <span className="ml-1">{resource.title.substring(0, 20)}...</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
