import { useState } from "react";
import { Search, MapPin, Star, Coffee, Utensils, ShieldAlert, Info, TrendingUp, Users, Clock, Globe } from "lucide-react";
import { motion } from "motion/react";

export function CityIntelligence() {
  const [selectedCity, setSelectedCity] = useState("Paris");
  const [searchQuery, setSearchQuery] = useState("");

  const cityData = {
    name: "Paris",
    country: "France",
    overview: "The City of Light is known for its art, architecture, and culture. Home to iconic landmarks, world-class museums, and exceptional cuisine.",
    bestTimeToVisit: "April to June, September to October",
    avgCost: "$150-200/day",
    safetyRating: 4.2,
    popularMonths: ["May", "June", "September"],

    topAttractions: [
      { name: "Eiffel Tower", type: "Landmark", rating: 4.8, visitors: "7M/year", ticketPrice: "$25-45" },
      { name: "Louvre Museum", type: "Museum", rating: 4.7, visitors: "10M/year", ticketPrice: "$17" },
      { name: "Notre-Dame", type: "Historic Site", rating: 4.6, visitors: "13M/year", ticketPrice: "Free" },
      { name: "Sacré-Cœur", type: "Religious Site", rating: 4.7, visitors: "11M/year", ticketPrice: "Free" },
    ],

    foodRecommendations: [
      {
        name: "Croissants at Du Pain et des Idées",
        type: "Breakfast",
        price: "$5-8",
        rating: 4.8,
        description: "Authentic French pastries in a historic bakery"
      },
      {
        name: "Bistro dining at Le Comptoir",
        type: "Lunch/Dinner",
        price: "$30-50",
        rating: 4.6,
        description: "Classic French bistro experience"
      },
      {
        name: "Street crepes at Montmartre",
        type: "Snack",
        price: "$6-10",
        rating: 4.5,
        description: "Traditional crepes in artistic neighborhood"
      },
    ],

    safetyTips: [
      "Keep valuables secure in crowded tourist areas",
      "Be aware of pickpockets on metro lines 1 and 4",
      "Avoid isolated areas of parks late at night",
      "Use official taxis or ride-sharing apps",
      "Emergency number: 112 (European emergency number)",
    ],

    culturalInsights: [
      {
        title: "Greeting Etiquette",
        tip: "Always greet with 'Bonjour' when entering shops and restaurants"
      },
      {
        title: "Dining Culture",
        tip: "Lunch is typically 12-2 PM, dinner after 8 PM. Meals are leisurely."
      },
      {
        title: "Tipping",
        tip: "Service is included in bills, but rounding up is appreciated"
      },
      {
        title: "Language",
        tip: "Attempt basic French phrases - locals appreciate the effort"
      },
    ],

    localTransport: [
      { type: "Metro", cost: "$2 per ride", coverage: "Excellent", tip: "Buy day passes for unlimited travel" },
      { type: "Bus", cost: "$2 per ride", coverage: "Good", tip: "Great for sightseeing above ground" },
      { type: "Vélib' (Bike)", cost: "$3/day", coverage: "City-wide", tip: "Perfect for exploring neighborhoods" },
      { type: "RER", cost: "$5-10", coverage: "Suburbs", tip: "For Versailles and airports" },
    ],
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
          className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-cyan-500/20 rounded-full"
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            RAG-POWERED KNOWLEDGE BASE
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          City Intelligence
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Deep local insights powered by Retrieval-Augmented Generation AI
        </p>
      </motion.div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for cities, attractions, or local tips..."
            className="w-full pl-12 pr-4 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-lg transition-all"
          />
        </div>
      </div>

      {/* City Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{cityData.name}</h2>
            <p className="text-blue-100 mb-4">{cityData.country}</p>
            <p className="text-white/90 max-w-2xl">{cityData.overview}</p>
          </div>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">{cityData.safetyRating}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Clock className="w-5 h-5 mb-2" />
            <p className="text-sm text-blue-100 mb-1">Best Time to Visit</p>
            <p className="font-semibold">{cityData.bestTimeToVisit}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <TrendingUp className="w-5 h-5 mb-2" />
            <p className="text-sm text-blue-100 mb-1">Average Daily Cost</p>
            <p className="font-semibold">{cityData.avgCost}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Users className="w-5 h-5 mb-2" />
            <p className="text-sm text-blue-100 mb-1">Peak Months</p>
            <p className="font-semibold">{cityData.popularMonths.join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Attractions */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Must-Visit Attractions
          </h3>
          <div className="space-y-4">
            {cityData.topAttractions.map((attraction, i) => (
              <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{attraction.name}</h4>
                    <p className="text-sm text-muted-foreground">{attraction.type}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm font-semibold">{attraction.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{attraction.visitors}</span>
                  <span className="font-semibold text-blue-600">{attraction.ticketPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Food Recommendations */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-blue-600" />
            Local Food Experiences
          </h3>
          <div className="space-y-4">
            {cityData.foodRecommendations.map((food, i) => (
              <div key={i} className="p-4 border border-border rounded-lg hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{food.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{food.type}</p>
                    <p className="text-sm text-muted-foreground">{food.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-semibold text-green-600">{food.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-sm font-semibold">{food.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-orange-600" />
          Safety & Important Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cityData.safetyTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
              <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Insights */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Coffee className="w-5 h-5 text-blue-600" />
          Cultural Insights & Etiquette
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cityData.culturalInsights.map((insight, i) => (
            <div key={i} className="p-4 border border-border rounded-lg">
              <h4 className="font-semibold mb-2">{insight.title}</h4>
              <p className="text-sm text-muted-foreground">{insight.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Local Transport */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Local Transportation Guide</h3>
        <div className="space-y-3">
          {cityData.localTransport.map((transport, i) => (
            <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{transport.type}</h4>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Coverage: {transport.coverage}</span>
                  <span className="text-sm font-semibold text-blue-600">{transport.cost}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{transport.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
