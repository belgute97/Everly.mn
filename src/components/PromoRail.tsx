import { useRef, useState } from 'react'
import { Autoplay, FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { formatPrice } from '../utils/formatPrice'
import { discountPercent, isPromo } from '../utils/promo'
import Icon from './icons'
import ProductImage from './ProductImage'
import './PromoRail.css'

// Нүүрний сурталчилгааны хэсэг: Swiper-ээр хямдралтай барааг автоматаар гүйлгэнэ
export default function PromoRail() {
  const swiper = useRef<SwiperType | null>(null)
  const [stopped, setStopped] = useState(false) // хэрэглэгч өөрөө зогсоосон
  const promoProducts = products
    .filter((p) => isPromo(p) && p.stock > 0)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, 12)
  const maxDiscount = Math.max(0, ...promoProducts.map(discountPercent))

  const toggle = () => {
    if (stopped) swiper.current?.autoplay.start()
    else swiper.current?.autoplay.stop()
    setStopped(!stopped)
  }

  return (
    <section
      className="promo"
      aria-labelledby="promo-title"
    >
      <div className="promo-head">
        <h2 id="promo-title">Хямдрал, урамшуулал</h2>
        <div className="promo-nav">
          <button
            type="button"
            aria-label={stopped ? 'Автоматаар гүйлгэхийг үргэлжлүүлэх' : 'Автоматаар гүйлгэхийг зогсоох'}
            aria-pressed={stopped}
            onClick={toggle}
          >
            <Icon name={stopped ? 'play' : 'pause'} size={18} />
          </button>
          <button type="button" aria-label="Өмнөх" onClick={() => swiper.current?.slidePrev()}>
            <Icon name="arrowLeft" size={20} />
          </button>
          <button type="button" aria-label="Дараах" onClick={() => swiper.current?.slideNext()}>
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      </div>
      <Swiper
        className="promo-rail"
        modules={[Autoplay, FreeMode]}
        slidesPerView="auto"
        spaceBetween={14}
        freeMode={{ enabled: true, sticky: true }}
        autoplay={{ delay: 4500, pauseOnMouseEnter: true, disableOnInteraction: false }}
        onSwiper={(sw) => (swiper.current = sw)}
      >
        <SwiperSlide className="promo-banner">
          <p className="promo-eyebrow">Улирлын хямдрал</p>
          <p className="promo-big">{maxDiscount}% хүртэл</p>
          <p className="promo-sub">Сонгосон бараанд хямдрал, бэлэг, үнэгүй хүргэлт.</p>
          <Link to="/sale" className="promo-cta">
            Бүгдийг үзэх <Icon name="arrowRight" size={18} />
          </Link>
        </SwiperSlide>
        {promoProducts.map((p) => (
          <SwiperSlide key={p.id} className="promo-card">
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
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
