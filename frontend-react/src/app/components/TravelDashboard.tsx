import { useState } from "react";
import { Calendar, MapPin, Bookmark, Clock, CheckCircle, AlertCircle, TrendingUp, Plane, Hotel, Camera } from "lucide-react";
import { motion } from "motion/react";

export function TravelDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingTrips = [
    {
      id: 1,
      destination: "Tokyo, Japan",
      dates: "Jun 15 - Jun 22, 2026",
      daysLeft: 31,
      budget: 3500,
      spent: 800,
      status: "planning",
      progress: 60,
      image: "🗼",
    },
    {
      id: 2,
      destination: "Barcelona, Spain",
      dates: "Aug 10 - Aug 17, 2026",
      daysLeft: 87,
      budget: 2800,
      spent: 200,
      status: "early",
      progress: 25,
      image: "🏖️",
    },
  ];

  const pastTrips = [
    {
      id: 1,
      destination: "Paris, France",
      dates: "Mar 20 - Mar 27, 2026",
      budget: 3000,
      spent: 2850,
      rating: 5,
      highlights: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise"],
      image: "🗼",
    },
    {
      id: 2,
      destination: "Dubai, UAE",
      dates: "Jan 10 - Jan 15, 2026",
      budget: 4000,
      spent: 3950,
      rating: 4,
      highlights: ["Burj Khalifa", "Desert Safari", "Gold Souk"],
      image: "🏙️",
    },
  ];

  const savedDestinations = [
    { name: "Santorini, Greece", interest: "Beach & Culture", bestTime: "May-Oct", avgCost: "$200/day" },
    { name: "New York, USA", interest: "Urban & Food", bestTime: "Sep-Nov", avgCost: "$300/day" },
    { name: "Bali, Indonesia", interest: "Nature & Wellness", bestTime: "Apr-Oct", avgCost: "$100/day" },
    { name: "Iceland", interest: "Nature & Adventure", bestTime: "Jun-Aug", avgCost: "$250/day" },
  ];

  const travelStats = {
    totalTrips: 12,
    countriesVisited: 8,
    totalDistance: "45,280 km",
    favDestination: "Paris",
    avgTripDuration: "6 days",
    totalSpent: "$28,500",
  };

  const recentActivity = [
    { action: "Saved", item: "Santorini to wishlist", time: "2 hours ago", icon: Bookmark },
    { action: "Planned", item: "Tokyo itinerary updated", time: "5 hours ago", icon: Calendar },
    { action: "Booked", item: "Barcelona accommodation", time: "1 day ago", icon: Hotel },
    { action: "Completed", item: "Paris trip review", time: "2 days ago", icon: CheckCircle },
  ];

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
            UNIFIED COMMAND CENTER
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Travel Dashboard
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Your complete travel control center with real-time insights
        </p>
      </motion.div>

      {/* Travel Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Trips", value: travelStats.totalTrips, icon: Plane },
          { label: "Countries", value: travelStats.countriesVisited, icon: MapPin },
          { label: "Distance", value: travelStats.totalDistance, icon: TrendingUp },
          { label: "Avg Duration", value: travelStats.avgTripDuration, icon: Clock },
          { label: "Total Spent", value: travelStats.totalSpent, icon: Hotel },
          { label: "Fav Place", value: travelStats.favDestination, icon: Camera },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-border p-4 hover:shadow-lg transition-all">
              <Icon className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {[
          { id: "upcoming", label: "Upcoming Trips" },
          { id: "past", label: "Past Trips" },
          { id: "saved", label: "Saved Destinations" },
          { id: "activity", label: "Recent Activity" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upcoming Trips */}
      {activeTab === "upcoming" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingTrips.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{trip.image}</div>
                  <div>
                    <h3 className="text-xl font-bold">{trip.destination}</h3>
                    <p className="text-sm text-muted-foreground">{trip.dates}</p>
                  </div>
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {trip.daysLeft} days left
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Planning Progress</span>
                    <span className="text-sm font-semibold">{trip.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="text-lg font-bold">${trip.budget}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Spent So Far</p>
                    <p className="text-lg font-bold">${trip.spent}</p>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  View Full Itinerary
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Past Trips */}
      {activeTab === "past" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pastTrips.map((trip) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{trip.image}</div>
                  <div>
                    <h3 className="text-xl font-bold">{trip.destination}</h3>
                    <p className="text-sm text-muted-foreground">{trip.dates}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < trip.rating ? "text-yellow-500" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Trip Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {trip.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Budget</p>
                    <p className="font-bold">${trip.budget}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Spent</p>
                    <p className="font-bold text-green-600">${trip.spent}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Saved Destinations */}
      {activeTab === "saved" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedDestinations.map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold">{dest.name}</h3>
                <Bookmark className="w-5 h-5 text-blue-600 fill-blue-600" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Interest:</span>
                  <span className="font-medium">{dest.interest}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Best Time:</span>
                  <span className="font-medium">{dest.bestTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg Cost:</span>
                  <span className="font-semibold text-green-600">{dest.avgCost}</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 border border-border rounded-lg hover:bg-accent transition-all">
                Plan Trip
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {activity.action}: <span className="font-normal">{activity.item}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
