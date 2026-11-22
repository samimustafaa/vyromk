import { Link } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useStore } from '../context/StoreContext'
import { formatMkd, matchesGender } from '../data/products'
import { TruckIcon, CashIcon, ExchangeIcon, PriceTagIcon } from '../components/Icons'

export function HomePage() {
  const { lang, products, addToCart, categories } = useStore()
  const menCount = products.filter((p) => matchesGender(p, 'men')).length
  const womenCount = products.filter((p) => matchesGender(p, 'women')).length
  const featured = products.filter((p) => p.featured).slice(0, 8)
  const heroProduct = products[0]

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">VYRO MK • DROP 01</p>
            <h1 className="display-title hero-headline">
              {lang === 'mk' ? (
                <>
                  Твој стил.
                  <br />
                  Твој потег.
                </>
              ) : (
                <>
                  Your Style.
                  <br />
                  Your Move.
                </>
              )}
            </h1>
            <p className="hero-sub">
              {lang === 'mk'
                ? 'Патики и улична облека по достапни цени. Брза достава низ цела Македонија и плаќање при прием.'
                : 'Sneakers and streetwear at accessible prices. Clean silhouettes, fast 24–48h delivery across North Macedonia, pay on delivery.'}
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-lime">
                {lang === 'mk' ? 'Разгледај колекција' : 'Shop the Drop'}
              </Link>
              <Link to="/shop?category=sneakers" className="btn btn-outline-light">
                {lang === 'mk' ? 'Сите патики' : 'Explore Sneakers'}
              </Link>
            </div>
          </div>

          <div className="hero-spotlight">
            <Link to={`/product/${heroProduct.slug}`} className="hero-img-wrap">
              <img src={heroProduct.image} alt={heroProduct.name} />
              <span className="hero-tag">New Drop</span>
            </Link>
            <div className="hero-card-bar">
              <div>
                <div className="hero-card-name">{heroProduct.name}</div>
                <div className="hero-card-price">{formatMkd(heroProduct.priceMkd)}</div>
              </div>
              <button
                type="button"
                className="btn btn-lime"
                onClick={() => addToCart(heroProduct, '42')}
              >
                {lang === 'mk' ? 'Брза нарачка (42)' : 'Quick Add (42)'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="container trust-grid">
          <div className="trust-item">
            <span className="trust-icon trust-icon--truck">
              <TruckIcon />
            </span>
            <div className="trust-copy">
              <strong>{lang === 'mk' ? '24–48ч Достава' : '24–48h Delivery'}</strong>
              <span>{lang === 'mk' ? 'До секој град во МК' : 'Every city in Macedonia'}</span>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon trust-icon--cash">
              <CashIcon />
            </span>
            <div className="trust-copy">
              <strong>{lang === 'mk' ? 'Плаќање при достава' : 'Cash on Delivery'}</strong>
              <span>{lang === 'mk' ? 'Без ризик, плати на курир' : 'Zero risk, pay at your door'}</span>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon trust-icon--exchange">
              <ExchangeIcon />
            </span>
            <div className="trust-copy">
              <strong>{lang === 'mk' ? 'Лесна замена на број' : 'Easy Size Exchange'}</strong>
              <span>{lang === 'mk' ? '7 дена можност за замена' : '7-day hassle-free swap'}</span>
            </div>
          </div>
          <div className="trust-item">
            <span className="trust-icon trust-icon--price">
              <PriceTagIcon />
            </span>
            <div className="trust-copy">
              <strong>{lang === 'mk' ? 'Достапни цени' : 'Fair Street Pricing'}</strong>
              <span>{lang === 'mk' ? 'Врвен изглед без преплата' : 'Sharp looks, no markup'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DROP — LIGHT STUDIO SURFACE */}
      <section className="section-light">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="display-title section-title-dark">
                {lang === 'mk' ? 'Најбарани модели' : 'Featured Drop'}
              </h2>
              <p className="section-sub-dark">
                {lang === 'mk'
                  ? 'Одбери број и додај во кошничка со еден клик.'
                  : 'Pick your size and add straight to your bag.'}
              </p>
            </div>
            <Link to="/shop" className="btn btn-outline-dark">
              {lang === 'mk' ? `Види ги сите (${products.length})` : `View All (${products.length})`}
            </Link>
          </div>

          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} theme="light" />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL LOOKBOOK */}
      <section className="section-dark lookbook-section">
        <div className="container lookbook-grid">
          <div className="lookbook-media">
            <img src="/products/street.avif" alt="VYRO MK street styling" loading="lazy" />
          </div>
          <div className="lookbook-copy">
            <span className="lime-pill">VYRO STREETWEAR</span>
            <h2 className="display-title lookbook-title">
              {lang === 'mk' ? 'Создадено за движење.' : 'Built for the street.'}
            </h2>
            <p className="lookbook-text">
              {lang === 'mk'
                ? 'Тешки 440г дуксери, оверсајз маици и чисти силуети на патики — сè што ти треба за комплетен аутфит без компромис.'
                : 'Heavyweight 440gsm hoodies, boxy tees, and clean sneaker silhouettes—everything you need to lock in a complete fit without overpaying.'}
            </p>
            <div className="lookbook-actions">
              <Link to="/shop?category=apparel" className="btn btn-lime">
                {lang === 'mk' ? 'Купи облека' : 'Shop Apparel'}
              </Link>
              <Link to="/about" className="btn btn-outline-light">
                {lang === 'mk' ? 'Нашата приказна' : 'Our Story'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY GENDER */}
      <section className="section-dark gender-section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="display-title section-title">{lang === 'mk' ? 'За него и за неа' : 'Shop Men & Women'}</h2>
              <p className="section-sub">
                {lang === 'mk'
                  ? 'Унисекс моделите се појавуваат во двете секции.'
                  : 'Unisex styles show up in both sections.'}
              </p>
            </div>
          </div>
          <div className="gender-grid">
            <Link to="/shop?gender=men" className="gender-card">
              <img src="/products/street.avif" alt="VYRO MK men's collection" loading="lazy" />
              <div className="gender-card-overlay">
                <span className="lime-pill">{lang === 'mk' ? 'КОЛЕКЦИЈА' : 'COLLECTION'}</span>
                <h3 className="display-title">{lang === 'mk' ? 'Мажи' : 'Men'}</h3>
                <span className="gender-card-count">
                  {menCount} {lang === 'mk' ? 'модели' : 'styles'}
                </span>
                <span className="gender-card-cta">
                  {lang === 'mk' ? 'Купи сега' : 'Shop now'}
                </span>
              </div>
            </Link>
            <Link to="/shop?gender=women" className="gender-card">
              <img src="/products/look.avif" alt="VYRO MK women's collection" loading="lazy" />
              <div className="gender-card-overlay">
                <span className="lime-pill">{lang === 'mk' ? 'КОЛЕКЦИЈА' : 'COLLECTION'}</span>
                <h3 className="display-title">{lang === 'mk' ? 'Жени' : 'Women'}</h3>
                <span className="gender-card-count">
                  {womenCount} {lang === 'mk' ? 'модели' : 'styles'}
                </span>
                <span className="gender-card-cta">
                  {lang === 'mk' ? 'Купи сега' : 'Shop now'}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="section-light">
        <div className="container">
          <div className="section-head">
            <h2 className="display-title section-title-dark">
              {lang === 'mk' ? 'Купувај по категорија' : 'Shop by Category'}
            </h2>
          </div>

          <div className="category-grid">
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.slug).length
              return (
                <Link key={c.slug} to={`/shop?category=${c.slug}`} className="category-tile">
                  <img src={c.image} alt={c.labelEn} loading="lazy" />
                  <div className="category-overlay">
                    <h3 className="display-title">{lang === 'mk' ? c.labelMk : c.labelEn}</h3>
                    <span>
                      {count} {lang === 'mk' ? 'модели' : 'styles'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* DM ORDERING BANNER */}
      <section id="dm-order" className="dm-banner">
        <div className="container dm-banner-inner">
          <div>
            <h2 className="display-title dm-title">
              {lang === 'mk' ? 'Преферираш нарачка во порака?' : 'Prefer ordering in DM?'}
            </h2>
            <p className="dm-sub">
              Патики и облека по достапни цени. Твој стил. Твој потег. Нарачај директно овде или пиши ни на <strong>@vyro.mk</strong>.
            </p>
          </div>
          <Link to="/shop" className="btn btn-dark">
            {lang === 'mk' ? 'Избери модел' : 'Pick Your Pair'}
          </Link>
        </div>
      </section>
    </div>
  )
}
