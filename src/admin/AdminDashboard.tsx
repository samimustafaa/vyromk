import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { categoryLabel, formatMkd, GENDER_LABELS } from '../data/products'
import { dayLabel, linePath, shortMkd } from './adminData'

export function AdminDashboard() {
  const { products, orders, getStock, subscribers, reviews, categories, discounts } = useStore()

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.totalMkd, 0)
    const units = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0)
    const pending = orders.filter((o) => o.status === 'pending').length
    const shipped = orders.filter((o) => o.status === 'shipped').length
    const delivered = orders.filter((o) => o.status === 'delivered').length
    const since = new Date()
    since.setDate(since.getDate() - 30)
    const recent = orders.filter((o) => new Date(o.createdAt) >= since)
    const recentRevenue = recent.reduce((s, o) => s + o.totalMkd, 0)
    return {
      revenue,
      units,
      pending,
      shipped,
      delivered,
      avgOrder: orders.length ? Math.round(revenue / orders.length) : 0,
      recentOrders: recent.length,
      recentRevenue,
    }
  }, [orders])

  const series = useMemo(() => {
    const days = 14
    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (days - 1 - i))
      return { day: d.toISOString().slice(0, 10), total: 0, count: 0 }
    })
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10)
      const b = buckets.find((x) => x.day === key)
      if (b) {
        b.total += o.totalMkd
        b.count += 1
      }
    })
    return buckets
  }, [orders])

  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; units: number; revenue: number; image: string }>()
    orders.forEach((o) =>
      o.items.forEach((i) => {
        const prod = products.find((p) => p.id === i.productId)
        const prev = map.get(i.name) ?? {
          name: i.name,
          units: 0,
          revenue: 0,
          image: prod?.image ?? '/products/shoe4.avif',
        }
        map.set(i.name, {
          ...prev,
          units: prev.units + i.quantity,
          revenue: prev.revenue + i.priceMkd * i.quantity,
        })
      }),
    )
    return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [orders, products])

  const lowStock = useMemo(
    () =>
      products
        .flatMap((p) => p.sizes.map((size) => ({ product: p, size, qty: getStock(p.id, size) })))
        .filter((r) => r.qty <= 2)
        .sort((a, b) => a.qty - b.qty)
        .slice(0, 6),
    [products, getStock],
  )

  const genderMix = useMemo(() => {
    const total = products.length || 1
    return (['men', 'women', 'unisex'] as const).map((g) => {
      const count = products.filter((p) => p.gender === g).length
      return { key: g, label: GENDER_LABELS[g].en, count, pct: Math.round((count / total) * 100) }
    })
  }, [products])

  const maxSeries = Math.max(...series.map((s) => s.total), 1)
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'
  const totalStock = products.reduce(
    (sum, p) => sum + p.sizes.reduce((a, size) => a + getStock(p.id, size), 0),
    0,
  )

  const cards = [
    {
      label: 'Total revenue',
      value: formatMkd(stats.revenue),
      meta: `${formatMkd(stats.recentRevenue)} last 30 days`,
      key: 'revenue',
    },
    { label: 'Orders', value: String(orders.length), meta: `${stats.pending} awaiting action`, key: 'orders' },
    { label: 'Average order', value: formatMkd(stats.avgOrder), meta: `${stats.units} units sold`, key: 'avg' },
    { label: 'Units in stock', value: String(totalStock), meta: `${lowStock.length} low-stock lines`, key: 'stock' },
  ]

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>A live snapshot of how VYRO MK is performing right now.</p>
        </div>
        <div className="adm-head-actions">
          <Link to="/admin/products" className="adm-btn adm-btn--lime adm-btn--sm">+ Add product</Link>
          <Link to="/admin/orders" className="adm-btn adm-btn--ghost adm-btn--sm">View orders</Link>
        </div>
      </div>

      <div className="adm-kpis">
        {cards.map((c) => (
          <article key={c.key} className="adm-kpi">
            <span className="adm-kpi-label">{c.label}</span>
            <strong className="adm-kpi-value">{c.value}</strong>
            <span className="adm-kpi-meta">{c.meta}</span>
            <span className={`adm-kpi-spark adm-kpi-spark--${c.key}`} aria-hidden="true">
              <svg viewBox="0 0 100 32" preserveAspectRatio="none">
                <path
                  d={linePath(
                    c.key === 'stock'
                      ? genderMix.map((g) => g.count)
                      : series.map((s) => s.total / 1000),
                  )}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
          </article>
        ))}
      </div>

      <div className="adm-grid adm-grid--wide">
        <section className="adm-card adm-card--chart">
          <div className="adm-card-head">
            <div>
              <h2>Revenue trend</h2>
              <p>Last 14 days — cash on delivery included</p>
            </div>
            <span className="adm-chip">{formatMkd(series.reduce((s, x) => s + x.total, 0))}</span>
          </div>

          <div className="adm-bars" role="img" aria-label="Revenue over the last 14 days">
            {series.map((s) => (
              <div key={s.day} className="adm-bar-col">
                <span className="adm-bar-tip">{formatMkd(s.total)}</span>
                <div
                  className="adm-bar"
                  style={{ height: `${Math.max(4, (s.total / maxSeries) * 100)}%` }}
                  title={`${dayLabel(s.day)}: ${formatMkd(s.total)}`}
                />
                <span className="adm-bar-label">{dayLabel(s.day).split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Order pipeline</h2>
          </div>
          <div className="adm-pipeline">
            {[
              { key: 'pending', label: 'Pending', count: stats.pending },
              { key: 'shipped', label: 'Shipped', count: stats.shipped },
              { key: 'delivered', label: 'Delivered', count: stats.delivered },
            ].map((s) => {
              const pct = orders.length ? Math.round((s.count / orders.length) * 100) : 0
              return (
                <div key={s.key} className="adm-pipeline-row">
                  <div className="adm-pipeline-top">
                    <span>{s.label}</span>
                    <strong>{s.count}</strong>
                  </div>
                  <div className="adm-track">
                    <span className={`adm-track-fill adm-track-fill--${s.key}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="adm-mini-stats">
            <div>
              <span>Subscribers</span>
              <strong>{subscribers.length}</strong>
            </div>
            <div>
              <span>Avg rating</span>
              <strong>{avgRating}</strong>
            </div>
            <div>
              <span>Active codes</span>
              <strong>{discounts.filter((d) => d.active).length}</strong>
            </div>
          </div>
        </section>
      </div>

      <div className="adm-grid">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Best sellers</h2>
            <Link to="/admin/sales" className="adm-link">Full report →</Link>
          </div>
          {topProducts.length === 0 ? (
            <p className="adm-empty">No sales yet. Orders will rank products here automatically.</p>
          ) : (
            <ul className="adm-rank-list">
              {topProducts.map((p, i) => (
                <li key={p.name}>
                  <span className="adm-rank-num">{i + 1}</span>
                  <img src={p.image} alt="" className="adm-thumb-sm" />
                  <div className="adm-rank-info">
                    <strong>{p.name}</strong>
                    <span>{p.units} units sold</span>
                  </div>
                  <span className="adm-rank-value">{formatMkd(p.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Low stock alerts</h2>
            <Link to="/admin/inventory" className="adm-link">Manage →</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="adm-empty">Every size is healthy.</p>
          ) : (
            <ul className="adm-stock-list">
              {lowStock.map((r) => (
                <li key={`${r.product.id}-${r.size}`}>
                  <img src={r.product.image} alt="" className="adm-thumb-sm" />
                  <div className="adm-rank-info">
                    <strong>{r.product.name}</strong>
                    <span>Size {r.size}</span>
                  </div>
                  <span className={`adm-pill${r.qty === 0 ? ' adm-pill--out' : ' adm-pill--warn'}`}>
                    {r.qty === 0 ? 'Sold out' : `${r.qty} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="adm-grid">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Catalog by audience</h2>
          </div>
          <div className="adm-mix">
            {genderMix.map((g) => (
              <div key={g.key} className="adm-mix-row">
                <span className={`adm-dot adm-dot--${g.key}`} />
                <span className="adm-mix-label">{g.label}</span>
                <div className="adm-track">
                  <span className={`adm-track-fill adm-track-fill--${g.key}`} style={{ width: `${g.pct}%` }} />
                </div>
                <strong>{g.count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Recent orders</h2>
            <Link to="/admin/orders" className="adm-link">All orders →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="adm-empty">No orders yet. Place a test order from the storefront.</p>
          ) : (
            <ul className="adm-recent">
              {orders.slice(0, 4).map((o) => (
                <li key={o.id}>
                  <div>
                    <strong>{o.id}</strong>
                    <span>{o.customerName} · {o.city}</span>
                  </div>
                  <span className={`adm-pill adm-pill--${o.status}`}>{o.status}</span>
                  <strong className="adm-recent-total">{shortMkd(o.totalMkd)} MKD</strong>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="adm-grid adm-grid--three">
        {categories.slice(0, 3).map((c) => {
          const count = products.filter((p) => p.category === c.slug).length
          return (
            <article key={c.slug} className="adm-cat-mini">
              <img src={c.image} alt="" />
              <div>
                <strong>{categoryLabel(categories, c.slug, 'en')}</strong>
                <span>{count} products</span>
              </div>
              <Link to="/admin/categories" className="adm-link">Edit</Link>
            </article>
          )
        })}
      </div>
    </div>
  )
}
