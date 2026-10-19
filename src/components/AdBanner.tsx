import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './icons'
import './AdBanner.css'

// Хуудасны хамгийн дээд зар. Энгийн урсгалд байдаг тул доошоо гүйлгэхэд өөрөө алга болно
export default function AdBanner() {
  const [closed, setClosed] = useState(false)
  if (closed) return null
  return (
    <aside className="ad-banner" aria-label="Зар сурталчилгаа">
      <p>
        <strong>Шинэ хэрэглэгчдэд бэлэг!</strong> <code>WELCOME5000</code> купоноор хэтэвчээ цэнэглээд 5,000₮ аваарай.
      </p>
      <Link to="/wallet" className="ad-link">Цэнэглэх</Link>
      <button type="button" className="ad-close" aria-label="Зар хаах" onClick={() => setClosed(true)}>
        <Icon name="close" size={18} />
      </button>
    </aside>
  )
}
