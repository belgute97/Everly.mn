import { useEffect, useState } from 'react'
import { products } from '../data/products'
import type { CartItem } from '../types'

const STORAGE_KEY = 'everly-cart'

export type AddResult = 'added' | 'soldout' | 'max'

const stockOf = (productId: string) => products.find((p) => p.id === productId)?.stock ?? 0

const same = (a: CartItem, productId: string, size: string) =>
  a.productId === productId && a.size === size

// Хуучин localStorage-д үлдсэн устсан/дууссан бараа, хэт их тоог цэвэрлэнэ
function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return []
  const used: Record<string, number> = {}
  const result: CartItem[] = []
  for (const item of raw as CartItem[]) {
    const product = products.find((p) => p.id === item?.productId)
    if (!product || !product.sizes.includes(item.size)) continue
    const wanted = Math.floor(Number(item.quantity))
    const room = product.stock - (used[product.id] ?? 0)
    const quantity = Math.min(wanted, room)
    if (!(quantity >= 1)) continue
    used[product.id] = (used[product.id] ?? 0) + quantity
    result.push({ productId: product.id, size: item.size, quantity })
  }
  return result
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return sanitize(raw ? JSON.parse(raw) : [])
  } catch {
    return []
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // хадгалж чадахгүй бол санах ойд л байна
    }
  }, [items])

  const quantityOf = (productId: string, size: string) =>
    items.find((i) => same(i, productId, size))?.quantity ?? 0

  // Тухайн барааны бусад размерын тоог хасаад, энэ размерт нэмж болох дээд хэмжээ
  const maxFor = (productId: string, size: string) => {
    const others = items
      .filter((i) => i.productId === productId && i.size !== size)
      .reduce((sum, i) => sum + i.quantity, 0)
    return Math.max(0, stockOf(productId) - others)
  }

  const add = (productId: string, size: string): AddResult => {
    if (stockOf(productId) === 0) return 'soldout'
    if (quantityOf(productId, size) >= maxFor(productId, size)) return 'max'
    setItems((prev) =>
      prev.some((i) => same(i, productId, size))
        ? prev.map((i) => (same(i, productId, size) ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { productId, size, quantity: 1 }],
    )
    return 'added'
  }

  const setQuantity = (productId: string, size: string, quantity: number) => {
    const q = Math.min(quantity, maxFor(productId, size))
    setItems((prev) =>
      q < 1
        ? prev.filter((i) => !same(i, productId, size))
        : prev.map((i) => (same(i, productId, size) ? { ...i, quantity: q } : i)),
    )
  }

  const remove = (productId: string, size: string) =>
    setItems((prev) => prev.filter((i) => !same(i, productId, size)))

  const restore = (item: CartItem) =>
    setItems((prev) => sanitize([...prev.filter((i) => !same(i, item.productId, item.size)), item]))

  const clear = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return { items, count, quantityOf, maxFor, add, setQuantity, remove, restore, clear }
}
