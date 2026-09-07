'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Фон сайта: ножницы из металла, собранные из примитивов three.js
 * (внешняя модель не нужна). Медленно вращаются, реагируют на курсор
 * и на прокрутку. Если WebGL недоступен — на канвас вешается класс
 * .fallback с градиентом, и сайт выглядит так же, только без сцены.
 */
export default function Stage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fallback = () => canvas.classList.add('fallback');

    const ctx =
      canvas.getContext('webgl2', { antialias: true, alpha: true }) ||
      canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!ctx) {
      fallback();
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context: ctx as WebGLRenderingContext,
        antialias: true,
        alpha: true,
      });
    } catch {
      fallback();
      return;
    }

    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const group = new THREE.Group();
    scene.add(group);

    const steel = new THREE.MeshStandardMaterial({
      color: 0xd7dade,
      metalness: 1,
      roughness: 0.24,
      envMapIntensity: 1.15,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: 0xcfa15f,
      metalness: 0.9,
      roughness: 0.3,
      envMapIntensity: 1.1,
    });

    function bladeShape() {
      const s = new THREE.Shape();
      s.moveTo(0, 0.15);
      s.quadraticCurveTo(1.05, 0.3, 2.62, 0.06);
      s.lineTo(2.78, 0);
      s.lineTo(2.62, -0.05);
      s.quadraticCurveTo(1.05, -0.14, 0, -0.06);
      s.lineTo(0, 0.15);
      return s;
    }

    /** Половина ножниц: лезвие, шейка и кольцо. */
    function makeHalf(mirror: boolean) {
      const half = new THREE.Group();

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape(), {
        depth: 0.1,
        bevelEnabled: true,
        bevelSize: 0.012,
        bevelThickness: 0.012,
        bevelSegments: 2,
        curveSegments: 24,
      });
      const blade = new THREE.Mesh(bladeGeo, steel);
      blade.position.z = -0.05;
      half.add(blade);

      const shank = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 1.05, 16), steel);
      shank.rotation.z = Math.PI / 2;
      shank.position.set(-0.52, -0.02, 0);
      half.add(shank);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.075, 20, 48), gold);
      ring.position.set(-1.15, -0.02, 0);
      half.add(ring);

      if (mirror) half.scale.y = -1;
      return half;
    }

    const halfA = makeHalf(false);
    const halfB = makeHalf(true);
    const openAngle = 0.3;
    halfA.rotation.z = openAngle;
    halfB.rotation.z = -openAngle;

    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.14, 24), gold);
    screw.rotation.x = Math.PI / 2;

    const scissors = new THREE.Group();
    scissors.add(halfA, halfB, screw);
    // центр тяжести формы смещён к кольцам — сдвигаем, чтобы вращение шло вокруг середины
    scissors.position.x = -0.62;
    scissors.scale.setScalar(1.05);
    group.add(scissors);

    const key = new THREE.DirectionalLight(0xffe8cf, 1.4);
    key.position.set(5, 6, 4);
    const rim = new THREE.DirectionalLight(0x9fc4ff, 1);
    rim.position.set(-6, -2, -4);
    scene.add(key, rim);

    function layout() {
      const w = innerWidth;
      // на десктопе уводим объект вправо от текста, на узком экране —
      // вверх и мельче, чтобы он не лез под абзац и кнопки
      if (w < 820) {
        group.position.set(0, 1.7, -1.2);
        group.scale.setScalar(0.78);
      } else {
        group.position.set(1.9, 0, 0);
        group.scale.setScalar(1);
      }
      camera.aspect = w / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(w, innerHeight);
    }
    layout();
    addEventListener('resize', layout);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = e.clientX / innerWidth - 0.5;
      mouse.ty = e.clientY / innerHeight - 0.5;
    };
    if (!reduce) addEventListener('pointermove', onPointer, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;

    function frame() {
      const t = clock.getElapsedTime();
      const scroll = (scrollY || 0) * 0.0016;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      group.rotation.y = t * 0.18 + scroll * 6 + mouse.x * 0.6;
      group.rotation.x = 0.2 + Math.sin(t * 0.12) * 0.14 + mouse.y * 0.4;
      const openNow = openAngle + mouse.x * 0.12 + Math.sin(t * 0.5) * 0.015;
      halfA.rotation.z = openNow;
      halfB.rotation.z = -openNow;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    if (reduce) {
      group.rotation.set(0.35, 0.7, 0);
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', layout);
      removeEventListener('pointermove', onPointer);
      envRT.texture.dispose();
      pmrem.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      steel.dispose();
      gold.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="stage" ref={canvasRef} aria-hidden="true" />
      <div className="stage-vignette" aria-hidden="true" />
    </>
  );
}
