/**
 * YatraSaathi — dashboard.js
 * Fully wired to backend: chat calls /api/v1/conversation/chat (Groq + emotional AI).
 * Trip list loaded from /api/v1/trips/my-trips.
 * Dashboard header dynamically shows the most recent upcoming trip.
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = "auth.html";
    return;
  }

  // ── Personalize nav ─────────────────────────────────────────────
  initNavUser();

  // ── Load user trips into dashboard ──────────────────────────────
  await loadUserTrips();

  // ── Chat Assistant (real AI) ─────────────────────────────────────
  const chatInput = document.getElementById("chatInput");
  const chatSend  = document.getElementById("chatSend");
  const chatArea  = document.getElementById("chatArea");

  if (chatInput && chatSend && chatArea) {
    const sendMessage = async () => {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage("user", text);
      chatInput.value = "";

      const typingId = showTypingIndicator();

      try {
        const result = await ChatAPI.send(text);
        removeTypingIndicator(typingId);
        const reply = result.response || result.message || result.answer || "I couldn't generate a response.";
        appendMessage("ai", reply);
      } catch (err) {
        removeTypingIndicator(typingId);
        appendMessage("ai", `⚠️ ${err.message || "Service temporarily unavailable. Please try again."}`);
        console.error("Chat error:", err);
      }
    };

    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }

  // ── WebSocket — live updates ──────────────────────────────────────
  try {
    const userId = Auth.getUserId();
    if (userId) {
      yatraWS.connect(userId);
      yatraWS.on("alert",  (msg) => window.showToast(msg.message, "warning", "🚨"));
      yatraWS.on("update", (msg) => window.showToast(msg.message, "info",    "🔄"));
      setInterval(() => yatraWS.ping(), 30000);
    }
  } catch { /* Token decode failed — skip WS */ }
});

/* ── Load trips & update dashboard header ─────────────────────── */
async function loadUserTrips() {
  const container = document.getElementById("tripsContainer");
  if (!container) return;

  try {
    container.innerHTML = `<div style="color:#94a3b8;text-align:center;padding:20px;">Loading your trips...</div>`;
    const result = await TripsAPI.listMine();
    const trips  = result.trips || [];

    // ── Update header with the most recent/upcoming trip ──────────
    updateDashboardHeader(trips);

    if (trips.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:30px;color:#94a3b8;">
          <i class="fa-solid fa-map-location-dot" style="font-size:2rem;margin-bottom:12px;display:block;opacity:0.4"></i>
          No trips yet. <a href="planner.html" style="color:#8b5cf6;">Plan your first trip →</a>
        </div>`;
      return;
    }

    container.innerHTML = trips
      .slice(0, 5)
      .map((t) => {
        const startStr = new Date(t.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const endStr   = new Date(t.end_date).toLocaleDateString("en-US",   { month: "short", day: "numeric" });
        const statusColor = t.status === "active" ? "#10b981" : "#8b5cf6";
        return `
          <div class="trip-card" data-trip-id="${t.trip_id}" style="cursor:pointer;padding:16px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);margin-bottom:10px;transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'">
            <div style="display:flex;justify-content:space-between;align-items:start;">
              <div>
                <h4 style="color:#f1f5f9;margin:0 0 4px">${t.destination}</h4>
                <span style="color:#64748b;font-size:13px;">${startStr} – ${endStr} · ${t.duration_days}d</span>
              </div>
              <span style="color:${statusColor};font-size:12px;text-transform:uppercase;font-weight:600">${t.status}</span>
            </div>
            <div style="color:#94a3b8;font-size:13px;margin-top:8px">
              Budget: ₹${Number(t.budget).toLocaleString()} · ${t.interests?.join(", ") || "General"}
            </div>
          </div>`;
      })
      .join("");

    // Make trip cards clickable
    container.querySelectorAll(".trip-card").forEach((card) => {
      card.addEventListener("click", () => {
        window.location.href = `planner.html?trip=${card.dataset.tripId}`;
      });
    });

  } catch (err) {
    container.innerHTML = `<div style="color:#ef4444;padding:12px;">Failed to load trips: ${err.message}</div>`;
  }
}

/* ── Update dashboard header dynamically ─────────────────────── */
function updateDashboardHeader(trips) {
  const titleEl = document.querySelector(".dash-title");
  const metaEl  = document.querySelector(".dash-meta");
  if (!titleEl || !metaEl) return;

  const user = Auth.getUser();
  const greeting = user?.username
    ? `Welcome back, <span class="text-gradient">${user.username}</span>`
    : `Your <span class="text-gradient">Travel Dashboard</span>`;

  if (trips.length === 0) {
    titleEl.innerHTML = greeting;
    metaEl.textContent = "No upcoming trips — plan your next adventure!";
    return;
  }

  // Find the next upcoming trip (earliest start_date ≥ today)
  const today    = new Date().toISOString().split("T")[0];
  const upcoming = trips.find((t) => t.start_date >= today) || trips[0];

  const d1 = new Date(upcoming.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const d2 = new Date(upcoming.end_date).toLocaleDateString("en-US",   { month: "short", day: "numeric" });

  titleEl.innerHTML = `Upcoming: <span class="text-gradient">${upcoming.destination}</span>`;
  metaEl.textContent = `${d1} - ${d2} • ${upcoming.duration_days} Days • ${upcoming.travel_style || "Balanced"} Style`;

  // Also update budget widget if present
  const budgetValEl = document.querySelector(".wc-main-val");
  if (budgetValEl) {
    budgetValEl.textContent = `₹${Number(upcoming.budget).toLocaleString()}`;
  }
}

/* ── Helper: Append chat message ──────────────────────────────── */
function appendMessage(role, text) {
  const chatArea = document.getElementById("chatArea");
  if (!chatArea) return;

  const div = document.createElement("div");
  div.className = `chat-msg ${role}`;

  if (role === "ai") {
    div.innerHTML = `
      <img src="https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff" alt="AI">
      <div class="msg-bubble">${formatAIResponse(text)}</div>`;
  } else {
    div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
  }

  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

/* ── Helper: Typing indicator ─────────────────────────────────── */
function showTypingIndicator() {
  const chatArea = document.getElementById("chatArea");
  if (!chatArea) return null;
  const id  = "typing_" + Date.now();
  const div = document.createElement("div");
  div.className = "chat-msg ai";
  div.id = id;
  div.innerHTML = `
    <img src="https://ui-avatars.com/api/?name=AI&background=8b5cf6&color=fff" alt="AI">
    <div class="msg-bubble" style="display:flex;gap:4px;align-items:center;padding:12px 16px;">
      <span style="width:8px;height:8px;background:#8b5cf6;border-radius:50%;animation:pulse 1s infinite"></span>
      <span style="width:8px;height:8px;background:#8b5cf6;border-radius:50%;animation:pulse 1s 0.2s infinite"></span>
      <span style="width:8px;height:8px;background:#8b5cf6;border-radius:50%;animation:pulse 1s 0.4s infinite"></span>
    </div>`;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
  return id;
}

function removeTypingIndicator(id) { if (id) document.getElementById(id)?.remove(); }

/* ── Utilities ─────────────────────────────────────────────────── */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatAIResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}
