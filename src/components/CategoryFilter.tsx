import { categories } from '../data/categories'
import type { Category } from '../types'

interface Props {
  selected: Category | null
  onSelect: (category: Category | null) => void
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  const options: { id: Category | null; name: string }[] = [
    { id: null, name: 'Бүгд' },
    ...categories,
  ]
  return (
    <div className="chips" role="group" aria-label="Ангилал">
      {options.map((o) => (
        <button
          key={o.id ?? 'all'}
          type="button"
          className={o.id === selected ? 'chip chip-active' : 'chip'}
          aria-pressed={o.id === selected}
          onClick={() => onSelect(o.id)}
        >
          {o.name}
        </button>
      ))}
    </div>
  )
}
