'use client';

import { useEffect, useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { contacts, nav } from '@/lib/content';

/** ТЗ, раздел 16 — фиксированная шапка, фон с блюром после первого экрана. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom top',
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <a href="#hero" className="header__logo">
          Барбер от Бога
        </a>

        <nav className="header__nav">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="header__link">
              {item.label}
            </a>
          ))}
          <a href={contacts.phoneHref} className="header__cta">
            Записаться
          </a>
        </nav>

        <button
          type="button"
          className="header__menu-toggle"
          aria-label={menuOpen ? 'Закрыть меню' : 'Меню'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {menuOpen && (
        <div className="header__mobile-nav" onClick={() => setMenuOpen(false)}>
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href={contacts.phoneHref}>{contacts.phone}</a>
        </div>
      )}
    </>
  );
}
