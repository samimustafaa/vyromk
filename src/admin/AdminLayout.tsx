import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const ADMIN_PIN = '0061'
const ADMIN_SESSION_KEY = 'vyro_admin_unlocked'

/* ---------- Sidebar icons ---------- */

const I = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="adm-nav-icon" aria-hidden="true">
      <g {...I}>{children}</g>
    </svg>
  )
}

const icons = {
  dashboard: (
    <Icon>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </Icon>
  ),
  sales: (
    <Icon>
      <path d="M3 20V9M9 20V4M15 20v-7M21 20V7" />
    </Icon>
  ),
  products: (
    <Icon>
      <path d="M20.5 7.5l-8.5-4.5-8.5 4.5v9l8.5 4.5 8.5-4.5z" />
      <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9.5" />
    </Icon>
  ),
  categories: (
    <Icon>
      <path d="M3.5 6.5A2 2 0 015.5 4.5h3l2 2.5h8a2 2 0 012 2v8a2 2 0 01-2 2h-13a2 2 0 01-2-2z" />
    </Icon>
  ),
  inventory: (
    <Icon>
      <path d="M4 8.5L12 4l8 4.5M4 8.5v7L12 20l8-4.5v-7" />
      <path d="M8 6.2l8 4.6v5.6M12 11v9" />
    </Icon>
  ),
  orders: (
    <Icon>
      <path d="M5.5 4.5h13v15l-2.2-1.6-2.2 1.6-2.1-1.6-2.2 1.6-2.1-1.6z" />
      <path d="M8.5 9h7M8.5 13h4.5" />
    </Icon>
  ),
  discounts: (
    <Icon>
      <path d="M13 3.5h5.5a2 2 0 012 2V11a2 2 0 01-.6 1.4L11 20.4a2 2 0 01-2.8 0L3.6 15.8a2 2 0 010-2.8L11.6 4a2 2 0 011.4-.5z" />
      <circle cx="16.5" cy="7.5" r="1.4" />
    </Icon>
  ),
  reviews: (
    <Icon>
      <path d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z" />
    </Icon>
  ),
  customers: (
    <Icon>
      <circle cx="9.5" cy="8.5" r="3.3" />
      <path d="M3.5 20.2c0-3.1 2.7-5.2 6-5.2s6 2.1 6 5.2" />
      <path d="M16.5 5.6a3.2 3.2 0 010 6.2M18 15.3c1.7.7 2.9 2.1 2.9 4.1" />
    </Icon>
  ),
  settings: (
    <Icon>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 14.5a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1.03 1.56V21a2 2 0 11-4 0v-.11a1.7 1.7 0 00-1.1-1.56 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.56-1.03H3a2 2 0 110-4h.11A1.7 1.7 0 004.67 9.4a1.7 1.7 0 00-.34-1.87l-.06-.06A2 2 0 117.1 4.64l.06.06a1.7 1.7 0 001.87.34H9.1a1.7 1.7 0 001.03-1.56V3a2 2 0 114 0v.11a1.7 1.7 0 001.03 1.56 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87v.06a1.7 1.7 0 001.56 1.03H21a2 2 0 110 4h-.11a1.7 1.7 0 00-1.49 1.03z" />
    </Icon>
  ),
}

const NAV: { to: string; label: string; icon: keyof typeof icons; end?: boolean }[] = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/sales', label: 'Sales & Reports', icon: 'sales' },
  { to: '/admin/products', label: 'Products', icon: 'products' },
  { to: '/admin/categories', label: 'Categories', icon: 'categories' },
  { to: '/admin/inventory', label: 'Inventory', icon: 'inventory' },
  { to: '/admin/orders', label: 'Orders', icon: 'orders' },
  { to: '/admin/discounts', label: 'Discounts', icon: 'discounts' },
  { to: '/admin/reviews', label: 'Reviews', icon: 'reviews' },
  { to: '/admin/customers', label: 'Customers', icon: 'customers' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
]

export function AdminLayout() {
  const { products, orders, categories } = useStore()
  const location = useLocation()
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
    } catch {
      return false
    }
  })
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [mobileNav, setMobileNav] = useState(false)

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault()
    if (attempts >= 5) {
      setError('Too many failed attempts. Refresh to try again.')
      return
    }
    if (pin.trim() === ADMIN_PIN) {
      setUnlocked(true)
      setError(null)
      setPin('')
      setAttempts(0)
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
      } catch {}
    } else {
      setAttempts((a) => a + 1)
      setError('Incorrect access code.')
      setPin('')
    }
  }

  const handleLock = () => {
    setUnlocked(false)
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY)
    } catch {}
  }

  if (!unlocked) {
    return (
      <div className="adm-lock">
        <form className="adm-lock-card" onSubmit={handleUnlock}>
          <div className="adm-lock-brand">
            <span className="adm-logo-mark">V</span>
            <div>
              <strong>VYRO MK</strong>
              <span>Store Console</span>
            </div>
          </div>
          <h1>Private access</h1>
          <p>Enter the 4-digit code to open the store console.</p>
          <label className="adm-field">
            <span>Access code</span>
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              autoComplete="off"
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              aria-label="Admin access code"
            />
          </label>
          {error && <p className="adm-error">{error}</p>}
          <button type="submit" className="adm-btn adm-btn--lime" disabled={attempts >= 5}>
            Unlock console
          </button>
          <Link to="/" className="adm-lock-back">← Back to storefront</Link>
        </form>
      </div>
    )
  }

  const current = NAV.find((n) => (n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)))
  const pending = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="adm-shell">
      <aside className={`adm-sidebar${mobileNav ? ' open' : ''}`}>
        <div className="adm-sidebar-head">
          <Link to="/admin" className="adm-brand" onClick={() => setMobileNav(false)}>
            <span className="adm-logo-mark">V</span>
            <div>
              <strong>VYRO MK</strong>
              <span>Store Console</span>
            </div>
          </Link>
          <button
            type="button"
            className="adm-nav-close"
            onClick={() => setMobileNav(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="adm-nav" aria-label="Admin sections">
          <p className="adm-nav-label">Manage</p>
          {NAV.slice(0, 6).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setMobileNav(false)}
            >
              {icons[item.icon]}
              <span>{item.label}</span>
              {item.icon === 'orders' && pending > 0 && <em className="adm-nav-badge">{pending}</em>}
            </NavLink>
          ))}
          <p className="adm-nav-label">Grow</p>
          {NAV.slice(6).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setMobileNav(false)}
            >
              {icons[item.icon]}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="adm-sidebar-foot">
          <div className="adm-sidebar-stats">
            <div>
              <span>Products</span>
              <strong>{products.length}</strong>
            </div>
            <div>
              <span>Categories</span>
              <strong>{categories.length}</strong>
            </div>
          </div>
          <Link to="/" className="adm-side-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-8.5 8.5M18 14v5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 014 19V8a1.5 1.5 0 011.5-1.5H10" {...I} />
            </svg>
            View storefront
          </Link>
          <button type="button" className="adm-side-link" onClick={handleLock}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g {...I}>
                <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
                <path d="M8 10.5V7.8a4 4 0 018 0v2.7" />
              </g>
            </svg>
            Lock console
          </button>
        </div>
      </aside>

      {mobileNav && <div className="adm-scrim" onClick={() => setMobileNav(false)} />}

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            type="button"
            className="adm-burger"
            onClick={() => setMobileNav(true)}
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="adm-topbar-title">
            <span>Console</span>
            <h2>{current?.label ?? 'Dashboard'}</h2>
          </div>
          <div className="adm-topbar-actions">
            <span className="adm-live">
              <i /> Live
            </span>
            <span className="adm-topbar-date">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <Link to="/" className="adm-btn adm-btn--ghost adm-btn--sm">Storefront</Link>
          </div>
        </header>

        <main className="adm-content" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
