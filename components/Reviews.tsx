'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { contacts, reviews } from '@/lib/content';

/** Блок 9 — Слова (ТЗ, раздел 10). */
export default function Reviews() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.reviews__title'));

    gsap.from('.reviews__rating', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.reviews__rating', start: 'top 85%', once: true },
    });

    gsap.from('.reviews__slide', {
      x: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.reviews__carousel', start: 'top 80%', once: true },
    });

    gsap.from('.reviews__footer', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.reviews__footer', start: 'top 90%', once: true },
    });

    return revertTitle;
  });

  return (
    <section id="reviews" className="reviews" ref={ref}>
      <div className="reviews__header">
        <span className="reviews__label">{reviews.label}</span>
        <h2 className="reviews__title" data-split>
          {reviews.title}
        </h2>
        <div className="reviews__rating">
          <span className="reviews__stars" aria-label="Оценка 5 из 5">
            ★★★★★
          </span>
          <p>{reviews.ratingText}</p>
        </div>
      </div>

      <div className="reviews__carousel">
        {reviews.slides.map((slide) => (
          <div className="reviews__slide" key={slide.quote.slice(0, 24)}>
            <span className="reviews__stars" aria-hidden="true">
              ★★★★★
            </span>
            <blockquote className="reviews__quote">{slide.quote}</blockquote>
            <div className="reviews__author">
              <span className="reviews__name">{slide.name}</span>
              <span className="reviews__source">{slide.source}</span>
              <span className="reviews__role">{slide.role}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="reviews__footer">
        <h4>{reviews.footer.title}</h4>
        <p>{reviews.footer.text}</p>
        <a
          href={contacts.yandexMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="reviews__link"
        >
          {reviews.footer.cta}
        </a>
      </div>
    </section>
  );
}
