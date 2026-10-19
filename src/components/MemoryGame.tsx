import { useEffect, useRef, useState } from 'react'
import { shop } from '../store/shop'

const SYMBOLS = ['🍎', '🥕', '🧀', '🥛', '🍞', '🍇', '🥔', '🍋']
const WIN_MOVES = 14 // энэ дотор дуусгавал 3 token (өгсөн 1 token-оо авч, +2 ашиг)

const shuffle = () => {
  const cards = [...SYMBOLS, ...SYMBOLS].map((symbol, i) => ({ id: i, symbol }))
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

// Нэг тоглолт 1 token. 14 нүүдэлд багтвал 3 token буцаан авна, үгүй бол 1 token буцаана
export default function MemoryGame({ tokens }: { tokens: number }) {
  const [cards, setCards] = useState<{ id: number; symbol: string }[]>([])
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [message, setMessage] = useState('')
  const [playing, setPlaying] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const start = () => {
    if (!shop.spendToken()) {
      setMessage('Token хүрэлцэхгүй байна')
      return
    }
    clearTimeout(timer.current)
    setCards(shuffle())
    setOpen([])
    setMatched([])
    setMoves(0)
    setMessage('')
    setPlaying(true)
  }

  const flip = (index: number) => {
    if (!playing || open.length === 2 || open.includes(index) || matched.includes(index)) return
    const next = [...open, index]
    setOpen(next)
    if (next.length < 2) return
    const nextMoves = moves + 1
    setMoves(nextMoves)
    if (cards[next[0]].symbol === cards[next[1]].symbol) {
      const all = [...matched, ...next]
      setMatched(all)
      setOpen([])
      if (all.length === cards.length) {
        setPlaying(false)
        const prize = nextMoves <= WIN_MOVES ? 3 : 1
        shop.addTokens(prize)
        setMessage(prize === 3 ? `Баяр хүргэе! ${nextMoves} нүүдэлд дууслаа, 3 token хожлоо.` : `${nextMoves} нүүдэлд дууслаа. ${WIN_MOVES}-д багтвал 3 token хожно. 1 token буцлаа.`)
      }
    } else {
      timer.current = setTimeout(() => setOpen([]), 700)
    }
  }

  return (
    <div className="game-card">
      <h2>Санах ойн карт</h2>
      <p className="muted">1 token. Хос зургуудыг ол: {WIN_MOVES} нүүдэлд багтаавал 3 token хожно.</p>
      <button type="button" className="btn-primary" disabled={playing || tokens < 1} onClick={start}>
        {playing ? 'Тоглож байна…' : 'Тоглох (1 token)'}
      </button>
      {tokens < 1 && !playing && <p className="field-error">Token дууссан байна</p>}
      {cards.length > 0 && (
        <>
          <p aria-live="polite">Нүүдэл: {moves}</p>
          <div className="memory-grid">
            {cards.map((c, i) => {
              const shown = open.includes(i) || matched.includes(i)
              return (
                <button
                  key={c.id}
                  type="button"
                  className={matched.includes(i) ? 'memory-card matched' : shown ? 'memory-card open' : 'memory-card'}
                  aria-label={shown ? c.symbol : 'Нуугдсан карт'}
                  disabled={!playing}
                  onClick={() => flip(i)}
                >
                  {shown ? c.symbol : '?'}
                </button>
              )
            })}
          </div>
        </>
      )}
      {message && <p className="game-msg" role="status">{message}</p>}
    </div>
  )
}
