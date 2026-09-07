import { contacts, price } from '@/lib/content';

export default function Price() {
  return (
    <section id="price" className="price">
      <div className="price-inner">
        <p className="kicker reveal">[ 05 · Прайс ]</p>
        <h2 className="reveal">{price.title}</h2>
        <p className="price-lead reveal">{price.intro}</p>
        <div className="price-list">
          {price.items.map((item) => (
            <div className="price-row reveal" key={item.num}>
              <span className="n">{item.num}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <span className="price-time">{item.time}</span>
              <span className="price-amount">{item.price}</span>
            </div>
          ))}
        </div>
        <p className="price-foot reveal">{price.note}</p>
        <div className="price-cta reveal">
          <a className="btn btn-solid" href={contacts.phoneHref}>
            Записаться
          </a>
        </div>
      </div>
    </section>
  );
}
