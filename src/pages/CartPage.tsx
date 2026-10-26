import { Link } from 'react-router-dom'
import { Lottie } from 'lottie-react'
import pulse from '../animations/emptyCart.json'
import CartItemRow from '../components/CartItemRow'
import { products } from '../data/products'
import { formatPrice } from '../utils/formatPrice'
import type { CartItem } from '../types'
import './CartPage.css'

interface Props {
  items: CartItem[]
  maxFor: (productId: string, size: string) => number
  onSetQuantity: (productId: string, size: string, quantity: number) => void
  onRemove: (productId: string, size: string) => void
}

export default function CartPage({ items, maxFor, onSetQuantity, onRemove }: Props) {
  const rows = items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId)
    return product ? [{ item, product }] : []
  })

  if (rows.length === 0) {
    return (
      <section className="center-page">
        <Lottie src={pulse} loop className="empty-lottie" aria-hidden="true" />
        <h1>Сагс хоосон байна</h1>
        <p className="muted">Дуртай бараагаа сонгоод сагсандаа нэмээрэй.</p>
        <Link to="/" className="btn-primary">Дэлгүүр рүү буцах</Link>
      </section>
    )
  }

  const total = rows.reduce((sum, r) => sum + r.product.price * r.item.quantity, 0)

  return (
    <section className="cart-page">
      <h1>Сагс</h1>
      <Link to="/" className="back-link">← Үргэлжлүүлэн сонгох</Link>
      <ul className="cart-list">
        {rows.map(({ item, product }) => (
          <CartItemRow
            key={`${item.productId}-${item.size}`}
            item={item}
            product={product}
            max={maxFor(item.productId, item.size)}
            onSetQuantity={onSetQuantity}
            onRemove={onRemove}
          />
        ))}
      </ul>
      <p className="cart-total">Нийт: <strong>{formatPrice(total)}</strong></p>
      <Link to="/checkout" className="btn-primary">Захиалах</Link>
    </section>
  )
}
