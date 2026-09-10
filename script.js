/* ===================== EMBER CANVAS ===================== */
(function initEmbers() {
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let embers = [];

  function resizeCanvas() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Ember {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 20;
      this.size = Math.random() * 2.5 + 0.8;
      this.speedY = Math.random() * 0.8 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.fade = Math.random() * 0.005 + 0.002;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
      this.opacity -= this.fade;

      if (this.opacity <= 0 || this.y < 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237, 192, 105, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#edc069';
      ctx.fill();
    }
  }

  function initEmbers() {
    embers = [];
    const count = Math.min(Math.floor(width / 25), 40);
    for (let i = 0; i < count; i++) {
      const ember = new Ember();
      ember.y = Math.random() * height;
      embers.push(ember);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    embers.forEach(ember => {
      ember.update();
      ember.draw();
    });
    requestAnimationFrame(animate);
  }

  initEmbers();
  animate();

  // Re-seed embers when canvas is resized
  window.addEventListener('resize', initEmbers);
})();


/* ===================== FORM SUBMISSION ===================== */
function handleSummonSubmit(event) {
  event.preventDefault();
  const btnText = document.getElementById('btn-text');
  const formFeedback = document.getElementById('form-feedback');

  if (btnText && formFeedback) {
    btnText.textContent = "Dispatching...";
    setTimeout(() => {
      formFeedback.classList.remove('hidden');
      btnText.textContent = "Contract Sealed";
      document.getElementById('summons-form').reset();
    }, 1000);
  }
}


/* ===================== SCROLL SPY ===================== */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav-links .nav-item');

  window.addEventListener('scroll', () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-semibold');
      link.classList.add('text-on-surface-variant');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('bg-primary-container', 'text-on-primary-container', 'font-semibold');
        link.classList.remove('text-on-surface-variant');
      }
    });
  });
})();


/* ===================== WITCHER TRANSITION ===================== */
(function initWitcherTransition() {

  const RUNES = ['ᚱ', 'ᛉ', 'ᚦ', 'ᛟ', 'ᚨ', 'ᛖ', 'ᛗ', 'ᛞ'];

  const overlay = document.createElement('div');
  overlay.className = 'witcher-transition-overlay';
  document.body.appendChild(overlay);

  let isTransitioning = false;

  function playWitcherTransition(x, y) {
    if (isTransitioning) return;
    isTransitioning = true;

    overlay.style.setProperty('--click-x', `${x}px`);
    overlay.style.setProperty('--click-y', `${y}px`);

    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 180);

    // Expanding golden ring
    const ring = document.createElement('div');
    ring.className = 'witcher-transition-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    document.body.appendChild(ring);

    requestAnimationFrame(() => ring.classList.add('expand'));

    // Rune particles
    const particleCount = 6;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'witcher-rune-particle';
      particle.textContent = RUNES[Math.floor(Math.random() * RUNES.length)];

      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const distance = 30 + Math.random() * 40;
      const px = x + Math.cos(angle) * distance;
      const py = y + Math.sin(angle) * distance;

      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.fontSize = `${10 + Math.random() * 8}px`;

      document.body.appendChild(particle);

      const startTime = performance.now();
      const duration = 700 + Math.random() * 300;

      function animateParticle(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - t, 3);

        const currentX = x + (px - x) * easeOut;
        const currentY = y + (py - y) * easeOut;
        const scale = 1 + easeOut * 0.3;
        const opacity = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8;
        const floatY = easeOut * 20;

        particle.style.transform = `translate(-50%, -50%) translate(${currentX - x}px, ${currentY - y - floatY}px) scale(${scale})`;
        particle.style.opacity = Math.max(0, opacity);

        if (t < 1) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      }
      requestAnimationFrame(animateParticle);
    }

    // Screen shake
    document.body.classList.add('witcher-screen-shake');
    setTimeout(() => document.body.classList.remove('witcher-screen-shake'), 320);

    setTimeout(() => {
      ring.remove();
      isTransitioning = false;
    }, 800);
  }

  function attachTransitionHandlers() {
    const clickables = document.querySelectorAll('a, button');
    clickables.forEach(el => {
      el.addEventListener('click', (e) => {
        let x, y;
        if (e.clientX && e.clientY) {
          x = e.clientX;
          y = e.clientY;
        } else {
          const rect = el.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        }
        playWitcherTransition(x, y);
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const rect = el.getBoundingClientRect();
          playWitcherTransition(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachTransitionHandlers);
  } else {
    attachTransitionHandlers();
  }

  window.playWitcherTransition = playWitcherTransition;
  window.attachTransitionHandlers = attachTransitionHandlers;
})();