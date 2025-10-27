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
  languages: string
  hobbies: string
  certifications: string
}

// Helper to extract skills as array
function extractSkills(skillsText: string): string[] {
  if (!skillsText) return []
  return skillsText.split(/[,\n•]/).map(s => s.trim()).filter(Boolean).slice(0, 8)
}

// Helper to extract languages
function extractLanguages(langText: string): Array<{name: string, level: number}> {
  if (!langText) return []
  const langs = langText.split(/[,\n]/).map(s => s.trim()).filter(Boolean).slice(0, 3)
  return langs.map(lang => ({
    name: lang.split(/[-:]/)[0].trim(),
    level: Math.floor(Math.random() * 30) + 70 // 70-100
  }))
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
        <div style="width:100%;height:100%;background:#E0E0E0;display:flex;align-items:center;justify-content:center;font-size:40px;color:#999;">👤</div>
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
          ${data.experience ? data.experience.split('\n\n').slice(0, 3).map(exp => `
            <div class="experience-item">
              <div class="experience-header">${exp.split('\n')[0] || 'Position Title'}</div>
              <div class="experience-meta">${exp.split('\n')[1] || 'Company • Location'}</div>
              <div class="experience-desc">${exp.split('\n').slice(2).join('<br>') || 'Description'}</div>
            </div>
          `).join('') : '<p style="font-size:11px;">No experience listed</p>'}
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
  const skills = extractSkills(data.skills)
  
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
      <div class="sidebar-icon">👤</div>
      <div class="sidebar-icon">💼</div>
      <div class="sidebar-icon">🎓</div>
      <div class="sidebar-icon">⚡</div>
      <div class="sidebar-icon">🎯</div>
    </div>
    
    <div class="main">
      <div class="photo">
        <div class="photo-placeholder">👤</div>
      </div>
      
      <h1 class="name">${data.name}</h1>
      <div class="title">Professional Profile</div>
      <div class="summary">${data.summary || 'Performance-driven professional with proven track record.'}</div>
      
      <div class="section">
        <div class="section-title">Personal Info</div>
        <div class="info-row"><span class="info-label">Date of birth:</span><span>01/01/1990</span></div>
        <div class="info-row"><span class="info-label">Phone number:</span><span>${data.phone}</span></div>
        <div class="info-row"><span class="info-label">Email address:</span><span>${data.email}</span></div>
        <div class="info-row"><span class="info-label">Web:</span><span>${data.website}</span></div>
      </div>
      
      <div class="section">
        <div class="section-title">Work Experience</div>
        ${data.experience ? data.experience.split('\n\n').slice(0, 2).map(exp => `
          <div class="experience-item">
            <div class="exp-title">${exp.split('\n')[0] || 'Position'}</div>
            <div class="exp-meta">${exp.split('\n')[1] || 'Company'}</div>
            <div class="exp-desc">${exp.split('\n').slice(2).join('<br>') || 'Description'}</div>
          </div>
        `).join('') : ''}
      </div>
      
      <div class="section">
        <div class="section-title">Education</div>
        <div style="font-size: 12px; line-height: 1.7;">${data.education}</div>
      </div>
      
      <div class="section">
        <div class="section-title">Skills</div>
        <div class="skill-bars">
          ${skills.slice(0, 5).map((skill, i) => `
            <div class="skill-bar">
              <div class="skill-name">${skill}</div>
              <div class="skill-progress">
                <div class="skill-fill" style="width: ${95 - i * 5}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
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
}
