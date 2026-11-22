import { useMemo, useState } from 'react'
import { useStore, type OrderStatus } from '../context/StoreContext'
import { formatMkd } from '../data/products'

const STATUSES: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

export function AdminOrders() {
  const { orders, updateOrderStatus } = useStore()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false
      if (q && !`${o.id} ${o.customerName} ${o.city} ${o.phone}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [orders, filter, query])

  const counts = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
    }),
    [orders],
  )

  const exportCsv = () => {
    const rows = [
      ['Order', 'Date', 'Customer', 'Phone', 'City', 'Address', 'Items', 'Discount', 'Total', 'Status'],
      ...filtered.map((o) => [
        o.id,
        new Date(o.createdAt).toLocaleString('en-GB'),
        o.customerName,
        o.phone,
        o.city,
        o.address,
        o.items.map((i) => `${i.name} (${i.size}) x${i.quantity}`).join(' | '),
        String(o.discountMkd),
        String(o.totalMkd),
        o.status,
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'vyro-orders.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Orders</h1>
          <p>Every cash-on-delivery order placed from the storefront.</p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-seg">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              type="button"
              className={filter === s.key ? 'active' : ''}
              onClick={() => setFilter(s.key)}
            >
              {s.label} <em>{counts[s.key]}</em>
            </button>
          ))}
        </div>
        <div className="adm-toolbar-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, name or city"
            aria-label="Search orders"
          />
        </div>
      </div>

      <div className="adm-order-list">
        {filtered.map((o) => {
          const open = openId === o.id
          const units = o.items.reduce((s, i) => s + i.quantity, 0)
          return (
            <article key={o.id} className={`adm-order${open ? ' is-open' : ''}`}>
              <button type="button" className="adm-order-head" onClick={() => setOpenId(open ? null : o.id)}>
                <div className="adm-order-id">
                  <strong>{o.id}</strong>
                  <span>{new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="adm-order-cust">
                  <strong>{o.customerName}</strong>
                  <span>
                    {o.city} · {o.phone}
                  </span>
                </div>
                <span className="adm-order-units">{units} items</span>
                <strong className="adm-order-total">{formatMkd(o.totalMkd)}</strong>
                <span className={`adm-pill adm-pill--${o.status}`}>{o.status}</span>
                <svg viewBox="0 0 24 24" className="adm-order-chev" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>

              {open && (
                <div className="adm-order-body">
                  <div className="adm-order-cols">
                    <div>
                      <h3>Items</h3>
                      <ul className="adm-order-items">
                        {o.items.map((i, idx) => (
                          <li key={`${i.name}-${idx}`}>
                            <span>
                              {i.name} <em>size {i.size}</em>
                            </span>
                            <span>
                              {i.quantity} × {formatMkd(i.priceMkd)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="adm-order-totals">
                        {o.discountMkd > 0 && (
                          <p>
                            <span>Discount {o.discountCode ? `(${o.discountCode})` : ''}</span>
                            <strong>−{formatMkd(o.discountMkd)}</strong>
                          </p>
                        )}
                        <p className="is-total">
                          <span>Total</span>
                          <strong>{formatMkd(o.totalMkd)}</strong>
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3>Delivery</h3>
                      <p className="adm-order-address">
                        {o.customerName}
                        <br />
                        {o.address}
                        <br />
                        {o.city}
                        <br />
                        {o.phone}
                      </p>
                      <h3>Update status</h3>
                      <div className="adm-status-btns">
                        {(['pending', 'shipped', 'delivered'] as OrderStatus[]).map((s) => (
                          <button
                            key={s}
                            type="button"
                            className={`adm-status-btn${o.status === s ? ' active' : ''}`}
                            onClick={() => updateOrderStatus(o.id, s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <div className="adm-card">
          <p className="adm-empty">No orders match here. Place a test order from the storefront to see it flow in.</p>
        </div>
      )}
    </div>
  )
}
