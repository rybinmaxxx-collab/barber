/* ==========================================================================
   3D-ХРЕБЕТ СТРАНИЦЫ — Three.js
   Один объект: опасная бритва. Весь вертикальный скролл — это её таймлайн.

     закрыта → раскрывается → разлетается на части → части живут отдельно →
     собирается обратно и закрывается

   Вся геометрия процедурная: ни одного внешнего ассета и ни одного запроса.
   Канвас зафиксирован на весь экран и живёт под контентом всю страницу.
   ========================================================================== */
import * as THREE from "three";

const mount = document.getElementById("scene");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
const smooth = t => t * t * (3 - 2 * t);
const mix = (a, b, t) => a + (b - a) * t;

export function initScene() {
  if (!mount) return;

  try {
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) throw 0;
  } catch (e) {
    mount.style.background = "radial-gradient(70% 70% at 72% 34%, #241a08, #08090b 70%)";
    return;
  }

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x08090b, 0.05);

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 11);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;
  mount.appendChild(renderer.domElement);

  // --- процедурная среда отражений -----------------------------------------
  // Металлу нужно что-то отражать, иначе он выглядит чёрным. Вместо HDR-файла
  // рисуем студийный градиент в canvas и вешаем как equirect-окружение.
  (function environment() {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.00, "#3c3428");
    grad.addColorStop(0.40, "#d8bd93");
    grad.addColorStop(0.52, "#8a6f45");
    grad.addColorStop(1.00, "#0e1015");
    g.fillStyle = grad; g.fillRect(0, 0, 512, 256);
    const spot = g.createRadialGradient(360, 54, 6, 360, 54, 140);
    spot.addColorStop(0, "#fffaf0"); spot.addColorStop(1, "rgba(255,250,240,0)");
    g.fillStyle = spot; g.fillRect(0, 0, 512, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.environment = tex;
  })();

  /* ======================= материалы ======================= */
  const MATS = [];
  const mkMat = o => { const m = new THREE.MeshStandardMaterial({ transparent: true, ...o }); MATS.push(m); return m; };

  const steel = mkMat({ color: 0xe2e6ea, roughness: 0.12, metalness: 1, envMapIntensity: 1.5 });
  const horn  = mkMat({ color: 0x2a3040, roughness: 0.30, metalness: 0.35, envMapIntensity: 1.4 });
  const brass = mkMat({ color: 0xc9a227, roughness: 0.22, metalness: 1, envMapIntensity: 1.3 });

  /* ======================= геометрия бритвы =======================
     Начало координат группы — ось шарнира. Клинок смотрит в +X,
     накладки рукояти уходят в −X. Закрыта = клинок повёрнут на 180°
     и лежит между накладками. Ровно так складывается настоящая бритва.
     ================================================================ */
  const razor = new THREE.Group();
  scene.add(razor);

  // --- клинок ---
  function bladeShape() {
    const s = new THREE.Shape();
    s.moveTo(0, 0.40);
    s.lineTo(2.70, 0.40);                          // обух
    s.quadraticCurveTo(3.22, 0.38, 3.18, -0.02);   // скруглённый носок
    s.quadraticCurveTo(2.98, -0.33, 2.34, -0.40);  // брюшко
    s.lineTo(0.34, -0.40);                         // режущая кромка
    s.quadraticCurveTo(0.02, -0.40, 0, 0.40);      // пятка
    return s;
  }
  const blade = new THREE.Group();
  const bladeMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(bladeShape(), {
      depth: 0.05, bevelEnabled: true, bevelThickness: 0.012,
      bevelSize: 0.02, bevelSegments: 2, curveSegments: 24,
    }), steel);
  bladeMesh.position.set(0.62, 0, -0.025);
  blade.add(bladeMesh);

  const tang = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.20, 0.05), steel);
  tang.position.set(0.30, 0, 0);
  blade.add(tang);

  const boss = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 24), steel);
  boss.rotation.x = Math.PI / 2;
  blade.add(boss);
  razor.add(blade);

  // --- накладки рукояти ---
  function scaleShape() {
    const s = new THREE.Shape();
    s.moveTo(0, 0.26);
    s.lineTo(-3.42, 0.24);
    s.quadraticCurveTo(-3.78, 0.20, -3.76, 0);
    s.quadraticCurveTo(-3.78, -0.20, -3.42, -0.24);
    s.lineTo(0, -0.26);
    s.quadraticCurveTo(0.26, -0.26, 0.26, 0);
    s.quadraticCurveTo(0.26, 0.26, 0, 0.26);
    return s;
  }
  const scaleGeo = new THREE.ExtrudeGeometry(scaleShape(), {
    depth: 0.085, bevelEnabled: true, bevelThickness: 0.02,
    bevelSize: 0.025, bevelSegments: 2, curveSegments: 20,
  });
  const scaleA = new THREE.Mesh(scaleGeo, horn);
  const scaleB = new THREE.Mesh(scaleGeo, horn);
  scaleA.position.z = 0.075;
  scaleB.position.z = -0.16;
  razor.add(scaleA, scaleB);

  // латунные вставки на рукояти
  const inlayGeo = new THREE.BoxGeometry(0.9, 0.14, 0.02);
  const inlayA = new THREE.Mesh(inlayGeo, brass);
  const inlayB = new THREE.Mesh(inlayGeo, brass);
  inlayA.position.set(-2.4, 0, 0.166);
  inlayB.position.set(-2.4, 0, -0.166);
  razor.add(inlayA, inlayB);

  // --- шарнир и хвостовик ---
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.44, 20), brass);
  pin.rotation.x = Math.PI / 2;
  razor.add(pin);

  const wedge = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.40, 0.20), brass);
  wedge.position.set(-3.5, 0, 0);
  razor.add(wedge);

  const PARTS = { blade, scaleA, scaleB, inlayA, inlayB, pin, wedge };
  const HOME = {};
  Object.entries(PARTS).forEach(([k, o]) => (HOME[k] = o.position.clone()));

  /* ======================= пыль ======================= */
  const COUNT = innerWidth < 820 ? 380 : 820;
  const pos = new Float32Array(COUNT * 3);
  const spd = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    spd[i] = 0.07 + Math.random() * 0.26;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xe8cf7a, size: 0.032, transparent: true, opacity: 0.5,
    depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(dust);

  /* ======================= свет ======================= */
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.SpotLight(0xfff2d8, 220, 32, Math.PI / 4.2, 0.55, 1.4);
  key.position.set(4, 5, 10);
  scene.add(key);
  // заполняющий свет со стороны камеры — без него металл читается силуэтом
  const fill = new THREE.PointLight(0xffe9c4, 90, 26, 1.8);
  fill.position.set(2.5, 1.5, 8);
  scene.add(fill);
  const rimWarm = new THREE.PointLight(0xc9a227, 60, 22, 2);
  rimWarm.position.set(-4.5, 3, 4);
  scene.add(rimWarm);
  const rimCool = new THREE.PointLight(0x7a1f22, 45, 22, 2);
  rimCool.position.set(6.5, -3, -2);
  scene.add(rimCool);

  /* ======================= ввод ======================= */
  const mouse = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  addEventListener("pointermove", e => {
    target.x = (e.clientX / innerWidth) * 2 - 1;
    target.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  let pTarget = 0, p = 0;
  const readScroll = () => {
    const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    pTarget = clamp(scrollY / max, 0, 1);
  };
  addEventListener("scroll", readScroll, { passive: true });
  readScroll();

  /* ======================= раскладка ======================= */
  let L = {};
  function layout() {
    const w = innerWidth, portrait = w < innerHeight;
    L = w < 820
      ? { x: portrait ? 1.5 : 1.6, y: portrait ? 3.7 : 0.6, s: 0.38, z: 13.5 }
      : { x: 2.75, y: 0.1, s: 1.02, z: 11 };
    camera.aspect = w / innerHeight;
    camera.position.z = L.z;
    camera.updateProjectionMatrix();
    renderer.setSize(w, innerHeight);
  }
  layout();
  addEventListener("resize", layout);

  /* ======================= привязка таймлайна к секциям =======================
     Раньше границы актов были вбиты числами (0.12, 0.30, …) и «уезжали» при
     любой правке вёрстки. Теперь акты считаются из реальных позиций секций:
     сколько бы блоков ни добавилось, бритва раскрывается на «Счёте»,
     разбирается на «Прайсе» и собирается к «Отзывам».
     ========================================================================= */
  const ANCHORS = ["#count", "#craft", "#price", "#works", "#master", "#words"];
  let A = [0.12, 0.30, 0.42, 0.58, 0.70, 0.82];   // запасные значения
  function computeAnchors() {
    const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    const got = ANCHORS.map(sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const top = el.getBoundingClientRect().top + scrollY;
      return clamp((top - innerHeight * 0.6) / max, 0, 1);
    });
    if (got.every(v => v !== null)) A = got;
  }
  computeAnchors();
  addEventListener("resize", computeAnchors);
  addEventListener("load", computeAnchors);

  // Секции с плотным текстом поверх объекта — считаем их долю скролла.
  let dimRanges = [];
  function computeDimRanges() {
    const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
    dimRanges = ["#price", "#faq", "#contacts"].map(sel => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect(), top = r.top + scrollY;
      return [clamp((top - innerHeight * 0.75) / max, 0, 1), clamp((top + r.height - innerHeight * 0.25) / max, 0, 1)];
    }).filter(Boolean);
  }
  computeDimRanges();
  addEventListener("resize", computeDimRanges);
  addEventListener("load", computeDimRanges);

  /* ======================= цикл ======================= */
  const clock = new THREE.Clock();
  let visible = true;
  document.addEventListener("visibilitychange", () => (visible = !document.hidden));

  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;

    const t = clock.getElapsedTime();
    const dt = Math.min(clock.getDelta(), 0.05);

    p += (pTarget - p) * (reduced ? 1 : 0.085);

    /* --- акты таймлайна ---------------------------------------------------
       Границы взяты из реальных позиций секций (см. computeAnchors):

       герой .. #count   бритва сложена, медленно поворачивается
       #count .. #craft  раскрывается: клинок выходит из рукояти
       #price .. #works  разлетается на части
       #works .. #master части живут отдельно
       #master .. #words собирается обратно и закрывается
       -------------------------------------------------------------------- */
    const back  = smooth(seg(p, A[4], A[5]));
    const open  = smooth(seg(p, A[0], A[1])) * (1 - back);
    const boom  = smooth(seg(p, A[2], A[3])) * (1 - back);
    const orbit = smooth(seg(p, A[3], A[4])) * (1 - back);

    // клинок: 180° (сложен) → 0° (раскрыт)
    blade.rotation.z = Math.PI * (1 - open);

    // разлёт
    scaleA.position.z = HOME.scaleA.z + boom * 1.45;
    scaleB.position.z = HOME.scaleB.z - boom * 1.45;
    inlayA.position.z = HOME.inlayA.z + boom * 1.85;
    inlayB.position.z = HOME.inlayB.z - boom * 1.85;
    scaleA.position.y = HOME.scaleA.y + boom * 0.55;
    scaleB.position.y = HOME.scaleB.y - boom * 0.55;
    pin.position.y    = HOME.pin.y + boom * 1.50;
    pin.rotation.z    = boom * 2.4;
    wedge.position.x  = HOME.wedge.x - boom * 1.50;
    wedge.rotation.z  = boom * 1.8;
    blade.position.y  = HOME.blade.y + boom * 0.85;

    // отдельная жизнь частей
    scaleA.rotation.x = orbit * 0.70 + Math.sin(t * 0.5) * 0.06 * orbit;
    scaleB.rotation.x = -orbit * 0.70;
    blade.rotation.x  = orbit * 0.45;

    // общий поворот, положение и масштаб
    mouse.x += (target.x - mouse.x) * 0.05;
    mouse.y += (target.y - mouse.y) * 0.05;

    razor.rotation.y = -0.55 + p * 2.9 + mouse.x * 0.28;
    razor.rotation.x = 0.12 + Math.sin(t * 0.35) * 0.045 + mouse.y * 0.12 + orbit * 0.35;
    razor.rotation.z = -0.06 + boom * 0.12;

    razor.scale.setScalar(mix(L.s, L.s * 0.72, smooth(seg(p, 0.3, 1))));
    // Во время разлёта части занимают больше места — уводим группу правее
    // и глубже, чтобы обломки не наезжали на текст.
    const side = innerWidth < 820 ? 0.2 : 0.55;
    razor.position.x = L.x + Math.sin(p * Math.PI) * side + boom * (innerWidth < 820 ? 0.5 : 1.35);
    razor.position.y = L.y - Math.sin(p * Math.PI * 0.9) * 0.5;
    razor.position.z = -boom * 1.8;

    // Приглушаем не «примерно там», а ровно пока текстовая секция на экране:
    // диапазоны считаются из реальных координат и переживают любые правки вёрстки.
    let dim = 0;
    for (const [a, b] of dimRanges) dim = Math.max(dim, smooth(seg(p, a, a + 0.05)) * (1 - smooth(seg(p, b - 0.05, b))));
    const op = mix(1, 0.34, dim);
    for (const m of MATS) m.opacity = op;

    // пыль
    const a = dust.geometry.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      a[i * 3 + 1] += spd[i] * dt;
      if (a[i * 3 + 1] > 8) a[i * 3 + 1] = -8;
    }
    dust.geometry.attributes.position.needsUpdate = true;

    camera.position.x = mouse.x * 0.5;
    camera.position.y = -mouse.y * 0.35;
    camera.lookAt(0, 0, 0);

    rimWarm.intensity = 36 + Math.sin(t * 2) * 10;

    renderer.render(scene, camera);
  }
  tick();
}
