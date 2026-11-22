import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { formatMkd, GENDER_LABELS, type Product } from '../data/products'
import { StarRating } from './StarRating'
import { HeartIcon } from './Icons'
import { t } from '../i18n'

interface ProductCardProps {
  product: Product
  theme?: 'dark' | 'light'
}

export function ProductCard({ product, theme = 'light' }: ProductCardProps) {
  const { lang, addToCart, wishlist, toggleWishlist, getStock, reviewSummary } = useStore()
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[Math.min(2, product.sizes.length - 1)] ?? product.sizes[0],
  )
  const isSaved = wishlist.includes(product.id)
  const summary = reviewSummary(product.id)
  const selectedStock = getStock(product.id, selectedSize)
  const totalStock = product.sizes.reduce((s, size) => s + getStock(product.id, size), 0)
  const soldOut = totalStock === 0

  const discountPct =
    product.compareAtMkd && product.compareAtMkd > product.priceMkd
      ? Math.round(((product.compareAtMkd - product.priceMkd) / product.compareAtMkd) * 100)
      : null

  return (
    <article className={`product-card product-card--${theme}`}>
      <div className="product-media">
        <Link to={`/product/${product.slug}`} className="product-media-link">
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <div className="product-badges">
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {discountPct && <span className="product-badge product-badge--sale">-{discountPct}%</span>}
          {soldOut && <span className="product-badge product-badge--out">Sold out</span>}
        </div>
        <button
          type="button"
          className={`wishlist-btn${isSaved ? ' active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <HeartIcon filled={isSaved} />
        </button>
        {totalStock > 0 && totalStock <= 6 && (
          <span className="low-stock-flag">
            {t(lang, `Само ${totalStock} останати`, `Only ${totalStock} left`)}
          </span>
        )}
      </div>

      <div className="product-info">
        <div className="product-meta">
          <Link to={`/product/${product.slug}`} className="product-title">
            {product.name}
          </Link>
          <span className="product-color">{product.colorway}</span>
          <span className={`gender-tag gender-tag--${product.gender}`}>
            {t(lang, GENDER_LABELS[product.gender].mk, GENDER_LABELS[product.gender].en, GENDER_LABELS[product.gender].sq)}
          </span>
          <StarRating value={summary.average} count={summary.count} />
        </div>

        <div className="product-price-row">
          <span className="product-price">{formatMkd(product.priceMkd)}</span>
          {product.compareAtMkd && (
            <span className="product-compare">{formatMkd(product.compareAtMkd)}</span>
          )}
        </div>

        <div className="product-quick-buy">
          <div className="quick-sizes" role="group" aria-label={`Select size for ${product.name}`}>
            {product.sizes.slice(0, 6).map((size) => {
              const sizeStock = getStock(product.id, size)
              return (
                <button
                  key={size}
                  type="button"
                  className={`size-chip${selectedSize === size ? ' active' : ''}${sizeStock === 0 ? ' sold-out' : ''}`}
                  onClick={() => setSelectedSize(size)}
                  disabled={sizeStock === 0}
                  title={sizeStock === 0 ? 'Sold out' : `${sizeStock} in stock`}
                >
                  {size}
                </button>
              )
            })}
          </div>
          <button
            type="button"
            className="btn btn-lime quick-add-btn"
            onClick={() => addToCart(product, selectedSize)}
            disabled={soldOut || selectedStock === 0}
          >
            {soldOut
              ? t(lang, 'Распродадено', 'Sold out')
              : selectedStock === 0
                ? t(lang, 'Бројот е распродаден', 'Size sold out')
                : t(lang, 'Додај', 'Add to bag')}
          </button>
        </div>
      </div>
    </article>
  )
}
