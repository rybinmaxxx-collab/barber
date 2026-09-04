'use client';

import { gsap, animateTextOnScroll } from '@/lib/gsap';
import { useSectionAnimation } from '@/lib/useSectionAnimation';
import { contacts, footer, location } from '@/lib/content';

/** Блок 11 — Как дойти + футер (ТЗ, раздел 12). */
export default function Location() {
  const ref = useSectionAnimation<HTMLDivElement>(({ root }) => {
    const revertTitle = animateTextOnScroll(root.querySelector('.location__title'));

    gsap.from('.location__hours', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.location__hours', start: 'top 90%', once: true },
    });

    gsap.from('.location__contacts > *', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.location__contacts', start: 'top 90%', once: true },
    });

    gsap.from('.footer__title', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.footer__title', start: 'top 90%', once: true },
    });

    return revertTitle;
  });

  return (
    <div ref={ref}>
      <section id="location" className="location">
        <div className="location__map">
          <iframe
            src={contacts.yandexWidget}
            title="Барбер от Бога на Яндекс.Картах"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div className="location__info">
          <span className="location__label">{location.label}</span>
          <h2 className="location__title" data-split>
            {location.title}
          </h2>
          <p className="location__hours">{location.hours}</p>
          <p className="location__address">{contacts.address}</p>

          <div className="location__contacts">
            <a href={contacts.phoneHref} className="location__phone">
              {contacts.phone}
            </a>
            <div className="location__messengers">
              <a href={contacts.telegram} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
              <a href={contacts.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              <a href={contacts.yandexMaps} target="_blank" rel="noopener noreferrer">
                Яндекс.Карты
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__content">
          <h2 className="footer__title">{footer.title}</h2>
          <div className="footer__bottom">
            {footer.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
