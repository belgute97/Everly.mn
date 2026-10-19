import { useState } from 'react'
import { shop } from '../store/shop'

const MAX_TRIES = 3

// Нэг тоглолт 1 token. 1-10 хүртэлх тоог 3 оролдлогод таавал 3 token хожно
export default function GuessGame({ tokens }: { tokens: number }) {
  const [secret, setSecret] = useState<number | null>(null)
  const [tries, setTries] = useState(0)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')

  const playing = secret !== null

  const start = () => {
    if (!shop.spendToken()) {
      setMessage('Token хүрэлцэхгүй байна')
      return
    }
    setSecret(1 + Math.floor(Math.random() * 10))
    setTries(0)
    setGuess('')
    setMessage('1-ээс 10 хүртэлх тоог таа')
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(guess)
    if (secret === null) return
    if (!Number.isInteger(n) || n < 1 || n > 10) {
      setMessage('1-ээс 10 хүртэлх бүхэл тоо оруулна уу')
      return
    }
    const used = tries + 1
    setTries(used)
    setGuess('')
    if (n === secret) {
      shop.addTokens(3)
      setSecret(null)
      setMessage(`Зөв! ${used} оролдлогоор таалаа, 3 token хожлоо.`)
    } else if (used >= MAX_TRIES) {
      setSecret(null)
      setMessage(`Алдлаа. Нууц тоо ${secret} байлаа.`)
    } else {
      setMessage(`${n < secret ? 'Илүү том' : 'Илүү жижиг'} тоо. ${MAX_TRIES - used} оролдлого үлдлээ.`)
    }
  }

  return (
    <div className="game-card">
      <h2>Тоо таах</h2>
      <p className="muted">1 token. 1-10 хүртэлх нууц тоог {MAX_TRIES} оролдлогод таавал 3 token хожно.</p>
      {playing ? (
        <form onSubmit={submit} noValidate className="field">
          <label htmlFor="guess">Таны таамаг</label>
          <input id="guess" inputMode="numeric" value={guess} onChange={(e) => setGuess(e.target.value)} />
          <p />
          <button type="submit" className="btn-primary">Таах</button>
        </form>
      ) : (
        <button type="button" className="btn-primary" disabled={tokens < 1} onClick={start}>Тоглох (1 token)</button>
      )}
      {tokens < 1 && !playing && <p className="field-error">Token дууссан байна</p>}
      {message && <p className="game-msg" role="status">{message}</p>}
    </div>
  )
}
