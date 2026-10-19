import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'
import type { Product } from '../types'
import ProductImage from './ProductImage'

interface Props {
  products: Product[]
  getQty: (productId: string, size: string) => number
  onAdd: (productId: string, size: string) => void
  onSetQuantity: (productId: string, size: string, quantity: number) => void
  onReset: () => void
}

export default function ProductList({ products, getQty, onAdd, onSetQuantity, onReset }: Props) {
  if (products.length === 0) {
    return (
      <div className="center-page">
        <p className="empty">Бараа олдсонгүй</p>
        <button type="button" className="btn-secondary" onClick={onReset}>
          Хайлт, шүүлтүүрийг цэвэрлэх
        </button>
      </div>
    )
  }
  return (
    <ul className="product-grid">
      {products.map((p) => {
        const size = p.sizes[0]
        const qty = getQty(p.id, size)
        return (
          <li key={p.id} className="product-card">
            <div className="card-media">
              <Link to={`/products/${p.id}`} tabIndex={-1} aria-hidden="true">
                <ProductImage src={p.image} alt="" lazy />
              </Link>
              {p.stock === 0 ? (
                <span className="badge-soldout">Дууссан</span>
              ) : qty > 0 ? (
                <div className="stepper card-stepper" role="group" aria-label={`${p.name}, тоо`}>
                  <button type="button" aria-label="Хасах" onClick={() => onSetQuantity(p.id, size, qty - 1)}>−</button>
                  <span aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Нэмэх" onClick={() => onAdd(p.id, size)}>+</button>
                </div>
              ) : (
                <button
                  type="button"
                  className="card-add"
                  aria-label={`Сагсанд нэмэх: ${p.name}`}
                  onClick={() => onAdd(p.id, size)}
                >
                  +
                </button>
              )}
            </div>
            <Link to={`/products/${p.id}`} className="card-body">
              <h3>{p.name}</h3>
              <p className="price">{formatPrice(p.price)}</p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
