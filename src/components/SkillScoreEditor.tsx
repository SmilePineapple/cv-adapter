'use client'

import { useState, useEffect } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { Sliders, Save, Plus, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Skill {
  name: string
  level: number
}

interface SkillScoreEditorProps {
  cvId: string
  onUpdate?: (skills: Skill[]) => void
}

export default function SkillScoreEditor({ cvId, onUpdate }: SkillScoreEditorProps) {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')

  useEffect(() => {
    loadSkills()
  }, [cvId])

  const loadSkills = async () => {
    try {
      const supabase = createSupabaseClient()
      
      // Try to load existing skill scores
      const { data: savedScores, error: scoresError } = await supabase
        .from('cv_sections')
        .select('content')
        .eq('cv_id', cvId)
        .eq('section_type', 'skill_scores')
        .maybeSingle()
      
      // Ignore "not found" errors
      if (scoresError && scoresError.code !== 'PGRST116') {
        console.error('Error loading skill scores:', scoresError)
      }

      if (savedScores?.content && Array.isArray(savedScores.content)) {
        setSkills(savedScores.content)
      } else {
        // Load skills from parsed CV
        const { data: cvData } = await supabase
          .from('cvs')
          .select('parsed_sections')
          .eq('id', cvId)
          .single()

        if (cvData?.parsed_sections?.sections) {
          const skillsSection = cvData.parsed_sections.sections.find(
            (s: any) => s.type === 'skills'
          )
          
          if (skillsSection?.content) {
            // Parse skills from content
            let skillNames: string[] = []
            
            if (Array.isArray(skillsSection.content)) {
              // Already an array of skill names
              skillNames = skillsSection.content.map(s => String(s).trim()).filter(Boolean)
            } else if (typeof skillsSection.content === 'string') {
              // Parse from comma/newline separated string
              skillNames = skillsSection.content
                .split(/[,\n•]/)
                .map(s => s.trim())
                .filter(Boolean)
            }
            
            // Limit to 10 skills and create skill objects
            setSkills(skillNames.slice(0, 10).map(name => ({ name, level: 70 })))
          }
        }
      }
    } catch (error) {
      console.error('Error loading skills:', error)
      toast.error('Failed to load skills')
    } finally {
      setIsLoading(false)
    }
  }

  const updateSkillLevel = (index: number, level: number) => {
    const updated = [...skills]
    updated[index].level = level
    setSkills(updated)
  }

  const addSkill = () => {
    if (!newSkillName.trim()) return
    
    setSkills([...skills, { name: newSkillName.trim(), level: 70 }])
    setNewSkillName('')
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const supabase = createSupabaseClient()
      
      // Check if record exists
      const { data: existing } = await supabase
        .from('cv_sections')
        .select('id')
        .eq('cv_id', cvId)
        .eq('section_type', 'skill_scores')
        .maybeSingle()

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('cv_sections')
          .update({
            content: skills,
            updated_at: new Date().toISOString()
          })
          .eq('cv_id', cvId)
          .eq('section_type', 'skill_scores')

        if (error) {
          console.error('Update error:', error)
          throw error
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('cv_sections')
          .insert({
            cv_id: cvId,
            section_type: 'skill_scores',
            title: 'Skill Scores',
            content: skills
          })

        if (error) {
          console.error('Insert error:', error)
          throw error
        }
      }

      toast.success('Skill levels saved successfully!')
      onUpdate?.(skills)
      
    } catch (error: any) {
      console.error('Save error:', error)
      console.error('Error details:', error.message, error.details, error.hint)
      toast.error(`Failed to save: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            Adjust Skill Levels
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Set proficiency levels for your skills (0-100%)
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || skills.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No skills found. Add your first skill below!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {skills.map((skill, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-blue-600 min-w-[50px] text-right">
                    {skill.level}%
                  </span>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove skill"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={skill.level}
                onChange={(e) => updateSkillLevel(index, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Skill */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Add New Skill</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            placeholder="e.g., JavaScript, Project Management"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addSkill}
            disabled={!newSkillName.trim()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 These skill levels will be used in templates with skill meters and progress bars
          </p>
        </div>
      )}
    </div>
  )
}
