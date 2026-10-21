import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { formatPrice } from '../utils/formatPrice'
import { discountPercent, isPromo } from '../utils/promo'
import Icon from './icons'
import ProductImage from './ProductImage'
import './PromoRail.css'

const AUTOPLAY_MS = 5000

// Нүүрний сурталчилгааны хэсэг: хямдралтай, урамшуулалтай барааг 5 секунд тутамд автоматаар гүйлгэнэ
export default function PromoRail() {
  const rail = useRef<HTMLUListElement>(null)
  const [hover, setHover] = useState(false) // хулгана, фокус байхад түр зогсоно
  const [stopped, setStopped] = useState(false) // хэрэглэгч өөрөө зогсоосон
  const promoProducts = products
    .filter((p) => isPromo(p) && p.stock > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 12)
  const maxDiscount = Math.max(0, ...promoProducts.map(discountPercent))

  const step = () => {
    const el = rail.current
    const card = el?.querySelector<HTMLElement>('.promo-card')
    if (!el || !card) return 280
    return card.getBoundingClientRect().width + 14
  }

  const scrollBy = (dir: number) => rail.current?.scrollBy({ left: dir * step(), behavior: 'smooth' })

  useEffect(() => {
    if (hover || stopped) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => {
      const el = rail.current
      if (!el || document.hidden) return
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
      else el.scrollBy({ left: step(), behavior: 'smooth' })
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [hover, stopped])

  return (
    <section
      className="promo"
      aria-labelledby="promo-title"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="promo-head">
        <h2 id="promo-title">Хямдрал, урамшуулал</h2>
        <div className="promo-nav">
          <button
            type="button"
            aria-label={stopped ? 'Автоматаар гүйлгэхийг үргэлжлүүлэх' : 'Автоматаар гүйлгэхийг зогсоох'}
            aria-pressed={stopped}
            onClick={() => setStopped(!stopped)}
          >
            <Icon name={stopped ? 'play' : 'pause'} size={18} />
          </button>
          <button type="button" aria-label="Өмнөх" onClick={() => scrollBy(-1)}>
            <Icon name="arrowLeft" size={20} />
          </button>
          <button type="button" aria-label="Дараах" onClick={() => scrollBy(1)}>
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      </div>
      <ul className="promo-rail" ref={rail}>
        <li className="promo-banner">
          <p className="promo-eyebrow">Улирлын хямдрал</p>
          <p className="promo-big">{maxDiscount}% хүртэл</p>
          <p className="promo-sub">Сонгосон бараанд хямдрал, бэлэг, үнэгүй хүргэлт.</p>
          <Link to="/sale" className="promo-cta">
            Бүгдийг үзэх <Icon name="arrowRight" size={18} />
          </Link>
        </li>
        {promoProducts.map((p) => (
          <li key={p.id} className="promo-card">
            <Link to={`/products/${p.id}`}>
              <div className="promo-media">
                <ProductImage src={p.image} alt="" lazy />
                <span className="badge-sale">{discountPercent(p) > 0 ? `-${discountPercent(p)}%` : p.promoLabel}</span>
              </div>
              <h3>{p.name}</h3>
              <p className={p.oldPrice ? 'price on-sale' : 'price'}>
                {formatPrice(p.price)}
                {p.oldPrice && <s className="price-old">{formatPrice(p.oldPrice)}</s>}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
