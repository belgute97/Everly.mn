import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { formatPrice } from '../utils/formatPrice'
import { discountPercent, isPromo } from '../utils/promo'
import Icon from './icons'
import ProductImage from './ProductImage'
import './PromoRail.css'

// Нүүрний сурталчилгааны хэсэг: хямдралтай, урамшуулалтай барааг хажуу тийш гүйлгэж үзнэ
export default function PromoRail() {
  const rail = useRef<HTMLUListElement>(null)
  const promoProducts = products
    .filter((p) => isPromo(p) && p.stock > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 12)
  const maxDiscount = Math.max(0, ...promoProducts.map(discountPercent))

  const scrollBy = (dir: number) => rail.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })

  return (
    <section className="promo" aria-labelledby="promo-title">
      <div className="promo-head">
        <h2 id="promo-title">Хямдрал, урамшуулал</h2>
        <div className="promo-nav">
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
                {discountPercent(p) > 0 ? (
                  <span className="badge-sale">-{discountPercent(p)}%</span>
                ) : (
                  <span className="badge-sale">{p.promoLabel}</span>
                )}
              </div>
              <h3>{p.name}</h3>
              <p className="price">
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
