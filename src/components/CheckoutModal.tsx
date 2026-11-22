import { useState, type FormEvent } from 'react'
import { useStore } from '../context/StoreContext'
import { formatMkd } from '../data/products'
import { t } from '../i18n'

export function CheckoutModal() {
  const {
    lang,
    cart,
    checkoutOpen,
    setCheckoutOpen,
    totalMkd,
    appliedCode,
    discountMkd,
    recordOrder,
    clearCart,
    showToast,
  } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Skopje')
  const [address, setAddress] = useState('')
  const [orderRef, setOrderRef] = useState<string | null>(null)

  if (!checkoutOpen) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) return
    const ref = `VYRO-${Math.floor(1000 + Math.random() * 9000)}`
    recordOrder({
      id: ref,
      customerName: name.trim(),
      phone: phone.trim(),
      city,
      address: address.trim(),
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        size: item.size,
        quantity: item.quantity,
        priceMkd: item.product.priceMkd,
      })),
      discountCode: appliedCode ?? undefined,
      discountMkd,
      totalMkd,
    })
    setOrderRef(ref)
    clearCart()
    showToast(t(lang, `Нарачката ${ref} е примена!`, `Order ${ref} confirmed!`))
  }

  const handleClose = () => {
    setCheckoutOpen(false)
    setOrderRef(null)
  }

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="checkout-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t(lang, 'Брза нарачка', 'Fast Checkout')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2 className="display-title drawer-title">
            {orderRef
              ? t(lang, 'Нарачката е потврдена', 'Order Confirmed')
              : t(lang, 'Брза нарачка', 'Fast Checkout')}
          </h2>
          <button type="button" className="drawer-close" onClick={handleClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        {orderRef ? (
          <div className="order-success">
            <div className="order-ref-badge">{orderRef}</div>
            <p className="order-success-lead">
              {t(lang, `Ти благодариме, ${name}! Твојата нарачка ќе биде испратена во рок од 24–48 часа во ${city}. Плаќаш директно на курирот при достава.`, `Thank you, ${name}! Your order will ship within 24–48h to ${city}. Pay directly to the courier on delivery.`)}
            </p>
            <p className="order-success-sub">
              {t(lang, 'За промена на број или прашања, пиши ни на @vyro.mk.', 'Need a size swap or update? Message us anytime at @vyro.mk.')}
            </p>
            <button type="button" className="btn btn-lime full-width" onClick={handleClose}>
              {t(lang, 'Продолжи со разгледување', 'Back to store')}
            </button>
          </div>
        ) : (
          <form className="checkout-form" onSubmit={handleSubmit}>
            <p className="checkout-note">
              {t(lang, `Плаќање при достава • Вкупно: ${formatMkd(totalMkd)} (${cart.reduce((s, i) => s + i.quantity, 0)} производи)`, `Cash on delivery • Total: ${formatMkd(totalMkd)} (${cart.reduce((s, i) => s + i.quantity, 0)} items)`)}
            </p>

            <label className="field">
              <span>{t(lang, 'Име и презиме', 'Full name')}</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(lang, 'Марко Петровски', 'Marko Petrovski')}
              />
            </label>

            <label className="field">
              <span>{t(lang, 'Телефонски број', 'Phone number')}</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+389 7X XXX XXX"
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>{t(lang, 'Град', 'City')}</span>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="Skopje">Skopje / Скопје</option>
                  <option value="Bitola">Bitola / Битола</option>
                  <option value="Tetovo">Tetovo / Тетово</option>
                  <option value="Kumanovo">Kumanovo / Куманово</option>
                  <option value="Ohrid">Ohrid / Охрид</option>
                  <option value="Prilep">Prilep / Прилеп</option>
                  <option value="Stip">Štip / Штип</option>
                  <option value="Strumica">Strumica / Струмица</option>
                  <option value="Other">Other / Друг град</option>
                </select>
              </label>

              <label className="field">
                <span>{t(lang, 'Адреса', 'Street address')}</span>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t(lang, 'Ул. Партизанска бр. 14', 'Partizanska 14')}
                />
              </label>
            </div>

            <button type="submit" className="btn btn-lime full-width">
              {t(lang, 'Потврди нарачка', 'Confirm Order')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
