import { useState } from 'react'
import CategoryFilter from '../components/CategoryFilter'
import ProductList from '../components/ProductList'
import SearchBox from '../components/SearchBox'
import { products } from '../data/products'
import type { Category } from '../types'
import { filterProducts } from '../utils/filterProducts'

export default function ProductsPage({ onAdd }: { onAdd: (productId: string, size: string) => void }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [query, setQuery] = useState('')
  const visible = filterProducts(products, category, query)

  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <CategoryFilter selected={category} onSelect={setCategory} />
      <ProductList products={visible} onAdd={onAdd} />
    </>
  )
}
