'use client';

import { useState } from 'react';
import Preloader from '@/components/Preloader';
import SmoothScroll from '@/components/SmoothScroll';
import PageTransition from '@/components/PageTransition';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Score from '@/components/Score';
import Manifesto from '@/components/Manifesto';
import Craft from '@/components/Craft';
import Price from '@/components/Price';
import Fathers from '@/components/Fathers';
import Works from '@/components/Works';
import Master from '@/components/Master';
import Reviews from '@/components/Reviews';
import Faq from '@/components/Faq';
import Location from '@/components/Location';

/**
 * Порядок блоков — из ТЗ: Preloader → Hero → Счёт → Позиция → Ремесло →
 * Прайс → Отцы и сыновья → Работы → Мастер → Отзывы → Вопросы → Как дойти.
 */
export default function Page() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <a className="skip-link" href="#price">
        К прайсу и записи
      </a>

      <Preloader onDone={() => setReady(true)} />
      <SmoothScroll />

      {/* Шапка вне контейнера перехода: clip-path на предке ломает position: fixed. */}
      <Header />

      <PageTransition ready={ready}>
        <main>
          <Hero ready={ready} />
          <Score />
          <Manifesto />
          <Craft />
          <Price />
          <Fathers />
          <Works />
          <Master />
          <Reviews />
          <Faq />
          <Location />
        </main>
      </PageTransition>
    </>
  );
}
