'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { manifesto } from '@/lib/content';

/** Блок 3 — Позиция (ТЗ, раздел 4): колонки съезжаются с двух сторон. */
export default function Manifesto() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.manifesto__title'));

    gsap.from('.manifesto__column--no', {
      x: -40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.manifesto__columns', start: 'top 80%', once: true },
    });

    gsap.from('.manifesto__column--yes', {
      x: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.manifesto__columns', start: 'top 80%', once: true },
    });

    gsap.from('.manifesto__list li', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.manifesto__list', start: 'top 85%', once: true },
    });

    gsap.from('.manifesto__closing', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.manifesto__closing', start: 'top 90%', once: true },
    });

    return revertTitle;
  });

  return (
    <section id="manifesto" className="manifesto" ref={ref}>
      <div className="manifesto__header">
        <span className="manifesto__label">{manifesto.label}</span>
        <h2 className="manifesto__title" data-split>
          {manifesto.title}
        </h2>
      </div>

      <div className="manifesto__columns">
        <div className="manifesto__column manifesto__column--no">
          <h3 className="manifesto__column-title">Чего нет</h3>
          <ul className="manifesto__list">
            {manifesto.no.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="manifesto__column manifesto__column--yes">
          <h3 className="manifesto__column-title">Что есть</h3>
          <ul className="manifesto__list">
            {manifesto.yes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="manifesto__closing">{manifesto.closing}</p>
    </section>
  );
}
