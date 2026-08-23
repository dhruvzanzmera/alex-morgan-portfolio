AOS.init({
  duration: 700,
  once: true,
  offset: 60,
  easing: 'ease-out-cubic',
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll progress
const progressBar = document.getElementById('scrollProgress');
const updateProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
};
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });

const smoothScroll = (href) => {
  if (!href || href === '#') return;
  const target = document.querySelector(href);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      event.preventDefault();
      smoothScroll(href);
    }
  });
});

// Animated counters
const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.7 });
counters.forEach((counter) => counterObserver.observe(counter));

// Theme toggle (in-memory) - explicitly show correct icon for current theme
const root = document.documentElement;
const sunIcon = document.getElementById('iconSun');
const moonIcon = document.getElementById('iconMoon');

function setTheme(dark) {
  if (dark) {
    root.classList.add('dark');
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    root.classList.remove('dark');
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
}

// Respect markup default (if <html> has class="dark")
setTheme(root.classList.contains('dark'));

document.getElementById('themeToggle').addEventListener('click', () => {
  setTheme(!root.classList.contains('dark'));
});

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.add('hidden'))
);

// Contact form -> mailto (no backend)
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n- ${name} (${email})`);
  window.location.href = `mailto:alex.morgan@example.com?subject=${subject}&body=${body}`;
  document.getElementById('formNote').classList.remove('hidden');
  return false;
}

// Typed headline (vanilla)
(function () {
  const phrases = [
    'effortless',
    'fast',
    'unmistakably modern',
    'delightfully animated'
  ];
  const el = document.getElementById('typed');
  if (!el) return;
  let idx = 0; let char = 0; let forward = true; let delay = 80;
  function tick() {
    const phrase = phrases[idx];
    if (forward) {
      el.textContent = phrase.slice(0, ++char);
      if (char === phrase.length) { forward = false; setTimeout(tick, 900); return; }
    } else {
      el.textContent = phrase.slice(0, --char);
      if (char === 0) { forward = true; idx = (idx + 1) % phrases.length; setTimeout(tick, 200); return; }
    }
    setTimeout(tick, delay);
  }
  // Respect reduced motion
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) { el.textContent = phrases[0]; return; }
  tick();
})();

// Hero particles (lightweight)
(function () {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const count = Math.round(Math.min(80, Math.max(24, w / 18)));

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function make() {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 2.6),
        vx: rand(-0.15, 0.15),
        vy: rand(-0.05, 0.05),
        hue: rand(150, 270),
        alpha: rand(0.06, 0.22)
      });
    }
  }

  function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
  window.addEventListener('resize', resize);

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue},70%,60%,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  // Reduced motion fallback
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq && mq.matches) return;

  make(); draw();
})();

// GSAP scroll animations
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const heroTimeline = gsap.timeline();
  heroTimeline.from('.hero-content', {
    y: 32,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.12,
  });
  heroTimeline.from('.hero-card', {
    x: 24,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
  }, '<0.2');

  // Fade-up sections with improved stagger
  gsap.utils.toArray('[data-aos]').forEach((el) => {
    const animation = el.getAttribute('data-aos') || 'fade-up';
    const delay = Number(el.getAttribute('data-aos-delay') || 0) / 1000;
    gsap.from(el, {
      y: animation.includes('up') ? 24 : 0,
      x: animation.includes('left') ? -24 : animation.includes('right') ? 24 : 0,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Reveal cards with flow
  gsap.utils.toArray('.card-lift').forEach((card) => {
    gsap.from(card, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 92%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Projects subtle image parallax
  gsap.to('.card-lift img', {
    yPercent: 8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.card-lift',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
    },
  });

  // Section heading accent motion
  gsap.utils.toArray('section h2').forEach((heading) => {
    gsap.from(heading, {
      y: 24,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });
})();

// VanillaTilt on card-lift
(function () {
  const nodes = document.querySelectorAll('.card-lift');
  if (!nodes.length || typeof VanillaTilt === 'undefined') return;
  nodes.forEach(n => VanillaTilt.init(n, { max: 8, speed: 400, glare: false, scale: 1.01 }));
})();
