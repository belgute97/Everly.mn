# Дизайны судалгаа ба шийдвэр

Олон улсын grocery e-commerce болон Pinterest-ийн загварыг судалж, Everly-д хэрэглэсэн зүйлс.

## Grocery e-commerce (Baymard, Scandiweb)
- Жагсаалт дахь статик "Сагсанд нэмэх" товч хэрэглэгчид юу нэмснээ мартуулдаг. Товч нь тооны хэмжигч (stepper) болдог нь хамгийн үр дүнтэй. → Карт дээрх "+" нэмсний дараа `− 1 +` болно.
- Нэмсний мэдэгдэл тэр дор, саад болохгүй, "Сагс харах" замтай байх ёстой. → `Toast`.
- Тогтмол (sticky) header дахь сагсны тоо. → `Header` sticky, тоо өөрчлөгдөхөд "pop" animation.

## Pinterest-ийн харагдах хэл
- Дулаан саарал (sand/olive), цэвэр цагаан биш; нэг л онцлох өнгө. → `--color-bg #f6f3ec`, ногоон `#1f6b45`.
- Зураг голдуу карт, 16-20px радиус, бага сүүдэр, хүрээгүй. → `.product-card`.
- Зураг дээр дугуй хөвөх үйлдлийн товч. → `.card-add`.

## Эх сурвалж
- https://baymard.com/blog/grocery-add-to-cart-buttons
- https://baymard.com/blog/grocery-ecommerce-benchmark
- https://scandiweb.com/blog/add-to-cart-best-practices-in-2022-nudging-prospects-to-buy/
- https://getdesign.md/design-md/pinterest/preview (Pinterest-ийн гаднаас хийсэн шинжилгээ, тоон утга нь ойролцоо)
