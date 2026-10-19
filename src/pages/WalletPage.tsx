import { useState } from 'react'
import { shop, useShop } from '../store/shop'
import { formatPrice } from '../utils/formatPrice'
import './CheckoutPage.css'
import './Account.css'

const PRESETS = [10000, 20000, 50000, 100000]

export default function WalletPage() {
  const { balance, history } = useShop()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const raw = amount.replace(/[,\s]/g, '')
    const value = /^\d+$/.test(raw) ? Number(raw) : NaN
    const result = Number.isNaN(value) ? 'Дүнгээ тоогоор оруулна уу' : shop.topUp(value)
    setError(result)
    setOk(!result)
    if (!result) setAmount('')
  }

  return (
    <section className="account-page">
      <h1>Хэтэвч</h1>
      <div className="wallet-card">
        <p>Үлдэгдэл</p>
        <p className="wallet-balance">{formatPrice(balance)}</p>
      </div>
      <p className="notice">Туршилтын хэтэвч: жинхэнэ мөнгө шилжихгүй.</p>
      <form onSubmit={submit} noValidate>
        {ok && <p className="form-ok" role="status">Хэтэвч амжилттай цэнэглэгдлээ</p>}
        <div className="chip-row">
          {PRESETS.map((p) => (
            <button key={p} type="button" className="chip-btn" onClick={() => { setAmount(String(p)); setError(null); setOk(false) }}>
              {formatPrice(p)}
            </button>
          ))}
        </div>
        <div className="field">
          <label htmlFor="topup">Цэнэглэх дүн (₮)</label>
          <input
            id="topup"
            inputMode="numeric"
            value={amount}
            aria-invalid={error ? true : undefined}
            onChange={(e) => { setAmount(e.target.value); setOk(false) }}
          />
          {error && <p className="field-error" role="alert">{error}</p>}
        </div>
        <button type="submit" className="btn-primary">Цэнэглэх</button>
      </form>
      <h2>Гүйлгээний түүх</h2>
      {history.length === 0 ? (
        <p className="muted">Гүйлгээ хийгдээгүй байна.</p>
      ) : (
        <ul className="tx-list">
          {history.map((t) => (
            <li key={t.id}>
              <span>
                {t.note}
                <small>{new Date(t.date).toLocaleString('en-CA', { hour12: false })}</small>
              </span>
              <span className={t.type === 'topup' ? 'tx-plus' : 'tx-minus'}>
                {t.type === 'topup' ? '+' : '−'}{formatPrice(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
