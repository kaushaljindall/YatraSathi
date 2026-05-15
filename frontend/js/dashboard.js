/**
 * YatraSaathi — dashboard.js
 * Fully wired to backend: chat calls /api/v1/conversation/chat (Groq + emotional AI).
 * Trip list loaded from /api/v1/trips/my-trips.
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = "auth.html";
    return;
  }

  // ── Load user trips into dashboard ──────────────────────────
  await loadUserTrips();

  // ── Chat Assistant (real AI) ─────────────────────────────────
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatArea = document.getElementById("chatArea");

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
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // ── WebSocket — live updates ──────────────────────────────────
  // (user_id decoded from stored token)
  try {
    const token = Auth.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;
      yatraWS.connect(userId);

      yatraWS.on("alert", (msg) => {
        window.showToast(msg.message, "warning", "🚨");
      });

      yatraWS.on("update", (msg) => {
        window.showToast(msg.message, "info", "🔄");
      });

      // Ping every 30s to keep connection alive
      setInterval(() => yatraWS.ping(), 30000);
    }
  } catch {
    // Token decode failed — skip WS
  }
});

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

  const id = "typing_" + Date.now();
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

function removeTypingIndicator(id) {
  if (id) document.getElementById(id)?.remove();
}

/* ── Helper: Load trips from backend ──────────────────────────── */
async function loadUserTrips() {
  const container = document.getElementById("tripsContainer");
  if (!container) return;

  try {
    container.innerHTML = `<div style="color:#94a3b8;text-align:center;padding:20px;">Loading your trips...</div>`;
    const result = await TripsAPI.listMine();
    const trips = result.trips || [];

    if (trips.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:30px;color:#94a3b8;">
          <i class="fa-solid fa-map-location-dot" style="font-size:2rem;margin-bottom:12px;display:block;opacity:0.4"></i>
          No trips yet. <a href="planner.html" style="color:#8b5cf6;">Plan your first trip →</a>
        </div>`;
      return;
    }

    container.innerHTML = trips
      .slice(0, 5) // Show latest 5
      .map((t) => {
        const startStr = new Date(t.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const endStr = new Date(t.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const statusColor = t.status === "active" ? "#10b981" : "#8b5cf6";
        return `
          <div class="trip-card" data-trip-id="${t.trip_id}" style="cursor:pointer;">
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
        const tripId = card.dataset.tripId;
        window.location.href = `planner.html?trip=${tripId}`;
      });
    });

  } catch (err) {
    container.innerHTML = `<div style="color:#ef4444;padding:12px;">Failed to load trips: ${err.message}</div>`;
  }
}

/* ── Utilities ─────────────────────────────────────────────────── */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatAIResponse(text) {
  // Convert **bold** and newlines to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}
