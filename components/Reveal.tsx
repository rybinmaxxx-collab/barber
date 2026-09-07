'use client';

import { useEffect } from 'react';

/**
 * Появление блоков. Элементы с классом .reveal прячутся стилями и
 * показываются, когда попадают в кадр; первый экран запускается сразу
 * после первой отрисовки. Без JS (или если IntersectionObserver нет)
 * класс .js не ставится и всё видно как обычно.
 */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('js');

    const hero = document.querySelector('.hero');
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => hero?.classList.add('loaded')),
    );
    const timer = window.setTimeout(() => hero?.classList.add('loaded'), 400);

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal'),
    ).filter((el) => !el.closest('.hero'));

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return null;
}
