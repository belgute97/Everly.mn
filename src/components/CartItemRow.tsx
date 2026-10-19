import { formatPrice } from '../utils/formatPrice'
import type { CartItem, Product } from '../types'
import './CartItemRow.css'

interface Props {
  item: CartItem
  product: Product
  onSetQuantity: (productId: string, size: string, quantity: number) => void
  onRemove: (productId: string, size: string) => void
}

export default function CartItemRow({ item, product, onSetQuantity, onRemove }: Props) {
  const { productId, size, quantity } = item
  return (
    <li className="cart-row">
      <img src={product.image} alt="" />
      <div className="cart-info">
        <h3>{product.name}</h3>
        <p className="cart-size">Размер: {size}</p>
        <p className="price">{formatPrice(product.price * quantity)}</p>
        <div className="cart-controls">
          <button type="button" aria-label="Хасах" onClick={() => onSetQuantity(productId, size, quantity - 1)}>−</button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" aria-label="Нэмэх" onClick={() => onSetQuantity(productId, size, quantity + 1)}>+</button>
          <button type="button" className="cart-remove" onClick={() => onRemove(productId, size)}>Устгах</button>
        </div>
      </div>
    </li>
  )
}
