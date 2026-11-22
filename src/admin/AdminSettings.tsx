import { useState, type FormEvent } from 'react'
import { useStore } from '../context/StoreContext'
import { formatMkd, FREE_SHIPPING_MKD } from '../data/products'

export function AdminSettings() {
  const { settings, updateSettings, resetProducts, showToast, products, orders, subscribers, reviews } = useStore()
  const [bannerEn, setBannerEn] = useState(settings.promoBannerEn)
  const [bannerMk, setBannerMk] = useState(settings.promoBannerMk)
  const [freeShip, setFreeShip] = useState(String(settings.freeShippingMkd))
  const [saved, setSaved] = useState(false)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    updateSettings({
      promoBannerEn: bannerEn.trim(),
      promoBannerMk: bannerMk.trim(),
      freeShippingMkd: Math.max(0, Number(freeShip) || 0),
    })
    setSaved(true)
    showToast('Store settings saved')
    window.setTimeout(() => setSaved(false), 2200)
  }

  const resetBanner = () => {
    setBannerEn('Free delivery over 3.500 MKD · Cash on delivery across Macedonia')
    setBannerMk('Бесплатна достава над 3.500 ден · Плаќање при достава низ Македонија')
    setFreeShip(String(FREE_SHIPPING_MKD))
  }

  const backup = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      products,
      orders,
      subscribers,
      reviews,
      settings,
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'vyro-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Settings</h1>
          <p>Storefront banner, delivery thresholds and store data tools.</p>
        </div>
      </div>

      <div className="adm-grid adm-grid--sidebar">
        <form className="adm-card adm-form" onSubmit={handleSave}>
          <div className="adm-card-head">
            <h2>Storefront messages</h2>
            <span className="adm-chip">Shown site-wide</span>
          </div>

          <label className="adm-field">
            <span>Promo banner (EN)</span>
            <input value={bannerEn} onChange={(e) => setBannerEn(e.target.value)} maxLength={120} />
          </label>
          <label className="adm-field">
            <span>Promo banner (MK)</span>
            <input value={bannerMk} onChange={(e) => setBannerMk(e.target.value)} maxLength={120} />
          </label>
          <label className="adm-field">
            <span>Free delivery threshold (MKD)</span>
            <input type="number" min="0" step="100" value={freeShip} onChange={(e) => setFreeShip(e.target.value)} />
          </label>
          <p className="adm-hint">
            Current threshold: {formatMkd(Math.max(0, Number(freeShip) || 0))}. Carts above this ship free.
          </p>

          <div className="adm-form-actions">
            <button type="submit" className="adm-btn adm-btn--lime">
              {saved ? 'Saved ✓' : 'Save settings'}
            </button>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={resetBanner}>
              Reset to defaults
            </button>
          </div>
        </form>

        <div className="adm-stack">
          <section className="adm-card">
            <div className="adm-card-head">
              <h2>Store snapshot</h2>
            </div>
            <ul className="adm-kv">
              <li>
                <span>Products</span>
                <strong>{products.length}</strong>
              </li>
              <li>
                <span>Orders</span>
                <strong>{orders.length}</strong>
              </li>
              <li>
                <span>Subscribers</span>
                <strong>{subscribers.length}</strong>
              </li>
              <li>
                <span>Reviews</span>
                <strong>{reviews.length}</strong>
              </li>
            </ul>
          </section>

          <section className="adm-card">
            <div className="adm-card-head">
              <h2>Data tools</h2>
            </div>
            <p className="adm-hint">
              The console stores its data in this browser. Export a backup before clearing your browser data.
            </p>
            <div className="adm-form-actions">
              <button type="button" className="adm-btn adm-btn--ghost" onClick={backup}>
                Download backup
              </button>
              <button
                type="button"
                className="adm-btn adm-btn--danger"
                onClick={() => {
                  if (window.confirm('Reset all products to the original VYRO MK catalog?')) resetProducts()
                }}
              >
                Reset products
              </button>
            </div>
          </section>

          <section className="adm-card adm-card--about">
            <div className="adm-logo-mark">V</div>
            <div>
              <strong>VYRO MK Store Console</strong>
              <p>Private admin · Build 1.0 · Your Style. Your Move.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
