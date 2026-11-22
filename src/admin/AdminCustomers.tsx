import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { formatMkd } from '../data/products'

export function AdminCustomers() {
  const { orders, subscribers, wishlist, products } = useStore()
  const [tab, setTab] = useState<'buyers' | 'newsletter' | 'saved'>('buyers')
  const [query, setQuery] = useState('')

  const buyers = useMemo(() => {
    const map = new Map<string, { name: string; city: string; phone: string; orders: number; spend: number; last: string }>()
    orders.forEach((o) => {
      const key = `${o.customerName.toLowerCase()}-${o.phone}`
      const prev = map.get(key)
      map.set(key, {
        name: o.customerName,
        city: o.city,
        phone: o.phone,
        orders: (prev?.orders ?? 0) + 1,
        spend: (prev?.spend ?? 0) + o.totalMkd,
        last: prev && prev.last > o.createdAt ? prev.last : o.createdAt,
      })
    })
    return [...map.values()].sort((a, b) => b.spend - a.spend)
  }, [orders])

  const filteredBuyers = useMemo(() => {
    const q = query.trim().toLowerCase()
    return buyers.filter((b) => (q ? `${b.name} ${b.city} ${b.phone}`.toLowerCase().includes(q) : true))
  }, [buyers, query])

  const topSpend = buyers[0]?.spend ?? 1
  const repeat = buyers.filter((b) => b.orders > 1).length

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Customers</h1>
          <p>Buyers, newsletter signups and saved items from this browser’s store data.</p>
        </div>
      </div>

      <div className="adm-kpis">
        <article className="adm-kpi">
          <span className="adm-kpi-label">Customers</span>
          <strong className="adm-kpi-value">{buyers.length}</strong>
          <span className="adm-kpi-meta">have placed an order</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Repeat buyers</span>
          <strong className="adm-kpi-value">{repeat}</strong>
          <span className="adm-kpi-meta">2 or more orders</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Newsletter</span>
          <strong className="adm-kpi-value">{subscribers.length}</strong>
          <span className="adm-kpi-meta">email subscribers</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Saved items</span>
          <strong className="adm-kpi-value">{wishlist.length}</strong>
          <span className="adm-kpi-meta">on wishlists</span>
        </article>
      </div>

      <div className="adm-toolbar">
        <div className="adm-seg">
          <button type="button" className={tab === 'buyers' ? 'active' : ''} onClick={() => setTab('buyers')}>
            Buyers
          </button>
          <button type="button" className={tab === 'newsletter' ? 'active' : ''} onClick={() => setTab('newsletter')}>
            Newsletter
          </button>
          <button type="button" className={tab === 'saved' ? 'active' : ''} onClick={() => setTab('saved')}>
            Saved
          </button>
        </div>
        {tab === 'buyers' && (
          <div className="adm-toolbar-search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers"
              aria-label="Search customers"
            />
          </div>
        )}
      </div>

      {tab === 'buyers' && (
        <div className="adm-card adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Orders</th>
                  <th>Spend</th>
                  <th>Last order</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuyers.map((b) => (
                  <tr key={`${b.name}-${b.phone}`}>
                    <td>
                      <div className="adm-cust-cell">
                        <div className="adm-avatar">{b.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <strong>{b.name}</strong>
                          <span>{b.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>{b.city}</td>
                    <td>
                      <span className={`adm-pill${b.orders > 1 ? ' adm-pill--ok' : ' adm-pill--neutral'}`}>{b.orders}</span>
                    </td>
                    <td>
                      <div className="adm-inline-track">
                        <div className="adm-track">
                          <span className="adm-track-fill adm-track-fill--lime" style={{ width: `${(b.spend / topSpend) * 100}%` }} />
                        </div>
                        <strong>{formatMkd(b.spend)}</strong>
                      </div>
                    </td>
                    <td className="adm-muted">{new Date(b.last).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBuyers.length === 0 && <p className="adm-empty">No customers yet. Orders will populate this list.</p>}
        </div>
      )}

      {tab === 'newsletter' && (
        <div className="adm-card">
          <div className="adm-card-head">
            <h2>Email subscribers</h2>
            <span className="adm-chip">{subscribers.length} people</span>
          </div>
          {subscribers.length === 0 ? (
            <p className="adm-empty">No subscribers yet. The footer form feeds this list.</p>
          ) : (
            <ul className="adm-simple-list">
              {subscribers.map((email) => (
                <li key={email}>
                  <span className="adm-avatar adm-avatar--sm">{email.charAt(0).toUpperCase()}</span>
                  <span>{email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'saved' && (
        <div className="adm-card">
          <div className="adm-card-head">
            <h2>Most saved products</h2>
          </div>
          {wishlist.length === 0 ? (
            <p className="adm-empty">Nothing saved yet. Tap the heart on a product to test it.</p>
          ) : (
            <ul className="adm-rank-list">
              {[...new Set(wishlist)].map((id) => {
                const p = products.find((x) => x.id === id)
                if (!p) return null
                return (
                  <li key={id}>
                    <img src={p.image} alt="" className="adm-thumb-sm" />
                    <div className="adm-rank-info">
                      <strong>{p.name}</strong>
                      <span>{p.colorway}</span>
                    </div>
                    <span className="adm-muted">{formatMkd(p.priceMkd)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
