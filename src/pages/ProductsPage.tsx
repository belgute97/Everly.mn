import { useSearchParams } from 'react-router-dom'
import CategoryBanner from '../components/CategoryBanner'
import CategoryFilter from '../components/CategoryFilter'
import ProductList from '../components/ProductList'
import PromoRail from '../components/PromoRail'
import SearchBox from '../components/SearchBox'
import { categoriesOf, groups } from '../data/categories'
import { productSub, subcategories } from '../data/subcategories'
import { products } from '../data/products'
import type { Group } from '../types'
import { filterProducts } from '../utils/filterProducts'
import { isPromo } from '../utils/promo'

interface Props {
  getQty: (productId: string, size: string) => number
  onAdd: (productId: string, size: string) => void
  onSetQuantity: (productId: string, size: string, quantity: number) => void
  saleOnly?: boolean // true бол зөвхөн хямдралтай, урамшуулалтай бараа
}

export default function ProductsPage({ getQty, onAdd, onSetQuantity, saleOnly = false }: Props) {
  // Хайлт, бүлэг, ангиллыг URL-д хадгална: дэлгэрэнгүй хуудаснаас буцахад, цэснээс орхад ажиллана
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const group = groups.find((g) => g.id === params.get('group'))?.id ?? null
  const sub = group ? (subcategories[group].find((s) => s.id === params.get('sub'))?.id ?? null) : null

  const update = (next: { q?: string; group?: Group | null; sub?: string | null }) => {
    const q = next.q ?? query
    const g = next.group === undefined ? group : next.group
    const s = next.group !== undefined ? null : next.sub === undefined ? sub : next.sub
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (g) p.set('group', g)
    if (s) p.set('sub', s)
    setParams(p, { replace: true })
  }

  const source = saleOnly ? products.filter(isPromo) : products
  const allowed = group ? categoriesOf(group) : null
  const visible = filterProducts(source, allowed, query).filter((p) => !sub || productSub[p.id] === sub)

  return (
    <>
      {saleOnly ? (
        <section className="hero sale-hero">
          <h1>Хямдрал, урамшуулал</h1>
          <p>Зөвхөн хямдралтай болон урамшуулалтай бараанууд: {source.length} бараа.</p>
        </section>
      ) : (
        <section className="hero">
          <h1>Хүнс, хувцас, технологи нэг дор</h1>
          <p>Хэрэгтэй бүхнээ сонгоод сагсандаа нэмээрэй: хүнс, хувцас, гал тогоо, цахилгаан бараа, технологи.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Бараа үзэх
          </button>
        </section>
      )}
      {!saleOnly && query === '' && !group && <PromoRail />}
      <div id="products">
        <SearchBox value={query} onChange={(q) => update({ q })} />
        <CategoryFilter source={source} group={group} sub={sub} onGroup={(g) => update({ group: g })} onSub={(s) => update({ sub: s })} />
        {group && sub && <CategoryBanner group={group} subId={sub} />}
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
