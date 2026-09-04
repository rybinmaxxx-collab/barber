'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

/**
 * Переход «Парикмахерская» (ТЗ, раздел 13).
 *
 * Отличие от буквы ТЗ: @barba/core здесь не используется. Barba подменяет
 * контейнер сам, перехватывая клики по ссылкам, — на App Router этим занимается
 * роутер Next.js, и две системы дерутся за один и тот же DOM. Поэтому та же
 * шторка (clip-path, 600–800 ms, power3.inOut) сделана средствами GSAP:
 * на роутере Next.js результат для зрителя тот же, а DOM остаётся под React.
 */
export default function PageTransition({
  children,
  ready,
}: {
  children: ReactNode;
  ready: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container || !ready) return;

    if (prefersReducedMotion()) {
      gsap.set(container, { clearProps: 'all' });
      return;
    }

    document.body.classList.add('is-transitioning');

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('is-transitioning');
        gsap.set(container, { clearProps: 'clipPath' });
        ScrollTrigger.refresh();
      },
    });

    tl.fromTo(
      container,
      { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.8,
        ease: 'power3.out',
      }
    );

    return () => {
      document.body.classList.remove('is-transitioning');
      tl.kill();
    };
  }, [ready]);

  return (
    <div className="page-container" ref={ref}>
      {children}
    </div>
  );
}
