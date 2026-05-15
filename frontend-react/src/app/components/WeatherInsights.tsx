import { useState } from "react";
import { Cloud, Sun, CloudRain, Wind, Droplets, ThermometerSun, MapPin, Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function WeatherInsights() {
  const [searchCity, setSearchCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("Paris");

  const weatherData = {
    current: {
      temp: 22,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      feelsLike: 20,
      uvIndex: 6,
    },
    forecast: [
      { day: "Mon", high: 24, low: 18, condition: "Sunny", icon: Sun },
      { day: "Tue", high: 22, low: 17, condition: "Cloudy", icon: Cloud },
      { day: "Wed", high: 20, low: 15, condition: "Rainy", icon: CloudRain },
      { day: "Thu", high: 23, low: 16, condition: "Partly Cloudy", icon: Cloud },
      { day: "Fri", high: 25, low: 19, condition: "Sunny", icon: Sun },
    ],
    recommendations: [
      { time: "Morning (8-11 AM)", activity: "Perfect for outdoor sightseeing", reason: "Clear skies and comfortable temperature" },
      { time: "Afternoon (12-3 PM)", activity: "Visit indoor museums", reason: "Peak sun intensity, stay cool indoors" },
      { time: "Evening (6-9 PM)", activity: "Outdoor dining or river cruise", reason: "Pleasant temperatures and beautiful sunset" },
    ],
    alerts: [
      { type: "info", message: "Rain expected on Wednesday - plan indoor activities" },
      { type: "warning", message: "High UV index today - use sunscreen" },
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
          <Cloud className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            METEOROLOGICAL AI SYSTEM
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Weather Intelligence
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Real-time meteorological insights with AI-powered activity recommendations
        </p>
      </motion.div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search for a city..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
          <button className="group relative px-6 py-4 overflow-hidden rounded-xl transition-all hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
            <Search className="relative z-10 w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-1 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-50"></div>
          <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{selectedCity}</h2>
              <p className="text-blue-100 text-sm">Current Weather</p>
            </div>
            <Cloud className="w-12 h-12 text-blue-100" />
          </div>

          <div className="text-6xl font-bold mb-2">{weatherData.current.temp}°</div>
          <p className="text-blue-100 mb-6">{weatherData.current.condition}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4" />
                <span className="text-sm">Humidity</span>
              </div>
              <p className="text-xl font-semibold">{weatherData.current.humidity}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-4 h-4" />
                <span className="text-sm">Wind</span>
              </div>
              <p className="text-xl font-semibold">{weatherData.current.windSpeed} km/h</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <ThermometerSun className="w-4 h-4" />
                <span className="text-sm">Feels Like</span>
              </div>
              <p className="text-xl font-semibold">{weatherData.current.feelsLike}°</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Sun className="w-4 h-4" />
                <span className="text-sm">UV Index</span>
              </div>
              <p className="text-xl font-semibold">{weatherData.current.uvIndex}</p>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Forecast & Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* 5-Day Forecast */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4">5-Day Forecast</h3>
            <div className="grid grid-cols-5 gap-4">
              {weatherData.forecast.map((day) => {
                const Icon = day.icon;
                return (
                  <div key={day.day} className="text-center">
                    <p className="text-sm font-medium mb-2">{day.day}</p>
                    <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-xs text-muted-foreground mb-1">{day.condition}</p>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <span className="font-semibold">{day.high}°</span>
                      <span className="text-muted-foreground">{day.low}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weather Alerts */}
          <div className="space-y-3">
            {weatherData.alerts.map((alert, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === "warning"
                    ? "bg-orange-50 border-orange-500"
                    : "bg-blue-50 border-blue-500"
                }`}
              >
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            ))}
          </div>

          {/* Smart Recommendations */}
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI-Powered Activity Recommendations
            </h3>
            <div className="space-y-4">
              {weatherData.recommendations.map((rec, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{rec.time}</h4>
                  </div>
                  <p className="text-sm mb-1">{rec.activity}</p>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Activities */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Alternative Activities for Different Weather</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sun className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold">Sunny Days</h4>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Outdoor walking tours</li>
              <li>• Beach or park visits</li>
              <li>• Outdoor photography</li>
              <li>• Street markets</li>
            </ul>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="w-5 h-5 text-gray-500" />
              <h4 className="font-semibold">Cloudy Days</h4>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• City sightseeing</li>
              <li>• Shopping districts</li>
              <li>• Café hopping</li>
              <li>• Urban exploration</li>
            </ul>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CloudRain className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold">Rainy Days</h4>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Museums and galleries</li>
              <li>• Indoor markets</li>
              <li>• Cooking classes</li>
              <li>• Theater and shows</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
