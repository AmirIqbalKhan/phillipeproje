import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1500&q=80"
          alt="404 background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-purple-400 text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg leading-relaxed px-4">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, 
            or you entered the wrong URL. Let's get you back on track!
          </p>
          
          {/* Navigation Options */}
          <div className="w-full max-w-lg sm:max-w-2xl mx-auto px-4">
            <div className="space-y-4 sm:space-y-6">
              <a 
                href="/" 
                className="block bg-white text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-200 transition-all shadow-lg text-center text-sm sm:text-base lg:text-lg"
              >
                Go to Homepage
              </a>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a 
                  href="/discover" 
                  className="bg-black/40 backdrop-blur-sm text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-black/60 transition-all border border-white/20 text-center text-sm sm:text-base"
                >
                  Discover Events
                </a>
                <a 
                  href="/calendar" 
                  className="bg-black/40 backdrop-blur-sm text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-black/60 transition-all border border-white/20 text-center text-sm sm:text-base"
                >
                  View Calendar
                </a>
                <a 
                  href="/contact" 
                  className="bg-black/40 backdrop-blur-sm text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-black/60 transition-all border border-white/20 text-center text-sm sm:text-base"
                >
                  Contact Support
                </a>
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