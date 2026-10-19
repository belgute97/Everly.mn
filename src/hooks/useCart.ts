import { useEffect, useState } from 'react'
import type { CartItem } from '../types'

const STORAGE_KEY = 'everly-cart'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

const same = (a: CartItem, productId: string, size: string) =>
  a.productId === productId && a.size === size

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // хадгалж чадахгүй бол санах ойд л байна
    }
  }, [items])

  const add = (productId: string, size: string) =>
    setItems((prev) =>
      prev.some((i) => same(i, productId, size))
        ? prev.map((i) => (same(i, productId, size) ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { productId, size, quantity: 1 }],
    )

  const setQuantity = (productId: string, size: string, quantity: number) =>
    setItems((prev) =>
      quantity < 1
        ? prev.filter((i) => !same(i, productId, size))
        : prev.map((i) => (same(i, productId, size) ? { ...i, quantity } : i)),
    )

  const remove = (productId: string, size: string) =>
    setItems((prev) => prev.filter((i) => !same(i, productId, size)))

  const clear = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return { items, count, add, setQuantity, remove, clear }
}
