/**
 * YatraSaathi — Centralized API Client
 * All backend communication goes through this module.
 * Handles: JWT injection, error normalization, token expiry.
 */

const API_BASE = "http://127.0.0.1:8000/api/v1";

/* ── Token Management ─────────────────────────────────────────── */
const Auth = {
  getToken: () => localStorage.getItem("ys_token"),
  setToken: (t) => localStorage.setItem("ys_token", t),
  clearToken: () => localStorage.removeItem("ys_token"),
  isLoggedIn: () => !!localStorage.getItem("ys_token"),
};

/* ── Core Fetch Wrapper ───────────────────────────────────────── */
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    Auth.clearToken();
    window.location.href = "/auth.html";
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || data.message || `HTTP ${res.status}`);
  }

  return data;
}

/* ── Auth Endpoints ───────────────────────────────────────────── */
const AuthAPI = {
  async login(email, password) {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) Auth.setToken(data.access_token);
    return data;
  },

  async signup(username, email, password) {
    return apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
  },

  logout() {
    Auth.clearToken();
    window.location.href = "/auth.html";
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

  async listMine() {
    return apiFetch("/trips/my-trips");
  },

  async get(tripId) {
    return apiFetch(`/trips/${tripId}`);
  },

  async delete(tripId) {
    return apiFetch(`/trips/${tripId}`, { method: "DELETE" });
  },
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
};

/* ── Weather Endpoints ────────────────────────────────────────── */
const WeatherAPI = {
  async get(lat, lon) {
    return apiFetch(`/weather/?lat=${lat}&lon=${lon}`);
  },
};

/* ── Expense & Budget Endpoints ───────────────────────────────── */
const ExpensesAPI = {
  async add(tripId, category, amount) {
    return apiFetch("/expenses/add", {
      method: "POST",
      body: JSON.stringify({ trip_id: tripId, category, amount }),
    });
  },

  async getForTrip(tripId) {
    return apiFetch(`/expenses/trip/${tripId}`);
  },
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

    this.ws.onopen = () => {
      console.log("[WS] Connected to YatraSaathi live updates");
      this._emit("connected", { userId });
    };

    this.ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        this._emit(msg.type, msg);
        this._emit("*", msg);
      } catch {
        console.warn("[WS] Invalid JSON:", evt.data);
      }
    };

    this.ws.onclose = (e) => {
      console.warn("[WS] Disconnected:", e.reason);
      this._emit("disconnected", { code: e.code });
      // Auto-reconnect after 5 seconds
      setTimeout(() => this.connect(userId), 5000);
    };

    this.ws.onerror = (err) => {
      console.error("[WS] Error:", err);
    };
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

  _emit(eventType, data) {
    (this.listeners[eventType] || []).forEach((cb) => cb(data));
  }

  disconnect() {
    if (this.ws) this.ws.close();
  }
}

const yatraWS = new YatraWebSocket();

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

  const colors = {
    success: "#10b981",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  const toast = document.createElement("div");
  toast.style.cssText = `
    background: rgba(15,23,42,0.97);
    border: 1px solid ${colors[type] || colors.info};
    color: #f1f5f9;
    padding: 12px 18px;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    max-width: 320px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    animation: slideIn 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  toast.innerHTML = `${icon ? `<span>${icon}</span>` : ""}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

/* Export for module use if needed */
if (typeof module !== "undefined") {
  module.exports = { Auth, AuthAPI, TripsAPI, PlannerAPI, CityAPI, WeatherAPI, ExpensesAPI, BudgetAPI, ChatAPI, yatraWS };
}
