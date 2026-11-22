import { useState, type FormEvent } from 'react'
import { useStore } from '../context/StoreContext'
import { Dropdown } from './Dropdown'
import { formatMkd } from '../data/products'

export function AdminDiscounts() {
  const { discounts, addDiscount, toggleDiscount, deleteDiscount, orders } = useStore()
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percent' | 'fixed'>('percent')
  const [value, setValue] = useState('10')
  const [error, setError] = useState<string | null>(null)

  const totalRedeemed = orders.reduce((s, o) => s + (o.discountCode ? 1 : 0), 0)
  const totalGiven = orders.reduce((s, o) => s + o.discountMkd, 0)

  const handleAdd = (e: FormEvent) => {
    e.preventDefault()
    const num = Number(value)
    if (!code.trim()) return
    if (!num || num <= 0) {
      setError('Enter a discount greater than zero.')
      return
    }
    if (type === 'percent' && num > 90) {
      setError('Percent discounts are capped at 90%.')
      return
    }
    if (discounts.some((d) => d.code === code.trim().toUpperCase())) {
      setError('That code already exists.')
      return
    }
    addDiscount({ code: code.trim().toUpperCase(), type, value: num, active: true })
    setCode('')
    setValue('10')
    setError(null)
  }

  const usage = (discountCode: string) => orders.filter((o) => o.discountCode === discountCode).length

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Discounts</h1>
          <p>Promo codes customers can apply in the cart.</p>
        </div>
        <span className="adm-chip">{discounts.filter((d) => d.active).length} active</span>
      </div>

      <div className="adm-kpis">
        <article className="adm-kpi">
          <span className="adm-kpi-label">Codes</span>
          <strong className="adm-kpi-value">{discounts.length}</strong>
          <span className="adm-kpi-meta">in the system</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Redemptions</span>
          <strong className="adm-kpi-value">{totalRedeemed}</strong>
          <span className="adm-kpi-meta">orders used a code</span>
        </article>
        <article className="adm-kpi">
          <span className="adm-kpi-label">Discount given</span>
          <strong className="adm-kpi-value">{formatMkd(totalGiven)}</strong>
          <span className="adm-kpi-meta">lifetime</span>
        </article>
      </div>

      <div className="adm-grid adm-grid--sidebar">
        <div className="adm-card adm-table-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Value</th>
                  <th>Used</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {discounts.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <code className="adm-code">{d.code}</code>
                    </td>
                    <td>
                      <strong>{d.type === 'percent' ? `${d.value}% off` : `${formatMkd(d.value)} off`}</strong>
                    </td>
                    <td>{usage(d.code)} orders</td>
                    <td>
                      <span className={`adm-pill ${d.active ? 'adm-pill--ok' : 'adm-pill--out'}`}>
                        {d.active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <button type="button" className="adm-btn adm-btn--xs adm-btn--ghost" onClick={() => toggleDiscount(d.id)}>
                          {d.active ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          className="adm-icon-btn adm-icon-btn--danger"
                          title="Delete code"
                          onClick={() => deleteDiscount(d.id)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {discounts.length === 0 && <p className="adm-empty">No discount codes yet.</p>}
        </div>

        <form className="adm-card adm-form" onSubmit={handleAdd}>
          <div className="adm-card-head">
            <h2>New code</h2>
          </div>
          <label className="adm-field">
            <span>Code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="VYRO10"
              required
            />
          </label>
          <div className="adm-field">
            <span>Type</span>
            <Dropdown
              value={type}
              onChange={(v) => setType(v as 'percent' | 'fixed')}
              label="Discount type"
              options={[
                { value: 'percent', label: 'Percentage off', hint: 'e.g. 10 → 10% off' },
                { value: 'fixed', label: 'Fixed amount (MKD)', hint: 'e.g. 500 → 500 MKD off' },
              ]}
            />
          </div>
          <label className="adm-field">
            <span>{type === 'percent' ? 'Percent' : 'Amount (MKD)'}</span>
            <input type="number" min="1" value={value} onChange={(e) => setValue(e.target.value)} required />
          </label>
          {error && <p className="adm-error">{error}</p>}
          <button type="submit" className="adm-btn adm-btn--lime">
            Create code
          </button>
        </form>
      </div>
    </div>
  )
}
