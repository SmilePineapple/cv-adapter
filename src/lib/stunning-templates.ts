/**
 * Stunning Professional CV Templates
 * Based on modern, professional CV designs with unique layouts
 */

import { CVSection } from '@/types/database'

interface TemplateData {
  name: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  experience: string
  education: string
  skills: string
  skillScores?: Array<{name: string, level: number}> | null
  languages: string
  hobbies: string | Array<{name: string, icon: string}>
  certifications: string
  photoUrl?: string
}

// Helper to extract skills as array
function extractSkills(skillsText: string): string[] {
  if (!skillsText) return []
  return skillsText.split(/[,\n•]/).map(s => s.trim()).filter(Boolean)
}

// Helper to extract languages
function extractLanguages(langText: string): Array<{name: string, level: number}> {
  if (!langText) return []
  const langs = langText.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
  return langs.map(lang => {
    const name = lang.split(/[-:]/)[0].trim()
    // Try to extract proficiency level from text
    const lowerLang = lang.toLowerCase()
    let level = 70 // default
    if (lowerLang.includes('native') || lowerLang.includes('fluent')) level = 100
    else if (lowerLang.includes('advanced') || lowerLang.includes('proficient')) level = 90
    else if (lowerLang.includes('intermediate')) level = 75
    else if (lowerLang.includes('basic') || lowerLang.includes('beginner')) level = 50
    
    return { name, level }
  })
}

// Helper to extract hobbies with icons
function extractHobbies(hobbiesData: string | Array<{name: string, icon: string}>): Array<{name: string, icon: string}> {
  // If already an array of hobby objects with icons, return it
  if (Array.isArray(hobbiesData) && hobbiesData.length > 0 && hobbiesData[0].icon) {
    return hobbiesData
  }
  
  // Otherwise parse from text
  const text = typeof hobbiesData === 'string' ? hobbiesData : ''
  if (!text) return []
  
  const hobbies = text.split(/[,\n]/).map(h => h.trim()).filter(Boolean)
  return hobbies.map(name => ({ name, icon: '⚪' })) // Default white circle
}

// Helper to get skill level from skill scores
function getSkillLevel(skillName: string, skillScores: Array<{name: string, level: number}> | null | undefined, defaultLevel: number): number {
  if (!skillScores || !Array.isArray(skillScores)) return defaultLevel
  
  // Try to find matching skill score
  const match = skillScores.find(score => {
    const scoreName = score.name?.toLowerCase().replace(/["\[\]]/g, '').trim()
    const searchName = skillName.toLowerCase().trim()
    return scoreName?.includes(searchName) || searchName?.includes(scoreName)
  })
  
  return match ? match.level : defaultLevel
}

/**
 * Template 1: Professional Metrics (Joanna Alvstrom Style)
 * Two-column with circular skill meters
 */
export function generateProfessionalMetrics(data: TemplateData): string {
  const skills = extractSkills(data.skills)
  const languages = extractLanguages(data.languages)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; color: #2C3E50; line-height: 1.6; }
    .container { max-width: 850px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 3px solid #2C3E50; padding-bottom: 20px; }
    .header-left h1 { font-size: 42px; font-weight: 300; margin-bottom: 5px; border-bottom: 2px solid #2C3E50; display: inline-block; padding-bottom: 5px; }
    .header-left h2 { font-size: 38px; font-weight: 700; margin-top: 5px; }
    .photo { width: 120px; height: 120px; border-radius: 8px; overflow: hidden; border: 3px solid #2C3E50; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .two-column { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; }
    .section-title::before { content: '+'; margin-right: 8px; font-size: 18px; }
    .contact-info { font-size: 11px; line-height: 1.8; }
    .contact-info div { display: flex; align-items: center; margin-bottom: 4px; }
    .contact-info svg { width: 12px; height: 12px; margin-right: 8px; }
    .experience-item { margin-bottom: 20px; }
    .experience-header { font-weight: 700; font-size: 12px; margin-bottom: 4px; }
    .experience-meta { font-size: 10px; color: #666; margin-bottom: 8px; }
    .experience-desc { font-size: 11px; line-height: 1.6; }
    .experience-desc ul { margin-left: 15px; margin-top: 5px; }
    .experience-desc li { margin-bottom: 3px; }
    .skill-meters { display: flex; justify-content: space-around; margin: 20px 0; }
    .skill-meter { text-align: center; }
    .circle { width: 80px; height: 80px; border-radius: 50%; border: 8px solid #E0E0E0; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; margin: 0 auto 8px; position: relative; }
    .circle-100 { border-color: #2C3E50; }
    .circle-80 { border-color: #5D6D7E; border-width: 6px; }
    .circle-90 { border-color: #34495E; border-width: 7px; }
    .skill-meter label { font-size: 11px; font-weight: 600; }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { padding: 6px 12px; border: 1px solid #2C3E50; font-size: 10px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-left">
        <h1>${data.name.split(' ')[0] || 'First'}</h1>
        <h2>${data.name.split(' ').slice(1).join(' ') || 'Last'}</h2>
      </div>
      <div class="photo">
        ${data.photoUrl 
          ? `<img src="${data.photoUrl}" alt="Profile" style="width:100%;height:100%;object-fit:cover;" />`
          : '<div style="width:100%;height:100%;background:#E0E0E0;display:flex;align-items:center;justify-content:center;font-size:40px;color:#999;">👤</div>'
        }
      </div>
    </div>
    
    <div class="two-column">
      <div class="main-content">
        <div class="section">
          <div class="section-title">Resume Summary</div>
          <p style="font-size: 11px; line-height: 1.6;">${data.summary || 'Professional summary goes here.'}</p>
        </div>
        
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${data.experience ? data.experience.split('\n\n').map(exp => {
            const lines = exp.split('\n')
            const titleLine = lines[0] || 'Position Title'
            const description = lines.slice(1).join('<br>') || ''
            return `
            <div class="experience-item">
              <div class="experience-header">${titleLine}</div>
              <div class="experience-desc">${description}</div>
            </div>
          `}).join('') : '<p style="font-size:11px;">No experience listed</p>'}
        </div>
      </div>
      
      <div class="sidebar">
        <div class="section">
          <div class="section-title">Personal Info</div>
          <div class="contact-info">
            <div>📞 ${data.phone || 'Phone'}</div>
            <div>📧 ${data.email || 'Email'}</div>
            <div>🌐 ${data.website || 'Website'}</div>
            <div>📍 ${data.location || 'Location'}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Education</div>
          <div style="font-size: 11px; line-height: 1.6;">${data.education || 'Education details'}</div>
        </div>
        
        ${languages.length > 0 ? `
        <div class="skill-meters">
          ${languages.slice(0, 3).map((lang, i) => `
            <div class="skill-meter">
              <div class="circle circle-${i === 0 ? '100' : i === 1 ? '80' : '90'}">
                ${lang.level}
              </div>
              <label>${lang.name}</label>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">Strengths</div>
          <div class="skill-tags">
            ${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Template 2: Teal Sidebar (Martha Vader Style)
 * Left sidebar with teal accent and icons
 */
export function generateTealSidebar(data: TemplateData): string {
  // If skillScores exist, use those skill names; otherwise extract from skills text
  let skills: string[] = []
  if (data.skillScores && Array.isArray(data.skillScores) && data.skillScores.length > 0) {
    console.log('🎯 Using skillScores for skill names:', data.skillScores.map(s => s.name))
    skills = data.skillScores.map(s => s.name)
  } else {
    console.log('📝 Using extracted skills from text')
    skills = extractSkills(data.skills)
  }
  console.log('✨ Final skills array:', skills)
  
  // Generate dynamic sidebar icons based on sections present
  const sectionIcons: Array<{icon: string, label: string}> = []
  
  // Always show profile icon first
  sectionIcons.push({ icon: '👤', label: 'Profile' })
  
  // Add icons for sections that have content
  if (data.experience) sectionIcons.push({ icon: '💼', label: 'Experience' })
  if (data.education) sectionIcons.push({ icon: '🎓', label: 'Education' })
  if (data.skills) sectionIcons.push({ icon: '⚡', label: 'Skills' })
  if (data.certifications) sectionIcons.push({ icon: '📜', label: 'Certifications' })
  if (data.languages) sectionIcons.push({ icon: '🌐', label: 'Languages' })
  if (data.hobbies) sectionIcons.push({ icon: '🎯', label: 'Hobbies' })
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; color: #2C3E50; line-height: 1.6; }
    .container { display: flex; min-height: 100vh; }
    .sidebar { width: 80px; background: #F5F5F5; padding: 30px 15px; display: flex; flex-direction: column; align-items: center; gap: 40px; }
    .sidebar-icon { width: 40px; height: 40px; background: #26A69A; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
    .main { flex: 1; padding: 50px 60px; }
    .photo { width: 100px; height: 100px; border-radius: 50%; overflow: hidden; margin: 0 auto 20px; border: 4px solid #26A69A; }
    .photo-placeholder { width: 100%; height: 100%; background: #E0E0E0; display: flex; align-items: center; justify-content: center; font-size: 40px; }
    .name { text-align: center; font-size: 32px; font-weight: 700; color: #26A69A; margin-bottom: 10px; }
    .title { text-align: center; font-size: 14px; color: #666; margin-bottom: 30px; }
    .summary { font-size: 12px; line-height: 1.8; text-align: center; margin-bottom: 40px; padding: 0 20px; }
    .section { margin-bottom: 35px; }
    .section-title { font-size: 16px; font-weight: 700; color: #26A69A; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #26A69A; }
    .info-row { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; }
    .info-label { font-weight: 700; }
    .experience-item { margin-bottom: 25px; }
    .exp-title { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
    .exp-meta { font-size: 11px; color: #666; margin-bottom: 8px; }
    .exp-desc { font-size: 11px; line-height: 1.7; }
    .exp-desc ul { margin-left: 15px; margin-top: 5px; }
    .skill-bars { margin-top: 15px; }
    .skill-bar { margin-bottom: 12px; }
    .skill-name { font-size: 11px; font-weight: 600; margin-bottom: 4px; }
    .skill-progress { height: 6px; background: #E0E0E0; border-radius: 3px; overflow: hidden; }
    .skill-fill { height: 100%; background: #26A69A; }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      ${sectionIcons.map(item => `<div class="sidebar-icon" title="${item.label}">${item.icon}</div>`).join('\n      ')}
    </div>
    
    <div class="main">
      <div class="photo">
        ${data.photoUrl 
          ? `<img src="${data.photoUrl}" alt="Profile" style="width:100%;height:100%;object-fit:cover;" />`
          : '<div class="photo-placeholder">👤</div>'
        }
      </div>
      
      <h1 class="name">${data.name}</h1>
      <div class="title">Professional Profile</div>
      <div class="summary">${data.summary || 'Performance-driven professional with proven track record.'}</div>
      
      <div class="section">
        <div class="section-title">Personal Info</div>
        ${data.phone ? `<div class="info-row"><span class="info-label">Phone:</span><span>${data.phone}</span></div>` : ''}
        ${data.email ? `<div class="info-row"><span class="info-label">Email:</span><span>${data.email}</span></div>` : ''}
        ${data.location ? `<div class="info-row"><span class="info-label">Location:</span><span>${data.location}</span></div>` : ''}
        ${data.website ? `<div class="info-row"><span class="info-label">Web:</span><span>${data.website}</span></div>` : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Work Experience</div>
        ${data.experience ? data.experience.split('\n\n').map(exp => {
          const lines = exp.split('\n')
          const titleLine = lines[0] || ''
          const description = lines.slice(1).join('<br>') || ''
          return `
          <div class="experience-item">
            <div class="exp-title">${titleLine}</div>
            <div class="exp-desc">${description}</div>
          </div>
        `}).join('') : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Education</div>
        <div style="font-size: 12px; line-height: 1.7;">${data.education}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skill-bars">
          ${skills.map((skill, i) => {
            const level = getSkillLevel(skill, data.skillScores, 95 - i * 5)
            return `
            <div class="skill-bar">
              <div class="skill-name">${skill}</div>
              <div class="skill-progress">
                <div class="skill-fill" style="width: ${level}%"></div>
              </div>
            </div>
          `}).join('')}
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Template 3: Soft Header (Ella Elmer Style)
 * Colored header blocks with skill progress bars
 */
export function generateSoftHeader(data: TemplateData): string {
  const skills = extractSkills(data.skills)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; color: #2C3E50; line-height: 1.6; }
    .header { display: flex; background: linear-gradient(135deg, #FFE5E5 0%, #E5F3FF 100%); padding: 40px 60px; align-items: center; justify-content: space-between; }
    .header-left h1 { font-size: 36px; font-weight: 700; margin-bottom: 5px; }
    .header-left .subtitle { font-size: 14px; color: #666; }
    .header-left .contact { font-size: 11px; margin-top: 10px; line-height: 1.8; }
    .photo { width: 110px; height: 110px; border-radius: 8px; overflow: hidden; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .photo-placeholder { width: 100%; height: 100%; background: #E0E0E0; display: flex; align-items: center; justify-content: center; font-size: 40px; }
    .container { padding: 40px 60px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 14px; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; }
    .section-title::before { content: '▲'; margin-right: 8px; font-size: 12px; }
    .summary { font-size: 12px; line-height: 1.8; margin-bottom: 25px; }
    .two-column { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; }
    .experience-item { margin-bottom: 20px; }
    .exp-title { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
    .exp-meta { font-size: 11px; color: #666; margin-bottom: 8px; }
    .exp-desc { font-size: 11px; line-height: 1.7; }
    .skill-bars { margin-top: 15px; }
    .skill-bar { margin-bottom: 15px; }
    .skill-name { font-size: 11px; font-weight: 600; margin-bottom: 6px; display: flex; justify-content: space-between; }
    .skill-progress { height: 8px; background: #F0F0F0; border-radius: 4px; overflow: hidden; }
    .skill-fill { height: 100%; background: linear-gradient(90deg, #FFB6C1 0%, #87CEEB 100%); }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>${data.name}</h1>
      <div class="subtitle">Professional Profile</div>
      <div class="contact">
        <div>Address: ${data.location || '123 Street, City'}</div>
        <div>Phone: ${data.phone}</div>
        <div>Email: ${data.email}</div>
        <div>Web: ${data.website}</div>
      </div>
    </div>
    <div class="photo">
      ${data.photoUrl 
        ? `<img src="${data.photoUrl}" alt="Profile" style="width:100%;height:100%;object-fit:cover;" />`
        : '<div class="photo-placeholder">👤</div>'
      }
    </div>
  </div>
  
  <div class="container">
    <div class="section">
      <div class="section-title">Resume Summary</div>
      <div class="summary">${data.summary || 'Detail-oriented professional with proven track record.'}</div>
    </div>
    
    <div class="two-column">
      <div class="main">
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${data.experience ? data.experience.split('\n\n').map(exp => {
            const lines = exp.split('\n')
            const titleLine = lines[0] || ''
            const description = lines.slice(1).join('<br>') || ''
            return `
            <div class="experience-item">
              <div class="exp-title">${titleLine}</div>
              <div class="exp-desc">${description}</div>
            </div>
          `}).join('') : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Education</div>
          <div style="font-size: 12px; line-height: 1.7;">${data.education}</div>
        </div>
      </div>
      
      <div class="sidebar">
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skill-bars">
            ${skills.map((skill, i) => `
              <div class="skill-bar">
                <div class="skill-name">
                  <span>${skill}</span>
                  <span>${95 - i * 5}%</span>
                </div>
                <div class="skill-progress">
                  <div class="skill-fill" style="width: ${95 - i * 5}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Template 4: Artistic Header (Themis Bear Style)
 * Decorative pattern header with pink accent
 */
export function generateArtisticHeader(data: TemplateData): string {
  const skills = extractSkills(data.skills)
  const languages = extractLanguages(data.languages)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; color: #2C3E50; line-height: 1.6; }
    .decorative-header { height: 120px; background: white; border-bottom: 2px solid #FFB6D9; position: relative; overflow: hidden; }
    .decorative-header svg { width: 100%; height: 100%; }
    .name-section { text-align: center; padding: 30px 60px 20px; }
    .name { font-size: 32px; font-weight: 300; color: #FFB6D9; margin-bottom: 15px; }
    .summary { font-size: 12px; line-height: 1.8; max-width: 800px; margin: 0 auto 30px; text-align: center; }
    .container { padding: 0 60px 40px; }
    .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
    .section { margin-bottom: 25px; }
    .section-title { font-size: 13px; font-weight: 700; color: #FFB6D9; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #FFB6D9; }
    .experience-item { margin-bottom: 18px; }
    .exp-title { font-weight: 700; font-size: 12px; margin-bottom: 3px; }
    .exp-meta { font-size: 10px; color: #666; margin-bottom: 6px; }
    .exp-desc { font-size: 11px; line-height: 1.6; }
    .skill-circles { display: flex; justify-content: space-around; margin: 20px 0; }
    .skill-circle { text-align: center; }
    .circle { width: 70px; height: 70px; border-radius: 50%; border: 6px solid #FFB6D9; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; margin: 0 auto 8px; color: #FFB6D9; }
    .circle-label { font-size: 10px; font-weight: 600; }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .skill-tag { padding: 6px 12px; background: #FFF0F5; color: #FFB6D9; font-size: 10px; font-weight: 600; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="decorative-header">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z" fill="#FFE5F0" opacity="0.3"/>
      <path d="M0,80 Q200,40 400,80 T800,80 T1200,80 L1200,120 L0,120 Z" fill="#FFB6D9" opacity="0.2"/>
      <circle cx="100" cy="30" r="3" fill="#FFB6D9" opacity="0.4"/>
      <circle cx="300" cy="50" r="4" fill="#FFB6D9" opacity="0.3"/>
      <circle cx="500" cy="25" r="3" fill="#FFB6D9" opacity="0.5"/>
      <circle cx="700" cy="45" r="4" fill="#FFB6D9" opacity="0.3"/>
      <circle cx="900" cy="35" r="3" fill="#FFB6D9" opacity="0.4"/>
      <circle cx="1100" cy="55" r="4" fill="#FFB6D9" opacity="0.3"/>
    </svg>
  </div>
  
  <div class="name-section">
    <h1 class="name">${data.name}</h1>
    <div class="summary">${data.summary || 'Creative and detail-oriented professional with passion for excellence.'}</div>
  </div>
  
  <div class="container">
    <div class="two-column">
      <div class="left">
        <div class="section">
          <div class="section-title">Work Experience</div>
          ${data.experience ? data.experience.split('\n\n').map(exp => {
            const lines = exp.split('\n')
            const titleLine = lines[0] || 'Position'
            const description = lines.slice(1).join('<br>') || ''
            return `
            <div class="experience-item">
              <div class="exp-title">${titleLine}</div>
              <div class="exp-desc">${description}</div>
            </div>
          `}).join('') : ''}
        </div>
        
        <div class="section">
          <div class="section-title">Education</div>
          <div style="font-size: 11px; line-height: 1.7;">${data.education}</div>
        </div>
      </div>
      
      <div class="right">
        ${languages.length > 0 ? `
        <div class="skill-circles">
          ${languages.map(lang => `
            <div class="skill-circle">
              <div class="circle">${lang.level}</div>
              <div class="circle-label">${lang.name}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <div class="section">
          <div class="section-title">Strengths</div>
          <div class="skill-tags">
            ${skills.map(skill => `<div class="skill-tag">${skill}</div>`).join('')}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Hobbies</div>
          <div style="display: flex; gap: 20px; justify-content: center; margin-top: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 32px;">📚</div>
              <div style="font-size: 10px; margin-top: 5px;">Reading</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px;">⚽</div>
              <div style="font-size: 10px; margin-top: 5px;">Sports</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 32px;">✈️</div>
              <div style="font-size: 10px; margin-top: 5px;">Travel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Template 5: Bold Split (Lana Vader Style)
 * 50/50 dark/cyan split with high contrast - COMPACT VERSION
 */
export function generateBoldSplit(data: TemplateData): string {
  const skills = extractSkills(data.skills)
  const languages = extractLanguages(data.languages)
  const hobbies = extractHobbies(data.hobbies)
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    body { font-family: 'Arial', sans-serif; line-height: 1.4; margin: 0; padding: 0; }
    .container { display: flex; height: 297mm; width: 210mm; }
    .dark-side { width: 50%; background: #1A1A1A; color: white; padding: 30px 25px; overflow: hidden; }
    .light-side { width: 50%; background: #00BCD4; color: white; padding: 30px 25px; overflow: hidden; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 12px; font-weight: 700; margin-bottom: 10px; color: #00BCD4; text-transform: uppercase; letter-spacing: 1px; }
    .light-side .section-title { color: white; border-bottom: 2px solid rgba(255,255,255,0.3); padding-bottom: 5px; }
    .dark-side .section-title { border-bottom: 2px solid #00BCD4; padding-bottom: 5px; }
    .name { font-size: 28px; font-weight: 700; margin-bottom: 8px; text-align: right; line-height: 1.2; }
    .photo { width: 100px; height: 100px; border-radius: 50%; overflow: hidden; margin: 0 0 20px auto; border: 3px solid white; background: #333; }
    .photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; }
    .info-item { font-size: 10px; margin-bottom: 6px; display: flex; align-items: center; }
    .info-icon { margin-right: 8px; font-size: 12px; }
    .experience-item { margin-bottom: 15px; }
    .exp-title { font-weight: 700; font-size: 11px; margin-bottom: 3px; }
    .exp-meta { font-size: 9px; opacity: 0.8; margin-bottom: 4px; }
    .exp-desc { font-size: 10px; line-height: 1.4; }
    .lang-circle { display: inline-flex; align-items: center; justify-content: center; width: 45px; height: 45px; border-radius: 50%; border: 2px solid white; font-size: 12px; font-weight: 700; margin-right: 12px; margin-bottom: 8px; }
    .lang-label { font-size: 9px; display: block; text-align: center; margin-top: 4px; }
    .skill-slider { margin-bottom: 12px; }
    .skill-name { font-size: 10px; font-weight: 600; margin-bottom: 5px; }
    .slider-track { height: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; position: relative; }
    .slider-fill { height: 100%; background: white; border-radius: 3px; }
    .slider-thumb { width: 10px; height: 10px; background: white; border-radius: 50%; position: absolute; top: -2.5px; right: 0; }
    .hobby-item { text-align: center; }
    .hobby-icon { font-size: 28px; filter: brightness(0) invert(1); }
    .hobby-label { font-size: 9px; margin-top: 4px; }
    .strength-tag { padding: 5px 10px; border: 1px solid #00BCD4; font-size: 9px; font-weight: 600; display: inline-block; margin: 0 5px 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="dark-side">
      <div class="section">
        <div class="section-title">Profile</div>
        <p style="font-size: 10px; line-height: 1.5;">${data.summary ? data.summary.substring(0, 200) + (data.summary.length > 200 ? '...' : '') : 'Professional profile summary.'}</p>
      </div>
      
      <div class="section">
        <div class="section-title">Work Experience</div>
        ${data.experience ? data.experience.split('\n\n').map(exp => {
          const lines = exp.split('\n')
          return `
          <div class="experience-item">
            <div class="exp-title">${lines[0] || 'Position'}</div>
            <div class="exp-meta">${lines[1] || 'Company'}</div>
            <div class="exp-desc">${lines.slice(2, 4).join('<br>') || ''}</div>
          </div>
        `}).join('') : '<p style="font-size:10px;">No experience listed</p>'}
      </div>
      
      <div class="section">
        <div class="section-title">Education</div>
        <div style="font-size: 10px; line-height: 1.4;">${data.education ? data.education.split('\n').join('<br>') : 'Education details'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Strengths</div>
        <div>
          ${skills.map(skill => `<span class="strength-tag">${skill}</span>`).join('')}
        </div>
      </div>
    </div>
    
    <div class="light-side">
      <div class="photo">
        ${data.photoUrl 
          ? `<img src="${data.photoUrl}" alt="Profile" style="width:100%;height:100%;object-fit:cover;" />`
          : '<div class="photo-placeholder">👤</div>'
        }
      </div>
      
      <h1 class="name">${data.name || 'Your Name'}</h1>
      
      <div class="section">
        <div class="section-title">Personal Info</div>
        <div class="info-item"><span class="info-icon">📍</span>${data.location || 'Location'}</div>
        <div class="info-item"><span class="info-icon">📞</span>${data.phone || 'Phone'}</div>
        <div class="info-item"><span class="info-icon">📧</span>${data.email || 'Email'}</div>
        ${data.website ? `<div class="info-item"><span class="info-icon">🌐</span>${data.website}</div>` : ''}
      </div>
      
      ${languages.length > 0 ? `
      <div class="section">
        <div class="section-title">Languages</div>
        <div style="margin-top: 10px;">
          ${languages.map(lang => `
            <div style="display: inline-block; text-align: center; margin-right: 15px;">
              <div class="lang-circle">${lang.level}</div>
              <div class="lang-label">${lang.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Skills</div>
        ${skills.map((skill, i) => `
          <div class="skill-slider">
            <div class="skill-name">${skill}</div>
            <div class="slider-track">
              <div class="slider-fill" style="width: ${90 - i * 5}%">
                <div class="slider-thumb"></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      ${hobbies.length > 0 ? `
      <div class="section">
        <div class="section-title">Hobbies</div>
        <div style="display: flex; gap: 20px; margin-top: 10px; justify-content: center;">
          ${hobbies.map(hobby => `
            <div class="hobby-item">
              <div class="hobby-icon">${hobby.icon}</div>
              <div class="hobby-label">${hobby.name}</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Export template generators
export const stunningTemplates = {
  'professional-metrics': generateProfessionalMetrics,
  'teal-sidebar': generateTealSidebar,
  'soft-header': generateSoftHeader,
  'artistic-header': generateArtisticHeader,
  'bold-split': generateBoldSplit,
}
