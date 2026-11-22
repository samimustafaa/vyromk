import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { StarRating } from '../components/StarRating'
import { HeartIcon, BagIcon } from '../components/Icons'
import { useStore } from '../context/StoreContext'
import { categoryLabel, formatMkd, GENDER_LABELS } from '../data/products'

export function ProductDetailPage() {
  const { slug } = useParams()
  const {
    lang,
    products,
    addToCart,
    showToast,
    getStock,
    reviews,
    addReview,
    reviewSummary,
    recentlyViewed,
    addRecentlyViewed,
    wishlist,
    toggleWishlist,
    settings,
    cartCount,
    setCartOpen,
    categories,
  } = useStore()

  const product = products.find((p) => p.slug === slug) ?? products[0]
  const [selectedSize, setSelectedSize] = useState('')
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [reviewName, setReviewName] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    if (!product) return
    const firstAvailable =
      product.sizes.find((s) => getStock(product.id, s) > 0) ??
      product.sizes[Math.min(2, product.sizes.length - 1)]
    setSelectedSize(firstAvailable)
    setShowReviewForm(false)
    addRecentlyViewed(product.id)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  if (!product) {
    return (
      <div className="empty-search container">
        <p>Product not found.</p>
        <Link to="/shop" className="btn btn-dark">Back to shop</Link>
      </div>
    )
  }

  const summary = reviewSummary(product.id)
  const productReviews = reviews.filter((r) => r.productId === product.id).slice(0, 5)
  const selectedStock = selectedSize ? getStock(product.id, selectedSize) : 0
  const totalStock = product.sizes.reduce((s, size) => s + getStock(product.id, size), 0)
  const isSaved = wishlist.includes(product.id)

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  const completeLook = useMemo(
    () => products.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 3),
    [products, product.id, product.category],
  )

  const recentProducts = recentlyViewed
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4)

  const handleCopySingleDm = () => {
    const msg = `Hi @vyro.mk! I want to order: ${product.name} (Size ${selectedSize}) — ${formatMkd(product.priceMkd)}`
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(msg).catch(() => {})
    showToast(
      lang === 'mk'
        ? 'Пораката е копирана! Испрати ја на @vyro.mk'
        : 'Message copied! Send it to @vyro.mk on Instagram.',
    )
  }

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!reviewName.trim() || !reviewText.trim()) return
    addReview({
      productId: product.id,
      name: reviewName.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
    })
    setReviewName('')
    setReviewText('')
    setReviewRating(5)
    setShowReviewForm(false)
  }

  return (
    <div className="pdp-page">
      <section className="section-light pdp-section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">{lang === 'mk' ? 'Почетна' : 'Home'}</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category}`}>
              {categoryLabel(categories, product.category, lang)}
            </Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>

          <div className="pdp-grid">
            <div className="pdp-media">
              <img src={product.image} alt={product.name} />
              <div className="product-badges">
                {product.badge && <span className="product-badge">{product.badge}</span>}
                {product.compareAtMkd && (
                  <span className="product-badge product-badge--sale">
                    -{Math.round(((product.compareAtMkd - product.priceMkd) / product.compareAtMkd) * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div className="pdp-info">
              <div className="pdp-meta-row">
                <span className="pdp-colorway">{product.colorway}</span>
                <Link
                  to={product.gender === 'unisex' ? '/shop' : `/shop?gender=${product.gender}`}
                  className={`gender-tag gender-tag--${product.gender}`}
                >
                  {GENDER_LABELS[product.gender]?.[lang] ?? 'Unisex'}
                </Link>
              </div>
              <h1 className="display-title pdp-title">{product.name}</h1>

              <div className="pdp-rating-row">
                <StarRating value={summary.average} count={summary.count} size="md" />
                <button
                  type="button"
                  className="pdp-review-jump"
                  onClick={() => document.getElementById('pdp-reviews')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {lang === 'mk' ? 'Види оцени' : 'Read reviews'}
                </button>
              </div>

              <div className="pdp-price-row">
                <span className="pdp-price">{formatMkd(product.priceMkd)}</span>
                {product.compareAtMkd && (
                  <span className="pdp-compare">{formatMkd(product.compareAtMkd)}</span>
                )}
              </div>

              <p className="pdp-desc">{product.description[lang]}</p>

              <div className="pdp-size-block">
                <div className="pdp-size-header">
                  <span>{lang === 'mk' ? 'Одбери број' : 'Select Size'}</span>
                  <button type="button" className="size-guide-link" onClick={() => setSizeGuideOpen(true)}>
                    {lang === 'mk' ? 'Табела за броеви' : 'Size Guide'}
                  </button>
                </div>
                <div className="pdp-sizes" role="group" aria-label="Select size">
                  {product.sizes.map((size) => {
                    const sizeStock = getStock(product.id, size)
                    return (
                      <button
                        key={size}
                        type="button"
                        className={`pdp-size-btn${selectedSize === size ? ' active' : ''}${sizeStock === 0 ? ' sold-out' : ''}`}
                        onClick={() => setSelectedSize(size)}
                        disabled={sizeStock === 0}
                        title={sizeStock === 0 ? 'Sold out' : `${sizeStock} in stock`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
                <p className={`pdp-stock-line${selectedStock > 0 ? ' ok' : ' out'}`}>
                  {totalStock === 0
                    ? lang === 'mk' ? 'Целосно распродадено' : 'Fully sold out'
                    : selectedStock === 0
                      ? lang === 'mk' ? 'Овој број е распродаден — избери друг' : 'This size is sold out — pick another'
                      : selectedStock <= 3
                        ? lang === 'mk' ? `Само ${selectedStock} останати — побрзај` : `Only ${selectedStock} left — order soon`
                        : lang === 'mk' ? 'На залиха • Испорака за 24ч' : 'In stock • Ships within 24h'}
                </p>
              </div>

              <div className="pdp-actions">
                <button
                  type="button"
                  className="btn btn-lime full-width"
                  onClick={() => addToCart(product, selectedSize)}
                  disabled={selectedStock === 0}
                >
                  {selectedStock === 0
                    ? lang === 'mk' ? 'Распродадено' : 'Sold out'
                    : lang === 'mk'
                      ? `Додај во кошничка — ${formatMkd(product.priceMkd)}`
                      : `Add to Bag — ${formatMkd(product.priceMkd)}`}
                </button>
                <div className="pdp-secondary-actions">
                  <button
                    type="button"
                    className={`btn btn-outline-dark${isSaved ? ' saved' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    <HeartIcon filled={isSaved} />
                    {isSaved
                      ? lang === 'mk' ? 'Зачувано' : 'Saved'
                      : lang === 'mk' ? 'Зачувај' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-outline-dark" onClick={handleCopySingleDm}>
                    {lang === 'mk' ? 'Копирај за DM' : 'Copy for DM'}
                  </button>
                </div>
              </div>

              <div className="pdp-perks">
                <span>{lang === 'mk' ? `Бесплатна достава над ${formatMkd(settings.freeShippingMkd)}` : `Free delivery over ${formatMkd(settings.freeShippingMkd)}`}</span>
                <span>{lang === 'mk' ? 'Плаќање при достава' : 'Cash on delivery'}</span>
                <span>{lang === 'mk' ? '7 дена замена' : '7-day size swap'}</span>
              </div>

              <ul className="pdp-details">
                {product.details[lang].map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-light reviews-section" id="pdp-reviews">
        <div className="container reviews-grid">
          <div className="reviews-summary">
            <h2 className="display-title section-title-dark">
              {lang === 'mk' ? 'Оцени од купувачи' : 'Customer Reviews'}
            </h2>
            <div className="reviews-score">
              <strong>{summary.count > 0 ? summary.average.toFixed(1) : '—'}</strong>
              <div>
                <StarRating value={summary.average} size="md" showValue={false} />
                <span>
                  {summary.count} {lang === 'mk' ? 'оцени' : 'reviews'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => setShowReviewForm((v) => !v)}
            >
              {lang === 'mk' ? 'Напиши оценка' : 'Write a review'}
            </button>

            {showReviewForm && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <label className="field">
                  <span>{lang === 'mk' ? 'Твоето ime' : 'Your name'}</span>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="Marko P."
                  />
                </label>
                <div className="rating-picker" role="group" aria-label="Your rating">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={reviewRating >= n ? 'active' : ''}
                      onClick={() => setReviewRating(n)}
                      aria-label={`${n} stars`}
                    >
                      <svg viewBox="0 0 24 24" className="picker-star" aria-hidden="true">
                        <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44l-5.81 3.06L7.3 14.03 2.6 9.45l6.5-.95L12 2.6z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <label className="field">
                  <span>{lang === 'mk' ? 'Коментар' : 'Your review'}</span>
                  <textarea
                    required
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder={lang === 'mk' ? 'Како ти се допаѓаат?' : 'How do they fit and feel?'}
                  />
                </label>
                <button type="submit" className="btn btn-lime">
                  {lang === 'mk' ? 'Испрати оценка' : 'Submit review'}
                </button>
              </form>
            )}
          </div>

          <div className="reviews-list">
            {productReviews.length === 0 ? (
              <p className="reviews-empty">
                {lang === 'mk' ? 'Сè уште нема оцени за овој модел. Биди прв!' : 'No reviews for this piece yet. Be the first.'}
              </p>
            ) : (
              productReviews.map((r) => (
                <article key={r.id} className="review-card">
                  <div className="review-card-head">
                    <strong>{r.name}</strong>
                    <span>{r.createdAt}</span>
                  </div>
                  <StarRating value={r.rating} showValue={false} />
                  <p>{r.text}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* COMPLETE THE LOOK */}
      {completeLook.length > 0 && (
        <section className="section-light related-section">
          <div className="container">
            <h2 className="display-title section-title-dark related-heading">
              {lang === 'mk' ? 'Комплетирај го аутфитот' : 'Complete the Look'}
            </h2>
            <div className="product-grid product-grid--three">
              {completeLook.map((item) => (
                <ProductCard key={item.id} product={item} theme="light" />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section-light related-section">
          <div className="container">
            <h2 className="display-title section-title-dark related-heading">
              {lang === 'mk' ? 'Слични модели' : 'You May Also Like'}
            </h2>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} theme="light" />
              ))}
            </div>
          </div>
        </section>
      )}

      {recentProducts.length > 0 && (
        <section className="section-light related-section">
          <div className="container">
            <h2 className="display-title section-title-dark related-heading">
              {lang === 'mk' ? 'Неодамна разгледани' : 'Recently Viewed'}
            </h2>
            <div className="recent-row">
              {recentProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.slug}`} className="recent-card">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{formatMkd(item.priceMkd)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STICKY MOBILE BAR */}
      <div className="pdp-sticky-bar">
        <div>
          <strong>{formatMkd(product.priceMkd)}</strong>
          <span>
            {lang === 'mk' ? 'Број' : 'Size'} {selectedSize}
          </span>
        </div>
        <button
          type="button"
          className="btn btn-lime"
          onClick={() => addToCart(product, selectedSize)}
          disabled={selectedStock === 0}
        >
          {selectedStock === 0
            ? lang === 'mk' ? 'Распродадено' : 'Sold out'
            : lang === 'mk' ? 'Додај во кошничка' : 'Add to bag'}
        </button>
        <button type="button" className="pdp-sticky-bag" onClick={() => setCartOpen(true)}>
          <BagIcon /> {cartCount}
        </button>
      </div>

      {sizeGuideOpen && (
        <div className="modal-backdrop" onClick={() => setSizeGuideOpen(false)}>
          <div className="checkout-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2 className="display-title drawer-title">
                {lang === 'mk' ? 'Табела за броеви' : 'VYRO MK Size Guide'}
              </h2>
              <button type="button" className="drawer-close" onClick={() => setSizeGuideOpen(false)}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="size-guide-body">
              <table className="size-table">
                <thead>
                  <tr>
                    <th>EU</th>
                    <th>US</th>
                    <th>{lang === 'mk' ? 'Стапка (cm)' : 'Foot (cm)'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>38</td><td>6</td><td>24.0 cm</td></tr>
                  <tr><td>39</td><td>6.5</td><td>24.5 cm</td></tr>
                  <tr><td>40</td><td>7.5</td><td>25.5 cm</td></tr>
                  <tr><td>41</td><td>8</td><td>26.0 cm</td></tr>
                  <tr><td>42</td><td>9</td><td>27.0 cm</td></tr>
                  <tr><td>43</td><td>10</td><td>27.5 cm</td></tr>
                  <tr><td>44</td><td>10.5</td><td>28.5 cm</td></tr>
                  <tr><td>45</td><td>11.5</td><td>29.5 cm</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
