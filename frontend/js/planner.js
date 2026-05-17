/**
 * YatraSaathi — planner.js
 * Fully wired to backend: calls /api/v1/planner/generate-trip
 * Renders real AI-generated itinerary from Groq LLM + RAG pipeline.
 */

/* ── Markdown Itinerary Renderer (GLOBAL — accessible everywhere) ── */
function renderMarkdownItinerary(text, destination, durationDays) {
  if (!text) return "<p style='color:#94a3b8;padding:20px;'>No itinerary content received.</p>";

  // Supports: **Day 1:**, ### Day 1:, Day 1:, Day 1 -
  const dayRegex = /(?:###?\s*|\*{0,2})Day\s+(\d+)[:\*\s\-]/gi;
  const parts = text.split(dayRegex);

  if (parts.length <= 1) {
    // Plain text fallback
    return `
      <div class="itinerary-day">
        <div class="day-header">
          <h3>Your ${durationDays || 3}-Day Plan for ${destination}</h3>
        </div>
        <div class="activity-card">
          <div class="activity-details">
            <p style="line-height:1.8;font-size:15px;">${text.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
      </div>`;
  }

  let html = "";
  for (let i = 1; i < parts.length; i += 2) {
    const dayNum  = parts[i];
    const content = parts[i + 1] || "";

    const lines = content
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 2);

    let activities = "";
    if (lines.length === 0) {
      activities = "<p style='color:#94a3b8;padding:12px'>Free day / No activities specified.</p>";
    } else {
      activities = lines.map((line, idx) => {
        const timeMatch = line.match(/(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)/);
        const timeStr   = timeMatch ? timeMatch[1] : "";
        const title     = line
          .replace(/^[\*\-\•#]+/, "")
          .replace(timeMatch?.[0] || "", "")
          .replace(/\*\*/g, "")
          .trim();
        if (!title) return "";
        return `
          <div class="activity-card" style="animation-delay:${idx * 0.05}s;">
            <div class="activity-time" style="min-width:80px;">${timeStr || "Anytime"}</div>
            <div class="activity-details">
              <p style="margin:0;font-size:14px;line-height:1.6;">${title}</p>
            </div>
          </div>`;
      }).join("");
    }

    html += `
      <div class="itinerary-day">
        <div class="day-header"><h3>Day ${dayNum} – ${destination}</h3></div>
        ${activities}
      </div>`;
  }

  return html || `<div class="itinerary-day"><div class="activity-card"><div class="activity-details"><p style="line-height:1.8;">${text.replace(/\n/g, "<br>")}</p></div></div></div>`;
}

/* ── Load an existing saved trip by ID (GLOBAL) ─────────────────── */
async function loadExistingTrip(tripId) {
  const emptyState   = document.getElementById("emptyState");
  const loadingState = document.getElementById("loadingState");
  const resultState  = document.getElementById("resultState");
  const statusText   = document.getElementById("loadingStatusText");

  emptyState?.classList.add("hidden");
  loadingState?.classList.remove("hidden");
  if (statusText) statusText.textContent = "Loading your saved trip...";

  try {
    const result = await TripsAPI.get(tripId);
    const trip   = result.trip;

    loadingState?.classList.add("hidden");

    if (!trip) {
      emptyState?.classList.remove("hidden");
      return;
    }

    // Pre-fill form
    const destInput = document.getElementById("destination");
    if (destInput) destInput.value = trip.destination;

    // Show result pane
    resultState?.classList.remove("hidden");

    const destEl = document.getElementById("resDest");
    if (destEl) destEl.textContent = trip.destination;

    const d1 = new Date(trip.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const d2 = new Date(trip.end_date).toLocaleDateString("en-US",   { month: "short", day: "numeric" });
    const datesEl = document.getElementById("resDates");
    if (datesEl) datesEl.textContent = `${d1} – ${d2}`;

    const budgetEl = document.getElementById("resBudget");
    if (budgetEl) budgetEl.textContent = `₹${Number(trip.budget).toLocaleString()}`;

    const itinerary = trip.itinerary;
    const costEl    = document.getElementById("resEstimatedCost");
    if (costEl && itinerary?.estimated_cost) {
      costEl.textContent = `₹${Number(itinerary.estimated_cost).toLocaleString()}`;
    }

    const container = document.getElementById("itineraryContainer");
    if (container) {
      container.innerHTML = (itinerary?.itinerary_text)
        ? renderMarkdownItinerary(itinerary.itinerary_text, trip.destination, trip.duration_days)
        : `<div class="itinerary-day"><div class="activity-card"><div class="activity-details">
            <p style="color:#94a3b8;text-align:center;padding:20px;">
              No itinerary saved yet. Click <strong>Generate Itinerary</strong> above to create one for ${trip.destination}.
            </p></div></div></div>`;
    }

    // Wire buttons
    const budgetBtn = document.querySelector(".result-actions .btn-outline-primary");
    if (budgetBtn) {
      budgetBtn.innerHTML = '<i class="fa-solid fa-wallet"></i> Track Budget';
      budgetBtn.onclick   = () => window.location.href = `budget.html?trip=${tripId}`;
    }
    const saveBtn = document.querySelector(".result-actions .btn-primary");
    if (saveBtn) saveBtn.onclick = () => window.location.href = "home.html";

    resultState?.scrollIntoView({ behavior: "smooth", block: "start" });

  } catch (err) {
    document.getElementById("loadingState")?.classList.add("hidden");
    emptyState?.classList.remove("hidden");
    console.warn("Could not load existing trip:", err.message);
    window.showToast?.("Could not load trip: " + err.message, "error", "❌");
  }
}

/* ── Main DOMContentLoaded ─────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = "auth.html";
    return;
  }

  initNavUser();

  const form = document.getElementById("plannerForm");
  if (!form) return;

  // Default dates
  const today    = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 5);
  document.getElementById("startDate").valueAsDate = today;
  document.getElementById("endDate").valueAsDate   = nextWeek;

  const emptyState   = document.getElementById("emptyState");
  const loadingState = document.getElementById("loadingState");
  const resultState  = document.getElementById("resultState");
  const statusText   = document.getElementById("loadingStatusText");
  const loadingBar   = document.getElementById("loadingBar");

  // Chip toggle
  document.querySelectorAll('#interestChips .chip').forEach(chip => {
    chip.style.cursor = 'pointer';
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  // Load existing trip if ?trip= param present
  const urlParams      = new URLSearchParams(window.location.search);
  const existingTripId = parseInt(urlParams.get('trip'));
  if (existingTripId) {
    loadExistingTrip(existingTripId);
  }

  const btn = document.getElementById("generateBtn");

  /* ── Form submit ─────────────────────────────────────────────── */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const destination = document.getElementById("destination").value.trim();
    const startDate   = document.getElementById("startDate").value;
    const endDate     = document.getElementById("endDate").value;
    const budgetEl    = document.querySelector('input[name="budget"]:checked');
    const budgetTier  = budgetEl ? budgetEl.value : "moderate";
    const budgetMap   = { budget: 15000, moderate: 50000, luxury: 150000 };
    const budget      = budgetMap[budgetTier] || 50000;
    const paceVal     = document.getElementById("paceSlider")?.value || 2;
    const paceMap     = { 1: "relaxed", 2: "balanced", 3: "packed" };

    const interests = [...document.querySelectorAll('#interestChips .chip.selected')]
      .map(el => el.dataset.val).filter(Boolean);

    if (!destination) {
      window.showToast("Please enter a destination", "warning", "📍");
      return;
    }

    const dates = buildDateList(startDate, endDate);

    emptyState?.classList.add("hidden");
    resultState?.classList.add("hidden");
    loadingState?.classList.remove("hidden");
    btn.disabled  = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    const stages = [
      { p: 12, t: "Querying RAG city knowledge base..." },
      { p: 30, t: "Fetching real-time weather constraints..." },
      { p: 55, t: "AI reasoning over your preferences..." },
      { p: 80, t: "Groq LLM synthesizing itinerary..." },
      { p: 95, t: "Optimizing route and budget..." },
    ];
    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      if (stageIdx < stages.length) {
        if (loadingBar) loadingBar.style.width = stages[stageIdx].p + "%";
        if (statusText) statusText.textContent  = stages[stageIdx].t;
        stageIdx++;
      }
    }, 1200);

    try {
      const result = await PlannerAPI.generateItinerary({
        destination,
        dates,
        budget,
        interests,
        travel_style:         paceMap[paceVal] || "balanced",
        hotel_preference:     "mid-range",
        transport_preference: "public",
      });

      console.log("[Planner] API result:", result);

      clearInterval(stageInterval);
      if (loadingBar) loadingBar.style.width = "100%";
      if (statusText) statusText.textContent  = "Complete!";
      await new Promise(r => setTimeout(r, 400));

      if (!result?.itinerary) {
        throw new Error("Backend returned no itinerary. Check Groq API key in backend/.env");
      }

      // Render immediately — don't wait for DB save
      renderItinerary(result, destination, startDate, endDate, budget, null);
      window.showToast("AI itinerary generated!", "success", "🧠");

      // Save to DB in background (non-blocking)
      TripsAPI.create({
        destination,
        start_date:           startDate,
        end_date:             endDate,
        budget,
        interests,
        travel_style:         paceMap[paceVal] || "balanced",
        hotel_preference:     "mid-range",
        transport_preference: "public",
        itinerary_text:       result.itinerary,
      }).then(tripResult => {
        if (tripResult?.trip_id) {
          localStorage.setItem("ys_active_trip", tripResult.trip_id);
          // Update Track Budget button now we have an ID
          const budgetBtn = document.querySelector(".result-actions .btn-outline-primary");
          if (budgetBtn) {
            budgetBtn.innerHTML = '<i class="fa-solid fa-wallet"></i> Track Budget';
            budgetBtn.onclick   = () => window.location.href = `budget.html?trip=${tripResult.trip_id}`;
          }
          window.showToast("Trip saved to dashboard!", "success", "💾");
        }
      }).catch(err => {
        console.warn("[Planner] Background save failed:", err.message);
      });

    } catch (err) {
      clearInterval(stageInterval);
      loadingState?.classList.add("hidden");
      emptyState?.classList.remove("hidden");
      window.showToast(`Generation failed: ${err.message}`, "error", "❌");
      console.error("[Planner] Error:", err);
    } finally {
      btn.disabled  = false;
      btn.innerHTML = '<span class="btn-text">Regenerate Itinerary</span><i class="fa-solid fa-rotate-right btn-icon"></i>';
    }
  });

  /* ── Helpers ─────────────────────────────────────────────────── */
  function buildDateList(start, end) {
    const dates   = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates.join(",");
  }

  function renderItinerary(result, dest, startDate, endDate, budget, tripId) {
    loadingState?.classList.add("hidden");
    resultState?.classList.remove("hidden");

    document.getElementById("resDest").textContent   = dest;
    const d1 = new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const d2 = new Date(endDate).toLocaleDateString("en-US",   { month: "short", day: "numeric" });
    document.getElementById("resDates").textContent  = `${d1} – ${d2}`;
    document.getElementById("resBudget").textContent = `₹${Number(budget).toLocaleString()}`;

    const costEl = document.getElementById("resEstimatedCost");
    if (costEl && result.estimated_cost) {
      costEl.textContent = `₹${Number(result.estimated_cost).toLocaleString()}`;
    }

    const container = document.getElementById("itineraryContainer");
    if (container) {
      container.innerHTML = renderMarkdownItinerary(
        result.itinerary || "", result.destination || dest, result.duration_days
      );
    }

    const saveBtn = document.querySelector('.result-actions .btn-primary');
    if (saveBtn) saveBtn.onclick = () => window.location.href = 'home.html';

    if (tripId) {
      const budgetBtn = document.querySelector('.result-actions .btn-outline-primary');
      if (budgetBtn) {
        budgetBtn.innerHTML = '<i class="fa-solid fa-wallet"></i> Track Budget';
        budgetBtn.onclick   = () => window.location.href = `budget.html?trip=${tripId}`;
      }
    }

    resultState?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ── Extra AI Buttons ────────────────────────────────────────── */
  const simulateBtn = document.getElementById("simulateDisruptionBtn");
  if (simulateBtn) {
    simulateBtn.addEventListener('click', async () => {
      const dest = document.getElementById('resDest')?.innerText;
      if (!dest || dest === '—') return alert('Generate a trip first.');
      const originalText = simulateBtn.innerHTML;
      simulateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
      try {
        const res = await window.SimulationAPI.analyzeScenario("Extreme Weather", dest + " itinerary");
        alert("Disruption Analysis:\n\n" + (res.scenario || res.message || JSON.stringify(res)));
      } catch (e) {
        alert("Failed to simulate disruption: " + e.message);
      } finally {
        simulateBtn.innerHTML = originalText;
      }
    });
  }

  const memoryBtn = document.getElementById("memoryAutofillBtn");
  if (memoryBtn) {
    memoryBtn.addEventListener('click', async () => {
      const orig = memoryBtn.innerHTML;
      memoryBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Recalling...';
      try {
        const res = await window.MemoryAPI.recall();
        alert("Memory Auto-fill:\n\n" + (res.memory || res.message || JSON.stringify(res)));
        const chips = document.querySelectorAll('.chip');
        chips.forEach(c => c.classList.add('selected'));
      } catch (e) {
        alert("Memory recall failed: " + e.message);
      } finally {
        memoryBtn.innerHTML = orig;
      }
    });
  }
});
