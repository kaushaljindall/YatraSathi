import { TrendingUp, Users, Calendar, DollarSign, Cloud, Sparkles, AlertTriangle, ThumbsUp } from "lucide-react";
import { motion } from "motion/react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";

export function PredictiveInsights() {
  const priceFluctuationData = [
    { month: "Jan", price: 1200, predicted: 1180 },
    { month: "Feb", price: 1100, predicted: 1050 },
    { month: "Mar", price: 1300, predicted: 1320 },
    { month: "Apr", price: 1400, predicted: 1450 },
    { month: "May", price: 1600, predicted: 1650 },
    { month: "Jun", price: 1800, predicted: 1820 },
    { month: "Jul", price: 2000, predicted: 2100 },
    { month: "Aug", price: 1900, predicted: 1950 },
    { month: "Sep", price: 1400, predicted: 1380 },
    { month: "Oct", price: 1300, predicted: 1290 },
    { month: "Nov", price: 1100, predicted: 1120 },
    { month: "Dec", price: 1500, predicted: 1550 },
  ];

  const crowdDensityData = [
    { destination: "Paris", current: 85, predicted: 90 },
    { destination: "Tokyo", current: 70, predicted: 65 },
    { destination: "NYC", current: 75, predicted: 80 },
    { destination: "Dubai", current: 60, predicted: 55 },
    { destination: "Barcelona", current: 80, predicted: 85 },
  ];

  const weatherTrendData = [
    { month: "Jun", temp: 22, rain: 20 },
    { month: "Jul", temp: 25, rain: 15 },
    { month: "Aug", temp: 26, rain: 18 },
    { month: "Sep", temp: 23, rain: 25 },
    { month: "Oct", temp: 18, rain: 30 },
  ];

  const insights = [
    {
      type: "success",
      icon: ThumbsUp,
      title: "Best Time to Book Tokyo",
      message: "Prices are predicted to drop 15% in the next 2 weeks. Book now for Jun-Aug travel.",
      action: "View Deals",
    },
    {
      type: "warning",
      icon: AlertTriangle,
      title: "Peak Season Alert",
      message: "Paris crowd density will increase 20% next month. Consider visiting in September instead.",
      action: "Adjust Dates",
    },
    {
      type: "info",
      icon: Cloud,
      title: "Weather Pattern Detected",
      message: "Barcelona weather optimal in May-June with 80% sunny days. Plan outdoor activities accordingly.",
      action: "View Weather",
    },
    {
      type: "success",
      icon: DollarSign,
      title: "Budget Optimization",
      message: "Save $300 by shifting your Dubai trip from December to November based on price trends.",
      action: "Recalculate",
    },
  ];

  const seasonalRecommendations = [
    {
      season: "Summer (Jun-Aug)",
      destinations: ["Greece", "Croatia", "Norway"],
      reason: "Perfect beach weather and midnight sun experiences",
      avgSavings: "Book 3 months ahead for 20% savings",
    },
    {
      season: "Fall (Sep-Nov)",
      destinations: ["Japan", "Germany", "USA (Northeast)"],
      reason: "Beautiful foliage and fewer crowds",
      avgSavings: "Shoulder season pricing, 25% cheaper than summer",
    },
    {
      season: "Winter (Dec-Feb)",
      destinations: ["Switzerland", "Iceland", "Japan (Hokkaido)"],
      reason: "Winter sports and northern lights",
      avgSavings: "Early bird deals save 30%",
    },
    {
      season: "Spring (Mar-May)",
      destinations: ["Netherlands", "Washington DC", "South Korea"],
      reason: "Cherry blossoms and spring festivals",
      avgSavings: "Pre-peak season, 15% discount",
    },
  ];

  const travelPatterns = {
    avgTripLength: "6.2 days",
    preferredSeason: "Summer (45%)",
    budgetRange: "$2,000 - $3,500",
    topInterests: ["Culture", "Food", "Adventure"],
    bookingLeadTime: "2.3 months ahead",
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
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            PREDICTIVE ML ANALYTICS
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Predictive Travel Insights
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Machine learning predictions to optimize your travel timing and budget
        </p>
      </motion.div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          const colorClasses = {
            success: "bg-green-50 border-green-500 text-green-900",
            warning: "bg-orange-50 border-orange-500 text-orange-900",
            info: "bg-blue-50 border-blue-500 text-blue-900",
          };

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl border-l-4 ${colorClasses[insight.type as keyof typeof colorClasses]}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-2">{insight.title}</h3>
                  <p className="text-sm mb-4 opacity-80">{insight.message}</p>
                  <button className="px-4 py-2 bg-white border border-current rounded-lg text-sm font-semibold hover:bg-opacity-10 transition-all">
                    {insight.action}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Your Travel Patterns */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Your Travel Patterns
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Calendar className="w-6 h-6 mb-2" />
            <p className="text-sm text-blue-100 mb-1">Avg Trip Length</p>
            <p className="text-xl font-bold">{travelPatterns.avgTripLength}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Cloud className="w-6 h-6 mb-2" />
            <p className="text-sm text-blue-100 mb-1">Preferred Season</p>
            <p className="text-xl font-bold">Summer</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <DollarSign className="w-6 h-6 mb-2" />
            <p className="text-sm text-blue-100 mb-1">Budget Range</p>
            <p className="text-xl font-bold">$2-3.5K</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Users className="w-6 h-6 mb-2" />
            <p className="text-sm text-blue-100 mb-1">Top Interest</p>
            <p className="text-xl font-bold">Culture</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="text-sm text-blue-100 mb-1">Book Ahead</p>
            <p className="text-xl font-bold">2.3 months</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Fluctuation */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Price Trends & Predictions
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceFluctuationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Actual Price" />
                <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Predicted" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crowd Density */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Crowd Density Predictions
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crowdDensityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="destination" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="current" fill="#3b82f6" name="Current" />
                <Bar dataKey="predicted" fill="#8b5cf6" name="Predicted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weather Trends */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          Seasonal Weather Trends
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weatherTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} name="Temperature (°C)" />
              <Line yAxisId="right" type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2} name="Rain Chance (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonal Recommendations */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-6">AI Seasonal Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {seasonalRecommendations.map((rec, i) => (
            <div key={i} className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-bold text-lg mb-3">{rec.season}</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Recommended Destinations:</p>
                  <div className="flex flex-wrap gap-2">
                    {rec.destinations.map((dest, j) => (
                      <span key={j} className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Why Visit:</p>
                  <p className="text-sm text-muted-foreground">{rec.reason}</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-semibold text-green-600">{rec.avgSavings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimal Booking Window */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Optimal Booking Windows</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <div className="text-4xl font-bold text-blue-600 mb-2">6-8 weeks</div>
            <p className="text-sm font-medium mb-1">Domestic Flights</p>
            <p className="text-xs text-muted-foreground">Best prices typically found</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="text-4xl font-bold text-purple-600 mb-2">2-3 months</div>
            <p className="text-sm font-medium mb-1">International Flights</p>
            <p className="text-xs text-muted-foreground">Optimal booking window</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="text-4xl font-bold text-pink-600 mb-2">1-2 months</div>
            <p className="text-sm font-medium mb-1">Hotels</p>
            <p className="text-xs text-muted-foreground">Balance of price and availability</p>
          </div>
        </div>
      </div>
    </div>
  );
}
