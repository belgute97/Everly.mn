import { Link } from 'react-router-dom'
import './Header.css'

export default function Header({ count }: { count: number }) {
  return (
    <header className="site-header">
      <Link to="/" className="logo">Everly</Link>
      <Link to="/cart" className="cart-link" aria-label={`Сагс, ${count} бараа`}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.7 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6" />
        </svg>
        {count > 0 && (
          <span className="cart-badge" key={count}>
            {count}
          </span>
        )}
      </Link>
    </header>
  )
}
