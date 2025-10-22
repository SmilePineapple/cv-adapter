/**
 * Modern CV Templates with Color Customization
 * Based on professional CV designs
 */

export interface ColorScheme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  text: string
  background: string
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'mint',
    name: 'Mint Green',
    primary: '#4ECDC4',
    secondary: '#95E1D3',
    accent: '#F38181',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  {
    id: 'coral',
    name: 'Coral Pink',
    primary: '#FFB6B9',
    secondary: '#FEC8D8',
    accent: '#957DAD',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  {
    id: 'peach',
    name: 'Peach',
    primary: '#FFDAB9',
    secondary: '#FFE4B5',
    accent: '#D4A574',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  {
    id: 'sage',
    name: 'Sage Green',
    primary: '#A8DADC',
    secondary: '#C8E6C9',
    accent: '#457B9D',
    text: '#1D3557',
    background: '#F1FAEE'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    primary: '#B8A9C9',
    secondary: '#D4C5E2',
    accent: '#622569',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    primary: '#4A90E2',
    secondary: '#7FB3D5',
    accent: '#2E5266',
    text: '#1A1A1A',
    background: '#FFFFFF'
  },
  {
    id: 'sunset',
    name: 'Sunset Orange',
    primary: '#FF9A76',
    secondary: '#FFCDB2',
    accent: '#E63946',
    text: '#2C3E50',
    background: '#FFFFFF'
  },
  {
    id: 'forest',
    name: 'Forest Green',
    primary: '#52796F',
    secondary: '#84A98C',
    accent: '#2F3E46',
    text: '#1A1A1A',
    background: '#CAD2C5'
  },
  {
    id: 'royal',
    name: 'Royal Purple',
    primary: '#6A4C93',
    secondary: '#8B7AB8',
    accent: '#C77DFF',
    text: '#1A1A1A',
    background: '#FFFFFF'
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    primary: '#2C3E50',
    secondary: '#34495E',
    accent: '#E74C3C',
    text: '#1A1A1A',
    background: '#ECF0F1'
  },
  {
    id: 'teal',
    name: 'Teal',
    primary: '#008B8B',
    secondary: '#20B2AA',
    accent: '#FF6347',
    text: '#1A1A1A',
    background: '#FFFFFF'
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    primary: '#800020',
    secondary: '#A0522D',
    accent: '#FFD700',
    text: '#1A1A1A',
    background: '#F5F5DC'
  }
]

export interface ModernTemplate {
  id: string
  name: string
  description: string
  category: 'professional' | 'creative' | 'minimal' | 'modern'
  features: string[]
  bestFor: string[]
  layout: 'single-column' | 'two-column' | 'sidebar' | 'header-sidebar'
  supportsColorCustomization: boolean
}

export const MODERN_TEMPLATES: ModernTemplate[] = [
  // Image 1 Templates
  {
    id: 'professional-circle',
    name: 'Professional Circle',
    description: 'Clean two-column layout with circular profile photo and icon-based sections',
    category: 'professional',
    features: ['Circular profile photo', 'Icon-based sections', 'Two-column layout', 'Skill bars', 'Timeline format'],
    bestFor: ['Business professionals', 'Managers', 'Consultants'],
    layout: 'two-column',
    supportsColorCustomization: true
  },
  {
    id: 'modern-coral',
    name: 'Modern Coral',
    description: 'Soft coral-toned design with elegant typography and visual hierarchy',
    category: 'modern',
    features: ['Soft color palette', 'Clean typography', 'Skill progress bars', 'Language indicators', 'Icon grid'],
    bestFor: ['Creative professionals', 'Marketing', 'Communications'],
    layout: 'two-column',
    supportsColorCustomization: true
  },
  {
    id: 'minimal-yellow',
    name: 'Minimal Yellow',
    description: 'Bold minimalist design with yellow accent and strong visual contrast',
    category: 'minimal',
    features: ['Bold header', 'Circular progress indicators', 'Tag-based skills', 'Clean sections', 'Icon strengths'],
    bestFor: ['Designers', 'Developers', 'Creative roles'],
    layout: 'single-column',
    supportsColorCustomization: true
  },

  // Image 2 Templates
  {
    id: 'classic-beige',
    name: 'Classic Beige',
    description: 'Warm beige tones with traditional layout and professional styling',
    category: 'professional',
    features: ['Warm color scheme', 'Traditional layout', 'Skill sliders', 'Timeline bullets', 'Professional typography'],
    bestFor: ['Legal professionals', 'Finance', 'Traditional industries'],
    layout: 'single-column',
    supportsColorCustomization: true
  },
  {
    id: 'executive-tan',
    name: 'Executive Tan',
    description: 'Sophisticated tan design with icon-based hobbies and strength indicators',
    category: 'professional',
    features: ['Executive styling', 'Icon hobbies', 'Strength tags', 'Clean sections', 'Professional photo'],
    bestFor: ['Senior executives', 'Directors', 'C-level'],
    layout: 'single-column',
    supportsColorCustomization: true
  },
  {
    id: 'modern-sidebar',
    name: 'Modern Sidebar',
    description: 'Contemporary sidebar design with language progress bars and clean layout',
    category: 'modern',
    features: ['Sidebar layout', 'Language bars', 'Certificate badges', 'Clean typography', 'Icon sections'],
    bestFor: ['Tech professionals', 'Engineers', 'Analysts'],
    layout: 'sidebar',
    supportsColorCustomization: true
  },

  // Image 3 Templates
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    description: 'Ultra-minimal grayscale design with pill-shaped sections and clean lines',
    category: 'minimal',
    features: ['Pill-shaped sections', 'Minimal styling', 'Skill bars', 'Circular indicators', 'Clean references'],
    bestFor: ['Architects', 'Minimalists', 'Modern professionals'],
    layout: 'single-column',
    supportsColorCustomization: true
  },
  {
    id: 'artistic-pattern',
    name: 'Artistic Pattern',
    description: 'Creative design with decorative pattern header and artistic flair',
    category: 'creative',
    features: ['Decorative patterns', 'Artistic header', 'Circular indicators', 'Tag skills', 'Icon languages'],
    bestFor: ['Artists', 'Designers', 'Creative directors'],
    layout: 'single-column',
    supportsColorCustomization: true
  },
  {
    id: 'warm-gradient',
    name: 'Warm Gradient',
    description: 'Warm peach-to-orange gradient with modern typography and icons',
    category: 'modern',
    features: ['Gradient header', 'Icon sections', 'Skill dots', 'Language flags', 'Interest icons'],
    bestFor: ['Marketing', 'Sales', 'Customer-facing roles'],
    layout: 'two-column',
    supportsColorCustomization: true
  },

  // Image 4 Templates
  {
    id: 'bold-cyan',
    name: 'Bold Cyan',
    description: 'Striking cyan sidebar with bold typography and modern icons',
    category: 'creative',
    features: ['Bold sidebar', 'Icon hobbies', 'Skill bars', 'Language flags', 'Award badges'],
    bestFor: ['Startups', 'Tech companies', 'Modern businesses'],
    layout: 'sidebar',
    supportsColorCustomization: true
  },
  {
    id: 'soft-green',
    name: 'Soft Green',
    description: 'Calming green tones with icon-based skills and clean layout',
    category: 'professional',
    features: ['Soft colors', 'Icon skills', 'Language flags', 'Strength tags', 'Clean sections'],
    bestFor: ['Healthcare', 'Education', 'Non-profits'],
    layout: 'two-column',
    supportsColorCustomization: true
  },
  {
    id: 'elegant-yellow',
    name: 'Elegant Yellow',
    description: 'Sophisticated yellow accents with decorative header and icon grid',
    category: 'creative',
    features: ['Decorative header', 'Icon grid', 'Award badges', 'Skill icons', 'Interest icons'],
    bestFor: ['Hospitality', 'Events', 'Customer service'],
    layout: 'header-sidebar',
    supportsColorCustomization: true
  }
]

// Helper function to get template by ID
export function getTemplateById(id: string): ModernTemplate | undefined {
  return MODERN_TEMPLATES.find(t => t.id === id)
}

// Helper function to get color scheme by ID
export function getColorSchemeById(id: string): ColorScheme | undefined {
  return COLOR_SCHEMES.find(c => c.id === id)
}

// Helper function to apply color scheme to CSS
export function applyColorScheme(scheme: ColorScheme): string {
  return `
    :root {
      --primary-color: ${scheme.primary};
      --secondary-color: ${scheme.secondary};
      --accent-color: ${scheme.accent};
      --text-color: ${scheme.text};
      --background-color: ${scheme.background};
    }
  `
}
