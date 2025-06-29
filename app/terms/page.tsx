import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1500&q=80"
          alt="Terms background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-40 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            Terms of Service
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Please read these terms carefully before using our platform
          </p>
          
          {/* Terms Content */}
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">1. Acceptance of Terms</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg">
                By accessing and using EventMingle, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">2. Use License</h2>
              <p className="text-white/80 leading-relaxed mb-4 drop-shadow-lg">
                Permission is granted to temporarily download one copy of EventMingle for personal, non-commercial transitory viewing only. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="text-white/80 space-y-2 ml-6 text-lg">
                <li>• Modify or copy the materials</li>
                <li>• Use the materials for any commercial purpose or for any public display</li>
                <li>• Attempt to reverse engineer any software contained on EventMingle</li>
                <li>• Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">3. User Responsibilities</h2>
              <p className="text-white/80 leading-relaxed mb-4 drop-shadow-lg">As a user of EventMingle, you agree to:</p>
              <ul className="text-white/80 space-y-2 ml-6 text-lg">
                <li>• Provide accurate and complete information</li>
                <li>• Maintain the security of your account</li>
                <li>• Not use the service for any illegal or unauthorized purpose</li>
                <li>• Respect the rights and privacy of other users</li>
                <li>• Not post content that is harmful, offensive, or violates any laws</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">4. Event Creation and Management</h2>
              <p className="text-white/80 leading-relaxed mb-4 drop-shadow-lg">
                When creating events on EventMingle, you agree to:
              </p>
              <ul className="text-white/80 space-y-2 ml-6 text-lg">
                <li>• Provide accurate event information</li>
                <li>• Comply with all applicable laws and regulations</li>
                <li>• Ensure events are safe and appropriate for all attendees</li>
                <li>• Handle attendee data responsibly and in compliance with privacy laws</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">5. Privacy Policy</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                to understand our practices regarding the collection and use of your information.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">6. Disclaimers</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg">
                The materials on EventMingle are provided on an 'as is' basis. EventMingle makes no warranties, expressed or implied, 
                and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of 
                merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">7. Limitations</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg">
                In no event shall EventMingle or its suppliers be liable for any damages (including, without limitation, damages for loss 
                of data or profit, or due to business interruption) arising out of the use or inability to use the materials on EventMingle, 
                even if EventMingle or a EventMingle authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg">8. Contact Information</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg">
                If you have any questions about these Terms of Service, please contact us through our Contact page.
              </p>
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