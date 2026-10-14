import { formatPrice } from '../utils/formatPrice'
import type { Product } from '../types'

export default function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="empty">Бараа олдсонгүй</p>
  }
  return (
    <ul className="product-grid">
      {products.map((p) => (
        <li key={p.id} className="product-card">
          <img src={p.image} alt="" loading="lazy" />
          <h3>{p.name}</h3>
          <p className="price">{formatPrice(p.price)}</p>
          {p.stock === 0 && <p className="sold-out">Дууссан</p>}
        </li>
      ))}
    </ul>
  )
}
