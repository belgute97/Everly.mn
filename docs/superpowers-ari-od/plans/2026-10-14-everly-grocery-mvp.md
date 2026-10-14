# Everly эрүүл хүнсний дэлгүүр (2 хичээлийн MVP) — Хэрэгжүүлэх төлөвлөгөө

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Зорилго:** Утсанд тохирсон, монгол хэлтэй, mock өгөгдөлтэй хүнсний дэлгүүр. Бараа харах, хайх, сагслах, захиалах, туслах чаттай.

**Архитектур:** Vite + React + TypeScript SPA. React Router 3 зам (`/`, `/cart`, `/checkout`) ашиглана. Сагсны state нь `App.tsx`-д `useState`-ээр хадгалагдаж, хуудсуудад props-оор дамжина. Header ба ChatWidget бүх хуудас дээр харагдана. CSS энгийн, өнгө ба зай `variables.css`-ийн токеноос авна.

**Технологи:** Vite, React, TypeScript, react-router-dom, энгийн CSS, Google Fonts (Rubik, Nunito).

**Spec:** `docs/superpowers-ari-od/specs/2026-10-14-everly-grocery-mvp-design.md`

## Ерөнхий хязгаарлалт

- UI-ийн бүх текст монгол (кирилл). `<html lang="mn">`.
- Үнэ бүхэл төгрөг, зөвхөн `formatPrice()`-ээр харуулна: `12500` → `"12,500₮"`.
- Context, localStorage, нэмэлт UI/icon сан, автомат тест **ашиглахгүй** (spec §2, §3). Тиймээс TDD алхам байхгүй. Task бүрийг `npm run build` болон хөтөч дээр гараар шалгана.
- Component нь өнгө, зайг зөвхөн `var(--...)` токеноор авна. CSS-д hex утгыг шууд бичихгүй (`variables.css`-ээс бусад газар).
- Mobile-first: үндсэн CSS нь 375px-д зориулагдана, `@media (min-width: 768px)`-ээр өргөтгөнө. Хуудсанд хэвтээ scroll гарахгүй.
- Дарагдах элемент бүр 44×44px-ээс багагүй (`var(--tap-size)`). Үндсэн текст 16px.
- Icon-ууд гараар бичсэн inline SVG (`aria-hidden="true"`). Emoji-г зөвхөн барааны түр зурагт ашиглана.
- Vite-ийн TS тохиргоонд `verbatimModuleSyntax` идэвхтэй байдаг. Тиймээс зөвхөн төрөл импортлохдоо `import type { ... }` гэж бичнэ.
- Файл бүр нэг эзэнтэй (доорх хүснэгт). `App.tsx`, `main.tsx`, `index.html`, `index.css`, `variables.css`-ийг зөвхөн В засна.

## Файлын бүтэц

| Файл | Эзэн | Үүрэг |
|---|---|---|
| `index.html` | В | `lang="mn"`, фонт, гарчиг |
| `src/main.tsx` | В | `BrowserRouter`, глобал CSS |
| `src/App.tsx` | В | Route-ууд, сагсны state ба 4 функц |
| `src/types.ts` | В | `Category`, `CategoryFilter`, `Product`, `CartItem` |
| `src/styles/variables.css` | В | Өнгө, фонт, зай, радиус токенууд |
| `src/index.css` | В | Үндсэн стиль, хамтын класс (`.page`, `.button`, `.card`, `.empty-state`, `.visually-hidden`) |
| `src/utils/formatPrice.ts` | В | Үнийн формат |
| `src/components/Header.tsx` + `.css` | В | Лого, сагсны badge |
| `src/components/ChatWidget.tsx` + `.css` | В | Хөвөгч чат |
| `src/data/chatReplies.ts` | В | Түлхүүр үг → хариулт, `getReply()` |
| `src/data/products.ts` | А | 12 mock бараа |
| `src/components/ProductCard.tsx` + `.css` | А | Барааны карт |
| `src/components/SearchBar.tsx` + `.css` | А | Хайлтын талбар |
| `src/components/CategoryChips.tsx` + `.css` | А | Ангиллын чипүүд |
| `src/pages/HomePage.tsx` + `.css` | А | Жагсаалт, шүүлтүүр |
| `src/components/CartItemRow.tsx` + `.css` | Б | Сагсны нэг мөр |
| `src/pages/CartPage.tsx` + `.css` | Б | Сагсны хуудас |
| `src/utils/validateCheckout.ts` | Б | Form-ын шалгалт |
| `src/pages/CheckoutPage.tsx` + `.css` | Б | Захиалгын хуудас |

## Дараалал

```
Хичээл 1:  Task 1 (В, эхний 15 мин) ──► Task 2 (В)
                                     ├─► Task 3 → Task 4 (А)
                                     └─► Task 5 (Б)
Хичээл 2:  Task 6 (А)   Task 7 (Б)   Task 8 (В)  ──► Task 9 (В, бүгд merge хийсний дараа)
```

Task 1 дуустал А, Б хоёр GitHub-ын README-ээ уншиж, Node.js суусан эсэхээ шалгана (`node -v` нь 20-оос дээш байх ёстой).

## Git-ийн дүрэм (бүх хүнд)

Шинэ branch эхлэхдээ:
```bash
git switch main
git pull
git switch -c <branch-нэр>
```
Task дуусахад:
```bash
git add <файлууд>
git commit -m "<мессеж>"
git push -u origin <branch-нэр>
```
Дараа нь GitHub дээр `main` руу Pull Request нээнэ. В хүн PR-ийг шалгаад merge хийнэ. Branch-ийн нэрс:
- Хичээл 1: `a/products`, `b/cart`, `c/layout`
- Хичээл 2: `a/search`, `b/checkout`, `c/chat`

---

# ХИЧЭЭЛ 1

### Task 1 (В): Төсөл үүсгэх ба араг яс — эхний 15 минут

**Files:**
- Create: Vite төсөл (repo-ийн root-д), `src/types.ts`, `src/styles/variables.css`, `src/utils/formatPrice.ts`, `src/pages/HomePage.tsx`, `src/pages/CartPage.tsx`, `src/pages/CheckoutPage.tsx`, `src/components/Header.tsx`, `src/components/ChatWidget.tsx`
- Modify: `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Delete: `src/App.css`, `src/assets/` (байвал)

**Interfaces:**
- Produces:
  - `types.ts`: `Category`, `CategoryFilter`, `Product`, `CartItem` (доорх код)
  - `formatPrice(price: number): string`
  - `HomePageProps { onAdd: (product: Product) => void }`
  - `CartPageProps { cart: CartItem[]; onChangeQty: (id: string, qty: number) => void; onRemove: (id: string) => void }`
  - `CheckoutPageProps { cart: CartItem[]; onOrderDone: () => void }`
  - `HeaderProps { cartCount: number }`
  - CSS класс: `.page`, `.button`, `.button--accent`, `.button--outline`, `.card`, `.empty-state`, `.visually-hidden`

- [ ] **Step 1: Vite төсөл үүсгэх**

```bash
git switch main
git pull
npm create vite@latest . -- --template react-ts
```

> ⚠️ **"Current directory is not empty" гэж асуувал заавал `Ignore files and continue`-г сонгоно.** `Remove existing files`-ийг сонговол `docs/` хавтас устна. Хэрэв андуурч устгасан бол `git checkout -- docs` гэж сэргээнэ. Бусад асуултад (rolldown, "install and start now") `No` гэж хариулна.

```bash
npm install
npm install react-router-dom
```

- [ ] **Step 2: Шаардлагагүй файлуудыг устгах**

```bash
rm -f src/App.css
rm -rf src/assets
```

- [ ] **Step 3: `index.html`-ийг бүтнээр нь солих**

```html
<!doctype html>
<html lang="mn">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Rubik:wght@500;700&display=swap"
    />
    <title>Everly — Эрүүл хүнс</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: `src/types.ts` үүсгэх**

```ts
export type Category = 'fresh' | 'meat' | 'dairy' | 'everyday';

// Нүүр хуудасны шүүлтүүр: 'all' = "Бүгд"
export type CategoryFilter = Category | 'all';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // бүхэл төгрөг
  unit: string; // "1 кг", "1 л", "ширхэг"
  image: string; // түр emoji
  tags: string[]; // "Органик", "Антибиотикгүй"
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  qty: number; // 1 ба түүнээс их
}
```

- [ ] **Step 5: `src/utils/formatPrice.ts` үүсгэх**

```ts
// 12500 → "12,500₮". Intl.NumberFormat орчноос хамаарч өөр гардаг тул гараар.
export function formatPrice(price: number): string {
  const withCommas = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return withCommas + '₮';
}
```

- [ ] **Step 6: `src/styles/variables.css` үүсгэх**

```css
:root {
  --color-primary: #059669;
  --color-primary-dark: #047857;
  --color-on-primary: #ffffff;
  --color-background: #ecfdf5;
  --color-card: #ffffff;
  --color-foreground: #064e3b;
  --color-muted-foreground: #475569;
  --color-border: #a7f3d0;
  --color-accent: #ea580c;
  --color-on-accent: #1c1917;
  --color-destructive: #dc2626;

  --font-heading: 'Rubik', system-ui, sans-serif;
  --font-body: 'Nunito', system-ui, sans-serif;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  --radius: 16px;
  --radius-small: 10px;
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-strong: 0 8px 32px rgba(0, 0, 0, 0.15);

  --tap-size: 44px;
  --header-height: 60px;
}
```

- [ ] **Step 7: `src/index.css`-ийг бүтнээр нь солих**

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-foreground);
  background: var(--color-background);
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  line-height: 1.2;
  margin: 0 0 var(--space-4);
}

h1 {
  font-size: 24px;
}

a {
  color: var(--color-primary-dark);
}

button,
input,
textarea {
  font: inherit;
}

:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

/* Хуудасны агуулга. Доод зай нь чатын товчинд байр гаргана. */
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-4) 96px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--tap-size);
  padding: 0 var(--space-4);
  border: 2px solid transparent;
  border-radius: var(--radius-small);
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 150ms ease-out;
}

.button:hover {
  opacity: 0.88;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--accent {
  background: var(--color-accent);
  color: var(--color-on-accent);
}

.button--outline {
  background: var(--color-card);
  color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.card {
  background: var(--color-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.empty-state h1,
.empty-state p {
  margin: 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 8: `src/main.tsx`-ийг бүтнээр нь солих**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/variables.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

- [ ] **Step 9: Хуудас ба component-уудын түр хувилбар (stub) үүсгэх**

Нэр нь `_`-ээр эхэлсэн параметрийг TypeScript "ашиглаагүй" гэж алдаа өгдөггүй. Эзэд нь дараа нь `_props`-ыг жинхэнэ props-оор солино.

`src/pages/HomePage.tsx`:
```tsx
import type { Product } from '../types';

export interface HomePageProps {
  onAdd: (product: Product) => void;
}

export default function HomePage(_props: HomePageProps) {
  return <h1>Нүүр</h1>;
}
```

`src/pages/CartPage.tsx`:
```tsx
import type { CartItem } from '../types';

export interface CartPageProps {
  cart: CartItem[];
  onChangeQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartPage(_props: CartPageProps) {
  return <h1>Сагс</h1>;
}
```

`src/pages/CheckoutPage.tsx`:
```tsx
import type { CartItem } from '../types';

export interface CheckoutPageProps {
  cart: CartItem[];
  onOrderDone: () => void;
}

export default function CheckoutPage(_props: CheckoutPageProps) {
  return <h1>Захиалга</h1>;
}
```

`src/components/Header.tsx`:
```tsx
export interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  return <header>Everly · Сагс ({cartCount})</header>;
}
```

`src/components/ChatWidget.tsx`:
```tsx
export default function ChatWidget() {
  return null;
}
```

- [ ] **Step 10: `src/App.tsx`-ийг бүтнээр нь солих**

```tsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { CartItem, Product } from './types';
import Header from './components/Header';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  }

  function changeQty(id: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === id ? { ...item, qty } : item)),
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <Header cartCount={cartCount} />
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage onAdd={addToCart} />} />
          <Route
            path="/cart"
            element={<CartPage cart={cart} onChangeQty={changeQty} onRemove={removeFromCart} />}
          />
          <Route
            path="/checkout"
            element={<CheckoutPage cart={cart} onOrderDone={clearCart} />}
          />
        </Routes>
      </main>
      <ChatWidget />
    </>
  );
}
```

- [ ] **Step 11: Build хийж шалгах**

Run: `npm run build`
Expected: TypeScript алдаагүй, `dist/` үүснэ.

Run: `npm run dev`. Хөтөч дээр `http://localhost:5173/`, `/cart`, `/checkout`-ийг нээнэ.
Expected: "Нүүр", "Сагс", "Захиалга" гарчиг харагдана. Дэвсгэр цайвар ногоон (`#ECFDF5`) байна.

- [ ] **Step 12: Шууд `main` руу push хийх (цорын ганц үл хамаарах тохиолдол)**

```bash
git add .
git status   # node_modules, dist байхгүй байгааг шалгана (.gitignore-д бий)
git commit -m "feat: scaffold Vite React TS app with router, types and cart state"
git push origin main
```

Багийнхандаа "Араг яс бэлэн, `git pull` хийгээрэй" гэж хэлнэ.

---

### Task 2 (В): Header

**Files:**
- Modify: `src/components/Header.tsx`
- Create: `src/components/Header.css`

**Interfaces:**
- Consumes: `HeaderProps { cartCount: number }` (Task 1)

- [ ] **Step 1: Branch үүсгэх**

```bash
git switch main
git pull
git switch -c c/layout
```

- [ ] **Step 2: `src/components/Header.tsx`-ийг бүтнээр нь солих**

```tsx
import { Link } from 'react-router-dom';
import './Header.css';

export interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        Everly
      </Link>
      <Link to="/cart" className="header__cart" aria-label={`Сагс, ${cartCount} бараа`}>
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
        {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
      </Link>
    </header>
  );
}
```

- [ ] **Step 3: `src/components/Header.css` үүсгэх**

```css
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  padding: 0 var(--space-4);
  background: var(--color-card);
  border-bottom: 1px solid var(--color-border);
}

.header__logo {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary-dark);
  text-decoration: none;
}

.header__cart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--tap-size);
  height: var(--tap-size);
  color: var(--color-foreground);
  border-radius: 50%;
}

.header__badge {
  position: absolute;
  top: 0;
  right: -2px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}
```

- [ ] **Step 4: Шалгах**

Run: `npm run build`. Expected: алдаагүй.
`npm run dev` → DevTools-ийн 375px горимд: зүүн талд "Everly" лого, баруун талд сагсны icon. Badge харагдахгүй (сагс хоосон). Хуудсыг доош гүйлгэхэд header дээрээ үлдэнэ (sticky). "Everly" дээр дарахад `/`, icon дээр дарахад `/cart` руу шилжинэ.

- [ ] **Step 5: Commit ба PR**

```bash
git add src/components/Header.tsx src/components/Header.css
git commit -m "feat: add sticky header with cart badge"
git push -u origin c/layout
```
GitHub дээр PR нээж merge хийнэ. Дараа нь А, Б-ийн PR-уудыг шалгаж merge хийнэ.

---

### Task 3 (А): Mock бараа

**Files:**
- Create: `src/data/products.ts`

**Interfaces:**
- Consumes: `Product` (Task 1)
- Produces: `products: Product[]` (12 бараа, 1 нь `inStock: false`)

- [ ] **Step 1: Branch үүсгэх**

```bash
git switch main
git pull
git switch -c a/products
```

- [ ] **Step 2: `src/data/products.ts` үүсгэх**

```ts
import type { Product } from '../types';

export const products: Product[] = [
  // Шинэ ногоо/жимс
  { id: 'carrot', name: 'Органик лууван', category: 'fresh', price: 4500, unit: '1 кг', image: '🥕', tags: ['Органик'], inStock: true },
  { id: 'tomato', name: 'Шинэ улаан лооль', category: 'fresh', price: 8900, unit: '1 кг', image: '🍅', tags: ['Шинэ'], inStock: true },
  { id: 'apple', name: 'Органик алим', category: 'fresh', price: 7500, unit: '1 кг', image: '🍎', tags: ['Органик'], inStock: true },
  // Мах
  { id: 'beef', name: 'Үхрийн мах', category: 'meat', price: 28000, unit: '1 кг', image: '🥩', tags: ['Антибиотикгүй'], inStock: true },
  { id: 'chicken', name: 'Тахианы цээж мах', category: 'meat', price: 19500, unit: '1 кг', image: '🍗', tags: ['Антибиотикгүй'], inStock: true },
  { id: 'mutton', name: 'Хонины мах', category: 'meat', price: 22000, unit: '1 кг', image: '🍖', tags: ['Антибиотикгүй'], inStock: false },
  // Сүү
  { id: 'milk', name: 'Органик сүү', category: 'dairy', price: 4200, unit: '1 л', image: '🥛', tags: ['Органик'], inStock: true },
  { id: 'yogurt', name: 'Байгалийн тараг', category: 'dairy', price: 5800, unit: '500 г', image: '🥣', tags: ['Фермерийн'], inStock: true },
  { id: 'cheese', name: 'Фермерийн бяслаг', category: 'dairy', price: 14500, unit: '300 г', image: '🧀', tags: ['Фермерийн'], inStock: true },
  // Өдөр тутмын
  { id: 'bread', name: 'Бүтэн буудайн талх', category: 'everyday', price: 3500, unit: 'ширхэг', image: '🍞', tags: ['Шинэ'], inStock: true },
  { id: 'honey', name: 'Органик зөгийн бал', category: 'everyday', price: 18000, unit: '500 г', image: '🍯', tags: ['Органик'], inStock: true },
  { id: 'tea', name: 'Органик ногоон цай', category: 'everyday', price: 9900, unit: '100 г', image: '🍵', tags: ['Органик'], inStock: true },
];
```

- [ ] **Step 3: Build шалгах**

Run: `npm run build`. Expected: алдаагүй. Хэрэв `category` дээр алдаа гарвал үсгийн алдаа гаргасан байна, зөвхөн `'fresh' | 'meat' | 'dairy' | 'everyday'` зөвшөөрөгдөнө.

- [ ] **Step 4: Commit**

```bash
git add src/data/products.ts
git commit -m "feat: add 12 mock grocery products"
```

---

### Task 4 (А): ProductCard ба Нүүр хуудасны жагсаалт

**Files:**
- Create: `src/components/ProductCard.tsx`, `src/components/ProductCard.css`, `src/pages/HomePage.css`
- Modify: `src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `Product`, `products`, `formatPrice`, `HomePageProps` (Task 1, 3)
- Produces: `ProductCard` props `{ product: Product; onAdd: (product: Product) => void }`. CSS класс `.product-grid`, `.home__filters` (Task 6 ашиглана)

- [ ] **Step 1: `src/components/ProductCard.tsx` үүсгэх**

```tsx
import { useState } from 'react';
import type { Product } from '../types';
import { formatPrice } from '../utils/formatPrice';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1000);
  }

  let buttonText = 'Сагсанд нэмэх';
  if (!product.inStock) buttonText = 'Дууссан';
  else if (justAdded) buttonText = 'Нэмэгдлээ ✓';

  return (
    <article className="card product-card">
      <div className="product-card__image" role="img" aria-label={product.name}>
        {product.image}
      </div>
      <ul className="product-card__tags">
        {product.tags.map((tag) => (
          <li key={tag} className="product-card__tag">
            {tag}
          </li>
        ))}
      </ul>
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__unit">{product.unit}</p>
      <p className="product-card__price">{formatPrice(product.price)}</p>
      <button
        type="button"
        className="button button--accent"
        onClick={handleAdd}
        disabled={!product.inStock}
      >
        {buttonText}
      </button>
    </article>
  );
}
```

- [ ] **Step 2: `src/components/ProductCard.css` үүсгэх**

```css
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--space-3);
}

.product-card__image {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  margin-bottom: var(--space-2);
  font-size: 56px;
  background: var(--color-background);
  border-radius: var(--radius-small);
}

.product-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin: 0 0 var(--space-2);
  padding: 0;
  list-style: none;
}

.product-card__tag {
  padding: 2px var(--space-2);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-dark);
  background: var(--color-background);
  border-radius: 999px;
}

.product-card__name {
  margin: 0;
  font-size: 16px;
}

.product-card__unit {
  margin: 0 0 var(--space-2);
  font-size: 14px;
  color: var(--color-muted-foreground);
}

.product-card__price {
  margin: auto 0 var(--space-2);
  font-size: 18px;
  font-weight: 700;
}

.product-card .button {
  width: 100%;
  padding: 0 var(--space-2);
}
```

- [ ] **Step 3: `src/pages/HomePage.tsx`-ийг бүтнээр нь солих**

```tsx
import type { Product } from '../types';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

export interface HomePageProps {
  onAdd: (product: Product) => void;
}

export default function HomePage({ onAdd }: HomePageProps) {
  return (
    <>
      <h1>Эрүүл, шинэ хүнс</h1>
      <ul className="product-grid">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} onAdd={onAdd} />
          </li>
        ))}
      </ul>
    </>
  );
}
```

- [ ] **Step 4: `src/pages/HomePage.css` үүсгэх**

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.home__filters {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
```

- [ ] **Step 5: Шалгах**

Run: `npm run build`. Expected: алдаагүй.
`npm run dev` → 375px горимд:
- 2 баганатай 12 карт, хэвтээ scroll байхгүй.
- Үнэ `28,000₮` хэлбэртэй.
- "Хонины мах"-ын товч саарал, "Дууссан" гэсэн бичигтэй, дарагдахгүй.
- "Сагсанд нэмэх" дарахад 1 секунд "Нэмэгдлээ ✓" гарна. Task 1 merge хийгдсэн бол header-ийн badge нэмэгдэнэ.
- 768px-д 3 багана, 1024px-д 4 багана болно.

- [ ] **Step 6: Commit ба PR**

```bash
git add src/components/ProductCard.tsx src/components/ProductCard.css src/pages/HomePage.tsx src/pages/HomePage.css
git commit -m "feat: show product grid with add-to-cart cards"
git push -u origin a/products
```
GitHub дээр PR нээнэ.

---

### Task 5 (Б): Сагсны хуудас

**Files:**
- Create: `src/components/CartItemRow.tsx`, `src/components/CartItemRow.css`, `src/pages/CartPage.css`
- Modify: `src/pages/CartPage.tsx`

**Interfaces:**
- Consumes: `CartItem`, `formatPrice`, `CartPageProps` (Task 1)
- Produces: `CartItemRow` props `{ item: CartItem; onChangeQty: (id: string, qty: number) => void; onRemove: (id: string) => void }`

- [ ] **Step 1: Branch үүсгэх**

```bash
git switch main
git pull
git switch -c b/cart
```

- [ ] **Step 2: Туршилтын сагс түр нэмэх (commit хийхгүй)**

Нүүр хуудас хараахан бэлэн биш тул `src/App.tsx`-д сагсны анхны утгыг түр солино:

```tsx
  const [cart, setCart] = useState<CartItem[]>([
    { product: { id: 'test-milk', name: 'Туршилтын сүү', category: 'dairy', price: 4200, unit: '1 л', image: '🥛', tags: [], inStock: true }, qty: 2 },
    { product: { id: 'test-bread', name: 'Туршилтын талх', category: 'everyday', price: 3500, unit: 'ширхэг', image: '🍞', tags: [], inStock: true }, qty: 1 },
  ]);
```

> ⚠️ `App.tsx` бол В-гийн файл. Step 7-д энэ өөрчлөлтийг буцаана.

- [ ] **Step 3: `src/components/CartItemRow.tsx` үүсгэх**

```tsx
import type { CartItem } from '../types';
import { formatPrice } from '../utils/formatPrice';
import './CartItemRow.css';

interface CartItemRowProps {
  item: CartItem;
  onChangeQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemRow({ item, onChangeQty, onRemove }: CartItemRowProps) {
  const { product, qty } = item;

  return (
    <li className="card cart-row">
      <span className="cart-row__image" aria-hidden="true">
        {product.image}
      </span>
      <div className="cart-row__info">
        <h3 className="cart-row__name">{product.name}</h3>
        <p className="cart-row__price">
          {formatPrice(product.price)} / {product.unit}
        </p>
      </div>
      <div className="cart-row__qty">
        <button
          type="button"
          className="cart-row__qty-button"
          aria-label={`${product.name}: тоог хасах`}
          onClick={() => onChangeQty(product.id, qty - 1)}
        >
          −
        </button>
        <span className="cart-row__count">{qty}</span>
        <button
          type="button"
          className="cart-row__qty-button"
          aria-label={`${product.name}: тоог нэмэх`}
          onClick={() => onChangeQty(product.id, qty + 1)}
        >
          +
        </button>
      </div>
      <p className="cart-row__total">{formatPrice(product.price * qty)}</p>
      <button type="button" className="cart-row__remove" onClick={() => onRemove(product.id)}>
        Устгах
      </button>
    </li>
  );
}
```

- [ ] **Step 4: `src/components/CartItemRow.css` үүсгэх**

```css
.cart-row {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  grid-template-areas:
    'image info remove'
    'image qty total';
  align-items: center;
  gap: var(--space-2) var(--space-3);
  padding: var(--space-3);
}

.cart-row__image {
  grid-area: image;
  font-size: 36px;
  text-align: center;
}

.cart-row__info {
  grid-area: info;
  min-width: 0;
}

.cart-row__name {
  margin: 0;
  font-size: 16px;
}

.cart-row__price {
  margin: 0;
  font-size: 14px;
  color: var(--color-muted-foreground);
}

.cart-row__qty {
  grid-area: qty;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.cart-row__qty-button {
  width: var(--tap-size);
  height: var(--tap-size);
  border: 2px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-card);
  color: var(--color-foreground);
  font-size: 20px;
  cursor: pointer;
}

.cart-row__count {
  min-width: 24px;
  font-weight: 700;
  text-align: center;
}

.cart-row__total {
  grid-area: total;
  margin: 0;
  font-weight: 700;
  text-align: right;
}

.cart-row__remove {
  grid-area: remove;
  min-height: var(--tap-size);
  padding: 0 var(--space-2);
  border: none;
  background: none;
  color: var(--color-destructive);
  font-weight: 600;
  cursor: pointer;
}
```

- [ ] **Step 5: `src/pages/CartPage.tsx`-ийг бүтнээр нь солих**

```tsx
import { Link } from 'react-router-dom';
import type { CartItem } from '../types';
import { formatPrice } from '../utils/formatPrice';
import CartItemRow from '../components/CartItemRow';
import './CartPage.css';

export interface CartPageProps {
  cart: CartItem[];
  onChangeQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartPage({ cart, onChangeQty, onRemove }: CartPageProps) {
  if (cart.length === 0) {
    return (
      <section className="empty-state">
        <h1>Сагс хоосон байна</h1>
        <Link to="/" className="button button--outline">
          Дэлгүүр рүү буцах
        </Link>
      </section>
    );
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <>
      <h1>Сагс</h1>
      <ul className="cart-list">
        {cart.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onChangeQty={onChangeQty}
            onRemove={onRemove}
          />
        ))}
      </ul>
      <div className="card cart-summary">
        <p className="cart-summary__total">
          <span>Нийт дүн</span>
          <span>{formatPrice(total)}</span>
        </p>
        <Link to="/checkout" className="button button--accent">
          Захиалах
        </Link>
      </div>
    </>
  );
}
```

- [ ] **Step 6: `src/pages/CartPage.css` үүсгэх**

```css
.cart-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
}

.cart-summary__total {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.cart-summary .button {
  width: 100%;
}

@media (min-width: 768px) {
  .cart-summary {
    max-width: 360px;
    margin-left: auto;
  }
}
```

- [ ] **Step 7: Шалгах, дараа нь туршилтын сагсыг буцаах**

Run: `npm run dev` → 375px горимд `/cart`:
- 2 мөр, нийт дүн `11,900₮` (4,200×2 + 3,500).
- Сүүний `+` дарахад тоо 3, мөрийн дүн `12,600₮`, нийт дүн `16,100₮` болно.
- Талхны `−` дарахад мөр устана.
- Сүүг "Устгах" дарахад "Сагс хоосон байна" ба "Дэлгүүр рүү буцах" товч гарна. Товч `/` руу шилжинэ.

Шалгаж дуусаад `App.tsx`-ийн туршилтын өөрчлөлтийг буцаана:
```bash
git checkout -- src/App.tsx
git status   # App.tsx өөрчлөгдсөн жагсаалтад байх ёсгүй
```
Run: `npm run build`. Expected: алдаагүй.

- [ ] **Step 8: Commit ба PR**

```bash
git add src/components/CartItemRow.tsx src/components/CartItemRow.css src/pages/CartPage.tsx src/pages/CartPage.css
git commit -m "feat: add cart page with quantity controls and total"
git push -u origin b/cart
```
GitHub дээр PR нээнэ.

---

# ХИЧЭЭЛ 2

Хичээлийн эхэнд В хүн Хичээл 1-ийн бүх PR-ыг merge хийсэн байх ёстой. Бүгд `git switch main && git pull` хийгээд `npm run dev` ажиллуулж, бараа нэмэх → сагс урсгал ажиллаж байгааг харна.

### Task 6 (А): Хайлт ба ангиллын шүүлтүүр

**Files:**
- Create: `src/components/SearchBar.tsx`, `src/components/SearchBar.css`, `src/components/CategoryChips.tsx`, `src/components/CategoryChips.css`
- Modify: `src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: `Category`, `CategoryFilter`, `products`, `ProductCard`, `.product-grid`, `.home__filters`, `.empty-state` (Task 1, 3, 4)
- Produces: `SearchBar` props `{ value: string; onChange: (value: string) => void }`, `CategoryChips` props `{ selected: CategoryFilter; onSelect: (value: CategoryFilter) => void }`

- [ ] **Step 1: Branch үүсгэх**

```bash
git switch main
git pull
git switch -c a/search
```

- [ ] **Step 2: `src/components/SearchBar.tsx` үүсгэх**

```tsx
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label htmlFor="product-search" className="visually-hidden">
        Бараа хайх
      </label>
      <input
        id="product-search"
        type="search"
        className="search-bar__input"
        placeholder="Бараа хайх, жишээ нь: сүү"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
```

- [ ] **Step 3: `src/components/SearchBar.css` үүсгэх**

```css
.search-bar__input {
  width: 100%;
  min-height: var(--tap-size);
  padding: 0 var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-card);
  color: var(--color-foreground);
}

.search-bar__input:focus {
  border-color: var(--color-primary);
}
```

- [ ] **Step 4: `src/components/CategoryChips.tsx` үүсгэх**

```tsx
import type { CategoryFilter } from '../types';
import './CategoryChips.css';

const OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'Бүгд' },
  { value: 'fresh', label: 'Шинэ ногоо/жимс' },
  { value: 'meat', label: 'Мах' },
  { value: 'dairy', label: 'Сүү' },
  { value: 'everyday', label: 'Өдөр тутмын' },
];

interface CategoryChipsProps {
  selected: CategoryFilter;
  onSelect: (value: CategoryFilter) => void;
}

export default function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="chips" role="group" aria-label="Ангилал">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="chip"
          aria-pressed={selected === option.value}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: `src/components/CategoryChips.css` үүсгэх**

Чипүүд утсан дээр багтахгүй бол зөвхөн өөрсдийн мөрөндөө хэвтээ гүйнэ. Хуудас өөрөө хэвтээ scroll-гүй хэвээр үлдэнэ.

```css
.chips {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  padding-bottom: var(--space-1);
}

.chip {
  flex: 0 0 auto;
  min-height: var(--tap-size);
  padding: 0 var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-card);
  color: var(--color-foreground);
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 150ms ease-out, color 150ms ease-out;
}

.chip[aria-pressed='true'] {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  color: var(--color-on-primary);
}
```

- [ ] **Step 6: `src/pages/HomePage.tsx`-ийг бүтнээр нь солих**

```tsx
import { useState } from 'react';
import type { CategoryFilter, Product } from '../types';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import './HomePage.css';

export interface HomePageProps {
  onAdd: (product: Product) => void;
}

export default function HomePage({ onAdd }: HomePageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const search = query.trim().toLowerCase();
  const visibleProducts = products.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      product.name.toLowerCase().includes(search),
  );

  function clearFilters() {
    setQuery('');
    setCategory('all');
  }

  return (
    <>
      <h1>Эрүүл, шинэ хүнс</h1>
      <div className="home__filters">
        <SearchBar value={query} onChange={setQuery} />
        <CategoryChips selected={category} onSelect={setCategory} />
      </div>

      {visibleProducts.length === 0 ? (
        <section className="empty-state">
          <p>Бараа олдсонгүй</p>
          <button type="button" className="button button--outline" onClick={clearFilters}>
            Шүүлтүүр арилгах
          </button>
        </section>
      ) : (
        <ul className="product-grid">
          {visibleProducts.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} onAdd={onAdd} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
```

- [ ] **Step 7: Шалгах**

Run: `npm run build`. Expected: алдаагүй.
`npm run dev` → 375px горимд:
- "мах" гэж бичихэд 3 махан бараа харагдана.
- "МАХ" гэж том үсгээр бичсэн ч мөн адил 3 бараа гарна.
- Хайлтыг арилгаад "Сүү" чипийг дарахад 3 сүүн бүтээгдэхүүн харагдаж, чип нь бараан ногоон болно.
- "Сүү" сонгосон хэвээр "органик" гэж бичихэд зөвхөн "Органик сүү" үлдэнэ.
- "zzz" гэж бичихэд "Бараа олдсонгүй" гарна. "Шүүлтүүр арилгах" дарахад 12 бараа буцаж гарч, "Бүгд" чип сонгогдоно.
- Хуудас хэвтээ scroll-гүй байна. Чипийн мөр өөрөө хажуу тийш гүйж болно.

- [ ] **Step 8: Commit ба PR**

```bash
git add src/components/SearchBar.tsx src/components/SearchBar.css src/components/CategoryChips.tsx src/components/CategoryChips.css src/pages/HomePage.tsx
git commit -m "feat: add product search and category filter"
git push -u origin a/search
```
GitHub дээр PR нээнэ.

---

### Task 7 (Б): Захиалгын хуудас

**Files:**
- Create: `src/utils/validateCheckout.ts`, `src/pages/CheckoutPage.css`
- Modify: `src/pages/CheckoutPage.tsx`

**Interfaces:**
- Consumes: `CartItem`, `formatPrice`, `CheckoutPageProps`, `.card`, `.button`, `.empty-state` (Task 1)
- Produces: `validateCheckout(form: CheckoutForm): CheckoutErrors`

- [ ] **Step 1: Branch үүсгэх**

```bash
git switch main
git pull
git switch -c b/checkout
```

- [ ] **Step 2: `src/utils/validateCheckout.ts` үүсгэх**

```ts
export interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
}

// Алдаагүй талбар объектод байхгүй байна.
export interface CheckoutErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (form.name.trim() === '') {
    errors.name = 'Нэрээ оруулна уу';
  }
  if (!/^\d{8}$/.test(form.phone.trim())) {
    errors.phone = 'Утасны дугаар 8 оронтой байна';
  }
  if (form.address.trim().length < 5) {
    errors.address = 'Хаягаа дэлгэрэнгүй бичнэ үү';
  }

  return errors;
}
```

Хаягийн дүрэм: зайг тооцохгүйгээр **дор хаяж 5** тэмдэгт.

- [ ] **Step 3: `src/pages/CheckoutPage.tsx`-ийг бүтнээр нь солих**

```tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '../types';
import { formatPrice } from '../utils/formatPrice';
import { validateCheckout } from '../utils/validateCheckout';
import type { CheckoutErrors, CheckoutForm } from '../utils/validateCheckout';
import './CheckoutPage.css';

export interface CheckoutPageProps {
  cart: CartItem[];
  onOrderDone: () => void;
}

export default function CheckoutPage({ cart, onOrderDone }: CheckoutPageProps) {
  const [form, setForm] = useState<CheckoutForm>({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isDone, setIsDone] = useState(false);

  function updateField(field: keyof CheckoutForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateCheckout(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onOrderDone();
    setIsDone(true);
  }

  // Амжилтын мэдэгдлийг хоосон сагснаас ӨМНӨ шалгана: onOrderDone() сагсыг хоосолдог.
  if (isDone) {
    return (
      <section className="empty-state" role="status">
        <h1>Захиалга амжилттай!</h1>
        <p>Бид тантай удахгүй холбогдоно.</p>
        <Link to="/" className="button button--accent">
          Нүүр хуудас руу
        </Link>
      </section>
    );
  }

  if (cart.length === 0) {
    return (
      <section className="empty-state">
        <h1>Сагс хоосон байна</h1>
        <Link to="/" className="button button--outline">
          Дэлгүүр рүү буцах
        </Link>
      </section>
    );
  }

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <>
      <h1>Захиалга</h1>
      <div className="checkout">
        <section className="card checkout__summary" aria-label="Захиалгын хураангуй">
          <p className="checkout__count">{itemCount} бараа</p>
          <p className="checkout__total">
            <span>Нийт дүн</span>
            <span>{formatPrice(total)}</span>
          </p>
        </section>

        <form className="card checkout__form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="checkout-name">Нэр</label>
            <input
              id="checkout-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'checkout-name-error' : undefined}
            />
            {errors.name && (
              <p id="checkout-name-error" className="field__error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="checkout-phone">Утас</label>
            <input
              id="checkout-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="99112233"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'checkout-phone-error' : undefined}
            />
            {errors.phone && (
              <p id="checkout-phone-error" className="field__error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="checkout-address">Хаяг</label>
            <textarea
              id="checkout-address"
              rows={3}
              autoComplete="street-address"
              placeholder="Дүүрэг, хороо, байр, тоот"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              aria-invalid={errors.address ? true : undefined}
              aria-describedby={errors.address ? 'checkout-address-error' : undefined}
            />
            {errors.address && (
              <p id="checkout-address-error" className="field__error">
                {errors.address}
              </p>
            )}
          </div>

          <button type="submit" className="button button--accent">
            Захиалах
          </button>
        </form>
      </div>
    </>
  );
}
```

- [ ] **Step 4: `src/pages/CheckoutPage.css` үүсгэх**

Утсан дээр хураангуй form-ын дээр харагдана. 768px-ээс өргөн дэлгэцэд хураангуй баруун талд шилжинэ.

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.checkout__summary,
.checkout__form {
  padding: var(--space-4);
}

.checkout__count {
  margin: 0 0 var(--space-2);
  color: var(--color-muted-foreground);
}

.checkout__total {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.checkout__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.field label {
  font-weight: 600;
}

.field input,
.field textarea {
  min-height: var(--tap-size);
  padding: var(--space-2) var(--space-3);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-small);
  background: var(--color-card);
  color: var(--color-foreground);
}

.field input[aria-invalid='true'],
.field textarea[aria-invalid='true'] {
  border-color: var(--color-destructive);
}

.field__error {
  margin: 0;
  font-size: 14px;
  color: var(--color-destructive);
}

@media (min-width: 768px) {
  .checkout {
    flex-direction: row-reverse;
    align-items: flex-start;
  }

  .checkout__form {
    flex: 2;
  }

  .checkout__summary {
    flex: 1;
    position: sticky;
    top: calc(var(--header-height) + var(--space-4));
  }
}
```

- [ ] **Step 5: Шалгах**

Run: `npm run build`. Expected: алдаагүй.
`npm run dev` → 375px горимд:
- Сагс хоосон үед `/checkout`-д "Сагс хоосон байна" гарна.
- Нүүрнээс 2 бараа нэмээд `/cart` → "Захиалах" дарна. Хураангуй дээр, form доор нь харагдана.
- Бүх талбарыг хоосон орхиод "Захиалах" дарахад 3 талбар бүрийн доор улаан алдаа гарч, хүрээ нь улаан болно.
- Утсанд `1234` гэж оруулахад "Утасны дугаар 8 оронтой байна" гарна.
- Нэр `Сараа`, утас `99112233`, хаяг `БЗД, 3-р хороо` гэж бөглөөд "Захиалах" дарахад "Захиалга амжилттай!" гарч, header-ийн badge алга болно.
- "Нүүр хуудас руу" товч `/` руу шилжинэ.
- 768px-д хураангуй баруун талд, form зүүн талд гарна.

- [ ] **Step 6: Commit ба PR**

```bash
git add src/utils/validateCheckout.ts src/pages/CheckoutPage.tsx src/pages/CheckoutPage.css
git commit -m "feat: add checkout form with validation and success message"
git push -u origin b/checkout
```
GitHub дээр PR нээнэ.

---

### Task 8 (В): Туслах чат

**Files:**
- Create: `src/data/chatReplies.ts`, `src/components/ChatWidget.css`
- Modify: `src/components/ChatWidget.tsx`

**Interfaces:**
- Consumes: `.button`, `.button--accent`, `.visually-hidden`, токенууд (Task 1)
- Produces: `GREETING: string`, `FALLBACK: string`, `getReply(message: string): string`

- [ ] **Step 1: Branch үүсгэх**

```bash
git switch main
git pull
git switch -c c/chat
```

- [ ] **Step 2: `src/data/chatReplies.ts` үүсгэх**

Дүрмүүдийг дарааллаар нь шалгаж, эхний таарсан дүрмийн хариултыг өгнө. Мэндчилгээг хамгийн сүүлд тавьсан. Ингэснээр "Сайн уу, хүргэлт хэд вэ?" гэвэл хүргэлтийн хариулт гарна.

```ts
interface ChatRule {
  keywords: string[];
  reply: string;
}

export const GREETING =
  'Сайн байна уу! Би Everly-гийн туслах. Хүргэлт, органик бараа, төлбөрийн талаар асуугаарай.';

export const FALLBACK =
  'Уучлаарай, ойлгосонгүй. Хүргэлт, органик бараа, төлбөрийн талаар асуугаарай.';

const RULES: ChatRule[] = [
  {
    keywords: ['хүргэлт', 'хүргэх'],
    reply: 'Улаанбаатар хот дотор хүргэнэ. 30,000₮-өөс дээш захиалга үнэгүй, түүнээс бага бол 3,000₮.',
  },
  {
    keywords: ['органик'],
    reply: 'Органик бараа химийн бордоо, пестицидгүй тариалсан. Нийлүүлэгч бүрийг бид өөрсдөө шалгадаг.',
  },
  {
    keywords: ['мах', 'антибиотик'],
    reply: 'Манай мах антибиотик, өсөлтийн гормонгүй өсгөсөн малынх. Хөргөлттэйгээр хүргэнэ.',
  },
  {
    keywords: ['төлбөр', 'төлөх'],
    reply: 'Одоогоор бараагаа хүлээж авахдаа бэлнээр эсвэл картаар төлнө.',
  },
  {
    keywords: ['цаг', 'хэзээ'],
    reply: 'Захиалгыг өдөр бүр 09:00–21:00 цагт хүлээн авч, 10:00–20:00 цагт хүргэнэ.',
  },
  {
    keywords: ['сайн уу', 'сайн байна'],
    reply: 'Сайн байна уу! Танд юугаар туслах вэ?',
  },
];

export function getReply(message: string): string {
  const text = message.toLowerCase();
  const rule = RULES.find((r) => r.keywords.some((keyword) => text.includes(keyword)));
  return rule ? rule.reply : FALLBACK;
}
```

- [ ] **Step 3: `src/components/ChatWidget.tsx`-ийг бүтнээр нь солих**

```tsx
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { GREETING, getReply } from '../data/chatReplies';
import './ChatWidget.css';

interface Message {
  id: number;
  from: 'user' | 'bot';
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: 'bot', text: GREETING }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const nextId = useRef(1);
  const listRef = useRef<HTMLUListElement>(null);

  // Шинэ мессеж ирэхэд хамгийн доод хэсэг рүү гүйлгэнэ
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (text === '' || isTyping) return;

    setMessages((prev) => [...prev, { id: nextId.current++, from: 'user', text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: nextId.current++, from: 'bot', text: getReply(text) }]);
      setIsTyping(false);
    }, 500);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        className="chat-toggle"
        aria-label="Туслах чат нээх"
        onClick={() => setIsOpen(true)}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </button>
    );
  }

  return (
    <section className="chat-window" aria-label="Туслах чат">
      <header className="chat-window__header">
        <h2 className="chat-window__title">Everly туслах</h2>
        <button
          type="button"
          className="chat-window__close"
          aria-label="Чат хаах"
          onClick={() => setIsOpen(false)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </header>

      <ul className="chat-window__messages" ref={listRef} aria-live="polite">
        {messages.map((message) => (
          <li key={message.id} className={`chat-message chat-message--${message.from}`}>
            {message.text}
          </li>
        ))}
        {isTyping && <li className="chat-message chat-message--bot chat-message--typing">бичиж байна…</li>}
      </ul>

      <form className="chat-window__form" onSubmit={handleSubmit}>
        <label htmlFor="chat-input" className="visually-hidden">
          Мессеж
        </label>
        <input
          id="chat-input"
          className="chat-window__input"
          placeholder="Асуултаа бичнэ үү"
          autoComplete="off"
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="button button--accent">
          Илгээх
        </button>
      </form>
    </section>
  );
}
```

- [ ] **Step 4: `src/components/ChatWidget.css` үүсгэх**

```css
.chat-toggle {
  position: fixed;
  right: var(--space-4);
  bottom: var(--space-4);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: var(--color-primary-dark);
  color: var(--color-on-primary);
  box-shadow: var(--shadow-strong);
  cursor: pointer;
}

/* Утсан дээр бүтэн дэлгэц */
.chat-window {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  background: var(--color-card);
}

@media (min-width: 768px) {
  .chat-window {
    inset: auto var(--space-4) var(--space-4) auto;
    width: 360px;
    height: 520px;
    border-radius: var(--radius);
    box-shadow: var(--shadow-strong);
    overflow: hidden;
  }
}

.chat-window__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-4);
  background: var(--color-primary-dark);
  color: var(--color-on-primary);
}

.chat-window__title {
  margin: 0;
  font-size: 18px;
}

.chat-window__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--tap-size);
  height: var(--tap-size);
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
}

.chat-window__messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-4);
  overflow-y: auto;
  list-style: none;
  background: var(--color-background);
}

.chat-message {
  max-width: 80%;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
}

.chat-message--bot {
  align-self: flex-start;
  background: var(--color-card);
  border-bottom-left-radius: var(--space-1);
}

.chat-message--user {
  align-self: flex-end;
  background: var(--color-primary-dark);
  color: var(--color-on-primary);
  border-bottom-right-radius: var(--space-1);
}

.chat-message--typing {
  font-style: italic;
  color: var(--color-muted-foreground);
}

.chat-window__form {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3);
  border-top: 1px solid var(--color-border);
}

.chat-window__input {
  flex: 1;
  min-width: 0;
  min-height: var(--tap-size);
  padding: 0 var(--space-3);
  border: 2px solid var(--color-border);
  border-radius: 999px;
  color: var(--color-foreground);
}
```

- [ ] **Step 5: Шалгах**

Run: `npm run build`. Expected: алдаагүй.
`npm run dev` → 375px горимд:
- Баруун доод буланд ногоон дугуй товч байна. Дарахад чат бүтэн дэлгэцээр нээгдэж, мэндчилгээ харагдана. Бичих талбар идэвхтэй болно.
- "хүргэлт хэд вэ" гэж илгээхэд 0.5 секунд "бичиж байна…" гарч, дараа нь хүргэлтийн хариулт ирнэ.
- "Сайн уу, мах антибиотиктэй юу?" гэж илгээхэд махны хариулт ирнэ (мэндчилгээ биш).
- "abc" гэж илгээхэд "Уучлаарай, ойлгосонгүй…" гэсэн хариу ирнэ.
- Хоосон эсвэл зөвхөн зайтай мессеж илгээгдэхгүй.
- X дарахад чат хаагдана. `/cart` руу шилжиж байгаад дахин нээхэд өмнөх мессежүүд хадгалагдсан байна.
- 768px-д чат баруун доод буланд 360px өргөн цонхоор нээгдэнэ.

- [ ] **Step 6: Commit ба PR**

```bash
git add src/data/chatReplies.ts src/components/ChatWidget.tsx src/components/ChatWidget.css
git commit -m "feat: add assistant chat widget with keyword replies"
git push -u origin c/chat
```
GitHub дээр PR нээж, А, Б-ийн PR-уудтай хамт merge хийнэ.

---

### Task 9 (В): Утсан дээрх эцсийн шалгалт

**Files:**
- Modify: (зөвхөн алдаа олдвол) тухайн component-ийн `.css` файл. Эзэнтэй нь ярилцаж засна.

**Interfaces:**
- Consumes: Task 1–8 бүгд `main`-д merge хийгдсэн байна.

- [ ] **Step 1: Хамгийн сүүлийн кодыг татах**

```bash
git switch main
git pull
npm install
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: TypeScript алдаагүй дуусна.

- [ ] **Step 3: 375px дээр гараар шалгах (spec §9)**

`npm run dev` → Chrome DevTools → Toggle device toolbar → өргөнийг 375 болгоно.

1. "мах" гэж хайхад зөвхөн махан бараа гарна. "Сүү" ангилал сонгоход хайлттай нийлж шүүгдэнэ.
2. Олдохгүй үг хайхад "Бараа олдсонгүй" гарна. "Шүүлтүүр арилгах" дарахад бүх бараа буцаж гарна.
3. "Хонины мах"-ын товч идэвхгүй, "Дууссан" гэсэн бичигтэй.
4. Бараа нэмэхэд header-ийн badge нэмэгдэнэ.
5. Сагсанд `+`/`−`/"Устгах" ажиллаж, нийт дүн зөв шинэчлэгдэнэ. Бүх мөрийг устгахад хоосон төлөв гарна.
6. Checkout-д утсанд `1234` оруулахад алдаа гарна. Зөв бөглөхөд амжилтын мэдэгдэл гарч, badge алга болно.
7. Чатад "хүргэлт" гэж бичихэд хариулт ирнэ. "abc" гэж бичихэд "ойлгосонгүй" гэсэн хариу ирнэ.
8. Хөтчийн "буцах" товч өмнөх хуудас руу буцаана (`/` → `/cart` → буцах → `/`).

- [ ] **Step 4: Харагдацын шалгалт**

Хуудас бүр (`/`, `/cart`, `/checkout`, чат нээлттэй) дээр:
- DevTools Console-д `document.documentElement.scrollWidth > window.innerWidth` гэж бичихэд `false` гарна (хэвтээ scroll байхгүй).
- Товч бүр 44px-ээс багагүй өндөртэй. DevTools-ийн Inspect хэрэгслээр хамгийн жижиг товчнуудыг (`−`/`+`, X, чип) шалгана.
- Tab товчоор хуудас дундуур шилжихэд focus-ын ногоон хүрээ харагдана.
- Ө, Ү үсгүүд Rubik/Nunito фонтоор зөв харагдана. Ямар нэг үсэг өөр фонтоор харагдаж байвал фонтын холбоосыг шалгана.
- Чатын товч сагсны "Захиалах" товч болон form-ын "Захиалах" товчийг халхлахгүй. Хуудасны доод талаар гүйлгэж шалгана.

- [ ] **Step 5: Алдаа олдвол засах**

Засвар бүрийг тухайн файлын эзэнтэй ярилцаж хийнэ. Засварын дараа Step 2–4-ийг давтана.

```bash
git switch -c c/mobile-fixes
git add <зассан файлууд>
git commit -m "fix: mobile layout issues found in final check"
git push -u origin c/mobile-fixes
```
Засах зүйл олдохгүй бол энэ алхмыг алгасна.
