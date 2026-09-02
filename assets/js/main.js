/* ==========================================================================
   БАРБЕР ОТ БОГА — motion layer
   Lenis (smooth scroll) + GSAP/ScrollTrigger (parallax, pin, reveal)
   + кастомный курсор, магнитные кнопки, 3D-tilt, счётчики.
   ========================================================================== */
(() => {
  "use strict";

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- 1. preloader ------------------------------------------------ */
  const loader = $("#loader");
  const bar = $("#loader .loader-bar i");
  let p = 0;
  const fake = setInterval(() => {
    p = Math.min(p + Math.random() * 18, 92);
    if (bar) bar.style.width = p + "%";
  }, 140);

  addEventListener("load", () => {
    clearInterval(fake);
    if (bar) bar.style.width = "100%";
    setTimeout(() => {
      loader && loader.classList.add("done");
      document.body.classList.add("ready");
      playHero();
    }, 380);
  });

  /* ---------- 2. smooth scroll (Lenis) ------------------------------------ */
  let lenis = null;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, lerp: 0.09 });
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  const goTo = (sel) => {
    const el = $(sel);
    if (!el) return;
    lenis ? lenis.scrollTo(el, { offset: -70 })
          : el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  $$("[data-scroll-to]").forEach((a) =>
    a.addEventListener("click", (e) => { e.preventDefault(); goTo(a.getAttribute("href")); })
  );

  /* ---------- 3. header + progress --------------------------------------- */
  const head = $(".site-head");
  const prog = $(".progress");
  const onScroll = () => {
    const y = scrollY;
    head && head.classList.toggle("stuck", y > 40);
    if (prog) {
      const max = document.body.scrollHeight - innerHeight;
      prog.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. custom cursor ------------------------------------------- */
  const cur = $(".cursor"), dot = $(".cursor-dot");
  if (cur && matchMedia("(hover: hover)").matches) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px)`;
      // показываем курсор только после первого движения — иначе он мигает в углу
      if (!cur.classList.contains("on")) { cur.classList.add("on"); dot.classList.add("on"); }
    }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
      cur.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
    $$("a, button, .svc, .tilt, summary").forEach((el) => {
      el.addEventListener("pointerenter", () => cur.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => cur.classList.remove("is-hover"));
    });
  }

  /* ---------- 5. магнитные кнопки ---------------------------------------- */
  $$("[data-magnetic]").forEach((el) => {
    const strength = +el.dataset.magnetic || 0.3;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });

  /* ---------- 6. 3D tilt на карточках ------------------------------------ */
  $$(".tilt").forEach((card) => {
    const inner = $(".tilt-inner", card);
    if (!inner || reduced) return;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      inner.style.transform =
        `rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 14}deg) translateZ(0)`;
      inner.style.setProperty("--mx", px * 100 + "%");
      inner.style.setProperty("--my", py * 100 + "%");
    });
    card.addEventListener("pointerleave", () => { inner.style.transform = ""; });
  });

  /* ---------- 7. reveal on scroll (IntersectionObserver) ------------------ */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- 8. счётчики ------------------------------------------------- */
  const counters = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const end = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split(".")[1] || "").length;
      const t0 = performance.now(), dur = 1400;
      const step = (t) => {
        const k = Math.min((t - t0) / dur, 1);
        const e = 1 - Math.pow(1 - k, 3);
        el.textContent = (end * e).toFixed(dec).replace(".", ",");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counters.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => counters.observe(el));

  /* ---------- 9. hero intro ---------------------------------------------- */
  function playHero() {
    if (!hasGSAP || reduced) {
      $$(".hero-brand, .hero-title .line > span, .hero-sub, .hero-cta, .hero-meta")
        .forEach((el) => { el.style.transform = "none"; el.style.opacity = 1; });
      return;
    }
    gsap.timeline({ defaults: { ease: "expo.out" } })
      .from(".hero-brand", { opacity: 0, y: 12, duration: .8 })
      .from(".hero-title .line > span", { yPercent: 115, duration: 1.25, stagger: 0.09 }, "-=0.45")
      .from(".hero-sub", { y: 28, opacity: 0, duration: 1 }, "-=0.8")
      .from(".hero-cta > *", { y: 24, opacity: 0, duration: .9, stagger: .1 }, "-=0.75")
      .from(".hero-meta > *", { y: 20, opacity: 0, duration: .8, stagger: .07 }, "-=0.7")
      .from(".scroll-hint", { opacity: 0, duration: .8 }, "-=0.6");
  }

  /* ---------- 9.1 шкала глав (хребет-хроника) ----------------------------
     Мотив страницы — время, поэтому оглавление выглядит как шкала: номер
     главы, засечка и название, которое проявляется на активной главе.
     ----------------------------------------------------------------------- */
  const railList = $(".rail ol");
  const chapters = $$("section[data-chapter]");
  if (railList && chapters.length) {
    chapters.forEach((sec, i) => {
      const li = document.createElement("li");
      const n = String(i + 1).padStart(2, "0");
      li.innerHTML = `<a href="#${sec.id}" data-scroll-to>${n}<span>${sec.dataset.chapter}</span></a>`;
      railList.appendChild(li);
    });
    const links = $$(".rail a");
    links.forEach((a) =>
      a.addEventListener("click", (e) => { e.preventDefault(); goTo(a.getAttribute("href")); })
    );
    // светлый разворот перекрашивает шкалу: тёмная тушь вместо кости
    const light = $(".spread");
    if (light) {
      new IntersectionObserver(
        (e) => document.body.classList.toggle("on-light", e[0].isIntersecting),
        { rootMargin: "-45% 0px -45% 0px" }
      ).observe(light);
    }
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        const i = chapters.indexOf(en.target);
        if (i < 0 || !links[i]) return;
        if (en.isIntersecting) {
          links.forEach((l) => { l.classList.remove("on"); l.removeAttribute("aria-current"); });
          links[i].classList.add("on");
          links[i].setAttribute("aria-current", "true");
        }
      }),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    chapters.forEach((s) => spy.observe(s));
  }

  /* ---------- 9.1.1 мобильное меню --------------------------------------- */
  const burger = $(".burger"), menu = $("#menu"), menuList = $(".menu-list");
  if (burger && menu && menuList && chapters.length) {
    chapters.forEach((sec, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#${sec.id}"><b>${String(i + 1).padStart(2, "0")}</b>${sec.dataset.chapter}</a>`;
      menuList.appendChild(li);
    });
    const setMenu = (open) => {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      document.body.classList.toggle("menu-open", open);
      if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add("open")); }
      else { menu.classList.remove("open"); setTimeout(() => { menu.hidden = true; }, 400); }
      lenis && (open ? lenis.stop() : lenis.start());
    };
    burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
    $$(".menu-list a, .menu-foot a").forEach((a) =>
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (href.startsWith("#")) { e.preventDefault(); setMenu(false); setTimeout(() => goTo(href), 260); }
        else setMenu(false);
      })
    );
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) setMenu(false); });
  }

  /* ---------- 9.2 «сейчас открыто»: 10:00–22:00 по Москве -----------------
     Часы подтверждены карточкой Яндекс.Карт. Считаем в московском времени,
     а не в часовом поясе устройства — клиент может смотреть сайт из отпуска.
     ----------------------------------------------------------------------- */
  const OPEN_H = 10, CLOSE_H = 22;
  function mskHours() {
    const p = new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow", hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(new Date());
    const get = (t) => +p.find((x) => x.type === t).value;
    return get("hour") + get("minute") / 60;
  }
  function paintStatus() {
    const h = mskHours();
    const open = h >= OPEN_H && h < CLOSE_H;
    const text = open
      ? (CLOSE_H - h < 1 ? "Открыто, закрываемся в 22:00" : "Сейчас открыто · до 22:00")
      : (h < OPEN_H ? "Закрыто · откроемся в 10:00" : "Закрыто · откроемся завтра в 10:00");
    $$("[data-open-status]").forEach((el) => {
      el.textContent = text;
      el.classList.toggle("is-open", open);
    });
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  /* ---------- 10. GSAP ScrollTrigger сцены -------------------------------- */
  if (hasGSAP && window.ScrollTrigger && !reduced) {
    gsap.registerPlugin(ScrollTrigger);

    // 10.1 параллакс-слои (data-speed)
    $$("[data-speed]").forEach((el) => {
      gsap.to(el, {
        yPercent: (1 - parseFloat(el.dataset.speed)) * 26,
        ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // 10.2 бегущая строка, реагирующая на направление скролла
    $$(".marquee").forEach((m) => {
      const track = $(".marquee-track", m);
      if (!track) return;
      track.innerHTML += track.innerHTML;
      const half = track.scrollWidth / 2;
      const tween = gsap.to(track, { x: -half, duration: 22, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: m, start: "top bottom", end: "bottom top",
        onUpdate: (self) => {
          gsap.to(tween, { timeScale: self.direction === 1 ? 1 : -1, overwrite: true, duration: .4 });
        },
      });
    });

    // 10.3 горизонтальная лента-галерея, привязанная к вертикальному скроллу
    const strip = $(".hstrip"), track = $(".hstrip-track");
    if (strip && track) {
      const dist = () => Math.max(track.scrollWidth - innerWidth + 40, 0);
      gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: strip, start: "top 78%", end: () => "+=" + dist() * 1.15,
          scrub: 0.8, invalidateOnRefresh: true,
        },
      });
    }

    // 10.4 построчное «проявление» заголовков секций
    $$("[data-split]").forEach((h) => {
      gsap.from(h, {
        yPercent: 22, opacity: 0, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: h, start: "top 88%" },
      });
    });

    // 10.5 прайс-строки выезжают каскадом
    gsap.from(".svc", {
      x: -40, opacity: 0, duration: .9, stagger: .07, ease: "power3.out",
      scrollTrigger: { trigger: ".svc-list", start: "top 82%" },
    });

    // 10.6 шаги ремесла: полоса прогресса в липкой колонке + каскад шагов
    const cp = $(".craft-progress i");
    if (cp) {
      ScrollTrigger.create({
        trigger: ".steps", start: "top 70%", end: "bottom 60%", scrub: true,
        onUpdate: (self) => { cp.style.width = (self.progress * 100).toFixed(1) + "%"; },
      });
    }
    gsap.from(".step", {
      y: 40, opacity: 0, duration: .9, stagger: .09, ease: "power3.out",
      scrollTrigger: { trigger: ".steps", start: "top 80%" },
    });

    // 10.7 светлый разворот выезжает как страница поверх тёмной хроники
    gsap.from(".spread .wrap", {
      y: 60, opacity: 0, duration: 1.1, ease: "expo.out",
      scrollTrigger: { trigger: ".spread", start: "top 78%" },
    });

    // 10.8 CTA-полоса «дышит»
    gsap.fromTo(".cta-band",
      { backgroundPosition: "0% 50%" },
      { backgroundPosition: "100% 50%", ease: "none",
        scrollTrigger: { trigger: ".cta-band", scrub: true, start: "top bottom", end: "bottom top" } });

    ScrollTrigger.refresh();

    // шрифты меняют метрики текста -> позиции триггеров надо пересчитать
    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- 11. FAQ: аккордеон-эксклюзив -------------------------------- */
  $$(".faq details").forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open) $$(".faq details").forEach((o) => { if (o !== d) o.open = false; });
      window.ScrollTrigger && ScrollTrigger.refresh();
    })
  );

  /* ---------- 12. год в подвале ------------------------------------------ */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---------- 13. режим ревизии (?edit) ----------------------------------- */
  // Показывает код каждого блока поверх страницы. Скриншот в этом режиме —
  // готовая правка с адресом: [B-04] что / хочу / почему. См. PROCESS.md.
  if (/[?&]edit(=|&|$)/.test(location.search)) {
    document.body.classList.add("edit-mode");
    $$("[data-block]").forEach((el) => {
      const tag = document.createElement("span");
      tag.className = "block-tag";
      tag.textContent = el.dataset.block + " · " + (el.dataset.blockName || "");
      el.appendChild(tag);
    });
    const bar = document.createElement("div");
    bar.className = "edit-banner";
    bar.innerHTML = '<b>Режим ревизии</b><span>правка = [код] что / хочу / почему</span>' +
                    '<a href="' + location.pathname + '">выключить</a>';
    document.body.appendChild(bar);
  }

  /* ---------- 14. лёгкая аналитика кликов по CTA -------------------------- */
  $$("[data-cta]").forEach((el) =>
    el.addEventListener("click", () => {
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({ event: "cta_click", cta_id: el.dataset.cta });
    })
  );
})();
