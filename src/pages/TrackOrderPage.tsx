import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatMkd } from '../data/products'

export function TrackOrderPage() {
  const { lang, orders, findOrder } = useStore()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<ReturnType<typeof findOrder> | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setResult(findOrder(query) ?? null)
    setSearched(true)
  }

  const steps = ['pending', 'shipped', 'delivered'] as const

  const latestOrder = orders[0]

  return (
    <div className="track-page">
      <section className="shop-header">
        <div className="container">
          <h1 className="display-title shop-title">
            {lang === 'mk' ? 'Следи нарачка' : 'Track Your Order'}
          </h1>
          <p className="shop-sub">
            {lang === 'mk'
              ? 'Внеси го бројот на нарачка (пр. VYRO-1234) за да провериш статус.'
              : 'Enter your order number (e.g. VYRO-1234) to check its status.'}
          </p>
          <form className="track-form" onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="VYRO-1234"
              aria-label="Order number"
              className="shop-search"
            />
            <button type="submit" className="btn btn-lime">
              {lang === 'mk' ? 'Провери' : 'Track'}
            </button>
          </form>
          {latestOrder && (
            <p className="track-hint">
              {lang === 'mk' ? 'Последна нарачка: ' : 'Latest order: '}
              <button type="button" className="track-hint-btn" onClick={() => { setQuery(latestOrder.id); setResult(latestOrder); setSearched(true) }}>
                {latestOrder.id}
              </button>
            </p>
          )}
        </div>
      </section>

      <section className="section-light">
        <div className="container">
          {!result && searched && (
            <div className="empty-search">
              <p>{lang === 'mk' ? 'Нарачката не е пронајдена. Провери го бројот.' : 'Order not found. Double-check the order number.'}</p>
              <Link to="/shop" className="btn btn-dark">{lang === 'mk' ? 'Кон продавница' : 'Back to shop'}</Link>
            </div>
          )}

          {result && (
            <div className="track-card">
              <div className="track-head">
                <div>
                  <strong>{result.id}</strong>
                  <span>
                    {result.customerName} • {result.city}
                  </span>
                </div>
                <strong>{formatMkd(result.totalMkd)}</strong>
              </div>

              <div className="track-steps">
                {steps.map((step, i) => {
                  const activeIndex = steps.indexOf(result.status)
                  const state = i <= activeIndex ? 'done' : 'todo'
                  return (
                    <div key={step} className={`track-step ${state}`}>
                      <span className="track-dot" />
                      <span className="track-label">
                        {step === 'pending'
                          ? lang === 'mk' ? 'Примена' : 'Order placed'
                          : step === 'shipped'
                            ? lang === 'mk' ? 'Испратена' : 'Shipped'
                            : lang === 'mk' ? 'Доставена' : 'Delivered'}
                      </span>
                    </div>
                  )
                })}
              </div>

              <ul className="track-items">
                {result.items.map((item, i) => (
                  <li key={i}>
                    <span>{item.name} — {lang === 'mk' ? 'број' : 'size'} {item.size} × {item.quantity}</span>
                    <span>{formatMkd(item.priceMkd * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
