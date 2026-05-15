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

  // Read active trip from URL or localStorage
  const params = new URLSearchParams(window.location.search);
  const tripId = parseInt(params.get("trip")) || parseInt(localStorage.getItem("ys_active_trip"));

  if (!tripId) {
    renderNoTripState();
    return;
  }

  await loadBudgetDashboard(tripId);

  // Add Expense Form
  const addForm = document.getElementById("addExpenseForm");
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const category = document.getElementById("expenseCategory").value;
      const amount = parseFloat(document.getElementById("expenseAmount").value);
      const desc = document.getElementById("expenseDesc")?.value || category;

      if (!amount || amount <= 0) {
        window.showToast("Enter a valid amount", "warning");
        return;
      }

      try {
        const result = await ExpensesAPI.add(tripId, category, amount);
        window.showToast(
          result.analysis?.scam_alert?.is_suspicious
            ? `⚠️ Potential scam detected! ${result.analysis.scam_alert.warnings?.[0] || ""}`
            : `Expense added: ₹${amount} (${result.analysis?.category || category})`,
          result.analysis?.scam_alert?.is_suspicious ? "warning" : "success",
          result.analysis?.scam_alert?.is_suspicious ? "🚨" : "✅"
        );
        addForm.reset();
        await loadBudgetDashboard(tripId); // Refresh
      } catch (err) {
        window.showToast(`Failed to add expense: ${err.message}`, "error");
      }
    });
  }
});

let chartInstance = null;

async function loadBudgetDashboard(tripId) {
  try {
    // 1. Load trip + expenses
    const tripResult = await TripsAPI.get(tripId);
    const trip = tripResult.trip;
    const expenses = trip.expenses || [];
    const totalBudget = trip.budget || 0;
    const totalSpent = trip.total_spent || 0;

    // 2. Update header metrics
    updateMetrics(totalBudget, totalSpent, trip);

    // 3. Run AI budget analysis
    if (expenses.length > 0) {
      try {
        const analysis = await BudgetAPI.analyze(tripId, totalBudget, expenses);
        renderAIAdvice(analysis.data);
        renderBurnRate(analysis.data?.burn_rate);
      } catch {
        // Non-critical — skip if analysis fails
      }
    }

    // 4. Render chart
    renderExpenseChart(expenses, totalBudget);

    // 5. Render expense list
    renderExpenseList(expenses);

  } catch (err) {
    console.error("Budget dashboard error:", err);
    window.showToast(`Could not load budget data: ${err.message}`, "error");
  }
}

function updateMetrics(budget, spent, trip) {
  const remaining = budget - spent;
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;

  setEl("budgetTotal", `₹${budget.toLocaleString()}`);
  setEl("budgetSpent", `₹${spent.toLocaleString()}`);
  setEl("budgetRemaining", `₹${remaining.toLocaleString()}`);
  setEl("budgetPercent", `${pct.toFixed(1)}%`);
  setEl("budgetDestination", trip.destination || "");
  setEl("budgetDuration", trip.duration_days ? `${trip.duration_days} days` : "");

  const bar = document.getElementById("budgetProgressBar");
  if (bar) {
    bar.style.width = pct + "%";
    bar.style.background = pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "#10b981";
  }
}

function renderExpenseChart(expenses, totalBudget) {
  const ctx = document.getElementById("budgetChart");
  if (!ctx) return;

  // Aggregate by category
  const breakdown = {};
  expenses.forEach((e) => {
    const cat = e.category || "Other";
    breakdown[cat] = (breakdown[cat] || 0) + e.amount;
  });

  const labels = Object.keys(breakdown);
  const data = Object.values(breakdown);

  if (labels.length === 0) {
    // Show placeholder with budget only
    labels.push("Remaining Budget");
    data.push(totalBudget);
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

  Chart.defaults.color = "#94a3b8";
  Chart.defaults.font.family = "'Inter', sans-serif";

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: "#0a1628",
        borderWidth: 2,
        hoverOffset: 10,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: {
          position: "right",
          labels: { padding: 20, usePointStyle: true, pointStyle: "circle" },
        },
        tooltip: {
          backgroundColor: "rgba(15,23,42,0.97)",
          titleFont: { size: 13, family: "'Space Grotesk', sans-serif" },
          bodyFont: { size: 13 },
          padding: 12,
          borderColor: "rgba(255,255,255,0.1)",
          borderWidth: 1,
          callbacks: {
            label: (ctx) => ` ₹${ctx.raw.toLocaleString()} — ${((ctx.raw / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%`,
          },
        },
      },
    },
  });
}

function renderExpenseList(expenses) {
  const container = document.getElementById("expenseList");
  if (!container) return;

  if (expenses.length === 0) {
    container.innerHTML = `<div style="color:#64748b;text-align:center;padding:20px;">No expenses recorded yet.</div>`;
    return;
  }

  const icons = { food: "🍽️", transport: "🚗", accommodation: "🏨", activity: "🎯", shopping: "🛍️" };

  container.innerHTML = expenses
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .map((e) => {
      const icon = icons[e.category?.toLowerCase()] || "💳";
      const date = new Date(e.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
      const scamBadge = e.scam_alert
        ? `<span style="background:#7f1d1d;color:#fca5a5;font-size:11px;padding:2px 8px;border-radius:20px;margin-left:8px;">⚠️ Suspicious</span>`
        : "";
      const statusColor = e.pricing_status === "tourist_trap" ? "#ef4444"
        : e.pricing_status === "expensive" ? "#f59e0b"
        : e.pricing_status === "fair" ? "#10b981"
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

function renderAIAdvice(budgetData) {
  const el = document.getElementById("aiAdvice");
  if (!el || !budgetData?.ai_advice) return;
  el.innerHTML = `<div style="color:#c4b5fd;line-height:1.6;">${budgetData.ai_advice.replace(/\n/g, "<br>")}</div>`;
}

function renderBurnRate(burnRate) {
  if (!burnRate) return;
  const el = document.getElementById("burnRateStatus");
  if (!el) return;

  const statusColors = { healthy: "#10b981", caution: "#f59e0b", danger: "#ef4444" };
  const color = statusColors[burnRate.status] || "#94a3b8";
  el.innerHTML = `
    <span style="color:${color};font-weight:600">${burnRate.status?.toUpperCase() || "OK"}</span>
    — ${burnRate.message || ""}
    ${burnRate.projected_total ? `<br><small style="color:#64748b">Projected total: ₹${Number(burnRate.projected_total).toLocaleString()}</small>` : ""}`;
}

function renderNoTripState() {
  const main = document.querySelector("main, .budget-container");
  if (main) {
    main.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#94a3b8;">
        <i class="fa-solid fa-wallet" style="font-size:3rem;opacity:0.3;display:block;margin-bottom:16px;"></i>
        <h3 style="color:#f1f5f9;margin-bottom:8px;">No Active Trip</h3>
        <p>Select a trip from your dashboard or plan a new one.</p>
        <a href="planner.html" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;">Plan a Trip →</a>
      </div>`;
  }
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
