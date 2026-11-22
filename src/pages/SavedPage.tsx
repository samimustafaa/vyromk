import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useStore } from '../context/StoreContext'
import { t } from '../i18n'
import { HeartIcon } from '../components/Icons'
import { staticMeta } from '../seo/meta'
import { usePageMeta } from '../seo/usePageMeta'

/** Full-page wishlist — also a crawlable page for saved pieces. */
export function SavedPage() {
  const { lang, wishlist, products, addToCart, getStock } = useStore()
  usePageMeta(staticMeta('/saved'))
  const saved = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const addAll = () =>
    saved.forEach((p) => {
      const size = p.sizes.find((s) => getStock(p.id, s) > 0) ?? p.sizes[0]
      addToCart(p, size)
    })

  return (
    <div className="saved-page container">
      <header className="shop-header saved-header">
        <h1 className="display-title shop-title">{t(lang, 'Омилени', 'Saved', 'Të ruajtura')}</h1>
        <p className="shop-sub">
          {saved.length > 0
            ? t(
                lang,
                `${saved.length} зачувани парчиња. Додај ги во кошничка кога си спремен.`,
                `${saved.length} saved pieces. Add them to your bag when you are ready.`,
                `${saved.length} artikuj të ruajtur. Shtoji në çantë kur të jesh gati.`,
              )
            : t(
                lang,
                'Сè уште немаш зачувано парчиња.',
                'You have not saved anything yet.',
                'Nuk ke ruajtur asgjë ende.',
              )}
        </p>
        {saved.length > 0 && (
          <div className="saved-actions">
            <button type="button" className="btn btn-lime" onClick={addAll}>
              {t(lang, 'Додај ги сите во кошничка', 'Add all to bag', 'Shto të gjitha në çantë')}
            </button>
            <Link to="/shop" className="btn btn-outline-dark">
              {t(lang, 'Продолжи со разгледување', 'Keep shopping', 'Vazhdo blerjen')}
            </Link>
          </div>
        )}
      </header>

      {saved.length === 0 ? (
        <div className="saved-empty">
          <span className="cart-empty-icon">
            <HeartIcon />
          </span>
          <p>
            {t(
              lang,
              'Кликни на срцето кај производот за да го зачуваш тука.',
              'Tap the heart on any product to save it here.',
              'Trokit zemrën te çdo produkt për ta ruajtur këtu.',
            )}
          </p>
          <Link to="/shop" className="btn btn-dark">
            {t(lang, 'Отвори продавница', 'Shop the drop', 'Blej koleksionin')}
          </Link>
        </div>
      ) : (
        <div className="product-grid">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
