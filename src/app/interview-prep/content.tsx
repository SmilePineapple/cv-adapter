import Link from 'next/link'
import { CheckCircle, Target, Lightbulb, Award, TrendingUp, Users } from 'lucide-react'

export function InterviewPrepContent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-5xl font-black text-white mb-6">Interview Preparation Guide 2026</h1>
        
        <p className="text-xl text-white mb-8">
          Master your next job interview with our comprehensive preparation guide. Learn proven strategies, practice common questions, and boost your confidence.
        </p>

        {/* Common Interview Questions */}
        <section className="mb-12">
          <h2 className="text-4xl font-black text-white mb-6">50 Most Common Interview Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-3">1. Tell me about yourself</h3>
              <p className="text-white mb-3">
                <strong>Strategy:</strong> Use the Present-Past-Future formula. Start with your current role, briefly mention relevant past experience, and explain why you're excited about this opportunity.
              </p>
              <p className="text-white italic">
                Example: "I'm currently a Marketing Manager at TechCo, where I've increased organic traffic by 200% over the past year. Previously, I spent 3 years in digital marketing at StartupX, developing my skills in SEO and content strategy. I'm excited about this role because it combines my passion for data-driven marketing with the opportunity to work in the fintech space."
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-3">2. What are your greatest strengths?</h3>
              <p className="text-white mb-3">
                <strong>Strategy:</strong> Choose 2-3 strengths relevant to the job. Back each with a specific example and quantified result.
              </p>
              <p className="text-white italic">
                Example: "My greatest strength is problem-solving. For instance, when our team faced a 30% drop in conversion rates, I analyzed user behavior data, identified friction points, and implemented A/B tests that increased conversions by 45% within 2 months."
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-3">3. What is your greatest weakness?</h3>
              <p className="text-white mb-3">
                <strong>Strategy:</strong> Choose a real weakness that's not critical to the role. Explain what you're doing to improve it.
              </p>
              <p className="text-white italic">
                Example: "I sometimes focus too much on perfecting details, which can slow me down. I've been working on this by setting strict time limits for tasks and using the 80/20 rule to prioritize what truly needs perfection versus what just needs to be good enough."
              </p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-3">4. Why do you want to work here?</h3>
              <p className="text-white mb-3">
                <strong>Strategy:</strong> Research the company thoroughly. Mention specific aspects that align with your values and career goals.
              </p>
              <p className="text-white italic">
                Example: "I'm impressed by your company's commitment to sustainability and innovation in the renewable energy sector. Your recent project in solar technology aligns perfectly with my background in engineering and my passion for environmental impact. I'm particularly excited about the opportunity to work on the SmartGrid initiative."
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-black text-white mb-3">5. Where do you see yourself in 5 years?</h3>
              <p className="text-white mb-3">
                <strong>Strategy:</strong> Show ambition while staying realistic. Align your goals with potential growth at the company.
              </p>
              <p className="text-white italic">
                Example: "In 5 years, I see myself as a senior team leader, having developed deep expertise in this field and mentored junior team members. I'm excited about the growth opportunities here and would love to progress from this role to eventually lead strategic initiatives."
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white/5 p-6 rounded-lg">
            <h4 className="font-black text-white mb-4">More Common Questions:</h4>
            <ul className="grid md:grid-cols-2 gap-3">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">Why are you leaving your current job?</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">Describe a challenging situation you faced</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">How do you handle stress and pressure?</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">What are your salary expectations?</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">Tell me about a time you failed</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">How do you prioritize your work?</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">Describe your ideal work environment</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-white">What motivates you?</span>
              </li>
            </ul>
          </div>
        </section>

        {/* STAR Method */}
        <section className="mb-12">
          <h2 className="text-4xl font-black text-white mb-6">The STAR Method for Behavioral Questions</h2>
          
          <p className="text-white mb-6">
            The STAR method is the gold standard for answering behavioral interview questions. It provides a structured way to tell compelling stories about your experience.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">S - Situation</h3>
              <p className="text-blue-800">Set the context. Describe the challenge or situation you faced. Be specific but concise.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">T - Task</h3>
              <p className="text-green-800">Explain your responsibility. What was your role? What needed to be accomplished?</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2">A - Action</h3>
              <p className="text-purple-800">Detail the specific actions YOU took. Focus on your contributions, not the team's.</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-2">R - Result</h3>
              <p className="text-yellow-800">Share the outcome. Quantify results when possible. What did you learn?</p>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-lg">
            <h4 className="font-black text-white mb-3">STAR Method Example:</h4>
            <p className="text-white mb-2"><strong>Question:</strong> "Tell me about a time you had to meet a tight deadline."</p>
            <div className="space-y-3 mt-4">
              <p className="text-white">
                <strong className="text-blue-400">Situation:</strong> "Our biggest client requested a complete website redesign with only 3 weeks notice before their product launch."
              </p>
              <p className="text-white">
                <strong className="text-green-400">Task:</strong> "As the lead designer, I needed to deliver a fully functional, mobile-responsive site that met their brand guidelines and technical requirements."
              </p>
              <p className="text-white">
                <strong className="text-purple-400">Action:</strong> "I immediately broke the project into daily milestones, delegated specific components to team members based on their strengths, and set up daily 15-minute standups to track progress. I personally handled the most complex features and worked evenings to ensure quality."
              </p>
              <p className="text-white">
                <strong className="text-yellow-400">Result:</strong> "We delivered the site 2 days early. The client was thrilled, their product launch was successful, and they increased their contract value by 40%. This experience taught me the importance of clear communication and strategic delegation under pressure."
              </p>
            </div>
          </div>
        </section>

        {/* Interview Preparation Checklist */}
        <section className="mb-12">
          <h2 className="text-4xl font-black text-white mb-6">Interview Preparation Checklist</h2>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 border-2 border-blue-200 p-6 rounded-lg">
              <h3 className="font-black text-white mb-4">1 Week Before</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Research the company thoroughly (website, news, social media)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Review the job description and match your experience to requirements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Prepare 5-7 STAR stories covering different competencies</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Research your interviewers on LinkedIn</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 border-2 border-green-200 p-6 rounded-lg">
              <h3 className="font-black text-white mb-4">1 Day Before</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Practice answers out loud (not just in your head)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Prepare 3-5 thoughtful questions to ask the interviewer</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Choose and prepare your outfit</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Print multiple copies of your CV</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Plan your route and timing (arrive 10-15 minutes early)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 border-2 border-purple-200 p-6 rounded-lg">
              <h3 className="font-black text-white mb-4">Day Of Interview</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Eat a good breakfast and stay hydrated</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Review your key talking points</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Bring: CV copies, notepad, pen, portfolio (if relevant)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Turn off phone notifications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Practice power poses for 2 minutes before entering</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Questions to Ask */}
        <section className="mb-12">
          <h2 className="text-4xl font-black text-white mb-6">Smart Questions to Ask the Interviewer</h2>
          
          <p className="text-white mb-6">
            Asking thoughtful questions shows genuine interest and helps you evaluate if the role is right for you. Prepare 5-7 questions and choose 3-4 based on what's been discussed.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3">About the Role</h3>
              <ul className="space-y-2 text-blue-800">
                <li>• What does success look like in this role after 6 months?</li>
                <li>• What are the biggest challenges facing the team right now?</li>
                <li>• How is performance measured and reviewed?</li>
                <li>• What's a typical day/week like in this position?</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-bold text-green-900 mb-3">About the Team</h3>
              <ul className="space-y-2 text-green-800">
                <li>• Can you tell me about the team I'd be working with?</li>
                <li>• How does the team collaborate on projects?</li>
                <li>• What's the management style like?</li>
                <li>• How does the company support professional development?</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-3">About the Company</h3>
              <ul className="space-y-2 text-purple-800">
                <li>• What are the company's goals for the next year?</li>
                <li>• How has the company changed in the past few years?</li>
                <li>• What do you enjoy most about working here?</li>
                <li>• How does the company support work-life balance?</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-bold text-yellow-900 mb-3">About Next Steps</h3>
              <ul className="space-y-2 text-yellow-800">
                <li>• What are the next steps in the interview process?</li>
                <li>• When can I expect to hear back?</li>
                <li>• Is there anything else I can provide to help with your decision?</li>
                <li>• Are there any concerns about my application I can address?</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-800 font-semibold mb-2">❌ Questions to AVOID:</p>
            <ul className="text-red-700 space-y-1">
              <li>• What does your company do? (shows lack of research)</li>
              <li>• How much vacation time do I get? (ask after offer)</li>
              <li>• Can I work from home? (ask after offer)</li>
              <li>• When can I get promoted? (too presumptuous)</li>
            </ul>
          </div>
        </section>

        {/* Related Resources */}
        <section className="mb-12">
          <h2 className="text-4xl font-black text-white mb-6">Related Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/cv-writing-guide" className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-white/10">
              <Target className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">CV Writing Guide</h3>
              <p className="text-white mb-4">Create a CV that gets you interviews.</p>
              <span className="text-blue-400 font-semibold">Read Guide →</span>
            </Link>
            <Link href="/cv-examples" className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-white/10">
              <Award className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">CV Examples</h3>
              <p className="text-white mb-4">15+ industry-specific CV examples.</p>
              <span className="text-blue-400 font-semibold">View Examples →</span>
            </Link>
            <Link href="/cover-letter" className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-white/10">
              <Lightbulb className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-black text-white mb-2">Cover Letter Generator</h3>
              <p className="text-white mb-4">AI-powered cover letter creation.</p>
              <span className="text-blue-400 font-semibold">Create Letter →</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
