/**
 * Industry-Specific CV Templates
 * Optimized layouts and content for different industries
 */

import { CVSection } from '@/types/database'

export interface IndustryTemplate {
  id: string
  name: string
  industry: string
  description: string
  bestFor: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  features: string[]
  keywords: string[] // ATS-optimized keywords
}

export const industryTemplates: Record<string, IndustryTemplate> = {
  tech_software: {
    id: 'tech_software',
    name: 'Tech & Software',
    industry: 'Technology',
    description: 'Modern, skills-focused template for software developers and tech professionals',
    bestFor: ['Software Engineers', 'Developers', 'DevOps', 'Data Scientists', 'Tech Leads'],
    colors: {
      primary: '#2563eb', // Blue
      secondary: '#1e40af',
      accent: '#60a5fa'
    },
    features: [
      'Technical skills prominently displayed',
      'Project showcase section',
      'GitHub/Portfolio links highlighted',
      'Clean, modern design',
      'ATS-optimized keywords'
    ],
    keywords: ['agile', 'scrum', 'CI/CD', 'cloud', 'API', 'full-stack', 'DevOps', 'microservices']
  },
  
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    industry: 'Healthcare',
    description: 'Professional, credential-heavy template for healthcare professionals',
    bestFor: ['Doctors', 'Nurses', 'Medical Professionals', 'Healthcare Administrators'],
    colors: {
      primary: '#059669', // Green
      secondary: '#047857',
      accent: '#34d399'
    },
    features: [
      'Certifications and licenses highlighted',
      'Clinical experience emphasized',
      'Professional affiliations section',
      'Conservative, trustworthy design',
      'Compliance-focused formatting'
    ],
    keywords: ['patient care', 'clinical', 'certified', 'licensed', 'HIPAA', 'EMR', 'healthcare']
  },
  
  finance: {
    id: 'finance',
    name: 'Finance & Banking',
    industry: 'Finance',
    description: 'Conservative, numbers-focused template for finance professionals',
    bestFor: ['Financial Analysts', 'Accountants', 'Investment Bankers', 'CFOs'],
    colors: {
      primary: '#1e40af', // Dark Blue
      secondary: '#1e3a8a',
      accent: '#3b82f6'
    },
    features: [
      'Quantifiable achievements highlighted',
      'Financial certifications prominent',
      'Professional, conservative layout',
      'Numbers and metrics emphasized',
      'Compliance and regulatory focus'
    ],
    keywords: ['financial analysis', 'CPA', 'CFA', 'forecasting', 'budgeting', 'compliance', 'audit']
  },
  
  education: {
    id: 'education',
    name: 'Education & Academic',
    industry: 'Education',
    description: 'Academic-focused template for educators and researchers',
    bestFor: ['Teachers', 'Professors', 'Researchers', 'Academic Administrators'],
    colors: {
      primary: '#7c3aed', // Purple
      secondary: '#6d28d9',
      accent: '#a78bfa'
    },
    features: [
      'Publications and research highlighted',
      'Teaching experience emphasized',
      'Academic credentials prominent',
      'Conference presentations section',
      'Professional development focus'
    ],
    keywords: ['curriculum', 'pedagogy', 'research', 'published', 'PhD', 'teaching', 'academic']
  },
  
  creative: {
    id: 'creative',
    name: 'Creative & Design',
    industry: 'Creative',
    description: 'Visual, portfolio-focused template for creative professionals',
    bestFor: ['Designers', 'Artists', 'Creative Directors', 'UX/UI Designers'],
    colors: {
      primary: '#ec4899', // Pink
      secondary: '#db2777',
      accent: '#f472b6'
    },
    features: [
      'Portfolio links prominently displayed',
      'Visual project showcase',
      'Creative skills highlighted',
      'Modern, eye-catching design',
      'Brand-focused layout'
    ],
    keywords: ['creative', 'design', 'portfolio', 'Adobe', 'Figma', 'branding', 'visual']
  },
  
  executive: {
    id: 'executive',
    name: 'Executive & Leadership',
    industry: 'Executive',
    description: 'Leadership-focused template for C-level executives',
    bestFor: ['CEOs', 'CTOs', 'VPs', 'Directors', 'Senior Managers'],
    colors: {
      primary: '#1f2937', // Dark Gray
      secondary: '#111827',
      accent: '#4b5563'
    },
    features: [
      'Leadership achievements emphasized',
      'Board experience highlighted',
      'Strategic initiatives showcased',
      'Executive summary prominent',
      'Professional, authoritative design'
    ],
    keywords: ['leadership', 'strategic', 'executive', 'board', 'P&L', 'transformation', 'growth']
  },
  
  sales_marketing: {
    id: 'sales_marketing',
    name: 'Sales & Marketing',
    industry: 'Sales',
    description: 'Results-driven, metrics-heavy template for sales professionals',
    bestFor: ['Sales Managers', 'Marketing Directors', 'Account Executives', 'Business Development'],
    colors: {
      primary: '#f59e0b', // Orange
      secondary: '#d97706',
      accent: '#fbbf24'
    },
    features: [
      'Sales metrics and KPIs highlighted',
      'Revenue achievements prominent',
      'Client success stories',
      'Results-focused layout',
      'Dynamic, energetic design'
    ],
    keywords: ['revenue', 'quota', 'pipeline', 'CRM', 'B2B', 'B2C', 'growth', 'conversion']
  },
  
  legal: {
    id: 'legal',
    name: 'Legal & Law',
    industry: 'Legal',
    description: 'Formal, experience-focused template for legal professionals',
    bestFor: ['Lawyers', 'Attorneys', 'Legal Counsel', 'Paralegals'],
    colors: {
      primary: '#0f172a', // Very Dark Blue
      secondary: '#1e293b',
      accent: '#334155'
    },
    features: [
      'Bar admissions highlighted',
      'Case experience emphasized',
      'Legal specializations clear',
      'Formal, professional design',
      'Publications and speaking'
    ],
    keywords: ['litigation', 'counsel', 'bar', 'legal', 'attorney', 'compliance', 'contract']
  }
}

/**
 * Get template style CSS for industry-specific templates
 */
export function getIndustryTemplateStyle(templateId: string): string {
  const template = industryTemplates[templateId]
  if (!template) return ''
  
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 10px;
      line-height: 1.5;
      color: #1f2937;
      background: #fff;
    }
    
    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 15mm;
    }
    
    /* Header */
    .header {
      border-bottom: 3px solid ${template.colors.primary};
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    
    .name {
      font-size: 28px;
      font-weight: 700;
      color: ${template.colors.primary};
      margin-bottom: 5px;
    }
    
    .title {
      font-size: 14px;
      color: ${template.colors.secondary};
      font-weight: 500;
      margin-bottom: 10px;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 9px;
      color: #6b7280;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    /* Sections */
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: ${template.colors.primary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 2px solid ${template.colors.accent};
    }
    
    .section-content {
      font-size: 10px;
      line-height: 1.6;
      color: #374151;
    }
    
    /* Experience Items */
    .experience-item {
      margin-bottom: 15px;
      page-break-inside: avoid;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }
    
    .job-title {
      font-size: 12px;
      font-weight: 600;
      color: ${template.colors.secondary};
    }
    
    .company {
      font-size: 11px;
      color: #4b5563;
      font-weight: 500;
    }
    
    .date-range {
      font-size: 9px;
      color: #6b7280;
      font-style: italic;
    }
    
    .description {
      margin-top: 5px;
      line-height: 1.6;
    }
    
    .description ul {
      margin-left: 15px;
      margin-top: 5px;
    }
    
    .description li {
      margin-bottom: 3px;
    }
    
    /* Skills */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 10px;
    }
    
    .skill-tag {
      background: ${template.colors.accent}20;
      color: ${template.colors.primary};
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 500;
      text-align: center;
    }
    
    /* Education */
    .education-item {
      margin-bottom: 12px;
    }
    
    .degree {
      font-size: 11px;
      font-weight: 600;
      color: ${template.colors.secondary};
    }
    
    .institution {
      font-size: 10px;
      color: #4b5563;
      margin-top: 2px;
    }
    
    /* Certifications */
    .cert-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .cert-name {
      font-weight: 600;
      color: ${template.colors.primary};
    }
    
    .cert-issuer {
      color: #6b7280;
      font-size: 9px;
    }
    
    /* Metrics/Achievements (for sales/executive) */
    .metric-box {
      background: ${template.colors.primary}10;
      border-left: 3px solid ${template.colors.primary};
      padding: 10px;
      margin: 10px 0;
    }
    
    .metric-value {
      font-size: 18px;
      font-weight: 700;
      color: ${template.colors.primary};
    }
    
    .metric-label {
      font-size: 9px;
      color: #6b7280;
      text-transform: uppercase;
    }
    
    /* Print optimization */
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .section { page-break-inside: avoid; }
    }
  `
}

/**
 * Generate HTML for industry-specific template
 */
export function generateIndustryTemplateHTML(
  templateId: string,
  sections: CVSection[],
  userName: string = 'Your Name'
): string {
  const template = industryTemplates[templateId]
  if (!template) return ''
  
  // Helper to get section content
  const getSectionContent = (type: string): string => {
    const section = sections.find(s => s.type === type)
    return section?.content || ''
  }
  
  // Helper to parse skills
  const parseSkills = (skillsText: string): string[] => {
    return skillsText
      .split(/[,\n•]/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }
  
  const personalInfo = getSectionContent('personal_details')
  const summary = getSectionContent('summary')
  const experience = getSectionContent('work_experience')
  const education = getSectionContent('education')
  const skills = getSectionContent('skills')
  const certifications = getSectionContent('certifications')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${getIndustryTemplateStyle(templateId)}</style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <div class="name">${userName}</div>
          <div class="title">${template.bestFor[0]}</div>
          <div class="contact-info">
            ${personalInfo ? `<div class="contact-item">${personalInfo.split('\n')[0]}</div>` : ''}
          </div>
        </div>
        
        <!-- Summary -->
        ${summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <div class="section-content">${summary}</div>
          </div>
        ` : ''}
        
        <!-- Experience -->
        ${experience ? `
          <div class="section">
            <div class="section-title">Work Experience</div>
            <div class="section-content">
              ${experience.split('\n\n').map(exp => `
                <div class="experience-item">
                  ${exp.replace(/\n/g, '<br>')}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Skills -->
        ${skills ? `
          <div class="section">
            <div class="section-title">Skills & Expertise</div>
            <div class="skills-grid">
              ${parseSkills(skills).slice(0, 12).map(skill => `
                <div class="skill-tag">${skill}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Education -->
        ${education ? `
          <div class="section">
            <div class="section-title">Education</div>
            <div class="section-content">
              ${education.split('\n\n').map(edu => `
                <div class="education-item">${edu.replace(/\n/g, '<br>')}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <!-- Certifications -->
        ${certifications ? `
          <div class="section">
            <div class="section-title">Certifications & Licenses</div>
            <div class="section-content">
              ${certifications.split('\n').map(cert => `
                <div class="cert-item">
                  <span class="cert-name">${cert}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `
}
