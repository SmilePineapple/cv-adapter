'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, Edit2, ChevronDown, ChevronUp } from 'lucide-react'

interface CVSection {
  type: string
  content: string
  order: number
}

interface CVVerificationProps {
  sections: CVSection[]
  fileName: string
  onConfirm: () => void
  onEdit: (sections: CVSection[]) => void
}

export default function CVVerification({ sections, fileName, onConfirm, onEdit }: CVVerificationProps) {
  const [editedSections, setEditedSections] = useState<CVSection[]>(sections)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [isEditing, setIsEditing] = useState(false)

  const toggleSection = (type: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedSections(newExpanded)
  }

  const handleContentChange = (index: number, newContent: string) => {
    const updated = [...editedSections]
    updated[index].content = newContent
    setEditedSections(updated)
  }

  const handleSaveEdits = () => {
    onEdit(editedSections)
    setIsEditing(false)
  }

  const getSectionIcon = (type: string) => {
    const icons: Record<string, string> = {
      name: '👤',
      contact: '📧',
      summary: '📝',
      experience: '💼',
      education: '🎓',
      skills: '⚡',
      certifications: '🏆',
      hobbies: '🎨',
      groups: '👥',
      strengths: '💪',
      additional: '📌'
    }
    return icons[type] || '📄'
  }

  const getSectionTitle = (type: string) => {
    const titles: Record<string, string> = {
      name: 'Name',
      contact: 'Contact Information',
      summary: 'Professional Summary',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      certifications: 'Certifications',
      hobbies: 'Hobbies & Interests',
      groups: 'Groups & Memberships',
      strengths: 'Core Strengths',
      additional: 'Additional Information'
    }
    return titles[type] || type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CV Parsed Successfully!</h2>
            <p className="text-sm text-gray-600 mt-1">File: {fileName}</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Please verify the extracted information</p>
              <p>Review the sections below to ensure all your CV content was captured correctly. You can edit any section if needed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto">
        {editedSections.map((section, index) => {
          const isExpanded = expandedSections.has(section.type)
          const contentStr = typeof section.content === 'string' 
            ? section.content 
            : JSON.stringify(section.content, null, 2)
          const preview = contentStr.substring(0, 100)
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.type)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getSectionIcon(section.type)}</span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{getSectionTitle(section.type)}</h3>
                    {!isExpanded && (
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        {preview}{section.content.length > 100 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  {isEditing ? (
                    <textarea
                      value={contentStr}
                      onChange={(e) => handleContentChange(index, e.target.value)}
                      className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Section content..."
                    />
                  ) : (
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {contentStr}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdits}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditedSections(sections)
                setIsEditing(false)
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              ✓ Looks Good - Continue
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Sections
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        💡 Tip: Expand each section to review the extracted content in detail
      </p>
    </div>
  )
}
