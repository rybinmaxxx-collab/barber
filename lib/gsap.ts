'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';

// Плагины регистрируются один раз, только в браузере (ТЗ, раздел 14).
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase);
}

/** Пользователь просил не анимировать — уважаем и показываем всё статикой. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

type TextOptions = {
  type?: 'words' | 'chars' | 'lines';
  yPercent?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  once?: boolean;
};

/**
 * ТЗ, 14.3: заголовок разбивается на слова и выезжает по скроллу.
 * Возвращает функцию отката — SplitText нужно вернуть в исходный DOM,
 * иначе повторный монтаж компонента разобьёт уже разбитое.
 */
export function animateTextOnScroll(
  target: Element | null,
  options: TextOptions = {}
): () => void {
  if (!target) return () => {};

  const config = {
    type: 'words' as const,
    yPercent: 110,
    duration: 0.6,
    stagger: 0.04,
    ease: 'expo.out',
    start: 'top 85%',
    once: true,
    ...options,
  };

  if (prefersReducedMotion()) return () => {};

  const split = SplitText.create(target, { type: config.type });
  const parts = split[config.type] as Element[];

  const tween = gsap.from(parts, {
    yPercent: config.yPercent,
    opacity: 0,
    duration: config.duration,
    stagger: config.stagger,
    ease: config.ease,
    scrollTrigger: {
      trigger: target,
      start: config.start,
      once: config.once,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    split.revert();
  };
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase };
