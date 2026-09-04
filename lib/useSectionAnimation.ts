'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap, prefersReducedMotion } from './gsap';

/**
 * Оборачивает анимации секции в gsap.context: при размонтировании
 * компонента все твины и ScrollTrigger'ы этой секции убираются сами.
 */
export function useSectionAnimation<T extends HTMLElement>(
  setup: (ctx: { root: T }) => void | (() => void)
): RefObject<T> {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (prefersReducedMotion()) return;

    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup({ root });
    }, root);

    return () => {
      if (typeof cleanup === 'function') cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
