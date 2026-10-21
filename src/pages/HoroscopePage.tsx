import { useState } from 'react'
import { Link } from 'react-router-dom'
import { animalOf, dailyReading, signOf } from '../data/zodiac'
import { shop, useShop } from '../store/shop'
import './CheckoutPage.css'
import './Account.css'
import './Fun.css'

const Stars = ({ n }: { n: number }) => (
  <span className="stars" role="img" aria-label={`5-аас ${n}`}>{'★'.repeat(n) + '☆'.repeat(5 - n)}</span>
)

export default function HoroscopePage() {
  const { profile } = useShop()
  const [today] = useState(() => new Date().toLocaleDateString('en-CA'))
  const [birthday, setBirthday] = useState(profile.birthday)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)

  const confirmed = profile.birthdayConfirmed && !editing
  const sign = confirmed ? signOf(profile.birthday) : null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agree) {
      setError('Огноо үнэн зөв гэдгийг баталгаажуулна уу')
      return
    }
    const result = shop.confirmBirthday(birthday)
    setError(result)
    if (!result) {
      setEditing(false)
      setAgree(false)
    }
  }

  if (!sign) {
    return (
      <section className="account-page">
        <h1>Сонжоо, зурхай</h1>
        <p className="muted">Төрсөн он, сар, өдрөө оруулж баталгаажуулаад өөрийн ордны өдрийн зурхайг үзээрэй.</p>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="birthday">Төрсөн өдөр</label>
            <input
              id="birthday"
              type="date"
              max={today}
              value={birthday}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'birthday-error' : undefined}
              onChange={(e) => { setBirthday(e.target.value); setError(null) }}
            />
          </div>
          <div className="pay-options">
            <label>
              <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setError(null) }} />
              Энэ огноо үнэн зөв гэдгийг баталгаажуулж байна
            </label>
          </div>
          {error && <p id="birthday-error" className="field-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary">Баталгаажуулах</button>
        </form>
        <p className="muted">Төрсөн өдөр таны төхөөрөмжид хадгалагдаж, <Link to="/profile">профайл</Link> хэсэгт харагдана.</p>
      </section>
    )
  }

  const reading = dailyReading(sign.id, today)
  const topics = [
    ['Хайр', reading.love],
    ['Мөнгө', reading.money],
    ['Ажил', reading.work],
    ['Эрүүл мэнд', reading.health],
  ] as const

  return (
    <section className="account-page">
      <h1>Сонжоо, зурхай</h1>
      <div className="sign-card">
        <span className="sign-symbol" aria-hidden="true">{sign.symbol}</span>
        <div>
          <h2>{sign.name} орд</h2>
          <p className="muted">{sign.range} · {sign.element} · {animalOf(profile.birthday)} жил</p>
          <p>{sign.traits}</p>
        </div>
      </div>

      <h2>Өнөөдрийн зурхай ({today})</h2>
      <ul className="reading-list">
        {topics.map(([label, r]) => (
          <li key={label}>
            <div><strong>{label}</strong> <Stars n={r.stars} /></div>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>
      <p className="lucky">Азтай тоо: <strong>{reading.luckyNumber}</strong> · Азтай өнгө: <strong>{reading.luckyColor}</strong></p>
      <p className="muted">Зөвхөн зугаа цэнгэлийн зорилготой.</p>
      <button type="button" className="btn-secondary" onClick={() => { setBirthday(profile.birthday); setEditing(true) }}>
        Төрсөн өдрөө өөрчлөх
      </button>
    </section>
  )
}
