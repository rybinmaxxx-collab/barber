import { contacts, reviews } from '@/lib/content';

export default function Reviews() {
  return (
    <section id="reviews" className="reviews">
      <div className="reviews-inner">
        <p className="kicker reveal">[ 09 · Слова ]</p>
        <h2 className="reveal">{reviews.title}</h2>
        <p className="reviews-lead reveal">{reviews.ratingText}</p>
        {reviews.slides.map((slide) => (
          <div className="review-card reveal" key={slide.quote}>
            <div className="review-stars" aria-label="Оценка 5 из 5">
              ★★★★★
            </div>
            <p>{slide.quote}</p>
            <div className="review-meta">
              {slide.source} · {slide.role}
            </div>
          </div>
        ))}
        <a className="btn btn-ghost reveal" href={contacts.yandexMaps}>
          {reviews.footer.cta} →
        </a>
      </div>
    </section>
  );
}
