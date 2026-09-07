import { asset } from '@/lib/asset';
import { contacts, master } from '@/lib/content';

export default function Master() {
  return (
    <section id="master" className="master">
      <div className="master-inner">
        <div className="master-photo reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset('/images/nadir.svg')} alt="Надир — барбер" loading="lazy" />
          <div className="master-tags">
            {master.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="master-text">
          <p className="kicker reveal">[ 08 · Мастер ]</p>
          <h2 className="reveal">{master.title}</h2>
          <p className="reveal">{master.text}</p>
          <blockquote className="master-quote reveal">
            {master.quote}
            <cite>{master.quoteSource}</cite>
          </blockquote>
          <div className="second-chair reveal">
            <h3>{master.vacancy.title}</h3>
            {master.vacancy.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <a className="btn btn-ghost" href={contacts.phoneHref}>
              {master.vacancy.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
