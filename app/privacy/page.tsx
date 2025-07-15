import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1500&q=80"
          alt="Privacy background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Privacy Policy
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Your privacy is important to us. Learn how we protect your information.
          </p>
          
          {/* Privacy Content */}
          <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">1. Information We Collect</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-300 drop-shadow-lg">Personal Information</h3>
                  <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                    We collect information you provide directly to us, such as when you create an account, 
                    create an event, or contact us. This may include your name, email address, and interests.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-300 drop-shadow-lg">Usage Information</h3>
                  <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                    We automatically collect certain information about your use of Event Mashups, including 
                    your IP address, browser type, and pages you visit.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">2. How We Use Your Information</h2>
              <p className="text-white/80 leading-relaxed mb-3 sm:mb-4 drop-shadow-lg text-sm sm:text-base">We use the information we collect to:</p>
              <ul className="text-white/80 space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base lg:text-lg">
                <li>• Provide, maintain, and improve our services</li>
                <li>• Process and manage your event registrations</li>
                <li>• Send you important updates and notifications</li>
                <li>• Respond to your comments and questions</li>
                <li>• Detect and prevent fraud and abuse</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">3. Information Sharing</h2>
              <p className="text-white/80 leading-relaxed mb-3 sm:mb-4 drop-shadow-lg text-sm sm:text-base">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
              </p>
              <ul className="text-white/80 space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base lg:text-lg">
                <li>• With your explicit permission</li>
                <li>• To comply with legal requirements</li>
                <li>• To protect our rights and safety</li>
                <li>• With service providers who assist in our operations</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">4. Data Security</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">5. Your Rights</h2>
              <p className="text-white/80 leading-relaxed mb-3 sm:mb-4 drop-shadow-lg text-sm sm:text-base">You have the right to:</p>
              <ul className="text-white/80 space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base lg:text-lg">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate information</li>
                <li>• Request deletion of your information</li>
                <li>• Opt out of marketing communications</li>
                <li>• Export your data</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">6. Cookies and Tracking</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">7. Children's Privacy</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                Event Mashups is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected such information, 
                please contact us immediately.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">8. Changes to This Policy</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">9. Contact Us</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                If you have any questions about this Privacy Policy, please contact us through our Contact page.
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