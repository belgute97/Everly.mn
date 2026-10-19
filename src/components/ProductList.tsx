import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'
import type { Product } from '../types'

interface Props {
  products: Product[]
  onAdd: (productId: string, size: string) => void
}

export default function ProductList({ products, onAdd }: Props) {
  if (products.length === 0) {
    return <p className="empty">Бараа олдсонгүй</p>
  }
  return (
    <ul className="product-grid">
      {products.map((p) => (
        <li key={p.id} className="product-card">
          <Link to={`/products/${p.id}`}>
            <img src={p.image} alt="" loading="lazy" />
            <h3>{p.name}</h3>
            <p className="price">{formatPrice(p.price)}</p>
            {p.stock === 0 && <p className="sold-out">Дууссан</p>}
          </Link>
          <button
            type="button"
            className="card-add"
            disabled={p.stock === 0}
            onClick={() => onAdd(p.id, p.sizes[0])}
          >
            Сагсанд нэмэх
          </button>
        </li>
      ))}
    </ul>
  )
}
