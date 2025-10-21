/**
 * Advanced CV Templates with Icons, Two-Column Layouts, and Visual Elements
 * Inspired by modern, standout CV designs
 */

export const advancedTemplateStyles = {
  creative_modern: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      line-height: 1.4;
      color: #2d3748;
      background: #fff;
      padding: 0;
      margin: 0;
    }
    
    /* Decorative circles background */
    .decorative-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 200px;
      overflow: hidden;
      z-index: 0;
    }
    
    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.8;
    }
    
    .circle-1 { width: 150px; height: 150px; background: #f6ad55; top: -50px; right: 50px; }
    .circle-2 { width: 100px; height: 100px; background: #4a5568; top: 20px; right: -30px; }
    .circle-3 { width: 80px; height: 80px; background: #cbd5e0; top: -20px; right: 200px; }
    .circle-4 { width: 60px; height: 60px; background: #2d3748; bottom: 50px; left: -20px; }
    
    /* Header Section */
    .header {
      position: relative;
      padding: 25px 30px 20px;
      z-index: 1;
    }
    
    .name {
      font-size: 2.2em;
      font-weight: 800;
      color: #2d3748;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 0.85em;
      color: #4a5568;
      margin-bottom: 5px;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .contact-item strong {
      font-weight: 600;
      color: #2d3748;
    }
    
    /* Two Column Layout */
    .content-wrapper {
      display: flex;
      gap: 20px;
      padding: 0 30px 30px;
    }
    
    .left-column {
      flex: 1;
      min-width: 0;
    }
    
    .right-column {
      flex: 1;
      min-width: 0;
    }
    
    /* Section Styling */
    .section {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }
    
    .left-column .section:first-child,
    .right-column .section:first-child {
      margin-top: 10px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
      color: #fff;
      padding: 8px 15px;
      border-radius: 20px;
      margin-bottom: 10px;
      font-size: 1em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .section-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }
    
    .section-content {
      padding: 0 5px;
      white-space: pre-wrap;
      line-height: 1.5;
    }
    
    /* Work Experience Entries */
    .experience-entry {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .experience-entry:last-child {
      border-bottom: none;
    }
    
    .job-title {
      font-weight: 700;
      color: #2d3748;
      font-size: 1.05em;
      margin-bottom: 3px;
    }
    
    .company {
      font-weight: 600;
      color: #f6ad55;
      font-size: 0.95em;
      margin-bottom: 2px;
    }
    
    .date-location {
      font-size: 0.85em;
      color: #718096;
      margin-bottom: 6px;
    }
    
    /* Hobbies Icons Grid */
    .hobbies-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      padding: 10px 0;
    }
    
    .hobby-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 6px;
    }
    
    .hobby-icon {
      width: 32px;
      height: 32px;
      stroke: #2d3748;
      stroke-width: 1.5;
    }
    
    .hobby-label {
      font-size: 0.8em;
      color: #4a5568;
      font-weight: 500;
    }
    
    /* Skills List */
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 5px 0;
    }
    
    .skill-tag {
      background: #edf2f7;
      color: #2d3748;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.85em;
      font-weight: 500;
    }
    
    /* Education Entries */
    .education-entry {
      margin-bottom: 10px;
    }
    
    .degree {
      font-weight: 700;
      color: #2d3748;
      font-size: 1em;
      margin-bottom: 2px;
    }
    
    .institution {
      font-weight: 600;
      color: #718096;
      font-size: 0.9em;
    }
    
    /* Print Optimization */
    @media print {
      body { padding: 0; }
      /* Keep decorative background visible in print */
      .content-wrapper { gap: 15px; padding: 0 25px 25px; }
      .section { margin-bottom: 15px; }
    }
  `,
  
  professional_columns: `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Roboto', sans-serif;
      font-size: 9px;
      line-height: 1.4;
      color: #1a202c;
      background: #f7fafc;
    }
    
    /* Header with colored bar */
    .header {
      background: linear-gradient(135deg, #2c5282 0%, #2b6cb0 100%);
      color: #fff;
      padding: 25px 30px;
    }
    
    .name {
      font-size: 2.4em;
      font-weight: 700;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 0.9em;
      opacity: 0.95;
    }
    
    /* Sidebar + Main Content Layout */
    .content-wrapper {
      display: flex;
      gap: 0;
    }
    
    .sidebar {
      width: 35%;
      background: #edf2f7;
      padding: 25px 20px;
    }
    
    .main-content {
      flex: 1;
      padding: 25px 30px;
      background: #fff;
    }
    
    /* Section Headers */
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .main-content .section:first-child {
      margin-top: 15px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #2c5282;
      padding: 8px 0;
      margin-bottom: 12px;
      font-size: 1.1em;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 3px solid #2c5282;
    }
    
    .sidebar .section-header {
      border-bottom: 2px solid #2c5282;
      font-size: 1em;
    }
    
    .section-icon {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      stroke-width: 2;
    }
    
    /* Skills with progress bars */
    .skill-item {
      margin-bottom: 10px;
    }
    
    .skill-name {
      font-weight: 600;
      margin-bottom: 4px;
      color: #2d3748;
    }
    
    .skill-bar {
      height: 6px;
      background: #cbd5e0;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .skill-level {
      height: 100%;
      background: linear-gradient(90deg, #2c5282, #4299e1);
      border-radius: 3px;
    }
    
    /* Hobbies with icons */
    .hobbies-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .hobby-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #fff;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 0.85em;
      font-weight: 500;
      color: #2d3748;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .hobby-icon {
      width: 14px;
      height: 14px;
      stroke: #2c5282;
      stroke-width: 2;
    }
    
    @media print {
      body { background: #fff; }
      .sidebar { background: #f7fafc; }
    }
  `
}

/**
 * Icon mappings for sections
 */
export const sectionIcons: Record<string, string> = {
  profile: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  summary: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  experience: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  work_experience: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  education: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  skills: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  key_skills: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  hobbies: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  interests: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  certifications: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  licenses: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  languages: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  strengths: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 9l6 6 6-6"/></svg>',
  groups: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  additional_information: '<svg class="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
}

/**
 * Hobby/Interest icons mapping
 */
export const hobbyIcons: Record<string, string> = {
  travel: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
  reading: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  photography: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  music: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  swimming: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 15s1.5-1 4-1 4 1 6 1 4-1 6-1 4 1 4 1M2 19s1.5-1 4-1 4 1 6 1 4-1 6-1 4 1 4 1"/><circle cx="7" cy="8" r="3"/></svg>',
  fitness: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/><circle cx="12" cy="12" r="10"/></svg>',
  cooking: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>',
  gaming: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>',
  writing: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  meditation: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  art: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  gardening: '<svg class="hobby-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>'
}

/**
 * Detect hobbies/interests from text and return matching icons
 */
export function detectHobbies(text: string): Array<{ name: string; icon: string }> {
  const lowerText = text.toLowerCase()
  const detected: Array<{ name: string; icon: string }> = []
  
  const hobbyKeywords: Record<string, string[]> = {
    travel: ['travel', 'exploring', 'distant lands', 'countries', 'world'],
    reading: ['reading', 'books', 'literature', 'novel'],
    photography: ['photography', 'photos', 'camera', 'capturing'],
    music: ['music', 'musical', 'singing', 'instrument'],
    swimming: ['swimming', 'swim'],
    fitness: ['fitness', 'gym', 'exercise', 'workout'],
    cooking: ['cooking', 'culinary', 'food', 'recipes'],
    gaming: ['gaming', 'games', 'video games'],
    writing: ['writing', 'journaling', 'journal', 'blog'],
    meditation: ['meditation', 'mindfulness', 'yoga', 'zen'],
    art: ['art', 'painting', 'drawing', 'creative'],
    gardening: ['gardening', 'plants', 'garden']
  }
  
  for (const [hobby, keywords] of Object.entries(hobbyKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      detected.push({
        name: hobby.charAt(0).toUpperCase() + hobby.slice(1),
        icon: hobbyIcons[hobby]
      })
    }
  }
  
  return detected.slice(0, 9) // Max 9 hobbies for 3x3 grid
}

/**
 * Parse skills from text into array
 */
export function parseSkills(text: string): string[] {
  // Split by common delimiters
  const skills = text
    .split(/[,•\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 50) // Reasonable skill length
  
  return skills.slice(0, 15) // Max 15 skills
}

/**
 * Helper to escape HTML
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Helper to get section content as string
 */
function getSectionContent(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === 'string') return item
      if (typeof item === 'object') {
        return Object.values(item).filter(v => typeof v === 'string').join('\n')
      }
      return ''
    }).join('\n\n')
  }
  if (typeof content === 'object') {
    return Object.values(content).filter(v => typeof v === 'string').join('\n')
  }
  return String(content)
}

/**
 * Generate HTML for Creative Modern template
 */
export function generateCreativeModernHTML(sections: any[], contactInfo: any): string {
  const nameSection = sections.find(s => s.type === 'name')
  const profileSection = sections.find(s => s.type === 'profile' || s.type === 'summary' || s.type === 'professional_summary')
  const experienceSection = sections.find(s => s.type === 'experience' || s.type === 'work_experience')
  const educationSection = sections.find(s => s.type === 'education')
  const skillsSection = sections.find(s => s.type === 'skills' || s.type === 'key_skills')
  const hobbiesSection = sections.find(s => s.type === 'hobbies' || s.type === 'interests')
  
  // Check if hobbies section has custom icons (array of {name, icon} objects)
  let hobbies = []
  if (hobbiesSection) {
    const content = hobbiesSection.content
    // If content is already an array of {name, icon} objects, use it
    if (Array.isArray(content) && content.length > 0 && content[0].icon) {
      hobbies = content
    } else {
      // Otherwise, auto-detect from text
      hobbies = detectHobbies(getSectionContent(content))
    }
  }
  
  const skills = skillsSection ? parseSkills(getSectionContent(skillsSection.content)) : []
  
  // Extract contact details properly
  const contactItems = []
  if (contactInfo) {
    if (contactInfo.email) contactItems.push({ label: 'Email', value: contactInfo.email })
    if (contactInfo.phone) contactItems.push({ label: 'Phone', value: contactInfo.phone })
    if (contactInfo.location || contactInfo.address) contactItems.push({ label: 'Location', value: contactInfo.location || contactInfo.address })
    if (contactInfo.linkedin) contactItems.push({ label: 'LinkedIn', value: contactInfo.linkedin })
  }
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>CV</title>
        <style>${advancedTemplateStyles.creative_modern}</style>
      </head>
      <body>
        <!-- Decorative Background -->
        <div class="decorative-bg">
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
          <div class="circle circle-4"></div>
        </div>
        
        <!-- Header -->
        <div class="header">
          <div class="name">${nameSection ? escapeHtml(getSectionContent(nameSection.content)) : 'Name'}</div>
          <div class="contact-info">
            ${contactItems.map(item => `
              <div class="contact-item">
                <strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Two Column Content -->
        <div class="content-wrapper">
          <!-- Left Column -->
          <div class="left-column">
            ${profileSection ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.profile}
                  Profile
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(profileSection.content))}</div>
              </div>
            ` : ''}
            
            ${educationSection ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.education}
                  Education
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(educationSection.content))}</div>
              </div>
            ` : ''}
            
            ${skills.length > 0 ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.skills}
                  Skills
                </div>
                <div class="skills-list">
                  ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${hobbies.length > 0 ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.hobbies}
                  Hobbies
                </div>
                <div class="hobbies-grid">
                  ${hobbies.map(hobby => `
                    <div class="hobby-item">
                      ${hobby.icon}
                      <span class="hobby-label">${escapeHtml(hobby.name)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Right Column -->
          <div class="right-column">
            ${experienceSection ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.experience}
                  Work Experience
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(experienceSection.content))}</div>
              </div>
            ` : ''}
            
            ${sections.filter(s => 
              !['name', 'contact', 'profile', 'summary', 'experience', 'work_experience', 'education', 'skills', 'key_skills', 'hobbies', 'interests'].includes(s.type)
            ).map(section => `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons[section.type] || sectionIcons.additional_information}
                  ${escapeHtml(section.type.replace(/_/g, ' ').toUpperCase())}
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(section.content))}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Generate HTML for Professional Columns template
 */
export function generateProfessionalColumnsHTML(sections: any[], contactInfo: any): string {
  const nameSection = sections.find(s => s.type === 'name')
  const profileSection = sections.find(s => s.type === 'profile' || s.type === 'summary' || s.type === 'professional_summary')
  const experienceSection = sections.find(s => s.type === 'experience' || s.type === 'work_experience')
  const educationSection = sections.find(s => s.type === 'education')
  const skillsSection = sections.find(s => s.type === 'skills' || s.type === 'key_skills')
  const hobbiesSection = sections.find(s => s.type === 'hobbies' || s.type === 'interests')
  const certificationsSection = sections.find(s => s.type === 'certifications' || s.type === 'licenses')
  
  // Check if hobbies section has custom icons (array of {name, icon} objects)
  let hobbies = []
  if (hobbiesSection) {
    const content = hobbiesSection.content
    // If content is already an array of {name, icon} objects, use it
    if (Array.isArray(content) && content.length > 0 && content[0].icon) {
      hobbies = content
    } else {
      // Otherwise, auto-detect from text
      hobbies = detectHobbies(getSectionContent(content))
    }
  }
  
  const skills = skillsSection ? parseSkills(getSectionContent(skillsSection.content)) : []
  
  // Extract contact details properly
  let contactDetails = ''
  if (contactInfo) {
    const details = []
    if (contactInfo.email) details.push(contactInfo.email)
    if (contactInfo.phone) details.push(contactInfo.phone)
    if (contactInfo.location || contactInfo.address) details.push(contactInfo.location || contactInfo.address)
    if (contactInfo.linkedin) details.push(contactInfo.linkedin)
    contactDetails = details.join(' • ')
  }
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>CV</title>
        <style>${advancedTemplateStyles.professional_columns}</style>
      </head>
      <body>
        <!-- Header -->
        <div class="header">
          <div class="name">${nameSection ? escapeHtml(getSectionContent(nameSection.content)) : 'Name'}</div>
          <div class="contact-info">${escapeHtml(contactDetails)}</div>
        </div>
        
        <!-- Sidebar + Main Content -->
        <div class="content-wrapper">
          <!-- Sidebar -->
          <div class="sidebar">
            ${skills.length > 0 ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.skills}
                  Skills
                </div>
                <div class="skills-list">
                  ${skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                </div>
              </div>
            ` : ''}
            
            ${educationSection ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.education}
                  Education
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(educationSection.content))}</div>
              </div>
            ` : ''}
            
            ${certificationsSection ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.certifications}
                  Certifications
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(certificationsSection.content))}</div>
              </div>
            ` : ''}
            
            ${hobbies.length > 0 ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.hobbies}
                  Hobbies
                </div>
                <div class="hobbies-list">
                  ${hobbies.map(hobby => `
                    <div class="hobby-badge">
                      ${hobby.icon}
                      <span>${escapeHtml(hobby.name)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          
          <!-- Main Content -->
          <div class="main-content">
            ${profileSection ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.profile}
                  Professional Summary
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(profileSection.content))}</div>
              </div>
            ` : ''}
            
            ${experienceSection ? `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons.experience}
                  Work Experience
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(experienceSection.content))}</div>
              </div>
            ` : ''}
            
            ${sections.filter(s => 
              !['name', 'contact', 'profile', 'summary', 'professional_summary', 'experience', 'work_experience', 'education', 'skills', 'key_skills', 'hobbies', 'interests', 'certifications', 'licenses'].includes(s.type)
            ).map(section => `
              <div class="section">
                <div class="section-header">
                  ${sectionIcons[section.type] || sectionIcons.additional_information}
                  ${escapeHtml(section.type.replace(/_/g, ' ').toUpperCase())}
                </div>
                <div class="section-content">${escapeHtml(getSectionContent(section.content))}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
    </html>
  `
}
