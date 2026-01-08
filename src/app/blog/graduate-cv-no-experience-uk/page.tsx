import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Graduate CV with No Experience: UK Guide (2025) | CV Adapter',
  description: 'How to write a winning graduate CV with no work experience. Expert tips for UK university leavers to land their first job in 2025.',
  keywords: 'graduate CV no experience UK, university leaver CV, first job CV, graduate CV template UK, entry level CV',
  openGraph: {
    title: 'Graduate CV with No Experience: Complete UK Guide (2025)',
    description: 'Step-by-step guide for UK graduates to create a compelling CV even without work experience.',
    type: 'article',
  }
}

export default function GraduateCVNoExperience() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CV Adapter
            </Link>
            <Link 
              href="/auth/signup"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Try Free
            </Link>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Graduate CV with No Experience: Complete UK Guide (2025)
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600 mb-8">
          <time dateTime="2025-11-09">November 9, 2025</time>
          <span>•</span>
          <span>10 min read</span>
        </div>

        {/* Featured Image Placeholder */}
        <div className="w-full h-64 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl mb-8 flex items-center justify-center">
          <p className="text-gray-500 text-lg">🎓 Graduate CV Guide</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 leading-relaxed mb-6">
            Just graduated from university and staring at a blank CV? You're not alone. <strong>78% of UK graduates</strong> 
            struggle with the same question: <em>"How do I write a CV when I have no work experience?"</em>
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Here's the truth: You have more to offer than you think. Your degree, projects, societies, part-time jobs, 
            and volunteering all count as valuable experience. This guide will show you exactly how to turn your 
            university years into a compelling graduate CV that gets interviews.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
            <p className="text-blue-900 font-semibold mb-2">💡 Key Insight</p>
            <p className="text-blue-800">
              Employers hiring graduates aren't expecting 10 years of experience. They're looking for <strong>potential, 
              enthusiasm, and transferable skills</strong>. Your CV needs to showcase these qualities, not apologize for 
              lack of experience.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">The Graduate CV Structure (No Experience Required)</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Here's the winning structure for a graduate CV with limited work experience:
          </p>

          <div className="bg-white border-2 border-purple-200 rounded-lg p-6 mb-8">
            <h4 className="font-bold text-gray-900 mb-4">📄 Optimal Graduate CV Structure:</h4>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li><strong>Contact Information</strong> (Name, phone, email, LinkedIn, location)</li>
              <li><strong>Personal Statement</strong> (3-4 lines highlighting your degree, skills, and career goals)</li>
              <li><strong>Education</strong> (Your degree, A-Levels, relevant modules, dissertation)</li>
              <li><strong>Skills</strong> (Technical and soft skills relevant to target role)</li>
              <li><strong>Experience</strong> (Part-time jobs, internships, volunteering—reframed for relevance)</li>
              <li><strong>Projects</strong> (University projects, personal projects, hackathons)</li>
              <li><strong>Extracurricular Activities</strong> (Societies, sports, leadership roles)</li>
              <li><strong>Additional Sections</strong> (Certifications, languages, awards)</li>
            </ol>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Section-by-Section Breakdown</h2>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">1. Personal Statement (Your Elevator Pitch)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Your personal statement is crucial when you lack experience. It should include:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Your degree and classification (if 2:1 or First)</li>
            <li>2-3 key skills or strengths</li>
            <li>What type of role you're seeking</li>
            <li>Your unique value proposition</li>
          </ul>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-green-900 font-semibold mb-3">✅ Strong Graduate Personal Statement:</p>
            <p className="text-green-800 italic mb-4">
              "Recent Computer Science graduate from University of Manchester (First Class Honours) with strong programming 
              skills in Python, Java, and React. Led a team of 5 students to develop an award-winning mobile app for mental 
              health support. Seeking a Graduate Software Developer role where I can apply my technical skills and passion 
              for user-centered design to create impactful solutions."
            </p>
            <p className="text-green-900 font-semibold mb-2">Why it works:</p>
            <ul className="list-disc pl-6 text-green-800 space-y-1">
              <li>Highlights strong degree classification</li>
              <li>Lists specific technical skills</li>
              <li>Mentions concrete achievement (award-winning project)</li>
              <li>Shows leadership (led team of 5)</li>
              <li>Clearly states target role</li>
            </ul>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-900 font-semibold mb-3">❌ Weak Graduate Personal Statement:</p>
            <p className="text-red-800 italic mb-4">
              "Recent graduate looking for entry-level opportunities. Hard-working and eager to learn. Good team player 
              with excellent communication skills."
            </p>
            <p className="text-red-900 font-semibold mb-2">Why it fails:</p>
            <ul className="list-disc pl-6 text-red-800 space-y-1">
              <li>No mention of degree or university</li>
              <li>Generic buzzwords with no evidence</li>
              <li>No specific skills or achievements</li>
              <li>Doesn't specify target role or industry</li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">2. Education (Your Strongest Asset)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            As a graduate, your education section should be detailed and prominent. Include:
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <p className="text-purple-900 font-semibold mb-3">🎓 What to Include:</p>
            <p className="text-purple-800 mb-2"><strong>University Degree:</strong></p>
            <ul className="list-disc pl-6 mb-4 text-purple-800">
              <li>Degree title and classification (if 2:1 or above)</li>
              <li>University name and graduation date</li>
              <li>Relevant modules (3-5 most relevant to target role)</li>
              <li>Dissertation/final project title and brief description</li>
              <li>Academic achievements (scholarships, awards, Dean's List)</li>
            </ul>
            <p className="text-purple-800 mb-2"><strong>A-Levels/BTECs:</strong></p>
            <ul className="list-disc pl-6 text-purple-800">
              <li>Subjects and grades (if strong)</li>
              <li>School/college name</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-blue-900 font-semibold mb-3">📚 Example Education Section:</p>
            <p className="text-blue-800 mb-2"><strong>BSc (Hons) Marketing, University of Bristol — First Class (2021-2024)</strong></p>
            <p className="text-blue-800 mb-3">
              <strong>Relevant Modules:</strong> Digital Marketing Strategy (85%), Consumer Behavior (82%), Data Analytics 
              for Marketing (88%), Social Media Marketing (90%), Brand Management (84%)
            </p>
            <p className="text-blue-800 mb-3">
              <strong>Dissertation:</strong> "The Impact of TikTok Influencer Marketing on Gen Z Purchase Decisions" — 
              Conducted primary research with 300+ participants, analyzed data using SPSS, achieved 78% grade
            </p>
            <p className="text-blue-800">
              <strong>Achievements:</strong> Marketing Society President (2023-24), Dean's List for Academic Excellence (2023)
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">3. Skills Section (Show What You Can Do)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Organize your skills into clear categories:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-3">💻 Technical Skills</h4>
              <p className="text-sm text-gray-600 mb-2">Software, tools, and platforms you can use:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Microsoft Office Suite (Excel, PowerPoint, Word)</li>
                <li>• Programming languages (Python, Java, SQL)</li>
                <li>• Design tools (Adobe Creative Suite, Figma, Canva)</li>
                <li>• Analytics (Google Analytics, Tableau, SPSS)</li>
                <li>• CRM systems (Salesforce, HubSpot)</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-3">🤝 Soft Skills</h4>
              <p className="text-sm text-gray-600 mb-2">Transferable skills with evidence:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Leadership (Society President, team projects)</li>
                <li>• Communication (Presentations, customer service)</li>
                <li>• Problem-solving (Dissertation research)</li>
                <li>• Time management (Balanced studies + part-time work)</li>
                <li>• Teamwork (Group projects, sports teams)</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">4. Experience (Reframe Everything You've Done)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Even if you've only worked in retail or hospitality, you've developed valuable skills. The key is reframing:
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-green-900 font-semibold mb-3">✅ Reframing Part-Time Jobs:</p>
            <p className="text-green-800 mb-2"><strong>Retail Assistant → Customer Service & Sales</strong></p>
            <p className="text-green-800 italic mb-4">
              "Delivered exceptional customer service to 50+ customers daily, achieving 95% satisfaction rating. 
              Processed transactions using POS system with 100% accuracy. Trained 3 new team members on store procedures 
              and product knowledge. Managed inventory and restocking, reducing stock discrepancies by 15%."
            </p>
            <p className="text-green-800 mb-2"><strong>Waiter/Waitress → Hospitality & Operations</strong></p>
            <p className="text-green-800 italic">
              "Managed service for 20+ tables simultaneously in fast-paced environment, maintaining 4.8/5 customer rating. 
              Collaborated with kitchen staff to ensure timely order delivery. Handled cash and card payments, balancing 
              till with 100% accuracy. Resolved customer complaints diplomatically, turning negative experiences into 
              positive outcomes."
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">5. Projects (Your Secret Weapon)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Projects demonstrate initiative and practical skills. Include:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>University projects:</strong> Group projects, dissertations, case studies</li>
            <li><strong>Personal projects:</strong> Websites, apps, blogs, portfolios</li>
            <li><strong>Hackathons:</strong> Any coding competitions or challenges</li>
            <li><strong>Freelance work:</strong> Even small paid projects count</li>
          </ul>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-blue-900 font-semibold mb-3">💡 Project Example:</p>
            <p className="text-blue-800 mb-2"><strong>E-Commerce Website Development (Personal Project)</strong></p>
            <p className="text-blue-800">
              Built a fully functional e-commerce website using React, Node.js, and MongoDB. Implemented user authentication, 
              shopping cart functionality, and payment integration with Stripe. Deployed on Vercel with 99.9% uptime. 
              Gained 200+ users within first month through social media marketing.
            </p>
          </div>

          <h3 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">6. Extracurricular Activities (Show You're Well-Rounded)</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Employers love candidates who are engaged and proactive. Include:
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li><strong>University societies:</strong> Especially leadership roles (President, Treasurer, Events Coordinator)</li>
            <li><strong>Sports teams:</strong> Shows teamwork and commitment</li>
            <li><strong>Volunteering:</strong> Demonstrates social responsibility</li>
            <li><strong>Student ambassador roles:</strong> Communication and representation skills</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">What to Do If You Have ZERO Experience</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you genuinely have no work experience, internships, or volunteering, here's what to do <strong>right now</strong>:
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
              <h4 className="text-purple-900 font-semibold mb-2">1. Start a Personal Project (This Week)</h4>
              <p className="text-purple-800">
                Build something relevant to your target role. Marketing grad? Start a blog or Instagram page. 
                Computer Science? Build an app. Business grad? Create a business plan for a startup idea.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
              <h4 className="text-purple-900 font-semibold mb-2">2. Volunteer (Next Week)</h4>
              <p className="text-purple-800">
                Find local charities or organizations that need help. Even 5 hours a week gives you real experience 
                to put on your CV. Websites like Do-It.org and CharityJob.co.uk list opportunities.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
              <h4 className="text-purple-900 font-semibold mb-2">3. Get Certified (This Month)</h4>
              <p className="text-purple-800">
                Free certifications from Google, HubSpot, LinkedIn Learning, and Coursera can fill gaps and show 
                initiative. Google Digital Garage, HubSpot Content Marketing, and LinkedIn Excel courses are all free.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-600 p-4">
              <h4 className="text-purple-900 font-semibold mb-2">4. Network on LinkedIn (Ongoing)</h4>
              <p className="text-purple-800">
                Connect with alumni, recruiters, and professionals in your target industry. Engage with their content, 
                ask for informational interviews, and build relationships. Many jobs come from networking, not applications.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Common Graduate CV Mistakes</h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #1: Making It Too Long</h4>
              <p className="text-red-800">
                Graduate CVs should be <strong>1-2 pages maximum</strong>. If you have limited experience, 1 page is perfect. 
                Don't pad it with irrelevant information.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #2: Using a Generic CV for Every Application</h4>
              <p className="text-red-800">
                Tailor your CV for each role. Highlight different modules, projects, or skills based on the job description. 
                This is crucial for getting past ATS systems.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #3: Listing Responsibilities Instead of Achievements</h4>
              <p className="text-red-800">
                Don't write "Responsible for serving customers." Write "Served 50+ customers daily, achieving 95% satisfaction 
                rating." Always quantify and show impact.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #4: Poor Formatting</h4>
              <p className="text-red-800">
                Use a clean, professional template. Avoid graphics, photos, and creative fonts that confuse ATS systems. 
                Stick to Arial, Calibri, or Times New Roman, 10-12pt font.
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-600 p-4">
              <h4 className="text-red-900 font-semibold mb-2">❌ Mistake #5: Typos and Grammar Errors</h4>
              <p className="text-red-800">
                Proofread multiple times. Ask friends, family, or your university careers service to review it. 
                One typo can cost you the interview.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Graduate CV Template (Copy & Customize)</h2>
          
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 mb-8 font-mono text-sm">
            <p className="text-gray-900 font-bold mb-4">[YOUR NAME]</p>
            <p className="text-gray-700 mb-4">
              [Phone] | [Email] | [LinkedIn URL] | [City, UK]
            </p>
            <p className="text-gray-900 font-bold mb-2">PERSONAL STATEMENT</p>
            <p className="text-gray-700 mb-4">
              [Degree] graduate from [University] with [classification]. Strong skills in [skill 1], [skill 2], and [skill 3]. 
              [Key achievement or project]. Seeking [target role] where I can apply my [relevant skills] to [company goal].
            </p>
            <p className="text-gray-900 font-bold mb-2">EDUCATION</p>
            <p className="text-gray-700 mb-1"><strong>[Degree Title], [University] — [Classification] ([Year-Year])</strong></p>
            <p className="text-gray-700 mb-1">Relevant Modules: [Module 1], [Module 2], [Module 3]</p>
            <p className="text-gray-700 mb-4">Dissertation: [Title] — [Brief description and grade]</p>
            <p className="text-gray-900 font-bold mb-2">SKILLS</p>
            <p className="text-gray-700 mb-1"><strong>Technical:</strong> [List software, tools, languages]</p>
            <p className="text-gray-700 mb-4"><strong>Soft Skills:</strong> [List with brief evidence]</p>
            <p className="text-gray-900 font-bold mb-2">EXPERIENCE</p>
            <p className="text-gray-700 mb-1"><strong>[Job Title], [Company] — [City] ([Month Year - Month Year])</strong></p>
            <p className="text-gray-700 mb-4">• [Achievement with numbers]<br/>• [Achievement with numbers]<br/>• [Achievement with numbers]</p>
            <p className="text-gray-900 font-bold mb-2">PROJECTS</p>
            <p className="text-gray-700 mb-4"><strong>[Project Name]:</strong> [Brief description, technologies used, impact]</p>
            <p className="text-gray-900 font-bold mb-2">EXTRACURRICULAR</p>
            <p className="text-gray-700">• [Society/Sport/Volunteer role with brief description]</p>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 my-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Create Your Graduate CV in Minutes</h3>
            <p className="text-lg mb-6">
              CV Adapter's AI helps you highlight your strengths, reframe your experience, and create an ATS-optimized 
              CV that gets interviews—even with no work experience.
            </p>
            <Link 
              href="/auth/signup"
              className="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:shadow-xl transition-all"
            >
              Build Your Graduate CV (Free)
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Final Checklist</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h4 className="text-blue-900 font-semibold mb-4">✅ Before You Apply:</h4>
            <ul className="space-y-2 text-blue-800">
              <li>✓ Personal statement is tailored to the specific role</li>
              <li>✓ Education section includes relevant modules and dissertation</li>
              <li>✓ Skills section lists both technical and soft skills</li>
              <li>✓ Experience bullets focus on achievements, not responsibilities</li>
              <li>✓ Projects demonstrate practical skills</li>
              <li>✓ Extracurriculars show you're well-rounded</li>
              <li>✓ Keywords from job description are naturally included</li>
              <li>✓ CV is 1-2 pages maximum</li>
              <li>✓ No typos or grammar errors</li>
              <li>✓ Saved as .docx or .pdf with professional filename (FirstName_LastName_CV.pdf)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">You've Got This!</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Remember: Every professional started exactly where you are now. Your lack of experience isn't a weakness—it's 
            an opportunity to show your potential, enthusiasm, and fresh perspective.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Focus on what you <strong>can</strong> offer: your education, your projects, your transferable skills, and 
            your willingness to learn. With a well-crafted CV and genuine enthusiasm, you'll land that first graduate role.
          </p>

          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-gray-600 text-sm">
              <strong>About the Author:</strong> This guide was created by the CV Adapter team, specialists in helping 
              UK graduates create compelling CVs that get interviews. We've helped thousands of university leavers land 
              their first roles at top companies.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link 
            href="/blog"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2025 CV Adapter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
