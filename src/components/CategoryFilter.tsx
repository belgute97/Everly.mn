import { categories, categoriesOf, groups } from '../data/categories'
import type { Category, Group, Product } from '../types'

interface Props {
  source: Product[] // тоог бодох бараанууд (бүгд эсвэл зөвхөн хямдралтай)
  group: Group | null
  sub: Category | null
  onGroup: (group: Group | null) => void
  onSub: (sub: Category | null) => void
}

export default function CategoryFilter({ source, group, sub, onGroup, onSub }: Props) {
  const countIn = (allowed: Category[] | null) =>
    allowed === null ? source.length : source.filter((p) => allowed.includes(p.category)).length
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
