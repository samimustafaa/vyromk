import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useStore } from '../context/StoreContext'
import { categoryLabel, GENDER_LABELS, formatMkd, matchesGender, type Gender } from '../data/products'
import { t } from '../i18n'
import { shopMeta } from '../seo/meta'
import { usePageMeta } from '../seo/usePageMeta'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

const priceBands = [
  { key: 'all', label: 'Any price', min: 0, max: Infinity },
  { key: 'under1500', label: 'Under 1,500 MKD', min: 0, max: 1500 },
  { key: '1500-3000', label: '1,500 – 3,000 MKD', min: 1500, max: 3000 },
  { key: '3000-4000', label: '3,000 – 4,000 MKD', min: 3000, max: 4000 },
  { key: 'over4000', label: 'Over 4,000 MKD', min: 4000, max: Infinity },
]

const genderTabs: { key: Gender | 'all'; en: string; mk: string }[] = [
  { key: 'all', en: 'All', mk: 'Сите' },
  { key: 'men', en: 'Men', mk: 'Мажи' },
  { key: 'women', en: 'Women', mk: 'Жени' },
]

export function ShopPage() {
  const { lang, products, categories, wishlist, reviewSummary, productStockTotal } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialGender = searchParams.get('gender')
  const initialCat = searchParams.get('category')
  const [gender, setGender] = useState<Gender | 'all'>(
    initialGender === 'men' || initialGender === 'women' ? initialGender : 'all',
  )
  const [category, setCategory] = useState<string>(
    initialCat && categories.some((c) => c.slug === initialCat) ? initialCat : 'all',
  )
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')
  const [band, setBand] = useState('all')
  const [onSaleOnly, setOnSaleOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [savedOnly, setSavedOnly] = useState(false)

  useEffect(() => {
    const g = searchParams.get('gender')
    const c = searchParams.get('category')
    setGender(g === 'men' || g === 'women' ? g : 'all')
    setCategory(c && categories.some((cat) => cat.slug === c) ? c : 'all')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const updateParams = (nextGender: Gender | 'all', nextCategory: string) => {
    const params: Record<string, string> = {}
    if (nextGender !== 'all') params.gender = nextGender
    if (nextCategory !== 'all') params.category = nextCategory
    setSearchParams(params)
  }

  const handleGender = (next: Gender | 'all') => {
    setGender(next)
    updateParams(next, category)
  }

  const handleCategory = (next: string) => {
    setCategory(next)
    updateParams(gender, next)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const activeBand = priceBands.find((b) => b.key === band) ?? priceBands[0]
    const list = products.filter((p) => {
      if (savedOnly && !wishlist.includes(p.id)) return false
      if (!matchesGender(p, gender)) return false
      if (category !== 'all' && p.category !== category) return false
      if (q && !`${p.name} ${p.colorway}`.toLowerCase().includes(q)) return false
      if (p.priceMkd < activeBand.min || p.priceMkd > activeBand.max) return false
      if (onSaleOnly && !p.compareAtMkd) return false
      if (inStockOnly && productStockTotal(p) === 0) return false
      return true
    })
    if (sort === 'price-asc') return [...list].sort((a, b) => a.priceMkd - b.priceMkd)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.priceMkd - a.priceMkd)
    if (sort === 'rating')
      return [...list].sort((a, b) => reviewSummary(b.id).average - reviewSummary(a.id).average)
    if (sort === 'newest')
      return [...list].sort((a, b) => Number(b.badge === 'New Drop') - Number(a.badge === 'New Drop'))
    return list
  }, [products, wishlist, gender, category, query, sort, band, onSaleOnly, inStockOnly, savedOnly, reviewSummary, productStockTotal])

  const cheapest = products.length > 0 ? Math.min(...products.map((p) => p.priceMkd)) : 0

  const activeCategory = categories.find((c) => c.slug === category) ?? null
  usePageMeta(
    shopMeta(lang, filtered, {
      gender: gender === 'men' || gender === 'women' ? gender : undefined,
      category: activeCategory,
      query: query || undefined,
    }),
  )

  const heading =
    gender === 'men'
      ? t(lang, 'Мажи', 'Men')
      : gender === 'women'
        ? t(lang, 'Жени', 'Women')
        : t(lang, 'Продавница', 'Shop VYRO MK')

  return (
    <div className="shop-page">
      <section className="shop-header">
        <div className="container">
          <h1 className="display-title shop-title">{heading}</h1>
          <p className="shop-sub">
            {gender !== 'all'
              ? t(lang, 'Сите модели за тебе, вклучително и унисекс парчиња.', 'Every piece for you, including unisex styles.')
              : t(lang, `Сите достапни модели • Цени од ${formatMkd(cheapest)} • Бесплатна достава над 3,500 MKD`, `Every available piece • Prices from ${formatMkd(cheapest)} • Free delivery over 3,500 MKD`, `Çdo artikull i disponueshëm • Çmime nga ${formatMkd(cheapest)} • Dërgim falas mbi 3,500 MKD`)}
          </p>

          <div className="gender-switch" role="tablist" aria-label="Shop by gender">
            {genderTabs.map((g) => (
              <button
                key={g.key}
                type="button"
                role="tab"
                aria-selected={gender === g.key}
                className={`gender-tab${gender === g.key ? ' active' : ''}`}
                onClick={() => handleGender(g.key)}
              >
                {t(lang, g.mk, g.en, g.key === 'all' ? 'Të gjitha' : GENDER_LABELS[g.key].sq)}
              </button>
            ))}
          </div>

          <div className="shop-controls">
            <div className="filter-tabs" role="tablist" aria-label="Product categories">
              <button
                type="button"
                role="tab"
                aria-selected={category === 'all'}
                className={`filter-tab${category === 'all' ? ' active' : ''}`}
                onClick={() => handleCategory('all')}
              >
                {t(lang, 'Сите', 'All')}
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  role="tab"
                  aria-selected={category === c.slug}
                  className={`filter-tab${category === c.slug ? ' active' : ''}`}
                  onClick={() => handleCategory(c.slug)}
                >
                  {categoryLabel(categories, c.slug, lang)}
                </button>
              ))}
              <button
                type="button"
                role="tab"
                aria-selected={savedOnly}
                className={`filter-tab${savedOnly ? ' active' : ''}`}
                onClick={() => setSavedOnly((v) => !v)}
              >
                {t(lang, 'Омилени', 'Saved')} ({wishlist.length})
              </button>
            </div>

            <div className="shop-search-sort">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(lang, 'Пребарај модел...', 'Search models...')}
                aria-label="Search products"
                className="shop-search"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort products"
                className="shop-sort"
              >
                <option value="featured">{t(lang, 'Препорачани', 'Featured')}</option>
                <option value="newest">{t(lang, 'Најнови', 'Newest drops')}</option>
                <option value="rating">{t(lang, 'Најдобро оценети', 'Top rated')}</option>
                <option value="price-asc">{t(lang, 'Цена: ниска → висока', 'Price: Low to High')}</option>
                <option value="price-desc">{t(lang, 'Цена: висока → ниска', 'Price: High to Low')}</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="container shop-filter-bar">
        <div className="chip-row">
          {priceBands.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`filter-chip${band === b.key ? ' active' : ''}`}
              onClick={() => setBand(b.key)}
            >
              {b.key === 'all' ? (t(lang, 'Сите цени', 'Any price')) : b.label}
            </button>
          ))}
        </div>
        <div className="chip-row">
          <button
            type="button"
            className={`filter-chip${onSaleOnly ? ' active' : ''}`}
            onClick={() => setOnSaleOnly((v) => !v)}
          >
            {t(lang, 'Само на попуст', 'On sale')}
          </button>
          <button
            type="button"
            className={`filter-chip${inStockOnly ? ' active' : ''}`}
            onClick={() => setInStockOnly((v) => !v)}
          >
            {t(lang, 'На залиха', 'In stock')}
          </button>
          <span className="result-count">
            {filtered.length} {t(lang, 'производи', 'products')}
          </span>
        </div>
      </div>

      <section className="section-light shop-products">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="empty-search">
              <p>{t(lang, 'Нема пронајдени производи.', 'No products match your filters.')}</p>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => {
                  setQuery('')
                  setBand('all')
                  setOnSaleOnly(false)
                  setInStockOnly(false)
                  setSavedOnly(false)
                  setGender('all')
                  setCategory('all')
                  setSearchParams({})
                }}
              >
                {t(lang, 'Ресетирај филтри', 'Reset filters')}
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} theme="light" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
