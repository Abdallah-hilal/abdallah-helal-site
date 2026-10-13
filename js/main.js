/* Abdallah Helal — personal site. Small, dependency-light interactions.
   Honors prefers-reduced-motion throughout. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Icons — Lucide, rounded minimal stroke (matches this brand's feel).
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "stroke-width": 1.9 } });
  }

  // 2. Current year in the footer.
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // 2b. TopBar collapses into a pill, and a thin bar tracks scroll progress.
  var topbar = document.getElementById("topbar");
  var progress = document.getElementById("scrollProgress");
  var ticking = false;
  function updateScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (topbar) {
      if (y > 40) topbar.classList.add("is-pinned");
      else topbar.classList.remove("is-pinned");
    }
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? y / h : 0;
      progress.style.transform = "scaleX(" + Math.min(Math.max(p, 0), 1) + ")";
    }
    ticking = false;
  }
  if (topbar || progress) {
    updateScroll();
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
  }

  // 3. Mobile nav toggle.
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 4. Scroll reveal — entrance on first view.
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 }
    );
    reveals.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add("in"); return; }
      io.observe(el);
    });
  }

  // 4b. Mouse-reactive touches — skipped on touch devices and reduced motion.
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !reduce) {
    // Cursor-following glow
    var glow = document.getElementById("cursorGlow");
    if (glow) {
      document.body.classList.add("cursor-on");
      var gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy, rafG;
      window.addEventListener("mousemove", function (e) {
        gx = e.clientX; gy = e.clientY;
        if (!rafG) rafG = requestAnimationFrame(moveGlow);
      }, { passive: true });
      function moveGlow() {
        cx += (gx - cx) * 0.18; cy += (gy - cy) * 0.18;
        glow.style.transform = "translate(" + cx + "px," + cy + "px)";
        rafG = (Math.abs(gx - cx) > 0.5 || Math.abs(gy - cy) > 0.5) ? requestAnimationFrame(moveGlow) : null;
      }
    }

    // Spotlight + subtle 3D tilt on interactive cards
    var tilters = document.querySelectorAll(".card, .stat, .favikon-card");
    Array.prototype.forEach.call(tilters, function (el) {
      el.classList.add("spot", "tilt");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;   // 0..1
        var py = (e.clientY - r.top) / r.height;   // 0..1
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        el.style.setProperty("--rx", ((px - 0.5) * 7).toFixed(2) + "deg");  // rotateY
        el.style.setProperty("--ry", ((0.5 - py) * 7).toFixed(2) + "deg");  // rotateX
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });

    // Magnetic buttons — nudge toward the cursor near the edges
    var mags = document.querySelectorAll(".btn");
    Array.prototype.forEach.call(mags, function (el) {
      el.classList.add("magnetic");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var my = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        el.style.setProperty("--tx", (mx * 6).toFixed(1) + "px");
        el.style.setProperty("--ty", (my * 6).toFixed(1) + "px");
        el.style.setProperty("--ms", "1.04");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--tx", "0px");
        el.style.setProperty("--ty", "0px");
        el.style.setProperty("--ms", "1");
      });
    });
  }

  // 5. Count-up on any [data-count] stat when it first scrolls into view.
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce || isNaN(target)) { return; }
    var start = null, dur = 1400;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if (counters.length && !reduce && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }
})();
