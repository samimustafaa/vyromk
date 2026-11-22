export function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="icon-heart" aria-hidden="true">
      <path
        d="M12 20.4l-1.45-1.32C5.4 14.5 2 11.4 2 7.6 2 4.6 4.3 2.4 7.2 2.4c1.7 0 3.4.8 4.8 2.4 1.4-1.6 3.1-2.4 4.8-2.4 2.9 0 5.2 2.2 5.2 5.2 0 3.8-3.4 6.9-8.55 11.5L12 20.4z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.8}
      />
    </svg>
  )
}

export function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon-bag" aria-hidden="true">
      <path
        d="M6 7h12l1.2 13H4.8L6 7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M9 9V6a3 3 0 016 0v3" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

/* ---------- Trust strip icons ---------- */

const TRUST_STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function TruckIcon() {
  return (
    <svg viewBox="0 0 32 32" className="trust-svg" aria-hidden="true">
      <g {...TRUST_STROKE}>
        <path d="M3 9h13v12H3z" />
        <path d="M16 13h5.2l3.8 4v4h-9z" />
        <path d="M5.5 13.5h7M5.5 17h4.5" />
        <circle cx="9" cy="23" r="2.4" className="trust-wheel" />
        <circle cx="22" cy="23" r="2.4" className="trust-wheel" />
      </g>
    </svg>
  )
}

export function CashIcon() {
  return (
    <svg viewBox="0 0 32 32" className="trust-svg" aria-hidden="true">
      <g {...TRUST_STROKE}>
        <rect x="3.5" y="8.5" width="20" height="13" rx="2.2" />
        <circle cx="13.5" cy="15" r="3.2" className="trust-coin" />
        <path d="M6.5 12.2v0M20.5 17.8v0" strokeWidth="2.4" />
        <path d="M22.5 19.5h4.2a2 2 0 012 2v2.4a2 2 0 01-2 2h-9" />
        <path d="M20.6 22.4l-1.8 1.5 1.8 1.5" />
      </g>
    </svg>
  )
}

export function ExchangeIcon() {
  return (
    <svg viewBox="0 0 32 32" className="trust-svg" aria-hidden="true">
      <g {...TRUST_STROKE}>
        <path d="M6 11h14.5" />
        <path d="M17.8 8.2L21 11l-3.2 2.8" className="trust-arrow-top" />
        <path d="M26 21H11.5" />
        <path d="M14.2 18.2L11 21l3.2 2.8" className="trust-arrow-bottom" />
      </g>
    </svg>
  )
}

export function PriceTagIcon() {
  return (
    <svg viewBox="0 0 32 32" className="trust-svg" aria-hidden="true">
      <g {...TRUST_STROKE}>
        <path d="M16.6 4.5h7.2a2 2 0 012 2v7.2a2 2 0 01-.6 1.4L14.6 25.7a2 2 0 01-2.8 0l-5.5-5.5a2 2 0 010-2.8L16.6 5.1a2 2 0 011.4-.6z" />
        <circle cx="21.2" cy="9.6" r="1.8" className="trust-tag-hole" />
        <path d="M11 17.5l3.5 3.5" />
      </g>
    </svg>
  )
}
