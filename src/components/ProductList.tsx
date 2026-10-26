import { useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { formatPrice } from '../utils/formatPrice'
import { discountPercent } from '../utils/promo'
import type { Product } from '../types'
import { shop, useShop } from '../store/shop'
import { useReveal } from '../hooks/useReveal'
import Icon from './icons'
import ProductImage from './ProductImage'

interface Props {
  products: Product[]
  getQty: (productId: string, size: string) => number
  onAdd: (productId: string, size: string) => void
  onSetQuantity: (productId: string, size: string, quantity: number) => void
  onReset: () => void
}

export default function ProductList({ products, getQty, onAdd, onSetQuantity, onReset }: Props) {
  const { saved } = useShop()
  const grid = useRef<HTMLUListElement>(null)
  useReveal(grid, '.product-card', [products])
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
    <ul className="product-grid" ref={grid}>
      {products.map((p, index) => {
        const size = p.sizes[0]
        const qty = getQty(p.id, size)
        const categoryName = categories.find((c) => c.id === p.category)?.name
        const discount = discountPercent(p)
        return (
          <li key={p.id} className="product-card" style={{ '--i': index } as CSSProperties}>
            <div className="card-media">
              <Link to={`/products/${p.id}`} tabIndex={-1} aria-hidden="true">
                <ProductImage src={p.image} alt="" lazy />
              </Link>
              {p.stock === 0 ? (
                <span className="badge-soldout">Дууссан</span>
              ) : discount > 0 ? (
                <span className="badge-sale">-{discount}%</span>
              ) : null}
              <button
                type="button"
                className={saved.includes(p.id) ? 'fav-btn active' : 'fav-btn'}
                aria-pressed={saved.includes(p.id)}
                aria-label={`Хадгалах: ${p.name}`}
                onClick={() => shop.toggleSaved(p.id)}
              >
                <Icon name="heart" size={20} />
              </button>
            </div>
            <Link to={`/products/${p.id}`} className="card-body">
              {categoryName && <p className="card-cat">{categoryName}</p>}
              <h3>{p.name}</h3>
              <p className={p.oldPrice ? 'price on-sale' : 'price'}>
                {formatPrice(p.price)}
                {p.oldPrice && <s className="price-old">{formatPrice(p.oldPrice)}</s>}
              </p>
              {p.promoLabel && <p className="promo-chip">{p.promoLabel}</p>}
            </Link>
            <div className="card-actions">
              {p.stock === 0 ? (
                <button type="button" className="add-to-cart card-add" disabled>
                  Дууссан
                </button>
              ) : qty > 0 ? (
                <div className="stepper card-stepper" role="group" aria-label={`${p.name}, тоо`}>
                  <button type="button" aria-label="Хасах" onClick={() => onSetQuantity(p.id, size, qty - 1)}>−</button>
                  <span aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Нэмэх" onClick={() => onAdd(p.id, size)}>+</button>
                </div>
              ) : (
                <button
                  type="button"
                  className="add-to-cart card-add"
                  aria-label={`Сагсанд нэмэх: ${p.name}`}
                  onClick={() => onAdd(p.id, size)}
                >
                  Сагсанд нэмэх
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
