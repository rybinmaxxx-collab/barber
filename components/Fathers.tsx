'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { asset } from '@/lib/asset';
import { fathers } from '@/lib/content';

/** Блок 6 — Отцы и сыновья (ТЗ, раздел 7): изображение открывается clip-path. */
export default function Fathers() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.fathers__title'));

    gsap.from('.fathers__text p', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.fathers__text', start: 'top 85%', once: true },
    });

    gsap.from('.fathers__feature', {
      x: -30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.fathers__features', start: 'top 85%', once: true },
    });

    gsap.fromTo(
      '.fathers__media',
      { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '.fathers__media', start: 'top 80%', once: true },
      }
    );

    return revertTitle;
  });

  return (
    <section id="fathers" className="fathers" ref={ref}>
      <div className="fathers__content">
        <span className="fathers__label">{fathers.label}</span>
        <h2 className="fathers__title" data-split>
          {fathers.title}
        </h2>

        <div className="fathers__text">
          {fathers.paragraphs.map((text) => (
            <p key={text.slice(0, 24)}>{text}</p>
          ))}
        </div>

        <div className="fathers__features">
          {fathers.features.map((feature) => (
            <div className="fathers__feature" key={feature.title}>
              <h4>{feature.title}</h4>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="fathers__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/images/father-son.svg')} alt="Отец и сын в барбершопе" />
      </div>
    </section>
  );
}
