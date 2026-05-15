import { motion, useAnimation } from "motion/react";
import { Sparkles, TrendingUp, Shield, Zap, Globe, Calendar, ArrowRight, Play } from "lucide-react";
import { useEffect } from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      rotate: [0, 5, -5, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    });
  }, [controls]);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Planning",
      description: "Personalized itineraries crafted by advanced neural networks",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      icon: TrendingUp,
      title: "Smart Budgeting",
      description: "Predictive expense tracking with real-time optimization",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      icon: Globe,
      title: "City Intelligence",
      description: "RAG-powered local insights and authentic experiences",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      icon: Zap,
      title: "Real-time Adaptation",
      description: "Dynamic recommendations that evolve with conditions",
      gradient: "from-pink-600 to-orange-500"
    },
    {
      icon: Shield,
      title: "Safety Guardian",
      description: "AI-monitored safety alerts and emergency protocols",
      gradient: "from-orange-500 to-yellow-500"
    },
    {
      icon: Calendar,
      title: "Predictive Analytics",
      description: "ML-driven crowd forecasting and optimal timing",
      gradient: "from-yellow-500 to-cyan-500"
    },
  ];

  return (
    <div className="space-y-32 pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-5xl mx-auto pt-20 relative"
      >
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-blue-300/50 rounded-full shadow-xl shadow-blue-500/10"
        >
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
            ✨ POWERED BY ADVANCED AI INTELLIGENCE
          </span>
          <Sparkles className="w-4 h-4 text-blue-600" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-[0.9] tracking-tight relative"
        >
          <span className="absolute -left-16 top-0 text-7xl">🌟</span>
          <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Plan Smarter.
          </span>
          <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Travel Better.
          </span>
          <span className="absolute -right-16 bottom-0 text-7xl">🚀</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Experience the future of travel with{" "}
          <span className="text-blue-600 font-semibold">YatraSaathi</span> — your AI-powered companion
          that transforms trip planning into a seamless, intelligent, and personalized journey.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button
            onClick={onGetStarted}
            className="group relative px-10 py-5 overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
            <span className="relative z-10 flex items-center gap-3 text-white font-bold text-lg">
              Start Your Journey ✈️
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button className="group px-10 py-5 bg-white/80 backdrop-blur-xl border-2 border-blue-300 rounded-2xl text-slate-700 font-bold text-lg hover:bg-white hover:border-blue-400 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <span className="flex items-center gap-3">
              <Play className="w-5 h-5" />
              Watch Demo
            </span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="grid grid-cols-3 gap-8 mt-24 max-w-3xl mx-auto"
        >
          {[
            { value: "500+", label: "Cities Covered", icon: "🌍", gradient: "from-blue-600 to-cyan-600" },
            { value: "10K+", label: "Happy Travelers", icon: "😊", gradient: "from-purple-600 to-pink-600" },
            { value: "98%", label: "Satisfaction Rate", icon: "⭐", gradient: "from-pink-600 to-orange-500" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 group-hover:border-blue-300 transition-all hover:shadow-xl">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500 rounded-3xl`}></div>

              {/* Card */}
              <div className="relative h-full bg-white/80 backdrop-blur-xl border border-blue-200 rounded-3xl p-8 hover:bg-white hover:border-blue-300 transition-all duration-500 group-hover:scale-105 shadow-lg hover:shadow-2xl">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} blur-xl opacity-30`}></div>
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-20 blur-sm rounded-3xl`}></div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 via-purple-200/30 to-pink-200/30 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-2xl border border-blue-200 rounded-3xl p-12 md:p-16 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            How YatraSaathi Works
          </h2>
          <p className="text-center text-slate-600 mb-16 max-w-2xl mx-auto">
            Four simple steps to unlock the future of intelligent travel planning
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 rounded-full"></div>

            {[
              {
                step: "01",
                title: "Input Preferences",
                desc: "Share your destination, budget, dates, and travel style with our AI",
                icon: "🎯",
                color: "from-cyan-500 to-blue-600"
              },
              {
                step: "02",
                title: "AI Analysis",
                desc: "Advanced algorithms process millions of data points to craft your perfect trip",
                icon: "🧠",
                color: "from-blue-600 to-purple-600"
              },
              {
                step: "03",
                title: "Smart Recommendations",
                desc: "Receive weather-aware, budget-optimized suggestions tailored just for you",
                icon: "✨",
                color: "from-purple-600 to-pink-600"
              },
              {
                step: "04",
                title: "Travel & Track",
                desc: "Real-time expense tracking with adaptive itinerary adjustments on the go",
                icon: "🚀",
                color: "from-pink-600 to-cyan-500"
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2 + index * 0.15, duration: 0.6 }}
                className="relative text-center group"
              >
                {/* Step Number */}
                <div className="relative mx-auto mb-6 w-20 h-20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} blur-xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                  <div className={`relative w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl z-10`}>
                    {item.icon}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white backdrop-blur-xl border-2 border-blue-300 rounded-lg px-3 py-1 text-xs font-bold text-blue-600 shadow-lg">
                    {item.step}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
