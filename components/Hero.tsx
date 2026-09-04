'use client';

import dynamic from 'next/dynamic';
import { useLayoutEffect, useRef } from 'react';
import { gsap, SplitText, prefersReducedMotion } from '@/lib/gsap';
import { contacts, hero } from '@/lib/content';

// Canvas инициализируется только в браузере и только после гидрации (ТЗ 15.3).
const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false });

/** Блок 1 — Hero (ТЗ, раздел 2). Анимация стартует после прелоадера. */
export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !ready || prefersReducedMotion()) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const created = SplitText.create('.hero__title', {
        type: 'words, chars',
        wordsClass: 'hero__word',
        charsClass: 'hero__char',
      });
      split = created;

      gsap
        .timeline({ delay: 0.3 })
        .from('.hero__subtitle', {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        })
        .from(
          created.chars,
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.6,
            stagger: 0.02,
            ease: 'expo.out',
          },
          '-=0.4'
        )
        .from(
          '.hero__description',
          { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.6'
        )
        .from(
          '.hero__button',
          { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
          '-=0.4'
        )
        .from('.hero__scroll-indicator', { opacity: 0, duration: 1 }, '-=0.2');
    }, root);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [ready]);

  return (
    <section id="hero" className="hero" ref={ref}>
      <div className="hero__3d-canvas" aria-hidden="true">
        {ready && <Hero3D />}
      </div>

      <div className="hero__content">
        <p className="hero__subtitle">{hero.subtitle}</p>
        <h1 className="hero__title" data-split>
          {hero.title}
        </h1>
        <p className="hero__description">{hero.description}</p>
        <div className="hero__cta">
          <a href="#price" className="hero__button">
            Записаться
          </a>
          <a href="#works" className="hero__button hero__button--ghost">
            Посмотреть работы
          </a>
        </div>
        <p className="visually-hidden">
          Запись по телефону {contacts.phone}. {contacts.address}. {contacts.hours}.
        </p>
      </div>

      <div className="hero__scroll-indicator" aria-hidden="true">
        <span>Скролл</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
