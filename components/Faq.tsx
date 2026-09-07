import { faq } from '@/lib/content';

export default function Faq() {
  return (
    <section id="faq" className="faq">
      <div className="faq-inner">
        <p className="kicker reveal">[ 10 · Вопросы ]</p>
        <h2 className="reveal">{faq.title}</h2>
        <p className="faq-lead reveal">{faq.subtitle}</p>
        <div className="faq-list">
          {faq.items.map((item) => (
            <details className="faq-item reveal" key={item.q}>
              <summary className="faq-q">
                {item.q}
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="faq-a" dangerouslySetInnerHTML={{ __html: item.a }} />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
