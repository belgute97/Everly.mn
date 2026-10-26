import { useSearchParams } from 'react-router-dom'
import { EndPoster, HeroSlider, Marquee, PosterTrio, SplitPoster, Tiles } from '../components/Posters'
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
import { parseSort, SORT_OPTIONS, sortProducts, type SortId } from '../utils/sortProducts'

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

  const sort = parseSort(params.get('sort'))

  const update = (next: { q?: string; group?: Group | null; sub?: string | null; sort?: SortId }) => {
    const q = next.q ?? query
    const g = next.group === undefined ? group : next.group
    const s = next.group !== undefined ? null : next.sub === undefined ? sub : next.sub
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (g) p.set('group', g)
    if (s) p.set('sub', s)
    const o = next.sort ?? sort
    if (o !== 'default') p.set('sort', o)
    setParams(p, { replace: true })
  }

  const source = saleOnly ? products.filter(isPromo) : products
  const allowed = group ? categoriesOf(group) : null
  const visible = filterProducts(source, allowed, query).filter((p) => !sub || productSub[p.id] === sub)
  const sorted = sortProducts(visible, sort)

  const home = !saleOnly && query === '' && !group

  return (
    <>
      {saleOnly ? (
        <section className="hero sale-hero">
          <h1>Хямдрал, урамшуулал</h1>
          <p>Зөвхөн хямдралтай болон урамшуулалтай бараанууд: {source.length} бараа.</p>
        </section>
      ) : home ? (
        <>
          <HeroSlider />
          <Tiles />
        </>
      ) : null}
      {home && (
        <>
          <PromoRail />
          <PosterTrio />
          <Marquee />
          <SplitPoster />
        </>
      )}
      <div id="products">
        <SearchBox value={query} onChange={(q) => update({ q })} />
        <CategoryFilter source={source} group={group} sub={sub} onGroup={(g) => update({ group: g })} onSub={(s) => update({ sub: s })} />
        {group && sub && <CategoryBanner group={group} subId={sub} />}
        <div className="sort-row">
          <p className="result-count" aria-live="polite">{visible.length} бараа</p>
          <label className="sort-label">
            Эрэмбэлэх
            <select value={sort} onChange={(e) => update({ sort: parseSort(e.target.value) })}>
              {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </label>
        </div>
        <ProductList
          products={sorted}
          getQty={getQty}
          onAdd={onAdd}
          onSetQuantity={onSetQuantity}
          onReset={() => setParams({}, { replace: true })}
        />
      </div>
      {home && <EndPoster />}
    </>
  )
}
