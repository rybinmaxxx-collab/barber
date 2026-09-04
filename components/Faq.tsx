'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { faq } from '@/lib/content';

/**
 * Блок 10 — Вопросы (ТЗ, раздел 11): нативный <details> с плавным раскрытием.
 * Без JS аккордеон всё равно работает — открытие просто происходит мгновенно.
 */
export default function Faq() {
  const ref = useSectionAnimation<HTMLElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.faq__title'));

    gsap.from('.faq__item', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.faq__list', start: 'top 85%', once: true },
    });

    const cleanups: Array<() => void> = [];

    root.querySelectorAll<HTMLDetailsElement>('.faq__item').forEach((item) => {
      const answer = item.querySelector<HTMLElement>('.faq__answer');
      const summary = item.querySelector<HTMLElement>('.faq__question');
      if (!answer || !summary) return;

      const onClick = (event: Event) => {
        event.preventDefault();

        if (item.open) {
          gsap.to(answer, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
              item.open = false;
              gsap.set(answer, { clearProps: 'height,opacity' });
            },
          });
        } else {
          item.open = true;
          gsap.fromTo(
            answer,
            { height: 0, opacity: 0 },
            {
              height: 'auto',
              opacity: 1,
              duration: 0.4,
              ease: 'power2.out',
              onComplete: () => gsap.set(answer, { clearProps: 'height' }),
            }
          );
        }
      };

      summary.addEventListener('click', onClick);
      cleanups.push(() => summary.removeEventListener('click', onClick));
    });

    return () => {
      cleanups.forEach((fn) => fn());
      revertTitle();
    };
  });

  return (
    <section id="faq" className="faq" ref={ref}>
      <div className="faq__header">
        <span className="faq__label">{faq.label}</span>
        <h2 className="faq__title" data-split>
          {faq.title}
        </h2>
        <p className="faq__subtitle">{faq.subtitle}</p>
      </div>

      <div className="faq__list">
        {faq.items.map((item) => (
          <details className="faq__item" key={item.q}>
            <summary className="faq__question">{item.q}</summary>
            <div className="faq__answer">
              <p dangerouslySetInnerHTML={{ __html: item.a }} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
