import type { Category, Group } from '../types'

export const categories: { id: Category; name: string; group: Group }[] = [
  { id: 'vegetables', name: 'Ногоо', group: 'food' },
  { id: 'meat', name: 'Мах', group: 'food' },
  { id: 'dairy', name: 'Цагаан идээ', group: 'food' },
  { id: 'women', name: 'Эмэгтэй хувцас', group: 'women' },
  { id: 'men', name: 'Эрэгтэй хувцас', group: 'men' },
  { id: 'kids', name: 'Хүүхдийн хувцас', group: 'kids' },
  { id: 'kitchen', name: 'Гал тогооны хэрэгсэл', group: 'kitchen' },
]

// Цэс болон шүүлтүүрийн үндсэн бүлгүүд
export const groups: { id: Group; name: string }[] = [
  { id: 'food', name: 'Хүнс' },
  { id: 'women', name: 'Эмэгтэй хувцас' },
  { id: 'men', name: 'Эрэгтэй хувцас' },
  { id: 'kids', name: 'Хүүхдийн хувцас' },
  { id: 'kitchen', name: 'Гал тогооны хэрэгсэл' },
]

export const categoriesOf = (group: Group): Category[] =>
  categories.filter((c) => c.group === group).map((c) => c.id)
