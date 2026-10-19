import { formatPrice } from '../utils/formatPrice'
import type { CartItem, Product } from '../types'
import ProductImage from './ProductImage'
import './CartItemRow.css'

interface Props {
  item: CartItem
  product: Product
  max: number
  onSetQuantity: (productId: string, size: string, quantity: number) => void
  onRemove: (productId: string, size: string) => void
}

export default function CartItemRow({ item, product, max, onSetQuantity, onRemove }: Props) {
  const { productId, size, quantity } = item
  return (
    <li className="cart-row">
      <ProductImage src={product.image} alt="" className="cart-img" />
      <div className="cart-info">
        <h3>{product.name}</h3>
        <p className="cart-size">Размер: {size}</p>
        <p className="price">{formatPrice(product.price * quantity)}</p>
        <div className="cart-controls">
          <div className="stepper" role="group" aria-label="Тоо">
            <button type="button" aria-label="Хасах" disabled={quantity <= 1} onClick={() => onSetQuantity(productId, size, quantity - 1)}>−</button>
            <span aria-live="polite">{quantity}</span>
            <button type="button" aria-label="Нэмэх" disabled={quantity >= max} onClick={() => onSetQuantity(productId, size, quantity + 1)}>+</button>
          </div>
          <button type="button" className="cart-remove" onClick={() => onRemove(productId, size)}>Устгах</button>
        </div>
        {quantity >= max && <p className="cart-limit">Үлдэгдэл {max} ширхэг</p>}
      </div>
    </li>
  )
}
