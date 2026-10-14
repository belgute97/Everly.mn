# Everly.mn

Эрүүл, органик хүнсний онлайн дэлгүүрийн вэб хуудас. Шинэ ногоо, жимс, антибиотикгүй мах, сүү болон өдөр тутмын бараа зарна. Утсан дээр сайн харагдана, монгол хэлтэй, үнэ ₮-өөр.

Одоохондоо жишээ (mock) өгөгдөлтэй ажиллана. Жинхэнэ database, нэвтрэлт, төлбөр байхгүй.

**Технологи:** React, TypeScript, Vite

## Багийн гишүүд ба ажлын хуваарь

| Гишүүн | Хэсэг | Хариуцах зүйл | Хавтас, файл |
|---|---|---|---|
| Belgute | **А: Бараа** | Барааны жагсаалт, хайлт, ангиллын шүүлтүүр | `src/data/products.ts`, `src/pages/HomePage.tsx`, `src/components/ProductCard`, `SearchBar`, `CategoryChips` |
| Odnoo | **Б: Сагс, захиалга** | Сагс, захиалгын form | `src/pages/CartPage.tsx`, `src/pages/CheckoutPage.tsx`, `src/components/CartItemRow`, `src/utils/validateCheckout.ts` |
| Ochiroo | **В: Бүтэц, чат, утас** | Төслийн бүтэц, header, туслах чат, утсан дээрх харагдац | `src/App.tsx`, `src/main.tsx`, `src/types.ts`, `src/styles/`, `src/components/Header`, `ChatWidget`, `src/data/chatReplies.ts` |

Хүн бүр зөвхөн өөрийн хэсгийн файл дээр ажиллана.

Дэлгэрэнгүйг эндээс харна уу:
- Дизайн: [`docs/superpowers-ari-od/specs/2026-10-14-everly-grocery-mvp-design.md`](docs/superpowers-ari-od/specs/2026-10-14-everly-grocery-mvp-design.md)
- Алхам алхмаар төлөвлөгөө: [`docs/superpowers-ari-od/plans/2026-10-14-everly-grocery-mvp.md`](docs/superpowers-ari-od/plans/2026-10-14-everly-grocery-mvp.md)

## Хавтасны бүтэц

```
src/
  components/   Дахин ашиглагдах хэсгүүд (карт, header, чат…)
  pages/        Хуудаснууд (Нүүр, Сагс, Захиалга)
  data/         Жишээ өгөгдөл (бараа, чатын хариулт)
  utils/        Туслах функцууд (үнийн формат, form шалгалт)
  styles/       Өнгө, фонт, зайны тохиргоо
  App.tsx       Хуудаснуудыг холбох үндсэн component
  main.tsx      Эхлэх цэг
docs/           Дизайн ба төлөвлөгөөний баримтууд
```

## Хэрхэн ажиллуулах вэ

1. **Node.js** суулгана (nodejs.org-оос LTS). Хувилбар нь 20.19 эсвэл 22.12-оос дээш байх ёстой. Шалгах: `node -v`
   Компьютер дээр admin эрхгүй бол nodejs.org-оос `win-x64.zip` хувилбарыг татаж, дурын хавтсанд задлаад, тэр хавтсыг `PATH`-д нэмж ашиглаж болно.
2. Төслийг татна:
   ```bash
   git clone https://github.com/belgute97/Everly.mn.git
   cd Everly.mn
   ```
3. Сангуудыг суулгана. Зөвхөн анх удаа, эсвэл `package.json` өөрчлөгдсөн үед хийнэ:
   ```bash
   npm install
   ```
4. Хөгжүүлэлтийн сервер асаана:
   ```bash
   npm run dev
   ```
   Хөтөч дээр **http://localhost:5173** хаягийг нээнэ. Код хадгалах бүрд хуудас автоматаар шинэчлэгдэнэ.

### Бусад командууд

| Команд | Юу хийх вэ |
|---|---|
| `npm run build` | TypeScript алдааг шалгаад, нийтлэхэд бэлэн хувилбарыг `dist/` хавтсанд гаргана |
| `npm run preview` | `build` хийсэн хувилбарыг хөтөч дээр харна |
| `npm run lint` | Кодын алдаа, муу хэвшлийг шалгана |

## Git-ээр хамтран ажиллах

Хүн бүр өөрийн branch дээр ажиллана:

```bash
git switch main
git pull --rebase                # бусдын хамгийн сүүлийн ажлыг татна
git switch -c <таны-branch>     # жишээ нь: a/products, b/cart, c/layout
# ... код бичнэ ...
git add <файлууд>
git commit -m "feat: юу хийснээ товч бичнэ"
git push -u origin <таны-branch>
```

Дараа нь GitHub дээр `main` руу Pull Request нээнэ.

> ⚠️ `node_modules/`, `dist/`, `.env` файлууд GitHub руу явахгүй (`.gitignore`-д тохируулсан). Нууц түлхүүр, нууц үгийг кодонд шууд бичихгүй, `.env` файлд хадгална.
