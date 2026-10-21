import { useEffect, useRef, useState } from 'react'
import { shop, useShop, type Transaction } from '../store/shop'
import { formatPrice } from '../utils/formatPrice'
import './CheckoutPage.css'
import './Account.css'

const PRESETS = [10000, 20000, 50000, 100000]
const BANKS = ['Хаан банк', 'Голомт банк', 'Худалдаа хөгжлийн банк', 'Хас банк', 'Төрийн банк']
const METHOD_LABEL: Record<Transaction['method'], string> = { coupon: 'Купон', bank: 'Банк', wallet: 'Хэтэвч' }

type Tab = 'topup' | 'history'
type Method = 'bank' | 'coupon'
type Filter = 'all' | 'topup' | 'payment'

const parseAmount = (text: string) => {
  const raw = text.replace(/[,\s]/g, '')
  return /^\d+$/.test(raw) ? Number(raw) : NaN
}

export default function WalletPage() {
  const { balance, history } = useShop()
  const [tab, setTab] = useState<Tab>('topup')
  const [method, setMethod] = useState<Method>('bank')
  const [filter, setFilter] = useState<Filter>('all')

  const [amount, setAmount] = useState('')
  const [bank, setBank] = useState(BANKS[0])
  const [account, setAccount] = useState('')
  const [coupon, setCoupon] = useState('')
  const [errors, setErrors] = useState<{ amount?: string; account?: string; coupon?: string }>({})
  const [ok, setOk] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const pickMethod = (m: Method) => {
    setMethod(m)
    setErrors({})
    setOk(null)
  }

  const submitBank = (e: React.FormEvent) => {
    e.preventDefault()
    const value = parseAmount(amount)
    const found: typeof errors = {}
    if (Number.isNaN(value)) found.amount = 'Дүнгээ тоогоор оруулна уу'
    if (!/^\d{8,16}$/.test(account.replace(/[\s-]/g, ''))) found.account = 'Дансны дугаар 8–16 оронтой тоо байх ёстой'
    setErrors(found)
    setOk(null)
    if (found.amount || found.account) {
      document.getElementById(found.amount ? 'topup' : 'bank-account')?.focus()
      return
    }
    setSending(true)
    // Жинхэнэ банк холбогдоогүй: түр хүлээгээд амжилттай гэж харуулна
    timer.current = setTimeout(() => {
      setSending(false)
      const error = shop.topUp(value, 'bank', `${bank}-аар цэнэглэсэн`)
      setErrors(error ? { amount: error } : {})
      if (!error) {
        setOk(`${formatPrice(value)} хэтэвчинд нэмэгдлээ`)
        setAmount('')
        setAccount('')
      }
    }, 1000)
  }

  const submitCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    const error = shop.redeemCoupon(coupon)
    setErrors(error ? { coupon: error } : {})
    if (error) {
      setOk(null)
    } else {
      setOk('Купон амжилттай ашиглагдлаа')
      setCoupon('')
    }
  }

  const topups = history.filter((t) => t.type === 'topup').reduce((s, t) => s + t.amount, 0)
  const spent = history.filter((t) => t.type === 'payment').reduce((s, t) => s + t.amount, 0)
  const shown = history.filter((t) => filter === 'all' || t.type === filter)

  return (
    <section className="account-page">
      <h1>Хэтэвч</h1>
      <div className="wallet-card">
        <p>Үлдэгдэл</p>
        <p className="wallet-balance">{formatPrice(balance)}</p>
      </div>
      <p className="notice">Туршилтын хэтэвч: жинхэнэ мөнгө шилжихгүй.</p>

      <div className="tabs" role="tablist" aria-label="Хэтэвч">
        <button type="button" role="tab" aria-selected={tab === 'topup'} className={tab === 'topup' ? 'tab active' : 'tab'} onClick={() => setTab('topup')}>
          Цэнэглэх
        </button>
        <button type="button" role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'tab active' : 'tab'} onClick={() => setTab('history')}>
          Гүйлгээний түүх ({history.length})
        </button>
      </div>

      {tab === 'topup' ? (
        <div role="tabpanel">
          <div className="chip-row" role="group" aria-label="Цэнэглэх арга">
            <button type="button" className={method === 'bank' ? 'chip-btn active' : 'chip-btn'} aria-pressed={method === 'bank'} onClick={() => pickMethod('bank')}>
              Банкаар
            </button>
            <button type="button" className={method === 'coupon' ? 'chip-btn active' : 'chip-btn'} aria-pressed={method === 'coupon'} onClick={() => pickMethod('coupon')}>
              Купон кодоор
            </button>
          </div>
          {ok && <p className="form-ok" role="status">{ok}</p>}

          {method === 'bank' ? (
            <form onSubmit={submitBank} noValidate>
              <div className="chip-row">
                {PRESETS.map((p) => (
                  <button key={p} type="button" className="chip-btn" disabled={sending} onClick={() => { setAmount(String(p)); setErrors({}); setOk(null) }}>
                    {formatPrice(p)}
                  </button>
                ))}
              </div>
              <div className="field">
                <label htmlFor="topup">Цэнэглэх дүн (₮)</label>
                <input id="topup" inputMode="numeric" value={amount} disabled={sending} aria-invalid={errors.amount ? true : undefined} onChange={(e) => setAmount(e.target.value)} />
                {errors.amount && <p className="field-error" role="alert">{errors.amount}</p>}
              </div>
              <div className="field">
                <label htmlFor="bank-name">Банк</label>
                <select id="bank-name" value={bank} disabled={sending} onChange={(e) => setBank(e.target.value)}>
                  {BANKS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="bank-account">Дансны дугаар</label>
                <input id="bank-account" inputMode="numeric" autoComplete="off" value={account} disabled={sending} aria-invalid={errors.account ? true : undefined} onChange={(e) => setAccount(e.target.value)} />
                {errors.account ? <p className="field-error" role="alert">{errors.account}</p> : <p className="field-hint">Туршилт тул дансны дугаар хадгалагдахгүй</p>}
              </div>
              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? 'Төлбөр шалгаж байна…' : 'Банкаар цэнэглэх'}
              </button>
            </form>
          ) : (
            <form onSubmit={submitCoupon} noValidate>
              <div className="field">
                <label htmlFor="coupon">Купон код</label>
                <input id="coupon" autoComplete="off" autoCapitalize="characters" value={coupon} aria-invalid={errors.coupon ? true : undefined} onChange={(e) => setCoupon(e.target.value)} />
                {errors.coupon ? <p className="field-error" role="alert">{errors.coupon}</p> : <p className="field-hint">Туршилтын код: WELCOME5000, EVERLY10000, GIFT20000, VIP50000. Код бүрийг нэг удаа ашиглана.</p>}
              </div>
              <button type="submit" className="btn-primary">Купон ашиглах</button>
            </form>
          )}
        </div>
      ) : (
        <div role="tabpanel">
          <div className="tx-summary">
            <div><small>Нийт цэнэглэсэн</small><strong className="tx-plus">+{formatPrice(topups)}</strong></div>
            <div><small>Нийт зарцуулсан</small><strong className="tx-minus">−{formatPrice(spent)}</strong></div>
          </div>
          <div className="chip-row" role="group" aria-label="Гүйлгээний төрөл">
            {([['all', 'Бүгд'], ['topup', 'Цэнэглэлт'], ['payment', 'Төлбөр']] as const).map(([f, label]) => (
              <button key={f} type="button" className={filter === f ? 'chip-btn active' : 'chip-btn'} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {label}
              </button>
            ))}
          </div>
          {shown.length === 0 ? (
            <p className="muted">{history.length === 0 ? 'Гүйлгээ хийгдээгүй байна.' : 'Энэ төрлийн гүйлгээ алга.'}</p>
          ) : (
            <ul className="tx-list">
              {shown.map((t) => (
                <li key={t.id}>
                  <span>
                    {t.note}
                    <small>{METHOD_LABEL[t.method]} · {new Date(t.date).toLocaleString('en-CA', { hour12: false })}</small>
                  </span>
                  <span className={t.type === 'topup' ? 'tx-plus' : 'tx-minus'}>
                    {t.type === 'topup' ? '+' : '−'}{formatPrice(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
