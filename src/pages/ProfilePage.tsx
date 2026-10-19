import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/icons'
import { toggleTheme, useTheme } from '../hooks/useTheme'
import { shop, useShop } from '../store/shop'
import { formatPrice } from '../utils/formatPrice'
import { normalizePhone } from '../utils/validateOrder'
import './CheckoutPage.css'
import './Account.css'

type Errors = Partial<Record<'name' | 'phone' | 'email' | 'birthday', string>>

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?'

export default function ProfilePage() {
  const { profile, saved, viewed, balance, orders, reviews } = useShop()
  const theme = useTheme()
  const [form, setForm] = useState(profile)
  const [errors, setErrors] = useState<Errors>({})
  const [ok, setOk] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [today] = useState(() => new Date().toLocaleDateString('en-CA'))

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
    const email = form.email.trim()
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.email = 'И-мэйл хаяг буруу байна'
    if (form.birthday && (form.birthday > today || form.birthday < '1900-01-01')) found.birthday = 'Төрсөн өдөр буруу байна'
    setErrors(found)
    const first = (['name', 'phone', 'email', 'birthday'] as const).find((k) => found[k])
    if (first) {
      document.getElementById(`p-${first}`)?.focus()
      return
    }
    shop.saveProfile({ name: form.name.trim(), phone, address: form.address.trim(), email, birthday: form.birthday })
    setOk(true)
  }

  const clearAll = () => {
    shop.clearAll()
    setForm({ name: '', phone: '', address: '', email: '', birthday: '' })
    setConfirmClear(false)
    setOk(false)
  }

  const displayName = profile.name || 'Зочин'

  return (
    <section className="account-page">
      <h1>Миний профайл</h1>

      <div className="profile-card">
        <div className="avatar" aria-hidden="true">{initials(profile.name)}</div>
        <div>
          <p className="profile-name">{displayName}</p>
          <p className="muted profile-sub">{profile.phone || profile.email || 'Мэдээлэл оруулаагүй байна'}</p>
        </div>
      </div>

      <ul className="stat-grid">
        <li><strong>{orders.length}</strong><span>Захиалга</span></li>
        <li><strong>{saved.length}</strong><span>Хадгалсан</span></li>
        <li><strong>{reviews.length}</strong><span>Сэтгэгдэл</span></li>
        <li><strong>{formatPrice(balance)}</strong><span>Хэтэвч</span></li>
      </ul>

      <ul className="account-links">
        <li><Link to="/saved"><Icon name="heart" />Хадгалсан ({saved.length})</Link></li>
        <li><Link to="/viewed"><Icon name="clock" />Үзсэн ({viewed.length})</Link></li>
        <li><Link to="/wallet"><Icon name="wallet" />Хэтэвч</Link></li>
        <li><Link to="/help"><Icon name="help" />Тусламж</Link></li>
      </ul>

      <h2>Хувийн мэдээлэл</h2>
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
          <label htmlFor="p-email">И-мэйл</label>
          <input id="p-email" type="email" value={form.email} maxLength={100} aria-invalid={errors.email ? true : undefined} onChange={(e) => change('email', e.target.value)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>
        <div className="field">
          <label htmlFor="p-birthday">Төрсөн өдөр</label>
          <input id="p-birthday" type="date" max={today} value={form.birthday} aria-invalid={errors.birthday ? true : undefined} onChange={(e) => change('birthday', e.target.value)} />
          {errors.birthday && <p className="field-error">{errors.birthday}</p>}
        </div>
        <div className="field">
          <label htmlFor="p-address">Хүргэлтийн хаяг</label>
          <input id="p-address" value={form.address} maxLength={200} onChange={(e) => change('address', e.target.value)} />
        </div>
        <button type="submit" className="btn-primary">Хадгалах</button>
      </form>

      <h2>Тохиргоо</h2>
      <div className="setting-row">
        <span>Харанхуй горим</span>
        <button type="button" className="btn-secondary" aria-pressed={theme === 'dark'} onClick={toggleTheme}>
          {theme === 'dark' ? 'Идэвхтэй: унтраах' : 'Асаах'}
        </button>
      </div>

      <h2>Захиалгын түүх</h2>
      {orders.length === 0 ? (
        <p className="muted">Захиалга өгөөгүй байна. <Link to="/">Дэлгүүр хэсэх</Link></p>
      ) : (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id}>
              <details>
                <summary>
                  <span>№{o.id} · {new Date(o.date).toLocaleDateString('en-CA')}</span>
                  <strong>{formatPrice(o.total)}</strong>
                </summary>
                <ul>
                  {o.lines.map((l, i) => (
                    <li key={i}>
                      <span>{l.name}{l.size ? ` (${l.size})` : ''} × {l.quantity}</span>
                      <span>{formatPrice(l.total)}</span>
                    </li>
                  ))}
                </ul>
                <p className="muted">Хүргэлт: {o.deliveryDate} · {o.payment === 'wallet' ? 'Хэтэвчээр төлсөн' : 'Хүргэлтээр бэлнээр'}</p>
              </details>
            </li>
          ))}
        </ul>
      )}

      <h2>Өгөгдөл</h2>
      <p className="muted">Мэдээлэл зөвхөн таны төхөөрөмжид хадгалагдана.</p>
      {confirmClear ? (
        <div role="alertdialog" aria-label="Өгөгдөл устгах баталгаажуулалт" className="confirm-box">
          <p>Профайл, хэтэвч, захиалга, сэтгэгдэл, хадгалсан бараа бүгд устна. Үргэлжлүүлэх үү?</p>
          <button type="button" className="btn-primary danger" onClick={clearAll}>Тийм, устгах</button>{' '}
          <button type="button" className="btn-secondary" onClick={() => setConfirmClear(false)}>Болих</button>
        </div>
      ) : (
        <button type="button" className="btn-secondary" onClick={() => setConfirmClear(true)}>Бүх өгөгдлөө устгах</button>
      )}
    </section>
  )
}
