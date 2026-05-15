/**
 * YatraSaathi — city.js
 * Fully wired to backend: city search calls /api/v1/city/city-insights (RAG + Groq).
 * Filter buttons trigger new RAG queries with category hints.
 */

document.addEventListener("DOMContentLoaded", () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = "auth.html";
    return;
  }

  initNavUser();

  let currentCity = "";
  let activeCategory = "all";

  // ── Search Logic ───────────────────────────────────────────────
  const searchBtn = document.getElementById("citySearchBtn");
  const searchInput = document.querySelector(".city-search-input");

  if (searchBtn && searchInput) {
    const doSearch = async () => {
      const city = searchInput.value.trim();
      if (!city) {
        window.showToast("Enter a city name to search", "warning", "🏙️");
        return;
      }

      currentCity = city;
      activeCategory = "all";
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      document.querySelector('.filter-btn[data-cat="all"]')?.classList.add("active");

      await fetchAndRenderInsights(city, `Tell me about ${city} — top attractions, food, transport, and travel tips`);
    };

    searchBtn.addEventListener("click", doSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") doSearch();
    });
  }

  // ── Filter Buttons ─────────────────────────────────────────────
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!currentCity) {
        window.showToast("Search for a city first", "info", "🔍");
        return;
      }

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.dataset.cat || btn.textContent.trim().toLowerCase();
      activeCategory = cat;

      const queryMap = {
        all:          `Tell me about ${currentCity} — top attractions, food, transport, and travel tips`,
        food:         `Best food and restaurants in ${currentCity} — local dishes, street food, budget vs fine dining`,
        transport:    `How to get around ${currentCity} — metro, bus, taxi, auto-rickshaw, costs and tips`,
        attractions:  `Top tourist attractions and hidden gems in ${currentCity} with entry fees and visiting tips`,
        safety:       `Safety tips, common scams, and what to avoid in ${currentCity} for tourists`,
        budget:       `Budget breakdown for ${currentCity} — daily costs for food, transport, accommodation, activities`,
        culture:      `Cultural experiences, festivals, customs and etiquette in ${currentCity}`,
      };

      const query = queryMap[cat] || `${cat} information for tourists in ${currentCity}`;
      await fetchAndRenderInsights(currentCity, query);
    });
  });

  // ── Save / Add to plan buttons ─────────────────────────────────
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".ic-footer .btn");
    if (!btn) return;

    const cardTitle = btn.closest(".insight-card-content")?.querySelector("h4")?.textContent || "Item";
    const action = btn.textContent.trim();

    if (action.includes("Save")) {
      window.showToast(`Saved: ${cardTitle}`, "success", "📌");
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
      btn.style.background = "var(--clr-emerald, #10b981)";
    } else {
      window.showToast(`Added ${cardTitle} to itinerary`, "success", "✅");
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      btn.style.background = "var(--clr-emerald, #10b981)";
    }
    btn.disabled = true;
  });
});

/* ── Fetch RAG insights and render ───────────────────────────── */
async function fetchAndRenderInsights(city, query) {
  const grid = document.querySelector(".insights-grid");
  const searchBtn = document.getElementById("citySearchBtn");

  if (searchBtn) {
    searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    searchBtn.disabled = true;
  }

  if (grid) {
    grid.style.opacity = "0.4";
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:40px;color:#94a3b8;">
        <i class="fa-solid fa-brain fa-spin" style="font-size:2rem;color:#8b5cf6;margin-bottom:12px;display:block;"></i>
        Querying RAG knowledge base for <strong style="color:#f1f5f9;">${city}</strong>...
      </div>`;
    grid.style.opacity = "1";
  }

  try {
    const result = await CityAPI.getInsights(city, query);
    const insights = result.insights || "No insights found.";
    const sourcesUsed = result.sources_used || 0;

    if (grid) {
      grid.style.opacity = "0";
      setTimeout(() => {
        grid.innerHTML = renderInsightCards(city, insights, sourcesUsed, query);
        grid.style.opacity = "1";
        grid.style.transition = "opacity 0.4s ease";
      }, 200);
    }

    window.showToast(`Loaded ${sourcesUsed} RAG context chunks for ${city}`, "success", "🧠");

  } catch (err) {
    if (grid) {
      grid.style.opacity = "1";
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;color:#ef4444;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
          ${err.message || "Failed to load city insights"}
          <br><small style="color:#64748b;margin-top:8px;display:block;">Make sure the backend is running and RAG is seeded.</small>
        </div>`;
    }
    console.error("City insights error:", err);
  } finally {
    if (searchBtn) {
      searchBtn.innerHTML = "Explore";
      searchBtn.disabled = false;
    }
  }
}

/* ── Render AI response as insight cards ──────────────────────── */
function renderInsightCards(city, insights, sources, query) {
  // Split the AI response into logical sections at double newlines or numbered lists
  const paragraphs = insights
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30);

  if (paragraphs.length === 0) {
    return `<div style="grid-column:1/-1;color:#94a3b8;padding:20px;">${insights}</div>`;
  }

  const icons = ["🗺️", "🍽️", "🚌", "🏛️", "💡", "💰", "🎭", "🌟", "📍", "🧳"];

  return paragraphs
    .slice(0, 8)
    .map((para, i) => {
      // Extract a title from the first line or numbered heading
      const lines = para.split("\n");
      let title = lines[0].replace(/^[\d\.\*\#\-]+\s*/, "").replace(/\*\*/g, "").trim();
      const body = lines.slice(1).join(" ").replace(/\*\*/g, "<strong>$&</strong>") || para;

      if (title.length > 60) {
        title = title.slice(0, 57) + "...";
      }

      return `
        <div class="insight-card">
          <div class="insight-card-content">
            <div style="font-size:1.8rem;margin-bottom:10px;">${icons[i % icons.length]}</div>
            <h4 style="color:#f1f5f9;margin:0 0 8px;font-size:15px;line-height:1.4;">${title || `Insight ${i + 1}`}</h4>
            <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:0 0 12px;">${body.replace(/\n/g, " ").slice(0, 200)}${body.length > 200 ? "..." : ""}</p>
            <div class="ic-footer" style="display:flex;gap:8px;margin-top:auto;">
              <button class="btn btn-sm" style="font-size:12px;padding:6px 12px;">
                <i class="fa-solid fa-bookmark"></i> Save Note
              </button>
              <button class="btn btn-sm btn-outline" style="font-size:12px;padding:6px 12px;">
                <i class="fa-solid fa-plus"></i> Add to Plan
              </button>
            </div>
          </div>
        </div>`;
    })
    .join("") + `
    <div style="grid-column:1/-1;text-align:center;padding:12px;color:#64748b;font-size:12px;">
      🧠 Generated using RAG · ${sources} knowledge chunks retrieved for <strong style="color:#8b5cf6">${city}</strong>
    </div>`;
}
