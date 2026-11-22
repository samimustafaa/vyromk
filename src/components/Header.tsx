import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { HeartIcon, BagIcon } from './Icons'
import { categoryLabel } from '../data/products'
import { LANGS } from '../i18n'
import { t } from '../i18n'

export function Header() {
  const { lang, setLang, cartCount, setCartOpen, settings, wishlist, categories } = useStore()
  const { setWishOpen } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t(lang, 'Почетна', 'Home') },
    { to: '/shop?gender=men', label: t(lang, 'Мажи', 'Men') },
    { to: '/shop?gender=women', label: t(lang, 'Жени', 'Women') },
    { to: '/shop', label: t(lang, 'Сите', 'Shop All') },
    ...categories.map((c) => ({
      to: `/shop?category=${c.slug}`,
      label: categoryLabel(categories, c.slug, lang),
    })),
    { to: '/about', label: t(lang, 'За нас', 'About') },
  ]

  return (
    <header className="site-header">
      <div className="promo-bar">
        <div className="container promo-bar-inner">
          <span>{t(lang, settings.promoBannerMk, settings.promoBannerEn, settings.promoBannerSq)}</span>
          <span className="promo-handle">
            {wishlist.length > 0 && (
              <span className="promo-heart">
                <HeartIcon filled /> {wishlist.length} •
              </span>
            )}{' '}
            @vyro.mk
          </span>
        </div>
      </div>

      <div className="container header-inner">
        <Link to="/" className="brand-mark" onClick={() => setMenuOpen(false)}>
          <span className="brand-name">VYRO</span>
          <span className="brand-mk">MK</span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((item) => {
            const active =
              item.to === '/'
                ? location.pathname === '/'
                : location.pathname + location.search === item.to ||
                  (item.to === '/shop' && location.pathname === '/shop' && !location.search)
            return (
              <Link key={item.to} to={item.to} className={`nav-link${active ? ' active' : ''}`}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="header-actions">
          <div className="lang-switch" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`lang-btn${lang === l.code ? ' active' : ''}`}
                onClick={() => setLang(l.code)}
                title={l.label}
                aria-pressed={lang === l.code}
              >
                {l.short}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="wish-trigger"
            onClick={() => setWishOpen(true)}
            aria-label={t(lang, 'Отвори омилени', 'Open wishlist', 'Hap listën e dëshirave')}
          >
            <HeartIcon filled={wishlist.length > 0} />
            {wishlist.length > 0 && <span className="bag-count wish-count">{wishlist.length}</span>}
          </button>

          <button
            type="button"
            className="bag-trigger"
            onClick={() => setCartOpen(true)}
            aria-label={t(lang, 'Отвори кошничка', 'Open shopping bag')}
          >
            <BagIcon />
            <span>{t(lang, 'Кошничка', 'Bag')}</span>
            <span className="bag-count">{cartCount}</span>
          </button>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="container mobile-nav-inner">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
