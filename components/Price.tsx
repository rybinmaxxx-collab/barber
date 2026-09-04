'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { contacts, price } from '@/lib/content';

/** Блок 5 — Прайс (ТЗ, раздел 6). */
export default function Price() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.price__title'));

    gsap.from('.price__card', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.price__list', start: 'top 80%', once: true },
    });

    return revertTitle;
  });

  return (
    <section id="price" className="price" ref={ref}>
      <div className="price__header">
        <span className="price__label">{price.label}</span>
        <h2 className="price__title" data-split>
          {price.title}
        </h2>
        <p className="price__intro">{price.intro}</p>
      </div>

      <div className="price__list">
        {price.items.map((item) => (
          <article className="price__card" key={item.num}>
            <span className="price__card-num">{item.num}</span>
            <div className="price__card-main">
              <h3 className="price__card-title">{item.title}</h3>
              <p className="price__card-desc">{item.desc}</p>
            </div>
            <span className="price__card-time">{item.time}</span>
            <span className="price__card-price">{item.price}</span>
          </article>
        ))}
      </div>

      <p className="price__note">{price.note}</p>

      <a href={contacts.phoneHref} className="price__cta">
        Записаться
      </a>
    </section>
  );
}
