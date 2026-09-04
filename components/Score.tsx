'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { score } from '@/lib/content';

/** Блок 2 — Счёт (ТЗ, раздел 3): count-up по скроллу. */
export default function Score() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.score__title'));

    root.querySelectorAll<HTMLElement>('.score__number').forEach((el) => {
      const target = parseFloat(el.dataset.count ?? '0');
      // «5,0» остаётся «5,0», а не превращается в «5»: разряд задан в контенте.
      const decimals = Number(el.dataset.decimals ?? 0);
      const box = { value: 0 };

      gsap.to(box, {
        value: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = decimals
            ? box.value.toFixed(decimals).replace('.', ',')
            : String(Math.round(box.value));
        },
      });
    });

    gsap.from('.score__item', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.score__grid', start: 'top 80%', once: true },
    });

    return revertTitle;
  });

  return (
    <section id="score" className="score" ref={ref}>
      <div className="score__header">
        <span className="score__label">{score.label}</span>
        <h2 className="score__title" data-split>
          {score.title}
        </h2>
        <p className="score__intro">{score.intro}</p>
      </div>

      <div className="score__grid">
        {score.items.map((item) => {
          const decimals = 'decimals' in item ? item.decimals : 0;
          return (
          <div className="score__item" key={item.caption}>
            <span
              className="score__number"
              data-count={item.count}
              data-decimals={decimals}
            >
              {decimals
                ? item.count.toFixed(decimals).replace('.', ',')
                : item.count}
            </span>
            <p className="score__caption">{item.caption}</p>
            <p className="score__sub">{item.sub}</p>
          </div>
          );
        })}
      </div>
    </section>
  );
}
