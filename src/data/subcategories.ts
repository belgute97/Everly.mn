import type { Group } from '../types'

export interface Subcategory {
  id: string // давтагдахгүй, бүлгийн нэрээр эхэлнэ: "women-dress"
  name: string
}

// Үндсэн бүлэг бүрт яг 10 дэд бүлэг
export const subcategories: Record<Group, Subcategory[]> = {
  food: [
    { id: 'food-vegetables', name: 'Ногоо' },
    { id: 'food-fruits', name: 'Жимс' },
    { id: 'food-meat', name: 'Мах' },
    { id: 'food-dairy', name: 'Цагаан идээ' },
    { id: 'food-bakery', name: 'Талх, нарийн боов' },
    { id: 'food-grains', name: 'Будаа, гурил, үр тариа' },
    { id: 'food-drinks', name: 'Ундаа, шөл' },
    { id: 'food-snacks', name: 'Зууш, чихэр' },
    { id: 'food-frozen', name: 'Хөлдөөсөн хүнс' },
    { id: 'food-spices', name: 'Амтлагч, тос' },
  ],
  women: [
    { id: 'women-outerwear', name: 'Гадуур хувцас' },
    { id: 'women-tops', name: 'Цамц' },
    { id: 'women-dress', name: 'Даашинз' },
    { id: 'women-skirts', name: 'Юбка' },
    { id: 'women-pants', name: 'Өмд' },
    { id: 'women-sets', name: 'Иж бүрдэл' },
    { id: 'women-shoes', name: 'Гутал' },
    { id: 'women-bags', name: 'Цүнх' },
    { id: 'women-jewelry', name: 'Гоёл чимэглэл' },
    { id: 'women-accessories', name: 'Аксессуар' },
  ],
  men: [
    { id: 'men-outerwear', name: 'Гадуур хувцас' },
    { id: 'men-shirts', name: 'Цамц' },
    { id: 'men-tshirts', name: 'Футболк' },
    { id: 'men-pants', name: 'Өмд' },
    { id: 'men-suits', name: 'Костюм' },
    { id: 'men-sneakers', name: 'Пүүз' },
    { id: 'men-shoes', name: 'Гутал' },
    { id: 'men-watches', name: 'Цаг' },
    { id: 'men-glasses', name: 'Нарны шил' },
    { id: 'men-accessories', name: 'Аксессуар' },
  ],
  kids: [
    { id: 'kids-baby', name: 'Нялхсын хувцас' },
    { id: 'kids-dresses', name: 'Охидын даашинз' },
    { id: 'kids-boys', name: 'Хөвгүүдийн хувцас' },
    { id: 'kids-tops', name: 'Цамц' },
    { id: 'kids-outerwear', name: 'Гадуур хувцас' },
    { id: 'kids-shoes', name: 'Гутал' },
    { id: 'kids-sneakers', name: 'Пүүз' },
    { id: 'kids-hats', name: 'Малгай' },
    { id: 'kids-bags', name: 'Үүргэвч' },
    { id: 'kids-toys', name: 'Тоглоом' },
  ],
  kitchen: [
    { id: 'kitchen-cookware', name: 'Тогоо, данх' },
    { id: 'kitchen-knives', name: 'Хутга' },
    { id: 'kitchen-utensils', name: 'Хутгуур, хусуур' },
    { id: 'kitchen-prep', name: 'Хэрчих, хуулах' },
    { id: 'kitchen-gadgets', name: 'Жижиг хэрэгсэл' },
    { id: 'kitchen-storage', name: 'Хоолны сав' },
    { id: 'kitchen-tableware', name: 'Аяга, таваг' },
    { id: 'kitchen-racks', name: 'Тавиур' },
    { id: 'kitchen-baking', name: 'Жигнэх хэрэгсэл' },
    { id: 'kitchen-drinks', name: 'Ундааны хэрэгсэл' },
  ],
  appliances: [
    { id: 'appliances-blenders', name: 'Блендер, холигч' },
    { id: 'appliances-kettles', name: 'Цахилгаан данх' },
    { id: 'appliances-cooking', name: 'Хоол бэлтгэх' },
    { id: 'appliances-coffee', name: 'Кофе чанагч' },
    { id: 'appliances-cleaning', name: 'Цэвэрлэгээ' },
    { id: 'appliances-ironing', name: 'Индүү' },
    { id: 'appliances-cooling', name: 'Сэнс, агааржуулалт' },
    { id: 'appliances-personal', name: 'Хувийн арчилгаа' },
    { id: 'appliances-fridges', name: 'Хөргөгч' },
    { id: 'appliances-washing', name: 'Угаалгын машин' },
  ],
  tech: [
    { id: 'tech-phones', name: 'Ухаалаг утас' },
    { id: 'tech-laptops', name: 'Зөөврийн компьютер' },
    { id: 'tech-tablets', name: 'Таблет' },
    { id: 'tech-headphones', name: 'Чихэвч' },
    { id: 'tech-watches', name: 'Ухаалаг цаг' },
    { id: 'tech-speakers', name: 'Чанга яригч' },
    { id: 'tech-cameras', name: 'Камер' },
    { id: 'tech-tv', name: 'Телевиз' },
    { id: 'tech-gaming', name: 'Тоглоомын төхөөрөмж' },
    { id: 'tech-accessories', name: 'Утасны дагалдах' },
  ],
}

// Барааны id → дэд бүлгийн id
const assign = (sub: string, ids: string[]): [string, string][] => ids.map((id) => [id, sub])
const range = (prefix: string, from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => `${prefix}-${String(from + i).padStart(2, '0')}`)

export const productSub: Record<string, string> = Object.fromEntries([
  ...assign('food-vegetables', ['potato', 'carrot', 'cabbage', 'veggie-box']),
  ...assign('food-meat', ['beef', 'mutton', 'chicken', 'horse-ribs']),
  ...assign('food-dairy', ['yogurt', 'airag', 'urum', 'aaruul']),

  ...assign('women-dress', ['women-01', 'women-04', 'women-05', 'women-07', 'women-08']),
  ...assign('women-sets', ['women-02', 'women-03']),
  ...assign('women-jewelry', ['women-06', 'women-09', 'women-20']),
  ...assign('women-shoes', range('women', 10, 14)),
  ...assign('women-bags', range('women', 15, 19)),

  ...assign('men-shirts', ['men-01', 'men-03', 'men-04', 'men-05']),
  ...assign('men-tshirts', ['men-02']),
  ...assign('men-sneakers', ['men-06', 'men-08', 'men-09', 'men-10']),
  ...assign('men-shoes', ['men-07']),
  ...assign('men-watches', range('men', 11, 15)),
  ...assign('men-glasses', range('men', 16, 20)),

  ...assign('kids-baby', ['kids-03', 'kids-04', 'kids-08']),
  ...assign('kids-dresses', ['kids-14', 'kids-19', 'kids-20']),
  ...assign('kids-tops', ['kids-18']),
  ...assign('kids-shoes', ['kids-05', 'kids-06', 'kids-07', 'kids-10', 'kids-13']),
  ...assign('kids-sneakers', ['kids-01', 'kids-02']),
  ...assign('kids-hats', ['kids-12', 'kids-15', 'kids-16', 'kids-17']),
  ...assign('kids-bags', ['kids-09', 'kids-11']),

  ...assign('kitchen-cookware', ['kitchen-04', 'kitchen-14', 'kitchen-15']),
  ...assign('kitchen-knives', ['kitchen-11']),
  ...assign('kitchen-utensils', ['kitchen-01', 'kitchen-09', 'kitchen-18', 'kitchen-19']),
  ...assign('kitchen-prep', ['kitchen-05', 'kitchen-08', 'kitchen-13']),
  ...assign('kitchen-gadgets', ['kitchen-02', 'kitchen-03', 'kitchen-06', 'kitchen-20']),
  ...assign('kitchen-storage', ['kitchen-12']),
  ...assign('kitchen-tableware', ['kitchen-07', 'kitchen-17']),
  ...assign('kitchen-racks', ['kitchen-10', 'kitchen-16']),

  ...assign('appliances-blenders', ['appliances-01', 'appliances-03', 'appliances-15', 'appliances-16', 'appliances-20']),
  ...assign('appliances-kettles', ['appliances-06', 'appliances-07']),
  ...assign('appliances-cooking', ['appliances-02', 'appliances-04', 'appliances-08', 'appliances-11', 'appliances-12', 'appliances-17']),
  ...assign('appliances-coffee', ['appliances-14']),
  ...assign('appliances-cleaning', ['appliances-05']),
  ...assign('appliances-ironing', ['appliances-09']),
  ...assign('appliances-cooling', ['appliances-10', 'appliances-13']),
  ...assign('appliances-personal', ['appliances-18', 'appliances-19']),

  ...assign('tech-phones', range('tech', 1, 8)),
  ...assign('tech-laptops', range('tech', 9, 13)),
  ...assign('tech-tablets', range('tech', 14, 16)),
  ...assign('tech-headphones', ['tech-17', 'tech-18', 'tech-20']),
  ...assign('tech-watches', ['tech-19']),
])
