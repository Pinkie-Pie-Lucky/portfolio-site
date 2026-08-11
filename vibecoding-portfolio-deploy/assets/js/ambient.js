/* ============================================================
   Ambient Portfolio — Interactions
   流体粒子拖尾 · 滚动进度 · 滚动浮现 · 卡片视差 · 导航态
   全程尊重 prefers-reduced-motion
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 导航：滚动加底色 + 移动端菜单 ---------- */
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");

  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
    const bar = document.getElementById("scrollProgress");
    if (bar) {
      const h = document.documentElement;
      const p = (h.scrollTop || document.body.scrollTop) /
                ((h.scrollHeight || document.body.scrollHeight) - h.clientHeight);
      bar.style.width = (p * 100).toFixed(2) + "%";
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open")));
  }

  /* ---------- 滚动浮现 ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- 技能条填充 ---------- */
  const skills = document.querySelectorAll(".skill");
  if ("IntersectionObserver" in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); so.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    skills.forEach((s) => so.observe(s));
  } else {
    skills.forEach((s) => s.classList.add("in"));
  }

  /* ---------- 卡片视差倾斜 ---------- */
  if (!reduceMotion) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      const max = 8;
      card.addEventListener("mousemove", (ev) => {
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width - 0.5;
        const py = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- 产品截图画廊：左右切换 + 胶囊圆点 + 键盘/滑动 ---------- */
  document.querySelectorAll(".shot-gallery").forEach((g) => {
    const track = g.querySelector(".shot-gallery__track");
    const slides = Array.from(g.querySelectorAll(".shot-gallery__slide"));
    const prev = g.querySelector(".shot-gallery__nav--prev");
    const next = g.querySelector(".shot-gallery__nav--next");
    const dotsWrap = g.querySelector(".shot-gallery__dots");
    if (!track || slides.length === 0) return;

    let index = 0;
    let dots = [];

    // 按当前图真实比例设容器比例（钳制，避免极端竖/横屏撑爆）
    function applyRatio() {
      const img = slides[index].querySelector("img");
      if (img && img.naturalWidth) {
        const r = img.naturalWidth / img.naturalHeight;
        g.style.aspectRatio = Math.min(Math.max(r, 0.8), 1.9);
      }
    }
    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach((d, k) => d.classList.toggle("is-active", k === index));
      applyRatio();
    }

    // 动态生成圆点
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "shot-gallery__dot" + (i === 0 ? " is-active" : "");
        b.setAttribute("aria-label", "第 " + (i + 1) + " 张，共 " + slides.length + " 张");
        b.addEventListener("click", () => go(i));
        dotsWrap.appendChild(b);
      });
      dots = Array.from(dotsWrap.children);
    }

    // 单图：隐藏控件
    if (slides.length <= 1) { g.classList.add("is-single"); return; }

    if (prev) prev.addEventListener("click", () => go(index - 1));
    if (next) next.addEventListener("click", () => go(index + 1));

    // 键盘 ← / →
    g.setAttribute("tabindex", "0");
    g.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { go(index - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { go(index + 1); e.preventDefault(); }
    });

    // 移动端滑动
    let sx = 0;
    g.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    g.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    // 点击图片左右半边也能切换（左=上一张，右=下一张）；避开箭头与圆点
    g.addEventListener("click", (e) => {
      if (e.target.closest(".shot-gallery__nav") || e.target.closest(".shot-gallery__dot")) return;
      const rect = g.getBoundingClientRect();
      const x = e.clientX - rect.left;
      go(index + (x < rect.width / 2 ? -1 : 1));
    });

    // 图片加载后校正比例
    slides.forEach((s) => {
      const im = s.querySelector("img");
      if (im && !im.complete) im.addEventListener("load", applyRatio);
    });
    applyRatio();
  });

  /* ---------- 光标粒子拖尾 + 连线 ---------- */
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext("2d");
  let w, h, dpr;
  const particles = [];
  const COUNT = 36;
  const mouse = { x: -999, y: -999, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
  }
  resize();
  addEventListener("resize", resize);

  function rand(a, b) { return a + Math.random() * (b - a); }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: rand(0, w), y: rand(0, h),
      vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
      r: rand(1.2, 2.6) * dpr,
    });
  }

  addEventListener("mousemove", (e) => {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
    mouse.active = true;
  });
  addEventListener("mouseleave", () => { mouse.active = false; });

  function tick() {
    ctx.clearRect(0, 0, w, h);

    // 漂浮粒子
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34,211,238,0.55)";
      ctx.fill();
    }

    // 跟随光晕
    if (mouse.active) {
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120 * dpr);
      g.addColorStop(0, "rgba(168,85,247,0.18)");
      g.addColorStop(1, "rgba(168,85,247,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 120 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // 鼠标附近的粒子被"吸"过来并连线
      for (const p of particles) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160 * dpr) {
          p.x -= dx * 0.02; p.y -= dy * 0.02;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = "rgba(34,211,238," + (1 - dist / (160 * dpr)) * 0.4 + ")";
          ctx.lineWidth = dpr;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
