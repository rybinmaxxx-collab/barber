import { contacts, hero } from '@/lib/content';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <p className="eyebrow reveal">{hero.eyebrow}</p>
      <h1 className="hero-title">
        {hero.titleLines.map((line) => (
          <span className="line" key={line}>
            <span>{line}</span>
          </span>
        ))}
      </h1>
      <p className="hero-sub reveal">{hero.description}</p>
      <div className="hero-ctas reveal">
        <a className="btn btn-solid" href={contacts.phoneHref}>
          Записаться
        </a>
        <a className="btn btn-ghost" href="#works">
          Посмотреть работы
        </a>
      </div>
      <div className="scroll-cue reveal" aria-hidden="true">
        <span />
        Скролл
      </div>
    </section>
  );
}
