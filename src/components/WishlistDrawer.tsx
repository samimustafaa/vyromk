import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatMkd } from '../data/products'
import { t } from '../i18n'
import { BagIcon, HeartIcon } from './Icons'

interface Props {
  open: boolean
  onClose: () => void
}

/** Slide-in wishlist panel, sharing the cart drawer's shell classes. */
export function WishlistDrawer({ open, onClose }: Props) {
  const { lang, wishlist, products, toggleWishlist, addToCart, getStock } = useStore()
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) setMounted(true)
    else {
      const id = window.setTimeout(() => setMounted(false), 260)
      return () => window.clearTimeout(id)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!mounted) return null

  const saved = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const quickSize = (product: (typeof saved)[number]) =>
    product.sizes.find((s) => getStock(product.id, s) > 0) ?? product.sizes[0]

  const moveAll = () => {
    saved.forEach((p) => addToCart(p, quickSize(p)))
  }

  return (
    <div className="drawer-backdrop wish-backdrop" onClick={onClose} role="presentation">
      <aside
        className="cart-drawer wish-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={t(lang, 'Омилени', 'Wishlist')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <h2 className="display-title drawer-title">{t(lang, 'Твои омилени', 'Your Wishlist', 'Lista jote e dëshirave')}</h2>
          </div>
          <button type="button" className="drawer-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {saved.length === 0 ? (
          <div className="empty-bag">
            <span className="saved-empty-icon">
              <HeartIcon />
            </span>
            <p className="empty-bag-title">{t(lang, 'Сè уште немаш омилени', 'Nothing saved yet')}</p>
            <p className="empty-bag-sub">
              {t(
                lang,
                'Кликни на срцето кај производот за да го зачуваш тука.',
                'Tap the heart on any product to save it here.',
                'Trokit zemrën te çdo produkt për ta ruajtur këtu.',
              )}
            </p>
            <button type="button" className="btn btn-lime" onClick={onClose}>
              {t(lang, 'Отвори продавница', 'Shop the drop', 'Blej koleksionin')}
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-body">
              {saved.map((p) => {
                const size = quickSize(p)
                const soldOut = p.sizes.every((s) => getStock(p.id, s) <= 0)
                return (
                  <div className="wish-line" key={p.id}>
                    <Link to={`/product/${p.slug}`} className="wish-thumb" onClick={onClose}>
                      <img src={p.image} alt={p.name} />
                    </Link>
                    <div className="wish-info">
                      <Link to={`/product/${p.slug}`} className="cart-item-name" onClick={onClose}>
                        {p.name}
                      </Link>
                      <span className="cart-item-meta">{p.colorway}</span>
                      <span className="cart-item-price">{formatMkd(p.priceMkd)}</span>
                      <div className="wish-actions">
                        <button
                          type="button"
                          className="btn btn-dark btn-xs"
                          disabled={soldOut}
                          onClick={() => addToCart(p, size)}
                        >
                          <BagIcon />
                          {soldOut
                            ? t(lang, 'Распродадено', 'Sold out', 'E shitur')
                            : t(lang, 'Додај во кошничка', 'Add to bag', 'Shto në çantë')}
                        </button>
                        <button
                          type="button"
                          className="link-btn"
                          onClick={() => toggleWishlist(p.id)}
                        >
                          {t(lang, 'Отстрани', 'Remove', 'Hiq')}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="drawer-footer wish-foot">
              <button type="button" className="btn btn-lime" onClick={moveAll}>
                {t(lang, 'Додај ги сите во кошничка', 'Add all to bag', 'Shto të gjitha në çantë')}
              </button>
              <Link to="/saved" className="wish-view-all" onClick={onClose}>
                {t(lang, 'Види ја целата листа', 'View the full list', 'Shiko listën e plotë')}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

/** Small helper for rendering the count pill next to a header icon. */
export function CountBadge({ count }: { count: number }): ReactNode {
  if (count <= 0) return null
  return <span className="bag-count">{count}</span>
}
