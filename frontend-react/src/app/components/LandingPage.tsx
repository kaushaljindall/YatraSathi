import { motion } from "motion/react";
import { Sparkles, TrendingUp, Globe, Zap, ArrowRight, Star, MapPin, Users, Shield, Award, Heart, CheckCircle2, Calendar, Compass, Camera } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 -right-20 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a620_1px,transparent_1px),linear-gradient(to_bottom,#14b8a620_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        {/* Decorative Shapes */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 right-1/4 w-64 h-64 border-4 border-teal-300/20 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 left-1/3 w-80 h-80 border-4 border-cyan-300/20 rounded-3xl"
        />

        {/* Floating Elements */}
        {["🏝️", "🏔️", "🏖️", "🎒", "✈️", "🗺️"].map((emoji, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            className="absolute text-5xl opacity-20"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Enhanced Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border-2 border-teal-200/50 shadow-xl px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-2xl">✈️</span>
                  </div>
                </div>
                <div>
                  <h1 className="font-black text-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    YatraSaathi
                  </h1>
                  <p className="text-xs font-bold text-teal-600/70">Your AI Travel Buddy</p>
                </div>
              </motion.div>

              <div className="hidden md:flex items-center gap-6">
                {["Features", "How it Works", "Pricing", "Testimonials"].map((item, i) => (
                  <motion.a
                    key={item}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-slate-700 font-bold hover:text-teal-600 transition-colors relative group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                  </motion.a>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={onGetStarted}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
              >
                Get Started Free 🚀
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-100 to-cyan-100 border-2 border-teal-300 rounded-full mb-6 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-bold text-teal-700">Trusted by 50,000+ Travelers Worldwide</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95]">
              <span className="block text-slate-900">Your Journey,</span>
              <span className="block bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Perfected by AI
              </span>
              <span className="block text-slate-700 text-5xl md:text-6xl mt-2">in Seconds ⚡</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-xl font-medium leading-relaxed">
              Experience the future of travel planning. Smart itineraries, real-time insights,
              and personalized recommendations - all powered by advanced AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="group px-10 py-5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-teal-500/50 hover:scale-105 transition-all flex items-center justify-center gap-3 text-lg"
              >
                Start Planning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <button className="px-10 py-5 bg-white/80 backdrop-blur-xl border-2 border-teal-300 text-slate-900 font-black rounded-2xl hover:bg-white hover:border-teal-400 transition-all shadow-lg text-lg">
                See How It Works 🎥
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 mt-10 pt-10 border-t-2 border-teal-200">
              <p className="text-sm font-bold text-slate-600">TRUSTED BY:</p>
              {["Google", "Airbnb", "Booking.com", "TripAdvisor"].map((brand, i) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="px-4 py-2 bg-white rounded-lg shadow-md border border-teal-200"
                >
                  <p className="font-black text-slate-700 text-sm">{brand}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            {/* Main Dashboard Preview Card */}
            <div className="relative">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative bg-gradient-to-br from-white to-teal-50 rounded-3xl shadow-2xl border-4 border-teal-200 p-8 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20"></div>

                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                        🎯
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-xl">Bali Adventure</h3>
                        <p className="text-teal-600 font-bold text-sm">AI-Optimized Trip</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full text-white text-xs font-black">
                      LIVE
                    </div>
                  </div>

                  {/* Trip Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Days", value: "7", icon: "📅", color: "from-teal-500 to-cyan-500" },
                      { label: "Budget", value: "$1.8K", icon: "💰", color: "from-cyan-500 to-blue-500" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + i * 0.2 }}
                        className={`p-4 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg`}
                      >
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-2xl font-black text-white">{stat.value}</div>
                        <div className="text-xs text-white/80 font-bold">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Activity Preview */}
                  <div className="space-y-3">
                    {[
                      { time: "9:00 AM", activity: "Beach Yoga Session", icon: "🧘" },
                      { time: "2:00 PM", activity: "Temple Exploration", icon: "⛩️" },
                      { time: "6:00 PM", activity: "Sunset Cruise", icon: "🌅" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.3 + i * 0.15 }}
                        className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-xl rounded-xl border-2 border-teal-200 hover:scale-105 transition-transform"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="font-black text-slate-900 text-sm">{item.activity}</p>
                          <p className="text-xs text-teal-600 font-bold">{item.time}</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-teal-500" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-teal-200">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm font-black text-slate-700">98% Match</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Stat Cards */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 3, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-2xl border-2 border-purple-300 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 mb-0.5">You Saved</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">$680</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, -3, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-2xl border-2 border-blue-300 p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 mb-0.5">Travelers</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">50K+</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 bg-white/60 backdrop-blur-xl py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-100 to-cyan-100 border-2 border-teal-300 rounded-full mb-6"
            >
              <Zap className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-bold text-teal-700">Powerful Features</span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-slate-900">
              Everything You Need for
            </h2>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              The Perfect Journey
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto">
              From AI-powered planning to real-time insights, we've built the ultimate travel companion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI Trip Planning",
                desc: "Get personalized itineraries crafted by advanced AI in seconds",
                gradient: "from-teal-500 to-cyan-600",
                features: ["Smart recommendations", "Instant itineraries", "Preference learning"]
              },
              {
                icon: "💰",
                title: "Smart Budgeting",
                desc: "Track expenses, predict costs, and get savings suggestions",
                gradient: "from-cyan-600 to-blue-600",
                features: ["Real-time tracking", "Cost predictions", "Money-saving tips"]
              },
              {
                icon: "🌤️",
                title: "Weather Intelligence",
                desc: "AI-powered weather insights with activity recommendations",
                gradient: "from-blue-500 to-purple-500",
                features: ["7-day forecasts", "Smart alerts", "Activity planning"]
              },
              {
                icon: "📍",
                title: "Local Discovery",
                desc: "Uncover hidden gems with RAG-based city intelligence",
                gradient: "from-purple-600 to-pink-500",
                features: ["Hidden spots", "Local tips", "Cultural insights"]
              },
              {
                icon: "📊",
                title: "Predictive Analytics",
                desc: "ML-powered insights for optimal travel timing and budgeting",
                gradient: "from-pink-500 to-teal-500",
                features: ["Best time to visit", "Crowd predictions", "Price trends"]
              },
              {
                icon: "🎯",
                title: "100% Personalized",
                desc: "Every recommendation tailored to your unique preferences",
                gradient: "from-teal-600 to-cyan-600",
                features: ["Custom matching", "Learning AI", "Adaptive plans"]
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-white rounded-3xl p-8 border-2 border-teal-200 hover:border-teal-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 font-medium mb-6 leading-relaxed">{feature.desc}</p>

                  <div className="space-y-2">
                    {feature.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-teal-500" />
                        <span className="font-semibold text-slate-700">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-slate-900">
              Plan Your Trip in
            </h2>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              3 Simple Steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 opacity-20"></div>

            {[
              {
                step: "01",
                title: "Tell Us Your Dream",
                desc: "Share your destination, dates, budget, and travel style",
                icon: "💭",
                color: "from-teal-500 to-cyan-500"
              },
              {
                step: "02",
                title: "AI Works Magic",
                desc: "Our AI analyzes millions of data points to create your perfect itinerary",
                icon: "✨",
                color: "from-cyan-500 to-blue-600"
              },
              {
                step: "03",
                title: "Travel & Enjoy",
                desc: "Real-time updates, smart recommendations, and seamless experiences",
                icon: "🎉",
                color: "from-blue-600 to-purple-600"
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-3xl p-8 border-4 border-teal-200 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-3xl blur-xl opacity-50`}></div>
                      <div className={`relative w-24 h-24 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center text-5xl shadow-2xl`}>
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full border-4 border-teal-300 flex items-center justify-center shadow-lg">
                    <span className="font-black text-teal-600">{step.step}</span>
                  </div>

                  <h3 className="text-2xl font-black mb-4 text-slate-900 text-center">{step.title}</h3>
                  <p className="text-slate-600 font-medium text-center leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="relative z-10 bg-white/60 backdrop-blur-xl py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-slate-900">
              Loved by Travelers
            </h2>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Worldwide 🌍
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Travel Blogger",
                avatar: "👩‍💼",
                rating: 5,
                text: "YatraSaathi completely transformed how I plan trips! The AI suggestions were spot-on and saved me hours of research. Best travel tool ever!",
                location: "New York, USA"
              },
              {
                name: "Raj Patel",
                role: "Adventure Seeker",
                avatar: "🧑‍💻",
                rating: 5,
                text: "I saved over $800 on my last trip thanks to their smart budgeting features. The real-time weather insights were a game-changer!",
                location: "Mumbai, India"
              },
              {
                name: "Emma Chen",
                role: "Digital Nomad",
                avatar: "👩‍🎨",
                rating: 5,
                text: "As someone who travels constantly, this app is a lifesaver. The predictive analytics help me book at the best times. Absolutely love it!",
                location: "Singapore"
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl p-8 border-2 border-teal-200 hover:border-teal-400 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-3xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{testimonial.name}</h4>
                    <p className="text-sm text-teal-600 font-bold">{testimonial.role}</p>
                    <p className="text-xs text-slate-500 font-semibold">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-slate-700 font-medium leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 rounded-3xl p-12 md:p-16 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "50K+", label: "Active Users", icon: "👥" },
                { value: "120+", label: "Countries", icon: "🌍" },
                { value: "$2.5M", label: "Saved by Users", icon: "💰" },
                { value: "4.9/5", label: "App Rating", icon: "⭐" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-5xl mb-3">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base text-white/90 font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-white rounded-3xl p-12 md:p-16 border-4 border-teal-300 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20"></div>

            <div className="relative text-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-7xl mb-6"
              >
                🚀
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black mb-6 text-slate-900">
                Ready to Explore the World?
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 mb-10 font-medium max-w-2xl mx-auto">
                Join thousands of happy travelers and start planning your dream trip with AI today!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={onGetStarted}
                  className="px-10 py-5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 text-white font-black rounded-2xl shadow-2xl hover:shadow-teal-500/50 hover:scale-105 transition-all text-lg"
                >
                  Start Free - No Credit Card Required ✨
                </button>
              </div>

              <p className="mt-8 text-sm text-slate-500 font-semibold">
                ✓ Free forever plan  ✓ No hidden fees  ✓ Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
