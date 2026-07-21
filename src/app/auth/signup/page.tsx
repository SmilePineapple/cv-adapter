import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="inline-flex items-center space-x-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-lg">CV</span>
          </div>
          <span className="text-2xl font-black tracking-tight">My CV Buddy</span>
        </Link>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
            We&apos;re making improvements
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            New sign-ups are temporarily paused while we roll out some site improvements.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            We expect to be back to normal soon — thanks for your patience.
          </p>

          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-white hover:text-gray-300 font-bold transition-colors">
              Sign in
            </Link>
          </div>

          <div className="mt-3 text-center text-sm text-gray-400">
            Questions?{' '}
            <Link href="/contact" className="text-white hover:text-gray-300 font-bold transition-colors">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
