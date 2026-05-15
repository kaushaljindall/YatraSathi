import { useState } from "react";
import { Calendar, MapPin, Users, Wallet, Heart, Mountain, Camera, Coffee, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function TripPlanner() {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: "1",
    interests: [] as string[],
    travelStyle: "balanced",
  });

  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const interestOptions = [
    { id: "culture", label: "Culture & History", icon: Camera },
    { id: "food", label: "Food & Dining", icon: Coffee },
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "relaxation", label: "Relaxation", icon: Heart },
  ];

  const travelStyles = [
    { id: "budget", label: "Budget Saver", desc: "Maximize experiences, minimize costs" },
    { id: "balanced", label: "Balanced", desc: "Mix of comfort and value" },
    { id: "luxury", label: "Luxury", desc: "Premium experiences" },
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const days = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 3;

      setGeneratedPlan({
        destination: formData.destination || "Paris",
        days: days,
        totalCost: parseInt(formData.budget) || 2000,
        dailyItinerary: Array.from({ length: days }, (_, i) => ({
          day: i + 1,
          morning: `Visit local attractions and ${formData.interests.includes('food') ? 'breakfast at local cafe' : 'explore museums'}`,
          afternoon: `${formData.interests.includes('adventure') ? 'Adventure activities' : 'Cultural sites'}`,
          evening: `Dinner and ${formData.interests.includes('relaxation') ? 'leisure time' : 'nightlife'}`,
          estimatedCost: Math.floor((parseInt(formData.budget) || 2000) / days),
        })),
        recommendations: [
          "Book attractions in advance for better prices",
          "Use public transport to save money",
          "Try local street food for authentic experiences",
        ],
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-blue-300/50 rounded-full shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🧠 NEURAL TRIP ARCHITECT
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI-Powered Trip Planner
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Tell us about your dream destination and watch our AI craft the perfect itinerary in seconds
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white/90 backdrop-blur-2xl border border-blue-200 rounded-3xl p-8 space-y-6 shadow-xl">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Trip Details ✈️
            </h2>

          {/* Destination */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <MapPin className="w-4 h-4 text-blue-600" />
              Destination
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
              placeholder="e.g., Paris, Tokyo, New York 🗼"
              className="w-full px-5 py-4 bg-white border-2 border-blue-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-5 py-4 bg-white border-2 border-blue-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-5 py-4 bg-white border-2 border-blue-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Budget & Travelers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Wallet className="w-4 h-4" />
                Budget (USD)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="2000"
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Users className="w-4 h-4" />
                Travelers
              </label>
              <select
                value={formData.travelers}
                onChange={(e) => setFormData(prev => ({ ...prev, travelers: e.target.value }))}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700">Interests 🎨</label>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map(interest => {
                const Icon = interest.icon;
                const isSelected = formData.interests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg"
                        : "border-blue-200 bg-white hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-slate-500"}`} />
                    <span className={`text-sm font-semibold ${isSelected ? "text-blue-700" : "text-slate-600"}`}>
                      {interest.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Travel Style */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Travel Style</label>
            <div className="space-y-2">
              {travelStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setFormData(prev => ({ ...prev, travelStyle: style.id }))}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    formData.travelStyle === style.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div className="font-medium">{style.label}</div>
                  <div className="text-sm text-muted-foreground">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateItinerary}
            disabled={isGenerating}
            className="group relative w-full py-5 overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 shadow-xl hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-lg">
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ✨ Generating Your Perfect Trip...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate AI Itinerary 🚀
                </>
              )}
            </span>
          </button>
          </div>
        </motion.div>

        {/* Generated Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {!generatedPlan && !isGenerating && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-2xl border border-blue-200 rounded-3xl p-12 text-center shadow-xl">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center backdrop-blur-xl border-2 border-blue-300"
                >
                  <Sparkles className="w-12 h-12 text-blue-600" />
                </motion.div>
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Your Itinerary Awaits</h3>
                <p className="text-slate-600">
                  Fill in your travel preferences and let our AI create your perfect journey
                </p>
              </div>
            </div>
          )}

          {isGenerating && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 to-purple-200/40 rounded-3xl blur-2xl animate-pulse"></div>
              <div className="relative bg-white/90 backdrop-blur-2xl border border-blue-200 rounded-3xl p-12 text-center shadow-xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                <div className="text-5xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">AI is Crafting Your Journey...</h3>
                <p className="text-slate-600 mb-6">
                  Analyzing destinations, weather patterns, and creating your personalized itinerary
                </p>
                <div className="flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-3 h-3 bg-blue-600 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {generatedPlan && !isGenerating && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/90 backdrop-blur-2xl border border-blue-200 rounded-3xl p-8 space-y-6 shadow-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">🎉</span>
                      <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {generatedPlan.destination} Adventure
                      </h2>
                    </div>
                    <p className="text-slate-600 font-medium">
                      📅 {generatedPlan.days} Day Trip • 💰 ${generatedPlan.totalCost} Total Budget
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold text-sm shadow-lg">
                    ✨ AI Generated
                  </div>
                </div>

              {/* Daily Itinerary */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  📋 Daily Itinerary
                </h3>
                {generatedPlan.dailyItinerary.map((day: any, index: number) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative p-6 bg-white/80 backdrop-blur-xl border-2 border-blue-200 rounded-2xl hover:border-blue-300 transition-all hover:shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                            {day.day}
                          </div>
                          <h4 className="font-bold text-slate-900 text-lg">Day {day.day}</h4>
                        </div>
                        <span className="px-3 py-1 bg-green-100 border-2 border-green-300 rounded-lg text-green-700 text-sm font-bold shadow-sm">
                          💵 ${day.estimatedCost}
                        </span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex gap-3">
                          <span className="text-blue-600 font-bold min-w-[80px]">🌅 Morning:</span>
                          <span className="text-slate-700">{day.morning}</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-purple-600 font-bold min-w-[80px]">☀️ Afternoon:</span>
                          <span className="text-slate-700">{day.afternoon}</span>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-pink-600 font-bold min-w-[80px]">🌆 Evening:</span>
                          <span className="text-slate-700">{day.evening}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  💡 Smart Recommendations
                </h3>
                <div className="space-y-3">
                  {generatedPlan.recommendations.map((rec: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-xl border-2 border-blue-200 rounded-xl hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all shadow-sm hover:shadow-md"
                    >
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{rec}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
