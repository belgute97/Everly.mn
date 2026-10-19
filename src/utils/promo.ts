import type { Product } from '../types'

export const isPromo = (p: Product) => p.oldPrice !== undefined || p.promoLabel !== undefined

// Хямдралын хувь, бүхэл тоогоор. Хямдралгүй бол 0
export const discountPercent = (p: Product) =>
  p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0
