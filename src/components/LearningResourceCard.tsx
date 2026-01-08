'use client'

import { LearningResource } from '@/types/skills-assessment'
import { ExternalLink, Clock, DollarSign, Star } from 'lucide-react'

interface LearningResourceCardProps {
  resource: LearningResource
  onEnroll?: () => void
}

export default function LearningResourceCard({ resource, onEnroll }: LearningResourceCardProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚'
      case 'video': return '🎥'
      case 'article': return '📄'
      case 'book': return '📖'
      case 'practice': return '💻'
      case 'certification': return '🏆'
      default: return '📝'
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700'
      case 'intermediate': return 'bg-yellow-100 text-yellow-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-blue-300">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-4xl flex-shrink-0">
          {getResourceIcon(resource.resource_type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {resource.title}
            </h3>
            {resource.rating && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">
                  {resource.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Provider */}
          {resource.provider && (
            <p className="text-sm text-gray-600 mb-2">
              by {resource.provider}
            </p>
          )}

          {/* Description */}
          {resource.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {resource.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Type Badge */}
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium capitalize">
              {resource.resource_type}
            </span>

            {/* Difficulty */}
            {resource.difficulty && (
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium capitalize ${getDifficultyColor(resource.difficulty)}`}>
                {resource.difficulty}
              </span>
            )}

            {/* Duration */}
            {resource.estimated_hours && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                <Clock className="w-3 h-3" />
                {resource.estimated_hours}h
              </span>
            )}

            {/* Price */}
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              resource.is_free 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {resource.is_free ? (
                <>✓ Free</>
              ) : (
                <>
                  <DollarSign className="w-3 h-3" />
                  Paid
                </>
              )}
            </span>
          </div>

          {/* Action Button */}
          {resource.url && (
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onEnroll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              View Resource
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
