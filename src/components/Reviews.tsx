import { useState } from 'react'
import { reviewsFor, shop, useShop } from '../store/shop'
import '../pages/CheckoutPage.css'
import '../pages/Account.css'

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default function Reviews({ productId }: { productId: string }) {
  const state = useShop()
  const list = reviewsFor(state, productId)
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const average = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = shop.addReview(productId, rating, text)
    setError(result)
    if (!result) {
      setRating(0)
      setText('')
    }
  }

  return (
    <section className="reviews" aria-labelledby="reviews-title">
      <h2 id="reviews-title">Сэтгэгдэл</h2>
      <p className="review-summary">
        {list.length > 0 ? (
          <>
            <span className="stars" aria-hidden="true">{stars(Math.round(average))}</span> {average.toFixed(1)} · {list.length} сэтгэгдэл
          </>
        ) : (
          'Одоогоор сэтгэгдэл алга. Эхний сэтгэгдлийг та үлдээгээрэй.'
        )}
      </p>
      <form onSubmit={submit} noValidate>
        <div className="field">
          <span id="rating-label" style={{ fontWeight: 600 }}>Үнэлгээ</span>
          <div className="star-input" role="group" aria-labelledby="rating-label">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={n <= rating ? 'on' : ''}
                aria-label={`${n} од`}
                aria-pressed={n === rating}
                onClick={() => setRating(n)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="review-text">Таны сэтгэгдэл</label>
          <textarea
            id="review-text"
            value={text}
            maxLength={500}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'review-error' : undefined}
            onChange={(e) => setText(e.target.value)}
          />
          {error && <p id="review-error" className="field-error" role="alert">{error}</p>}
        </div>
        <button type="submit" className="btn-primary">Сэтгэгдэл үлдээх</button>
      </form>
      {list.length > 0 && (
        <ul className="review-list">
          {list.map((r) => (
            <li key={r.id}>
              <div className="review-head">
                <strong>{r.author}</strong>
                <span className="stars" role="img" aria-label={`${r.rating} од`}>{stars(r.rating)}</span>
                <small className="muted">{new Date(r.date).toLocaleDateString('en-CA')}</small>
                <button type="button" className="link-btn" onClick={() => shop.deleteReview(r.id)}>
                  Устгах
                </button>
              </div>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
