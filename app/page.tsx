import Navigation from '@/components/Navigation'
import CategoryFilter from '@/components/CategoryFilter'
import FeaturedEvents from '@/components/FeaturedEvents'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with solid Unsplash image, now fills to top and behind nav */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80"
          alt="Party background"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1500&q=80'
          }}
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends (darker) */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-32 sm:pt-40 pb-16 sm:pb-24">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white text-center mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-2xl px-2">
            Discover Events, Share Your Own
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl mx-auto text-center drop-shadow-lg px-4">
            Connect with people who share your interests at events that matter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full max-w-md sm:max-w-none px-4">
            <a href="/discover" className="bg-white text-gray-900 font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all text-center min-h-[48px] flex items-center justify-center">
              Discover Events
            </a>
            <a href="/create-event" className="bg-white text-gray-900 font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all text-center min-h-[48px] flex items-center justify-center">
              Create Event
            </a>
          </div>
        </div>
      </section>
      {/* Navigation overlays hero image */}
      <div className="absolute top-0 left-0 w-full z-20">
        <Navigation showDashboard={true} />
      </div>
      {/* Main Content */}
      <div className="relative z-10">
        {/* Category Filter Section with solid Unsplash image */}
        <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1500&q=80"
            alt="Category background"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=80'
            }}
          />
          {/* Dark blur overlay for readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          {/* Top and bottom black blends (darker) */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <CategoryFilter />
          </div>
        </section>
        {/* Featured Events Section with solid Unsplash image */}
        <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
            alt="Featured events background"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1500&q=80'
            }}
          />
          {/* Dark blur overlay for readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          {/* Top and bottom black blends (darker) */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <FeaturedEvents />
          </div>
        </section>
        {/* Community/Join Section with solid Unsplash image */}
        <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1500&q=80"
            alt="Community background"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1500&q=80'
            }}
          />
          {/* Dark blur overlay for readability */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          {/* Top and bottom black blends (darker) */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg">
                Join Our Community
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-white/80 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4">
                Connect with like-minded people, discover new interests, and create unforgettable memories together.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center p-6 sm:p-8 group hover:scale-105 transition-all duration-500 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Connect</h3>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  Meet people who share your interests and passions. Build meaningful connections that last.
                </p>
              </div>
              <div className="text-center p-6 sm:p-8 group hover:scale-105 transition-all duration-500 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Discover</h3>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  Explore new activities, hobbies, and experiences. Step out of your comfort zone and grow.
                </p>
              </div>
              <div className="text-center p-6 sm:p-8 group hover:scale-105 transition-all duration-500 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 sm:col-span-2 lg:col-span-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Create</h3>
                <p className="text-white/70 leading-relaxed text-sm sm:text-base">
                  Host your own events and share your passions with the world. Be the catalyst for amazing experiences.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Footer with top blend */}
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10"></div>
          <Footer />
        </div>
      </div>
    </div>
  )
} 