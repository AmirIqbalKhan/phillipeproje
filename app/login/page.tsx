'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Mail, Lock, Eye, EyeOff, Github, Twitter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import ClientImage from '@/components/ClientImage'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    })
    setLoading(false)
    if (res?.ok) {
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => router.push('/'), 1200)
    } else {
      setError(res?.error || 'Invalid email or password.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <ClientImage
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1500&q=80"
          alt="Login background"
          className="absolute inset-0 w-full h-full object-cover"
          fallbackSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=80"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Welcome Back
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Sign in to your Event Mashups account
          </p>
          
          {/* Login Form */}
          <div className="w-full max-w-sm sm:max-w-md mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <span className="text-white font-bold text-lg sm:text-2xl">EM</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">Sign In</h2>
                <p className="text-white/70 drop-shadow-lg text-sm sm:text-base">Access your account and start discovering events</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Remember Me & Forgot Password */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 bg-black/60 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-white/70 drop-shadow-lg">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-purple-300 hover:text-purple-200 transition-colors drop-shadow-lg">
                    Forgot password?
                  </Link>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-60 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                {error && <div className="text-center text-red-400 font-semibold mt-2 text-sm sm:text-base">{error}</div>}
                {success && <div className="text-center text-green-400 font-semibold mt-2 text-sm sm:text-base">{success}</div>}
              </form>
              
              {/* Divider */}
              <div className="my-6 sm:my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/50">Or continue with</span>
                  </div>
                </div>
              </div>
              
              {/* Social Login Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button className="bg-black/60 border border-white/20 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-black/80 transition-all flex items-center justify-center backdrop-blur-sm text-sm sm:text-base" onClick={() => signIn('github')}>
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  GitHub
                </button>
                <button className="bg-black/60 border border-white/20 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-black/80 transition-all flex items-center justify-center backdrop-blur-sm text-sm sm:text-base" onClick={() => signIn('twitter')}>
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Twitter
                </button>
                <button className="bg-black/60 border border-white/20 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-black/80 transition-all flex items-center justify-center backdrop-blur-sm text-sm sm:text-base col-span-1 sm:col-span-2" onClick={() => signIn('google')}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21.805 10.023h-9.765v3.955h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.125s2.75-6.125 6.125-6.125c1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.703-1.57-3.898-2.539-6.656-2.539-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.164-.156-1.523z" fill="#FFC107"></path><path d="M3.545 7.441l3.273 2.402c.891-1.523 2.422-2.523 4.187-2.523 1.164 0 2.242.398 3.086 1.164l2.758-2.68c-1.57-1.453-3.594-2.348-5.844-2.348-3.523 0-6.523 2.07-7.93 5.07z" fill="#FF3D00"></path><path d="M12.999 22c2.398 0 4.414-.789 5.883-2.148l-2.727-2.32c-.773.547-1.773.867-3.156.867-2.43 0-4.492-1.641-5.23-3.867l-3.242 2.5c1.43 2.977 4.523 4.968 8.472 4.968z" fill="#4CAF50"></path><path d="M21.805 10.023h-9.765v3.955h5.617c-.242 1.242-1.242 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.125s2.75-6.125 6.125-6.125c1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.703-1.57-3.898-2.539-6.656-2.539-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.164-.156-1.523z" fill="#1976D2"></path></g></svg>
                  Google
                </button>
              </div>
              
              {/* Sign Up Link */}
              <div className="text-center mt-6 sm:mt-8">
                <p className="text-white/70 drop-shadow-lg text-sm sm:text-base">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Navigation overlays hero image */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>
      
      {/* Footer with top blend */}
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10"></div>
        <Footer />
      </div>
    </div>
  )
} 