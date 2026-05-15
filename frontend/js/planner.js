/* YatraSaathi — planner.js */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('plannerForm');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const resultState = document.getElementById('resultState');
  
  if (!form) return;

  // Set default dates
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 5);
  
  document.getElementById('startDate').valueAsDate = today;
  document.getElementById('endDate').valueAsDate = nextWeek;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const dest = document.getElementById('destination').value;
    const sDate = document.getElementById('startDate').value;
    const eDate = document.getElementById('endDate').value;
    const budget = document.querySelector('input[name="budget"]:checked').value;
    
    // Switch to loading state
    emptyState.classList.add('hidden');
    resultState.classList.add('hidden');
    loadingState.classList.remove('hidden');
    
    const statusText = document.getElementById('loadingStatusText');
    const loadingBar = document.getElementById('loadingBar');
    const btn = document.getElementById('generateBtn');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    // Simulate AI pipeline progression
    const steps = [
      { p: 15, t: 'Parsing parameters and checking FAISS vector cache...' },
      { p: 35, t: 'Fetching real-time weather constraints...' },
      { p: 60, t: 'Geospatially clustering attractions...' },
      { p: 85, t: 'Groq LLM synthesizing final itinerary...' },
      { p: 100, t: 'Complete!' }
    ];

    let currentStep = 0;
    
    const processInterval = setInterval(() => {
      if (currentStep < steps.length) {
        loadingBar.style.width = steps[currentStep].p + '%';
        statusText.textContent = steps[currentStep].t;
        currentStep++;
      } else {
        clearInterval(processInterval);
        showResults(dest, sDate, eDate, budget);
        btn.disabled = false;
        btn.innerHTML = '<span class="btn-text">Regenerate Itinerary</span><i class="fa-solid fa-rotate-right btn-icon"></i>';
      }
    }, 800);
  });

  function showResults(dest, sDate, eDate, budget) {
    loadingState.classList.add('hidden');
    resultState.classList.remove('hidden');
    
    document.getElementById('resDest').textContent = dest || 'Unknown Destination';
    
    // Format dates nicely
    const d1 = new Date(sDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const d2 = new Date(eDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    document.getElementById('resDates').textContent = `${d1} - ${d2}`;
    
    document.getElementById('resBudget').textContent = budget;

    const paceVal = document.getElementById('paceSlider').value;
    const paceMap = { 1: 'Relaxed', 2: 'Moderate', 3: 'Packed' };
    document.getElementById('resPace').textContent = paceMap[paceVal];

    // Build Mock Itinerary HTML
    const container = document.getElementById('itineraryContainer');
    
    const mockData = `
      <div class="itinerary-day">
        <div class="day-header">
          <div class="day-num">Day 1</div>
          <div class="day-title">Arrival & Acclimation</div>
        </div>
        <div class="day-timeline">
          <div class="timeline-item">
            <div class="ti-dot"></div>
            <div class="ti-header">
              <div class="ti-title">Hotel Check-in & Freshen Up</div>
              <div class="ti-time">10:00 AM</div>
            </div>
            <div class="ti-desc">Arrive at your central accommodation. Drop off bags and grab a quick local coffee nearby to fight jet lag.</div>
            <div class="ti-meta">
              <span><i class="fa-solid fa-location-arrow"></i> Downtown Area</span>
              <span><i class="fa-solid fa-clock"></i> 1.5 hrs</span>
            </div>
          </div>
          
          <div class="timeline-item" style="animation-delay: 0.1s">
            <div class="ti-dot"></div>
            <div class="ti-header">
              <div class="ti-title">Historic City Center Walk</div>
              <div class="ti-time">12:30 PM</div>
            </div>
            <div class="ti-desc">A guided walking tour focusing on the main architectural marvels and the history of the old town. Optimized walking route to save energy.</div>
            <div class="ti-meta">
              <span><i class="fa-solid fa-shoe-prints"></i> 2.4 km walk</span>
              <span><i class="fa-solid fa-camera"></i> Great photo ops</span>
            </div>
          </div>
          
          <div class="timeline-item" style="animation-delay: 0.2s">
            <div class="ti-dot"></div>
            <div class="ti-header">
              <div class="ti-title">Authentic Local Dinner</div>
              <div class="ti-time">07:00 PM</div>
            </div>
            <div class="ti-desc">Dinner at a highly-rated hidden gem recommended by our RAG system, serving traditional cuisine within your budget.</div>
            <div class="ti-meta">
              <span><i class="fa-solid fa-utensils"></i> Moderate pricing</span>
              <span><i class="fa-solid fa-star"></i> 4.8 Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div class="itinerary-day" style="animation-delay: 0.3s">
        <div class="day-header">
          <div class="day-num">Day 2</div>
          <div class="day-title">Deep Cultural Immersion</div>
        </div>
        <div class="day-timeline">
          <div class="timeline-item">
            <div class="ti-dot"></div>
            <div class="ti-header">
              <div class="ti-title">Major Temple / Museum Visit</div>
              <div class="ti-time">09:00 AM</div>
            </div>
            <div class="ti-desc">Beat the crowds by visiting the most popular attraction right at opening time.</div>
            <div class="ti-meta">
              <span><i class="fa-solid fa-ticket"></i> Pre-booking advised</span>
              <span><i class="fa-solid fa-clock"></i> 3 hrs</span>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="ti-dot"></div>
            <div class="ti-header">
              <div class="ti-title">Nature Park & Relaxation</div>
              <div class="ti-time">02:00 PM</div>
            </div>
            <div class="ti-desc">A peaceful afternoon stroll through the botanical gardens. Weather forecast shows clear skies.</div>
            <div class="ti-meta">
              <span><i class="fa-solid fa-leaf"></i> Outdoors</span>
              <span><i class="fa-solid fa-cloud-sun"></i> Ideal weather window</span>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = mockData;
    window.showToast('Intelligent itinerary generated successfully!', 'success');
  }
});
