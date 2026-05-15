import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface AuthPageProps {
  onAuth: (isSignUp: boolean) => void;
  onBack: () => void;
}

export function AuthPage({ onAuth, onBack }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuth(isSignUp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-200 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated Background */}
      <div className="absolute inset-0">
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
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/30 to-cyan-500/30 rounded-full blur-3xl"
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
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/30 to-purple-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-20 px-4 py-2 bg-white/80 backdrop-blur-xl border-2 border-teal-200 rounded-full font-bold text-slate-700 hover:bg-white hover:scale-105 transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-4 border-teal-200 p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">✈️</span>
            </div>
            <div>
              <h1 className="font-black text-3xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                YatraSaathi
              </h1>
              <p className="text-xs font-bold text-teal-600/70">AI Travel Companion</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-2 bg-teal-100 rounded-2xl">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isSignUp
                  ? "bg-white text-teal-600 shadow-lg"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isSignUp
                  ? "bg-white text-teal-600 shadow-lg"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your awesome name"
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-teal-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white border-2 border-orange-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="font-semibold text-slate-600">Remember me</span>
                </label>
                <a href="#" className="font-bold text-orange-600 hover:text-orange-700">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 text-white font-black rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg"
            >
              {isSignUp ? "Create Account 🚀" : "Sign In ✨"}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-orange-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white font-bold text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: "🔵", label: "Google" },
                { icon: "⚫", label: "Apple" },
                { icon: "🔷", label: "Facebook" },
              ].map((social, i) => (
                <button
                  key={i}
                  className="py-3 px-4 bg-white border-2 border-orange-200 rounded-xl font-bold text-slate-700 hover:bg-orange-50 hover:border-orange-300 transition-all hover:scale-105"
                >
                  <span className="text-2xl">{social.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-slate-500 font-medium">
            By continuing, you agree to our{" "}
            <a href="#" className="text-orange-600 font-bold hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-orange-600 font-bold hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border-4 border-purple-300 p-4 rotate-12"
        >
          <div className="text-4xl">🎒</div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border-4 border-blue-300 p-4 -rotate-12"
        >
          <div className="text-4xl">📍</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
