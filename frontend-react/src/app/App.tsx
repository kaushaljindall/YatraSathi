import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { AuthPage } from "./components/AuthPage";
import { HomePage } from "./components/HomePage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "auth" | "home">("landing");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = (isSignUp: boolean) => {
    setIsAuthenticated(true);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("landing");
  };

  return (
    <div className="min-h-screen">{currentPage === "landing" && (
        <LandingPage onGetStarted={() => setCurrentPage("auth")} />
      )}

      {currentPage === "auth" && (
        <AuthPage
          onAuth={handleAuth}
          onBack={() => setCurrentPage("landing")}
        />
      )}

      {currentPage === "home" && (
        <HomePage onLogout={handleLogout} />
      )}
    </div>
  );
}
