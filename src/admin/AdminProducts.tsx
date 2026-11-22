import { useMemo, useRef, useState, type FormEvent } from 'react'
import { useStore } from '../context/StoreContext'
import { categoryLabel, formatMkd, GENDER_LABELS, type Gender, type Product } from '../data/products'
import { PRESET_IMAGES } from './adminData'

type SortKey = 'newest' | 'name' | 'price-desc' | 'stock'
type GenderFilter = 'all' | Gender

const BADGES = ['New Drop', 'Best Seller', 'Limited'] as const
type Badge = (typeof BADGES)[number]

const BLANK_SIZES = '39, 40, 41, 42, 43, 44'

/* ---------- Audience selector ---------- */

const AUDIENCE: { key: Gender; label: string; hint: string }[] = [
  { key: 'men', label: 'Men', hint: 'Men’s shop only' },
  { key: 'women', label: 'Women', hint: 'Women’s shop only' },
  { key: 'unisex', label: 'Unisex', hint: 'Men + Women' },
]

function AudiencePicker({
  value,
  onChange,
  size = 'md',
}: {
  value: Gender
  onChange: (g: Gender) => void
  size?: 'md' | 'sm'
}) {
  return (
    <div className={`adm-aud adm-aud--${size}`} role="group" aria-label="Audience">
      {AUDIENCE.map((a) => (
        <button
          key={a.key}
          type="button"
          className={`adm-aud-btn adm-aud-btn--${a.key}${value === a.key ? ' active' : ''}`}
          title={a.hint}
          aria-pressed={value === a.key}
          onClick={() => onChange(a.key)}
        >
          {a.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- Page ---------- */

export function AdminProducts() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    getStock,
  } = useStore()

  const formRef = useRef<HTMLFormElement | null>(null)

  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterGender, setFilterGender] = useState<GenderFilter>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  // form fields
  const [name, setName] = useState('')
  const [category, setCategory] = useState(categories[0]?.slug ?? 'sneakers')
  const [gender, setGender] = useState<Gender>('unisex')
  const [priceMkd, setPriceMkd] = useState('3490')
  const [compareAtMkd, setCompareAtMkd] = useState('')
  const [colorway, setColorway] = useState('Obsidian / Volt')
  const [image, setImage] = useState('/products/shoe4.avif')
  const [sizesStr, setSizesStr] = useState(BLANK_SIZES)
  const [badge, setBadge] = useState<'' | Badge>('New Drop')
  const [featured, setFeatured] = useState(false)
  const [descEn, setDescEn] = useState('')
  const [descMk, setDescMk] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const resetForm = () => {
    setName('')
    setCategory(categories[0]?.slug ?? 'sneakers')
    setGender('unisex')
    setPriceMkd('3490')
    setCompareAtMkd('')
    setColorway('Obsidian / Volt')
    setImage('/products/shoe4.avif')
    setSizesStr(BLANK_SIZES)
    setBadge('New Drop')
    setFeatured(false)
    setDescEn('')
    setDescMk('')
    setFormError(null)
  }

  const startEdit = (p: Product) => {
    setEditingId(p.id)
    setName(p.name)
    setCategory(p.category)
    setGender(p.gender)
    setPriceMkd(String(p.priceMkd))
    setCompareAtMkd(p.compareAtMkd ? String(p.compareAtMkd) : '')
    setColorway(p.colorway)
    setImage(p.image)
    setSizesStr(p.sizes.join(', '))
    setBadge(p.badge ?? '')
    setFeatured(Boolean(p.featured))
    setDescEn(p.description?.en ?? '')
    setDescMk(p.description?.mk ?? '')
    setFormError(null)
    setOpen(true)
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const closeForm = () => {
    setOpen(false)
    setEditingId(null)
    resetForm()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const price = Number(priceMkd)
    if (!name.trim()) {
      setFormError('Give the product a name.')
      return
    }
    if (!price || price <= 0) {
      setFormError('Price must be greater than zero.')
      return
    }
    const compare = compareAtMkd ? Number(compareAtMkd) : undefined
    if (compare && compare <= price) {
      setFormError('The compare-at price must be higher than the price.')
      return
    }
    const sizes = sizesStr.split(',').map((s) => s.trim()).filter(Boolean)
    if (sizes.length === 0) {
      setFormError('Add at least one size.')
      return
    }

    const payload = {
      name: name.trim(),
      category,
      gender,
      priceMkd: price,
      compareAtMkd: compare,
      colorway: colorway.trim() || 'Signature Edition',
      image: image.trim() || '/products/shoe4.avif',
      badge: badge || undefined,
      sizes,
      featured,
      description: {
        en: descEn.trim() || `${name.trim()} — curated VYRO MK release built for everyday street rotation.`,
        mk: descMk.trim() || `${name.trim()} — нов VYRO MK модел создаден за модерен уличен стил.`,
      },
    }

    if (editingId) {
      updateProduct(editingId, payload)
    } else {
      const slug = `${name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}-${Date.now().toString().slice(-4)}`
      addProduct({
        ...payload,
        id: slug,
        slug,
        details: {
          en: ['VYRO MK quality finish', 'Fast 24–48h delivery across MK', '7-day size exchange'],
          mk: ['VYRO MK квалитет', 'Брза 24–48ч достава низ МК', '7 дена замена на број'],
        },
      })
    }
    closeForm()
  }

  const handleRemove = (p: Product) => {
    if (confirmId !== p.id) {
      setConfirmId(p.id)
      window.setTimeout(() => setConfirmId((cur) => (cur === p.id ? null : cur)), 4000)
      return
    }
    deleteProduct(p.id)
    setConfirmId(null)
    if (editingId === p.id) closeForm()
  }

  const counts = useMemo(
    () => ({
      all: products.length,
      men: products.filter((p) => p.gender === 'men').length,
      women: products.filter((p) => p.gender === 'women').length,
      unisex: products.filter((p) => p.gender === 'unisex').length,
    }),
    [products],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = products.filter((p) => {
      if (filterCat !== 'all' && p.category !== filterCat) return false
      if (filterGender !== 'all' && p.gender !== filterGender) return false
      if (q && !`${p.name} ${p.colorway}`.toLowerCase().includes(q)) return false
      return true
    })
    const stockOf = (p: Product) => p.sizes.reduce((s, size) => s + getStock(p.id, size), 0)
    if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'price-desc') return [...list].sort((a, b) => b.priceMkd - a.priceMkd)
    if (sort === 'stock') return [...list].sort((a, b) => stockOf(a) - stockOf(b))
    return list
  }, [products, query, filterCat, filterGender, sort, getStock])

  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>Products</h1>
          <p>
            {products.length} pieces in the catalog. Edit anything, tag who it’s for, or retire it from the store.
          </p>
        </div>
        <div className="adm-head-actions">
          <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" onClick={resetProducts}>
            Reset defaults
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--lime adm-btn--sm"
            onClick={() => (open && !editingId ? closeForm() : (setEditingId(null), resetForm(), setOpen(true)))}
          >
            {open && !editingId ? 'Close form' : '+ Add product'}
          </button>
        </div>
      </div>

      {/* Audience summary */}
      <div className="adm-aud-summary">
        {(['all', 'men', 'women', 'unisex'] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={`adm-aud-card${filterGender === key ? ' active' : ''}`}
            onClick={() => setFilterGender(key)}
          >
            <span className={`adm-dot${key === 'all' ? ' adm-dot--all' : ` adm-dot--${key}`}`} />
            <div>
              <strong>{key === 'all' ? 'All products' : GENDER_LABELS[key].en}</strong>
              <span>
                {key === 'all'
                  ? 'Whole catalog'
                  : key === 'unisex'
                    ? 'Shows in Men + Women'
                    : `${GENDER_LABELS[key].en}’s shop only`}
              </span>
            </div>
            <em>{counts[key]}</em>
          </button>
        ))}
      </div>

      {open && (
        <form ref={formRef} className="adm-card adm-form adm-form--panel" onSubmit={handleSubmit}>
          <div className="adm-card-head">
            <div>
              <h2>{editingId ? 'Edit product' : 'New product'}</h2>
              <p>
                {editingId
                  ? 'Changes save straight to the storefront.'
                  : 'Appears instantly on the storefront once saved.'}
              </p>
            </div>
            {editingId && <span className="adm-chip">Editing live product</span>}
          </div>

          <div className="adm-form-grid">
            <label className="adm-field adm-field--wide">
              <span>Product name</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VYRO Volt Runner"
              />
            </label>

            <label className="adm-field">
              <span>Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.labelEn}
                  </option>
                ))}
              </select>
            </label>

            <label className="adm-field">
              <span>Price (MKD)</span>
              <input
                type="number"
                required
                min="100"
                value={priceMkd}
                onChange={(e) => setPriceMkd(e.target.value)}
              />
            </label>

            <label className="adm-field">
              <span>Compare-at price</span>
              <input
                type="number"
                min="0"
                value={compareAtMkd}
                onChange={(e) => setCompareAtMkd(e.target.value)}
                placeholder="Optional — shows % off"
              />
            </label>

            <label className="adm-field">
              <span>Colorway</span>
              <input type="text" value={colorway} onChange={(e) => setColorway(e.target.value)} />
            </label>

            <div className="adm-field adm-field--wide">
              <span>Who is this for?</span>
              <AudiencePicker value={gender} onChange={setGender} />
              <p className="adm-hint">
                {gender === 'men' && 'Shows in the Men shop only.'}
                {gender === 'women' && 'Shows in the Women shop only.'}
                {gender === 'unisex' && 'Shows in both the Men and Women shops, tagged Unisex.'}
              </p>
            </div>

            <label className="adm-field">
              <span>Badge</span>
              <select value={badge} onChange={(e) => setBadge(e.target.value as typeof badge)}>
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="">None</option>
              </select>
            </label>

            <label className="adm-field">
              <span>Photo</span>
              <select value={image} onChange={(e) => setImage(e.target.value)}>
                {PRESET_IMAGES.map((img) => (
                  <option key={img.value} value={img.value}>
                    {img.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="adm-field">
              <span>Sizes (comma separated)</span>
              <input type="text" value={sizesStr} onChange={(e) => setSizesStr(e.target.value)} />
            </label>

            <label className="adm-check adm-field--wide">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <span>Feature on the home page drop</span>
            </label>

            <label className="adm-field adm-field--wide">
              <span>Description (EN)</span>
              <input
                type="text"
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="Leave empty for a default description"
              />
            </label>

            <label className="adm-field adm-field--wide">
              <span>Description (MK)</span>
              <input
                type="text"
                value={descMk}
                onChange={(e) => setDescMk(e.target.value)}
                placeholder="Остави празно за стандарден опис"
              />
            </label>
          </div>

          {formError && <p className="adm-error">{formError}</p>}

          <div className="adm-form-actions">
            <button type="submit" className="adm-btn adm-btn--lime">
              {editingId ? 'Save changes' : 'Add product'}
            </button>
            <button type="button" className="adm-btn adm-btn--ghost" onClick={closeForm}>
              Cancel
            </button>
            {editingId && (
              <button
                type="button"
                className="adm-btn adm-btn--danger"
                onClick={() => {
                  const p = products.find((x) => x.id === editingId)
                  if (p) handleRemove(p)
                }}
              >
                {confirmId === editingId ? 'Tap again to delete' : 'Delete product'}
              </button>
            )}
          </div>
        </form>
      )}

      <div className="adm-toolbar">
        <div className="adm-toolbar-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products or colorways"
            aria-label="Search products"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          aria-label="Filter by category"
          className="adm-select"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.labelEn}
            </option>
          ))}
        </select>
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value as GenderFilter)}
          aria-label="Filter by audience"
          className="adm-select"
        >
          <option value="all">All audiences</option>
          <option value="men">Men only</option>
          <option value="women">Women only</option>
          <option value="unisex">Unisex</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort"
          className="adm-select"
        >
          <option value="newest">Newest first</option>
          <option value="name">Name A–Z</option>
          <option value="price-desc">Highest price</option>
          <option value="stock">Lowest stock</option>
        </select>
        <span className="adm-count">{filtered.length} shown</span>
      </div>

      <div className="adm-card adm-table-card">
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Audience tag</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const stock = p.sizes.reduce((s, size) => s + getStock(p.id, size), 0)
                return (
                  <tr key={p.id} className={editingId === p.id ? 'is-editing' : ''}>
                    <td>
                      <div className="adm-prod-cell">
                        <img src={p.image} alt="" className="adm-thumb-sm" />
                        <div>
                          <strong>{p.name}</strong>
                          <span>{p.colorway}</span>
                        </div>
                      </div>
                    </td>
                    <td>{categoryLabel(categories, p.category, 'en')}</td>
                    <td>
                      <AudiencePicker value={p.gender} onChange={(g) => updateProduct(p.id, { gender: g })} size="sm" />
                    </td>
                    <td className="adm-price-cell">
                      <strong>{formatMkd(p.priceMkd)}</strong>
                      {p.compareAtMkd && <s>{formatMkd(p.compareAtMkd)}</s>}
                    </td>
                    <td>
                      <span
                        className={`adm-pill${
                          stock === 0 ? ' adm-pill--out' : stock <= 6 ? ' adm-pill--warn' : ' adm-pill--ok'
                        }`}
                      >
                        {stock} units
                      </span>
                    </td>
                    <td>
                      <div className="adm-flags">
                        {p.featured && <span className="adm-flag">Featured</span>}
                        {p.badge && <span className="adm-flag">{p.badge}</span>}
                        {!p.featured && !p.badge && <span className="adm-muted">—</span>}
                      </div>
                    </td>
                    <td>
                      <div className="adm-row-actions">
                        <button
                          type="button"
                          className="adm-icon-btn"
                          title={p.featured ? 'Remove from featured' : 'Feature on home'}
                          onClick={() => updateProduct(p.id, { featured: !p.featured })}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z"
                              fill={p.featured ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="adm-icon-btn"
                          title={p.compareAtMkd ? 'Clear sale price' : 'Mark 20% off'}
                          onClick={() =>
                            updateProduct(p.id, {
                              compareAtMkd: p.compareAtMkd ? undefined : Math.round(p.priceMkd * 1.2),
                            })
                          }
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M13 3.5h5.5a2 2 0 012 2V11a2 2 0 01-.6 1.4L11 20.4a2 2 0 01-2.8 0L3.6 15.8a2 2 0 010-2.8L11.6 4a2 2 0 011.4-.5z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="adm-icon-btn"
                          title="Edit product"
                          onClick={() => startEdit(p)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M15 4.5l4.5 4.5M4.5 19.5l1-4.5L15.8 4.7a1.8 1.8 0 012.5 0l1 1a1.8 1.8 0 010 2.5L9 18.5z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className={`adm-icon-btn adm-icon-btn--danger${confirmId === p.id ? ' is-confirming' : ''}`}
                          title={confirmId === p.id ? 'Tap again to delete' : 'Delete product'}
                          onClick={() => handleRemove(p)}
                        >
                          {confirmId === p.id ? (
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                d="M5 12.5l4.2 4.2L19 6.8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path
                                d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="adm-empty">No products match these filters.</p>}
      </div>

      {confirmId && (
        <div className="adm-confirm-bar" role="status">
          <span>Delete this product for good? Stock and storefront links go with it.</span>
          <div>
            <button
              type="button"
              className="adm-btn adm-btn--danger adm-btn--xs"
              onClick={() => {
                const p = products.find((x) => x.id === confirmId)
                if (p) {
                  deleteProduct(p.id)
                  if (editingId === p.id) closeForm()
                }
                setConfirmId(null)
              }}
            >
              Yes, delete
            </button>
            <button type="button" className="adm-btn adm-btn--ghost adm-btn--xs" onClick={() => setConfirmId(null)}>
              Keep it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
