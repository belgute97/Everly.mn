import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { validateOrder, type OrderErrors, type OrderForm } from '../utils/validateOrder'
import type { CartItem } from '../types'
import './CheckoutPage.css'

const EMPTY: OrderForm = { name: '', phone: '', address: '', date: '' }

const FIELDS: { key: keyof OrderForm; label: string; type: string; inputMode?: 'numeric' }[] = [
  { key: 'name', label: 'Нэр', type: 'text' },
  { key: 'phone', label: 'Утас', type: 'tel', inputMode: 'numeric' },
  { key: 'address', label: 'Хаяг', type: 'text' },
  { key: 'date', label: 'Хүргэлтийн өдөр', type: 'date' },
]

export default function CheckoutPage({ items, onClear }: { items: CartItem[]; onClear: () => void }) {
  const [form, setForm] = useState<OrderForm>(EMPTY)
  const [errors, setErrors] = useState<OrderErrors>({})
  const [sending, setSending] = useState(false)
  const [orderNo, setOrderNo] = useState<number | null>(null)

  const [today] = useState(() => new Date().toLocaleDateString('en-CA'))

  if (orderNo !== null) {
    return (
      <section className="order-done">
        <h2>Захиалга №{orderNo} амжилттай</h2>
        <Link to="/" className="btn-primary">Дэлгүүр рүү буцах</Link>
      </section>
    )
  }

  if (items.length === 0 && !sending) return <Navigate to="/cart" replace />

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validateOrder(form, today)
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSending(true)
    // Жинхэнэ төлбөр, backend байхгүй: түр хүлээгээд амжилттай гэж харуулна
    setTimeout(() => {
      setOrderNo(100000 + Math.floor(Math.random() * 900000))
      onClear()
    }, 1000)
  }

  return (
    <form className="checkout-form" onSubmit={submit} noValidate>
      <h2>Захиалга</h2>
      {FIELDS.map(({ key, label, type, inputMode }) => (
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
            aria-describedby={errors[key] ? `${key}-error` : undefined}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
          {errors[key] && <p id={`${key}-error`} className="field-error">{errors[key]}</p>}
        </div>
      ))}
      <button type="submit" className="btn-primary submit" disabled={sending}>
        {sending ? 'Илгээж байна…' : 'Захиалах'}
      </button>
    </form>
  )
}
