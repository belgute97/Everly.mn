import { Link } from 'react-router-dom'
import { categoriesOf, groups } from '../data/categories'
import { products } from '../data/products'
import { productSub, subcategories } from '../data/subcategories'
import type { Group } from '../types'
import { isPromo } from '../utils/promo'
import './CategoryBanner.css'

const TAGLINES: Record<Group, string> = {
  food: 'Шинэхэн, чанартай хүнс гэрт тань хүрнэ',
  women: 'Энэ улирлын шинэ загварууд',
  men: 'Өдөр тутам, ажил амралтад зориулсан сонголт',
  kids: 'Хүүхдэд тохиромжтой, эмзэг арьсанд ээлтэй',
  kitchen: 'Гал тогоогоо шинэчлэх хэрэгтэй бүхэн',
  appliances: 'Гэрийн ажлыг хөнгөвчлөх цахилгаан бараа',
  tech: 'Шинэ технологи, найдвартай чанар',
}

// Дэд бүлэг доторх том зар: тухайн бүлгийн бодит барааны зургийг ашиглана
export default function CategoryBanner({ group, subId }: { group: Group; subId: string }) {
  const sub = subcategories[group].find((s) => s.id === subId)
  if (!sub) return null
  const inSub = products.filter((p) => productSub[p.id] === subId)
  const inGroup = products.filter((p) => categoriesOf(group).includes(p.category))
  const hero = inSub.find((p) => p.stock > 0) ?? inGroup.find((p) => p.stock > 0) ?? inGroup[0]
  const sale = inSub.filter(isPromo).length
  const groupName = groups.find((g) => g.id === group)?.name

  return (
    <section className={`cat-banner cat-banner-${group}`} aria-label={`${sub.name}: зар`}>
      {hero && <img src={hero.image} alt="" className="cat-banner-img" />}
      <div className="cat-banner-text">
        <p className="cat-banner-kicker">{groupName}</p>
        <h2>{sub.name}</h2>
        <p>{TAGLINES[group]}</p>
        {sale > 0 ? (
          <Link to="/sale" className="cat-banner-cta">Хямдралтай {sale} бараа үзэх</Link>
        ) : (
          <span className="cat-banner-note">{inSub.length > 0 ? `${inSub.length} бараа` : 'Удахгүй шинэ бараа нэмэгдэнэ'}</span>
        )}
      </div>
    </section>
  )
}
