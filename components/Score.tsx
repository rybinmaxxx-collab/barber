import { score } from '@/lib/content';

export default function Score() {
  return (
    <section id="stats" className="specs">
      <div className="specs-inner">
        <p className="kicker reveal">[ 02 · Счёт ]</p>
        <h2 className="reveal">{score.title}</h2>
        <p className="specs-lead reveal">{score.intro}</p>
        <dl className="spec-grid">
          {score.items.map((item) => (
            <div className="reveal" key={item.caption}>
              <dt>{item.caption}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
