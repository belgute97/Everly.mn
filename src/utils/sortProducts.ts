import type { Product } from '../types'

export const SORT_OPTIONS = [
  { id: 'default', label: 'Анхдагч' },
  { id: 'price-asc', label: 'Үнэ: багаас их' },
  { id: 'price-desc', label: 'Үнэ: ихээс бага' },
  { id: 'name-asc', label: 'Нэр: А → Я' },
  { id: 'name-desc', label: 'Нэр: Я → А' },
] as const

export type SortId = (typeof SORT_OPTIONS)[number]['id']

export const parseSort = (value: string | null): SortId =>
  SORT_OPTIONS.find((o) => o.id === value)?.id ?? 'default'

// Анхдагч бол эх дарааллыг хэвээр үлдээнэ. Үнэ тэнцүү бол нэрээр эрэмбэлнэ
export function sortProducts(list: Product[], sort: SortId): Product[] {
  if (sort === 'default') return list
  const byName = (a: Product, b: Product) => a.name.localeCompare(b.name, 'mn')
  const sorted = [...list]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price || byName(a, b))
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price || byName(a, b))
    case 'name-asc':
      return sorted.sort(byName)
    case 'name-desc':
      return sorted.sort((a, b) => byName(b, a))
  }
}
