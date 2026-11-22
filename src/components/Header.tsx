import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { HeartIcon, BagIcon } from './Icons'

export function Header() {
  const { lang, setLang, cartCount, setCartOpen, settings, wishlist, categories } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: lang === 'mk' ? 'Почетна' : 'Home' },
    { to: '/shop?gender=men', label: lang === 'mk' ? 'Мажи' : 'Men' },
    { to: '/shop?gender=women', label: lang === 'mk' ? 'Жени' : 'Women' },
    { to: '/shop', label: lang === 'mk' ? 'Сите' : 'Shop All' },
    ...categories.map((c) => ({
      to: `/shop?category=${c.slug}`,
      label: lang === 'mk' ? c.labelMk : c.labelEn,
    })),
    { to: '/about', label: lang === 'mk' ? 'За нас' : 'About' },
  ]

  return (
    <header className="site-header">
      <div className="promo-bar">
        <div className="container promo-bar-inner">
          <span>{lang === 'mk' ? settings.promoBannerMk : settings.promoBannerEn}</span>
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
            <button
              type="button"
              className={`lang-btn${lang === 'en' ? ' active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn${lang === 'mk' ? ' active' : ''}`}
              onClick={() => setLang('mk')}
            >
              MK
            </button>
          </div>

          <button
            type="button"
            className="bag-trigger"
            onClick={() => setCartOpen(true)}
            aria-label={lang === 'mk' ? 'Отвори кошничка' : 'Open shopping bag'}
          >
            <BagIcon />
            <span>{lang === 'mk' ? 'Кошничка' : 'Bag'}</span>
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
