// Барааны ангилал
export type Category = 'vegetables' | 'meat' | 'dairy' | 'women' | 'men' | 'kids' | 'kitchen'

// Үндсэн бүлэг: хүнс нь гурван дэд ангилалтай, бусад нь тус бүр нэг ангилалтай
export type Group = 'food' | 'women' | 'men' | 'kids' | 'kitchen'

export interface Product {
  id: string // давтагдахгүй англи нэр, жишээ нь "potato"
  name: string // монгол нэр, хэмжээтэй нь: "Органик төмс, 10 кг"
  category: Category
  price: number // бүхэл төгрөг, жишээ нь 18000 (= 18,000₮). Бүх размерт ижил
  description: string // нэг өгүүлбэр тайлбар
  image: string // зургийн зам, public/ хавтаснаас: "/images/products/potato.webp"
  stock: number // үлдэгдэл. 0 бол дууссан
  sizes: string[] // хэрэглэгчийн сонгох размер. Эхнийх нь анхдагч сонголт
}

// Сагсан дахь нэг мөр: бараа + сонгосон размер + тоо
export interface CartItem {
  productId: string
  size: string
  quantity: number
}
