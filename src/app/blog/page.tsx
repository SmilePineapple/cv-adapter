import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, Clock, ArrowRight, TrendingUp, Target, Lightbulb } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Writing Blog - Expert Tips & Guides UK 2025 | My CV Buddy',
  description: 'Expert CV writing tips, ATS optimization guides, and job search strategies for UK job seekers. Compare CV builders, learn best practices, and create a winning CV that gets interviews.',
  keywords: [
    'CV writing tips',
    'CV builder comparison',
    'ATS optimization',
    'CV templates UK',
    'job search tips',
    'career advice UK',
    'best CV builders',
    'how to write a CV',
    'CV examples'
  ],
}

const blogPosts = [
  {
    slug: 'best-free-cv-builders-uk-2025',
    title: 'Best Free CV Builders UK 2025: Top 10 Compared',
    excerpt: 'Expert comparison of the best free CV builders in the UK. Compare Canva, Resume.io, CV Buddy, and more. Find the perfect free CV maker with ATS optimization.',
    date: 'January 15, 2025',
    readTime: '18 min read',
    category: 'Comparison',
    featured: true,
  },
  {
    slug: 'ats-friendly-cv-builder',
    title: 'ATS-Friendly CV Builder UK: Best Tools for 2025',
    excerpt: 'Compare ATS compatibility scores of top CV builders. My CV Buddy: 95% ATS score vs Canva: 45%. Learn why 75% of CVs get rejected by ATS.',
    date: 'January 15, 2025',
    readTime: '14 min read',
    category: 'ATS Optimization',
    featured: false,
  },
  {
    slug: 'free-cv-builder-no-sign-up',
    title: 'Free CV Builder No Sign Up Required (2025)',
    excerpt: 'The truth about "no sign up" CV builders and why they don\'t work. Find the best minimal-signup alternatives that actually let you download your CV.',
    date: 'January 15, 2025',
    readTime: '10 min read',
    category: 'Guide',
    featured: false,
  },
  {
    slug: 'cv-buddy-vs-canva',
    title: 'CV Buddy vs Canva: Which CV Builder is Better? (2025)',
    excerpt: 'Detailed comparison of CV Buddy vs Canva for CV creation. Compare ATS compatibility (95% vs 45%), features, pricing, and templates.',
    date: 'January 15, 2025',
    readTime: '12 min read',
    category: 'Comparison',
    featured: false,
  },
  {
    slug: 'cv-template-uk-2025',
    title: 'CV Template UK: 10 Free Professional Templates (2025)',
    excerpt: 'Download free professional CV templates optimized for UK job applications. ATS-friendly designs for all industries.',
    date: 'January 8, 2025',
    readTime: '12 min read',
    category: 'CV Templates',
    featured: false,
  },
  {
    slug: 'career-change-cv-guide-uk',
    title: 'Career Change CV: How to Switch Industries in the UK (2025)',
    excerpt: 'Complete guide to writing a career change CV. Learn how to highlight transferable skills and land your dream role in a new industry.',
    date: 'November 9, 2025',
    readTime: '12 min read',
    category: 'Career Advice',
    featured: false,
  },
  {
    slug: 'graduate-cv-no-experience-uk',
    title: 'Graduate CV with No Experience: UK Guide (2025)',
    excerpt: 'How to write a winning graduate CV with no work experience. Expert tips for UK university leavers to land their first job.',
    date: 'November 9, 2025',
    readTime: '10 min read',
    category: 'CV Writing',
    featured: false,
  },
  {
    slug: 'cv-keywords-for-ats-2025',
    title: 'CV Keywords for ATS: Complete List for UK Jobs (2025)',
    excerpt: '500+ ATS-friendly CV keywords for UK job applications. Industry-specific keywords that get your CV past applicant tracking systems.',
    date: 'November 9, 2025',
    readTime: '15 min read',
    category: 'ATS Optimization',
    featured: false,
  },
  {
    slug: 'ai-powered-cv-optimization-2025',
    title: 'AI-Powered CV Optimization: The Future of Job Applications in 2025',
    excerpt: 'Discover how AI is revolutionizing CV writing and job applications. Learn how intelligent CV optimization can boost your interview chances by 3x.',
    date: 'October 29, 2025',
    readTime: '8 min read',
    category: 'AI & Technology',
    featured: false,
  },
  {
    slug: 'ai-cv-generator-guide',
    title: 'AI CV Generator: Complete Guide for 2025',
    excerpt: 'Discover how AI CV generators work and why they\'re revolutionizing job applications. Create professional, ATS-optimized CVs in minutes.',
    date: 'October 21, 2025',
    readTime: '10 min read',
    category: 'AI & Technology',
    featured: false,
  },
  {
    slug: 'resume-vs-cv-difference',
    title: 'Resume vs CV: What\'s the Difference?',
    excerpt: 'Applying for jobs in the US vs UK? Understand the key differences between a resume and CV and when to use each.',
    date: 'October 21, 2025',
    readTime: '7 min read',
    category: 'Career Advice',
    featured: false,
  },
  {
    slug: 'how-to-beat-ats-systems',
    title: 'How to Beat ATS Systems: Complete Guide for 2025',
    excerpt: 'Learn exactly how Applicant Tracking Systems work and discover proven strategies to get your CV past the bots and into human hands.',
    date: 'October 15, 2025',
    readTime: '8 min read',
    category: 'ATS Optimization',
    featured: false,
  },
  {
    slug: 'cv-writing-tips',
    title: 'CV Writing Tips & Best Practices',
    excerpt: 'Expert advice to create a winning CV that gets you interviews. Learn the 6-second rule and proven strategies.',
    date: 'October 10, 2025',
    readTime: '6 min read',
    category: 'CV Writing',
    featured: false,
  },
  {
    slug: 'cv-examples-by-industry-uk',
    title: 'CV Examples: 15 Winning CVs by Industry (UK 2025)',
    excerpt: 'Real CV examples for UK jobs across 15 industries. See what works and adapt these proven templates for your applications.',
    date: 'January 8, 2025',
    readTime: '16 min read',
    category: 'CV Examples',
    featured: false,
  },
  {
    slug: 'professional-cv-how-to-create',
    title: 'Professional CV: How to Create One That Gets Interviews (2025)',
    excerpt: 'Complete guide to creating a professional CV for UK jobs. Learn formatting, content, and design tips that impress recruiters.',
    date: 'January 8, 2025',
    readTime: '15 min read',
    category: 'CV Writing',
    featured: false,
  },
  {
    slug: 'cv-skills-section-guide',
    title: 'CV Skills Section: What to Include + Examples (UK 2025)',
    excerpt: 'Complete guide to writing a CV skills section that impresses recruiters. Learn which skills to include and see real examples.',
    date: 'January 8, 2025',
    readTime: '11 min read',
    category: 'CV Writing',
    featured: false,
  },
  {
    slug: 'first-job-cv-no-experience',
    title: 'First Job CV: How to Write One with No Experience (UK 2025)',
    excerpt: 'Complete guide to writing your first CV with no work experience. Learn what to include and see real examples.',
    date: 'January 8, 2025',
    readTime: '13 min read',
    category: 'Entry Level',
    featured: false,
  },
  {
    slug: 'cv-format-best-layouts-uk',
    title: 'CV Format: Best Layouts for UK Jobs (2025 Guide)',
    excerpt: 'Complete guide to CV formatting for UK job applications. Learn the best layouts, fonts, and design tips.',
    date: 'January 8, 2025',
    readTime: '14 min read',
    category: 'CV Formatting',
    featured: false,
  },
  {
    slug: 'what-to-put-on-cv-complete-guide',
    title: 'What to Put on a CV: Complete Guide for UK Jobs (2025)',
    excerpt: 'Comprehensive guide to what you should (and shouldn\'t) include on your CV. Learn exactly what to put on a CV with examples.',
    date: 'January 8, 2025',
    readTime: '16 min read',
    category: 'CV Content',
    featured: false,
  },
  {
    slug: 'tailor-cv-to-job-description',
    title: 'How to Tailor Your CV to a Job Description',
    excerpt: 'Step-by-step guide to customizing your CV for each application. Increase your interview chances by 3x.',
    date: 'Coming Soon',
    readTime: '7 min read',
    category: 'Job Search',
    featured: false,
  },
]

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-400" />
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">CV Writing Blog</h1>
          </div>
          <p className="text-xl text-gray-400">Expert advice on CV writing, ATS optimization, and job search strategies</p>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <Link 
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block mb-12 group"
          >
            <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-white/10 rounded-3xl p-8 md:p-12 hover:border-white/20 transition-all relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-black mb-4">
                  ⭐ Featured Post
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-4 group-hover:text-gray-300 transition-colors tracking-tight">{post.title}</h2>
                <p className="text-xl text-gray-300 mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{post.readTime}</span>
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center text-white font-black group-hover:gap-3 transition-all">
                  Read Full Article
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* All Blog Posts */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-6">Latest Articles</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Link 
              key={post.slug}
              href={post.date === 'Coming Soon' ? '#' : `/blog/${post.slug}`}
              className={`block bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all overflow-hidden ${
                post.date === 'Coming Soon' ? 'opacity-60 cursor-not-allowed' : 'group'
              }`}
            >
              <div className="p-6">
                <div className="inline-block bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-black mb-4">
                  {post.category}
                </div>
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-gray-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                {post.date !== 'Coming Soon' && (
                  <div className="mt-4 inline-flex items-center text-blue-400 font-black group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                {post.date === 'Coming Soon' && (
                  <div className="mt-4 text-gray-600 font-bold">
                    Coming Soon
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        {/* Quick Tips Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 text-yellow-400 mr-3" />
            Quick CV Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-black text-white mb-2">Tailor Every CV</h3>
              <p className="text-sm text-gray-400">Customize for each job application</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-black text-white mb-2">Use Numbers</h3>
              <p className="text-sm text-gray-400">Quantify your achievements</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-black text-white mb-2">Beat ATS</h3>
              <p className="text-sm text-gray-400">Optimize for tracking systems</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Ready to Create Your Perfect CV?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Let AI do the heavy lifting. My CV Buddy tailors your CV to any job in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/auth/signup"
                className="bg-white text-black px-8 py-4 rounded-full font-black hover:bg-gray-100 transition-all shadow-lg"
              >
                Get Started
              </Link>
              <Link 
                href="/templates"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-black hover:bg-white/20 transition-all"
              >
                View Templates
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
