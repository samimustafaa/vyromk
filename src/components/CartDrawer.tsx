import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatMkd } from '../data/products'
import { t } from '../i18n'

export function CartDrawer() {
  const {
    lang,
    cart,
    cartOpen,
    setCartOpen,
    updateQty,
    removeFromCart,
    subtotalMkd,
    discountMkd,
    appliedCode,
    applyPromoCode,
    removePromoCode,
    shippingMkd,
    totalMkd,
    settings,
    setCheckoutOpen,
    showToast,
  } = useStore()
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState<string | null>(null)

  if (!cartOpen) return null

  const afterDiscount = Math.max(0, subtotalMkd - discountMkd)
  const remainingForFree = Math.max(0, settings.freeShippingMkd - afterDiscount)
  const progressPct = Math.min(100, Math.round((afterDiscount / settings.freeShippingMkd) * 100))

  const handlePromo = (e: FormEvent) => {
    e.preventDefault()
    const res = applyPromoCode(promoInput)
    if (res.ok) {
      setPromoError(null)
      setPromoInput('')
    } else {
      setPromoError(res.message)
    }
  }

  const handleCopyDmOrder = () => {
    const lines = cart.map(
      (item) =>
        `• ${item.product.name} (Size ${item.size}) x${item.quantity} — ${formatMkd(item.product.priceMkd * item.quantity)}`,
    )
    const msg = [
      'VYRO MK Order:',
      ...lines,
      ...(appliedCode && discountMkd > 0 ? [`Promo (${appliedCode}): -${formatMkd(discountMkd)}`] : []),
      `Delivery: ${shippingMkd === 0 ? 'FREE' : formatMkd(shippingMkd)}`,
      `Total: ${formatMkd(totalMkd)}`,
    ].join('\n')

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(msg).catch(() => {})
    }
    showToast(
      t(lang, 'Нарачката е копирана! Испрати порака на @vyro.mk', 'Order copied! Paste in DM to @vyro.mk'),
    )
  }

  return (
    <div className="drawer-backdrop" onClick={() => setCartOpen(false)}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t(lang, 'Кошничка', 'Shopping bag')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2 className="display-title drawer-title">
            {t(lang, 'Твоја кошничка', 'Your Bag')}
          </h2>
          <button
            type="button"
            className="drawer-close"
            onClick={() => setCartOpen(false)}
            aria-label="Close bag"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {cart.length > 0 && (
          <div className="shipping-bar">
            <p className="shipping-bar-text">
              {remainingForFree === 0
                ? t(lang, 'Отклучена е бесплатна достава!', 'You unlocked free delivery!')
                : t(lang, `Уште ${formatMkd(remainingForFree)} до бесплатна достава`, `Add ${formatMkd(remainingForFree)} more for free delivery`, `Shto ${formatMkd(remainingForFree)} më shumë për dërgim falas`)}
            </p>
            <div className="shipping-track">
              <div className="shipping-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty-bag">
              <p className="empty-bag-title">
                {t(lang, 'Кошничката е празна', 'Your bag is empty')}
              </p>
              <p className="empty-bag-sub">
                {t(lang, 'Одбери ги твоите омилени патики или парчиња облека.', 'Explore the latest sneakers and streetwear drops.')}
              </p>
              <Link to="/shop" className="btn btn-lime" onClick={() => setCartOpen(false)}>
                {t(lang, 'Отвори продавница', 'Shop the drop')}
              </Link>
            </div>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={`${item.product.id}-${item.size}`} className="cart-item">
                  <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <span className="cart-item-name">{item.product.name}</span>
                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                    <span className="cart-item-meta">
                      {t(lang, 'Број', 'Size')}: {item.size}
                    </span>
                    <div className="cart-item-bottom">
                      <div className="qty-stepper">
                        <button
                          type="button"
                          onClick={() => updateQty(item.product.id, item.size, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.product.id, item.size, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-price">
                        {formatMkd(item.product.priceMkd * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <form className="promo-form" onSubmit={handlePromo}>
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder={t(lang, 'Промо код (пр. VYRO10)', 'Promo code (e.g. VYRO10)')}
                aria-label="Promo code"
              />
              <button type="submit" className="btn btn-outline-light promo-apply-btn">
                {t(lang, 'Примени', 'Apply')}
              </button>
            </form>
            {promoError && <p className="promo-error">{promoError}</p>}

            <div className="summary-row">
              <span>{t(lang, 'Вкупно производи', 'Subtotal')}</span>
              <span>{formatMkd(subtotalMkd)}</span>
            </div>
            {appliedCode && discountMkd > 0 && (
              <div className="summary-row summary-discount">
                <span>
                  {t(lang, 'Попуст', 'Discount')} ({appliedCode}){' '}
                  <button type="button" className="remove-code-btn" onClick={removePromoCode} aria-label="Remove promo code">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                </span>
                <span>−{formatMkd(discountMkd)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>{t(lang, 'Достава', 'Delivery')}</span>
              <span>
                {shippingMkd === 0 ? (t(lang, 'Бесплатна', 'Free')) : formatMkd(shippingMkd)}
              </span>
            </div>
            <div className="summary-row summary-total">
              <span>{t(lang, 'Вкупно за плаќање', 'Total')}</span>
              <span>{formatMkd(totalMkd)}</span>
            </div>

            <button
              type="button"
              className="btn btn-lime full-width"
              onClick={() => {
                setCartOpen(false)
                setCheckoutOpen(true)
              }}
            >
              {t(lang, 'Нарачај (Плаќање при достава)', 'Checkout — Cash on Delivery')}
            </button>

            <button
              type="button"
              className="btn btn-outline-light full-width"
              onClick={handleCopyDmOrder}
            >
              {t(lang, 'Копирај за нарачка во порака (@vyro.mk)', 'Copy Order for Instagram DM')}
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
