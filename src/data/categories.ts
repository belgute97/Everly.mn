import type { Category, Group } from '../types'

export const categories: { id: Category; name: string; group: Group }[] = [
  { id: 'vegetables', name: 'Ногоо', group: 'food' },
  { id: 'meat', name: 'Мах', group: 'food' },
  { id: 'dairy', name: 'Цагаан идээ', group: 'food' },
  { id: 'women', name: 'Эмэгтэй хувцас', group: 'women' },
  { id: 'men', name: 'Эрэгтэй хувцас', group: 'men' },
  { id: 'kids', name: 'Хүүхдийн хувцас', group: 'kids' },
  { id: 'kitchen', name: 'Гал тогооны хэрэгсэл', group: 'kitchen' },
  { id: 'appliances', name: 'Цахилгаан бараа', group: 'appliances' },
  { id: 'tech', name: 'Технологи', group: 'tech' },
]

// Цэс болон шүүлтүүрийн үндсэн бүлгүүд. icon нь components/icons.tsx дахь нэр
export const groups: { id: Group; name: string; icon: string }[] = [
  { id: 'food', name: 'Хүнс', icon: 'food' },
  { id: 'women', name: 'Эмэгтэй хувцас', icon: 'women' },
  { id: 'men', name: 'Эрэгтэй хувцас', icon: 'men' },
  { id: 'kids', name: 'Хүүхдийн хувцас', icon: 'kids' },
  { id: 'kitchen', name: 'Гал тогооны хэрэгсэл', icon: 'kitchen' },
  { id: 'appliances', name: 'Цахилгаан бараа', icon: 'appliances' },
  { id: 'tech', name: 'Технологи', icon: 'tech' },
]

export const categoriesOf = (group: Group): Category[] =>
  categories.filter((c) => c.group === group).map((c) => c.id)
