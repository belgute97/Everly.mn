import { useSyncExternalStore } from 'react'
import { products } from '../data/products'

const STORAGE_KEY = 'everly-shop'
const MAX_VIEWED = 20
export const MAX_TOPUP = 1_000_000
export const MAX_BALANCE = 5_000_000

export interface Profile {
  name: string
  phone: string
  address: string
  email: string
  birthday: string // YYYY-MM-DD эсвэл хоосон
}

export const COUPONS: Record<string, number> = {
  WELCOME5000: 5000,
  EVERLY10000: 10000,
  GIFT20000: 20000,
  VIP50000: 50000,
}

export interface Transaction {
  id: string
  type: 'topup' | 'payment'
  amount: number
  note: string
  method: 'coupon' | 'bank' | 'wallet' // цэнэглэсэн/төлсөн арга
  date: string // ISO
}

export interface OrderLine {
  name: string
  size: string
  quantity: number
  total: number
}

export interface Order {
  id: string // захиалгын дугаар
  date: string // ISO
  deliveryDate: string
  lines: OrderLine[]
  total: number
  payment: 'cash' | 'wallet'
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  text: string
  date: string // ISO
}

interface ShopState {
  profile: Profile
  saved: string[]
  viewed: string[]
  balance: number
  history: Transaction[]
  reviews: Review[]
  orders: Order[]
  usedCoupons: string[]
}

const EMPTY: ShopState = {
  profile: { name: '', phone: '', address: '', email: '', birthday: '' },
  saved: [],
  viewed: [],
  balance: 0,
  history: [],
  reviews: [],
  orders: [],
  usedCoupons: [],
}

// randomUUID нь http дээр ажилладаггүй тул энгийн id
function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

const knownIds = () => new Set(products.map((p) => p.id))
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '')
const isoOk = (v: unknown) => typeof v === 'string' && !Number.isNaN(Date.parse(v))

// localStorage-д гараар засварласан, эсвэл устсан барааны өгөгдлийг цэвэрлэнэ
function sanitize(raw: unknown): ShopState {
  if (!raw || typeof raw !== 'object') return EMPTY
  const r = raw as Record<string, unknown>
  const ids = knownIds()
  const idList = (v: unknown) =>
    Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string' && ids.has(x)))] : []
  const p = (r.profile ?? {}) as Record<string, unknown>

  const history = (Array.isArray(r.history) ? r.history : []).flatMap((t): Transaction[] => {
    const x = t as Partial<Transaction>
    const amount = Math.floor(Number(x?.amount))
    if ((x?.type !== 'topup' && x?.type !== 'payment') || !(amount > 0) || !isoOk(x.date)) return []
    const method = x.method === 'coupon' || x.method === 'bank' ? x.method : 'wallet'
    return [{ id: str(x.id, 40) || newId(), type: x.type, amount, note: str(x.note, 100), method, date: x.date as string }]
  })

  const reviews = (Array.isArray(r.reviews) ? r.reviews : []).flatMap((v): Review[] => {
    const x = v as Partial<Review>
    const rating = Math.floor(Number(x?.rating))
    const text = str(x?.text, 500).trim()
    if (!x?.productId || !ids.has(x.productId) || !(rating >= 1 && rating <= 5) || !text || !isoOk(x.date)) return []
    return [{ id: str(x.id, 40) || newId(), productId: x.productId, author: str(x.author, 60) || 'Зочин', rating, text, date: x.date as string }]
  })

  const orders = (Array.isArray(r.orders) ? r.orders : []).flatMap((v): Order[] => {
    const x = v as Partial<Order>
    const total = Math.floor(Number(x?.total))
    if (!x?.id || !isoOk(x.date) || !Array.isArray(x.lines) || !(total >= 0)) return []
    const lines = x.lines.map((l) => ({
      name: str(l?.name, 200),
      size: str(l?.size, 40),
      quantity: Math.max(1, Math.floor(Number(l?.quantity)) || 1),
      total: Math.max(0, Math.floor(Number(l?.total)) || 0),
    }))
    return [{ id: str(x.id, 20), date: x.date as string, deliveryDate: str(x.deliveryDate, 10), lines, total, payment: x.payment === 'wallet' ? 'wallet' : 'cash' }]
  })

  const balance = Math.floor(Number(r.balance))
  return {
    profile: {
      name: str(p.name, 60),
      phone: str(p.phone, 20),
      address: str(p.address, 200),
      email: str(p.email, 100),
      birthday: /^\d{4}-\d{2}-\d{2}$/.test(str(p.birthday, 10)) ? str(p.birthday, 10) : '',
    },
    orders: orders.slice(0, 50),
    usedCoupons: (Array.isArray(r.usedCoupons) ? r.usedCoupons : []).filter((c): c is string => typeof c === 'string' && c in COUPONS),
    saved: idList(r.saved),
    viewed: idList(r.viewed).slice(0, MAX_VIEWED),
    balance: balance >= 0 ? Math.min(balance, MAX_BALANCE) : 0,
    history: history.slice(0, 100),
    reviews,
  }
}

function load(): ShopState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? sanitize(JSON.parse(raw)) : EMPTY
  } catch {
    return EMPTY
  }
}

let state: ShopState = load()
const listeners = new Set<() => void>()

function set(next: ShopState) {
  state = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // хадгалж чадахгүй бол санах ойд л байна
  }
  listeners.forEach((l) => l())
}

// Өөр таб дээр өөрчлөгдвөл энд шинэчилнэ
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      state = load()
      listeners.forEach((l) => l())
    }
  })
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const useShop = () => useSyncExternalStore(subscribe, () => state)

export const shop = {
  saveProfile(profile: Profile) {
    set({ ...state, profile })
  },

  toggleSaved(productId: string) {
    if (!knownIds().has(productId)) return
    set({
      ...state,
      saved: state.saved.includes(productId)
        ? state.saved.filter((id) => id !== productId)
        : [productId, ...state.saved],
    })
  },

  markViewed(productId: string) {
    if (!knownIds().has(productId) || state.viewed[0] === productId) return
    set({ ...state, viewed: [productId, ...state.viewed.filter((id) => id !== productId)].slice(0, MAX_VIEWED) })
  },

  clearViewed() {
    set({ ...state, viewed: [] })
  },

  // Амжилттай бол null, алдаатай бол мессеж буцаана
  topUp(amount: number, method: 'coupon' | 'bank' = 'bank', note = 'Хэтэвч цэнэглэсэн'): string | null {
    if (!Number.isInteger(amount) || amount < 1000) return 'Дүн 1,000₮-өөс багагүй бүхэл тоо байх ёстой'
    if (amount > MAX_TOPUP) return 'Нэг удаад 1,000,000₮-өөс их цэнэглэх боломжгүй'
    if (state.balance + amount > MAX_BALANCE) return 'Хэтэвчний дээд үлдэгдэл 5,000,000₮'
    const tx: Transaction = { id: newId(), type: 'topup', amount, note, method, date: new Date().toISOString() }
    set({ ...state, balance: state.balance + amount, history: [tx, ...state.history].slice(0, 100) })
    return null
  },

  pay(amount: number, note: string): boolean {
    if (!Number.isInteger(amount) || amount <= 0 || amount > state.balance) return false
    const tx: Transaction = { id: newId(), type: 'payment', amount, note, method: 'wallet', date: new Date().toISOString() }
    set({ ...state, balance: state.balance - amount, history: [tx, ...state.history].slice(0, 100) })
    return true
  },

  // Купон код ашиглах: амжилттай бол null, алдаатай бол мессеж
  redeemCoupon(code: string): string | null {
    const key = code.trim().toUpperCase()
    if (!key) return 'Купон кодоо оруулна уу'
    const amount = COUPONS[key]
    if (!amount) return 'Купон код буруу байна'
    if (state.usedCoupons.includes(key)) return 'Энэ купон аль хэдийн ашиглагдсан байна'
    const error = shop.topUp(amount, 'coupon', `Купон ${key}`)
    if (error) return error
    set({ ...state, usedCoupons: [...state.usedCoupons, key] })
    return null
  },

  addOrder(order: Order) {
    set({ ...state, orders: [order, ...state.orders].slice(0, 50) })
  },

  // Профайл, хэтэвч, сэтгэгдэл гээд бүх өгөгдлийг устгана
  clearAll() {
    set(EMPTY)
  },

  addReview(productId: string, rating: number, text: string): string | null {
    const body = text.trim()
    if (!knownIds().has(productId)) return 'Бараа олдсонгүй'
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Үнэлгээгээ сонгоно уу'
    if (body.length < 3) return 'Сэтгэгдэл хамгийн багадаа 3 тэмдэгт байх ёстой'
    if (body.length > 500) return 'Сэтгэгдэл 500 тэмдэгтээс хэтрэхгүй байх ёстой'
    const review: Review = {
      id: newId(),
      productId,
      author: state.profile.name.trim() || 'Зочин',
      rating,
      text: body,
      date: new Date().toISOString(),
    }
    set({ ...state, reviews: [review, ...state.reviews] })
    return null
  },

  deleteReview(id: string) {
    set({ ...state, reviews: state.reviews.filter((r) => r.id !== id) })
  },
}

export const reviewsFor = (s: ShopState, productId: string) => s.reviews.filter((r) => r.productId === productId)
