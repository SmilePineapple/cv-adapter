import { describe, it, expect } from 'vitest'
import { analyzeContentCapacity, getPageCountRecommendation } from './cv-capacity-analyzer'
import { CVSection } from '@/types/database'

describe('CV Capacity Analyzer', () => {
  describe('analyzeContentCapacity', () => {
    it('should analyze a junior CV with limited content', () => {
      const juniorCV: CVSection[] = [
        {
          type: 'name',
          content: 'John Doe',
          order: 1
        },
        {
          type: 'contact',
          content: 'john@example.com',
          order: 2
        },
        {
          type: 'summary',
          content: 'Recent graduate with 1 year of experience in software development.',
          order: 3
        },
        {
          type: 'experience',
          content: `Junior Developer | Tech Startup | 2023-Present
• Developed web applications using React
• Collaborated with team of 5 developers
• Fixed bugs and implemented features`,
          order: 4
        },
        {
          type: 'skills',
          content: 'JavaScript, React, Node.js, Git, HTML, CSS',
          order: 5
        },
        {
          type: 'education',
          content: 'Bachelor of Science in Computer Science | University | 2023',
          order: 6
        }
      ]

      const capacity = analyzeContentCapacity(juniorCV)

      expect(capacity.sourceChars).toBeGreaterThan(200)
      expect(capacity.sourceChars).toBeLessThan(500)
      expect(capacity.jobCount).toBe(1)
      expect(capacity.educationCount).toBe(1)
      expect(capacity.experienceYears).toBeGreaterThanOrEqual(1)
      expect(capacity.recommendedPageCount).toBe(1)
      expect(capacity.canSupport1Page).toBe(true)
      expect(capacity.canSupport2Page).toBe(false)
      expect(capacity.detailLevel).toBe('sparse')
    })

    it('should analyze a mid-level CV with moderate content', () => {
      const midCV: CVSection[] = [
        {
          type: 'summary',
          content: 'Experienced software engineer with 5 years of full-stack development experience. Specialized in React, Node.js, and cloud infrastructure. Led multiple high-impact projects.',
          order: 1
        },
        {
          type: 'experience',
          content: `Senior Developer | Tech Company | 2021-Present
• Led development of microservices architecture serving 100k+ users
• Mentored team of 3 junior developers
• Improved system performance by 40%
• Implemented CI/CD pipeline reducing deployment time by 60%

Software Engineer | Startup | 2019-2021
• Built RESTful APIs using Node.js and Express
• Developed React frontend with Redux state management
• Collaborated with design team on UX improvements
• Reduced page load time by 50%`,
          order: 2
        },
        {
          type: 'skills',
          content: 'JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, MongoDB, AWS, Docker, Kubernetes, Git, CI/CD, Agile',
          order: 3
        },
        {
          type: 'education',
          content: 'Bachelor of Science in Computer Science | University | 2019',
          order: 4
        },
        {
          type: 'certifications',
          content: 'AWS Certified Solutions Architect\nCertified Kubernetes Administrator',
          order: 5
        }
      ]

      const capacity = analyzeContentCapacity(midCV)

      expect(capacity.sourceChars).toBeGreaterThan(600)
      expect(capacity.jobCount).toBe(2)
      expect(capacity.educationCount).toBe(1)
      expect(capacity.certificationCount).toBe(2)
      expect(capacity.experienceYears).toBeGreaterThanOrEqual(4)
      expect(capacity.recommendedPageCount).toBeGreaterThanOrEqual(2)
      expect(capacity.canSupport2Page).toBe(true)
      expect(capacity.hasQuantifiableAchievements).toBe(true)
    })

    it('should detect bullet point ratio correctly', () => {
      const bulletHeavyCV: CVSection[] = [
        {
          type: 'experience',
          content: `Developer | Company | 2020-2023
• Built features
• Fixed bugs
• Wrote tests
• Reviewed code
• Deployed apps`,
          order: 1
        }
      ]

      const capacity = analyzeContentCapacity(bulletHeavyCV)
      expect(capacity.bulletPointRatio).toBeGreaterThan(0.5)
    })

    it('should calculate average bullet length', () => {
      const cv: CVSection[] = [
        {
          type: 'experience',
          content: `• Short bullet
• This is a much longer bullet point with more detail and context
• Medium length bullet point here`,
          order: 1
        }
      ]

      const capacity = analyzeContentCapacity(cv)
      expect(capacity.avgBulletLength).toBeGreaterThan(20)
      expect(capacity.avgBulletLength).toBeLessThan(60)
    })
  })

  describe('getPageCountRecommendation', () => {
    it('should warn when requesting 2 pages for junior CV', () => {
      const capacity = {
        sourceChars: 350,
        experienceYears: 1,
        jobCount: 1,
        educationCount: 1,
        skillCount: 5,
        certificationCount: 0,
        hasProjects: false,
        hasAchievements: false,
        maxTruthfulChars: 4500,
        recommendedPageCount: 1,
        canSupport1Page: true,
        canSupport2Page: false,
        canSupport3Page: false,
        canSupport4Page: false,
        bulletPointRatio: 0.6,
        avgBulletLength: 25,
        avgParagraphLength: 80,
        structuralOverhead: 60,
        hasQuantifiableAchievements: false,
        detailLevel: 'sparse' as const
      }

      const recommendation = getPageCountRecommendation(capacity, 2)

      expect(recommendation.recommended).toBe(1)
      expect(recommendation.warnings[2]).toBeDefined()
      expect(recommendation.warnings[2]).toContain('better suited for 1 page')
    })

    it('should not warn when requesting appropriate page count', () => {
      const capacity = {
        sourceChars: 800,
        experienceYears: 5,
        jobCount: 3,
        educationCount: 1,
        skillCount: 12,
        certificationCount: 2,
        hasProjects: false,
        hasAchievements: false,
        maxTruthfulChars: 12000,
        recommendedPageCount: 2,
        canSupport1Page: true,
        canSupport2Page: true,
        canSupport3Page: false,
        canSupport4Page: false,
        bulletPointRatio: 0.7,
        avgBulletLength: 35,
        avgParagraphLength: 100,
        structuralOverhead: 75,
        hasQuantifiableAchievements: true,
        detailLevel: 'moderate' as const
      }

      const recommendation = getPageCountRecommendation(capacity, 2)

      expect(recommendation.recommended).toBe(2)
      expect(recommendation.warnings[2]).toBeUndefined()
      expect(recommendation.confidence).toBe('high')
    })

    it('should list all supported page counts', () => {
      const capacity = {
        sourceChars: 1200,
        experienceYears: 8,
        jobCount: 4,
        educationCount: 2,
        skillCount: 15,
        certificationCount: 3,
        hasProjects: true,
        hasAchievements: true,
        maxTruthfulChars: 18000,
        recommendedPageCount: 3,
        canSupport1Page: true,
        canSupport2Page: true,
        canSupport3Page: true,
        canSupport4Page: false,
        bulletPointRatio: 0.65,
        avgBulletLength: 40,
        avgParagraphLength: 120,
        structuralOverhead: 90,
        hasQuantifiableAchievements: true,
        detailLevel: 'detailed' as const
      }

      const recommendation = getPageCountRecommendation(capacity, 3)

      expect(recommendation.canSupport).toEqual([1, 2, 3])
      expect(recommendation.canSupport).not.toContain(4)
    })
  })
})
