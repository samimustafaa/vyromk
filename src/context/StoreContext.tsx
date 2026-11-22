import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_LANG, t, type Lang as LangT } from '../i18n'
import {
  DEFAULT_CATEGORIES,
  FREE_SHIPPING_MKD,
  PRODUCTS,
  SHIPPING_FEE_MKD,
  type CategoryDef,
  type Product,
} from '../data/products'

export type { Lang } from '../i18n'

export interface CartItem {
  product: Product
  size: string
  quantity: number
}

export interface DiscountCode {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  active: boolean
}

export interface OrderItem {
  productId?: string
  name: string
  size: string
  quantity: number
  priceMkd: number
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered'

export interface StoreOrder {
  id: string
  createdAt: string
  customerName: string
  phone: string
  city: string
  address: string
  items: OrderItem[]
  discountCode?: string
  discountMkd: number
  totalMkd: number
  status: OrderStatus
}

export interface SiteSettings {
  promoBannerEn: string
  promoBannerMk: string
  promoBannerSq?: string
  freeShippingMkd: number
}

export interface Review {
  id: string
  productId: string
  name: string
  rating: number
  text: string
  createdAt: string
}

export type Stock = Record<string, number>

interface StoreContextValue {
  lang: LangT
  setLang: (lang: LangT) => void
  products: Product[]
  categories: CategoryDef[]
  addCategory: (category: Omit<CategoryDef, 'slug'>) => boolean
  updateCategory: (slug: string, patch: Partial<CategoryDef>) => void
  deleteCategory: (slug: string) => boolean
  categoryInUse: (slug: string) => number
  addProduct: (product: Product) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  deleteProduct: (id: string) => void
  resetProducts: () => void
  stock: Stock
  getStock: (productId: string, size: string) => number
  setStock: (productId: string, size: string, qty: number) => void
  productStockTotal: (product: Product) => number
  discounts: DiscountCode[]
  addDiscount: (discount: Omit<DiscountCode, 'id'>) => void
  toggleDiscount: (id: string) => void
  deleteDiscount: (id: string) => void
  appliedCode: string | null
  applyPromoCode: (rawCode: string) => { ok: boolean; message: string }
  removePromoCode: () => void
  discountMkd: number
  orders: StoreOrder[]
  recordOrder: (order: Omit<StoreOrder, 'createdAt' | 'status'>) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  findOrder: (id: string) => StoreOrder | undefined
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  deleteReview: (id: string) => void
  reviewSummary: (productId: string) => { average: number; count: number }
  recentlyViewed: string[]
  addRecentlyViewed: (productId: string) => void
  subscribers: string[]
  addSubscriber: (email: string) => boolean
  settings: SiteSettings
  updateSettings: (patch: Partial<SiteSettings>) => void
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  wishOpen: boolean
  setWishOpen: (open: boolean) => void
  cart: CartItem[]
  addToCart: (product: Product, size: string) => void
  updateQty: (productId: string, size: string, delta: number) => void
  removeFromCart: (productId: string, size: string) => void
  clearCart: () => void
  cartCount: number
  subtotalMkd: number
  shippingMkd: number
  totalMkd: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  checkoutOpen: boolean
  setCheckoutOpen: (open: boolean) => void
  toast: string | null
  showToast: (msg: string) => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

const KEYS = {
  cart: 'vyro_mk_cart_v1',
  products: 'vyro_mk_products_v1',
  discounts: 'vyro_mk_discounts_v1',
  orders: 'vyro_mk_orders_v1',
  settings: 'vyro_mk_settings_v1',
  wishlist: 'vyro_mk_wishlist_v1',
  stock: 'vyro_mk_stock_v1',
  reviews: 'vyro_mk_reviews_v1',
  recent: 'vyro_mk_recent_v1',
  subscribers: 'vyro_mk_subscribers_v1',
  categories: 'vyro_mk_categories_v1',
}

const DEFAULT_DISCOUNTS: DiscountCode[] = [
  { id: 'disc-1', code: 'VYRO10', type: 'percent', value: 10, active: true },
  { id: 'disc-2', code: 'DROP500', type: 'fixed', value: 500, active: true },
]

const DEFAULT_SETTINGS: SiteSettings = {
  promoBannerEn: 'Free delivery over 3,500 MKD • Cash on delivery across North Macedonia • Use code VYRO10 for 10% off',
  promoBannerMk: 'Бесплатна достава над 3,500 MKD • Плаќање при достава • Код VYRO10 за 10% попуст',
  promoBannerSq: 'Dërgim falas mbi 3,500 MKD • Pagesë në dorëzim • Kodi VYRO10 për 10% zbritje',
  freeShippingMkd: FREE_SHIPPING_MKD,
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'vyro-pulse-90',
    name: 'Marko P.',
    rating: 5,
    text: 'Perfect fit and they look even better in person. Delivery in Skopje next day.',
    createdAt: '2026-11-02',
  },
  {
    id: 'rev-2',
    productId: 'vyro-pulse-90',
    name: 'Elena S.',
    rating: 4,
    text: 'Super comfortable for all-day wear. Sizing is true to EU.',
    createdAt: '2026-11-09',
  },
  {
    id: 'rev-3',
    productId: 'vyro-air-mono',
    name: 'Arben K.',
    rating: 5,
    text: 'Clean white pair, easy to keep clean. Ordered a second pair.',
    createdAt: '2026-10-24',
  },
  {
    id: 'rev-4',
    productId: 'vyro-heavy-hoodie',
    name: 'Jana T.',
    rating: 5,
    text: 'Heavy fabric, holds shape after washing. Worth the price.',
    createdAt: '2026-11-14',
  },
]

function seedStock(products: Product[]): Stock {
  const out: Stock = {}
  products.forEach((product, pi) => {
    product.sizes.forEach((size, si) => {
      const n = (pi * 3 + si * 5) % 9
      out[`${product.id}__${size}`] = n === 0 ? 0 : n <= 2 ? 2 : 9
    })
  })
  return out
}

function normalizeProducts(products: Product[]): Product[] {
  return products.map((p) => ({ ...p, gender: p.gender ?? 'unisex' }))
}

function usePersisted<T>(key: string, initial: T, normalize?: (value: T) => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      const parsed = raw ? (JSON.parse(raw) as T) : initial
      return normalize ? normalize(parsed) : parsed
    } catch {
      return normalize ? normalize(initial) : initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])
  return [value, setValue] as const
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangT>(DEFAULT_LANG)
  const [products, setProducts] = usePersisted<Product[]>(KEYS.products, PRODUCTS, normalizeProducts)
  const [categories, setCategories] = usePersisted<CategoryDef[]>(KEYS.categories, DEFAULT_CATEGORIES)
  const [discounts, setDiscounts] = usePersisted<DiscountCode[]>(KEYS.discounts, DEFAULT_DISCOUNTS)
  const [orders, setOrders] = usePersisted<StoreOrder[]>(KEYS.orders, [])
  const [settings, setSettings] = usePersisted<SiteSettings>(KEYS.settings, DEFAULT_SETTINGS)
  const [wishlist, setWishlist] = usePersisted<string[]>(KEYS.wishlist, [])
  const [wishOpen, setWishOpen] = useState(false)
  const [cart, setCart] = usePersisted<CartItem[]>(KEYS.cart, [])
  const [stock, setStockState] = usePersisted<Stock>(KEYS.stock, seedStock(PRODUCTS))
  const [reviews, setReviews] = usePersisted<Review[]>(KEYS.reviews, DEFAULT_REVIEWS)
  const [recentlyViewed, setRecentlyViewed] = usePersisted<string[]>(KEYS.recent, [])
  const [subscribers, setSubscribers] = usePersisted<string[]>(KEYS.subscribers, [])
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev))
    }, 2600)
  }

  const getStock = (productId: string, size: string) => {
    const key = `${productId}__${size}`
    return stock[key] ?? 8
  }

  const setStock = (productId: string, size: string, qty: number) => {
    setStockState((prev) => ({ ...prev, [`${productId}__${size}`]: Math.max(0, qty) }))
  }

  const productStockTotal = (product: Product) =>
    product.sizes.reduce((sum, size) => sum + getStock(product.id, size), 0)

  const categoryInUse = (slug: string) => products.filter((p) => p.category === slug).length

  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const addCategory = (category: Omit<CategoryDef, 'slug'>) => {
    const label = category.labelEn.trim()
    if (!label) return false
    let slug = slugify(label)
    if (!slug) return false
    if (categories.some((c) => c.slug === slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`
    }
    setCategories((prev) => [
      ...prev,
      {
        slug,
        labelEn: label,
        labelMk: category.labelMk.trim() || label,
        image: category.image || '/products/look.avif',
      },
    ])
    showToast(`Category "${label}" added`)
    return true
  }

  const updateCategory = (slug: string, patch: Partial<CategoryDef>) => {
    setCategories((prev) => prev.map((c) => (c.slug === slug ? { ...c, ...patch } : c)))
    showToast('Category updated')
  }

  const deleteCategory = (slug: string) => {
    if (categoryInUse(slug) > 0) {
      showToast('Move or delete the products in this category first')
      return false
    }
    if (categories.length <= 1) {
      showToast('Keep at least one category')
      return false
    }
    setCategories((prev) => prev.filter((c) => c.slug !== slug))
    showToast('Category removed')
    return true
  }

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev])
    setStockState((prev) => {
      const next = { ...prev }
      product.sizes.forEach((size) => {
        next[`${product.id}__${size}`] = 8
      })
      return next
    })
    showToast(`Added "${product.name}" to catalog`)
  }

  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    showToast('Product updated')
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    showToast('Product removed')
  }

  const resetProducts = () => {
    setProducts(normalizeProducts(PRODUCTS))
    setStockState(seedStock(PRODUCTS))
    showToast('Catalog reset to defaults')
  }

  const addDiscount = (discount: Omit<DiscountCode, 'id'>) => {
    const cleanCode = discount.code.trim().toUpperCase()
    if (!cleanCode) return
    setDiscounts((prev) => [{ ...discount, code: cleanCode, id: `disc-${Date.now()}` }, ...prev])
    showToast(`Discount code ${cleanCode} created`)
  }

  const toggleDiscount = (id: string) => {
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)))
  }

  const deleteDiscount = (id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id))
    showToast('Discount code removed')
  }

  const applyPromoCode = (rawCode: string): { ok: boolean; message: string } => {
    const code = rawCode.trim().toUpperCase()
    const match = discounts.find((d) => d.code.toUpperCase() === code && d.active)
    if (!match) {
      return {
        ok: false,
        message: t(lang, 'Невалиден или неактивен код.', 'Invalid or inactive promo code.'),
      }
    }
    setAppliedCode(match.code)
    const label = match.type === 'percent' ? `${match.value}%` : `${match.value} MKD`
    showToast(t(lang, `Применет попуст ${label}!`, `Applied ${label} off with ${match.code}!`, `U aplikua ${label} zbritje me ${match.code}!`))
    return { ok: true, message: `${match.code} applied` }
  }

  const removePromoCode = () => setAppliedCode(null)

  const recordOrder = (order: Omit<StoreOrder, 'createdAt' | 'status'>) => {
    setOrders((prev) => [
      { ...order, createdAt: new Date().toISOString(), status: 'pending' as OrderStatus },
      ...prev,
    ])
    setStockState((prev) => {
      const next = { ...prev }
      order.items.forEach((item) => {
        if (!item.productId) return
        const key = `${item.productId}__${item.size}`
        const current = next[key] ?? 8
        next[key] = Math.max(0, current - item.quantity)
      })
      return next
    })
  }

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    showToast(`Order ${id} marked ${status}`)
  }

  const findOrder = (id: string) =>
    orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase())

  const addReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    setReviews((prev) => [
      { ...review, id: `rev-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ])
    showToast(t(lang, 'Благодариме за оценката!', 'Thanks for your review!'))
  }

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id))
    showToast('Review removed')
  }

  const reviewSummary = (productId: string) => {
    const list = reviews.filter((r) => r.productId === productId)
    if (list.length === 0) return { average: 0, count: 0 }
    const avg = list.reduce((s, r) => s + r.rating, 0) / list.length
    return { average: Math.round(avg * 10) / 10, count: list.length }
  }

  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 8))
  }

  const addSubscriber = (email: string) => {
    const clean = email.trim().toLowerCase()
    if (!clean || !clean.includes('@')) return false
    let added = false
    setSubscribers((prev) => {
      if (prev.includes(clean)) return prev
      added = true
      return [clean, ...prev]
    })
    if (added) showToast(t(lang, 'Се пријавивте за известувања!', 'You are on the drop list!'))
    return added
  }

  const updateSettings = (patch: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    showToast('Store settings saved')
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId)
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId]
      showToast(
        exists
          ? t(lang, 'Отстрането од омилени', 'Removed from saved')
          : t(lang, 'Зачувано во омилени', 'Saved to wishlist'),
      )
      return next
    })
  }

  const addToCart = (product: Product, size: string) => {
    const available = getStock(product.id, size)
    if (available <= 0) {
      showToast(t(lang, 'Овој број е распродаден.', 'That size is sold out.'))
      return
    }
    const existing = cart.find((i) => i.product.id === product.id && i.size === size)
    if (existing && existing.quantity >= available) {
      showToast(
        t(lang, `Достапни се само ${available} пара во овој број.`, `Only ${available} left in that size.`, `Vetëm ${available} mbetur në atë madhësi.`),
      )
      return
    }
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id && item.size === size)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [...prev, { product, size, quantity: 1 }]
    })
    setCartOpen(true)
    showToast(
      t(lang, `Додадено: ${product.name} (${size})`, `Added ${product.name} (${size}) to bag`, `U shtua ${product.name} (${size}) në çantë`),
    )
  }

  const updateQty = (productId: string, size: string, delta: number) => {
    const available = getStock(productId, size)
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId || item.size !== size) return item
          const nextQty = Math.min(item.quantity + delta, Math.max(available, 0))
          return { ...item, quantity: nextQty }
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)))
  }

  const clearCart = () => {
    setCart([])
    setAppliedCode(null)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotalMkd = cart.reduce((sum, item) => sum + item.product.priceMkd * item.quantity, 0)

  const activeDiscount = appliedCode
    ? discounts.find((d) => d.code.toUpperCase() === appliedCode.toUpperCase() && d.active)
    : undefined

  const discountMkd = activeDiscount
    ? activeDiscount.type === 'percent'
      ? Math.round((subtotalMkd * activeDiscount.value) / 100)
      : Math.min(subtotalMkd, activeDiscount.value)
    : 0

  const afterDiscount = Math.max(0, subtotalMkd - discountMkd)
  const shippingMkd = afterDiscount === 0 || afterDiscount >= settings.freeShippingMkd ? 0 : SHIPPING_FEE_MKD
  const totalMkd = afterDiscount + shippingMkd

  return (
    <StoreContext.Provider
      value={{
        lang,
        setLang,
        products,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        categoryInUse,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        stock,
        getStock,
        setStock,
        productStockTotal,
        discounts,
        addDiscount,
        toggleDiscount,
        deleteDiscount,
        appliedCode,
        applyPromoCode,
        removePromoCode,
        discountMkd,
        orders,
        recordOrder,
        updateOrderStatus,
        findOrder,
        reviews,
        addReview,
        deleteReview,
        reviewSummary,
        recentlyViewed,
        addRecentlyViewed,
        subscribers,
        addSubscriber,
        settings,
        updateSettings,
        wishlist,
        toggleWishlist,
        wishOpen,
        setWishOpen,
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        cartCount,
        subtotalMkd,
        shippingMkd,
        totalMkd,
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
