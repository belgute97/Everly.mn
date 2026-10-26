import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide, useSwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import { groups } from '../data/categories'
import { products } from '../data/products'
import { discountPercent, isPromo } from '../utils/promo'
import './Posters.css'

gsap.registerPlugin(ScrollTrigger)

const img = (name: string) => `/images/products/${name}.webp`
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Scroll хийхэд доороос зөөлөн гарч ирэх хэсэг
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced()) return
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* ---------- 1. Дэлгэц дүүрэн hero слайд ---------- */

const SLIDES = [
  { cls: 'poster-coral', ghost: 'FASHION', chip: 'Шинэ', eyebrow: 'Шинэ улирал', title: 'Таны хэв маяг эндээс эхэлнэ', text: 'Эмэгтэй, эрэгтэй, хүүхдийн хувцасны шинэ цуглуулга.', to: '/?group=women', photos: ['women-01', 'women-04', 'women-09'] },
  { cls: 'poster-indigo', ghost: 'TECH', chip: 'Топ', eyebrow: 'Технологи', title: 'Ухаалаг утас, ухаалаг сонголт', text: 'Утас болон гар утасны хэрэгсэл нэг дор, баталгаатай.', to: '/?group=tech', photos: ['tech-01', 'tech-03', 'tech-06'] },
  { cls: 'poster-green', ghost: 'FRESH', chip: 'Шинэхэн', eyebrow: 'Хүнс', title: 'Шинэхэн хүнс шууд хаалганд чинь', text: 'Ногоо, мах, цагаан идээг өдөр бүр шинэхнээр.', to: '/?group=food', photos: ['veggie-box', 'beef', 'airag'] },
  { cls: 'poster-sun', ghost: 'HOME', chip: '-30%', eyebrow: 'Гал тогоо', title: 'Гэрийн тав тухыг нэмэх хэрэгсэл', text: 'Гал тогооны хэрэгсэл, цахилгаан бараа хямдралтай.', to: '/?group=kitchen', photos: ['kitchen-02', 'kitchen-06', 'appliances-03'] },
]

function SlideBody({ s }: { s: (typeof SLIDES)[number] }) {
  const { isActive } = useSwiperSlide()
  const root = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (!isActive || !root.current || reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.hs-copy > *', { y: 50, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 })
      gsap.from('.hs-card', { y: 120, rotate: 0, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.15 })
      gsap.from('.hs-blob', { scale: 0.4, opacity: 0, duration: 1.2, ease: 'power3.out' })
      gsap.from('.hs-ghost', { xPercent: 12, opacity: 0, duration: 1.4, ease: 'power3.out' })
    }, root)
    return () => ctx.revert()
  }, [isActive])
  return (
    <Link to={s.to} ref={root} className={`hs ${s.cls}`}>
      <span className="hs-ghost" aria-hidden="true">{s.ghost}</span>
      <div className="hs-copy">
        <p className="hs-eyebrow">{s.eyebrow}</p>
        <h1>{s.title}</h1>
        <p className="hs-text">{s.text}</p>
        <span className="hs-btn">Худалдан авалт эхлэх →</span>
      </div>
      <div className="hs-art" aria-hidden="true">
        <span className="hs-blob" />
        {s.photos.map((p, i) => (
          <img key={p} className={`hs-card hs-card-${i + 1}`} src={img(p)} alt="" loading="eager" />
        ))}
        <span className="hs-chip">{s.chip}</span>
      </div>
    </Link>
  )
}

export function HeroSlider() {
  return (
    <section className="hero-slider" aria-label="Онцлох">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{ delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true }}
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.title}>
            <SlideBody s={s} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

/* ---------- 2. Ангиллын зурагтай tile ---------- */

const TILE_IMAGES: Record<string, string> = {
  food: 'veggie-box',
  women: 'women-02',
  men: 'men-03',
  kids: 'kids-02',
  kitchen: 'kitchen-04',
  appliances: 'appliances-05',
  tech: 'tech-04',
}

export function Tiles() {
  return (
    <ul className="tiles">
      {groups.map((g) => (
        <li key={g.id}>
          <Link to={`/?group=${g.id}`} className="tile">
            <span className="tile-img">
              <img src={img(TILE_IMAGES[g.id])} alt="" loading="lazy" />
            </span>
            <span className="tile-name">{g.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* ---------- 3. Дунд хэсгийн гурван өндөр постер ---------- */

const TRIO = [
  { cls: 'poster-rose', eyebrow: 'Хямдрал', title: 'Улирлын том хямдрал', to: '/sale', photo: 'tech-02' },
  { cls: 'poster-teal', eyebrow: 'Хүүхдэд', title: 'Хүүхдийн дулаахан хувцас', to: '/?group=kids', photo: 'kids-05' },
  { cls: 'poster-indigo', eyebrow: 'Эрэгтэй', title: 'Эрэгтэй хувцасны шинэ загвар', to: '/?group=men', photo: 'men-05' },
]

export function PosterTrio() {
  const promo = products.filter(isPromo)
  const max = Math.max(0, ...promo.map(discountPercent))
  return (
    <Reveal className="trio">
      {TRIO.map((t, i) => (
        <Link key={t.title} to={t.to} className={`trio-card ${t.cls}`}>
          <p className="hs-eyebrow">{t.eyebrow}</p>
          <h2>{i === 0 && max > 0 ? `${max}% хүртэл хямдрал` : t.title}</h2>
          <span className="hs-btn">Үзэх →</span>
          <img src={img(t.photo)} alt="" loading="lazy" />
        </Link>
      ))}
    </Reveal>
  )
}

/* ---------- 4. Гүйдэг мөр ---------- */

const WORDS = ['Үнэгүй хүргэлт', 'Шинэ бараа өдөр бүр', 'Хямдрал, урамшуулал', 'Баталгаатай чанар', 'Хурдан хүргэлт']

export function Marquee() {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-row" key={k}>
            {row.map((w, i) => (
              <span key={i}>{w}<b>✦</b></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- 5. Хоёр хуваагдсан постер (зураг | текст) ---------- */

export function SplitPoster({ reverse = false }: { reverse?: boolean }) {
  return (
    <Reveal className={reverse ? 'split split-reverse' : 'split'}>
      <div className="split-photos">
        {['veggie-box', 'beef', 'airag', 'yogurt'].map((p, i) => (
          <img key={p} className={`split-img split-img-${i + 1}`} src={img(p)} alt="" loading="lazy" />
        ))}
      </div>
      <div className="split-copy poster-green">
        <p className="hs-eyebrow">Өдөр тутмын хүнс</p>
        <h2>Шинэхэн, чанартай, найдвартай</h2>
        <p>Ногоо, мах, цагаан идээг сонгоод хүргүүлээрэй.</p>
        <Link to="/?group=food" className="hs-btn">Хүнс үзэх →</Link>
      </div>
    </Reveal>
  )
}

/* ---------- 6. Төгсгөлийн том постер ---------- */

export function EndPoster() {
  return (
    <Reveal className="end">
      <div className="end-photos" aria-hidden="true">
        {['women-06', 'tech-05', 'kitchen-08', 'kids-08', 'men-07'].map((p) => (
          <img key={p} src={img(p)} alt="" loading="lazy" />
        ))}
      </div>
      <h2>Хүссэн бүхнээ нэг дороос</h2>
      <p>Хүнс, хувцас, технологи — Everly-д бүгд байна.</p>
      <button type="button" className="hs-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Дахин сонголт хийх ↑
      </button>
    </Reveal>
  )
}
