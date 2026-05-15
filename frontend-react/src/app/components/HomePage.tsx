import { useState } from "react";
import { motion } from "motion/react";
import {
  Plane,
  Cloud,
  Wallet,
  MapPin,
  Calendar,
  TrendingUp,
  Search,
  Sparkles,
  Menu,
  X,
  LogOut,
  User,
  Bell,
} from "lucide-react";
import { HeroSection } from "./HeroSection";
import { TripPlanner } from "./TripPlanner";
import { WeatherInsights } from "./WeatherInsights";
import { BudgetTracker } from "./BudgetTracker";
import { CityIntelligence } from "./CityIntelligence";
import { TravelDashboard } from "./TravelDashboard";
import { PredictiveInsights } from "./PredictiveInsights";

interface HomePageProps {
  onLogout: () => void;
}

export function HomePage({ onLogout }: HomePageProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: TrendingUp, gradient: "from-teal-500 to-cyan-600" },
    { id: "planner", label: "Plan Trip", icon: Calendar, gradient: "from-cyan-600 to-blue-600" },
    { id: "weather", label: "Weather", icon: Cloud, gradient: "from-blue-500 to-purple-500" },
    { id: "budget", label: "Budget", icon: Wallet, gradient: "from-purple-600 to-pink-500" },
    { id: "explore", label: "Explore", icon: Search, gradient: "from-pink-500 to-teal-500" },
    { id: "insights", label: "Insights", icon: Sparkles, gradient: "from-teal-600 to-cyan-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#14b8a620_1px,transparent_1px),linear-gradient(to_bottom,#14b8a620_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none" />
      {/* Modern Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-72 bg-white/90 backdrop-blur-2xl border-r-2 border-teal-200 shadow-xl z-40 transition-all duration-300">
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-2xl">✈️</span>
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="font-black text-xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                YatraSaathi
              </h1>
              <p className="text-xs font-bold text-teal-600/70">Travel Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r " + item.gradient + " text-white shadow-xl scale-105"
                      : "text-slate-700 hover:bg-teal-100"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden md:block font-bold">{item.label}</span>

                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t-2 border-teal-200 pt-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-teal-100 transition-all group">
              <div className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </div>
              <span className="hidden md:block font-bold">Notifications</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 hover:bg-teal-100 transition-all">
              <User className="w-5 h-5" />
              <span className="hidden md:block font-bold">Profile</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:block font-bold">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-20 md:ml-72 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-2xl border-b-2 border-teal-200 px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  {navigation.find(n => n.id === activeSection)?.label || "Dashboard"}
                </h2>
                <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full text-white text-xs font-black">
                  LIVE
                </span>
              </div>
              <p className="text-sm text-slate-600 font-semibold">
                Welcome back, Traveler! Ready for your next adventure? 🌍✨
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 rounded-full text-white shadow-lg">
                <Star className="w-4 h-4 fill-white" />
                <span className="font-bold text-sm">Premium</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-11 h-11 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-black shadow-xl">
                  JD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === "dashboard" && <TravelDashboard />}
            {activeSection === "planner" && <TripPlanner />}
            {activeSection === "weather" && <WeatherInsights />}
            {activeSection === "budget" && <BudgetTracker />}
            {activeSection === "explore" && <CityIntelligence />}
            {activeSection === "insights" && <PredictiveInsights />}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t-2 border-teal-200 px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-around">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all relative ${
                  activeSection === item.id
                    ? "text-teal-600 scale-110"
                    : "text-slate-600"
                }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="mobileActiveIndicator"
                    className="absolute inset-0 bg-teal-100 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="text-xs font-bold relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
