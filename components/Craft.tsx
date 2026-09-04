'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { craft } from '@/lib/content';

/** Блок 4 — Ремесло (ТЗ, раздел 5): четыре шага выезжают по очереди. */
export default function Craft() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.craft__title'));

    gsap.from('.craft__intro', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.craft__intro', start: 'top 85%', once: true },
    });

    gsap.from('.craft__step', {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.craft__steps', start: 'top 80%', once: true },
    });

    gsap.from('.craft__step-number', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.craft__steps', start: 'top 80%', once: true },
    });

    return revertTitle;
  });

  return (
    <section id="craft" className="craft" ref={ref}>
      <div className="craft__header">
        <span className="craft__label">{craft.label}</span>
        <h2 className="craft__title" data-split>
          {craft.title}
        </h2>
        <p className="craft__intro">{craft.intro}</p>
      </div>

      <div className="craft__steps">
        {craft.steps.map((step) => (
          <article className="craft__step" key={step.number}>
            <span className="craft__step-number">{step.number}</span>
            <h3 className="craft__step-title">{step.title}</h3>
            <p className="craft__step-text">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
