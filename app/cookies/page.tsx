import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function CookiesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1500&q=80"
          alt="Cookies background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Cookie Policy
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Learn how we use cookies to enhance your experience
          </p>
          
          {/* Cookies Content */}
          <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">What Are Cookies?</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                Cookies are small text files that are placed on your device when you visit a website. 
                They help us provide you with a better experience by remembering your preferences, 
                analyzing how you use our site, and personalizing content.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">How We Use Cookies</h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-300 drop-shadow-lg">Essential Cookies</h3>
                  <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                    These cookies are necessary for the website to function properly. They enable basic functions 
                    like page navigation, access to secure areas, and form submissions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-300 drop-shadow-lg">Performance Cookies</h3>
                  <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                    These cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously. This helps us improve our site's performance.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-300 drop-shadow-lg">Functional Cookies</h3>
                  <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                    These cookies enable enhanced functionality and personalization, such as remembering 
                    your preferences and settings.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-300 drop-shadow-lg">Analytics Cookies</h3>
                  <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                    These cookies help us understand how our website is being used and how we can improve it. 
                    They collect information about your browsing patterns and preferences.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">Types of Cookies We Use</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-black/20 rounded-lg p-3 sm:p-4 border border-white/10">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-white drop-shadow-lg">Session Cookies</h3>
                  <p className="text-white/80 drop-shadow-lg text-sm sm:text-base">Temporary cookies that are deleted when you close your browser.</p>
                </div>
                <div className="bg-black/20 rounded-lg p-3 sm:p-4 border border-white/10">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-white drop-shadow-lg">Persistent Cookies</h3>
                  <p className="text-white/80 drop-shadow-lg text-sm sm:text-base">Cookies that remain on your device for a set period or until you delete them.</p>
                </div>
                <div className="bg-black/20 rounded-lg p-3 sm:p-4 border border-white/10">
                  <h3 className="text-base sm:text-lg font-semibold mb-2 text-white drop-shadow-lg">Third-Party Cookies</h3>
                  <p className="text-white/80 drop-shadow-lg text-sm sm:text-base">Cookies set by third-party services we use, such as analytics providers.</p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">Managing Your Cookie Preferences</h2>
              <p className="text-white/80 leading-relaxed mb-3 sm:mb-4 drop-shadow-lg text-sm sm:text-base">
                You can control and manage cookies in several ways:
              </p>
              <ul className="text-white/80 space-y-1 sm:space-y-2 ml-4 sm:ml-6 text-sm sm:text-base lg:text-lg">
                <li>• Browser settings: Most browsers allow you to block or delete cookies</li>
                <li>• Cookie consent: We will ask for your consent before setting non-essential cookies</li>
                <li>• Opt-out tools: You can use browser extensions to manage cookies</li>
                <li>• Contact us: Reach out if you have questions about our cookie usage</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">Cookie Retention</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                The length of time cookies remain on your device depends on their type:
              </p>
              <ul className="text-white/80 space-y-1 sm:space-y-2 ml-4 sm:ml-6 mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg">
                <li>• Session cookies: Deleted when you close your browser</li>
                <li>• Persistent cookies: Typically remain for 1-2 years</li>
                <li>• Analytics cookies: Usually expire after 2 years</li>
              </ul>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">Updates to This Policy</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons. We will notify you of any 
                significant changes by posting the updated policy on our website.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-white/20">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4 drop-shadow-lg">Contact Us</h2>
              <p className="text-white/80 leading-relaxed drop-shadow-lg text-sm sm:text-base">
                If you have any questions about our use of cookies or this Cookie Policy, 
                please contact us through our Contact page.
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