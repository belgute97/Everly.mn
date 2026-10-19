import { useEffect, useRef, useState } from 'react'
import { sendMessage } from '../services/chat'
import './ChatWidget.css'

interface Message {
  id: number
  from: 'user' | 'bot'
  text: string
}

const GREETING: Message = { id: 0, from: 'bot', text: 'Сайн байна уу! Юугаар туслах вэ?' }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [failedText, setFailedText] = useState<string | null>(null)
  const nextId = useRef(1)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, pending, failedText])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const addMessage = (from: Message['from'], text: string) => {
    setMessages((prev) => [...prev, { id: nextId.current++, from, text }])
  }

  const request = async (text: string) => {
    setPending(true)
    setFailedText(null)
    try {
      addMessage('bot', await sendMessage(text))
    } catch {
      setFailedText(text)
    } finally {
      setPending(false)
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || pending) return
    setInput('')
    addMessage('user', text)
    void request(text)
  }

  if (!open) {
    return (
      <button type="button" className="chat-fab" onClick={() => setOpen(true)} aria-label="Чат нээх">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
      </button>
    )
  }

  return (
    <section className="chat-window" role="dialog" aria-label="Чат">
      <header className="chat-header">
        <h2>Туслах</h2>
        <button type="button" className="chat-close" onClick={() => setOpen(false)} aria-label="Чат хаах">
          ✕
        </button>
      </header>
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((m) => (
          <p key={m.id} className={`chat-bubble chat-${m.from}`}>
            {m.text}
          </p>
        ))}
        {pending && (
          <p className="chat-bubble chat-bot" aria-label="Хариулт бичиж байна">
            • • •
          </p>
        )}
        {failedText !== null && (
          <div className="chat-error">
            <p className="chat-bubble chat-bot">Холболт тасарлаа</p>
            <button type="button" className="chat-retry" onClick={() => void request(failedText)}>
              Дахин оролдох
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form className="chat-form" onSubmit={submit}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Мессеж бичих…"
          aria-label="Мессеж"
        />
        <button type="submit" disabled={pending || !input.trim()}>
          Илгээх
        </button>
      </form>
    </section>
  )
}
