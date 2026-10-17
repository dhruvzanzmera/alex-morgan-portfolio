(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  /* ---------- Year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Theme ---------- */
  try {
    const saved = localStorage.getItem("theme");
    if (saved) root.classList.toggle("dark", saved === "dark");
  } catch (e) {}
  const syncTheme = () => {
    const dark = root.classList.contains("dark");
    $("#iconSun").classList.toggle("hidden", !dark);   // dark mode shows the sun (click for light)
    $("#iconMoon").classList.toggle("hidden", dark);
    readParticleColor();
  };
  $("#themeToggle").addEventListener("click", () => {
    root.classList.toggle("dark");
    try { localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light"); } catch (e) {}
    syncTheme();
  });

  /* ---------- Mobile menu ---------- */
  const menu = $("#mobileMenu"), menuBtn = $("#menuToggle");
  const setMenu = (open) => {
    menu.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", String(open));
  };
  menuBtn.addEventListener("click", () => setMenu(menu.classList.contains("hidden")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* ---------- Scroll progress ---------- */
  const bar = $("#scrollProgress");
  let ticking = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  updateProgress();

  /* ---------- Active nav link ---------- */
  const links = $$(".nav-links a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) spy.observe(s); });

  /* ---------- Contact form (opens the visitor's email client) ---------- */
  window.handleContactSubmit = (e) => {
    e.preventDefault();
    const f = e.target, d = new FormData(f);
    const body = `${d.get("message")}\n\n- ${d.get("name")} (${d.get("email")})`;
    location.href = `mailto:alex.morgan@example.com?subject=${encodeURIComponent("Portfolio enquiry from " + d.get("name"))}&body=${encodeURIComponent(body)}`;
    $("#formNote").classList.remove("hidden");
    f.reset();
    return false;
  };

  /* ---------- Background particles ---------- */
  let pColor = "197,168,128";
  function readParticleColor() {
    const hex = getComputedStyle(root).getPropertyValue("--accent").trim().replace("#", "");
    if (hex.length === 6) pColor = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",");
  }
  const cv = $("#heroParticles");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d");
    let w, h, pts = [];
    const size = () => {
      w = cv.width = innerWidth; h = cv.height = innerHeight;
      const n = Math.min(70, Math.floor((w * h) / 24000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 }));
    };
    size();
    addEventListener("resize", size);
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.fillStyle = `rgba(${pColor},.7)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 6.283); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${pColor},${(1 - d / 130) * .25})`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(frame);
    };
    frame();
  }
  syncTheme();

  /* ---------- Card tilt (hero visual) ---------- */
  const initTilt = () => {
    if (window.VanillaTilt && finePointer && !reduce)
      VanillaTilt.init($$("[data-tilt]"), { max: 8, speed: 600, scale: 1.02 });
  };

  /* ---------- Scroll animations ---------- */
  const animate = window.gsap && window.ScrollTrigger && !reduce;

  const showStatic = () => {
    $$("[data-counter]").forEach((el) => (el.textContent = el.dataset.target + (el.dataset.suffix || "")));
    $$(".tl-item").forEach((el) => el.classList.add("on"));
    const fill = $(".tl-fill"); if (fill) fill.style.transform = "scaleY(1)";
    initTilt();
  };
  if (!animate) { showStatic(); return; }

  gsap.registerPlugin(ScrollTrigger);
  const out = { clearProps: "transform,opacity" };

  // Hero intro
  const intro = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: initTilt });
  intro
    .from(".line-in", { yPercent: 115, duration: 1, stagger: 0.12 })
    .from(".hero-fade", { y: 24, opacity: 0, duration: 0.8, stagger: 0.09, ...out }, "-=0.7")
    .from(".hv-card", { y: 70, opacity: 0, duration: 1, stagger: 0.15, ...out }, "-=0.9");

  // Hero content drifts away as you scroll past it
  gsap.to(".hero-inner", { y: -70, opacity: 0.25, ease: "none", scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true } });

  // Parallax orbs
  $$("[data-speed]").forEach((el) => {
    gsap.to(el, { y: +el.dataset.speed, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: true } });
  });

  // Fade-up reveals
  $$("[data-reveal]").forEach((el) => {
    gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", ...out, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  // Staggered groups
  $$("[data-stagger]").forEach((p) => {
    gsap.from(p.children, { y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", ...out, scrollTrigger: { trigger: p, start: "top 85%", once: true } });
  });

  // Word-by-word text that lights up as you scroll
  $$("[data-words]").forEach((p) => {
    const words = p.textContent.trim().split(/\s+/);
    p.textContent = "";
    words.forEach((word) => {
      const s = document.createElement("span");
      s.textContent = word + " ";
      p.appendChild(s);
    });
    gsap.fromTo(p.children, { opacity: 0.18 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: p, start: "top 85%", end: "bottom 55%", scrub: true } });
  });

  // Counters
  $$("[data-counter]").forEach((el) => {
    const o = { v: 0 }, suffix = el.dataset.suffix || "";
    gsap.to(o, { v: +el.dataset.target, duration: 1.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%", once: true }, onUpdate: () => (el.textContent = Math.round(o.v) + suffix) });
  });

  // Journey timeline fills as you scroll; dots light up
  const tl = $(".tl");
  if (tl) {
    gsap.to(".tl-fill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 65%", scrub: true } });
    $$(".tl-item").forEach((item) => ScrollTrigger.create({ trigger: item, start: "top 70%", onToggle: (s) => item.classList.toggle("on", s.isActive || s.progress > 0) }));
  }

  // Project images slide inside their frames
  $$(".pimg").forEach((box) => {
    gsap.fromTo($("img", box), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Ticker: loops forever, speeds up (and reverses) with scroll velocity
  const track = $(".ticker-track");
  if (track) {
    track.innerHTML += track.innerHTML;
    const loop = gsap.to(track, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
    ScrollTrigger.create({ onUpdate: (s) => loop.timeScale(gsap.utils.clamp(-5, 5, 1 + s.getVelocity() / 250)) });
    gsap.ticker.add(() => { const c = loop.timeScale(); loop.timeScale(c + (1 - c) * 0.05); });
  }
})();
