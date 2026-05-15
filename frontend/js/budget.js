/**
 * YatraSaathi — budget.js
 * Fully wired to backend: loads real expenses + runs AI budget analysis.
 * Chart.js renders actual expense breakdown from DB.
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (!Auth.isLoggedIn()) {
    window.location.href = "auth.html";
    return;
  }

  initNavUser();

  // Read active trip from URL or localStorage
  const params = new URLSearchParams(window.location.search);
  let tripId = parseInt(params.get("trip")) || parseInt(localStorage.getItem("ys_active_trip"));

  if (!tripId) {
    // Show trip selector
    await showTripSelector();
    return;
  }

  await initBudgetPage(tripId);
});

/* ── Trip selector (no trip in URL) ──────────────────────────── */
async function showTripSelector() {
  const banner = document.getElementById("tripSelectorBanner");
  if (banner) banner.style.display = "flex";

  try {
    const result = await TripsAPI.listMine();
    const trips  = result.trips || [];
    const select = document.getElementById("tripSelector");

    if (!select) return;

    if (trips.length === 0) {
      select.innerHTML = '<option value="">No trips found — plan one first!</option>';
      return;
    }

    select.innerHTML = trips.map((t) =>
      `<option value="${t.trip_id}">${t.destination} (${t.start_date})</option>`
    ).join("");

    // Auto-load first trip
    const firstId = trips[0].trip_id;
    localStorage.setItem("ys_active_trip", firstId);
    await initBudgetPage(firstId);

  } catch (err) {
    console.error("Trip selector error:", err);
    renderNoTripState();
  }
}

window.onTripSelect = async function () {
  const select = document.getElementById("tripSelector");
  const id = parseInt(select?.value);
  if (!id) return;
  localStorage.setItem("ys_active_trip", id);
  const banner = document.getElementById("tripSelectorBanner");
  if (banner) banner.style.display = "none";
  await initBudgetPage(id);
};

/* ── Initialize full budget page for a trip ─────────────────── */
async function initBudgetPage(tripId) {
  await loadBudgetDashboard(tripId);

  // Wire add-expense form
  const addForm = document.getElementById("addExpenseForm");
  if (addForm) {
    // Remove any previous listener
    addForm.replaceWith(addForm.cloneNode(true));
    document.getElementById("addExpenseForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const category    = document.getElementById("expenseCategory").value;
      const amount      = parseFloat(document.getElementById("expenseAmount").value);
      const description = document.getElementById("expenseDesc")?.value || "";

      if (!amount || amount <= 0) {
        window.showToast("Enter a valid amount", "warning", "⚠️");
        return;
      }

      const btn = e.target.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Adding...'; }

      try {
        const result = await ExpensesAPI.add(tripId, category, amount, description);
        const isScam = result.analysis?.scam_alert?.is_suspicious;
        window.showToast(
          isScam
            ? `⚠️ Potential scam! ${result.analysis.scam_alert.warnings?.[0] || "Be careful."}`
            : `Expense logged: ₹${amount} (${result.analysis?.category || category})`,
          isScam ? "warning" : "success",
          isScam ? "🚨" : "✅"
        );
        e.target.reset();
        await loadBudgetDashboard(tripId);
      } catch (err) {
        window.showToast(`Failed: ${err.message}`, "error", "❌");
      } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Expense'; }
      }
    });
  }
}

/* ── Chart instance ──────────────────────────────────────────── */
let chartInstance = null;

/* ── Load full budget dashboard ─────────────────────────────── */
async function loadBudgetDashboard(tripId) {
  try {
    const tripResult  = await TripsAPI.get(tripId);
    const trip        = tripResult.trip;
    const expenses    = trip.expenses || [];
    const totalBudget = trip.budget || 0;
    const totalSpent  = trip.total_spent || 0;

    // Update subtitle
    const subtitle = document.getElementById("budgetSubtitle");
    if (subtitle) {
      subtitle.textContent = `Real-time expense monitoring for your trip to ${trip.destination}.`;
    }

    // Update header metrics
    updateMetrics(totalBudget, totalSpent, trip);

    // AI budget analysis (non-blocking)
    if (expenses.length > 0) {
      BudgetAPI.analyze(tripId, totalBudget, expenses)
        .then((analysis) => {
          renderAIAdvice(analysis.data);
          renderBurnRate(analysis.data?.burn_rate);
        })
        .catch(() => {
          const el = document.getElementById("aiAdvice");
          if (el) el.innerHTML = '<span style="color:#64748b;font-size:13px;">AI analysis unavailable — add more expenses to unlock insights.</span>';
        });
    } else {
      const el = document.getElementById("aiAdvice");
      if (el) el.innerHTML = '<span style="color:#64748b;font-size:13px;">Log some expenses to unlock AI-powered budget advice.</span>';
    }

    // Render chart + list
    renderExpenseChart(expenses, totalBudget);
    renderExpenseList(expenses);

  } catch (err) {
    console.error("Budget dashboard error:", err);
    window.showToast(`Could not load budget data: ${err.message}`, "error", "❌");
  }
}

/* ── Update metric widgets ───────────────────────────────────── */
function updateMetrics(budget, spent, trip) {
  const remaining = budget - spent;
  const pct       = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  setEl("budgetTotal",      `₹${Number(budget).toLocaleString()}`);
  setEl("budgetSpent",      `₹${Number(spent).toLocaleString()}`);
  setEl("budgetRemaining",  `₹${Number(remaining).toLocaleString()}`);
  setEl("budgetPercent",    `${pct.toFixed(1)}%`);
  setEl("budgetDestination", trip.destination || "—");
  setEl("budgetDuration",   trip.duration_days ? `${trip.duration_days} days` : "—");

  const bar = document.getElementById("budgetProgressBar");
  if (bar) {
    bar.style.width = pct + "%";
    bar.style.background = pct > 90
      ? "linear-gradient(90deg,#ef4444,#dc2626)"
      : pct > 70
      ? "linear-gradient(90deg,#f59e0b,#ef4444)"
      : "linear-gradient(90deg,#10b981,#06b6d4)";
  }

  // Update remaining colour
  const remEl = document.getElementById("budgetRemaining");
  if (remEl) {
    remEl.style.color = remaining < 0 ? "#ef4444" : pct > 80 ? "#f59e0b" : "#10b981";
  }

  // Update expense count
  const countEl = document.getElementById("expenseCount");
  if (countEl && trip.expenses) {
    countEl.textContent = `${trip.expenses.length} transaction${trip.expenses.length !== 1 ? "s" : ""}`;
  }
}

/* ── Render doughnut chart ───────────────────────────────────── */
function renderExpenseChart(expenses, totalBudget) {
  const ctx = document.getElementById("budgetChart");
  if (!ctx) return;

  const breakdown = {};
  expenses.forEach((e) => {
    const cat = e.category || "Other";
    breakdown[cat] = (breakdown[cat] || 0) + e.amount;
  });

  let labels = Object.keys(breakdown);
  let data   = Object.values(breakdown);

  if (labels.length === 0) {
    labels = ["Remaining Budget"];
    data   = [totalBudget];
  }

  const colors = [
    "rgba(59,130,246,0.85)",
    "rgba(139,92,246,0.85)",
    "rgba(245,158,11,0.85)",
    "rgba(16,185,129,0.85)",
    "rgba(6,182,212,0.85)",
    "rgba(239,68,68,0.85)",
    "rgba(249,115,22,0.85)",
    "rgba(236,72,153,0.85)",
  ];

  Chart.defaults.color      = "#94a3b8";
  Chart.defaults.font.family = "'Inter', sans-serif";

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor:     "#0a1628",
        borderWidth:     2,
        hoverOffset:     10,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          position: "right",
          labels: { padding: 20, usePointStyle: true, pointStyle: "circle" },
        },
        tooltip: {
          backgroundColor: "rgba(15,23,42,0.97)",
          titleFont:       { size: 13, family: "'Space Grotesk', sans-serif" },
          bodyFont:        { size: 13 },
          padding:         12,
          borderColor:     "rgba(255,255,255,0.1)",
          borderWidth:     1,
          callbacks: {
            label: (ctx) => ` ₹${ctx.raw.toLocaleString()} — ${((ctx.raw / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%`,
          },
        },
      },
    },
  });
}

/* ── Render expense list ─────────────────────────────────────── */
function renderExpenseList(expenses) {
  const container = document.getElementById("expenseList");
  if (!container) return;

  if (expenses.length === 0) {
    container.innerHTML = `
      <div style="color:#64748b;text-align:center;padding:30px;">
        <i class="fa-solid fa-receipt" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:8px;"></i>
        No expenses recorded yet.
      </div>`;
    return;
  }

  const icons = { food: "🍽️", transport: "🚗", accommodation: "🏨", activity: "🎯", shopping: "🛍️" };

  container.innerHTML = expenses
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map((e) => {
      const icon  = icons[e.category?.toLowerCase()] || "💳";
      const date  = new Date(e.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
      const scamBadge = e.scam_alert
        ? `<span style="background:#7f1d1d;color:#fca5a5;font-size:11px;padding:2px 8px;border-radius:20px;margin-left:8px;">⚠️ Suspicious</span>`
        : "";
      const statusColor = e.pricing_status === "tourist_trap" ? "#ef4444"
        : e.pricing_status === "expensive" ? "#f59e0b"
        : e.pricing_status === "fair"      ? "#10b981"
        : "#64748b";

      return `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.4rem">${icon}</span>
            <div>
              <div style="color:#f1f5f9;font-size:14px;">${e.description || e.category} ${scamBadge}</div>
              <div style="color:#64748b;font-size:12px;">${date} · <span style="color:${statusColor}">${e.pricing_status || "fair"}</span></div>
            </div>
          </div>
          <div style="color:#f1f5f9;font-weight:600;">₹${Number(e.amount).toLocaleString()}</div>
        </div>`;
    })
    .join("");
}

/* ── AI advice + burn rate renderers ────────────────────────── */
function renderAIAdvice(budgetData) {
  const el = document.getElementById("aiAdvice");
  if (!el || !budgetData?.ai_advice) return;
  el.innerHTML = `<div style="color:#c4b5fd;line-height:1.7;font-size:0.875rem;">${budgetData.ai_advice.replace(/\n/g, "<br>")}</div>`;
}

function renderBurnRate(burnRate) {
  if (!burnRate) return;
  const el = document.getElementById("burnRateStatus");
  if (!el) return;
  const colors = { healthy: "#10b981", caution: "#f59e0b", danger: "#ef4444" };
  const color  = colors[burnRate.status] || "#94a3b8";
  el.innerHTML = `
    <span style="color:${color};font-weight:600">${burnRate.status?.toUpperCase() || "OK"}</span>
    — ${burnRate.message || ""}
    ${burnRate.projected_total ? `<br><small style="color:#64748b">Projected total: ₹${Number(burnRate.projected_total).toLocaleString()}</small>` : ""}`;
}

/* ── No-trip fallback ───────────────────────────────────────── */
function renderNoTripState() {
  const main = document.querySelector(".budget-layout");
  if (main) {
    main.innerHTML = `
      <div style="text-align:center;padding:80px 20px;color:#94a3b8;">
        <i class="fa-solid fa-wallet" style="font-size:3rem;opacity:0.3;display:block;margin-bottom:16px;"></i>
        <h3 style="color:#f1f5f9;margin-bottom:8px;">No Trips Found</h3>
        <p>Plan a trip first to track your budget.</p>
        <a href="planner.html" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;">Plan a Trip →</a>
      </div>`;
  }
}

/* ── Utility ────────────────────────────────────────────────── */
function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
