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


/* ===================== TYPING EFFECT ===================== */
(function initTypingEffect() {
  const lineEl = document.getElementById('typed-line');
  const cursorEl = document.getElementById('typed-cursor');
  if (!lineEl || !cursorEl) return;

  const phrases = [
    { prefix: "I want to make things ",    highlight: "that make a difference." },
    { prefix: "I want to build things ",   highlight: "that make an impact." },
    { prefix: "I want to create things ",  highlight: "that tell a story." },
    { prefix: "I want to write code ",     highlight: "that feels like magic." },
    { prefix: "I want to solve problems ", highlight: "through curiosity and craft." }
  ];

  const TYPE_SPEED   = 55;
  const DELETE_SPEED = 30;
  const PAUSE_FULL   = 2200;
  const PAUSE_EMPTY  = 500;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function renderPhrase(phrase, visibleCount) {
    const fullPlain = phrase.prefix + phrase.highlight;
    const plainVisible = Math.min(visibleCount, phrase.prefix.length);
    const highlightVisible = Math.max(0, visibleCount - phrase.prefix.length);

    const plainText = fullPlain.slice(0, plainVisible);
    const highlightText = phrase.highlight.slice(0, highlightVisible);

    let html = plainText;
    if (highlightText) {
      html += `<span class="text-primary italic drop-shadow-[0_2px_10px_rgba(237,192,105,0.4)]">${highlightText}</span>`;
    }
    return html;
  }

  function tick() {
    const current = phrases[phraseIndex];
    const fullText = current.prefix + current.highlight;

    if (!isDeleting) {
      charIndex++;
      lineEl.innerHTML = renderPhrase(current, charIndex);

      if (charIndex >= fullText.length) {
        cursorEl.classList.add('paused');
        isDeleting = true;
        setTimeout(tick, PAUSE_FULL);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      charIndex--;
      lineEl.innerHTML = renderPhrase(current, charIndex);

      if (charIndex <= 0) {
        charIndex = 0;
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        cursorEl.classList.remove('paused');
        setTimeout(tick, PAUSE_EMPTY);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  setTimeout(() => {
    cursorEl.classList.remove('paused');
    tick();
  }, 600);
})();


/* ===================== SCROLL SPY (horizontal-aware) ===================== */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#nav-links .nav-item');
  if (sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-semibold');
          link.classList.add('text-on-surface-variant');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('bg-primary-container', 'text-on-primary-container', 'font-semibold');
            link.classList.remove('text-on-surface-variant');
          }
        });
      }
    });
  }, {
    root: null,
    threshold: 0.4
  });

  sections.forEach(sec => observer.observe(sec));
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

    const ring = document.createElement('div');
    ring.className = 'witcher-transition-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    document.body.appendChild(ring);

    requestAnimationFrame(() => ring.classList.add('expand'));

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


/* ===================== HORIZONTAL SCROLL (snap-based) ===================== */
(function initHorizontalScroll() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (!isDesktop) return;

  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  if (!main) return;

  const sections = Array.from(main.querySelectorAll('section'));
  const panels = footer ? [...sections, footer] : sections;
  if (panels.length === 0) return;

  document.body.classList.add('horizontal-scroll-active');

  // Build the horizontal track
  const track = document.createElement('div');
  track.className = 'horizontal-scroll-track';
  panels.forEach(p => track.appendChild(p));
  main.appendChild(track);

  let currentPanel = 0;
  let currentTranslateX = 0;
  let isAnimating = false;
  let isCooldown = false;

  // --- Indicator ---
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML =
    '<span class="dot"></span>' +
    '<span class="current">01</span>' +
    '<span class="hint">/</span>' +
    '<span class="total">' + String(panels.length).padStart(2, '0') + '</span>' +
    '<span class="hint">→</span>';
  document.body.appendChild(indicator);
  setTimeout(() => indicator.classList.add('visible'), 800);

  function updateIndicator() {
    indicator.querySelector('.current').textContent =
      String(currentPanel + 1).padStart(2, '0');
  }

  // --- Animated translate ---
  function animateTranslate(targetX, duration, onDone) {
    const startX = currentTranslateX;
    const deltaX = targetX - startX;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      currentTranslateX = startX + deltaX * eased;
      track.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        currentTranslateX = targetX;
        track.style.transform = `translate3d(${targetX}px, 0, 0)`;
        if (onDone) onDone();
      }
    }
    requestAnimationFrame(step);
  }

  function goToPanel(index) {
    index = Math.max(0, Math.min(panels.length - 1, index));
    if (index === currentPanel) return;

    isAnimating = true;
    currentPanel = index;
    updateIndicator();

    animateTranslate(-currentPanel * window.innerWidth, 700, () => {
      isAnimating = false;
    });
  }

  function triggerCooldown() {
    isCooldown = true;
    setTimeout(() => { isCooldown = false; }, 900);
  }

  // --- Wheel handling ---
  function onWheel(e) {
    if (isAnimating || isCooldown) {
      e.preventDefault();
      return;
    }

    const activePanel = panels[currentPanel];
    const atTop = activePanel.scrollTop <= 0;
    const atBottom = activePanel.scrollTop + activePanel.clientHeight >= activePanel.scrollHeight - 2;

    const goingDown = e.deltaY > 0;
    const goingUp = e.deltaY < 0;

    if (goingDown && !atBottom) return;
    if (goingUp && !atTop) return;

    e.preventDefault();

    if (goingDown && currentPanel < panels.length - 1) {
      goToPanel(currentPanel + 1);
      triggerCooldown();
    } else if (goingUp && currentPanel > 0) {
      goToPanel(currentPanel - 1);
      triggerCooldown();
    }
  }

  // --- Keyboard ---
  function onKey(e) {
    if (isAnimating || isCooldown) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      if (currentPanel < panels.length - 1) {
        goToPanel(currentPanel + 1);
        triggerCooldown();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      if (currentPanel > 0) {
        goToPanel(currentPanel - 1);
        triggerCooldown();
      }
    }
  }

  // --- Resize ---
  function onResize() {
    currentTranslateX = -currentPanel * window.innerWidth;
    track.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);

  // Hook nav anchors so clicking them advances the panel horizontally
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const targetIndex = panels.findIndex(p => p.id === id);
      if (targetIndex !== -1) {
        e.preventDefault();
        goToPanel(targetIndex);
        triggerCooldown();
      }
    });
  });

  track.style.transform = 'translate3d(0,0,0)';
  updateIndicator();
})();