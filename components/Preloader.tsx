'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

/**
 * Блок 0 — Preloader (ТЗ, раздел 1).
 * Отрисовка SVG-бритвы (DrawSVG) и счётчик до 100 %, затем шторка уезжает вверх.
 */
export default function Preloader({ onDone }: { onDone?: () => void }) {
  const [gone, setGone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    document.body.style.overflow = 'hidden';

    const finish = () => {
      document.body.style.overflow = '';
      setGone(true);
      onDone?.();
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(root, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: finish,
          });
        },
      });

      tl.to('.preloader__path', {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
      });

      tl.to(
        '.preloader__number',
        {
          innerText: 100,
          duration: 1.5,
          snap: { innerText: 1 },
          ease: 'power2.out',
        },
        '<'
      );
    }, root);

    return () => {
      document.body.style.overflow = '';
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div id="preloader" className="preloader" ref={rootRef} aria-hidden="true">
      <div className="preloader__svg-wrapper">
        {/* Опасная бритва: контур рисуется штрихом от рукояти к носку клинка. */}
        <svg className="preloader__svg" viewBox="0 0 100 100" role="presentation">
          <path
            className="preloader__path"
            d="M14 74 L30 58 C40 48 56 34 74 26 C80 23 86 22 88 24 C90 26 88 31 84 36 C72 50 52 66 36 74 Z M14 74 L10 78 C8 80 8 84 10 86 C12 88 16 88 18 86 L24 80"
          />
        </svg>
      </div>
      <div className="preloader__counter">
        <span className="preloader__number" data-count="100">
          0
        </span>
        %
      </div>
    </div>
  );
}
