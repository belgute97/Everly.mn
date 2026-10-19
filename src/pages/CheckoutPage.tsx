import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { products } from '../data/products'
import { formatPrice } from '../utils/formatPrice'
import {
  validateField,
  validateOrder,
  type OrderErrors,
  type OrderForm,
} from '../utils/validateOrder'
import { shop, useShop } from '../store/shop'
import type { CartItem } from '../types'
import './CheckoutPage.css'
import './Account.css'

const EMPTY: OrderForm = { name: '', phone: '', address: '', date: '' }

const FIELDS: { key: keyof OrderForm; label: string; type: string; inputMode?: 'numeric'; hint?: string }[] = [
  { key: 'name', label: 'Нэр', type: 'text' },
  { key: 'phone', label: 'Утас', type: 'tel', inputMode: 'numeric', hint: '8 оронтой дугаар' },
  { key: 'address', label: 'Хаяг', type: 'text' },
  { key: 'date', label: 'Хүргэлтийн өдөр', type: 'date' },
]

interface Line {
  id: string
  name: string
  size: string
  quantity: number
  total: number
}

interface Done {
  orderNo: number
  lines: Line[]
  total: number
  date: string
  paidWithWallet: boolean
}

export default function CheckoutPage({ items, onClear }: { items: CartItem[]; onClear: () => void }) {
  const { profile, balance } = useShop()
  const [form, setForm] = useState<OrderForm>({ ...EMPTY, name: profile.name, phone: profile.phone, address: profile.address })
  const [payment, setPayment] = useState<'cash' | 'wallet'>('cash')
  const [payError, setPayError] = useState<string | null>(null)
  const [errors, setErrors] = useState<OrderErrors>({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<Done | null>(null)
  const [today] = useState(() => new Date().toLocaleDateString('en-CA'))
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const doneHeading = useRef<HTMLHeadingElement>(null)

  // Илгээж байхдаа өөр хуудас руу шилжвэл захиалгыг дуусгахгүй (сагс хоосрохоос сэргийлнэ)
  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (done) doneHeading.current?.focus()
  }, [done])

  const lines: Line[] = items.flatMap((i) => {
    const p = products.find((x) => x.id === i.productId)
    return p ? [{ id: `${i.productId}-${i.size}`, name: p.name, size: p.sizes.length > 1 ? i.size : '', quantity: i.quantity, total: p.price * i.quantity }] : []
  })
  const total = lines.reduce((sum, l) => sum + l.total, 0)

  if (done) {
    return (
      <section className="order-done">
        <h1 ref={doneHeading} tabIndex={-1} role="status">
          Захиалга №{done.orderNo} амжилттай
        </h1>
        <p className="muted">Хүргэлтийн өдөр: {done.date} · Төлбөр: {done.paidWithWallet ? 'Хэтэвчээр' : 'Хүргэлтээр бэлнээр'}</p>
        <ul className="summary-list">
          {done.lines.map((l) => (
            <li key={l.id}>
              <span>{l.name}{l.size ? ` (${l.size})` : ''} × {l.quantity}</span>
              <span>{formatPrice(l.total)}</span>
            </li>
          ))}
        </ul>
        <p className="summary-total">Нийт: <strong>{formatPrice(done.total)}</strong></p>
        <p className="notice">Энэ нь туршилтын дэлгүүр: жинхэнэ төлбөр авахгүй, захиалга хадгалагдахгүй.</p>
        <Link to="/" className="btn-primary">Дэлгүүр рүү буцах</Link>
      </section>
    )
  }

  if (lines.length === 0 && !sending) return <Navigate to="/cart" replace />

  const setField = (key: keyof OrderForm, value: string) => {
    setForm({ ...form, [key]: value })
    if (errors[key]) setErrors({ ...errors, [key]: validateField(key, value, today) })
  }

  const blurField = (key: keyof OrderForm) => {
    if (form[key] === '') return
    setErrors({ ...errors, [key]: validateField(key, form[key], today) })
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validateOrder(form, today)
    setErrors(found)
    const first = FIELDS.find((f) => found[f.key])
    if (first) {
      document.getElementById(first.key)?.focus()
      return
    }
    if (payment === 'wallet' && total > balance) {
      setPayError('Хэтэвчний үлдэгдэл хүрэлцэхгүй байна')
      return
    }
    setPayError(null)
    setSending(true)
    // Жинхэнэ төлбөр, backend байхгүй: түр хүлээгээд амжилттай гэж харуулна
    timer.current = setTimeout(() => {
      const orderNo = 100000 + Math.floor(Math.random() * 900000)
      // Хугацаанд хэтэвчний үлдэгдэл өөрчлөгдсөн байж болзошгүй тул дахин шалгана
      if (payment === 'wallet' && !shop.pay(total, `Захиалга №${orderNo}`)) {
        setSending(false)
        setPayError('Хэтэвчний үлдэгдэл хүрэлцэхгүй байна')
        return
      }
      shop.addOrder({
        id: String(orderNo),
        date: new Date().toISOString(),
        deliveryDate: form.date,
        lines: lines.map((l) => ({ name: l.name, size: l.size, quantity: l.quantity, total: l.total })),
        total,
        payment,
      })
      setDone({ orderNo, lines, total, date: form.date, paidWithWallet: payment === 'wallet' })
      onClear()
    }, 1000)
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <form className="checkout-form" onSubmit={submit} noValidate>
      <h1>Захиалга</h1>
      <details className="summary" open>
        <summary>Сагсан дахь бараа ({lines.length})</summary>
        <ul className="summary-list">
          {lines.map((l) => (
            <li key={l.id}>
              <span>{l.name}{l.size ? ` (${l.size})` : ''} × {l.quantity}</span>
              <span>{formatPrice(l.total)}</span>
            </li>
          ))}
        </ul>
        <p className="summary-total">Нийт: <strong>{formatPrice(total)}</strong></p>
      </details>
      <p className="notice">Энэ нь туршилтын дэлгүүр: жинхэнэ төлбөр авахгүй.</p>
      {errorCount > 0 && (
        <p className="error-summary" role="alert">
          Мэдээллээ шалгана уу: {errorCount} талбарт алдаа байна.
        </p>
      )}
      {FIELDS.map(({ key, label, type, inputMode, hint }) => (
        <div key={key} className="field">
          <label htmlFor={key}>{label}</label>
          <input
            id={key}
            type={type}
            inputMode={inputMode}
            min={key === 'date' ? today : undefined}
            value={form[key]}
            disabled={sending}
            aria-invalid={errors[key] ? true : undefined}
            aria-describedby={errors[key] ? `${key}-error` : hint ? `${key}-hint` : undefined}
            onChange={(e) => setField(key, e.target.value)}
            onBlur={() => blurField(key)}
          />
          {errors[key] ? (
            <p id={`${key}-error`} className="field-error">{errors[key]}</p>
          ) : (
            hint && <p id={`${key}-hint`} className="field-hint">{hint}</p>
          )}
        </div>
      ))}
      <fieldset className="pay-options" disabled={sending}>
        <legend>Төлбөрийн хэлбэр</legend>
        <label>
          <input type="radio" name="payment" checked={payment === 'cash'} onChange={() => { setPayment('cash'); setPayError(null) }} />
          Хүргэлтээр бэлнээр
        </label>
        <label>
          <input type="radio" name="payment" checked={payment === 'wallet'} onChange={() => setPayment('wallet')} />
          Хэтэвчээр төлөх (үлдэгдэл {formatPrice(balance)})
        </label>
        {payError && <p className="field-error" role="alert">{payError} · <Link to="/wallet">Цэнэглэх</Link></p>}
      </fieldset>
      <button type="submit" className="btn-primary submit" disabled={sending}>
        {sending ? 'Илгээж байна…' : 'Захиалах'}
      </button>
    </form>
  )
}
