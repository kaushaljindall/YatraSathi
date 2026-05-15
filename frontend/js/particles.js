/* YatraSaathi — Particle Canvas */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const CONFIG = {
    count: 70,
    colors: ['rgba(59,130,246,', 'rgba(6,182,212,', 'rgba(139,92,246,'],
    maxSize: 2.5,
    speed: 0.3,
    lineDistance: 120,
    lineOpacity: 0.25,
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(random) {
      this.x  = random ? Math.random() * W : Math.random() < 0.5 ? -5 : W + 5;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r  = Math.random() * CONFIG.maxSize + 0.5;
      this.col = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life  = Math.random() * 200 + 100;
      this.age   = 0;
    }
    update() {
      this.x  += this.vx;
      this.y  += this.vy;
      this.age++;
      if (this.age > this.life || this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10)
        this.reset(false);
    }
    draw() {
      const fade = Math.min(this.age / 30, 1, (this.life - this.age) / 30);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + (this.alpha * fade) + ')';
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
    window.addEventListener('resize', resize);
    loop();
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < CONFIG.lineDistance) {
          const op = (1 - d / CONFIG.lineDistance) * CONFIG.lineOpacity;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${op})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init);
  else init();
})();
