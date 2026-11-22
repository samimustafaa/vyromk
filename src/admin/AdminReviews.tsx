import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'

export function AdminReviews() {
  const { reviews, products, deleteReview } = useStore()
  const [filter, setFilter] = useState<number | 'all'>('all')

  const productName = (id: string) => products.find((p) => p.id === id)?.name ?? 'Removed product'
  const productImage = (id: string) => products.find((p) => p.id === id)?.image ?? '/products/shoe4.avif'

  const filtered = useMemo(
    () => reviews.filter((r) => (filter === 'all' ? true : r.rating === filter)),
    [reviews, filter],
  )

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Reviews</h1>
          <p>What customers say after the drop lands. Moderate anything off-brand.</p>
        </div>
        <span className="adm-chip">{reviews.length} total</span>
      </div>

      <div className="adm-grid adm-grid--sidebar">
        <div className="adm-stack">
          <div className="adm-toolbar">
            <div className="adm-seg">
              <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                All
              </button>
              {[5, 4, 3, 2, 1].map((s) => (
                <button key={s} type="button" className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>
                  {s}★
                </button>
              ))}
            </div>
            <span className="adm-count">{filtered.length} shown</span>
          </div>

          <div className="adm-review-list">
            {filtered.map((r) => (
              <article key={r.id} className="adm-review">
                <div className="adm-review-top">
                  <div className="adm-avatar">{r.name.charAt(0).toUpperCase()}</div>
                  <div className="adm-review-who">
                    <strong>{r.name}</strong>
                    <span>{new Date(r.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="adm-stars" aria-label={`${r.rating} out of 5`}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={s <= r.rating ? 'on' : ''}>
                        ★
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="adm-icon-btn adm-icon-btn--danger"
                    title="Delete review"
                    onClick={() => deleteReview(r.id)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <p className="adm-review-text">{r.text}</p>
                <div className="adm-review-prod">
                  <img src={productImage(r.productId)} alt="" className="adm-thumb-sm" />
                  <span>{productName(r.productId)}</span>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="adm-card">
                <p className="adm-empty">No reviews with this rating.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="adm-card adm-rating-card">
          <div className="adm-card-head">
            <h2>Overall rating</h2>
          </div>
          <div className="adm-rating-big">
            <strong>{avg}</strong>
            <div>
              <div className="adm-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={s <= Math.round(Number(avg) || 0) ? 'on' : ''}>
                    ★
                  </span>
                ))}
              </div>
              <span>{reviews.length} reviews</span>
            </div>
          </div>
          <div className="adm-mix">
            {dist.map((d) => (
              <div key={d.star} className="adm-mix-row adm-mix-row--stars">
                <span className="adm-mix-label">{d.star}★</span>
                <div className="adm-track">
                  <span
                    className="adm-track-fill adm-track-fill--lime"
                    style={{ width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }}
                  />
                </div>
                <strong>{d.count}</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
