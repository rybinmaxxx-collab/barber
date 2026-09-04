'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { asset } from '@/lib/asset';
import { contacts, master } from '@/lib/content';

/** Блок 8 — Мастер (ТЗ, раздел 9): с блоком «Второе кресло». */
export default function Master() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.master__title'));

    gsap.from('.master__text p', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.master__text', start: 'top 85%', once: true },
    });

    gsap.from('.master__quote', {
      x: -30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.master__quote', start: 'top 85%', once: true },
    });

    gsap.from('.master__tags span', {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.master__tags', start: 'top 90%', once: true },
    });

    gsap.from('.master__vacancy', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.master__vacancy', start: 'top 90%', once: true },
    });

    gsap.from('.master__photo img', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.master__photo', start: 'top 80%', once: true },
    });

    return revertTitle;
  });

  return (
    <section id="master" className="master" ref={ref}>
      <div className="master__content">
        <span className="master__label">{master.label}</span>
        <h2 className="master__title" data-split>
          {master.title}
        </h2>

        <div className="master__text">
          <p>{master.text}</p>
        </div>

        <blockquote className="master__quote">
          <p>{master.quote}</p>
          <cite>{master.quoteSource}</cite>
        </blockquote>

        <div className="master__tags">
          {master.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="master__vacancy">
          <h3>{master.vacancy.title}</h3>
          {master.vacancy.paragraphs.map((text) => (
            <p key={text.slice(0, 24)}>{text}</p>
          ))}
          <a href={contacts.phoneHref} className="master__cta">
            {master.vacancy.cta}
          </a>
        </div>
      </div>

      <div className="master__photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset('/images/nadir.svg')} alt="Надир — барбер" />
      </div>
    </section>
  );
}
