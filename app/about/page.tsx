import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Section with background image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1500&q=80"
          alt="About background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark blur overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        {/* Top and bottom black blends */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/95 to-transparent pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/95 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 pt-40 pb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-8 leading-tight drop-shadow-2xl">
            About EventMingle
          </h1>
          <p className="text-2xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto text-center drop-shadow-lg">
            Bringing people together through the power of events
          </p>
          
          {/* About Content */}
          <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Mission Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">Our Mission</h2>
              <p className="text-lg text-white/80 leading-relaxed drop-shadow-lg">
                EventMingle is on a mission to bring people together through the power of events. 
                We believe that meaningful connections happen when people gather, share experiences, 
                and create memories together. Our platform makes it easy to discover, create, and 
                participate in events that matter to you.
              </p>
            </div>

            {/* What We Do Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">What We Do</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-purple-300 drop-shadow-lg">For Event Goers</h3>
                  <ul className="text-white/80 space-y-3 text-lg">
                    <li className="flex items-center">
                      <span className="text-purple-300 mr-3">•</span>
                      Discover amazing events in your area
                    </li>
                    <li className="flex items-center">
                      <span className="text-purple-300 mr-3">•</span>
                      Connect with like-minded people
                    </li>
                    <li className="flex items-center">
                      <span className="text-purple-300 mr-3">•</span>
                      Join real-time conversations
                    </li>
                    <li className="flex items-center">
                      <span className="text-purple-300 mr-3">•</span>
                      Never miss an event with our calendar
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-purple-300 drop-shadow-lg">For Event Creators</h3>
                  <ul className="text-white/80 space-y-3 text-lg">
                    <li className="flex items-center">
                      <span className="text-purple-300 mr-3">•</span>
                      Create and promote your events easily
                    </li>
                    <li className="flex items-center">
                      <span className="text-purple-300 mr-3">•</span>
                      Reach your target audience
                    </li>
                    <li className="flex items-center">
                      <span className="text-purple-300 mr-3">•</span>
                      Manage RSVPs and attendees
                    </li>
                    <li className="flex items-center">
                      <span className="text-purple-300 mr-3">•</span>
                      Build a community around your events
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4 text-purple-300 drop-shadow-lg">Community</h3>
                  <p className="text-white/80 text-lg">Building meaningful connections and fostering inclusive communities.</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4 text-purple-300 drop-shadow-lg">Innovation</h3>
                  <p className="text-white/80 text-lg">Continuously improving our platform with cutting-edge technology.</p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4 text-purple-300 drop-shadow-lg">Authenticity</h3>
                  <p className="text-white/80 text-lg">Promoting genuine experiences and real human connections.</p>
                </div>
              </div>
            </div>

            {/* Join Us Section */}
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
              <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">Join Us</h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-3xl mx-auto drop-shadow-lg">
                Whether you're looking to discover your next adventure or create an unforgettable experience, 
                EventMingle is here to help you connect with the world around you. Start exploring events 
                today and become part of our growing community!
              </p>
              <a href="/discover" className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-200 transition-all shadow-lg text-lg inline-block">
                Start Discovering
              </a>
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