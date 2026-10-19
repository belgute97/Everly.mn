import { useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import ProductList from '../components/ProductList'
import SearchBox from '../components/SearchBox'
import { categories, categoriesOf, groups } from '../data/categories'
import { products } from '../data/products'
import type { Category, Group } from '../types'
import { filterProducts } from '../utils/filterProducts'

interface Props {
  getQty: (productId: string, size: string) => number
  onAdd: (productId: string, size: string) => void
  onSetQuantity: (productId: string, size: string, quantity: number) => void
}

export default function ProductsPage({ getQty, onAdd, onSetQuantity }: Props) {
  // Хайлт, бүлэг, ангиллыг URL-д хадгална: дэлгэрэнгүй хуудаснаас буцахад, цэснээс орхад ажиллана
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const group = groups.find((g) => g.id === params.get('group'))?.id ?? null
  const sub = group === 'food' ? (categories.find((c) => c.id === params.get('cat') && c.group === 'food')?.id ?? null) : null

  const update = (next: { q?: string; group?: Group | null; sub?: Category | null }) => {
    const q = next.q ?? query
    const g = next.group === undefined ? group : next.group
    const s = next.group !== undefined ? null : next.sub === undefined ? sub : next.sub
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (g) p.set('group', g)
    if (s) p.set('cat', s)
    setParams(p, { replace: true })
  }

  const allowed = sub ? [sub] : group ? categoriesOf(group) : null
  const visible = filterProducts(products, allowed, query)

  return (
    <>
      <section className="hero">
        <h1>Хүнс, хувцас, гал тогоо нэг дор</h1>
        <p>Хэрэгтэй бүхнээ сонгоод сагсандаа нэмээрэй: хүнс, эмэгтэй, эрэгтэй, хүүхдийн хувцас, гал тогооны хэрэгсэл.</p>
        <button
          type="button"
          className="btn-primary"
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Бараа үзэх
        </button>
        <ul className="hero-points">
          {groups.map((g) => (
            <li key={g.id}>{g.name}</li>
          ))}
        </ul>
      </section>
      <div id="products">
        <SearchBox value={query} onChange={(q) => update({ q })} />
        <CategoryFilter group={group} sub={sub} onGroup={(g) => update({ group: g })} onSub={(s) => update({ sub: s })} />
        <p className="result-count" aria-live="polite">{visible.length} бараа</p>
        <ProductList
          products={visible}
          getQty={getQty}
          onAdd={onAdd}
          onSetQuantity={onSetQuantity}
          onReset={() => setParams({}, { replace: true })}
        />
      </div>
    </>
  )
}
