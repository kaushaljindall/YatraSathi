/**
 * YatraSaathi — planner.js
 * Fully wired to backend: calls /api/v1/planner/generate-trip
 * Renders real AI-generated itinerary from Groq LLM + RAG pipeline.
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = "/auth.html";
    return;
  }

  const form = document.getElementById("plannerForm");
  if (!form) return;

  // Set default dates
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 5);
  document.getElementById("startDate").valueAsDate = today;
  document.getElementById("endDate").valueAsDate = nextWeek;

  const emptyState = document.getElementById("emptyState");
  const loadingState = document.getElementById("loadingState");
  const resultState = document.getElementById("resultState");
  const statusText = document.getElementById("loadingStatusText");
  const loadingBar = document.getElementById("loadingBar");
  const btn = document.getElementById("generateBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const destination = document.getElementById("destination").value.trim();
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const budgetEl = document.querySelector('input[name="budget"]:checked');
    const budget = budgetEl ? budgetEl.value : "1000";
    const paceVal = document.getElementById("paceSlider")?.value || 2;
    const paceMap = { 1: "relaxed", 2: "balanced", 3: "packed" };

    // Collect interests
    const interests = [...document.querySelectorAll('input[name="interest"]:checked')]
      .map((el) => el.value);

    if (!destination) {
      window.showToast("Please enter a destination", "warning", "📍");
      return;
    }

    // Build date list string for backend
    const dates = buildDateList(startDate, endDate);

    // Switch to loading state
    emptyState?.classList.add("hidden");
    resultState?.classList.add("hidden");
    loadingState?.classList.remove("hidden");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    // Animate progress bar through real pipeline stages
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
        if (statusText) statusText.textContent = stages[stageIdx].t;
        stageIdx++;
      }
    }, 1200);

    try {
      const result = await PlannerAPI.generateItinerary({
        destination,
        dates,
        budget,
        interests,
        travel_style: paceMap[paceVal] || "balanced",
        hotel_preference: "mid-range",
        transport_preference: "public",
      });

      clearInterval(stageInterval);
      if (loadingBar) loadingBar.style.width = "100%";
      if (statusText) statusText.textContent = "Complete!";

      await new Promise((r) => setTimeout(r, 400));
      renderItinerary(result, destination, startDate, endDate, budget);
      window.showToast("AI itinerary generated successfully!", "success", "🧠");

    } catch (err) {
      clearInterval(stageInterval);
      loadingState?.classList.add("hidden");
      emptyState?.classList.remove("hidden");
      window.showToast(`Failed: ${err.message}`, "error", "❌");
      console.error("Itinerary generation error:", err);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span class="btn-text">Regenerate Itinerary</span><i class="fa-solid fa-rotate-right btn-icon"></i>';
    }
  });

  function buildDateList(start, end) {
    const dates = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates.join(",");
  }

  function renderItinerary(result, dest, startDate, endDate, budget) {
    loadingState?.classList.add("hidden");
    resultState?.classList.remove("hidden");

    document.getElementById("resDest").textContent = dest;

    const d1 = new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const d2 = new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    document.getElementById("resDates").textContent = `${d1} – ${d2}`;
    document.getElementById("resBudget").textContent = `₹${Number(budget).toLocaleString()}`;

    // Show estimated cost from backend
    const costEl = document.getElementById("resEstimatedCost");
    if (costEl && result.estimated_cost) {
      costEl.textContent = `Est. Spend: ₹${Number(result.estimated_cost).toLocaleString()}`;
    }

    const container = document.getElementById("itineraryContainer");
    const rawText = result.itinerary || "";

    // Render markdown-like AI output as structured HTML
    container.innerHTML = renderMarkdownItinerary(rawText, result.destination, result.duration_days);
  }

  function renderMarkdownItinerary(text, destination, durationDays) {
    if (!text) return "<p style='color:#94a3b8'>No itinerary content received.</p>";

    // Split by "Day N" markers
    const dayRegex = /\*{0,2}Day\s+(\d+)[:\*\s]/gi;
    const parts = text.split(dayRegex);

    if (parts.length <= 1) {
      // Plain text fallback — wrap in a readable card
      return `
        <div class="itinerary-day">
          <div class="day-header">
            <div class="day-num">📋</div>
            <div class="day-title">Your ${durationDays}-Day Plan for ${destination}</div>
          </div>
          <div class="day-timeline">
            <div class="timeline-item">
              <div class="ti-dot"></div>
              <div class="ti-desc">${text.replace(/\n/g, "<br>")}</div>
            </div>
          </div>
        </div>`;
    }

    let html = "";
    for (let i = 1; i < parts.length; i += 2) {
      const dayNum = parts[i];
      const content = parts[i + 1] || "";

      // Extract activity lines
      const lines = content
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 10);

      const activities = lines
        .slice(0, 8)
        .map((line, idx) => {
          // Try to detect time patterns like "9:00 AM"
          const timeMatch = line.match(/(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)/);
          const timeStr = timeMatch ? timeMatch[1] : "";
          const title = line
            .replace(/^[\*\-\•#]+/, "")
            .replace(timeMatch?.[0] || "", "")
            .replace(/\*\*/g, "")
            .trim();

          if (!title) return "";

          return `
            <div class="timeline-item" style="animation-delay:${idx * 0.08}s">
              <div class="ti-dot"></div>
              <div class="ti-header">
                <div class="ti-title">${title}</div>
                ${timeStr ? `<div class="ti-time">${timeStr}</div>` : ""}
              </div>
            </div>`;
        })
        .join("");

      html += `
        <div class="itinerary-day">
          <div class="day-header">
            <div class="day-num">Day ${dayNum}</div>
            <div class="day-title">${destination} – Day ${dayNum}</div>
          </div>
          <div class="day-timeline">${activities || "<p style='color:#94a3b8;padding:12px'>See full plan above.</p>"}</div>
        </div>`;
    }

    return html || `<div class="itinerary-day"><div class="day-timeline"><div class="timeline-item"><div class="ti-dot"></div><div class="ti-desc">${text.replace(/\n/g, "<br>")}</div></div></div></div>`;
  }
});
