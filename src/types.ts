// Барааны ангилал: ногоо, мах, цагаан идээ
export type Category = 'vegetables' | 'meat' | 'dairy'

export interface Product {
  id: string // давтагдахгүй англи нэр, жишээ нь "potato"
  name: string // монгол нэр, хэмжээтэй нь: "Органик төмс, 10 кг"
  category: Category
  price: number // бүхэл төгрөг, жишээ нь 18000 (= 18,000₮). Бүх размерт ижил
  description: string // нэг өгүүлбэр тайлбар
  image: string // зургийн зам, public/ хавтаснаас: "/images/products/potato.svg"
  stock: number // үлдэгдэл. 0 бол дууссан
  sizes: string[] // хэрэглэгчийн сонгох размер. Эхнийх нь анхдагч сонголт
}
