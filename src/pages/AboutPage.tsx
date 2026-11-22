import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { t } from '../i18n'
import { staticMeta } from '../seo/meta'
import { usePageMeta } from '../seo/usePageMeta'

export function AboutPage() {
  const { lang } = useStore()
  usePageMeta(staticMeta('/about'))

  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div>
            <span className="lime-pill">VYRO MK</span>
            <h1 className="display-title about-title">
              {t(lang, 'Твој стил. Твој потег.', 'Your Style. Your Move.')}
            </h1>
            <p className="about-lead">
              {t(lang, 'VYRO MK е модерен бренд за патики и улична облека создаден за луѓе кои сакаат чист изглед и квалитет без превисоки цени.', 'VYRO MK is a modern sneaker and streetwear store built for people who want sharp silhouettes and everyday quality without inflated prices.')}
            </p>
            <Link to="/shop" className="btn btn-lime">
              {t(lang, 'Погледни ја колекцијата', 'Browse the Collection')}
            </Link>
          </div>
          <div className="about-photo">
            <img src="/products/look.avif" alt="VYRO MK lookbook" />
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="container about-pillars">
          <div className="pillar-card">
            <h2 className="display-title pillar-title">
              {t(lang, 'Достава низ цела МК', 'Nationwide Delivery')}
            </h2>
            <p>
              {t(lang, 'Испорачуваме во Скопје и сите градови во Македонија за 24 до 48 часа. Бесплатна достава за нарачки над 3,500 MKD.', 'Fast 24–48 hour delivery to Skopje and every city across North Macedonia. Free shipping on orders over 3,500 MKD.')}
            </p>
          </div>
          <div className="pillar-card">
            <h2 className="display-title pillar-title">
              {t(lang, 'Нарачка на веб или во порака', 'Order Online or in DM')}
            </h2>
            <p>
              {t(lang, 'Нарачај директно преку кошничката со плаќање при достава, или копирај ја нарачката и пиши ни на @vyro.mk.', 'Place a Cash-on-Delivery order right here in seconds, or copy your bag and message @vyro.mk on Instagram or Facebook.')}
            </p>
          </div>
          <div className="pillar-card">
            <h2 className="display-title pillar-title">
              {t(lang, 'Гарантирана замена', '7-Day Size Swap')}
            </h2>
            <p>
              {t(lang, 'Не ти одговара бројот? Пиши ни во рок од 7 дена и веднаш ќе организираме замена.', 'Need a different size? Reach out within 7 days of delivery and we will arrange a quick size exchange.')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
