import { categories, categoriesOf, groups } from '../data/categories'
import { products } from '../data/products'
import type { Category, Group } from '../types'

interface Props {
  group: Group | null
  sub: Category | null
  onGroup: (group: Group | null) => void
  onSub: (sub: Category | null) => void
}

const countIn = (allowed: Category[] | null) =>
  allowed === null ? products.length : products.filter((p) => allowed.includes(p.category)).length

export default function CategoryFilter({ group, sub, onGroup, onSub }: Props) {
  const subs = group === 'food' ? categories.filter((c) => c.group === 'food') : []
  return (
    <>
      <div className="chips" role="group" aria-label="Бүлэг">
        <button type="button" className={group === null ? 'chip chip-active' : 'chip'} aria-pressed={group === null} onClick={() => onGroup(null)}>
          Бүгд <span className="chip-count">{countIn(null)}</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            className={g.id === group ? 'chip chip-active' : 'chip'}
            aria-pressed={g.id === group}
            onClick={() => onGroup(g.id)}
          >
            {g.name} <span className="chip-count">{countIn(categoriesOf(g.id))}</span>
          </button>
        ))}
      </div>
      {subs.length > 0 && (
        <div className="chips chips-sub" role="group" aria-label="Хүнсний ангилал">
          <button type="button" className={sub === null ? 'chip chip-active' : 'chip'} aria-pressed={sub === null} onClick={() => onSub(null)}>
            Бүх хүнс
          </button>
          {subs.map((c) => (
            <button
              key={c.id}
              type="button"
              className={c.id === sub ? 'chip chip-active' : 'chip'}
              aria-pressed={c.id === sub}
              onClick={() => onSub(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
