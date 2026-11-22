import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { formatMkd } from '../data/products'

export function AdminInventory() {
  const { products, getStock, setStock, showToast } = useStore()
  const [query, setQuery] = useState('')
  const [onlyLow, setOnlyLow] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .map((p) => {
        const sizes = p.sizes.map((size) => ({ size, qty: getStock(p.id, size) }))
        return { product: p, sizes, total: sizes.reduce((s, r) => s + r.qty, 0) }
      })
      .filter((r) => (onlyLow ? r.sizes.some((s) => s.qty <= 2) : true))
  }, [products, getStock, query, onlyLow])

  const totals = useMemo(() => {
    let units = 0
    let value = 0
    let low = 0
    let out = 0
    products.forEach((p) =>
      p.sizes.forEach((size) => {
        const qty = getStock(p.id, size)
        units += qty
        value += qty * p.priceMkd
        if (qty === 0) out += 1
        else if (qty <= 2) low += 1
      }),
    )
    return { units, value, low, out }
  }, [products, getStock])

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Inventory</h1>
          <p>Edit stock per size. Changes appear on the storefront instantly.</p>
        </div>
        <div className="adm-head-actions">
          <button
            type="button"
            className={`adm-btn adm-btn--sm ${onlyLow ? 'adm-btn--lime' : 'adm-btn--ghost'}`}
            onClick={() => setOnlyLow((v) => !v)}
          >
            {onlyLow ? 'Showing low stock' : 'Only low stock'}
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--ghost adm-btn--sm"
            onClick={() => {
              products.forEach((p) => p.sizes.forEach((size) => setStock(p.id, size, 8)))
              showToast('Stock restocked to 8 units per size')
            }}
          >
            Restock all
          </button>
        </div>
      </div>

      <div className="adm-kpis">
        <article className="adm-kpi">
          <span className="adm-kpi-label">Units on hand</span>
          <strong className="adm-kpi-value">{totals.units}</strong>
          <span className="adm-kpi-meta">across all sizes</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Stock value</span>
          <strong className="adm-kpi-value">{formatMkd(totals.value)}</strong>
          <span className="adm-kpi-meta">retail price</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Low stock lines</span>
          <strong className="adm-kpi-value">{totals.low}</strong>
          <span className="adm-kpi-meta">2 units or fewer</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Sold out lines</span>
          <strong className="adm-kpi-value">{totals.out}</strong>
          <span className="adm-kpi-meta">size level</span>
        </article>
      </div>

      <div className="adm-toolbar">
        <div className="adm-toolbar-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a product"
            aria-label="Search inventory"
          />
        </div>
        <span className="adm-count">{rows.length} products</span>
      </div>

      <div className="adm-card adm-table-card">
        <div className="adm-table-wrap">
          <table className="adm-table adm-table--inventory">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size / units</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.product.id}>
                  <td>
                    <div className="adm-prod-cell">
                      <img src={r.product.image} alt="" className="adm-thumb-sm" />
                      <div>
                        <strong>{r.product.name}</strong>
                        <span>{formatMkd(r.product.priceMkd)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="adm-size-grid">
                      {r.sizes.map((s) => (
                        <label
                          key={s.size}
                          className={`adm-size-cell${s.qty === 0 ? ' is-out' : s.qty <= 2 ? ' is-low' : ''}`}
                        >
                          <span>{s.size}</span>
                          <input
                            type="number"
                            min="0"
                            max="999"
                            value={s.qty}
                            onChange={(e) => setStock(r.product.id, s.size, Math.max(0, Number(e.target.value) || 0))}
                            aria-label={`${r.product.name} size ${s.size}`}
                          />
                        </label>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`adm-pill${r.total === 0 ? ' adm-pill--out' : r.total <= 6 ? ' adm-pill--warn' : ' adm-pill--ok'}`}>
                      {r.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="adm-empty">Nothing matches this filter.</p>}
      </div>
    </div>
  )
}
