import { Link } from 'react-router-dom'
import ProductList from '../components/ProductList'
import { products } from '../data/products'
import { shop, useShop } from '../store/shop'
import './Account.css'

interface Props {
  kind: 'saved' | 'viewed'
  getQty: (productId: string, size: string) => number
  onAdd: (productId: string, size: string) => void
  onSetQuantity: (productId: string, size: string, quantity: number) => void
}

const TEXT = {
  saved: { title: 'Хадгалсан бараа', empty: 'Хадгалсан бараа алга', hint: 'Бараан дээрх зүрхэн дүрсийг дарж хадгална.' },
  viewed: { title: 'Үзсэн бараа', empty: 'Үзсэн бараа алга', hint: 'Таны үзсэн бараанууд энд харагдана.' },
}

export default function ProductCollectionPage({ kind, getQty, onAdd, onSetQuantity }: Props) {
  const state = useShop()
  const list = state[kind].flatMap((id) => products.find((p) => p.id === id) ?? [])
  const t = TEXT[kind]

  if (list.length === 0) {
    return (
      <section className="center-page">
        <h1>{t.empty}</h1>
        <p className="muted">{t.hint}</p>
        <Link to="/" className="btn-primary">Дэлгүүр рүү буцах</Link>
      </section>
    )
  }

  return (
    <section>
      <h1>{t.title}</h1>
      {kind === 'viewed' && (
        <button type="button" className="btn-secondary" onClick={shop.clearViewed}>Түүх цэвэрлэх</button>
      )}
      <p className="result-count">{list.length} бараа</p>
      <ProductList products={list} getQty={getQty} onAdd={onAdd} onSetQuantity={onSetQuantity} onReset={() => {}} />
    </section>
  )
}
