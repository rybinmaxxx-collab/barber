import { asset } from '@/lib/asset';
import { works } from '@/lib/content';

export default function Works() {
  return (
    <section id="works" className="works">
      <div className="works-inner">
        <p className="kicker reveal">[ 07 · Работы ]</p>
        <h2 className="reveal">{works.title}</h2>
        <p className="works-lead reveal">{works.intro}</p>
        <div className="works-grid">
          {works.items.map((item) => (
            <div className="work-card reveal" key={item.src}>
              {/* обычный img: сборка статическая, оптимизатор картинок выключен */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(item.src)} alt={item.name} loading="lazy" />
              <div className="work-cap">
                <div className="t">{item.name}</div>
                <div className="m">{item.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
