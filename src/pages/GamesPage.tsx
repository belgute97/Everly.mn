import { useState } from 'react'
import { Link } from 'react-router-dom'
import GuessGame from '../components/GuessGame'
import MemoryGame from '../components/MemoryGame'
import { DAILY_TOKENS, shop, TOKEN_PRICE, useShop } from '../store/shop'
import './CheckoutPage.css'
import './Account.css'
import './Fun.css'

export default function GamesPage() {
  const { tokens, lastClaim, balance } = useShop()
  const [today] = useState(() => new Date().toLocaleDateString('en-CA'))
  const [message, setMessage] = useState('')
  const claimed = lastClaim === today

  const claim = () => setMessage(shop.claimDaily() ? `${DAILY_TOKENS} token авлаа` : 'Өнөөдрийн token-оо аль хэдийн авсан байна')

  const buy = (count: number) => setMessage(shop.buyTokens(count) ?? `${count} token худалдаж авлаа`)

  return (
    <section className="account-page">
      <h1>Mini game</h1>
      <p className="muted">Тоглолт бүр зөвхөн 1 token. Өдөр бүр {DAILY_TOKENS} token үнэгүй авна.</p>
      <div className="token-bar">
        <div>
          <small className="muted">Таны token</small>
          <p className="token-count" aria-live="polite">{tokens}</p>
        </div>
        <div className="token-actions">
          <button type="button" className="btn-primary" disabled={claimed} onClick={claim}>
            {claimed ? 'Өнөөдөр авсан' : `Өдрийн ${DAILY_TOKENS} token авах`}
          </button>
          <button type="button" className="btn-secondary" disabled={balance < 10 * TOKEN_PRICE} onClick={() => buy(10)}>
            10 token ({(10 * TOKEN_PRICE).toLocaleString('en-US')}₮)
          </button>
        </div>
        {balance < 10 * TOKEN_PRICE && <p className="field-hint">Token худалдаж авахын тулд <Link to="/wallet">хэтэвчээ цэнэглэнэ</Link> үү. 1 token = {TOKEN_PRICE}₮.</p>}
      </div>
      {message && <p className="form-ok" role="status">{message}</p>}
      <MemoryGame tokens={tokens} />
      <GuessGame tokens={tokens} />
      <p className="muted">Token нь зөвхөн тоглоомд ашиглагдана, мөнгө болгон буцаах боломжгүй.</p>
    </section>
  )
}
