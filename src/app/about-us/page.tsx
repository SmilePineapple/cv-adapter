import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Users, Target, Award, Heart, Mail, Phone, MapPin, CheckCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About MyCVBuddy - Our Mission & Team',
  description: 'Learn about MyCVBuddy\'s mission to revolutionize job applications with AI-powered CV optimization. Meet our team and discover our story.',
  keywords: 'about MyCVBuddy, company mission, team, AI CV optimization, career technology',
}

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About MyCVBuddy
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Our mission is to help job seekers land their dream jobs through AI-powered career tools
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-8 h-8 text-blue-600" />
                  Our Mission
                </h2>
                <p className="text-gray-700 mb-4 text-lg">
                  We believe everyone deserves a career they love. MyCVBuddy was founded to level the playing 
                  field in job applications, giving every candidate the tools to compete effectively in today's 
                  competitive job market.
                </p>
                <p className="text-gray-700 mb-6">
                  Through cutting-edge AI technology, we help job seekers create tailored, optimized resumes 
                  that stand out to both recruiters and Applicant Tracking Systems. Our platform has helped 
                  thousands of candidates land interviews at top companies worldwide.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-1">50,000+</div>
                    <div className="text-sm text-gray-600">Users Helped</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-1">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">AI-Powered Optimization</h3>
                      <p className="text-gray-700 text-sm">Advanced algorithms that match your skills to job requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">ATS-Friendly Results</h3>
                      <p className="text-gray-700 text-sm">Resumes designed to pass automated screening systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Professional Templates</h3>
                      <p className="text-gray-700 text-sm">Industry-tested designs that impress recruiters</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Data Privacy First</h3>
                      <p className="text-gray-700 text-sm">Your information is secure and never shared with third parties</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 text-lg mb-4">
                MyCVBuddy was born from a simple observation: talented people were losing opportunities not because 
                of their skills, but because their resumes weren't effectively communicating their value to both 
                human recruiters and automated systems.
              </p>
              <p className="text-gray-700 text-lg mb-4">
                Our founder, after spending years in recruitment and seeing thousands of resumes, noticed that even 
                highly qualified candidates struggled to get past initial screening. The problem wasn't lack of 
                experience—it was poor resume-job alignment and ATS optimization.
              </p>
              <p className="text-gray-700 text-lg mb-4">
                In 2023, we assembled a team of career experts, AI specialists, and HR professionals to create a 
                solution. Today, MyCVBuddy helps job seekers at all levels—from recent graduates to executives— 
                create resumes that truly represent their capabilities and get them noticed.
              </p>
              <p className="text-gray-700 text-lg">
                We're proud to be part of our users' career journeys, celebrating every interview landed and 
                every dream job secured. Your success is our success.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">User-Centric</h3>
              <p className="text-gray-700">
                Every feature we build is designed with our users' success in mind. Your feedback drives our innovation.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-700">
                We strive for the highest quality in everything we do, from AI algorithms to customer support.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Empathy</h3>
              <p className="text-gray-700">
                We understand the challenges of job searching and are committed to making the journey easier.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Alex Chen</h3>
              <p className="text-gray-600 text-sm mb-2">Founder & CEO</p>
              <p className="text-gray-700 text-sm">
                Former recruiter with 10+ years in tech hiring. Passionate about democratizing career opportunities.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h3>
              <p className="text-gray-600 text-sm mb-2">Head of AI</p>
              <p className="text-gray-700 text-sm">
                PhD in Machine Learning from Stanford. Leading our AI innovation and natural language processing.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Michael Davis</h3>
              <p className="text-gray-600 text-sm mb-2">Lead Engineer</p>
              <p className="text-gray-700 text-sm">
                Full-stack developer with expertise in scalable systems. Ensures our platform runs smoothly 24/7.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Emma Wilson</h3>
              <p className="text-gray-600 text-sm mb-2">Head of Customer Success</p>
              <p className="text-gray-700 text-sm">
                Career coach and HR expert. Dedicated to helping our users achieve their career goals.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "MyCVBuddy transformed my job search. I went from getting no responses to landing 3 interviews 
                in the first week. The AI optimization really works!"
              </p>
              <p className="font-semibold text-gray-900">- Rachel T., Software Engineer</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "As a recent graduate, I was struggling to stand out. MyCVBuddy helped me create a professional 
                resume that got me my dream job at a top company."
              </p>
              <p className="font-semibold text-gray-900">- James L., Marketing Associate</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl mb-8 opacity-90">
              Have questions? We'd love to hear from you. Our team is here to help you succeed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" />
                <span>support@mycvbuddy.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+44 (0) 20 7123 4567</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>London, UK</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contact Us
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/upload"
                className="inline-flex items-center px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try MyCVBuddy
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
