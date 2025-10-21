'use client'

import { useState } from 'react'
import { X, Check } from 'lucide-react'

interface HobbyIconSelectorProps {
  onSelect: (hobbies: { name: string; icon: string }[]) => void
  initialHobbies?: { name: string; icon: string }[]
}

// All available hobby icons
const AVAILABLE_HOBBY_ICONS = [
  { name: 'Travel', icon: '✈️', keywords: ['travel', 'traveling', 'travelling', 'tourism'] },
  { name: 'Reading', icon: '📚', keywords: ['reading', 'books', 'literature'] },
  { name: 'Photography', icon: '📷', keywords: ['photography', 'photos', 'camera'] },
  { name: 'Music', icon: '🎵', keywords: ['music', 'singing', 'instruments', 'guitar', 'piano'] },
  { name: 'Swimming', icon: '🏊', keywords: ['swimming', 'swim', 'pool'] },
  { name: 'Fitness', icon: '💪', keywords: ['fitness', 'gym', 'workout', 'exercise', 'training'] },
  { name: 'Cooking', icon: '🍳', keywords: ['cooking', 'baking', 'culinary', 'food'] },
  { name: 'Gaming', icon: '🎮', keywords: ['gaming', 'games', 'video games', 'esports'] },
  { name: 'Writing', icon: '✍️', keywords: ['writing', 'blogging', 'journaling'] },
  { name: 'Meditation', icon: '🧘', keywords: ['meditation', 'mindfulness', 'yoga'] },
  { name: 'Art', icon: '🎨', keywords: ['art', 'painting', 'drawing', 'sketching'] },
  { name: 'Gardening', icon: '🌱', keywords: ['gardening', 'plants', 'garden'] },
  { name: 'Hiking', icon: '🥾', keywords: ['hiking', 'trekking', 'walking', 'outdoors'] },
  { name: 'Cycling', icon: '🚴', keywords: ['cycling', 'biking', 'bicycle'] },
  { name: 'Dancing', icon: '💃', keywords: ['dancing', 'dance', 'ballet'] },
  { name: 'Movies', icon: '🎬', keywords: ['movies', 'films', 'cinema'] },
  { name: 'Sports', icon: '⚽', keywords: ['sports', 'football', 'soccer', 'basketball'] },
  { name: 'Volunteering', icon: '🤝', keywords: ['volunteering', 'volunteer', 'charity'] },
  { name: 'Tech', icon: '💻', keywords: ['technology', 'coding', 'programming', 'tech'] },
  { name: 'Pets', icon: '🐾', keywords: ['pets', 'animals', 'dogs', 'cats'] }
]

export default function HobbyIconSelector({ onSelect, initialHobbies = [] }: HobbyIconSelectorProps) {
  const [selectedHobbies, setSelectedHobbies] = useState<{ name: string; icon: string }[]>(initialHobbies)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredIcons = AVAILABLE_HOBBY_ICONS.filter(hobby =>
    hobby.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hobby.keywords.some(kw => kw.includes(searchTerm.toLowerCase()))
  )

  const toggleHobby = (hobby: { name: string; icon: string }) => {
    const isSelected = selectedHobbies.some(h => h.name === hobby.name)
    
    if (isSelected) {
      setSelectedHobbies(selectedHobbies.filter(h => h.name !== hobby.name))
    } else {
      setSelectedHobbies([...selectedHobbies, { name: hobby.name, icon: hobby.icon }])
    }
  }

  const handleSave = () => {
    onSelect(selectedHobbies)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Select Your Hobbies</h3>
        <p className="text-sm text-gray-600">{selectedHobbies.length} selected</p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search hobbies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />

      {/* Selected Hobbies Preview */}
      {selectedHobbies.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm font-semibold text-purple-900 mb-2">Selected:</p>
          <div className="flex flex-wrap gap-2">
            {selectedHobbies.map((hobby) => (
              <div
                key={hobby.name}
                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-purple-300"
              >
                <span className="text-lg">{hobby.icon}</span>
                <span className="text-sm font-medium text-gray-700">{hobby.name}</span>
                <button
                  onClick={() => toggleHobby(hobby)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Icons Grid */}
      <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto mb-4">
        {filteredIcons.map((hobby) => {
          const isSelected = selectedHobbies.some(h => h.name === hobby.name)
          
          return (
            <button
              key={hobby.name}
              onClick={() => toggleHobby(hobby)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-1 right-1 bg-purple-500 text-white rounded-full p-0.5">
                  <Check className="w-3 h-3" />
                </div>
              )}
              <span className="text-3xl">{hobby.icon}</span>
              <span className="text-xs font-medium text-gray-700 text-center">{hobby.name}</span>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
        >
          Save Hobbies ({selectedHobbies.length})
        </button>
        <button
          onClick={() => setSelectedHobbies([])}
          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
        >
          Clear All
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        💡 Tip: Select hobbies that showcase your personality and interests to recruiters
      </p>
    </div>
  )
}
