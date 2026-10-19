import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/icons'
import { shop, useShop } from '../store/shop'
import { normalizePhone } from '../utils/validateOrder'
import './CheckoutPage.css'
import './Account.css'

type Errors = { name?: string; phone?: string }

export default function ProfilePage() {
  const { profile, saved, viewed, balance } = useShop()
  const [form, setForm] = useState(profile)
  const [errors, setErrors] = useState<Errors>({})
  const [ok, setOk] = useState(false)

  const change = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value })
    setOk(false)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const found: Errors = {}
    if (!form.name.trim()) found.name = 'Нэрээ оруулна уу'
    const phone = normalizePhone(form.phone)
    if (phone && !/^\d{8}$/.test(phone)) found.phone = 'Утас 8 оронтой тоо байх ёстой'
    setErrors(found)
    if (found.name || found.phone) {
      document.getElementById(found.name ? 'p-name' : 'p-phone')?.focus()
      return
    }
    shop.saveProfile({ name: form.name.trim(), phone, address: form.address.trim() })
    setOk(true)
  }

  return (
    <section className="account-page">
      <h1>Миний профайл</h1>
      <ul className="account-links">
        <li><Link to="/saved"><Icon name="heart" />Хадгалсан ({saved.length})</Link></li>
        <li><Link to="/viewed"><Icon name="clock" />Үзсэн ({viewed.length})</Link></li>
        <li><Link to="/wallet"><Icon name="wallet" />Хэтэвч ({balance.toLocaleString('en-US')}₮)</Link></li>
        <li><Link to="/help"><Icon name="help" />Тусламж</Link></li>
      </ul>
      <form onSubmit={submit} noValidate>
        {ok && <p className="form-ok" role="status">Профайл хадгалагдлаа</p>}
        <div className="field">
          <label htmlFor="p-name">Нэр</label>
          <input id="p-name" value={form.name} maxLength={60} aria-invalid={errors.name ? true : undefined} onChange={(e) => change('name', e.target.value)} />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="p-phone">Утас</label>
          <input id="p-phone" type="tel" inputMode="numeric" value={form.phone} maxLength={20} aria-invalid={errors.phone ? true : undefined} onChange={(e) => change('phone', e.target.value)} />
          {errors.phone ? <p className="field-error">{errors.phone}</p> : <p className="field-hint">8 оронтой дугаар</p>}
        </div>
        <div className="field">
          <label htmlFor="p-address">Хаяг</label>
          <input id="p-address" value={form.address} maxLength={200} onChange={(e) => change('address', e.target.value)} />
        </div>
        <button type="submit" className="btn-primary">Хадгалах</button>
      </form>
      <p className="muted">Мэдээлэл зөвхөн таны төхөөрөмжид хадгалагдана.</p>
    </section>
  )
}
