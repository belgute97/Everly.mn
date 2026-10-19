import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import { products } from '../data/products'
import { formatPrice } from '../utils/formatPrice'
import NotFoundPage from './NotFoundPage'
import './ProductDetailPage.css'

interface Props {
  getQty: (productId: string, size: string) => number
  onAdd: (productId: string, size: string) => void
}

export default function ProductDetailPage({ getQty, onAdd }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const product = products.find((p) => p.id === id)
  const [size, setSize] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(flashTimer.current), [])

  if (!product) return <NotFoundPage title="Бараа олдсонгүй" />

  const selected = size ?? product.sizes[0]
  const soldOut = product.stock === 0
  const inCart = getQty(product.id, selected)

  // Нүүрнээс ирсэн бол өмнөх хуудас руу (хайлт, ангилал хадгалагдсан) буцна
  const goBack = (e: React.MouseEvent) => {
    if (location.key !== 'default') {
      e.preventDefault()
      navigate(-1)
    }
  }

  return (
    <article className="product-detail">
      <Link to="/" className="back-link" onClick={goBack}>← Буцах</Link>
      <ProductImage src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p className="price">
        {formatPrice(product.price)}
        {product.oldPrice && <s className="price-old">{formatPrice(product.oldPrice)}</s>}
      </p>
      {product.promoLabel && <p className="promo-chip">{product.promoLabel}</p>}
      <p>{product.description}</p>
      {product.sizes.length > 1 && (
        <>
      <p className="size-label" id="size-label">Размер сонгох</p>
      <div className="size-options" role="group" aria-labelledby="size-label">
        {product.sizes.map((s) => (
          <button
            key={s}
            type="button"
            className={s === selected ? 'size-btn active' : 'size-btn'}
            aria-pressed={s === selected}
            onClick={() => setSize(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <p className="muted size-hint">Үнэ бүх размерт ижил.</p>
        </>
      )}
      {soldOut && <p className="sold-out">Дууссан</p>}
      <button
        type="button"
        className={flash ? 'add-to-cart is-added' : 'add-to-cart'}
        disabled={soldOut}
        onClick={() => {
          onAdd(product.id, selected)
          setFlash(true)
          clearTimeout(flashTimer.current)
          flashTimer.current = setTimeout(() => setFlash(false), 1500)
        }}
      >
        {flash ? '✓ Нэмэгдлээ' : 'Сагсанд нэмэх'}
      </button>
      <p className="added-note" role="status">
        {inCart > 0 && (
          <>
            ✓ Сагсанд {inCart} ширхэг байна · <Link to="/cart">Сагс руу очих →</Link>
          </>
        )}
      </p>
    </article>
  )
}
