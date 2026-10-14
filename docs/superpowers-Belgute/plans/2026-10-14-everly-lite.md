# Everly Lite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mock өгөгдөл дээр ажилладаг Everly хүнсний онлайн дэлгүүрийн React хуудас (бараа үзэх, хайх, сагслах, захиалах, mock чат) 3 хүний баг 2 хичээлд хийж дуусгана.

**Architecture:** Vite SPA. React Router хуудас бүрийг тусад нь холбоно. Сагс `CartContext` (useReducer) + `localStorage`, захиалга `localStorage`. Логик нь цэвэр функцүүд (`lib/`, `cart/`, `orders/`) тул Vitest-ээр тестлэгдэнэ. Файл бүр нэг хүний өмч тул мөргөлдөөн гарахгүй.

**Tech Stack:** React, TypeScript, Vite, react-router-dom, lucide-react, Vitest, Testing Library, jsdom. Энгийн CSS (хувьсагчтай), Tailwind-гүй.

**Spec:** `docs/superpowers-Belgute/specs/2026-10-14-everly-lite-design.md`

## Global Constraints

- Монгол хэл, үнэ `₮`-өөр: `12,500₮` (`formatPrice`).
- Сагсны тоо хэмжээ бүхэл, 1–20. Сагс зөвхөн `productId`, `qty` хадгална; үнийг каталогоос тооцно.
- Утас: 8 орон, `[6789]`-өөр эхэлнэ, `+976` зөвшөөрнө. Нэр, хаяг заавал.
- Өнгө: primary `#059669`, background `#ECFDF5`, foreground `#064E3B`, card `#FFFFFF`, border `#A7F3D0`, danger `#DC2626`. Primary дээрх текст хар `#000`.
- Фонт Nunito, үндсэн текст 16px, мөр 1.5. Булан 16–24px. Emoji ашиглахгүй, зөвхөн Lucide SVG.
- Товч бүр хамгийн багадаа 44×44px. 390px өргөнд хэвтээ scroll байхгүй. `prefers-reduced-motion`-ыг хүндэтгэнэ. Дүрсэн товчид `aria-label`.
- Backend, нэвтрэлт, төлбөр, нөөц, админ, захиалгын түүх хийхгүй.
- Төслийн нэр `package.json`-д `online-shop-bag` (баг `[N]` суффиксийг тогтоовол `name`-г солино). Төсөл репогийн үндсэнд байрлана.

## Spec-ээс зориуд хийсэн хялбарчлал

- `Product`-оос `slug`, `imageKey` хасав: зам `/p/:id`, дүрсийг `categorySlug`-аас гаргана.
- `OrderItem` нь захиалгын үеийн нэр, нэгж, үнийг хуулж хадгална (каталог өөрчлөгдөхөд захиалга хэвээр байхын тулд).

## Review Focus

1. Эвдэрсэн/хуучирсан `localStorage` (буруу JSON, байхгүй барааны id, `qty` 0 эсвэл 999, давхар id) → сагс цэвэр эхэлнэ. (Task 4)
2. Утас `+976 99 11 22 33` ба `99-11-22-33` хүчинтэй; 7 орон, `5…`-аар эхэлсэн хүчингүй. (Task 8)
3. Хайлт: хоосон/зөвхөн хоосон зай, ТОМ КИРИЛЛ үсэг, `(`, `*` зэрэг тусгай тэмдэгт crash хийхгүй. (Task 3)
4. Байхгүй `/p/zzz`, `/c/zzz`, `/order/9999` → "олдсонгүй" хуудас. (Task 6, Task 8)
5. Хоосон сагстай захиалга үүсэхгүй (`createOrder` алдаа шиддэг, `/checkout` маягтгүй хоосон мэдэгдэл харуулдаг). (Task 8)
6. Чат: зөвхөн хоосон зайтай мессеж илгээгдэхгүй, түлхүүр үг том үсгээр бичигдсэн ч таарна. (Task 9)

## Ажлын хуваарилалт ба дараалал

| Task | Эзэн | Агуулга | Хамаарал |
|---|---|---|---|
| 1 | В | Төслийн суурь, README, .gitignore | - |
| 2 | В | Гэрээ: types, format | 1 |
| 3 | А | Бараа өгөгдөл, хайлт | 2 |
| 4 | Б | Сагсны логик, хадгалалт, Context | 2, 3 (өгөгдөл) |
| 5 | В | Загвар, Layout, Router, түр хуудас | 2, 4 |
| 6 | А | Каталогийн хуудаснууд | 3, 4, 5 |
| 7 | Б | Сагсны хуудас | 4, 5 |
| 8 | Б | Checkout, захиалга, баталгаажуулалт | 4, 5, 7 |
| 9 | В | Mock чат | 5 |
| 10 | Бүгд | Нэгтгэл, утсан дээрх шалгалт | бүх |

Хичээл 1: Task 1–7. Хичээл 2: Task 8–10. Task 3 ба 4 нь зэрэг явна; Task 3-ийн `products.ts`-ийг Task 4-ийн Context импортлодог тул А эхлээд `products.ts`-ийг commit хийнэ. Task 6, 7, 9 зэрэг явна. Commit хийхээс өмнө `git pull --rebase`.

## File Structure

```
index.html                       (В)
package.json, vite.config.ts     (В)
README.md, .gitignore            (В)
src/main.tsx                     (В) Provider, BrowserRouter
src/App.tsx                      (В) Routes
src/types.ts                     (В) гэрээ
src/lib/format.ts                (В) formatPrice
src/lib/search.ts                (А) searchProducts
src/lib/checkout.ts              (Б) утас, маягтын шалгалт
src/lib/chatReplies.ts           (В) getReply
src/data/products.ts             (А) ангилал, 20 бараа
src/cart/cartReducer.ts          (Б)
src/cart/cartStorage.ts          (Б)
src/cart/CartContext.tsx         (Б) CartProvider, useCart
src/orders/ordersStorage.ts      (Б) createOrder, getOrder
src/components/Layout.tsx        (В) Header, Outlet, BottomNav, ChatWidget
src/components/NotFoundMessage.tsx (В)
src/components/ChatWidget.tsx    (В)
src/components/CategoryIcon.tsx  (А)
src/components/CategoryChips.tsx (А)
src/components/ProductCard.tsx   (А)
src/components/SearchBar.tsx     (А)
src/pages/Home.tsx, Category.tsx, Product.tsx, Search.tsx   (А)
src/pages/Cart.tsx, Checkout.tsx, OrderSuccess.tsx          (Б)
src/pages/NotFound.tsx           (В)
src/styles/tokens.css, global.css, layout.css, chat.css     (В)
src/styles/catalog.css           (А)
src/styles/cart.css              (Б)
```

---

### Task 1: Төслийн суурь (В)

**Files:**
- Create: бүх Vite scaffold, `README.md`, хоосон `src/*` хавтсууд
- Modify: `.gitignore`, `index.html`, `src/App.tsx`, `vite.config.ts`, `package.json`
- Delete: `src/App.css`, `src/assets/react.svg`, `public/vite.svg`

**Interfaces:**
- Produces: ажилладаг `npm run dev`, `npm test`, `npm run build`; `src/` дэд хавтсууд.

- [ ] **Step 1: Scaffold хийж үндэс рүү зөөх**

Репогийн үндсэнд (`docs/` байгаа хавтас):

```bash
npm create vite@latest app-tmp -- --template react-ts
shopt -s dotglob
mv app-tmp/* .
rmdir app-tmp
```

Хэрэв асуувал "install and start now" гэдэгт No гэж хариулна.

- [ ] **Step 2: Сангууд суулгах**

```bash
npm install
npm install react-router-dom lucide-react
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event
npm pkg set name=online-shop-bag
npm pkg set scripts.test="vitest run"
```

- [ ] **Step 3: Жишээ агуулгыг цэвэрлэх**

```bash
rm src/App.css src/assets/react.svg public/vite.svg
rmdir src/assets
mkdir -p src/data src/lib src/cart src/orders src/components src/pages src/styles
touch src/data/.gitkeep src/lib/.gitkeep src/cart/.gitkeep src/orders/.gitkeep src/components/.gitkeep src/pages/.gitkeep src/styles/.gitkeep
```

`src/index.css`-ийг устга (`rm src/index.css`). `src/main.tsx`-ийг солино:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx`:

```tsx
export default function App() {
  return <h1>Онлайн дэлгүүр</h1>;
}
```

`index.html`-д `<html lang="mn">`, `<title>Онлайн дэлгүүр</title>`-ийг тавьж, `vite.svg` link мөрийг устга. `<head>` дотор Nunito фонтыг нэм:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 4: Vitest тохируулах**

`vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true },
});
```

- [ ] **Step 5: .gitignore-д нууц файл нэмэх**

Template-ийн `.gitignore`-д `node_modules`, `dist` аль хэдийн байгааг шалга. Төгсгөлд нэм:

```
.env
.env.*
!.env.example
.scaffold-tmp
```

- [ ] **Step 6: README.md бичих**

```markdown
# Онлайн дэлгүүр (Everly)

Органик, антибиотикгүй мах, шинэхэн хүнсний онлайн дэлгүүрийн жишиг хуудас. Бараа, нэвтрэлт, төлбөр бүгд жишээ (mock) өгөгдөл.

## Баг

| Гишүүн | Хэсэг |
|---|---|
| А | Бараа: каталог, хайлт, барааны хуудас |
| Б | Сагс, checkout, захиалга |
| В | Бүтэц, загвар, чат, утсан дээрх харагдац |

## Ажиллуулах

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # тест
npm run build    # production build
```

## Хавтасны бүтэц

`src/data` (бараа), `src/lib` (цэвэр функц), `src/cart`, `src/orders` (сагс, захиалга), `src/components`, `src/pages`, `src/styles`.

## Багийн дүрэм

Хүн бүр зөвхөн өөрийн файл дээр ажиллана (`docs/superpowers-Belgute/plans/2026-10-14-everly-lite.md` дахь хүснэгт). Commit хийхээс өмнө `git pull --rebase`.
```

- [ ] **Step 7: Шалгах**

Run: `npm run build`
Expected: алдаагүй.
Run: `npm run dev` (дэвсгэрт). Browser-ээр `http://localhost:5173`-г нээж "Онлайн дэлгүүр" гарчигтай хоосон хуудас харагдаж буйг шалга.

- [ ] **Step 8: Commit**

```bash
git add -A
git status --short   # node_modules, dist, .env орсонгүй эсэхийг шалга
git commit -m "Төслийн суурь"
```

---

### Task 2: Хуваалцах гэрээ (В)

**Files:**
- Create: `src/types.ts`, `src/lib/format.ts`
- Test: `src/lib/format.test.ts`

**Interfaces:**
- Produces: бүх төрөл (доор), `formatPrice(n: number): string`.

- [ ] **Step 1: Failing test**

`src/lib/format.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('мянгатын таслалтай ₮ тэмдэгтэй', () => {
    expect(formatPrice(12500)).toBe('12,500₮');
  });
  it('мянгаас бага', () => {
    expect(formatPrice(900)).toBe('900₮');
  });
  it('нэг сая', () => {
    expect(formatPrice(1250000)).toBe('1,250,000₮');
  });
  it('тэг', () => {
    expect(formatPrice(0)).toBe('0₮');
  });
});
```

- [ ] **Step 2: Run, fail**

Run: `npx vitest run src/lib/format.test.ts`
Expected: FAIL (module олдсонгүй).

- [ ] **Step 3: Хэрэгжүүлэлт**

`src/lib/format.ts`:

```ts
export function formatPrice(n: number): string {
  return `${Math.round(n).toLocaleString('en-US')}₮`;
}
```

`src/types.ts`:

```ts
export type CategorySlug = 'meat' | 'dairy' | 'vegetables' | 'fruit' | 'dry';

export interface Category {
  slug: CategorySlug;
  name: string;
}

export interface Product {
  id: string;
  categorySlug: CategorySlug;
  name: string;
  priceMnt: number;
  unit: string;
  description: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  unit: string;
  priceMnt: number;
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface CartApi {
  items: CartItem[];
  count: number;
  total: number;
  add(productId: string): void;
  setQty(productId: string, qty: number): void;
  remove(productId: string): void;
  clear(): void;
}
```

- [ ] **Step 4: Run, pass**

Run: `npx vitest run src/lib/format.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit ба push (бусад хүн авахын тулд)**

```bash
git add src/types.ts src/lib/format.ts src/lib/format.test.ts
git commit -m "feat: хуваалцах гэрээ (types, formatPrice)"
git push
```

---

### Task 3: Бараа өгөгдөл ба хайлт (А)

**Files:**
- Create: `src/data/products.ts`, `src/lib/search.ts`
- Test: `src/data/products.test.ts`, `src/lib/search.test.ts`

**Interfaces:**
- Consumes: `Product`, `Category`, `CategorySlug` (`src/types.ts`).
- Produces: `categories: Category[]`, `products: Product[]`, `getProduct(id: string): Product | undefined`, `getProductsByCategory(slug: string): Product[]`, `searchProducts(products: Product[], query: string): Product[]`.

- [ ] **Step 1: Failing tests**

`src/data/products.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { categories, getProduct, getProductsByCategory, products } from './products';

describe('products data', () => {
  it('5 ангилал, 20 бараа', () => {
    expect(categories).toHaveLength(5);
    expect(products).toHaveLength(20);
  });
  it('id давхцахгүй', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });
  it('үнэ эерэг бүхэл', () => {
    for (const p of products) {
      expect(Number.isInteger(p.priceMnt) && p.priceMnt > 0).toBe(true);
    }
  });
  it('бараа бүр байгаа ангилалд хамаарна, ангилал бүр 3+ бараатай', () => {
    const slugs = new Set(categories.map((c) => c.slug));
    for (const p of products) expect(slugs.has(p.categorySlug)).toBe(true);
    for (const c of categories) {
      expect(getProductsByCategory(c.slug).length).toBeGreaterThanOrEqual(3);
    }
  });
  it('getProduct байхгүй id-д undefined', () => {
    expect(getProduct('zzz')).toBeUndefined();
    expect(getProduct(products[0].id)).toBe(products[0]);
  });
  it('getProductsByCategory байхгүй ангилалд хоосон', () => {
    expect(getProductsByCategory('zzz')).toEqual([]);
  });
});
```

`src/lib/search.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { products } from '../data/products';
import { searchProducts } from './search';

describe('searchProducts', () => {
  it('нэрээр олно', () => {
    const r = searchProducts(products, 'хонины');
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.name.toLowerCase().includes('хонины'))).toBe(true);
  });
  it('ТОМ кирилл үсэгт мэдрэмжгүй', () => {
    expect(searchProducts(products, 'ХОНИНЫ')).toEqual(searchProducts(products, 'хонины'));
  });
  it('тайлбараас олно (антибиотик)', () => {
    expect(searchProducts(products, 'антибиотик').length).toBeGreaterThan(0);
  });
  it('хоосон ба зөвхөн хоосон зай → хоосон жагсаалт', () => {
    expect(searchProducts(products, '')).toEqual([]);
    expect(searchProducts(products, '   ')).toEqual([]);
  });
  it('тусгай тэмдэгт crash хийхгүй', () => {
    expect(searchProducts(products, '(')).toEqual([]);
    expect(searchProducts(products, '*')).toEqual([]);
    expect(searchProducts(products, '[a-')).toEqual([]);
  });
  it('таарахгүй үгэнд хоосон', () => {
    expect(searchProducts(products, 'zzzzzz')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run, fail**

Run: `npx vitest run src/data src/lib/search.test.ts`
Expected: FAIL.

- [ ] **Step 3: Хэрэгжүүлэлт**

`src/data/products.ts`:

```ts
import type { Category, Product } from '../types';

export const categories: Category[] = [
  { slug: 'meat', name: 'Мах' },
  { slug: 'dairy', name: 'Сүү, өндөг' },
  { slug: 'vegetables', name: 'Хүнсний ногоо' },
  { slug: 'fruit', name: 'Жимс' },
  { slug: 'dry', name: 'Органик хуурай бүтээгдэхүүн' },
];

export const products: Product[] = [
  { id: 'meat-beef', categorySlug: 'meat', name: 'Антибиотикгүй үхрийн мах', priceMnt: 32000, unit: 'кг', description: 'Антибиотик, хормонгүйгээр бэлчээрт өсгөсөн үхрийн шинэхэн мах.' },
  { id: 'meat-mutton', categorySlug: 'meat', name: 'Хонины мах', priceMnt: 28000, unit: 'кг', description: 'Тал нутгийн бэлчээрийн хонины шинэхэн мах, антибиотикгүй.' },
  { id: 'meat-chicken', categorySlug: 'meat', name: 'Тахианы цээж', priceMnt: 16500, unit: 'кг', description: 'Антибиотикгүй тэжээлээр өсгөсөн тахианы цээжний мах.' },
  { id: 'meat-horse', categorySlug: 'meat', name: 'Адууны мах', priceMnt: 34000, unit: 'кг', description: 'Бэлчээрийн адууны шинэхэн мах, өөх багатай.' },
  { id: 'dairy-milk', categorySlug: 'dairy', name: 'Шинэхэн сүү', priceMnt: 3500, unit: 'л', description: 'Өдөр бүр савласан фермийн шинэхэн үхрийн сүү.' },
  { id: 'dairy-yogurt', categorySlug: 'dairy', name: 'Байгалийн тараг', priceMnt: 4200, unit: '500г', description: 'Нэмэлтгүй, байгалийн ажиллагаатай тараг.' },
  { id: 'dairy-eggs', categorySlug: 'dairy', name: 'Фермийн өндөг', priceMnt: 8500, unit: '10ш', description: 'Чөлөөт тэжээлтэй тахианы өндөг.' },
  { id: 'dairy-butter', categorySlug: 'dairy', name: 'Цөцгийн тос', priceMnt: 9800, unit: '200г', description: 'Байгалийн цөцгийн тос, нэмэлтгүй.' },
  { id: 'veg-potato', categorySlug: 'vegetables', name: 'Төмс', priceMnt: 2800, unit: 'кг', description: 'Орон нутгийн фермийн цэвэр төмс.' },
  { id: 'veg-carrot', categorySlug: 'vegetables', name: 'Лууван', priceMnt: 3200, unit: 'кг', description: 'Амтлаг, шинэхэн лууван.' },
  { id: 'veg-cabbage', categorySlug: 'vegetables', name: 'Байцаа', priceMnt: 2500, unit: 'кг', description: 'Хатуу, шүүслэг байцаа.' },
  { id: 'veg-tomato', categorySlug: 'vegetables', name: 'Улаан лооль', priceMnt: 7800, unit: 'кг', description: 'Хүлэмжийн шинэхэн улаан лооль.' },
  { id: 'fruit-apple', categorySlug: 'fruit', name: 'Алим', priceMnt: 6900, unit: 'кг', description: 'Чихэр амттай улаан алим.' },
  { id: 'fruit-banana', categorySlug: 'fruit', name: 'Банана', priceMnt: 5900, unit: 'кг', description: 'Боловсорсон шар банана.' },
  { id: 'fruit-orange', categorySlug: 'fruit', name: 'Жүрж', priceMnt: 7200, unit: 'кг', description: 'Шүүслэг, C аминдэмээр баялаг жүрж.' },
  { id: 'fruit-grape', categorySlug: 'fruit', name: 'Усан үзэм', priceMnt: 14500, unit: 'кг', description: 'Үргүй, чихэрлэг усан үзэм.' },
  { id: 'dry-rice', categorySlug: 'dry', name: 'Органик будаа', priceMnt: 9800, unit: 'кг', description: 'Химийн бордоогүй органик цагаан будаа.' },
  { id: 'dry-oats', categorySlug: 'dry', name: 'Овъёосны үрэл', priceMnt: 7500, unit: '500г', description: 'Өглөөний хоолонд тохиромжтой органик овъёос.' },
  { id: 'dry-honey', categorySlug: 'dry', name: 'Зөгийн бал', priceMnt: 24000, unit: '500г', description: 'Тунгалаг, байгалийн зөгийн бал.' },
  { id: 'dry-chia', categorySlug: 'dry', name: 'Чиа үр', priceMnt: 12500, unit: '250г', description: 'Омега-3 агуулсан органик чиа үр.' },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}
```

`src/lib/search.ts`:

```ts
import type { Product } from '../types';

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
  );
}
```

- [ ] **Step 4: Run, pass**

Run: `npx vitest run src/data src/lib/search.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit ба push**

```bash
git add src/data src/lib/search.ts src/lib/search.test.ts
git commit -m "feat: mock бараа өгөгдөл ба хайлт"
git push
```

---

### Task 4: Сагсны логик, хадгалалт, Context (Б)

**Files:**
- Create: `src/cart/cartReducer.ts`, `src/cart/cartStorage.ts`, `src/cart/CartContext.tsx`
- Test: `src/cart/cartReducer.test.ts`, `src/cart/cartStorage.test.ts`, `src/cart/CartContext.test.tsx`

**Interfaces:**
- Consumes: `CartItem`, `CartApi` (`src/types.ts`); `products`, `getProduct` (`src/data/products.ts`).
- Produces: `MAX_QTY = 20`, `cartReducer(state: CartItem[], action: CartAction): CartItem[]`, `loadCart(validIds: Set<string>): CartItem[]`, `saveCart(items: CartItem[]): void`, `CartProvider({children})`, `useCart(): CartApi`.

- [ ] **Step 1: Failing tests**

`src/cart/cartReducer.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { MAX_QTY, cartReducer } from './cartReducer';

describe('cartReducer', () => {
  it('add: шинэ бараа qty 1', () => {
    expect(cartReducer([], { type: 'add', productId: 'a' })).toEqual([{ productId: 'a', qty: 1 }]);
  });
  it('add: байгаа бараа +1', () => {
    expect(cartReducer([{ productId: 'a', qty: 1 }], { type: 'add', productId: 'a' })).toEqual([
      { productId: 'a', qty: 2 },
    ]);
  });
  it('add: 20-оос хэтрэхгүй', () => {
    const s = [{ productId: 'a', qty: MAX_QTY }];
    expect(cartReducer(s, { type: 'add', productId: 'a' })[0].qty).toBe(MAX_QTY);
  });
  it('setQty: 1–20 хооронд хязгаарлана, бүхэл болгоно', () => {
    const s = [{ productId: 'a', qty: 5 }];
    expect(cartReducer(s, { type: 'setQty', productId: 'a', qty: 0 })[0].qty).toBe(1);
    expect(cartReducer(s, { type: 'setQty', productId: 'a', qty: 999 })[0].qty).toBe(20);
    expect(cartReducer(s, { type: 'setQty', productId: 'a', qty: 3.9 })[0].qty).toBe(3);
  });
  it('setQty: NaN үед өөрчлөхгүй', () => {
    const s = [{ productId: 'a', qty: 5 }];
    expect(cartReducer(s, { type: 'setQty', productId: 'a', qty: NaN })).toBe(s);
  });
  it('remove ба clear', () => {
    const s = [{ productId: 'a', qty: 1 }, { productId: 'b', qty: 2 }];
    expect(cartReducer(s, { type: 'remove', productId: 'a' })).toEqual([{ productId: 'b', qty: 2 }]);
    expect(cartReducer(s, { type: 'clear' })).toEqual([]);
  });
});
```

`src/cart/cartStorage.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { loadCart, saveCart } from './cartStorage';

const valid = new Set(['a', 'b']);

describe('cartStorage', () => {
  beforeEach(() => localStorage.clear());

  it('хадгалаад буцааж уншина', () => {
    saveCart([{ productId: 'a', qty: 2 }]);
    expect(loadCart(valid)).toEqual([{ productId: 'a', qty: 2 }]);
  });
  it('хоосон үед []', () => {
    expect(loadCart(valid)).toEqual([]);
  });
  it('буруу JSON → []', () => {
    localStorage.setItem('everly.cart', '{not json');
    expect(loadCart(valid)).toEqual([]);
  });
  it('массив биш → []', () => {
    localStorage.setItem('everly.cart', '{"a":1}');
    expect(loadCart(valid)).toEqual([]);
  });
  it('байхгүй id, qty 0, qty 999, давхар id, хэлбэр буруу мөрийг хасна', () => {
    localStorage.setItem(
      'everly.cart',
      JSON.stringify([
        { productId: 'a', qty: 2 },
        { productId: 'zzz', qty: 1 },
        { productId: 'b', qty: 0 },
        { productId: 'b', qty: 999 },
        { productId: 'a', qty: 3 },
        null,
        { productId: 5, qty: 1 },
        { productId: 'b', qty: 1.5 },
      ]),
    );
    expect(loadCart(valid)).toEqual([{ productId: 'a', qty: 2 }]);
  });
});
```

`src/cart/CartContext.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { products } from '../data/products';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>;

describe('CartContext', () => {
  beforeEach(() => localStorage.clear());

  it('add хоёр удаа → count 2, total = 2 × үнэ', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(products[0].id));
    act(() => result.current.add(products[0].id));
    expect(result.current.count).toBe(2);
    expect(result.current.total).toBe(products[0].priceMnt * 2);
  });
  it('localStorage-д хадгалж, дахин ачаалахад сэргээнэ', () => {
    const first = renderHook(() => useCart(), { wrapper });
    act(() => first.result.current.add(products[1].id));
    first.unmount();
    const second = renderHook(() => useCart(), { wrapper });
    expect(second.result.current.count).toBe(1);
  });
  it('clear сагсыг хоослоно', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(products[0].id));
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
  });
  it('Provider-гүй үед тодорхой алдаа', () => {
    expect(() => renderHook(() => useCart())).toThrow('CartProvider');
  });
});
```

- [ ] **Step 2: Run, fail**

Run: `npx vitest run src/cart`
Expected: FAIL.

- [ ] **Step 3: Хэрэгжүүлэлт**

`src/cart/cartReducer.ts`:

```ts
import type { CartItem } from '../types';

export const MAX_QTY = 20;

export type CartAction =
  | { type: 'add'; productId: string }
  | { type: 'setQty'; productId: string; qty: number }
  | { type: 'remove'; productId: string }
  | { type: 'clear' };

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      if (!state.some((i) => i.productId === action.productId)) {
        return [...state, { productId: action.productId, qty: 1 }];
      }
      return state.map((i) =>
        i.productId === action.productId ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i,
      );
    }
    case 'setQty': {
      if (!Number.isFinite(action.qty)) return state;
      const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(action.qty)));
      return state.map((i) => (i.productId === action.productId ? { ...i, qty } : i));
    }
    case 'remove':
      return state.filter((i) => i.productId !== action.productId);
    case 'clear':
      return [];
  }
}
```

`src/cart/cartStorage.ts`:

```ts
import type { CartItem } from '../types';
import { MAX_QTY } from './cartReducer';

const KEY = 'everly.cart';

export function loadCart(validIds: Set<string>): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    const seen = new Set<string>();
    const out: CartItem[] = [];
    for (const it of data) {
      if (
        it &&
        typeof it.productId === 'string' &&
        validIds.has(it.productId) &&
        !seen.has(it.productId) &&
        Number.isInteger(it.qty) &&
        it.qty >= 1 &&
        it.qty <= MAX_QTY
      ) {
        seen.add(it.productId);
        out.push({ productId: it.productId, qty: it.qty });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // хадгалах боломжгүй (private mode, дүүрсэн) бол санах ойд үргэлжилнэ
  }
}
```

`src/cart/CartContext.tsx`:

```tsx
import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { getProduct, products } from '../data/products';
import type { CartApi } from '../types';
import { cartReducer } from './cartReducer';
import { loadCart, saveCart } from './cartStorage';

const CartContext = createContext<CartApi | null>(null);
const validIds = new Set(products.map((p) => p.id));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, () => loadCart(validIds));

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const api = useMemo<CartApi>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      total: items.reduce((sum, i) => sum + (getProduct(i.productId)?.priceMnt ?? 0) * i.qty, 0),
      add: (productId) => dispatch({ type: 'add', productId }),
      setQty: (productId, qty) => dispatch({ type: 'setQty', productId, qty }),
      remove: (productId) => dispatch({ type: 'remove', productId }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [items],
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
```

- [ ] **Step 4: Run, pass**

Run: `npx vitest run src/cart`
Expected: PASS.

- [ ] **Step 5: Commit ба push**

```bash
git add src/cart
git commit -m "feat: сагсны reducer, хадгалалт, CartProvider"
git push
```

---

### Task 5: Загвар, Layout, Router, түр хуудас (В)

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/layout.css`, `src/components/Layout.tsx`, `src/components/NotFoundMessage.tsx`, `src/pages/NotFound.tsx`, түр хуудсууд (`Home`, `Category`, `Product`, `Search`, `Cart`, `Checkout`, `OrderSuccess`)
- Modify: `src/main.tsx`, `src/App.tsx`

**Interfaces:**
- Consumes: `useCart()` (Task 4).
- Produces: `Layout` (header, `<Outlet/>`, bottom nav), `NotFoundMessage({title, text})` компонент (`default` биш, нэрлэсэн export), маршрутууд: `/`, `/c/:slug`, `/p/:id`, `/search`, `/cart`, `/checkout`, `/order/:id`, `*`. Хуудас бүр `export default function X()`.

- [ ] **Step 1: Түр хуудсууд**

Хуудас бүрийг (Home, Category, Product, Search, Cart, Checkout, OrderSuccess) энэ хэлбэрээр үүсгэ (А, Б дараа нь өөрсдийнхөө файлыг бүрэн солино):

```tsx
export default function Home() {
  return <h1>Нүүр</h1>;
}
```

(`Category` → "Ангилал", `Product` → "Бараа", `Search` → "Хайлт", `Cart` → "Сагс", `Checkout` → "Захиалга", `OrderSuccess` → "Захиалгын баталгаа".)

`src/components/NotFoundMessage.tsx`:

```tsx
import { Link } from 'react-router-dom';

export function NotFoundMessage({ title, text }: { title: string; text?: string }) {
  return (
    <section className="empty-state">
      <h1>{title}</h1>
      {text && <p>{text}</p>}
      <Link className="btn" to="/">Дэлгүүр рүү буцах</Link>
    </section>
  );
}
```

`src/pages/NotFound.tsx`:

```tsx
import { NotFoundMessage } from '../components/NotFoundMessage';

export default function NotFound() {
  return <NotFoundMessage title="Хуудас олдсонгүй" text="Таны хайсан хуудас байхгүй байна." />;
}
```

- [ ] **Step 2: Загварын файлууд**

`src/styles/tokens.css`:

```css
:root {
  --color-primary: #059669;
  --color-on-primary: #000000;
  --color-bg: #ecfdf5;
  --color-fg: #064e3b;
  --color-card: #ffffff;
  --color-border: #a7f3d0;
  --color-danger: #dc2626;
  --color-muted: #475569;
  --radius: 16px;
  --radius-lg: 24px;
  --shadow: 0 2px 10px rgba(6, 78, 59, 0.12);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
}
```

`src/styles/global.css`:

```css
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  font-family: 'Nunito', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-fg);
  background: var(--color-bg);
  overflow-x: hidden;
}
h1 { font-size: 1.5rem; line-height: 1.25; margin: 0 0 var(--space-4); }
h2 { font-size: 1.25rem; line-height: 1.3; margin: var(--space-6) 0 var(--space-3); }
a { color: inherit; }
img, svg { max-width: 100%; }
:focus-visible { outline: 3px solid var(--color-fg); outline-offset: 2px; }

.container { max-width: 720px; margin: 0 auto; padding: var(--space-4); }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  min-height: 44px; min-width: 44px; padding: 0 var(--space-4);
  font: inherit; font-weight: 700; text-decoration: none; cursor: pointer;
  color: var(--color-on-primary); background: var(--color-primary);
  border: 2px solid var(--color-primary); border-radius: var(--radius);
  transition: transform 150ms ease, opacity 150ms ease;
}
.btn:active { transform: scale(0.98); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: transparent; color: var(--color-fg); border-color: var(--color-border); }

input, textarea {
  width: 100%; min-height: 44px; padding: var(--space-2) var(--space-3);
  font: inherit; font-size: 16px; color: var(--color-fg);
  background: var(--color-card); border: 2px solid var(--color-border); border-radius: var(--radius);
}
input[aria-invalid='true'] { border-color: var(--color-danger); }
label { display: block; font-weight: 600; margin-bottom: var(--space-1); }

.visually-hidden {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}
.empty-state { text-align: center; padding: var(--space-6) var(--space-4); }
.error-text { color: var(--color-danger); font-size: 0.9rem; margin: var(--space-1) 0 0; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; }
}
```

`src/styles/layout.css`:

```css
.site-header {
  position: sticky; top: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  background: var(--color-card); box-shadow: var(--shadow);
}
.brand { font-weight: 700; font-size: 1.25rem; color: var(--color-fg); text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
.cart-link { position: relative; display: inline-flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; }
.cart-badge {
  position: absolute; top: 0; right: 0; min-width: 20px; height: 20px; padding: 0 5px;
  font-size: 0.75rem; font-weight: 700; line-height: 20px; text-align: center;
  color: var(--color-on-primary); background: var(--color-primary); border-radius: 10px;
}
.page { padding-bottom: 160px; }
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 10;
  display: flex; justify-content: space-around;
  padding: var(--space-1) 0 calc(var(--space-1) + env(safe-area-inset-bottom));
  background: var(--color-card); box-shadow: 0 -2px 10px rgba(6, 78, 59, 0.12);
}
.bottom-nav a {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 64px; min-height: 48px; font-size: 0.75rem; font-weight: 600;
  color: var(--color-muted); text-decoration: none;
}
.bottom-nav a.active { color: var(--color-fg); box-shadow: inset 0 -3px 0 var(--color-primary); }
```

Тэмдэглэл: `#059669` нь цагаан дэвсгэр дээр жижиг текстэд ойролцоогоор 3.8:1 контраст өгдөг тул текстэд ашиглахгүй. Иймд `.brand` ба `.bottom-nav a.active` нь `var(--color-fg)` өнгөтэй, идэвхтэй цэсийг доогуур ногоон зураасаар ялгана.

- [ ] **Step 3: Layout ба Router**

`src/components/Layout.tsx`:

```tsx
import { Home, Search, ShoppingCart } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useCart } from '../cart/CartContext';

export default function Layout() {
  const { count } = useCart();
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">Everly</Link>
        <Link to="/cart" className="cart-link" aria-label={`Сагс, ${count} бараа`}>
          <ShoppingCart aria-hidden="true" />
          {count > 0 && <span className="cart-badge" aria-hidden="true">{count}</span>}
        </Link>
      </header>
      <main className="container page">
        <Outlet />
      </main>
      <nav className="bottom-nav" aria-label="Үндсэн цэс">
        <NavLink to="/" end><Home aria-hidden="true" />Нүүр</NavLink>
        <NavLink to="/search"><Search aria-hidden="true" />Хайлт</NavLink>
        <NavLink to="/cart"><ShoppingCart aria-hidden="true" />Сагс</NavLink>
      </nav>
    </>
  );
}
```

`src/App.tsx`:

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './cart/CartContext';
import Layout from './components/Layout';
import Cart from './pages/Cart';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import OrderSuccess from './pages/OrderSuccess';
import Product from './pages/Product';
import Search from './pages/Search';
import './styles/tokens.css';
import './styles/global.css';
import './styles/layout.css';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="c/:slug" element={<Category />} />
            <Route path="p/:id" element={<Product />} />
            <Route path="search" element={<Search />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:id" element={<OrderSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
```

`src/main.tsx` өөрчлөлтгүй (App дотор Provider бий).

- [ ] **Step 4: Шалгах**

Run: `npm run build`
Expected: алдаагүй.
Run: `npm run dev`; browser-т `/`, `/cart`, `/zzz` нээж Layout, доод цэс, 404 хуудас ажиллаж буйг шалга. Chrome devtools-ийн 390px харагдацад хэвтээ scroll байхгүй эсэхийг хар.

- [ ] **Step 5: Commit ба push**

```bash
git add -A
git commit -m "feat: загварын токен, Layout, Router, түр хуудсууд"
git push
```

---

### Task 6: Каталогийн хуудаснууд (А)

**Files:**
- Create: `src/components/CategoryIcon.tsx`, `src/components/CategoryChips.tsx`, `src/components/ProductCard.tsx`, `src/components/SearchBar.tsx`, `src/styles/catalog.css`
- Modify: `src/pages/Home.tsx`, `src/pages/Category.tsx`, `src/pages/Product.tsx`, `src/pages/Search.tsx`; `src/App.tsx` (зөвхөн `import './styles/catalog.css';` мөр нэмэх)
- Test: `src/pages/Product.test.tsx`

**Interfaces:**
- Consumes: `categories`, `products`, `getProduct`, `getProductsByCategory`, `searchProducts` (Task 3); `useCart()` (Task 4); `NotFoundMessage` (Task 5); `formatPrice` (Task 2).
- Produces: `<ProductCard product={Product} />`, `<CategoryIcon slug={CategorySlug} size?={number} />`, `<CategoryChips />`, `<SearchBar defaultValue?={string} />`.

- [ ] **Step 1: Failing test (байхгүй бараа, байгаа бараа)**

`src/pages/Product.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider } from '../cart/CartContext';
import { products } from '../data/products';
import Product from './Product';

function renderAt(path: string) {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/p/:id" element={<Product />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>,
  );
}

describe('Product page', () => {
  beforeEach(() => localStorage.clear());

  it('байхгүй id → олдсонгүй', () => {
    renderAt('/p/zzz');
    expect(screen.getByText('Бараа олдсонгүй')).toBeTruthy();
  });
  it('байгаа бараа → нэр, үнэ, сагсанд нэмэх', () => {
    const p = products[0];
    renderAt(`/p/${p.id}`);
    expect(screen.getByRole('heading', { name: p.name })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Сагсанд нэмэх' }));
    expect(screen.getByRole('status').textContent).toContain('1');
  });
});
```

- [ ] **Step 2: Run, fail**

Run: `npx vitest run src/pages/Product.test.tsx`
Expected: FAIL (түр хуудас).

- [ ] **Step 3: Компонентууд**

`src/components/CategoryIcon.tsx`:

```tsx
import { Apple, Beef, Carrot, Milk, Wheat, type LucideIcon } from 'lucide-react';
import type { CategorySlug } from '../types';

const STYLES: Record<CategorySlug, { Icon: LucideIcon; bg: string; fg: string }> = {
  meat: { Icon: Beef, bg: '#fee2e2', fg: '#991b1b' },
  dairy: { Icon: Milk, bg: '#e0f2fe', fg: '#075985' },
  vegetables: { Icon: Carrot, bg: '#dcfce7', fg: '#166534' },
  fruit: { Icon: Apple, bg: '#ffedd5', fg: '#9a3412' },
  dry: { Icon: Wheat, bg: '#fef3c7', fg: '#92400e' },
};

export function CategoryIcon({ slug, size = 48 }: { slug: CategorySlug; size?: number }) {
  const { Icon, bg, fg } = STYLES[slug];
  return (
    <span className="category-icon" style={{ background: bg, color: fg }} aria-hidden="true">
      <Icon size={size} />
    </span>
  );
}
```

`src/components/CategoryChips.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { categories } from '../data/products';

export function CategoryChips() {
  return (
    <nav className="chips" aria-label="Ангилал">
      {categories.map((c) => (
        <Link key={c.slug} to={`/c/${c.slug}`} className="chip">{c.name}</Link>
      ))}
    </nav>
  );
}
```

`src/components/ProductCard.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { formatPrice } from '../lib/format';
import type { Product } from '../types';
import { CategoryIcon } from './CategoryIcon';

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <article className="product-card">
      <Link to={`/p/${product.id}`} className="product-card-link">
        <CategoryIcon slug={product.categorySlug} />
        <h3>{product.name}</h3>
        <p className="price">{formatPrice(product.priceMnt)} <span>/ {product.unit}</span></p>
      </Link>
      <button type="button" className="btn" onClick={() => add(product.id)} aria-label={`${product.name} сагсанд нэмэх`}>
        Сагсанд нэмэх
      </button>
    </article>
  );
}
```

`src/components/SearchBar.tsx`:

```tsx
import { Search } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export function SearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const navigate = useNavigate();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form className="search-bar" role="search" onSubmit={onSubmit}>
      <label htmlFor="q" className="visually-hidden">Бараа хайх</label>
      <input id="q" type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Бараа хайх..." />
      <button type="submit" className="btn" aria-label="Хайх"><Search aria-hidden="true" /></button>
    </form>
  );
}
```

- [ ] **Step 4: Хуудсууд**

`src/pages/Home.tsx`:

```tsx
import { CategoryChips } from '../components/CategoryChips';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { categories, getProductsByCategory } from '../data/products';

export default function Home() {
  const featured = categories.flatMap((c) => getProductsByCategory(c.slug).slice(0, 2));
  return (
    <>
      <h1>Шинэхэн, эрүүл хүнс</h1>
      <SearchBar />
      <CategoryChips />
      <h2>Онцлох бараа</h2>
      <div className="product-grid">
        {featured.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
```

`src/pages/Category.tsx`:

```tsx
import { useParams } from 'react-router-dom';
import { CategoryChips } from '../components/CategoryChips';
import { NotFoundMessage } from '../components/NotFoundMessage';
import { ProductCard } from '../components/ProductCard';
import { categories, getProductsByCategory } from '../data/products';

export default function Category() {
  const { slug = '' } = useParams();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return <NotFoundMessage title="Ангилал олдсонгүй" />;
  return (
    <>
      <h1>{category.name}</h1>
      <CategoryChips />
      <div className="product-grid">
        {getProductsByCategory(slug).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
```

`src/pages/Product.tsx`:

```tsx
import { useParams } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { CategoryIcon } from '../components/CategoryIcon';
import { NotFoundMessage } from '../components/NotFoundMessage';
import { getProduct } from '../data/products';
import { formatPrice } from '../lib/format';

export default function Product() {
  const { id = '' } = useParams();
  const { items, add } = useCart();
  const product = getProduct(id);
  if (!product) return <NotFoundMessage title="Бараа олдсонгүй" />;
  const inCart = items.find((i) => i.productId === product.id)?.qty ?? 0;
  return (
    <article className="product-detail">
      <CategoryIcon slug={product.categorySlug} size={96} />
      <h1>{product.name}</h1>
      <p className="price">{formatPrice(product.priceMnt)} <span>/ {product.unit}</span></p>
      <p>{product.description}</p>
      <button type="button" className="btn" onClick={() => add(product.id)}>Сагсанд нэмэх</button>
      <p role="status">{inCart > 0 ? `Сагсанд: ${inCart}` : ''}</p>
    </article>
  );
}
```

`src/pages/Search.tsx`:

```tsx
import { useSearchParams } from 'react-router-dom';
import { CategoryChips } from '../components/CategoryChips';
import { ProductCard } from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { products } from '../data/products';
import { searchProducts } from '../lib/search';

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const results = searchProducts(products, q);
  return (
    <>
      <h1>Хайлт</h1>
      <SearchBar key={q} defaultValue={q} />
      {!q.trim() && <p>Хайх үгээ бичнэ үү.</p>}
      {q.trim() && results.length === 0 && (
        <section className="empty-state">
          <p>«{q}» гэсэн бараа олдсонгүй. Ангилнаас сонгоно уу:</p>
          <CategoryChips />
        </section>
      )}
      <div className="product-grid">
        {results.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
```

- [ ] **Step 5: CSS**

`src/styles/catalog.css` үүсгэж `src/App.tsx`-д `import './styles/catalog.css';` нэм:

```css
.category-icon { display: flex; align-items: center; justify-content: center; width: 100%; aspect-ratio: 4 / 3; border-radius: var(--radius); }
.product-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-3); }
@media (min-width: 640px) { .product-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.product-card { display: flex; flex-direction: column; gap: var(--space-2); padding: var(--space-3); background: var(--color-card); border-radius: var(--radius-lg); box-shadow: var(--shadow); }
.product-card-link { text-decoration: none; display: block; }
.product-card h3 { font-size: 1rem; margin: var(--space-2) 0 var(--space-1); }
.price { font-weight: 700; margin: 0; }
.price span { font-weight: 400; color: var(--color-muted); }
.chips { display: flex; gap: var(--space-2); overflow-x: auto; padding: var(--space-3) 0; scrollbar-width: none; }
.chip { flex: none; display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--space-4); font-weight: 600; text-decoration: none; background: var(--color-card); border: 2px solid var(--color-border); border-radius: 999px; }
.search-bar { display: flex; gap: var(--space-2); }
.product-detail { display: flex; flex-direction: column; gap: var(--space-3); }
```

- [ ] **Step 6: Run, pass, гараар шалга**

Run: `npx vitest run` ба `npm run build`
Expected: бүгд PASS, build алдаагүй.
Browser: нүүр, ангилал, барааны хуудас, хайлт (`хонины`, `ХОНИНЫ`, `zzz`) ажиллана; 390px-д `.chips` дотроо scroll хийх боловч хуудас хэвтээ scroll хийхгүй.

- [ ] **Step 7: Commit ба push**

```bash
git add -A
git commit -m "feat: нүүр, ангилал, бараа, хайлтын хуудас"
git push
```

---

### Task 7: Сагсны хуудас (Б)

**Files:**
- Modify: `src/pages/Cart.tsx`; `src/App.tsx` (зөвхөн `import './styles/cart.css';` мөр нэмэх)
- Create: `src/styles/cart.css`
- Test: `src/pages/Cart.test.tsx`

**Interfaces:**
- Consumes: `useCart()`, `getProduct`, `formatPrice`, `MAX_QTY`.
- Produces: `/cart` хуудас; "Захиалах" холбоос `/checkout` руу.

- [ ] **Step 1: Failing test**

`src/pages/Cart.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider } from '../cart/CartContext';
import { products } from '../data/products';
import Cart from './Cart';

function seed(items: { productId: string; qty: number }[]) {
  localStorage.setItem('everly.cart', JSON.stringify(items));
}
function renderCart() {
  return render(
    <CartProvider>
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    </CartProvider>,
  );
}

describe('Cart page', () => {
  beforeEach(() => localStorage.clear());

  it('хоосон сагс → мэдэгдэл', () => {
    renderCart();
    expect(screen.getByText('Сагс хоосон байна')).toBeTruthy();
  });
  it('мөр, нийт дүн харагдана', () => {
    seed([{ productId: products[0].id, qty: 2 }]);
    renderCart();
    expect(screen.getByText(products[0].name)).toBeTruthy();
    expect(screen.getAllByText('64,000₮').length).toBeGreaterThan(0);
  });
  it('+ товч тоог нэмнэ, 20-д идэвхгүй болно', () => {
    seed([{ productId: products[0].id, qty: 19 }]);
    renderCart();
    const plus = screen.getByRole('button', { name: `${products[0].name} нэмэх` }) as HTMLButtonElement;
    fireEvent.click(plus);
    expect(plus.disabled).toBe(true);
  });
  it('устгахад мөр алга болно', () => {
    seed([{ productId: products[0].id, qty: 1 }]);
    renderCart();
    fireEvent.click(screen.getByRole('button', { name: `${products[0].name} устгах` }));
    expect(screen.getByText('Сагс хоосон байна')).toBeTruthy();
  });
});
```

(`products[0]` = Антибиотикгүй үхрийн мах, 32,000₮ × 2 = 64,000₮.)

- [ ] **Step 2: Run, fail**

Run: `npx vitest run src/pages/Cart.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Хэрэгжүүлэлт**

`src/pages/Cart.tsx`:

```tsx
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { MAX_QTY } from '../cart/cartReducer';
import { getProduct } from '../data/products';
import { formatPrice } from '../lib/format';

export default function Cart() {
  const { items, total, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <section className="empty-state">
        <h1>Сагс хоосон байна</h1>
        <Link className="btn" to="/">Дэлгүүр рүү буцах</Link>
      </section>
    );
  }

  return (
    <>
      <h1>Сагс</h1>
      <ul className="cart-list">
        {items.map((item) => {
          const p = getProduct(item.productId);
          if (!p) return null;
          return (
            <li key={p.id} className="cart-row">
              <div className="cart-row-info">
                <strong>{p.name}</strong>
                <span>{formatPrice(p.priceMnt)} / {p.unit}</span>
              </div>
              <div className="qty">
                <button type="button" className="btn btn-secondary" aria-label={`${p.name} хасах`} disabled={item.qty <= 1} onClick={() => setQty(p.id, item.qty - 1)}>
                  <Minus aria-hidden="true" />
                </button>
                <span aria-live="polite">{item.qty}</span>
                <button type="button" className="btn btn-secondary" aria-label={`${p.name} нэмэх`} disabled={item.qty >= MAX_QTY} onClick={() => setQty(p.id, item.qty + 1)}>
                  <Plus aria-hidden="true" />
                </button>
              </div>
              <strong>{formatPrice(p.priceMnt * item.qty)}</strong>
              <button type="button" className="btn btn-secondary" aria-label={`${p.name} устгах`} onClick={() => remove(p.id)}>
                <Trash2 aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="cart-total">Нийт: <strong>{formatPrice(total)}</strong></p>
      <Link className="btn" to="/checkout">Захиалах</Link>
    </>
  );
}
```

`src/styles/cart.css` (мөн checkout-д хэрэглэнэ):

```css
.cart-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-3); }
.cart-row { display: grid; grid-template-columns: 1fr auto; gap: var(--space-2) var(--space-3); align-items: center; padding: var(--space-3); background: var(--color-card); border-radius: var(--radius-lg); box-shadow: var(--shadow); }
.cart-row-info { display: flex; flex-direction: column; grid-column: 1 / -1; }
.cart-row-info span { color: var(--color-muted); font-size: 0.9rem; }
.qty { display: flex; align-items: center; gap: var(--space-2); }
.qty span { min-width: 28px; text-align: center; font-weight: 700; }
.cart-total { font-size: 1.25rem; text-align: right; }
.form-field { margin-bottom: var(--space-4); }
.summary { padding: var(--space-3); margin-bottom: var(--space-4); background: var(--color-card); border-radius: var(--radius-lg); box-shadow: var(--shadow); }
.summary ul { margin: 0; padding-left: var(--space-4); }
```

- [ ] **Step 4: Run, pass**

Run: `npx vitest run src/pages/Cart.test.tsx`
Expected: PASS. Browser-т барааг сагсла, refresh хий, сагс үлдэж буйг шалга.

- [ ] **Step 5: Commit ба push**

```bash
git add -A
git commit -m "feat: сагсны хуудас"
git push
```

---

### Task 8: Checkout, захиалга, баталгаажуулалт (Б)

**Files:**
- Create: `src/lib/checkout.ts`, `src/orders/ordersStorage.ts`
- Modify: `src/pages/Checkout.tsx`, `src/pages/OrderSuccess.tsx`
- Test: `src/lib/checkout.test.ts`, `src/orders/ordersStorage.test.ts`, `src/pages/OrderSuccess.test.tsx`, `src/pages/Checkout.test.tsx`

**Interfaces:**
- Consumes: `CartItem`, `Order`, `OrderItem` (types); `getProduct`; `useCart()`; `NotFoundMessage`; `formatPrice`.
- Produces: `CheckoutForm`, `validateCheckout(f: CheckoutForm): CheckoutErrors`, `normalizePhone(raw: string): string`, `isValidPhone(raw: string): boolean`, `createOrder(items: CartItem[], form: CheckoutForm): Order`, `getOrder(id: string): Order | undefined`.

- [ ] **Step 1: Failing tests**

`src/lib/checkout.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isValidPhone, normalizePhone, validateCheckout } from './checkout';

describe('phone', () => {
  it('хүчинтэй хэлбэрүүд', () => {
    expect(isValidPhone('99112233')).toBe(true);
    expect(isValidPhone('+976 99 11 22 33')).toBe(true);
    expect(isValidPhone('99-11-22-33')).toBe(true);
    expect(isValidPhone('60112233')).toBe(true);
  });
  it('хүчингүй хэлбэрүүд', () => {
    expect(isValidPhone('9911223')).toBe(false);
    expect(isValidPhone('991122334')).toBe(false);
    expect(isValidPhone('51112233')).toBe(false);
    expect(isValidPhone('abcdefgh')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });
  it('normalizePhone +976 болон зайг хасна', () => {
    expect(normalizePhone('+976 99 11 22 33')).toBe('99112233');
  });
});

describe('validateCheckout', () => {
  it('бүгд зөв үед алдаагүй', () => {
    expect(validateCheckout({ name: 'Болд', phone: '99112233', address: 'БЗД, 5-р хороо' })).toEqual({});
  });
  it('хоосон ба зөвхөн хоосон зайтай талбарт алдаа', () => {
    const e = validateCheckout({ name: '  ', phone: '', address: ' ' });
    expect(e.name).toBeTruthy();
    expect(e.phone).toBeTruthy();
    expect(e.address).toBeTruthy();
  });
});
```

`src/orders/ordersStorage.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { products } from '../data/products';
import { createOrder, getOrder } from './ordersStorage';

const form = { name: ' Болд ', phone: '+976 99 11 22 33', address: ' БЗД ' };

describe('ordersStorage', () => {
  beforeEach(() => localStorage.clear());

  it('захиалга үүсгэж, үнийн snapshot, нийт дүн, цэвэрлэсэн талбар', () => {
    const o = createOrder([{ productId: products[0].id, qty: 2 }], form);
    expect(o.total).toBe(products[0].priceMnt * 2);
    expect(o.items[0]).toMatchObject({ name: products[0].name, priceMnt: products[0].priceMnt, qty: 2 });
    expect(o.name).toBe('Болд');
    expect(o.phone).toBe('99112233');
    expect(o.address).toBe('БЗД');
  });
  it('дугаар 1001-ээс өсөнө', () => {
    const a = createOrder([{ productId: products[0].id, qty: 1 }], form);
    const b = createOrder([{ productId: products[1].id, qty: 1 }], form);
    expect(a.id).toBe('1001');
    expect(b.id).toBe('1002');
  });
  it('getOrder хадгалсныг олно, байхгүй id-д undefined', () => {
    const o = createOrder([{ productId: products[0].id, qty: 1 }], form);
    expect(getOrder(o.id)).toEqual(o);
    expect(getOrder('9999')).toBeUndefined();
  });
  it('хоосон сагс, эсвэл бүгд байхгүй бараа → алдаа', () => {
    expect(() => createOrder([], form)).toThrow();
    expect(() => createOrder([{ productId: 'zzz', qty: 1 }], form)).toThrow();
  });
  it('эвдэрсэн storage → [] гэж үзээд үргэлжилнэ', () => {
    localStorage.setItem('everly.orders', '{bad');
    const o = createOrder([{ productId: products[0].id, qty: 1 }], form);
    expect(o.id).toBe('1001');
  });
});
```

`src/pages/OrderSuccess.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { products } from '../data/products';
import { createOrder } from '../orders/ordersStorage';
import OrderSuccess from './OrderSuccess';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/order/:id" element={<OrderSuccess />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('OrderSuccess', () => {
  beforeEach(() => localStorage.clear());

  it('байхгүй захиалга → олдсонгүй', () => {
    renderAt('/order/9999');
    expect(screen.getByText('Захиалга олдсонгүй')).toBeTruthy();
  });
  it('байгаа захиалга → дугаар харагдана, refresh-ийн дараа ч', () => {
    const o = createOrder([{ productId: products[0].id, qty: 1 }], { name: 'Болд', phone: '99112233', address: 'БЗД' });
    renderAt(`/order/${o.id}`);
    expect(screen.getByText(/Захиалга амжилттай/)).toBeTruthy();
    expect(screen.getByText(new RegExp(o.id))).toBeTruthy();
  });
});
```

`src/pages/Checkout.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider } from '../cart/CartContext';
import { products } from '../data/products';
import Checkout from './Checkout';

function renderCheckout() {
  return render(
    <CartProvider>
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    </CartProvider>,
  );
}

describe('Checkout page', () => {
  beforeEach(() => localStorage.clear());

  it('хоосон сагс → маягтгүй, хоосон мэдэгдэл', () => {
    renderCheckout();
    expect(screen.getByText('Сагс хоосон байна')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Захиалах' })).toBeNull();
  });
  it('сагстай боловч талбар хоосон → "Захиалах" идэвхгүй', () => {
    localStorage.setItem('everly.cart', JSON.stringify([{ productId: products[0].id, qty: 1 }]));
    renderCheckout();
    expect((screen.getByRole('button', { name: 'Захиалах' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
```

- [ ] **Step 2: Run, fail**

Run: `npx vitest run src/lib/checkout.test.ts src/orders src/pages/OrderSuccess.test.tsx src/pages/Checkout.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Логик**

`src/lib/checkout.ts`:

```ts
export interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

export function normalizePhone(raw: string): string {
  const s = raw.replace(/[\s-]/g, '');
  return s.startsWith('+976') ? s.slice(4) : s;
}

export function isValidPhone(raw: string): boolean {
  return /^[6789]\d{7}$/.test(normalizePhone(raw));
}

export function validateCheckout(f: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (!f.name.trim()) errors.name = 'Нэрээ оруулна уу';
  if (!isValidPhone(f.phone)) errors.phone = 'Утасны дугаар 8 оронтой, 6, 7, 8 эсвэл 9-өөр эхэлнэ';
  if (!f.address.trim()) errors.address = 'Хаягаа оруулна уу';
  return errors;
}
```

`src/orders/ordersStorage.ts`:

```ts
import { getProduct } from '../data/products';
import { normalizePhone, type CheckoutForm } from '../lib/checkout';
import type { CartItem, Order, OrderItem } from '../types';

const KEY = 'everly.orders';

function readAll(): Order[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(data) ? (data as Order[]) : [];
  } catch {
    return [];
  }
}

export function getOrder(id: string): Order | undefined {
  return readAll().find((o) => o.id === id);
}

export function createOrder(items: CartItem[], form: CheckoutForm): Order {
  const lines: OrderItem[] = [];
  for (const it of items) {
    const p = getProduct(it.productId);
    if (p) lines.push({ productId: p.id, name: p.name, unit: p.unit, priceMnt: p.priceMnt, qty: it.qty });
  }
  if (lines.length === 0) throw new Error('Захиалгад бараа байхгүй байна');

  const all = readAll();
  const order: Order = {
    id: String(1001 + all.length),
    items: lines,
    total: lines.reduce((sum, l) => sum + l.priceMnt * l.qty, 0),
    name: form.name.trim(),
    phone: normalizePhone(form.phone),
    address: form.address.trim(),
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([...all, order]));
  return order;
}
```

- [ ] **Step 4: Хуудсууд**

`src/pages/Checkout.tsx`:

```tsx
import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { getProduct } from '../data/products';
import { validateCheckout, type CheckoutForm } from '../lib/checkout';
import { formatPrice } from '../lib/format';
import { createOrder } from '../orders/ordersStorage';

const FIELDS = [
  { key: 'name', label: 'Нэр', type: 'text', autoComplete: 'name' },
  { key: 'phone', label: 'Утасны дугаар', type: 'tel', autoComplete: 'tel' },
  { key: 'address', label: 'Хүргэлтийн хаяг', type: 'text', autoComplete: 'street-address' },
] as const;

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutForm>({ name: '', phone: '', address: '' });
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({});
  const submitting = useRef(false);
  const errors = validateCheckout(form);
  const hasErrors = Object.keys(errors).length > 0;

  if (items.length === 0) {
    return (
      <section className="empty-state">
        <h1>Сагс хоосон байна</h1>
        <Link className="btn" to="/">Дэлгүүр рүү буцах</Link>
      </section>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting.current) return;
    if (hasErrors) {
      setTouched({ name: true, phone: true, address: true });
      return;
    }
    submitting.current = true;
    const order = createOrder(items, form);
    clear();
    navigate(`/order/${order.id}`, { replace: true });
  }

  return (
    <>
      <h1>Захиалга баталгаажуулах</h1>
      <section className="summary" aria-label="Сагсны хураангуй">
        <ul>
          {items.map((i) => {
            const p = getProduct(i.productId);
            return p ? <li key={p.id}>{p.name} × {i.qty}</li> : null;
          })}
        </ul>
        <p>Нийт: <strong>{formatPrice(total)}</strong></p>
        <p>Төлбөр: хүргэлтээр бэлнээр.</p>
      </section>
      <form onSubmit={onSubmit} noValidate>
        {FIELDS.map((f) => {
          const showError = touched[f.key] && errors[f.key];
          return (
            <div className="form-field" key={f.key}>
              <label htmlFor={f.key}>{f.label}</label>
              <input
                id={f.key}
                type={f.type}
                autoComplete={f.autoComplete}
                value={form[f.key]}
                aria-invalid={showError ? 'true' : 'false'}
                aria-describedby={showError ? `${f.key}-error` : undefined}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                onBlur={() => setTouched({ ...touched, [f.key]: true })}
              />
              {showError && <p id={`${f.key}-error`} className="error-text">{errors[f.key]}</p>}
            </div>
          );
        })}
        <button type="submit" className="btn" disabled={hasErrors}>Захиалах</button>
        {hasErrors && <p className="error-text">Бүх талбарыг зөв бөглөнө үү.</p>}
      </form>
    </>
  );
}
```

`src/pages/OrderSuccess.tsx`:

```tsx
import { Link, useParams } from 'react-router-dom';
import { NotFoundMessage } from '../components/NotFoundMessage';
import { formatPrice } from '../lib/format';
import { getOrder } from '../orders/ordersStorage';

export default function OrderSuccess() {
  const { id = '' } = useParams();
  const order = getOrder(id);
  if (!order) return <NotFoundMessage title="Захиалга олдсонгүй" />;
  return (
    <section className="summary">
      <h1>Захиалга амжилттай</h1>
      <p>Захиалгын дугаар: <strong>№{order.id}</strong></p>
      <ul>
        {order.items.map((i) => (
          <li key={i.productId}>{i.name} × {i.qty} {i.unit} — {formatPrice(i.priceMnt * i.qty)}</li>
        ))}
      </ul>
      <p>Нийт: <strong>{formatPrice(order.total)}</strong></p>
      <p>{order.name}, {order.phone}</p>
      <p>Хаяг: {order.address}</p>
      <p>Төлбөр: хүргэлтээр бэлнээр.</p>
      <Link className="btn" to="/">Дэлгүүр рүү буцах</Link>
    </section>
  );
}
```

- [ ] **Step 5: Run, pass, гараар шалга**

Run: `npx vitest run` ба `npm run build`
Expected: PASS.
Browser: бараа сагсла → `/checkout` → буруу утсаар "Захиалах" идэвхгүй, алдаа харагдана → зөв бөглөөд захиалах → `/order/1001` дээр "Захиалга амжилттай, №1001" → refresh хийхэд хэвээр → header-ийн сагс 0. "Захиалах" дээр хурдан хоёр дарж нэг л захиалга (`1001`) үүсэж буйг шалга. Буцах товчоор `/checkout` руу ороход "Сагс хоосон байна".

- [ ] **Step 6: Commit ба push**

```bash
git add -A
git commit -m "feat: checkout, захиалга хадгалах, баталгаажуулалт"
git push
```

---

### Task 9: Mock туслах чат (В)

**Files:**
- Create: `src/lib/chatReplies.ts`, `src/components/ChatWidget.tsx`, `src/styles/chat.css`
- Modify: `src/components/Layout.tsx` (`<ChatWidget />` нэмэх), `src/App.tsx` (`import './styles/chat.css';`)
- Test: `src/lib/chatReplies.test.ts`, `src/components/ChatWidget.test.tsx`

**Interfaces:**
- Produces: `getReply(text: string): string`, `ChatWidget` (нэрлэсэн export, props-гүй).

- [ ] **Step 1: Failing tests**

`src/lib/chatReplies.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_REPLY, getReply } from './chatReplies';

describe('getReply', () => {
  it('түлхүүр үгээр таарна', () => {
    expect(getReply('Хүргэлт хэзээ вэ?')).toContain('хүргэлт');
    expect(getReply('мах антибиотиктэй юу')).toContain('антибиотик');
  });
  it('том үсэг, холимог үсэгт мэдрэмжгүй', () => {
    expect(getReply('ХҮРГЭЛТ')).toBe(getReply('хүргэлт'));
  });
  it('таарахгүй бол үндсэн хариу', () => {
    expect(getReply('qwerty')).toBe(DEFAULT_REPLY);
    expect(getReply('   ')).toBe(DEFAULT_REPLY);
  });
});
```

`src/components/ChatWidget.test.tsx`:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChatWidget } from './ChatWidget';

describe('ChatWidget', () => {
  it('нээгдэж, мессеж илгээхэд хариу гарна', () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole('button', { name: 'Туслах чат нээх' }));
    fireEvent.change(screen.getByLabelText('Мессеж'), { target: { value: 'Хүргэлт хэзээ вэ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Илгээх' }));
    expect(screen.getByText('Хүргэлт хэзээ вэ')).toBeTruthy();
    expect(screen.getAllByRole('listitem').length).toBe(3);
  });
  it('зөвхөн хоосон зайтай мессеж илгээгдэхгүй', () => {
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole('button', { name: 'Туслах чат нээх' }));
    fireEvent.change(screen.getByLabelText('Мессеж'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Илгээх' }));
    expect(screen.getAllByRole('listitem').length).toBe(1);
  });
});
```

(Эхний listitem нь тавтай морилох мессеж, дараа нь хэрэглэгч + хариу = 3.)

- [ ] **Step 2: Run, fail**

Run: `npx vitest run src/lib/chatReplies.test.ts src/components/ChatWidget.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Хэрэгжүүлэлт**

`src/lib/chatReplies.ts`:

```ts
export const DEFAULT_REPLY = 'Баярлалаа, удахгүй мэргэжилтэн холбогдоно.';

const RULES: { keywords: string[]; reply: string }[] = [
  { keywords: ['хүргэлт', 'хүргэх'], reply: 'Манай хүргэлт захиалснаас хойш 24 цагийн дотор хийгдэнэ.' },
  { keywords: ['антибиотик'], reply: 'Манай мах антибиотик, хормонгүйгээр өсгөсөн малаас бэлтгэгдсэн.' },
  { keywords: ['үнэ', 'хэд вэ'], reply: 'Барааны үнэ ₮-өөр хуудас бүр дээр бичигдсэн байгаа.' },
  { keywords: ['төлбөр', 'төлөх'], reply: 'Одоогоор төлбөрийг хүргэлтээр бэлнээр хийнэ.' },
  { keywords: ['сайн байна уу', 'сайн уу', 'сайн'], reply: 'Сайн байна уу! Таны асуултад хариулахад бэлэн байна.' },
];

export function getReply(text: string): string {
  const t = text.trim().toLowerCase();
  if (!t) return DEFAULT_REPLY;
  const rule = RULES.find((r) => r.keywords.some((k) => t.includes(k)));
  return rule ? rule.reply : DEFAULT_REPLY;
}
```

Тест "хүргэлт" агуулсан хариу шаарддаг: эхний дүрмийн хариуг `'Манай хүргэлт ...'` гэж бичсэн тул `toContain('хүргэлт')` үнэн болно. "антибиотик" дүрмийн хариу `антибиотик` үгийг агуулна.

`src/components/ChatWidget.tsx`:

```tsx
import { MessageCircle, Send, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { getReply } from '../lib/chatReplies';

interface Message {
  from: 'bot' | 'user';
  text: string;
}

const GREETING: Message = { from: 'bot', text: 'Сайн байна уу! Би Everly-ийн туслах. Юу асуух вэ?' };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end' });
  }, [messages, open]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { from: 'user', text: value }, { from: 'bot', text: getReply(value) }]);
    setText('');
  }

  if (!open) {
    return (
      <button type="button" className="chat-fab btn" aria-label="Туслах чат нээх" onClick={() => setOpen(true)}>
        <MessageCircle aria-hidden="true" />
      </button>
    );
  }

  return (
    <section className="chat-panel" role="dialog" aria-label="Туслах чат" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <header className="chat-header">
        <strong>Туслах (туршилтын)</strong>
        <button type="button" className="btn btn-secondary" aria-label="Чат хаах" onClick={() => setOpen(false)}>
          <X aria-hidden="true" />
        </button>
      </header>
      <ul className="chat-messages" aria-live="polite">
        {messages.map((m, i) => (
          <li key={i} className={`chat-msg chat-msg-${m.from}`}>{m.text}</li>
        ))}
        <li ref={endRef} aria-hidden="true" style={{ display: 'none' }} />
      </ul>
      <form className="chat-form" onSubmit={onSubmit}>
        <label htmlFor="chat-input" className="visually-hidden">Мессеж</label>
        <input id="chat-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Асуултаа бичнэ үү" autoFocus />
        <button type="submit" className="btn" aria-label="Илгээх"><Send aria-hidden="true" /></button>
      </form>
    </section>
  );
}
```

Тэмдэглэл: төгсгөлийн нууц `<li>` нь `getAllByRole('listitem')` тоололд орохгүй (`display: none`, `aria-hidden`), тиймээс тест дэх тоо зөв.

`src/styles/chat.css`:

```css
.chat-fab { position: fixed; right: var(--space-4); bottom: 84px; z-index: 20; width: 56px; height: 56px; padding: 0; border-radius: 50%; box-shadow: var(--shadow); }
.chat-panel {
  position: fixed; right: var(--space-2); left: var(--space-2); bottom: 76px; z-index: 30;
  max-width: 400px; margin-left: auto; height: min(70vh, 480px);
  display: flex; flex-direction: column;
  background: var(--color-card); border-radius: var(--radius-lg); box-shadow: 0 8px 30px rgba(6, 78, 59, 0.25);
}
.chat-header { display: flex; align-items: center; justify-content: space-between; padding: var(--space-2) var(--space-3); border-bottom: 1px solid var(--color-border); }
.chat-messages { flex: 1; margin: 0; padding: var(--space-3); list-style: none; overflow-y: auto; display: flex; flex-direction: column; gap: var(--space-2); }
.chat-msg { max-width: 85%; padding: var(--space-2) var(--space-3); border-radius: var(--radius); }
.chat-msg-bot { align-self: flex-start; background: var(--color-bg); }
.chat-msg-user { align-self: flex-end; background: var(--color-primary); color: var(--color-on-primary); }
.chat-form { display: flex; gap: var(--space-2); padding: var(--space-3); border-top: 1px solid var(--color-border); }
```

`src/components/Layout.tsx`-д `import { ChatWidget } from './ChatWidget';` нэмж `</nav>`-ийн дараа `<ChatWidget />` тавь. `src/App.tsx`-д `import './styles/chat.css';` нэм.

- [ ] **Step 4: Run, pass**

Run: `npx vitest run` ба `npm run build`
Expected: PASS.
Browser: чат нээгдэж, "хүргэлт", "антибиотик", "qwerty" бичихэд зөв хариу гарна. 390px-д самбар дэлгэцээс хальхгүй, доод цэсийг халхлахгүй.

- [ ] **Step 5: Commit ба push**

```bash
git add -A
git commit -m "feat: mock туслах чат"
git push
```

---

### Task 10: Нэгтгэл ба утсан дээрх эцсийн шалгалт (бүгд)

**Files:** шаардлагатай засвар бүрийг эзэн нь хийнэ (Файлын хуваарилалтыг дага).

- [ ] **Step 1: Эцсийн татах, шалгах**

```bash
git pull --rebase
npm install
npm test
npm run build
npm run lint
```

Expected: бүгд алдаагүй. Lint алдааг файлын эзэн засна. Хэрэв `react-refresh/only-export-components` нь `CartContext.tsx` дахь `useCart` экспортыг алдаа гэвэл тухайн мөрийн дээр `// eslint-disable-next-line react-refresh/only-export-components` тавина.

- [ ] **Step 2: Гар аргаар урсгал шалгах (devtools 390px, мөн жинхэнэ утас)**

Тус бүрийг тэмдэглэ:

- [ ] Нүүр → ангилал → бараа → "Сагсанд нэмэх" → header-ийн тоо нэмэгдэнэ
- [ ] Хайлт: `хонины`, `ХОНИНЫ`, `антибиотик`, `zzz` (ангилал санал болгоно), хоосон
- [ ] Сагс: + / − / устгах, 20-д + идэвхгүй, 1-д − идэвхгүй, refresh хийхэд сагс үлдэнэ
- [ ] Checkout: буруу утас (`5111 2233`, 7 орон) → товч идэвхгүй, алдаа харагдана; `+976 99 11 22 33` хүчинтэй
- [ ] "Захиалах" хурдан давхар дарахад нэг захиалга; `/order/1001` refresh-ээс хойш хэвээр; сагс 0
- [ ] `/p/zzz`, `/c/zzz`, `/order/9999`, `/zzz` бүгд "олдсонгүй"
- [ ] Чат: нээх, "хүргэлт", "антибиотик", "qwerty", Escape хаана, 390px-д самбар цэсийг халхлахгүй
- [ ] Бүх хуудсанд хэвтээ scroll байхгүй (`.chips` дотроо scroll хийх нь зөв)
- [ ] Tab товчоор focus ring харагдана, дүрсэн товч бүр `aria-label`-тэй

- [ ] **Step 3: README шинэчлэх**

Багийн гишүүдийн жинхэнэ нэрийг README-ийн хүснэгтэд нэм. Ажиллуулах заавар хэвээр зөв эсэхийг шалга.

- [ ] **Step 4: Commit ба push**

```bash
git add -A
git commit -m "chore: нэгтгэл, эцсийн шалгалт"
git push
```
