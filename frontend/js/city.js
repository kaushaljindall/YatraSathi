document.addEventListener("DOMContentLoaded", () => {
  initNavUser();
  const searchForm = document.getElementById("citySearchForm");
  const cityInput = document.getElementById("cityInput");

  if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const city = cityInput.value.trim();
      if (!city) return;
      await searchCity(city);
    });
  }
});

async function searchCity(cityName) {
  const loading = document.getElementById("loadingState");
  const content = document.getElementById("insightsContent");
  
  // Reset UI
  loading.style.display = "block";
  content.classList.remove("visible");
  document.getElementById("cityInput").value = cityName;
  
  // Smooth scroll down to loading
  window.scrollTo({
    top: document.querySelector('.city-hero').offsetHeight + 50,
    behavior: 'smooth'
  });

  try {
    const res = await CityAPI.getInsights(cityName, "Tell me everything about this city.");
    if (res.success && res.insights) {
      populateInsights(res.insights);
      loading.style.display = "none";
      content.classList.add("visible");
    } else {
      throw new Error(res.error || "Failed to load insights.");
    }
  } catch (err) {
    loading.style.display = "none";
    window.showToast(err.message || "Failed to fetch city insights.", "error", "⚠️");
  }
}

function populateInsights(data) {
  // 1. Quick Stats
  const qs = data.quick_stats || {};
  document.getElementById("statBudget").textContent = qs.daily_budget || "—";
  document.getElementById("statSeason").textContent = qs.best_season || "—";
  document.getElementById("statLang").textContent = qs.primary_language || "—";
  document.getElementById("statDays").textContent = qs.ideal_stay_days || "—";

  // 2. Attractions
  const attGrid = document.getElementById("attractionsGrid");
  const attractions = data.attractions || [];
  if (attractions.length) {
    attGrid.innerHTML = attractions.map(a => `
      <div class="attraction-card">
        <div class="attraction-img-wrap">
          <img src="${a.img || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop'}" alt="${a.name}" class="attraction-img">
        </div>
        <div class="attraction-body">
          <div class="attraction-tag" style="background:rgba(223,105,81,0.1); color:#DF6951;">${a.tag || "Spot"}</div>
          <h3>${a.name}</h3>
          <p>${a.desc}</p>
          <div class="attraction-meta">
            <div class="attraction-rating"><i class="fa-solid fa-star"></i> ${a.rating}</div>
            <div class="attraction-timing"><i class="fa-regular fa-clock"></i> ${a.timing}</div>
          </div>
        </div>
      </div>
    `).join('');
  } else {
    attGrid.innerHTML = "<p>No attractions data available.</p>";
  }

  // 3. Weather
  document.getElementById("weatherDesc").textContent = data.weather_desc || "";
  const wmGrid = document.getElementById("weatherMonths");
  const weather = data.weather_months || [];
  if (weather.length) {
    wmGrid.innerHTML = weather.map(w => `
      <div class="weather-month ${w.is_best ? 'best-month' : ''}">
        <div class="wm-label">${w.month} ${w.is_best ? '<i class="fa-solid fa-star"></i>' : ''}</div>
        <div class="wm-emoji">${w.emoji}</div>
        <div class="wm-temp">${w.temp}</div>
        <div class="wm-type">${w.type}</div>
      </div>
    `).join('');
  } else {
    wmGrid.innerHTML = "<p>No weather data available.</p>";
  }

  // 4. Food
  const foodList = document.getElementById("foodList");
  const food = data.food || [];
  if (food.length) {
    foodList.innerHTML = food.map(f => `
      <div class="food-item">
        <div class="food-emoji">${f.emoji}</div>
        <div class="food-info">
          <h4>${f.name}</h4>
          <p>${f.desc}</p>
        </div>
        <div class="food-price">${f.price}</div>
      </div>
    `).join('');
  } else {
    foodList.innerHTML = "<p>No food data available.</p>";
  }

  // 5. Transport
  document.getElementById("transportDesc").textContent = data.transport_desc || "";
  const tList = document.getElementById("transportList");
  const transport = data.transport || [];
  if (transport.length) {
    tList.innerHTML = transport.map(t => `
      <div class="transport-item">
        <div class="transport-icon" style="background:rgba(65,82,203,0.1); color:#4152CB;">
          <i class="${t.icon_class || 'fa-solid fa-bus'}"></i>
        </div>
        <div class="transport-info">
          <h4>${t.name}</h4>
          <p>${t.desc}</p>
        </div>
        <div class="transport-cost">${t.cost}</div>
      </div>
    `).join('');
  } else {
    tList.innerHTML = "<p>No transport data available.</p>";
  }

  // 6. Tips
  const tipsGrid = document.getElementById("tipsGrid");
  const tips = data.tips || [];
  if (tips.length) {
    tipsGrid.innerHTML = tips.map((t, idx) => `
      <div class="tip-item">
        <div class="tip-num">${idx + 1}</div>
        <div class="tip-text">
          <h4>${t.title}</h4>
          <p>${t.desc}</p>
        </div>
      </div>
    `).join('');
  } else {
    tipsGrid.innerHTML = "<p>No tips available.</p>";
  }

  // 7. Budget Tiers
  const bTiers = document.getElementById("budgetTiers");
  const tiers = data.budget_tiers || [];
  if (tiers.length) {
    bTiers.innerHTML = tiers.map(t => {
      const itemsHtml = t.items ? t.items.map(i => `<div class="tier-item"><i class="fa-solid fa-check"></i> ${i}</div>`).join('') : '';
      return `
      <div class="budget-tier ${t.is_recommended ? 'recommended' : ''}">
        ${t.is_recommended ? '<div class="tier-badge">Recommended</div>' : ''}
        <div class="tier-name">${t.name}</div>
        <div class="tier-price">${t.price}</div>
        <div class="tier-period">${t.period}</div>
        <div class="tier-items">
          ${itemsHtml}
        </div>
      </div>
      `;
    }).join('');
  } else {
    bTiers.innerHTML = "<p>No budget tiers available.</p>";
  }
}
