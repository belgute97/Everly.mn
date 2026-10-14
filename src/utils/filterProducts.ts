import type { Category, Product } from '../types'

// category нь null бол бүх ангилал. Хайлт нэрээр, том/жижиг үсэг ялгахгүй.
export function filterProducts(
  products: Product[],
  category: Category | null,
  query: string,
): Product[] {
  const q = query.trim().toLowerCase()
  return products.filter(
    (p) =>
      (category === null || p.category === category) &&
      (q === '' || p.name.toLowerCase().includes(q)),
  )
}
