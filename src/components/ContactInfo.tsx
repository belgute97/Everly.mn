import { contact, hours } from '../data/contact'
import './ContactInfo.css'

// Тусламжийн хуудас болон бүх хуудасны хөлд ашиглана
export default function ContactInfo({ heading = 'h2' }: { heading?: 'h2' | 'h3' }) {
  const Heading = heading
  return (
    <div className="contact-info">
      <section aria-labelledby={`hours-title-${heading}`}>
        <Heading id={`hours-title-${heading}`}>Ажиллах цаг</Heading>
        <ul>
          {hours.map((h) => (
            <li key={h.days}>
              <span>{h.days}</span>
              <strong>{h.time}</strong>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby={`contact-title-${heading}`}>
        <Heading id={`contact-title-${heading}`}>Холбоо барих</Heading>
        <ul>
          <li>
            <span>Утас</span>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </li>
          <li>
            <span>И-мэйл</span>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </li>
          <li>
            <span>Хаяг</span>
            <strong>{contact.address}</strong>
          </li>
        </ul>
      </section>
    </div>
  )
}
