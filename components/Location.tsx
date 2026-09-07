import { contacts, location } from '@/lib/content';

export default function Location() {
  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        <div className="contact-block">
          <p className="kicker reveal">[ 11 · Как дойти ]</p>
          <h2 className="contact-title reveal">{location.title}</h2>
          <dl className="reveal">
            <dt>Адрес</dt>
            <dd>{contacts.address}</dd>
            <dt>Телефон</dt>
            <dd>
              <a href={contacts.phoneHref}>{contacts.phone}</a>
            </dd>
            <dt>Часы работы</dt>
            <dd>{location.hours}</dd>
          </dl>
          <div className="contact-links reveal">
            <a className="btn btn-solid" href={contacts.phoneHref}>
              Записаться
            </a>
            <a className="btn btn-ghost" href={contacts.telegram}>
              Telegram
            </a>
            <a className="btn btn-ghost" href={contacts.whatsapp}>
              WhatsApp
            </a>
            <a className="btn btn-ghost" href={contacts.yandexMaps}>
              Яндекс.Карты
            </a>
          </div>
          <div className="contact-map reveal">
            <iframe
              src={contacts.yandexWidget}
              title="Барбер от Бога на Яндекс.Картах"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
