import { categories } from '../data/categories'
import type { Category, Product } from '../types'

// allowed нь null бол бүх ангилал. Хайлт нэр, тайлбар, ангиллын нэрээр, том/жижиг үсэг ялгахгүй.
export function filterProducts(
  products: Product[],
  allowed: Category[] | null,
  query: string,
): Product[] {
  const q = query.trim().toLowerCase()
  return products.filter((p) => {
    if (allowed !== null && !allowed.includes(p.category)) return false
    if (q === '') return true
    const categoryName = categories.find((c) => c.id === p.category)?.name ?? ''
    return `${p.name} ${p.description} ${categoryName}`.toLowerCase().includes(q)
  })
}
