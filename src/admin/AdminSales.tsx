import { useMemo, useState } from 'react'
import { useStore } from '../context/StoreContext'
import { categoryLabel, formatMkd, GENDER_LABELS } from '../data/products'
import { dayLabel, linePath } from './adminData'

const RANGES = [
  { key: 7, label: '7 days' },
  { key: 30, label: '30 days' },
  { key: 90, label: '90 days' },
] as const

type Range = (typeof RANGES)[number]['key']

export function AdminSales() {
  const { orders, products, categories, getStock } = useStore()
  const [range, setRange] = useState<Range>(30)

  const scoped = useMemo(() => {
    const since = new Date()
    since.setDate(since.getDate() - range)
    return orders.filter((o) => new Date(o.createdAt) >= since)
  }, [orders, range])

  const totals = useMemo(() => {
    const revenue = scoped.reduce((s, o) => s + o.totalMkd, 0)
    const units = scoped.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0)
    return {
      revenue,
      units,
      count: scoped.length,
      avg: scoped.length ? Math.round(revenue / scoped.length) : 0,
      discount: scoped.reduce((s, o) => s + o.discountMkd, 0),
    }
  }, [scoped])

  const daily = useMemo(() => {
    const days = Math.min(range, 30)
    const buckets = Array.from({ length: days }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (days - 1 - i))
      return { day: d.toISOString().slice(0, 10), total: 0, count: 0 }
    })
    scoped.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10)
      const b = buckets.find((x) => x.day === key)
      if (b) {
        b.total += o.totalMkd
        b.count += 1
      }
    })
    return buckets
  }, [scoped, range])

  const byProduct = useMemo(() => {
    const map = new Map<string, { name: string; units: number; revenue: number; image: string }>()
    scoped.forEach((o) =>
      o.items.forEach((i) => {
        const prod = products.find((p) => p.id === i.productId)
        const prev = map.get(i.name) ?? { name: i.name, units: 0, revenue: 0, image: prod?.image ?? '/products/shoe4.avif' }
        map.set(i.name, { ...prev, units: prev.units + i.quantity, revenue: prev.revenue + i.priceMkd * i.quantity })
      }),
    )
    return [...map.values()].sort((a, b) => b.revenue - a.revenue)
  }, [scoped, products])

  const byCategory = useMemo(() => {
    return categories
      .map((c) => {
        const list = products.filter((p) => p.category === c.slug)
        const revenue = byProduct.reduce((sum, row) => {
          const match = list.find((p) => p.name === row.name)
          return match ? sum + row.revenue : sum
        }, 0)
        return { slug: c.slug, label: categoryLabel(categories, c.slug, 'en'), revenue, count: list.length }
      })
      .sort((a, b) => b.revenue - a.revenue)
  }, [categories, products, byProduct])

  const byGender = useMemo(() => {
    return (['men', 'women', 'unisex'] as const).map((g) => {
      const list = products.filter((p) => p.gender === g)
      const revenue = byProduct.reduce((sum, row) => {
        const match = list.find((p) => p.name === row.name)
        return match ? sum + row.revenue : sum
      }, 0)
      return { key: g, label: GENDER_LABELS[g].en, revenue }
    })
  }, [products, byProduct])

  const maxDaily = Math.max(...daily.map((d) => d.total), 1)
  const totalCatRevenue = byCategory.reduce((s, c) => s + c.revenue, 0) || 1
  const totalGenderRevenue = byGender.reduce((s, g) => s + g.revenue, 0) || 1
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.sizes.reduce((a, size) => a + getStock(p.id, size) * p.priceMkd, 0),
    0,
  )

  const exportCsv = () => {
    const rows = [
      ['Order', 'Date', 'Customer', 'City', 'Items', 'Discount', 'Total MKD', 'Status'],
      ...scoped.map((o) => [
        o.id,
        new Date(o.createdAt).toLocaleDateString('en-GB'),
        o.customerName,
        o.city,
        String(o.items.reduce((a, i) => a + i.quantity, 0)),
        String(o.discountMkd),
        String(o.totalMkd),
        o.status,
      ]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `vyro-sales-${range}d.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Sales &amp; reports</h1>
          <p>Revenue, product performance and inventory value at a glance.</p>
        </div>
        <div className="adm-head-actions">
          <div className="adm-seg">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                className={range === r.key ? 'active' : ''}
                onClick={() => setRange(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="adm-kpis">
        <article className="adm-kpi">
          <span className="adm-kpi-label">Revenue</span>
          <strong className="adm-kpi-value">{formatMkd(totals.revenue)}</strong>
          <span className="adm-kpi-meta">last {range} days</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Orders</span>
          <strong className="adm-kpi-value">{totals.count}</strong>
          <span className="adm-kpi-meta">{totals.units} units sold</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Average order</span>
          <strong className="adm-kpi-value">{formatMkd(totals.avg)}</strong>
          <span className="adm-kpi-meta">{formatMkd(totals.discount)} in discounts</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Inventory value</span>
          <strong className="adm-kpi-value">{formatMkd(inventoryValue)}</strong>
          <span className="adm-kpi-meta">at retail price</span>
        </article>
      </div>

      <section className="adm-card adm-card--chart">
        <div className="adm-card-head">
          <div>
            <h2>Daily revenue</h2>
            <p>{range === 7 ? '7' : range === 30 ? '30' : '30 of 90'} most recent days</p>
          </div>
          <span className="adm-chip">{formatMkd(totals.revenue)}</span>
        </div>
        <div className="adm-bars" role="img" aria-label="Daily revenue">
          {daily.map((d) => (
            <div key={d.day} className="adm-bar-col">
              <span className="adm-bar-tip">{formatMkd(d.total)}</span>
              <div
                className="adm-bar"
                style={{ height: `${Math.max(4, (d.total / maxDaily) * 100)}%` }}
                title={`${dayLabel(d.day)}: ${formatMkd(d.total)}`}
              />
              <span className="adm-bar-label">{dayLabel(d.day).split(' ')[0]}</span>
            </div>
          ))}
        </div>
        {totals.revenue === 0 && <p className="adm-empty">No sales in this period yet.</p>}
      </section>

      <div className="adm-grid">
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Revenue by category</h2>
          </div>
          <div className="adm-mix">
            {byCategory.map((c) => (
              <div key={c.slug} className="adm-mix-row">
                <span className="adm-mix-label">{c.label}</span>
                <div className="adm-track">
                  <span
                    className="adm-track-fill adm-track-fill--lime"
                    style={{ width: `${(c.revenue / totalCatRevenue) * 100}%` }}
                  />
                </div>
                <strong>{formatMkd(c.revenue)}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Revenue by audience</h2>
          </div>
          <div className="adm-mix">
            {byGender.map((g) => (
              <div key={g.key} className="adm-mix-row">
                <span className={`adm-dot adm-dot--${g.key}`} />
                <span className="adm-mix-label">{g.label}</span>
                <div className="adm-track">
                  <span
                    className={`adm-track-fill adm-track-fill--${g.key}`}
                    style={{ width: `${(g.revenue / totalGenderRevenue) * 100}%` }}
                  />
                </div>
                <strong>{formatMkd(g.revenue)}</strong>
              </div>
            ))}
          </div>
          <div className="adm-spark-wrap" aria-hidden="true">
            <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="adm-spark-line">
              <path d={linePath(daily.map((d) => d.total / 1000))} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </section>
      </div>

      <section className="adm-card adm-table-card">
        <div className="adm-card-head">
          <h2>Product performance</h2>
          <span className="adm-chip">{byProduct.length} products sold</span>
        </div>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units</th>
                <th>Revenue</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {byProduct.map((p) => (
                <tr key={p.name}>
                  <td>
                    <div className="adm-prod-cell">
                      <img src={p.image} alt="" className="adm-thumb-sm" />
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td>{p.units}</td>
                  <td>
                    <strong>{formatMkd(p.revenue)}</strong>
                  </td>
                  <td>
                    <div className="adm-inline-track">
                      <div className="adm-track">
                        <span
                          className="adm-track-fill adm-track-fill--lime"
                          style={{ width: `${(p.revenue / (totals.revenue || 1)) * 100}%` }}
                        />
                      </div>
                      <span className="adm-muted">{Math.round((p.revenue / (totals.revenue || 1)) * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {byProduct.length === 0 && <p className="adm-empty">No product sales in this period.</p>}
      </section>
    </div>
  )
}
