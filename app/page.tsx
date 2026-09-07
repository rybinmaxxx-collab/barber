import Stage from '@/components/Stage';
import Reveal from '@/components/Reveal';
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
import { footer, statement } from '@/lib/content';

/**
 * Порядок блоков: Hero → Счёт → Позиция → Ремесло → Прайс →
 * Отцы и сыновья → Работы → Мастер → Отзывы → Вопросы → Как дойти.
 */
export default function Page() {
  return (
    <>
      <a className="skip-link" href="#price">
        К прайсу и записи
      </a>

      <Stage />
      <Reveal />
      <Header />

      <main>
        <Hero />
        <Score />
        <Manifesto />
        <Craft />
        <Price />
        <Fathers />
        <Works />
        <Master />
        <Reviews />
        <Faq />

        <section className="statement">
          <p className="reveal">
            {statement.before}
            <em>{statement.accent}</em>
          </p>
        </section>

        <Location />
      </main>

      <footer className="footer">
        <p className="foot-brand">{footer.brand}</p>
        <div className="foot-bottom">
          {footer.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </footer>
    </>
  );
}
