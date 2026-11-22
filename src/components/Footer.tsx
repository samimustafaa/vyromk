import { useState, type FormEvent } from 'react'
import { useStore } from '../context/StoreContext'
import { Link } from 'react-router-dom'

export function Footer() {
  const { lang, showToast, addSubscriber } = useStore()
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    const added = addSubscriber(email)
    if (!added) {
      showToast(lang === 'mk' ? 'Веќе сте пријавени.' : 'You are already on the list.')
    }
    setEmail('')
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand-mark">
            <span className="brand-name">VYRO</span>
            <span className="brand-mk">MK</span>
          </div>
          <p className="footer-slogan">
            {lang === 'mk' ? 'Твој стил. Твој потег.' : 'Your Style. Your Move.'}
          </p>
          <p className="footer-bio">
            Патики и облека по достапни цени.
            <br />
            Нарачки преку веб или во порака на <strong>@vyro.mk</strong>.
          </p>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">{lang === 'mk' ? 'Продавница' : 'Shop'}</h3>
          <Link to="/shop">{lang === 'mk' ? 'Сите производи' : 'All Products'}</Link>
          <Link to="/shop?category=sneakers">{lang === 'mk' ? 'Патики' : 'Sneakers'}</Link>
          <Link to="/shop?category=apparel">{lang === 'mk' ? 'Облека' : 'Apparel'}</Link>
          <Link to="/shop?category=accessories">{lang === 'mk' ? 'Додатоци' : 'Accessories'}</Link>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">{lang === 'mk' ? 'Бренд' : 'Brand'}</h3>
          <Link to="/about">{lang === 'mk' ? 'За VYRO MK' : 'About VYRO MK'}</Link>
          <Link to="/track-order">{lang === 'mk' ? 'Следи нарачка' : 'Track my order'}</Link>
          <a href="#dm-order">{lang === 'mk' ? 'Нарачки во порака' : 'DM Ordering'}</a>
          <span>Instagram: @vyro.mk</span>
        </div>

        <div className="footer-col">
          <h3 className="footer-heading">{lang === 'mk' ? 'Биди прв за нови дропови' : 'Drop Alerts'}</h3>
          <p className="footer-sub">
            {lang === 'mk'
              ? 'Добиј известување кога пристигнуваат нови модели и попуст.'
              : 'Get early access when limited sneakers and restocks land.'}
          </p>
          <form className="drop-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === 'mk' ? 'Твојата е-пошта' : 'Your email'}
              aria-label="Email for drop alerts"
            />
            <button type="submit" className="btn btn-lime">
              {lang === 'mk' ? 'Пријави се' : 'Join'}
            </button>
          </form>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} VYRO MK. All rights reserved.</span>
        <span>Skopje, North Macedonia</span>
      </div>
    </footer>
  )
}
