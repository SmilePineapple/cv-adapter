import Link from 'next/link'
import { ArrowLeft, BookOpen, Calendar, Clock, ArrowRight, TrendingUp, Target, Lightbulb } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - CV Writing Tips & Career Advice | My CV Buddy',
  description: 'Expert advice on CV writing, ATS optimization, job search strategies, and career development. Learn how to create a winning CV that gets you interviews.',
}

const blogPosts = [
  {
    slug: 'career-change-cv-guide-uk',
    title: 'Career Change CV: How to Switch Industries in the UK (2025)',
    excerpt: 'Complete guide to writing a career change CV. Learn how to highlight transferable skills and land your dream role in a new industry.',
    date: 'November 9, 2025',
    readTime: '12 min read',
    category: 'Career Advice',
    featured: true,
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">CV Writing Blog</h1>
          </div>
          <p className="text-xl text-gray-600">Expert advice on CV writing, ATS optimization, and job search strategies</p>
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 md:p-12 hover:shadow-2xl transition-shadow">
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                ⭐ Featured Post
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 group-hover:underline">{post.title}</h2>
              <p className="text-xl text-blue-100 mb-6">
                {post.excerpt}
              </p>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{post.readTime}</span>
                </div>
              </div>
              <div className="mt-6 inline-flex items-center text-white font-semibold group-hover:gap-3 transition-all">
                Read Full Article
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}

        {/* All Blog Posts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Link 
              key={post.slug}
              href={post.date === 'Coming Soon' ? '#' : `/blog/${post.slug}`}
              className={`block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden ${
                post.date === 'Coming Soon' ? 'opacity-60 cursor-not-allowed' : 'group'
              }`}
            >
              <div className="p-6">
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  {post.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
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
                  <div className="mt-4 inline-flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
                {post.date === 'Coming Soon' && (
                  <div className="mt-4 text-gray-400 font-semibold">
                    Coming Soon
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        {/* Quick Tips Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
            Quick CV Tips
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tailor Every CV</h3>
              <p className="text-sm text-gray-600">Customize for each job application</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Use Numbers</h3>
              <p className="text-sm text-gray-600">Quantify your achievements</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Beat ATS</h3>
              <p className="text-sm text-gray-600">Optimize for tracking systems</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect CV?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let AI do the heavy lifting. CV Adapter tailors your CV to any job in seconds.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/auth/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/templates"
              className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              View Templates
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
