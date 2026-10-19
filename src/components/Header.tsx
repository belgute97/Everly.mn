import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './icons'
import './Header.css'

interface Props {
  count: number
  onMenu: () => void
}

// Дээд мөр: утсан дээр цэсийн товч, лого; компьютер дээр зөвхөн сагс (цэс нь зүүн талд)
export default function Header({ count, onMenu }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <button type="button" className="menu-btn" aria-label="Цэс нээх" onClick={onMenu}>
        <Icon name="menu" size={24} />
      </button>
      <Link to="/" className="logo header-logo">
        <Icon name="leaf" size={26} />
        Everly
      </Link>
      <Link to="/cart" className="cart-link" aria-label={`Сагс, ${count} бараа`}>
        <Icon name="cart" size={24} />
        {count > 0 && (
          <span className="cart-badge" key={count}>
            {count}
          </span>
        )}
      </Link>
    </header>
  )
}
