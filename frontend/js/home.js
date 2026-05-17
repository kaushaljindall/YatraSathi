// macOS Dock Hover Magnification Logic
  document.addEventListener('DOMContentLoaded', () => {
    const dockOuter = document.querySelector('.dock-outer');
    const dockItems = document.querySelectorAll('.dock-item');
    const baseSize = 45; 
    const maxSize = 70;  
    const distance = 150; 

    dockOuter.addEventListener('mousemove', (e) => {
      dockItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenterX = rect.left + rect.width / 2;
        const dist = Math.abs(e.clientX - itemCenterX);
        
        let scale = 1;
        if (dist < distance) {
          const scaleFactor = 1 - Math.pow(dist / distance, 2);
          scale = 1 + ((maxSize / baseSize) - 1) * scaleFactor;
        }
        
        item.style.transform = `scale(${scale})`;
        item.style.margin = `0 ${5 * (scale - 1)}px`;
      });
    });

    dockOuter.addEventListener('mouseleave', () => {
      dockItems.forEach(item => {
        item.style.transform = `scale(1)`;
        item.style.margin = `0`;
        item.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), margin 0.3s';
      });
    });

    dockOuter.addEventListener('mouseenter', () => {
      dockItems.forEach(item => {
        item.style.transition = 'background-color 0.2s, box-shadow 0.2s';
      });
    });
  });

  // Morphing Navbar Logic
  document.addEventListener('DOMContentLoaded', () => {
    const header    = document.getElementById('site-header');
    const dockNav   = document.getElementById('dock-nav');
    const scrollNav = document.getElementById('scroll-nav');
    const THRESHOLD = 80;

    const updateNav = () => {
      if (window.scrollY > THRESHOLD) {
        header.classList.add('scrolled');
        dockNav.classList.add('nav-hidden');
        scrollNav.classList.add('nav-visible');
      } else {
        header.classList.remove('scrolled');
        dockNav.classList.remove('nav-hidden');
        scrollNav.classList.remove('nav-visible');
      }
    };

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  });

  // Auth Guard & Dynamic Data Loading
  document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'auth.html';
    } else {
      initNavUser();
      const user = Auth.getUser();
      if (user && user.username) {
        document.querySelectorAll('.user-name-display').forEach(el => {
          el.textContent = user.username.charAt(0).toUpperCase() + user.username.slice(1);
        });
      }
      
      loadDashboardData();
    }
  });

  async function loadDashboardData() {
    try {
      const res = await TripsAPI.listMine();
      const trips = res.trips || [];
      
      renderStats(trips);
      renderTrips(trips);
      renderInsights(trips);

      // Update the upcoming trip banner and widget stats on home page
      if (typeof window._updateBanner === 'function') window._updateBanner(trips);

      // Update widget stat tiles
      const fmt = (n) => n >= 100000 ? '₹' + (n/100000).toFixed(1) + 'L' : '₹' + n.toLocaleString('en-IN');
      let totalDaysW = 0, totalBudgetW = 0;
      const citiesW = new Set();
      trips.forEach(t => { totalDaysW += (t.duration_days||0); totalBudgetW += (t.budget||0); if(t.destination) citiesW.add(t.destination); });
      const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setEl('statTrips', String(trips.length).padStart(2,'0'));
      setEl('statBudget', fmt(totalBudgetW));
      setEl('statDays', String(totalDaysW).padStart(2,'0'));
      setEl('statCities', citiesW.size + ' cities explored');

    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    }
  }


  function renderStats(trips) {
    const statsContainer = document.querySelector('.stats-banner');
    if (!statsContainer) return;
    
    let totalDays = 0;
    let totalBudget = 0;
    const cities = new Set();
    
    trips.forEach(t => {
      totalDays += (t.duration_days || 0);
      totalBudget += (t.budget || 0);
      if (t.destination) cities.add(t.destination);
    });
    
    const formatBudget = (num) => {
      if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
      return '₹' + num.toLocaleString('en-IN');
    };

    statsContainer.innerHTML = `
      <div class="stat-item">
        <h2>${trips.length.toString().padStart(2, '0')}</h2>
        <p>Trips Planned</p>
      </div>
      <div class="stat-item">
        <h2>${totalDays.toString().padStart(2, '0')}</h2>
        <p>Travel Days</p>
      </div>
      <div class="stat-item">
        <h2>${cities.size.toString().padStart(2, '0')}</h2>
        <p>Cities Explored</p>
      </div>
      <div class="stat-item">
        <h2>${formatBudget(totalBudget)}</h2>
        <p>Budget Managed</p>
      </div>
    `;
  }

  async function renderTrips(trips) {
    const grid = document.getElementById('plansGrid') || document.querySelector('.plans-grid');
    if (!grid) return;

    
    const addNewCardHTML = `
      <a href="planner.html" class="plan-card add-new-plan">
        <div class="add-new-content">
          <div class="add-icon"><i class="fa-solid fa-plus"></i></div>
          <h3>Create New Plan</h3>
          <p>Let AI design your perfect itinerary</p>
        </div>
      </a>
    `;

    if (trips.length === 0) {
      grid.innerHTML = addNewCardHTML;
      return;
    }

    // Budget tier helpers
    const budgetTier = (b) => {
      if (b <= 20000) return { label: 'Budget', color: '#1EB589', icon: 'fa-piggy-bank' };
      if (b <= 75000) return { label: 'Moderate', color: '#F1A501', icon: 'fa-wallet' };
      return { label: 'Luxury', color: '#8B5CF6', icon: 'fa-gem' };
    };

    // Render skeleton cards first (instant UI response)
    let skeletonHTML = trips.map((trip, i) => `
      <div class="plan-card" id="trip-card-${i}" style="min-height:300px;">
        <div class="plan-card-img" style="background: linear-gradient(135deg,#e5e7eb,#f3f4f6); height:180px; animation: shimmer 1.5s infinite;">
          <div class="plan-badge">${trip.status === 'completed' ? 'Completed' : 'Upcoming'}</div>
        </div>
        <div class="plan-card-body" style="padding:18px;">
          <div class="plan-meta" style="color:#8C92B1;font-size:13px;margin-bottom:6px;">Loading...</div>
          <h3 style="color:#181E4B;font-size:16px;font-weight:700;">${trip.destination} Trip</h3>
        </div>
      </div>`).join('');
    grid.innerHTML = skeletonHTML + addNewCardHTML;

    // Fetch scraped Wikipedia images concurrently for all trips
    const imagePromises = trips.map(async (trip) => {
      try {
        const data = await CityAPI.getImage(trip.destination);
        return data.image_url || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop';
      } catch {
        return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop';
      }
    });

    const images = await Promise.all(imagePromises);

    // Build final rich cards
    let finalHTML = '';
    trips.forEach((trip, i) => {
      const imgUrl    = images[i];
      const startDate = new Date(trip.start_date);
      const endDate   = new Date(trip.end_date);
      const fmt       = { month: 'short', day: 'numeric' };
      const dateStr   = `${startDate.toLocaleDateString('en-US', fmt)} – ${endDate.toLocaleDateString('en-US', fmt)}`;
      const tier      = budgetTier(trip.budget || 0);
      const perDay    = trip.duration_days > 0 ? Math.round((trip.budget || 0) / trip.duration_days) : 0;
      const badgeClass = trip.status === 'completed' ? 'past' : '';
      const badgeText  = trip.status === 'completed' ? 'Completed' : 'Upcoming';
      const interests  = (trip.interests || []).slice(0, 2).map(tag =>
        `<span style="background:rgba(65,82,203,0.08);color:#4152CB;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;">${tag}</span>`
      ).join('');

      finalHTML += `
        <a href="planner.html?trip=${trip.trip_id}" class="plan-card">
          <div class="plan-card-img">
            <img src="${imgUrl}" alt="${trip.destination}"
              onerror="this.src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop'">
            <div class="plan-badge ${badgeClass}">${badgeText}</div>
          </div>
          <div class="plan-card-body">
            <div class="plan-meta">${dateStr} • ${trip.duration_days} Days</div>
            <h3>${trip.destination} Trip</h3>
            ${interests ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0;">${interests}</div>` : ''}
            
            <!-- Budget breakdown row -->
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid #F0F0F5;">
              <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:28px;height:28px;border-radius:8px;background:${tier.color}18;color:${tier.color};display:flex;align-items:center;justify-content:center;font-size:12px;">
                  <i class="fa-solid ${tier.icon}"></i>
                </div>
                <div>
                  <div style="font-size:11px;color:#8C92B1;line-height:1;">${tier.label} Budget</div>
                  <div style="font-size:13px;font-weight:700;color:#181E4B;">₹${(trip.budget||0).toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px;color:#8C92B1;line-height:1;">Per Day</div>
                <div style="font-size:13px;font-weight:600;color:${tier.color};">₹${perDay.toLocaleString('en-IN')}</div>
              </div>
              <div class="btn-view"><i class="fa-solid fa-arrow-right"></i></div>
            </div>
          </div>
        </a>
      `;
    });

    grid.innerHTML = finalHTML + addNewCardHTML;
  }

  
  async function renderInsights(trips) {
    const insightsContainer = document.querySelector('.insights-grid');
    if (!insightsContainer || trips.length === 0) return;
    
    const upcoming = trips.find(t => t.status !== 'completed') || trips[0];
    
    insightsContainer.innerHTML = `<div style="grid-column: span 3; text-align: center; color: #5E6282; padding: 20px;">
      <i class="fa-solid fa-spinner fa-spin"></i> Generating AI Insights for ${upcoming.destination}...
    </div>`;
    
    try {
      const res = await CityAPI.getInsights(upcoming.destination, "What are 3 quick travel tips regarding currency, weather, and safety?");
      
      if (res && res.insight) {
        insightsContainer.innerHTML = `
          <div class="insight-card" style="grid-column: span 3;">
            <div class="insight-icon route"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <div class="insight-content">
              <h4>AI Insight for ${upcoming.destination}</h4>
              <p>${res.insight.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        `;
      }
    } catch (e) {
      console.warn("Could not fetch insights, using defaults", e);
      insightsContainer.innerHTML = `
        <div class="insight-card">
          <div class="insight-icon currency"><i class="fa-solid fa-money-bill-transfer"></i></div>
          <div class="insight-content">
            <h4>Currency Tip</h4>
            <p>Exchange rates for ${upcoming.destination} are fluctuating. Setup alerts to lock in a good rate before your trip!</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon weather"><i class="fa-solid fa-cloud-sun"></i></div>
          <div class="insight-content">
            <h4>Weather Alert</h4>
            <p>Check the forecast for ${upcoming.destination} closer to ${new Date(upcoming.start_date).toLocaleDateString()}. Pack layers!</p>
          </div>
        </div>
        <div class="insight-card">
          <div class="insight-icon route"><i class="fa-solid fa-route"></i></div>
          <div class="insight-content">
            <h4>Route Optimized</h4>
            <p>Download offline maps for ${upcoming.destination} via your YatraSaathi app to navigate without roaming data.</p>
          </div>
        </div>
      `;
    }
  }