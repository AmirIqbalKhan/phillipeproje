'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { Mail, Lock, Eye, EyeOff, User, Github, Twitter } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'organizer' | 'admin',
    agreeToTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role.toUpperCase(),
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => router.push('/login'), 1500)
      } else {
        setError(data.error || 'Registration failed.')
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
          alt="Register background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Join EventMingle
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Create your account and start discovering amazing events
          </p>
          
          {/* Register Form */}
          <div className="w-full max-w-sm sm:max-w-md mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <span className="text-white font-bold text-lg sm:text-2xl">EM</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">Create Account</h2>
                <p className="text-white/70 drop-shadow-lg text-sm sm:text-base">Join our community of event enthusiasts</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
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

                {/* Role Selection */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                    Account Type
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/60 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                  >
                    <option value="user">Event Attendee</option>
                    <option value="organizer">Event Organizer</option>
                    <option value="admin">Platform Admin</option>
                  </select>
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
                      placeholder="Create a password"
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
                
                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm sm:text-base"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>
                
                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 bg-black/60 border-white/20 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 text-sm text-white/70 drop-shadow-lg">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-300 hover:text-purple-200 transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-300 hover:text-purple-200 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-60 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
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
                <button className="bg-black/60 border border-white/20 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-black/80 transition-all flex items-center justify-center backdrop-blur-sm text-sm sm:text-base">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  GitHub
                </button>
                <button className="bg-black/60 border border-white/20 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-black/80 transition-all flex items-center justify-center backdrop-blur-sm text-sm sm:text-base">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Twitter
                </button>
              </div>
              
              {/* Sign In Link */}
              <div className="text-center mt-6 sm:mt-8">
                <p className="text-white/70 drop-shadow-lg text-sm sm:text-base">
                  Already have an account?{' '}
                  <Link href="/login" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
                    Sign in
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