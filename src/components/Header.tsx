import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { groups } from '../data/categories'
import './Header.css'

export default function Header({ count }: { count: number }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const activeGroup = location.pathname === '/' ? new URLSearchParams(location.search).get('group') : null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const links = (
    <>
      <Link to="/" className={location.pathname === '/' && !activeGroup ? 'nav-link active' : 'nav-link'} onClick={() => setMenuOpen(false)}>
        Бүх бараа
      </Link>
      {groups.map((g) => (
        <Link
          key={g.id}
          to={{ pathname: '/', search: `?group=${g.id}` }}
          className={activeGroup === g.id ? 'nav-link active' : 'nav-link'}
          onClick={() => setMenuOpen(false)}
        >
          {g.name}
        </Link>
      ))}
    </>
  )

  return (
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <button
        type="button"
        className="menu-btn"
        aria-label="Цэс"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {menuOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <Link to="/" className="logo">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 4C10 4 4 9 4 15c0 2 1 4 3 5 6 0 13-3 13-16z" />
          <path d="M4 20c2-5 6-8 11-10" />
        </svg>
        Everly
      </Link>
      <nav className="main-nav" aria-label="Үндсэн цэс">
        {links}
      </nav>
      <Link to="/cart" className="cart-link" aria-label={`Сагс, ${count} бараа`}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8h12l-1 12H7L6 8z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
        {count > 0 && (
          <span className="cart-badge" key={count}>
            {count}
          </span>
        )}
      </Link>
      {menuOpen && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Цэс">
          {links}
        </nav>
      )}
    </header>
  )
}
