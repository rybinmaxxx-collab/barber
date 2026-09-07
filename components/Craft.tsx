import { craft } from '@/lib/content';

export default function Craft() {
  return (
    <section id="craft" className="process">
      <div className="process-inner">
        <p className="kicker reveal">[ 04 · Ремесло ]</p>
        <h2 className="reveal">{craft.title}</h2>
        <p className="process-lead reveal">{craft.intro}</p>
        <div className="process-list">
          {craft.steps.map((step) => (
            <div className="process-step reveal" key={step.number}>
              <span className="n">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
