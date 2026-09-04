'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { asset } from '@/lib/asset';
import { works } from '@/lib/content';

/**
 * Блок 7 — Работы (ТЗ, раздел 8): лента едет вбок, пока страница едет вниз.
 *
 * Отличие от кода в ТЗ: там лента двигалась на `xPercent: -100 * (items - 1)`,
 * что верно только для карточек шириной во весь экран. Карточки здесь по 350 px,
 * поэтому сдвиг считается из реальной ширины ленты — иначе половина работ
 * уезжает за край и не показывается вовсе.
 */
export default function Works() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.works__title'));

    const gallery = root.querySelector<HTMLElement>('.works__gallery');
    const wrapper = root.querySelector<HTMLElement>('.works__gallery-wrapper');

    if (gallery && wrapper && window.matchMedia('(min-width: 768px)').matches) {
      const distance = () => Math.max(0, gallery.scrollWidth - window.innerWidth);

      gsap.to(gallery, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          end: () => '+=' + distance(),
        },
      });
    }

    gsap.from('.works__item', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.works__gallery', start: 'top 80%', once: true },
    });

    return revertTitle;
  });

  return (
    <section id="works" className="works" ref={ref}>
      <div className="works__header">
        <span className="works__label">{works.label}</span>
        <h2 className="works__title" data-split>
          {works.title}
        </h2>
        <p className="works__intro">{works.intro}</p>
      </div>

      <div className="works__gallery-wrapper">
        <div className="works__gallery">
          {works.items.map((item) => (
            <div className="works__item" key={item.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(item.src)} alt={item.name} loading="lazy" />
              <div className="works__item-info">
                <span className="works__item-name">{item.name}</span>
                <span className="works__item-meta">{item.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
