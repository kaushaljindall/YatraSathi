/* YatraSaathi — index.js (Landing Page Specific) */

document.addEventListener('DOMContentLoaded', () => {
  // Trigger counters when hero stats become visible
  const statsIo = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.hero-stat-num').forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          if (target) window.animateCounter(el, target, 2000);
        });
        statsIo.unobserve(e.target);
      }
    });
  });
  
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsIo.observe(heroStats);

  // GSAP Animations for Workflow and Demo sections
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Workflow Line Animation
    const wfLine = document.querySelector('.workflow-line');
    if (wfLine) {
      gsap.fromTo(wfLine, { height: 0 }, {
        height: '100%',
        scrollTrigger: {
          trigger: '.workflow-grid',
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      });
    }

    // Floating cards parallax in Hero
    gsap.utils.toArray('.hero-card').forEach((card, i) => {
      gsap.to(card, {
        y: -30 + (i * 10),
        scrollTrigger: {
          trigger: '.hero-inner',
          start: 'top top',
          end: 'bottom top',
          scrub: 1 + (i * 0.2)
        }
      });
    });
  }

  // Demo Generator
  const demoBtn = document.getElementById('demoGenerate');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      const dest = document.getElementById('demoDestination').value.trim() || 'Kyoto, Japan';
      const days = document.getElementById('demoDays').value;
      const statusEl = document.getElementById('demoStatus');
      const bodyEl = document.getElementById('demoResultBody');
      const titleEl = document.getElementById('demoResultTitle');
      
      const selectedStyles = Array.from(document.querySelectorAll('#styleChips .chip.selected'))
        .map(el => el.dataset.val)
        .join(', ');

      const stylesText = selectedStyles ? ` focusing on ${selectedStyles}` : '';

      // Set Loading State
      statusEl.innerHTML = '<span class="glow-dot" style="background:#f59e0b;box-shadow:0 0 8px #f59e0b"></span> Generating...';
      demoBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing';
      demoBtn.classList.add('disabled');
      demoBtn.style.pointerEvents = 'none';
      
      bodyEl.innerHTML = `
        <div class="demo-loading">
          <div class="spinner"></div>
          <p>Groq LLM is analyzing geospatial data for ${dest}...</p>
        </div>
      `;

      // Simulate API Call Delay
      setTimeout(() => {
        titleEl.textContent = `${days}-Day Itinerary: ${dest}`;
        statusEl.innerHTML = '<span class="glow-dot" style="background:#10b981;box-shadow:0 0 8px #10b981"></span> Complete';
        demoBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Regenerate Itinerary';
        demoBtn.classList.remove('disabled');
        demoBtn.style.pointerEvents = 'auto';

        // Render Mock Result
        bodyEl.innerHTML = `
          <div class="demo-day">
            <div class="demo-day-header">
              <span class="demo-day-badge">Day 1</span>
              <h4>Arrival & Exploration</h4>
            </div>
            <div class="demo-activity">
              <div class="demo-activity-time">09:00 AM</div>
              <div><strong>Check-in & Briefing</strong><br><span style="color:var(--text-400);font-size:0.8rem">Drop luggage at central hotel.</span></div>
            </div>
            <div class="demo-activity">
              <div class="demo-activity-time">11:30 AM</div>
              <div><strong>Historical District Walk</strong><br><span style="color:var(--text-400);font-size:0.8rem">Guided tour of major landmarks.</span></div>
            </div>
            <div class="demo-activity">
              <div class="demo-activity-time">01:00 PM</div>
              <div><strong>Local Cuisine Lunch</strong><br><span style="color:var(--text-400);font-size:0.8rem">Highly rated traditional restaurant.</span></div>
            </div>
          </div>

          <div class="demo-day">
            <div class="demo-day-header">
              <span class="demo-day-badge">Day 2</span>
              <h4>Deep Dive ${stylesText}</h4>
            </div>
            <div class="demo-activity">
              <div class="demo-activity-time">08:00 AM</div>
              <div><strong>Morning Excursion</strong><br><span style="color:var(--text-400);font-size:0.8rem">Optimized route to avoid crowds.</span></div>
            </div>
            <div class="demo-activity">
              <div class="demo-activity-time">02:30 PM</div>
              <div><strong>Cultural Workshop</strong><br><span style="color:var(--text-400);font-size:0.8rem">Interactive local experience.</span></div>
            </div>
          </div>
          
          <div style="text-align:center;margin-top:2rem">
            <a href="planner.html" class="btn btn-outline-primary btn-sm">View Full Itinerary in Planner</a>
          </div>
        `;
        
        window.showToast('Itinerary generated successfully!', 'success');
      }, 2500);
    });
  }
});
