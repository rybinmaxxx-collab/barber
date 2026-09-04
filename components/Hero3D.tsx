'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/gsap';

/**
 * ТЗ, раздел 2.5 и 15 — 3D-объект в Hero.
 *
 * Отличие от буквы ТЗ: вместо .glb со Sketchfab кресло собрано процедурно
 * из примитивов. Причины — лицензии на чужие модели, вес .glb и правило
 * проекта «ноль сторонних доменов»: тут нет ни одного внешнего запроса.
 * Поведение объекта — ровно как в ТЗ (15.2): idle-вращение, parallax
 * за мышью, hover-подсветка, металл/шероховатость материалов.
 */

const LEATHER = { color: '#1a1512', roughness: 0.55, metalness: 0.1 };
const BRASS = { color: '#c9a96e', roughness: 0.3, metalness: 0.8 };
const BASE_SCALE = 0.82;

const STEEL = { color: '#6f7176', roughness: 0.35, metalness: 0.9 };

/** Студийное окружение рисуется в canvas: металлу нужно что-то отражать. */
function useStudioEnvironment() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 32);
    grad.addColorStop(0, '#2b2b30');
    grad.addColorStop(0.45, '#141416');
    grad.addColorStop(0.55, '#3a2f22');
    grad.addColorStop(1, '#07080a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 32);
    ctx.fillStyle = 'rgba(255, 236, 210, 0.85)';
    ctx.fillRect(6, 3, 18, 5);
    ctx.fillStyle = 'rgba(201, 169, 110, 0.5)';
    ctx.fillRect(40, 6, 14, 4);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function BarberChair() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const env = useStudioEnvironment();
  const { scene } = useThree();

  useEffect(() => {
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [scene, env]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.getElapsedTime();
    const { x, y } = state.pointer;

    // ТЗ 15.2: idle-вращение + parallax за мышью со сглаживанием.
    group.rotation.y = Math.sin(t * 0.3) * 0.35 + 0.35;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, y * 0.15, 0.08);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, -x * 0.1, 0.08);

    // Базовый масштаб 0.82 — чтобы кресло целиком помещалось в кадр.
    const target = BASE_SCALE * (hovered ? 1.05 : 1);
    group.scale.lerp(new THREE.Vector3(target, target, target), 0.1);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group
        ref={groupRef}
        position={[0, -0.1, 0]}
        scale={BASE_SCALE}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Основание */}
        <mesh position={[0, -1.35, 0]} castShadow>
          <cylinderGeometry args={[0.85, 1.0, 0.18, 48]} />
          <meshStandardMaterial {...BRASS} envMapIntensity={1.5} />
        </mesh>
        {/* Кольцо-подножка вокруг стойки */}
        <mesh position={[0, -1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.05, 16, 48]} />
          <meshStandardMaterial {...STEEL} envMapIntensity={1.4} />
        </mesh>

        {/* Гидравлическая стойка */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.24, 0.3, 0.65, 32]} />
          <meshStandardMaterial {...STEEL} envMapIntensity={1.5} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.5, 24]} />
          <meshStandardMaterial {...BRASS} envMapIntensity={1.6} />
        </mesh>

        {/* Сиденье */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[1.5, 0.3, 1.4]} />
          <meshStandardMaterial
            {...LEATHER}
            emissive={hovered ? '#c9a96e' : '#000000'}
            emissiveIntensity={hovered ? 0.3 : 0}
          />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[1.42, 0.12, 1.32]} />
          <meshStandardMaterial color="#241c17" roughness={0.5} metalness={0.12} />
        </mesh>

        {/* Спинка */}
        <group position={[0, 0.62, -0.62]} rotation={[-0.18, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.4, 1.35, 0.26]} />
            <meshStandardMaterial
              {...LEATHER}
              emissive={hovered ? '#c9a96e' : '#000000'}
              emissiveIntensity={hovered ? 0.25 : 0}
            />
          </mesh>
          {/* Подголовник */}
          <mesh position={[0, 0.88, 0.05]}>
            <boxGeometry args={[0.72, 0.4, 0.24]} />
            <meshStandardMaterial {...LEATHER} />
          </mesh>
          <mesh position={[0, 0.72, 0.05]}>
            <cylinderGeometry args={[0.06, 0.06, 0.34, 16]} />
            <meshStandardMaterial {...STEEL} envMapIntensity={1.4} />
          </mesh>
        </group>

        {/* Подлокотники */}
        {[-0.85, 0.85].map((x) => (
          <group key={x} position={[x, 0.18, 0]}>
            <mesh>
              <boxGeometry args={[0.16, 0.14, 1.25]} />
              <meshStandardMaterial {...BRASS} envMapIntensity={1.6} />
            </mesh>
            <mesh position={[0, -0.2, -0.45]}>
              <cylinderGeometry args={[0.05, 0.05, 0.35, 16]} />
              <meshStandardMaterial {...STEEL} envMapIntensity={1.4} />
            </mesh>
          </group>
        ))}

        {/* Подножка */}
        <group position={[0, -0.78, 0.9]} rotation={[0.35, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.08, 0.5]} />
            <meshStandardMaterial {...BRASS} envMapIntensity={1.6} />
          </mesh>
          {[-0.3, 0, 0.3].map((x) => (
            <mesh key={x} position={[x, 0.06, 0]}>
              <boxGeometry args={[0.08, 0.04, 0.46]} />
              <meshStandardMaterial {...STEEL} envMapIntensity={1.4} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

/** ТЗ 2.5 — камера тянется за курсором. */
function CameraRig() {
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, pointer }) => {
    camera.position.lerp(
      vec.set(pointer.x * 0.5, pointer.y * 0.3, camera.position.z),
      0.02
    );
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Hero3D() {
  const reduced = typeof window !== 'undefined' && prefersReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0.4, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduced ? 'demand' : 'always'}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffecd2" />
      <pointLight position={[-5, 0, 2]} intensity={0.5} color="#2c1810" />
      <Suspense fallback={null}>
        <BarberChair />
      </Suspense>
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
      {!reduced && <CameraRig />}
    </Canvas>
  );
}
