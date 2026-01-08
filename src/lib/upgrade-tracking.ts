// Utility for tracking upgrade prompt triggers and user behavior

const STORAGE_KEY = 'cv_adapter_upgrade_tracking'

interface UpgradeTracking {
  pageViews: number
  lastVisit: string
  visitCount: number
  generationCount: number
  promptsShown: string[]
  promptsDismissed: string[]
}

export function getUpgradeTracking(): UpgradeTracking {
  if (typeof window === 'undefined') {
    return {
      pageViews: 0,
      lastVisit: new Date().toISOString(),
      visitCount: 0,
      generationCount: 0,
      promptsShown: [],
      promptsDismissed: []
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    const initial: UpgradeTracking = {
      pageViews: 0,
      lastVisit: new Date().toISOString(),
      visitCount: 1,
      generationCount: 0,
      promptsShown: [],
      promptsDismissed: []
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }

  return JSON.parse(stored)
}

export function updateUpgradeTracking(updates: Partial<UpgradeTracking>) {
  if (typeof window === 'undefined') return

  const current = getUpgradeTracking()
  const updated = { ...current, ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function incrementPageViews() {
  const current = getUpgradeTracking()
  updateUpgradeTracking({ pageViews: current.pageViews + 1 })
}

export function incrementGenerationCount() {
  const current = getUpgradeTracking()
  updateUpgradeTracking({ generationCount: current.generationCount + 1 })
}

export function trackPromptShown(trigger: string) {
  const current = getUpgradeTracking()
  if (!current.promptsShown.includes(trigger)) {
    updateUpgradeTracking({ 
      promptsShown: [...current.promptsShown, trigger] 
    })
  }
}

export function trackPromptDismissed(trigger: string) {
  const current = getUpgradeTracking()
  if (!current.promptsDismissed.includes(trigger)) {
    updateUpgradeTracking({ 
      promptsDismissed: [...current.promptsDismissed, trigger] 
    })
  }
}

export function checkReturnVisit(): boolean {
  const current = getUpgradeTracking()
  const lastVisit = new Date(current.lastVisit)
  const now = new Date()
  const hoursSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60)
  
  // If more than 24 hours since last visit, it's a return visit
  if (hoursSinceLastVisit > 24) {
    updateUpgradeTracking({ 
      visitCount: current.visitCount + 1,
      lastVisit: now.toISOString()
    })
    return true
  }
  
  return false
}

export function shouldShowUpgradePrompt(trigger: string): boolean {
  const current = getUpgradeTracking()
  
  // Don't show if already shown this trigger
  if (current.promptsShown.includes(trigger)) {
    return false
  }
  
  // Specific trigger logic
  switch (trigger) {
    case 'before_generation':
      // Show on first generation attempt
      return current.generationCount === 0
      
    case 'after_preview':
      // Show after first generation
      return current.generationCount === 1
      
    case 'before_download':
      // Show when trying to download
      return true
      
    case 'after_views':
      // Show after 3+ page views
      return current.pageViews >= 3
      
    case 'return_visit':
      // Show on 2nd+ visit
      return current.visitCount >= 2
      
    default:
      return false
  }
}

export function resetUpgradeTracking() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
