import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { groups } from '../data/categories'
import { productSub, subcategories } from '../data/subcategories'
import Icon from './icons'
import './SideMenu.css'

interface Props {
  open: boolean
  onClose: () => void
  saleCount: number
}

const subCounts: Record<string, number> = {}
for (const sub of Object.values(productSub)) subCounts[sub] = (subCounts[sub] ?? 0) + 1

const ACCOUNT_LINKS = [
  { to: '/profile', icon: 'user', label: 'Миний профайл' },
  { to: '/saved', icon: 'heart', label: 'Хадгалсан бараа' },
  { to: '/viewed', icon: 'clock', label: 'Үзсэн бараа' },
  { to: '/wallet', icon: 'wallet', label: 'Хэтэвч' },
  { to: '/help', icon: 'help', label: 'Тусламж' },
]

export default function SideMenu({ open, onClose, saleCount }: Props) {
  const location = useLocation()
  const group = new URLSearchParams(location.search).get('group')
  const onHome = location.pathname === '/'
  const onSale = location.pathname === '/sale'
  const activeSub = new URLSearchParams(location.search).get('sub')
  // Гараар нээсэн/хаасан бүлгүүд; идэвхтэй бүлэг үргэлж нээлттэй харагдана
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const isOpen = (id: string) => toggled[id] ?? (onHome && group === id)
  const toggle = (id: string) => setToggled((t) => ({ ...t, [id]: !isOpen(id) }))

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const cls = (active: boolean, extra = '') => `side-link${extra} ${active ? 'active' : ''}`.trim()

  return (
    <>
      {open && <div className="scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={open ? 'side-menu open' : 'side-menu'} aria-label="Үндсэн цэс">
        <div className="side-head">
          <Link to="/" className="logo" onClick={onClose}>
            <Icon name="leaf" size={26} />
            Everly
          </Link>
          <button type="button" className="side-close" aria-label="Цэс хаах" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <nav>
          <ul className="side-list">
            <li>
              <Link to="/" className={cls(onHome && !group)} onClick={onClose}>
                <Icon name="all" />
                <span>Бүх бараа</span>
              </Link>
            </li>
            <li>
              <Link to="/sale" className={cls(onSale, ' side-sale')} onClick={onClose}>
                <Icon name="sale" />
                <span>Хямдрал, урамшуулал</span>
                <span className="side-badge">{saleCount}</span>
              </Link>
            </li>
            <li>
              <Link to="/horoscope" className={cls(location.pathname === '/horoscope')} onClick={onClose}>
                <Icon name="zodiac" />
                <span>Сонжоо, зурхай</span>
              </Link>
            </li>
            <li>
              <Link to="/games" className={cls(location.pathname === '/games')} onClick={onClose}>
                <Icon name="game" />
                <span>Mini game</span>
              </Link>
            </li>
            <li className="side-divider" role="presentation" />
            {groups.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  className={cls(onHome && group === g.id && !activeSub, ' side-toggle')}
                  aria-expanded={isOpen(g.id)}
                  aria-controls={`sub-${g.id}`}
                  onClick={() => toggle(g.id)}
                >
                  <Icon name={g.icon} />
                  <span>{g.name}</span>
                  <Icon name="chevron" size={18} />
                </button>
                <div className={isOpen(g.id) ? 'side-sub open' : 'side-sub'} id={`sub-${g.id}`} inert={!isOpen(g.id)}>
                  <ul>
                    <li>
                      <Link
                        to={{ pathname: '/', search: `?group=${g.id}` }}
                        className={`side-sublink ${onHome && group === g.id && !activeSub ? 'active' : ''}`}
                        onClick={onClose}
                      >
                        Бүх {g.name.toLowerCase()}
                      </Link>
                    </li>
                    {subcategories[g.id].map((s) => (
                      <li key={s.id}>
                        <Link
                          to={{ pathname: '/', search: `?group=${g.id}&sub=${s.id}` }}
                          className={`side-sublink ${onHome && group === g.id && activeSub === s.id ? 'active' : ''}`}
                          onClick={onClose}
                        >
                          {s.name}
                          <small>{subCounts[s.id] ?? 0}</small>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li className="side-divider" role="presentation" />
            {ACCOUNT_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={cls(location.pathname === l.to)} onClick={onClose}>
                  <Icon name={l.icon} />
                  <span>{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="side-foot">Туршилтын дэлгүүр</p>
      </aside>
    </>
  )
}
