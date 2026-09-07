import { manifesto } from '@/lib/content';

export default function Manifesto() {
  return (
    <section id="position" className="position">
      <div className="position-inner">
        <p className="kicker reveal">[ 03 · Позиция ]</p>
        <h2 className="reveal">{manifesto.title}</h2>
        <p className="position-lead reveal">{manifesto.closing}</p>
        <div className="position-cols">
          <div className="reveal">
            <h3>Чего нет</h3>
            <ul>
              {manifesto.no.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="reveal has">
            <h3>Что есть</h3>
            <ul>
              {manifesto.yes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
