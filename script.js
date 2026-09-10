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
    constructor() { this.reset(); }

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
      if (this.opacity <= 0 || this.y < 0) this.reset();
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
    embers.forEach(ember => { ember.update(); ember.draw(); });
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

  const TYPE_SPEED = 55, DELETE_SPEED = 30;
  const PAUSE_FULL = 2200, PAUSE_EMPTY = 500;

  let phraseIndex = 0, charIndex = 0, isDeleting = false;

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


/* ===================== SCROLL SPY ===================== */
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
  }, { root: null, threshold: 0.4 });

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

  const track = document.createElement('div');
  track.className = 'horizontal-scroll-track';
  panels.forEach(p => track.appendChild(p));
  main.appendChild(track);

  // Mark initial panel active for 3D
  panels[0].classList.add('is-active');

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

  // --- 3D panel state management ---
  function apply3DStates(fromIndex, toIndex) {
    const goingForward = toIndex > fromIndex;
    const leavingClass  = goingForward ? 'is-leaving-forward'  : 'is-leaving-back';
    const enteringClass = goingForward ? 'is-entering-forward' : 'is-entering-back';

    const prev = panels[fromIndex];
    const next = panels[toIndex];

    // Previous panel leaves
    prev.classList.remove('is-active');
    prev.classList.add(leavingClass);
    setTimeout(() => prev.classList.remove(leavingClass), 800);

    // Next panel enters (starts rotated) then snaps to active
    next.classList.add(enteringClass);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        next.classList.remove(enteringClass);
        next.classList.add('is-active');
      });
    });
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

    const fromIndex = currentPanel;
    isAnimating = true;

    apply3DStates(fromIndex, index);

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

  function onWheel(e) {
    if (isAnimating || isCooldown) { e.preventDefault(); return; }

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

  function onResize() {
    currentTranslateX = -currentPanel * window.innerWidth;
    track.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  window.addEventListener('resize', onResize);

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


/* ===================== 3D TILT (PARCHMENT + MEDALLION) ===================== */
(function init3DTilt() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (!isDesktop) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // --- Parchment card tilt ---
  function attachParchmentTilt() {
    document.querySelectorAll('.parchment').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);

        const rotY = Math.max(-1, Math.min(1, dx)) * 6;
        const rotX = -Math.max(-1, Math.min(1, dy)) * 6;

        card.style.transform =
          `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform =
          'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      });
    });
  }

  // --- Hero medallion tilt ---
  function attachMedallionTilt() {
    const medallion = document.querySelector('.hero-medallion');
    const hero = document.getElementById('hero');
    if (!medallion || !hero) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const rotY = Math.max(-1, Math.min(1, dx)) * 12;
      const rotX = -Math.max(-1, Math.min(1, dy)) * 12;

      medallion.style.transform =
        `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
      medallion.style.transform =
        'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  function boot() {
    attachParchmentTilt();
    attachMedallionTilt();
    window.attachParchmentTilt = attachParchmentTilt;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('load', attachParchmentTilt);
})();

/* ===================== 1) RUNE CURSOR TRAIL ===================== */
(function initRuneTrail() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (!isDesktop) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const RUNES = ['ᚱ', 'ᛉ', 'ᚦ', 'ᛟ', 'ᚨ', 'ᛖ', 'ᛗ', 'ᛞ'];
  let lastSpawn = 0;
  const SPAWN_INTERVAL = 60; // ms
  const RUNE_LIFETIME = 900; // ms

  document.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastSpawn < SPAWN_INTERVAL) return;
    lastSpawn = now;

    const el = document.createElement('div');
    el.className = 'rune-trail';
    el.textContent = RUNES[Math.floor(Math.random() * RUNES.length)];
    el.style.left = `${e.clientX}px`;
    el.style.top = `${e.clientY}px`;
    el.style.fontSize = `${10 + Math.random() * 6}px`;
    el.style.opacity = '0.9';

    document.body.appendChild(el);

    const start = performance.now();
    const driftX = (Math.random() - 0.5) * 20;
    const driftY = -20 - Math.random() * 20;

    function step(t) {
      const elapsed = t - start;
      const p = Math.min(elapsed / RUNE_LIFETIME, 1);
      const ease = 1 - Math.pow(1 - p, 2);

      el.style.transform = `translate(-50%, -50%) translate(${driftX * ease}px, ${driftY * ease}px) scale(${1 - p * 0.4})`;
      el.style.opacity = String(0.9 * (1 - p));

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.remove();
      }
    }
    requestAnimationFrame(step);
  });
})();


/* ===================== 9) PANEL AMBIENT PARTICLES ===================== */
(function initPanelAmbients() {
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  if (!isDesktop) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Wait until the horizontal track exists (built by initHorizontalScroll)
  function attach() {
    const panels = document.querySelectorAll('.horizontal-scroll-track > section, .horizontal-scroll-track > footer');
    panels.forEach(panel => setupAmbient(panel));
  }

  function setupAmbient(panel) {
    const id = panel.id || '';
    const config = AMBIENT_CONFIG[id] || AMBIENT_CONFIG.default;
    if (!config) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'ambient-canvas';
    panel.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = panel.clientWidth;
      height = canvas.height = panel.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function spawn() {
      particles = [];
      const count = Math.min(Math.floor(width / 30), 30);
      for (let i = 0; i < count; i++) {
        particles.push(config.spawn(width, height));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        config.update(p, width, height);
        config.draw(ctx, p);
      });
      requestAnimationFrame(animate);
    }

    spawn();
    animate();
    window.addEventListener('resize', spawn);
  }

  const AMBIENT_CONFIG = {
    // Quest Log — floating feathers (drift down slowly)
    'quest-log': {
      spawn: (w, h) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 3 + Math.random() * 4,
        speedY: 0.2 + Math.random() * 0.3,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.01,
        opacity: 0.15 + Math.random() * 0.2
      }),
      update: (p, w, h) => {
        p.y += p.speedY;
        p.sway += p.swaySpeed;
        p.x += Math.sin(p.sway) * 0.5;
        if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
      },
      draw: (ctx, p) => {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * 2, p.size * 0.6, p.sway, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 230, 227, ${p.opacity})`;
        ctx.fill();
      }
    },

    // Contracts — spinning gold coins
    'contracts': {
      spawn: (w, h) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 4 + Math.random() * 3,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: 0.02 + Math.random() * 0.02,
        driftY: -0.15 - Math.random() * 0.2,
        opacity: 0.2 + Math.random() * 0.3
      }),
      update: (p, w, h) => {
        p.spin += p.spinSpeed;
        p.y += p.driftY;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      },
      draw: (ctx, p) => {
        const scaleX = Math.cos(p.spin);
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size * Math.abs(scaleX), p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237, 192, 105, ${p.opacity * Math.abs(scaleX)})`;
        ctx.fill();
      }
    },

    // Arsenal — forge sparks (rising fast)
    'bestiary-and-arsenal': {
      spawn: (w, h) => ({
        x: Math.random() * w,
        y: h + Math.random() * 20,
        size: 1 + Math.random() * 1.5,
        speedY: 1 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: 0.5 + Math.random() * 0.5,
        fade: 0.008 + Math.random() * 0.008
      }),
      update: (p, w, h) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity -= p.fade;
        if (p.opacity <= 0 || p.y < -10) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.opacity = 0.5 + Math.random() * 0.5;
        }
      },
      draw: (ctx, p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(237, 192, 105, ${p.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#edc069';
        ctx.fill();
      }
    },

    // Summons — raven feathers (falling, drifting sideways)
    'summons': {
      spawn: (w, h) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 5 + Math.random() * 4,
        speedY: 0.3 + Math.random() * 0.4,
        speedX: -0.3 - Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        opacity: 0.15 + Math.random() * 0.2
      }),
      update: (p, w, h) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        if (p.y > h + 10 || p.x < -10) {
          p.x = w + 10;
          p.y = -10;
        }
      },
      draw: (ctx, p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(60, 60, 70, ${p.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    },

    // Origins — dust motes (slowly drifting up)
    'origins': {
      spawn: (w, h) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1 + Math.random() * 1.5,
        speedY: -0.1 - Math.random() * 0.2,
        sway: Math.random() * Math.PI * 2,
        opacity: 0.1 + Math.random() * 0.15
      }),
      update: (p, w, h) => {
        p.y += p.speedY;
        p.sway += 0.005;
        p.x += Math.sin(p.sway) * 0.2;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      },
      draw: (ctx, p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 230, 227, ${p.opacity})`;
        ctx.fill();
      }
    },

    default: null
  };

  // Wait for the track to be built by the horizontal scroll init
  const waitForTrack = setInterval(() => {
    if (document.querySelector('.horizontal-scroll-track')) {
      clearInterval(waitForTrack);
      attach();
    }
  }, 200);

  // Safety: stop polling after 5s
  setTimeout(() => clearInterval(waitForTrack), 5000);
})();


/* ===================== 11) COPY-TO-CLIPBOARD EMAIL ===================== */
(function initCopyEmail() {
  const toast = document.createElement('div');
  toast.className = 'copy-toast';
  toast.textContent = '✦ Raven address copied ✦';
  document.body.appendChild(toast);

  let timeoutId = null;
  function showToast() {
    toast.classList.add('visible');
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => toast.classList.remove('visible'), 2000);
  }

  // Find all mailto links and make them copy instead of opening
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.classList.add('copyable-email');

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const email = link.getAttribute('href').replace('mailto:', '');
      navigator.clipboard.writeText(email)
        .then(() => showToast())
        .catch(() => {
          // Fallback for older browsers
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          showToast();
        });
    });
  });
})();


/* ===================== 17) KEYBOARD SHORTCUTS OVERLAY ===================== */
(function initShortcutsOverlay() {
  // Build trigger button
  const trigger = document.createElement('button');
  trigger.className = 'shortcuts-trigger';
  trigger.innerHTML = '?';
  trigger.setAttribute('aria-label', 'Show keyboard shortcuts');
  document.body.appendChild(trigger);

  // Build overlay
  const overlay = document.createElement('div');
  overlay.className = 'shortcuts-overlay';
  overlay.innerHTML = `
    <div class="shortcuts-panel" role="dialog" aria-modal="true" aria-label="Keyboard Shortcuts">
      <div class="shortcuts-header">
        <h3 class="shortcuts-title">Keyboard Shortcuts</h3>
        <button class="shortcuts-close" aria-label="Close">×</button>
      </div>
      <div class="shortcuts-list">
        <div class="shortcut-row">
          <span>Advance to next panel</span>
          <div class="shortcut-keys">
            <span class="kbd">→</span>
            <span class="kbd">PgDn</span>
            <span class="kbd">Wheel ↓</span>
          </div>
        </div>
        <div class="shortcut-row">
          <span>Previous panel</span>
          <div class="shortcut-keys">
            <span class="kbd">←</span>
            <span class="kbd">PgUp</span>
            <span class="kbd">Wheel ↑</span>
          </div>
        </div>
        <div class="shortcut-row">
          <span>Show this panel</span>
          <div class="shortcut-keys">
            <span class="kbd">?</span>
          </div>
        </div>
        <div class="shortcut-row">
          <span>Close overlay</span>
          <div class="shortcut-keys">
            <span class="kbd">Esc</span>
          </div>
        </div>
        <div class="shortcut-row">
          <span>Copy raven address</span>
          <div class="shortcut-keys">
            <span class="kbd">Click Email</span>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.shortcuts-close');

  function open() {
    overlay.classList.add('visible');
  }
  function close() {
    overlay.classList.remove('visible');
  }

  trigger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Global keyboard handlers
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (e.key === '?') {
      e.preventDefault();
      overlay.classList.contains('visible') ? close() : open();
    } else if (e.key === 'Escape') {
      close();
    }
  });
})();