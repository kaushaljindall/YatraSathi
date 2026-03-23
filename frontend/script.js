document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar Effect on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. AI Assistant Chat Animation Loop
    const chatMessages = document.getElementById('mock-chat-messages');
    
    const conversation = [
        { type: 'user', text: 'Plan a 3 day trip to Paris' },
        { type: 'ai', text: 'I\'d love to! What are your primary interests? Art, food, or history?' },
        { type: 'user', text: 'Art and food, please!' },
        { type: 'ai', text: 'Perfect. Generating an exquisite gallery and culinary tour for you...' }
    ];

    function createBubble(msg) {
        const div = document.createElement('div');
        div.className = `chat-bubble ${msg.type}`;
        div.innerText = msg.text;
        return div;
    }

    // Function to run the mock chat animation
    function runMockChat() {
        chatMessages.innerHTML = '';
        let delay = 0;
        
        conversation.forEach((msg, index) => {
            setTimeout(() => {
                chatMessages.appendChild(createBubble(msg));
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // If it's the last message, loop it back after 5 seconds
                if (index === conversation.length - 1) {
                    setTimeout(runMockChat, 5000);
                }
            }, delay);
            
            // Add staggered delay for a realistic typing feel
            delay += 2000;
        });
    }

    // Start the chat loop
    setTimeout(runMockChat, 1000);

    // 4. Form Submission & Mock Itinerary Generation
    const plannerForm = document.getElementById('planner-form');
    const resultContainer = document.getElementById('itinerary-result');

    if (plannerForm) {
        plannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const destination = document.getElementById('destination').value;
            const btn = plannerForm.querySelector('button');
            
            // Button loading state
            const originalText = btn.innerText;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
            btn.disabled = true;

            // Simulate API Call delay
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                
                // Show Result
                resultContainer.classList.remove('hidden');
                resultContainer.style.animation = 'fadeUpIn 0.8s forwards';
                
                // Mock Generated Content
                resultContainer.innerHTML = `
                    <div style="margin-bottom: 2rem;">
                        <h3 style="color: var(--primary); font-size: 1.5rem; margin-bottom: 0.5rem;">
                            <i class="fa-solid fa-plane-arrival"></i> Your Trip to ${destination}
                        </h3>
                        <p style="color: var(--text-muted);"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Optimized Itinerary</p>
                    </div>
                    
                    <div class="day-plan">
                        <div class="day-header">
                            <span class="day-badge">Day 1</span>
                            <h4>Arrival & Downtown Exploration</h4>
                        </div>
                        <ul style="list-style: none; padding-left: 1rem; color: var(--text-muted);">
                            <li style="margin-bottom: 0.5rem;"><i class="fa-solid fa-clock" style="color: var(--accent); margin-right: 8px;"></i> <strong>10:00 AM</strong> - Check-in & Freshen up</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fa-solid fa-clock" style="color: var(--accent); margin-right: 8px;"></i> <strong>12:30 PM</strong> - Local culinary lunch experience</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fa-solid fa-clock" style="color: var(--accent); margin-right: 8px;"></i> <strong>03:00 PM</strong> - Historical center walking tour</li>
                        </ul>
                    </div>

                    <div class="day-plan">
                        <div class="day-header">
                            <span class="day-badge">Day 2</span>
                            <h4>Nature & Sightseeing</h4>
                        </div>
                        <ul style="list-style: none; padding-left: 1rem; color: var(--text-muted);">
                            <li style="margin-bottom: 0.5rem;"><i class="fa-solid fa-clock" style="color: var(--accent); margin-right: 8px;"></i> <strong>09:00 AM</strong> - Hike at the national park</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fa-solid fa-clock" style="color: var(--accent); margin-right: 8px;"></i> <strong>02:00 PM</strong> - Museum hopping</li>
                            <li style="margin-bottom: 0.5rem;"><i class="fa-solid fa-clock" style="color: var(--accent); margin-right: 8px;"></i> <strong>07:00 PM</strong> - Sunset view & dinner</li>
                        </ul>
                    </div>
                `;
                
                // Scroll to result
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
            }, 2500); // 2.5 second fake delay
        });
    }

});
