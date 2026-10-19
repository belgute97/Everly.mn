import { useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import ProductList from '../components/ProductList'
import SearchBox from '../components/SearchBox'
import { categories } from '../data/categories'
import { products } from '../data/products'
import type { Category } from '../types'
import { filterProducts } from '../utils/filterProducts'

interface Props {
  getQty: (productId: string, size: string) => number
  onAdd: (productId: string, size: string) => void
  onSetQuantity: (productId: string, size: string, quantity: number) => void
}

export default function ProductsPage({ getQty, onAdd, onSetQuantity }: Props) {
  // Хайлт, ангиллыг URL-д хадгална: дэлгэрэнгүй хуудаснаас буцахад алдагдахгүй
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const cat = params.get('cat')
  const category = categories.find((c) => c.id === cat)?.id ?? null

  const update = (next: { q?: string; cat?: Category | null }) => {
    const p = new URLSearchParams(params)
    const q = next.q ?? query
    const c = next.cat === undefined ? category : next.cat
    if (q) p.set('q', q)
    else p.delete('q')
    if (c) p.set('cat', c)
    else p.delete('cat')
    setParams(p, { replace: true })
  }

  const visible = filterProducts(products, category, query)

  return (
    <>
      <section className="hero">
        <h1>Шинэхэн хүнс гэрт тань</h1>
        <p>Ногоо, мах, цагаан идээг сонгоод сагсандаа нэмээрэй.</p>
      </section>
      <SearchBox value={query} onChange={(q) => update({ q })} />
      <CategoryFilter selected={category} onSelect={(c) => update({ cat: c })} />
      <ProductList
        products={visible}
        getQty={getQty}
        onAdd={onAdd}
        onSetQuantity={onSetQuantity}
        onReset={() => setParams({}, { replace: true })}
      />
    </>
  )
}
