"use client"

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    if (step === 'email') {
      try {
        const res = await fetch("/api/auth/resend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess("OTP sent to your email. Please check your inbox.");
          setStep('otp');
        } else {
          setError(data.error || "Failed to send OTP.");
        }
      } catch (err) {
        setError("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (step === 'otp') {
      if (!otp) {
        setError('Please enter the OTP.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess('OTP verified. Please enter your new password.');
          setStep('reset');
        } else {
          setError(data.error || 'Invalid or expired OTP.');
        }
      } catch (err) {
        setError('Failed to verify OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (step === 'reset') {
      if (!newPassword || !confirmPassword) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, newPassword }),
        });
        const data = await res.json();
        if (res.ok) {
          setSuccess('Password reset successful! You can now log in.');
        } else {
          setError(data.error || 'Failed to reset password.');
        }
      } catch (err) {
        setError('Failed to reset password. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
          alt="Forgot password background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white text-center mb-4 sm:mb-6 leading-tight drop-shadow-2xl px-2">
            Forgot Password
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-xl mx-auto text-center drop-shadow-lg px-4">
            Enter your email address and we'll send you a one-time password (OTP) to reset your password.
          </p>
          <div className="w-full max-w-sm sm:max-w-md mx-auto px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 'email' && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                )}
                {step === 'otp' && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                      OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm"
                      placeholder="Enter the OTP sent to your email"
                    />
                  </div>
                )}
                {step === 'reset' && (
                  <>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2 drop-shadow-lg">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 backdrop-blur-sm text-sm"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg disabled:opacity-60 text-sm"
                  disabled={loading}
                >
                  {loading ? (step === 'email' ? "Sending..." : step === 'otp' ? "Verifying..." : "Resetting...") : (step === 'email' ? "Send OTP" : step === 'otp' ? "Verify OTP" : "Reset Password")}
                </button>
                {error && <div className="text-center text-red-400 font-semibold mt-2 text-sm">{error}</div>}
                {success && <div className="text-center text-green-400 font-semibold mt-2 text-sm">{success}</div>}
              </form>
              <div className="text-center mt-6">
                <p className="text-white/70 drop-shadow-lg text-sm">
                  Remembered your password?{' '}
                  <Link href="/login" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation />
      </div>
      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10"></div>
        <Footer />
      </div>
    </div>
  );
} 