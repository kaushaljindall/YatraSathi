/* YatraSaathi — city.js */

document.addEventListener('DOMContentLoaded', () => {
  // Filter button logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');
      
      // Simulate RAG filtering (just visual feedback for demo)
      const grid = document.querySelector('.insights-grid');
      grid.style.opacity = '0';
      setTimeout(() => {
        grid.style.opacity = '1';
        window.showToast(`Filtered insights by: ${btn.textContent}`, 'info', '🧠');
      }, 300);
    });
  });

  // Search logic
  const searchBtn = document.getElementById('citySearchBtn');
  const searchInput = document.querySelector('.city-search-input');
  
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const city = searchInput.value.trim();
      if (!city) return;
      
      searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      
      setTimeout(() => {
        searchBtn.innerHTML = 'Explore';
        window.showToast(`Loading RAG insights for ${city}...`, 'success');
      }, 1000);
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchBtn.click();
    });
  }

  // Add to plan buttons
  document.querySelectorAll('.ic-footer .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const cardTitle = this.closest('.insight-card-content').querySelector('h4').textContent;
      
      if (this.textContent === 'Save Note') {
        window.showToast(`Saved note: ${cardTitle}`, 'success');
        this.innerHTML = '<i class="fa-solid fa-check"></i> Saved';
      } else {
        window.showToast(`Added ${cardTitle} to your itinerary!`, 'success');
        this.innerHTML = '<i class="fa-solid fa-check"></i> Added';
      }
      this.style.background = 'var(--clr-emerald)';
      this.style.borderColor = 'var(--clr-emerald)';
    });
  });
});
