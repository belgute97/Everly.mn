import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { products } from '../data/products'
import { formatPrice } from '../utils/formatPrice'
import './ProductDetailPage.css'

export default function ProductDetailPage({ onAdd }: { onAdd: (productId: string, size: string) => void }) {
  const { id } = useParams()
  const product = products.find((p) => p.id === id)
  const [size, setSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <>
        <Link to="/" className="back-link">← Буцах</Link>
        <p className="empty">Бараа олдсонгүй</p>
      </>
    )
  }

  const selected = size ?? product.sizes[0]
  const soldOut = product.stock === 0

  return (
    <article className="product-detail">
      <Link to="/" className="back-link">← Буцах</Link>
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p className="price">{formatPrice(product.price)}</p>
      <p>{product.description}</p>
      <div className="size-options" role="group" aria-label="Размер">
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
      {soldOut && <p className="sold-out">Дууссан</p>}
      <button
        type="button"
        className="add-to-cart"
        disabled={soldOut}
        onClick={() => {
          onAdd(product.id, selected)
          setAdded(true)
        }}
      >
        Сагсанд нэмэх
      </button>
      <p className="added-note" role="status">
        {added ? 'Сагсанд нэмэгдлээ' : ''}
      </p>
    </article>
  )
}
