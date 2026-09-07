import { fathers } from '@/lib/content';

export default function Fathers() {
  return (
    <section id="family" className="position">
      <div className="position-inner">
        <p className="kicker reveal">[ 06 · Отцы и сыновья ]</p>
        <h2 className="reveal">{fathers.title}</h2>
        {fathers.paragraphs.map((text) => (
          <p className="position-lead reveal" key={text}>
            {text}
          </p>
        ))}
        <div className="studio-cols">
          {fathers.features.map((feature) => (
            <div className="reveal" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
