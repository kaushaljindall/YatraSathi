/**
 * YatraSaathi — Centralized API Client
 * All backend communication goes through this module.
 * Handles: JWT injection, error normalization, token expiry.
 */

const API_BASE = "https://ikaushaljindal-yatrasaathi-backend.hf.space/api/v1";

/* ── Token & User Management ──────────────────────────────────── */
const Auth = {
  getToken:    () => localStorage.getItem("ys_token"),
  setToken:    (t) => localStorage.setItem("ys_token", t),
  clearToken:  () => localStorage.removeItem("ys_token"),
  isLoggedIn:  () => !!localStorage.getItem("ys_token"),

  getUser:     () => {
    try { return JSON.parse(localStorage.getItem("ys_user") || "null"); } catch { return null; }
  },
  setUser:     (u) => localStorage.setItem("ys_user", JSON.stringify(u)),
  clearUser:   () => localStorage.removeItem("ys_user"),

  getUserId() {
    try {
      const token = this.getToken();
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch { return null; }
  },
};

/* ── Core Fetch Wrapper ───────────────────────────────────────── */
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    Auth.clearToken();
    Auth.clearUser();
    window.location.href = "auth.html";
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    let errorMsg = `HTTP ${res.status}`;
    if (data.detail) {
      if (Array.isArray(data.detail)) {
        errorMsg = data.detail.map(err => err.msg || JSON.stringify(err)).join(", ");
      } else {
        errorMsg = data.detail;
      }
    } else if (data.message) {
      errorMsg = data.message;
    }
    throw new Error(errorMsg);
  }

  return data;
}

/* ── Auth Endpoints ───────────────────────────────────────────── */
const AuthAPI = {
  /**
   * Login: backend UserCreate requires username, email, password.
   * We derive a username from the email prefix for login (email-only form).
   */
  async login(email, password) {
    const username = email.split("@")[0]; // derive username from email for login
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    if (data.access_token) {
      Auth.setToken(data.access_token);
    }
    return data;
  },

  async signup(username, email, password) {
    const data = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    // Store user info after signup
    if (data.id) {
      Auth.setUser({ id: data.id, username: data.username, email: data.email });
    }
    return data;
  },

  logout() {
    Auth.clearToken();
    Auth.clearUser();
    window.location.href = "auth.html";
  },
};

/* ── Trip Endpoints ───────────────────────────────────────────── */
const TripsAPI = {
  async create(tripData) {
    return apiFetch("/trips/create", {
      method: "POST",
      body: JSON.stringify(tripData),
    });
  },
  async listMine()       { return apiFetch("/trips/my-trips"); },
  async get(tripId)      { return apiFetch(`/trips/${tripId}`); },
  async delete(tripId)   { return apiFetch(`/trips/${tripId}`, { method: "DELETE" }); },
};

/* ── Planner Endpoints ────────────────────────────────────────── */
const PlannerAPI = {
  async generateItinerary(payload) {
    return apiFetch("/planner/generate-trip", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

/* ── City & RAG Endpoints ─────────────────────────────────────── */
const CityAPI = {
  async getInsights(city, query) {
    return apiFetch("/city/city-insights", {
      method: "POST",
      body: JSON.stringify({ city, query }),
    });
  },

  /** Scrape a real Wikipedia image for a city — no auth required */
  async getImage(city) {
    return apiFetch(`/city/city-image?city=${encodeURIComponent(city)}`);
  },
  async getLiveInfo(city) {
    return apiFetch(`/city/live-info?city=${encodeURIComponent(city)}`);
  }
};


/* ── Weather Endpoints ────────────────────────────────────────── */
const WeatherAPI = {
  async get(lat, lon) { return apiFetch(`/weather/?lat=${lat}&lon=${lon}`); },
};

/* ── Expense & Budget Endpoints ───────────────────────────────── */
const ExpensesAPI = {
  async add(tripId, category, amount, description = "") {
    return apiFetch("/expenses/add", {
      method: "POST",
      body: JSON.stringify({ trip_id: tripId, category, amount, description }),
    });
  },
  async getForTrip(tripId) { return apiFetch(`/expenses/trip/${tripId}`); },
};

const BudgetAPI = {
  async analyze(tripId, budget, expenses) {
    return apiFetch("/budget/analyze", {
      method: "POST",
      body: JSON.stringify({ trip_id: tripId, budget, expenses }),
    });
  },
};

/* ── Conversation / Chat Endpoint ─────────────────────────────── */
const ChatAPI = {
  async send(message, preferredLanguage = "en") {
    return apiFetch("/conversation/chat", {
      method: "POST",
      body: JSON.stringify({ message, preferred_language: preferredLanguage }),
    });
  },
};

/* ── WebSocket Manager ─────────────────────────────────────────── */
class YatraWebSocket {
  constructor() {
    this.ws = null;
    this.userId = null;
    this.listeners = {};
  }

  connect(userId) {
    this.userId = userId;
    const token = Auth.getToken();
    const wsBase = API_BASE.replace("http", "ws").replace("/api/v1", "");
    const url = `${wsBase}/ws/${userId}${token ? "?token=" + token : ""}`;
    this.ws = new WebSocket(url);

    this.ws.onopen    = () => { console.log("[WS] Connected"); this._emit("connected", { userId }); };
    this.ws.onmessage = (evt) => {
      try { const msg = JSON.parse(evt.data); this._emit(msg.type, msg); this._emit("*", msg); }
      catch { console.warn("[WS] Invalid JSON:", evt.data); }
    };
    this.ws.onclose   = (e) => { console.warn("[WS] Disconnected:", e.reason); this._emit("disconnected", { code: e.code }); setTimeout(() => this.connect(userId), 5000); };
    this.ws.onerror   = (err) => console.error("[WS] Error:", err);
  }

  send(type, payload = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...payload }));
    }
  }

  ping() { this.send("ping"); }

  on(eventType, callback) {
    if (!this.listeners[eventType]) this.listeners[eventType] = [];
    this.listeners[eventType].push(callback);
  }

  _emit(eventType, data) { (this.listeners[eventType] || []).forEach((cb) => cb(data)); }
  disconnect() { if (this.ws) this.ws.close(); }
}

const yatraWS = new YatraWebSocket();

/* ── Nav Personalization ────────────────────────────────────────── */
/**
 * Call on every authenticated page to update the nav avatar with the
 * real user's initials and show a logout button.
 */
function initNavUser() {
  const user = Auth.getUser();
  const name = user?.username || "Traveler";
  const initials = name.slice(0, 2).toUpperCase();

  // Update all nav avatars
  document.querySelectorAll(".nav-avatar").forEach((img) => {
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
    img.title = name;
  });

  // Inject logout button if not already present
  const navActions = document.querySelector(".nav-actions");
  if (navActions && !document.getElementById("logoutBtn")) {
    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logoutBtn";
    logoutBtn.className = "btn btn-ghost btn-sm";
    logoutBtn.style.cssText = "font-size:13px;padding:6px 14px;";
    logoutBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Logout`;
    logoutBtn.onclick = () => AuthAPI.logout();
    navActions.insertBefore(logoutBtn, navActions.querySelector(".nav-hamburger"));
  }
}

/* ── Utility: Toast Notifications ─────────────────────────────── */
window.showToast = function (message, type = "info", icon = "") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText =
      "position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;";
    document.body.appendChild(container);
  }

  const colors = { success: "#10b981", error: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };
  const toast = document.createElement("div");
  toast.style.cssText = `
    background:rgba(15,23,42,0.97);
    border:1px solid ${colors[type] || colors.info};
    color:#f1f5f9;
    padding:12px 18px;
    border-radius:10px;
    font-family:'Inter',sans-serif;
    font-size:14px;
    max-width:320px;
    box-shadow:0 8px 24px rgba(0,0,0,0.4);
    animation:slideIn 0.3s ease;
    display:flex;
    align-items:center;
    gap:8px;
    cursor:pointer;
  `;
  toast.innerHTML = `${icon ? `<span>${icon}</span>` : ""}<span>${message}</span>`;
  toast.onclick = () => toast.remove();
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

/* ── Voice Intelligence ───────────────────────────────────────── */
const VoiceAPI = {
  async transcribe(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    // Use raw fetch to handle FormData correctly (bypassing JSON content-type in apiFetch)
    const token = Auth.getToken();
    const res = await fetch(`${API_BASE}/voice/transcribe`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  async respond(text, language = "en") {
    const token = Auth.getToken();
    const res = await fetch(`${API_BASE}/voice/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ text, language }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.blob();
  },
};

/* ── Predictive Intelligence ──────────────────────────────────── */
const PredictiveAPI = {
  async predictCrowd(location, hour, month) {
    return apiFetch("/predict/crowd", {
      method: "POST",
      body: JSON.stringify({ location, hour, month }),
    });
  },
  async predictPricing(category, basePrice, daysAhead = 1) {
    return apiFetch("/predict/pricing", {
      method: "POST",
      body: JSON.stringify({ category, base_price: basePrice, days_ahead: daysAhead }),
    });
  },
  async predictWeather(city, daysAhead = 1) {
    return apiFetch("/predict/weather", {
      method: "POST",
      body: JSON.stringify({ city, days_ahead: daysAhead }),
    });
  },
};

/* ── Ecosystem & Multimodal ───────────────────────────────────── */
const MultimodalAPI = {
  async analyze(imageBlob, targetLanguage = "en", sourceType = "menu") {
    const formData = new FormData();
    formData.append("image", imageBlob);
    const token = Auth.getToken();
    const res = await fetch(`${API_BASE}/multimodal/analyze?target_language=${targetLanguage}&source_type=${sourceType}`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    return res.json();
  },
  async ocrScan(imageBlob, sourceType = "menu") {
    const formData = new FormData();
    formData.append("image", imageBlob);
    const token = Auth.getToken();
    const res = await fetch(`${API_BASE}/ocr/scan?source_type=${sourceType}`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    return res.json();
  },
  async visionUnderstand(imageBlob) {
    const formData = new FormData();
    formData.append("image", imageBlob);
    const token = Auth.getToken();
    const res = await fetch(`${API_BASE}/vision/understand`, {
      method: "POST",
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    return res.json();
  }
};

const AutonomousAPI = {
  async optimize(trip, conditions) {
    return apiFetch("/autonomous/optimize", {
      method: "POST",
      body: JSON.stringify({ trip, conditions }),
    });
  },
  async evaluate(trip, conditions) {
    return apiFetch("/autonomous/evaluate", {
      method: "POST",
      body: JSON.stringify({ trip, conditions }),
    });
  }
};

const GlobalIntelligenceAPI = {
  async convertCurrency(amount, fromCurrency, toCurrency) {
    return apiFetch("/currency/convert", {
      method: "POST",
      body: JSON.stringify({ amount, from_currency: fromCurrency, to_currency: toCurrency }),
    });
  },
  async getTimezone(city) {
    return apiFetch(`/global/timezone/${encodeURIComponent(city)}`);
  },
  async getRegionalProfile(country) {
    return apiFetch(`/global/region/${encodeURIComponent(country)}`);
  }
};

const GroupTravelAPI = {
  async createGroup(name, memberIds = []) {
    return apiFetch("/group/create", {
      method: "POST",
      body: JSON.stringify({ name, member_ids: memberIds }),
    });
  },
  async getGroup(groupId) {
    return apiFetch(`/group/${groupId}`);
  },
  async vote(groupId, activity, vote) {
    return apiFetch("/group/vote", {
      method: "POST",
      body: JSON.stringify({ group_id: groupId, activity, vote }),
    });
  },
  async splitExpense(totalAmount, memberCount, splitType = "equal") {
    return apiFetch("/group/split", {
      method: "POST",
      body: JSON.stringify({ total_amount: totalAmount, member_count: memberCount, split_type: splitType }),
    });
  }
};

const WearableAPI = {
  async notify(title, body, actionType = "info") {
    return apiFetch("/wearable/notify", {
      method: "POST",
      body: JSON.stringify({ title, body, action_type: actionType }),
    });
  }
};

/* ── Super AI OS ──────────────────────────────────────────────── */
const SuperAIAPI = {
  async chat(message, tripContext = null) {
    return apiFetch("/super/chat", {
      method: "POST",
      body: JSON.stringify({ message, trip_context: tripContext }),
    });
  },
  async emotionalCheck(message, tripContext = null) {
    return apiFetch("/super/emotional-check", {
      method: "POST",
      body: JSON.stringify({ message, trip_context: tripContext }),
    });
  },
  async getProfile(userId) {
    return apiFetch(`/super/profile/${userId}`);
  },
  async riskAssessment(city, budget, hour, month) {
    return apiFetch("/super/risk-assessment", {
      method: "POST",
      body: JSON.stringify({ city, budget, hour, month }),
    });
  }
};

const MobilityAPI = {
  async recommend(distanceKm, priority = "balanced") {
    return apiFetch("/mobility/recommend", {
      method: "POST",
      body: JSON.stringify({ distance_km: distanceKm, priority }),
    });
  },
  async navigate(origin, destination, mode = "taxi", conditions = {}) {
    return apiFetch("/mobility/navigate", {
      method: "POST",
      body: JSON.stringify({ origin, destination, mode, conditions }),
    });
  }
};

const MemoryAPI = {
  async store(key, value) {
    return apiFetch("/memory/store", {
      method: "POST",
      body: JSON.stringify({ key, value }),
    });
  },
  async recall() {
    return apiFetch("/memory/recall");
  },
  async submitFeedback(recommendationId, accepted, category) {
    return apiFetch("/feedback/recommendation", {
      method: "POST",
      body: JSON.stringify({ recommendation_id: recommendationId, accepted, category }),
    });
  }
};

const SimulationAPI = {
  async simulateTrip(trip) {
    return apiFetch("/simulate/trip", {
      method: "POST",
      body: JSON.stringify({ trip }),
    });
  },
  async analyzeScenario(scenario, tripContext) {
    return apiFetch("/simulate/scenario", {
      method: "POST",
      body: JSON.stringify({ scenario, trip_context: tripContext }),
    });
  }
};

const GlobalEventsAPI = {
  async getCityEvents(city) {
    return apiFetch(`/events/${encodeURIComponent(city)}`);
  }
};

/* Export for module use if needed */
if (typeof module !== "undefined") {
  module.exports = { 
    Auth, AuthAPI, TripsAPI, PlannerAPI, CityAPI, WeatherAPI, ExpensesAPI, BudgetAPI, ChatAPI, yatraWS, initNavUser,
    VoiceAPI, PredictiveAPI, MultimodalAPI, AutonomousAPI, GlobalIntelligenceAPI, GroupTravelAPI, WearableAPI,
    SuperAIAPI, MobilityAPI, MemoryAPI, SimulationAPI, GlobalEventsAPI
  };
} else if (typeof window !== "undefined") {
  Object.assign(window, {
    VoiceAPI, PredictiveAPI, MultimodalAPI, AutonomousAPI, GlobalIntelligenceAPI, GroupTravelAPI, WearableAPI,
    SuperAIAPI, MobilityAPI, MemoryAPI, SimulationAPI, GlobalEventsAPI
  });
}
