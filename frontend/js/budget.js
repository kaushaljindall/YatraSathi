/* YatraSaathi — budget.js */

document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('budgetChart');
  if (!ctx) return;

  // Chart.js defaults for dark theme
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.font.family = "'Inter', sans-serif";

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Flights', 'Accommodation', 'Food & Dining', 'Local Transport', 'Activities'],
      datasets: [{
        data: [28000, 12000, 8500, 3500, 8000],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Primary blue
          'rgba(139, 92, 246, 0.8)',   // Purple
          'rgba(245, 158, 11, 0.8)',   // Amber
          'rgba(16, 185, 129, 0.8)',   // Emerald
          'rgba(6, 182, 212, 0.8)'     // Teal
        ],
        borderColor: '#0a1628',
        borderWidth: 2,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleFont: { size: 14, family: "'Space Grotesk', sans-serif" },
          bodyFont: { size: 14 },
          padding: 12,
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return ' ₹' + context.raw.toLocaleString();
            }
          }
        }
      }
    }
  });
});
