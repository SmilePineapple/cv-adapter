import { describe, it, expect } from 'vitest'
import { calculateATSScore } from '../ats-calculator'
import { CVSection } from '@/types/database'

describe('ATS Calculator', () => {
  const mockJobDescription = `
    We are looking for a Senior Software Engineer with experience in React, TypeScript, and Node.js.
    The ideal candidate will have managed teams, developed scalable applications, and improved system performance.
    Strong problem-solving skills and leadership experience required.
  `

  describe('calculateATSScore', () => {
    it('should return a score between 0 and 100', () => {
      const sections: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Software Engineer at Tech Corp'
        }
      ]

      const score = calculateATSScore(sections, mockJobDescription)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should give higher score for keyword matches', () => {
      const sectionsWithKeywords: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Senior Software Engineer with React, TypeScript, and Node.js experience. Managed teams and developed scalable applications.'
        }
      ]

      const sectionsWithoutKeywords: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Worked on various projects using different technologies.'
        }
      ]

      const scoreWith = calculateATSScore(sectionsWithKeywords, mockJobDescription)
      const scoreWithout = calculateATSScore(sectionsWithoutKeywords, mockJobDescription)

      expect(scoreWith).toBeGreaterThan(scoreWithout)
    })

    it('should reward section completeness', () => {
      const completeSections: CVSection[] = [
        {
          type: 'summary',
          title: 'Professional Summary',
          content: 'Experienced software engineer'
        },
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Software Engineer at Tech Corp'
        },
        {
          type: 'skills',
          title: 'Skills',
          content: 'React, TypeScript, Node.js'
        }
      ]

      const incompleteSections: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Software Engineer'
        }
      ]

      const completeScore = calculateATSScore(completeSections, mockJobDescription)
      const incompleteScore = calculateATSScore(incompleteSections, mockJobDescription)

      expect(completeScore).toBeGreaterThan(incompleteScore)
    })

    it('should reward optimal content length', () => {
      const optimalContent: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Senior Software Engineer with extensive experience in React, TypeScript, and Node.js. Led multiple teams to deliver high-quality software products. Developed scalable applications serving millions of users. Improved system performance by 50% through optimization. Managed cross-functional teams and coordinated with stakeholders. Implemented best practices and streamlined development processes.'.repeat(3)
        }
      ]

      const shortContent: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Software Engineer'
        }
      ]

      const optimalScore = calculateATSScore(optimalContent, mockJobDescription)
      const shortScore = calculateATSScore(shortContent, mockJobDescription)

      expect(optimalScore).toBeGreaterThan(shortScore)
    })

    it('should reward action verbs', () => {
      const withActionVerbs: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Achieved 50% performance improvement. Managed team of 10 engineers. Led development of new features. Developed scalable architecture. Created automated testing framework. Improved code quality. Increased deployment frequency. Delivered projects on time.'
        }
      ]

      const withoutActionVerbs: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Was responsible for software development. Part of engineering team. Worked on various projects.'
        }
      ]

      const scoreWith = calculateATSScore(withActionVerbs, mockJobDescription)
      const scoreWithout = calculateATSScore(withoutActionVerbs, mockJobDescription)

      expect(scoreWith).toBeGreaterThan(scoreWithout)
    })

    it('should reward bullet points', () => {
      const withBullets: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: '• Developed React applications\n• Managed team of engineers\n• Improved system performance'
        }
      ]

      const withoutBullets: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Developed React applications. Managed team of engineers. Improved system performance.'
        }
      ]

      const scoreWith = calculateATSScore(withBullets, mockJobDescription)
      const scoreWithout = calculateATSScore(withoutBullets, mockJobDescription)

      expect(scoreWith).toBeGreaterThan(scoreWithout)
    })

    it('should handle array content', () => {
      const sections: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: [
            { company: 'Tech Corp', role: 'Software Engineer', description: 'Developed React applications' }
          ]
        }
      ]

      const score = calculateATSScore(sections, mockJobDescription)
      expect(score).toBeGreaterThan(0)
    })

    it('should handle object content', () => {
      const sections: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: {
            company: 'Tech Corp',
            role: 'Software Engineer',
            description: 'Developed React applications with TypeScript'
          }
        }
      ]

      const score = calculateATSScore(sections, mockJobDescription)
      expect(score).toBeGreaterThan(0)
    })

    it('should handle empty sections', () => {
      const sections: CVSection[] = []
      const score = calculateATSScore(sections, mockJobDescription)
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should handle empty job description', () => {
      const sections: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Software Engineer'
        }
      ]

      const score = calculateATSScore(sections, '')
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(100)
    })

    it('should filter common stop words from keywords', () => {
      const jobDesc = 'This is a job that will have your team working with their tools'
      const sections: CVSection[] = [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'this that with from have will your their'
        }
      ]

      const score = calculateATSScore(sections, jobDesc)
      // Should not get high score for matching stop words
      expect(score).toBeLessThan(50)
    })

    it('should give perfect score for ideal CV', () => {
      const idealSections: CVSection[] = [
        {
          type: 'summary',
          title: 'Professional Summary',
          content: 'Senior Software Engineer with 10+ years of experience in React, TypeScript, and Node.js. Proven track record of leading teams and delivering scalable applications.'
        },
        {
          type: 'experience',
          title: 'Work Experience',
          content: `
            • Managed team of 15 engineers developing React and TypeScript applications
            • Led development of scalable Node.js microservices architecture
            • Achieved 50% performance improvement through optimization
            • Developed automated testing framework increasing code coverage to 95%
            • Improved deployment process reducing release time by 60%
            • Implemented best practices and streamlined development workflows
            • Coordinated with stakeholders and delivered projects on time
            • Created technical documentation and mentored junior developers
          `.repeat(2)
        },
        {
          type: 'skills',
          title: 'Technical Skills',
          content: 'React, TypeScript, Node.js, JavaScript, Python, AWS, Docker, Kubernetes, CI/CD, Agile, Scrum, Leadership, Problem-solving'
        }
      ]

      const score = calculateATSScore(idealSections, mockJobDescription)
      expect(score).toBeGreaterThan(80)
    })
  })
})
