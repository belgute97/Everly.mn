import { Link } from 'react-router-dom'

export default function NotFoundPage({ title = 'Хуудас олдсонгүй' }: { title?: string }) {
  return (
    <section className="center-page">
      <h1>{title}</h1>
      <p className="muted">Хайсан зүйл тань олдсонгүй. Дэлгүүрийн нүүрнээс үргэлжлүүлнэ үү.</p>
      <Link to="/" className="btn-primary">Нүүр хуудас руу очих</Link>
    </section>
  )
}
