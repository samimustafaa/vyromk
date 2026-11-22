export const PRESET_IMAGES = [
  { label: 'Pulse 90 Sneaker', value: '/products/hero.avif' },
  { label: 'Court High Sneaker', value: '/products/shoe4.avif' },
  { label: 'Air Mono White', value: '/products/shoe7.avif' },
  { label: 'Stealth Black Runner', value: '/products/shoe9.avif' },
  { label: 'Crimson Knit', value: '/products/shoe1.avif' },
  { label: 'Sunset Low', value: '/products/shoe2.avif' },
  { label: 'Sand Force', value: '/products/shoe5.avif' },
  { label: 'Studio Clean', value: '/products/shoe8.avif' },
  { label: 'Heavyweight Hoodie', value: '/products/hoodie.avif' },
  { label: 'Core Oversized Tee', value: '/products/tee.avif' },
  { label: 'Night Rider Jacket', value: '/products/jacket.avif' },
  { label: 'Utility Backpack', value: '/products/bag.avif' },
  { label: 'Street Lookbook', value: '/products/street.avif' },
  { label: 'Studio Lookbook', value: '/products/look.avif' },
]

export function shortMkd(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1000) return `${Math.round(amount / 1000)}k`
  return String(amount)
}

/** Build a simple sparkline path for a numeric series. */
export function linePath(values: number[], width = 100, height = 32): string {
  if (values.length === 0) return ''
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const span = max - min || 1
  const step = values.length > 1 ? width / (values.length - 1) : width
  return values
    .map((v, i) => {
      const x = i * step
      const y = height - ((v - min) / span) * height
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

export function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function dayLabel(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}
