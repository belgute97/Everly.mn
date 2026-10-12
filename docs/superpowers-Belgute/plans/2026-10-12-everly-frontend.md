# Everly Frontend (mock data) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Everly хүнсний онлайн дэлгүүрийн бүрэн ажиллагаатай React frontend-ийг backend-гүйгээр, mock өгөгдөл дээр бүтээх (каталог → сагс → checkout → mock төлбөр → захиалгын түүх, мөн админ харагдац).

**Architecture:** Next.js (App Router) зөвхөн frontend. Бүх өгөгдөл `src/data/api.ts` дахь нэг интерфейсээр дамжина; одоо хэрэгжилт нь `src/mocks/*` + `localStorage`, дараа нь backend бэлэн болоход зөвхөн энэ нэг файлыг HTTP дуудлагаар солино. UI компонентууд `api`-аас өөр өгөгдлийн эх сурвалж мэдэхгүй.

**Tech Stack:** Next.js 15 (React 19), TypeScript, Tailwind CSS, Vitest + Testing Library, Playwright, zod.

**Spec:** `docs/superpowers-Belgute/specs/2026-10-12-everly-grocery-design.md` (§3 module-ууд, §4 урсгал; backend хэсгүүд энэ plan-д ороогүй). Backend-тэй бүрэн plan: `2026-10-12-everly-mvp-fullstack.md`.

## Global Constraints

- Бүх UI текст монгол кирилл. Валют `₮`, бүхэл тоо, таслалаар (`12,500₮`).
- Mobile-first (390px-д эвдрэлгүй), хэвтээ scroll байхгүй.
- Утасны дугаар: 8 орон, `[6789]`-өөр эхэлнэ (`+976` зөвшөөрнө).
- Mock OTP код үргэлж `123456`; 5 буруу оролдлогын дараа түгжинэ; код 5 минутын дараа хүчингүй.
- Сагсны тоо хэмжээ: бүхэл, `0 ≤ qty ≤ stock`.
- Захиалгын мөр захиалгын үеийн үнийг хуулж хадгална.
- Бүтээгдэхүүн бүр `vendorId` талбартай (бүгд `"everly"`).
- Backend, DB, бодит SMS/QPay энэ plan-д **байхгүй**. Mock-ыг UI-д "Туршилтын горим" гэж тодорхой харуулна.
- `localStorage` хандалт бүр `try/catch`-тэй; байхгүй/эвдэрсэн үед аппликейшн унахгүй.
- Mock өгөгдлийн хувилбар `MOCK_VERSION` (`src/mocks/version.ts`); `localStorage["everly.version"]` таарахгүй бол mock-ийн бүх `everly.*` түлхүүрийг цэвэрлэж дахин эхлүүлнэ (хуучин хэлбэртэй өгөгдлөөс болж унахгүй).
- Mock ангилалын `id` нь `slug`-тай ижил (`"nogoo"`); бүсийн id: `"bzd"`, `"shd"`, `"hud"`.
- Mock api нь процессын санах ойд төлөв хадгалахгүй, бүх төлөвийг `localStorage`-оос уншина (тест болон refresh-д найдвартай).
- Өгөгдөл `localStorage`-оос ирдэг тул өгөгдөл уншдаг хуудас бүр Client Component (`"use client"`); hydration-ий зөрүүгээс сэргийлж `ready` болтол skeleton харуулна.
- Input бүр `<label>`-тай (a11y болон тест нь label-аар хайна); товч бүр харагдах текст эсвэл `aria-label`-тай.

## Review Focus

1. `localStorage` хоосон, эвдэрсэн JSON эсвэл хаалттай (private mode) үед аппликейшн унахгүй, хоосон төлөвтэй эхэлнэ.
2. Сагсанд нэмсэн барааны нөөц дараа нь багасвал (эсвэл дууссан бол) checkout дээр ойлгомжтой алдаа, сагс автоматаар засагдана.
3. Хайлт: хоосон, зөвхөн зай, кирилл/латин холилдсон, нэг үсэг буруу бичсэн үед үр дүн (эсвэл "олдсонгүй") гарна.
4. Дүүрсэн цонх сонгогдохгүй; цонх сонгоогүй, хаяггүй, доод дүнгээс бага үед "Баталгаажуулах" идэвхгүй, шалтгааныг харуулна.
5. Хуудас refresh хийхэд (сагс, нэвтрэлт, захиалгын түүх) алдагдахгүй; нэвтрээгүй хэрэглэгч `/checkout`, `/orders` руу орвол `/login?next=…` руу чиглэнэ.

---

## File Structure

```
package.json, tsconfig.json, vitest.config.ts, playwright.config.ts
src/lib/money.ts, phone.ts, similarity.ts, storage.ts, cart-reducer.ts
src/types.ts                         # Product, Category, Zone, Slot, Order, CartLine …
src/mocks/products.ts, categories.ts, zones.ts, slots.ts
src/data/api.ts                      # нэг интерфейс: UI зөвхөн эндээс уншина
src/data/mock-api.ts                 # localStorage дээр суурилсан хэрэгжилт
src/context/CartContext.tsx, AuthContext.tsx
src/components/Header.tsx, ProductCard.tsx, AddToCart.tsx, SlotPicker.tsx, MockBanner.tsx, QtyStepper.tsx
src/app/layout.tsx, page.tsx, c/[slug]/page.tsx, p/[slug]/page.tsx, search/page.tsx,
        cart/page.tsx, login/page.tsx, checkout/page.tsx, pay/[orderId]/page.tsx,
        orders/page.tsx, orders/[id]/page.tsx, admin/{page,products,orders}/page.tsx
tests/unit/*.test.ts(x), tests/e2e/*.spec.ts
```

---

### Task 1: Төслийн суурь ба тестийн орчин

**Files:**
- Create: `package.json`, `vitest.config.ts`, `playwright.config.ts`, `src/types.ts`, `tests/unit/smoke.test.ts`

**Interfaces:**
- Produces: `src/types.ts` доорх төрлүүд (бүх task-д ашиглана).

- [ ] **Step 1: Scaffold**

```bash
npx create-next-app@latest . --ts --tailwind --app --src-dir --eslint --use-npm --import-alias "@/*"
npm i zod
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test
```
`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"], globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```
`tests/setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";
beforeEach(() => { try { localStorage.clear(); } catch {} });
```
`src/types.ts`:
```ts
export type Unit = "PIECE" | "KG";
export interface Category { id: string; name: string; slug: string; emoji: string }
export interface Product { id: string; vendorId: "everly"; categoryId: string; name: string; slug: string; description: string;
  unit: Unit; priceMnt: number; stock: number; active: boolean; origin?: string; shelfLifeDays?: number; imageUrl?: string }
export interface Zone { id: string; name: string; feeMnt: number; minOrderMnt: number }
export interface Slot { id: string; zoneId: string; startsAt: string; endsAt: string; capacity: number; booked: number }
export interface CartLine { productId: string; qty: number }
export type OrderStatus = "PENDING_PAYMENT" | "CONFIRMED" | "PICKING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
export type PaymentMethod = "QPAY" | "CASH";
export interface OrderItem { productId: string; name: string; unitPriceMnt: number; qty: number }
export interface Order { id: string; userPhone: string; status: OrderStatus; substitution: "ALLOW" | "NONE";
  addressLine: string; zoneId: string; slotId: string; slotLabel: string; items: OrderItem[];
  subtotalMnt: number; feeMnt: number; totalMnt: number; paymentMethod: PaymentMethod; createdAt: string }
```

- [ ] **Step 2: Failing smoke test** `tests/unit/smoke.test.ts`:
```ts
import { it, expect } from "vitest";
it("jsdom + localStorage available", () => { localStorage.setItem("a", "1"); expect(localStorage.getItem("a")).toBe("1"); });
```
Run: `npx vitest run` → Expected: PASS (орчин зөв) — хэрэв FAIL бол config засна.

- [ ] **Step 3: Commit** `git add -A && git commit -m "chore: scaffold Next.js frontend, test setup, shared types"`

---

### Task 2: Цэвэр helper-ууд (мөнгө, утас, хайлтын ижил төстэй байдал, storage)

**Files:**
- Create: `src/lib/money.ts`, `src/lib/phone.ts`, `src/lib/similarity.ts`, `src/lib/storage.ts`, `tests/unit/lib.test.ts`

**Interfaces:**
- Produces: `formatMnt(n): string`, `computeTotals(items, feeMnt)`, `normalizePhone(s): string | null`, `similarity(a, b): number` (0–1, trigram), `matchesQuery(name: string, q: string): boolean`, `readJson<T>(key, fallback): T`, `writeJson(key, value): void`.

- [ ] **Step 1: Failing tests** `tests/unit/lib.test.ts`:

```ts
import { it, expect } from "vitest";
import { formatMnt, computeTotals } from "@/lib/money";
import { normalizePhone } from "@/lib/phone";
import { matchesQuery } from "@/lib/similarity";
import { readJson, writeJson } from "@/lib/storage";

it("formats", () => expect(formatMnt(12500)).toBe("12,500₮"));
it("totals", () => expect(computeTotals([{ unitPriceMnt: 3200, qty: 2 }, { unitPriceMnt: 1000, qty: 1 }], 3000)).toEqual({ subtotalMnt: 7400, feeMnt: 3000, totalMnt: 10400 }));
it("rejects qty 0 and fractions", () => {
  expect(() => computeTotals([{ unitPriceMnt: 100, qty: 0 }], 0)).toThrow();
  expect(() => computeTotals([{ unitPriceMnt: 10.5, qty: 1 }], 0)).toThrow();
});
it("phone", () => {
  expect(normalizePhone("99112233")).toBe("99112233");
  expect(normalizePhone("+976 9911-2233")).toBe("99112233");
  expect(normalizePhone("1234")).toBeNull(); expect(normalizePhone("11112233")).toBeNull();
});
it("search tolerant", () => {
  expect(matchesQuery("Байцаа", "байцаа")).toBe(true);     // том/жижиг үсэг
  expect(matchesQuery("Байцаа", "байцаах")).toBe(true);    // нэг үсгийн алдаа
  expect(matchesQuery("Байцаа", "лууван")).toBe(false);
  expect(matchesQuery("Байцаа", "   ")).toBe(true);        // хоосон = бүгд
});
it("storage survives corrupt json and failing localStorage", () => {
  localStorage.setItem("k", "{bad"); expect(readJson("k", [1])).toEqual([1]);
  writeJson("k", { a: 1 }); expect(readJson("k", null)).toEqual({ a: 1 });
  const orig = Storage.prototype.getItem; Storage.prototype.getItem = () => { throw new Error("blocked"); };
  expect(readJson("k", "fb")).toBe("fb"); Storage.prototype.getItem = orig;
});
```

- [ ] **Step 2:** `npx vitest run tests/unit/lib.test.ts` → FAIL.

- [ ] **Step 3: Implementation**

`src/lib/money.ts`:
```ts
export const formatMnt = (n: number) => `${Math.round(n).toLocaleString("en-US")}₮`;
export function computeTotals(items: { unitPriceMnt: number; qty: number }[], feeMnt: number) {
  let subtotalMnt = 0;
  for (const i of items) {
    if (!Number.isInteger(i.unitPriceMnt) || !Number.isInteger(i.qty) || i.qty <= 0 || i.unitPriceMnt < 0) throw new Error("Буруу үнэ эсвэл тоо хэмжээ");
    subtotalMnt += i.unitPriceMnt * i.qty;
  }
  return { subtotalMnt, feeMnt, totalMnt: subtotalMnt + feeMnt };
}
```
`src/lib/phone.ts`:
```ts
export function normalizePhone(input: string): string | null {
  let d = input.replace(/[\s-]/g, "");
  if (d.startsWith("+976")) d = d.slice(4); else if (d.startsWith("976") && d.length === 11) d = d.slice(3);
  return /^[6789]\d{7}$/.test(d) ? d : null;
}
```
`src/lib/similarity.ts`:
```ts
const grams = (s: string) => { const t = `  ${s.toLowerCase()} `; const set = new Set<string>(); for (let i = 0; i < t.length - 2; i++) set.add(t.slice(i, i + 3)); return set; };
export function similarity(a: string, b: string): number {
  const A = grams(a), B = grams(b); let inter = 0; for (const g of A) if (B.has(g)) inter++;
  return inter / (A.size + B.size - inter || 1);
}
export function matchesQuery(name: string, q: string): boolean {
  const term = q.trim().toLowerCase(); if (!term) return true;
  return name.toLowerCase().includes(term) || similarity(name, term) >= 0.3;
}
```
`src/lib/storage.ts`:
```ts
export function readJson<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw == null ? fallback : (JSON.parse(raw) as T); } catch { return fallback; }
}
export function writeJson(key: string, value: unknown): void { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ } }
```

- [ ] **Step 4:** PASS. Хэрэв `байцаах` тест унавал босгыг 0.25 болгож тохируулна (тест шинэчлэхгүй, босгыг л).
- [ ] **Step 5:** `git add -A && git commit -m "feat: money, phone, fuzzy search and safe storage helpers"`

---

### Task 3: Mock өгөгдөл ба `api` давхарга

**Files:**
- Create: `src/mocks/categories.ts`, `src/mocks/products.ts`, `src/mocks/zones.ts`, `src/mocks/slots.ts`, `src/data/api.ts`, `src/data/mock-api.ts`, `tests/unit/mock-api.test.ts`

**Interfaces:**
- Consumes: `types.ts`, `matchesQuery`, `readJson/writeJson`, `normalizePhone`, `computeTotals`.
- Produces (`src/data/api.ts` — UI-ийн цорын ганц хаалга):
```ts
export interface Api {
  listCategories(): Promise<Category[]>;
  listProducts(o: { categorySlug?: string; q?: string }): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  listZones(): Promise<Zone[]>;
  listSlots(zoneId: string, now?: Date): Promise<Slot[]>;          // ирээдүйн, дүүрээгүй
  requestOtp(phone: string, now?: Date): Promise<void>;             // Error: INVALID_PHONE | TOO_SOON
  verifyOtp(phone: string, code: string, now?: Date): Promise<{ phone: string }>; // Error: INVALID | EXPIRED | LOCKED
  createOrder(i: { phone: string; lines: CartLine[]; zoneId: string; slotId: string; addressLine: string;
    substitution: "ALLOW" | "NONE"; paymentMethod: PaymentMethod; now?: Date }): Promise<Order>;
    // Error: EMPTY_CART | ZONE_UNKNOWN | SLOT_UNKNOWN | SLOT_FULL | OUT_OF_STOCK:<productId> | BELOW_MINIMUM
  payOrderMock(orderId: string): Promise<Order>;                    // QPAY захиалгыг CONFIRMED болгоно
  listOrders(phone: string): Promise<Order[]>;
  getOrder(id: string, phone: string): Promise<Order | null>;
  adminListOrders(): Promise<Order[]>;
  adminAdvanceOrder(id: string): Promise<Order>;                    // дараагийн төлөв
  adminSetStock(productId: string, stock: number): Promise<void>;  // Error: INVALID_STOCK
}
export const api: Api = mockApi;
```

- [ ] **Step 1: Mock өгөгдөл**
  - `categories.ts`: 6 ангилал (Хүнсний ногоо 🥬, Жимс 🍎, Мах 🥩, Сүү, Өндөг 🥛, Талх, Нарийн боов 🍞, Ундаа 🥤).
  - `products.ts`: ≥ 24 бараа (ангилал бүрд 3–5), үнэ 500–35,000₮ бүхэл тоо, `stock` янз бүр (нэг нь `0` — "Дууссан" харуулахад, нэг нь `2` — доод нөөцөд), мах/ногоо `unit: "KG"`, зарим нь `origin`, `shelfLifeDays`-тэй. `slug` нь латин. Зураг: `imageUrl` байхгүй, UI эможи/өнгөт placeholder харуулна.
  - `zones.ts`: 3 бүс (БЗД `fee 3000 min 20000`, СХД `fee 3500 min 25000`, ХУД `fee 4000 min 30000`).
  - `slots.ts`: `generateSlots(now: Date): Slot[]` — бүс бүрт өнөөдөр, маргааш, нөгөөдөр `10–12, 12–14, 16–18, 18–20`; capacity 6; зарим нь `booked = capacity` (дүүрсэн); өнгөрсөн цонхыг оруулахгүй. Тодорхой (deterministic): цонхны id = `${zoneId}-${YYYYMMDD}-${HH}` (жишээ `bzd-20300105-10`), тиймээс ижил `now`-оор үргэлж ижил id гарна; `booked` нь индексээс тооцогдоно (өнөөдрийн 18–20 цонх дүүрсэн).

- [ ] **Step 2: Failing tests** `tests/unit/mock-api.test.ts` (хамгийн чухлууд):

```ts
import { describe, it, expect } from "vitest";
import { mockApi as api } from "@/data/mock-api";
import { fullSlotId } from "@/mocks/slots"; // fullSlotId(now, zoneId): тухайн өдрийн 18–20 цонх, үргэлж дүүрсэн

const NOW = new Date("2030-01-05T08:00:00+08:00");
describe("catalog", () => {
  it("search is tolerant and category filter works", async () => {
    expect((await api.listProducts({ q: "  " })).length).toBeGreaterThan(20);
    expect(await api.listProducts({ q: "zzzzqq" })).toEqual([]);
    const veg = await api.listProducts({ categorySlug: "nogoo" }); expect(veg.every(p => p.categoryId === "nogoo")).toBe(true);
  });
});
describe("slots", () => {
  it("returns only future non-full slots", async () => {
    const s = await api.listSlots("bzd", NOW);
    expect(s.length).toBeGreaterThan(0);
    expect(s.every(x => new Date(x.startsAt) > NOW && x.booked < x.capacity)).toBe(true);
  });
});
describe("otp", () => {
  it("accepts 123456, rejects others, locks after 5, expires after 5min", async () => {
    await api.requestOtp("99112233", NOW);
    await expect(api.verifyOtp("99112233", "000000", NOW)).rejects.toThrow("INVALID");
    expect((await api.verifyOtp("99112233", "123456", NOW)).phone).toBe("99112233");
    const t = new Date("2030-01-05T09:00:00+08:00");
    await api.requestOtp("99112234", t);
    await expect(api.verifyOtp("99112234", "123456", new Date(t.getTime() + 6 * 60_000))).rejects.toThrow("EXPIRED");
    const u = new Date("2030-01-05T10:00:00+08:00"); await api.requestOtp("99112235", u);
    for (let i = 0; i < 5; i++) await api.verifyOtp("99112235", "000000", u).catch(() => {});
    await expect(api.verifyOtp("99112235", "123456", u)).rejects.toThrow("LOCKED");
  });
  it("rejects resend within 60s and bad phone", async () => {
    await api.requestOtp("99112236", NOW);
    await expect(api.requestOtp("99112236", new Date(NOW.getTime() + 10_000))).rejects.toThrow("TOO_SOON");
    await expect(api.requestOtp("123", NOW)).rejects.toThrow("INVALID_PHONE");
  });
});
describe("orders", () => {
  const base = async () => { const [p] = (await api.listProducts({})).filter(p => p.stock >= 5 && p.priceMnt * 5 >= 20000);
    const slot = (await api.listSlots("bzd", NOW))[0];
    return { p, input: { phone: "99112233", lines: [{ productId: p.id, qty: 5 }], zoneId: "bzd", slotId: slot.id, addressLine: "БЗД 3-р хороо", substitution: "NONE" as const, paymentMethod: "CASH" as const, now: NOW } }; };
  it("snapshots price, decrements stock, books slot, CASH is CONFIRMED", async () => {
    const { p, input } = await base(); const before = p.stock;
    const o = await api.createOrder(input);
    expect(o.status).toBe("CONFIRMED"); expect(o.totalMnt).toBe(p.priceMnt * 5 + 3000);
    expect((await api.getProductsByIds([p.id]))[0].stock).toBe(before - 5);
  });
  it("QPAY starts PENDING_PAYMENT and payOrderMock confirms once", async () => {
    const { input } = await base(); const o = await api.createOrder({ ...input, paymentMethod: "QPAY" });
    expect(o.status).toBe("PENDING_PAYMENT");
    expect((await api.payOrderMock(o.id)).status).toBe("CONFIRMED");
    expect((await api.payOrderMock(o.id)).status).toBe("CONFIRMED"); // давхар дуудлага аюулгүй
  });
  it("errors: empty cart, below minimum, qty over stock, full slot", async () => {
    const { input } = await base();
    await expect(api.createOrder({ ...input, lines: [] })).rejects.toThrow("EMPTY_CART");
    await expect(api.createOrder({ ...input, lines: [{ productId: input.lines[0].productId, qty: 1 }] })).rejects.toThrow("BELOW_MINIMUM");
    await expect(api.createOrder({ ...input, lines: [{ productId: input.lines[0].productId, qty: 99999 }] })).rejects.toThrow(/OUT_OF_STOCK/);
    await expect(api.createOrder({ ...input, slotId: fullSlotId(NOW, "bzd") })).rejects.toThrow("SLOT_FULL");
    await expect(api.createOrder({ ...input, slotId: "nope" })).rejects.toThrow("SLOT_UNKNOWN");
  });
  it("orders are scoped to the phone", async () => {
    const { input } = await base(); const o = await api.createOrder(input);
    expect(await api.getOrder(o.id, "88000000")).toBeNull();
    expect((await api.listOrders("99112233")).map(x => x.id)).toContain(o.id);
  });
  it("admin advances status in order and rejects bad stock", async () => {
    const { input } = await base(); const o = await api.createOrder(input);
    expect((await api.adminAdvanceOrder(o.id)).status).toBe("PICKING");
    expect((await api.adminAdvanceOrder(o.id)).status).toBe("OUT_FOR_DELIVERY");
    expect((await api.adminAdvanceOrder(o.id)).status).toBe("DELIVERED");
    await expect(api.adminAdvanceOrder(o.id)).rejects.toThrow("INVALID_TRANSITION");
    await expect(api.adminSetStock(input.lines[0].productId, -1)).rejects.toThrow("INVALID_STOCK");
  });
});
```
Тест бүрийн өмнө `tests/setup.ts` `localStorage.clear()` хийдэг; mock api санах ойд төлөв хадгалдаггүй тул өөр reset хэрэггүй. `slots.ts` нь `fullSlotId(now, zoneId)`-г export хийнэ (`generateSlots(now)`-ийн өнөөдрийн 18–20 цонх үргэлж `booked = capacity`; тэр цонх `now`-оос өмнө болсон бол маргаашийнх).

- [ ] **Step 3:** `npx vitest run tests/unit/mock-api.test.ts` → FAIL.

- [ ] **Step 4: Implementation** `src/data/mock-api.ts`. Төлөв:
  - Нөөц: `localStorage["everly.stock"]` = `{[productId]: number}` override; уншихдаа `products` mock дээр override давхарлана.
  - Хувилбар: `localStorage["everly.version"]` ≠ `MOCK_VERSION` бол бүх `everly.*` түлхүүрийг цэвэрлээд хувилбарыг бичнэ (api-ийн дуудлага бүрийн эхэнд `ensureVersion()`).
  - Слот: `localStorage["everly.slotBooked"]` = `{[slotId]: number}` override.
  - Захиалга: `localStorage["everly.orders"]` = `Order[]`.
  - OTP: `localStorage["everly.otp"]` = `{[phone]: {createdAt, expiresAt, attempts}}`.
  - `createOrder`: цонхыг `generateSlots(input.now ?? new Date())`-аас id-аар хайна (олдохгүй эсвэл бүс таарахгүй бол `SLOT_UNKNOWN`). Бүх шалгалтыг эхлээд хийнэ (EMPTY_CART → ZONE_UNKNOWN → SLOT_UNKNOWN → SLOT_FULL → нөөц (`OUT_OF_STOCK:<id>`) → BELOW_MINIMUM), дараа нь нэг дор нөөц, цонхны `booked`, захиалгыг бичнэ (хагас бичилт үүсгэхгүй). Захиалгын id: `EV-` + 6 оронтой тоо. Захиалгын мөр нэр, үнийг хуулна.
  - `payOrderMock`: `PENDING_PAYMENT` бол `CONFIRMED`, аль хэдийн `CONFIRMED` бол юу ч өөрчлөхгүй буцаана.
  - `adminAdvanceOrder`: `CONFIRMED → PICKING → OUT_FOR_DELIVERY → DELIVERED`; өөр бол `INVALID_TRANSITION`.
  - Бүх async функц `await delay(120)` (UI-ийн loading төлөвийг харуулахын тулд); тестэд `process.env.MOCK_DELAY=0`.
  - `src/data/api.ts`: `Api` интерфейс + `export const api: Api = mockApi;`

- [ ] **Step 5:** PASS. **Step 6:** `git add -A && git commit -m "feat: mock data and api layer"`

---

### Task 4: Сагсны reducer ба CartContext

**Files:**
- Create: `src/lib/cart-reducer.ts`, `src/context/CartContext.tsx`, `src/components/QtyStepper.tsx`, `src/components/AddToCart.tsx`, `tests/unit/cart.test.tsx`

**Interfaces:**
- Consumes: `CartLine`, `readJson/writeJson`, `api.getProductsByIds`.
- Produces: `cartReducer(state: CartLine[], action): CartLine[]`, actions `{type:"set"; productId; qty; max}|{type:"remove"; productId}|{type:"clear"}|{type:"load"; lines}`; `useCart(): { lines: CartLine[]; count: number; setQty(productId, qty, max): void; remove(id): void; clear(): void; ready: boolean }`; `<AddToCart product={Product} />`.

- [ ] **Step 1: Failing tests**

```tsx
import { it, expect } from "vitest";
import { cartReducer } from "@/lib/cart-reducer";
it("sets, caps at max, removes at 0", () => {
  let s = cartReducer([], { type: "set", productId: "a", qty: 2, max: 5 });
  expect(s).toEqual([{ productId: "a", qty: 2 }]);
  s = cartReducer(s, { type: "set", productId: "a", qty: 9, max: 5 }); expect(s[0].qty).toBe(5);
  s = cartReducer(s, { type: "set", productId: "a", qty: 0, max: 5 }); expect(s).toEqual([]);
});
it("ignores negative and fractional", () => {
  expect(cartReducer([], { type: "set", productId: "a", qty: -1, max: 5 })).toEqual([]);
  expect(cartReducer([], { type: "set", productId: "a", qty: 1.5, max: 5 })).toEqual([]);
});
it("max 0 (sold out) never adds", () => expect(cartReducer([], { type: "set", productId: "a", qty: 1, max: 0 })).toEqual([]));
```
Мөн CartContext тест: corrupt `everly.cart` JSON → `lines = []`, `ready = true`; `setQty` дуудахад `localStorage["everly.cart"]` шинэчлэгдэнэ; шинэ provider mount хийхэд сагс сэргэнэ (refresh дуурайлт).
`AddToCart` тест: `stock = 0` бол товч disabled "Дууссан"; дарахад тоо нэмэгдэж `QtyStepper` харагдана; `+` нь `stock`-д хүрэхэд disabled.

- [ ] **Step 2:** FAIL. **Step 3: Implementation**

```ts
// src/lib/cart-reducer.ts
import type { CartLine } from "@/types";
export type CartAction =
  | { type: "set"; productId: string; qty: number; max: number }
  | { type: "remove"; productId: string } | { type: "clear" } | { type: "load"; lines: CartLine[] };
export function cartReducer(state: CartLine[], a: CartAction): CartLine[] {
  switch (a.type) {
    case "load": return a.lines.filter(l => Number.isInteger(l.qty) && l.qty > 0);
    case "clear": return [];
    case "remove": return state.filter(l => l.productId !== a.productId);
    case "set": {
      if (!Number.isInteger(a.qty) || a.qty < 0) return state;
      const qty = Math.min(a.qty, a.max);
      const rest = state.filter(l => l.productId !== a.productId);
      return qty > 0 ? [...rest, { productId: a.productId, qty }] : rest;
    }
  }
}
```
`CartContext.tsx`: `"use client"`, `useReducer`, mount дээр `readJson("everly.cart", [])` → `load` → `ready = true`; төлөв өөрчлөгдөх бүрд (ready болсны дараа) `writeJson`. `QtyStepper`: `−`/`+` товч, `aria-label="Хасах"`/`"Нэмэх"`, `+` нь `qty >= max` үед disabled.

- [ ] **Step 4:** PASS. **Step 5:** `git add -A && git commit -m "feat: cart reducer, context and add-to-cart"`

---

### Task 5: Layout, нүүр, каталог, хайлт, бүтээгдэхүүний хуудас

**Files:**
- Create: `src/components/{Header,ProductCard,MockBanner}.tsx`, `src/app/layout.tsx` (засна), `src/app/page.tsx`, `src/app/c/[slug]/page.tsx`, `src/app/p/[slug]/page.tsx`, `src/app/search/page.tsx`, `tests/unit/product-card.test.tsx`

**Interfaces:**
- Consumes: `api`, `useCart`, `formatMnt`, `AddToCart`.
- Produces: `<ProductCard product />`, `<Header />` (лого, хайлтын талбар, сагсны тоо, нэвтрэх/профайл холбоос), `<MockBanner />` ("Туршилтын горим: бодит төлбөр, хүргэлт байхгүй").

- [ ] **Step 1: Failing tests** `product-card.test.tsx`: нэр, `formatMnt(price)` + нэгж ("/ ширхэг" эсвэл "/ кг"), `stock = 0` үед "Дууссан" тэмдэг, `stock <= 3` үед "Цөөхөн үлдсэн", `p/{slug}` холбоос. `Header` тест: сагсанд 3 ширхэг байхад badge `3` харагдана.
- [ ] **Step 2:** FAIL. **Step 3: Implementation**
  - `layout.tsx`: `<html lang="mn">`, `CartProvider`, `AuthProvider`, `MockBanner`, `Header`, `<main className="mx-auto max-w-5xl px-4 pb-24">`.
  - Нүүр: ангиллын чип (`c/[slug]` холбоос), "Шинэхэн" ба "Хямд"-гүй, зөвхөн ангилал бүрийн эхний 4 барааны мөр. Хоосон/алдааны төлөв: skeleton → харагдац.
  - `search`: `?q=` -оор `api.listProducts`; үр дүнгүй бол "«{q}» олдсонгүй. Өөр үгээр хайж үзнэ үү" + ангиллын холбоосууд.
  - `p/[slug]`: нэр, үнэ/нэгж, тайлбар, гарал үүсэл, хадгалах хугацаа, `AddToCart`; олдохгүй бол "Бараа олдсонгүй" хуудас (`notFound()` биш, client-д).
  - Эможи placeholder: ангиллын `emoji`-г том үсгээр өнгөт дэвсгэр дээр.
  - Хуудас бүр `<title>` (`document.title`-ийг effect-ээр, учир нь Client Component). `layout.tsx`-д анхдагч title "Everly — хүнсний онлайн дэлгүүр".
  - `MockBanner` дотор "Mock өгөгдөл сэргээх" товч: баталгаажуулах `confirm` дараа бүх `everly.*` түлхүүрийг устгаад `location.reload()`.
- [ ] **Step 4:** PASS + гараар `npm run dev`, 390px-д нүүр → ангилал → бараа замыг шалгана.
- [ ] **Step 5:** `git add -A && git commit -m "feat: storefront browsing pages"`

---

### Task 6: Mock нэвтрэлт (OTP) ба хамгаалагдсан route

**Files:**
- Create: `src/context/AuthContext.tsx`, `src/app/login/page.tsx`, `src/components/RequireAuth.tsx`, `tests/unit/auth.test.tsx`

**Interfaces:**
- Consumes: `api.requestOtp/verifyOtp`, `normalizePhone`, `readJson/writeJson`.
- Produces: `useAuth(): { phone: string | null; ready: boolean; login(phone): void; logout(): void }` (`localStorage["everly.session"]`), `<RequireAuth>` (нэвтрээгүй бол `router.replace("/login?next=" + encodeURIComponent(path))`).

- [ ] **Step 1: Failing tests** (Testing Library):
  - Буруу утсаар "Код илгээх" дарахад "Утасны дугаар буруу" харагдана, `requestOtp` дуудагдахгүй.
  - Зөв дугаар → код оруулах талбар гарч, "Туршилтын код: 123456" сануулга харагдана.
  - Буруу код → "Код буруу"; 5 дахь буруугийн дараа "Түгжигдлээ, дараа дахин оролдоно уу"; зөв код → `session` хадгалагдаж `next` руу шилжинэ.
  - `RequireAuth`: нэвтрээгүй бол children харагдахгүй, redirect `?next=` зөв кодлогдсон.
  - Corrupt `everly.session` → нэвтрээгүй гэж үзнэ.
  - `next` параметр `//evil.com` эсвэл `http://…` бол үл тооцож `/` руу шилжинэ (open redirect-ээс сэргийлэх).
- [ ] **Step 2:** FAIL. **Step 3:** Хэрэгжүүлнэ. `next` шалгах функц: `const safeNext = (n: string | null) => n && n.startsWith("/") && !n.startsWith("//") ? n : "/";`. Алдааны код → монгол мессеж map нэг газар (`src/lib/errors.ts`): `INVALID_PHONE`, `TOO_SOON` ("60 секундийн дараа дахин илгээнэ"), `INVALID`, `EXPIRED`, `LOCKED`.
- [ ] **Step 4:** PASS. **Step 5:** `git add -A && git commit -m "feat: mock OTP login and route guard"`

---

### Task 7: Сагс ба Checkout

**Files:**
- Create: `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`, `src/components/SlotPicker.tsx`, `src/lib/errors.ts` (өргөтгөнө), `tests/unit/checkout.test.tsx`

**Interfaces:**
- Consumes: `useCart`, `api.getProductsByIds/listZones/listSlots/createOrder`, `computeTotals`, `RequireAuth`.
- Produces: `/cart` (мөр бүрт `QtyStepper`, устгах, нийт дүн, "Захиалах" → `/checkout`), `/checkout` (хаяг, бүс, `SlotPicker`, орлуулалтын checkbox, төлбөрийн арга, хураангуй, "Захиалга баталгаажуулах").
- Алдааны map: `OUT_OF_STOCK` → "Зарим бараа дууссан, сагсаа шалгана уу", `SLOT_FULL` → "Энэ цонх дүүрсэн, өөр цаг сонгоно уу", `BELOW_MINIMUM` → "Хамгийн бага захиалгын дүн {n}".

- [ ] **Step 1: Failing tests**
  - `/cart` хоосон: "Таны сагс хоосон" + "Дэлгүүр хэсэх" холбоос.
  - Сагсанд 2 бараа: мөр бүрийн дэд дүн, нийт дүн зөв (`formatMnt`).
  - Сагсны бараа нөөц нь сагсны тооноос бага болсон бол (mock-д `adminSetStock`-оор багасгаад) `/cart` ачаалахад тоо автоматаар нөөц хүртэл бууж "Зарим барааны тоо нөөцөд тааруулж өөрчлөгдлөө" мэдэгдэл гарна; нөөц 0 бол мөр устаж мэдэгдэл гарна.
  - Checkout: хаяг хоосон, бүс/цонх сонгоогүй, нийт дүн бүсийн доод дүнгээс бага үед "Баталгаажуулах" disabled ба шалтгаан текстээр харагдана.
  - Дүүрсэн цонх `SlotPicker` дотор disabled ("Дүүрсэн").
  - Бүс сольход `SlotPicker` цонхнууд шинэчлэгдэж, өмнө сонгосон цонх цэвэрлэгдэнэ.
  - Амжилттай: `CASH` → `/orders/{id}`; `QPAY` → `/pay/{id}`; сагс цэвэрлэгдэнэ.
  - `createOrder` `OUT_OF_STOCK` шидвэл мессеж харагдаж, сагс нөөцөөр дахин тохируулагдана, хуудас унахгүй.
  - Давхар товшилт: "Баталгаажуулах" дарсны дараа дуусах хүртэл disabled (нэг л захиалга үүснэ).
  - Цэвэр дүрмийн unit тест `tests/unit/checkout-rules.test.ts`:
```ts
import { it, expect } from "vitest";
import { checkoutBlockReason } from "@/lib/checkout-rules";
const ok = { addressLine: "БЗД 3-р хороо", zone: { id: "bzd", minOrderMnt: 20000 }, slot: { booked: 1, capacity: 6 }, subtotalMnt: 25000, submitting: false };
it("ok", () => expect(checkoutBlockReason(ok)).toBeNull());
it("address", () => expect(checkoutBlockReason({ ...ok, addressLine: "  " })).toBe("Хаягаа оруулна уу"));
it("zone", () => expect(checkoutBlockReason({ ...ok, zone: null })).toBe("Хүргэлтийн бүсээ сонгоно уу"));
it("slot", () => expect(checkoutBlockReason({ ...ok, slot: null })).toBe("Хүргэлтийн цагаа сонгоно уу"));
it("full slot", () => expect(checkoutBlockReason({ ...ok, slot: { booked: 6, capacity: 6 } })).toBe("Энэ цонх дүүрсэн, өөр цаг сонгоно уу"));
it("minimum", () => expect(checkoutBlockReason({ ...ok, subtotalMnt: 5000 })).toBe("Хамгийн бага захиалгын дүн 20,000₮"));
it("submitting", () => expect(checkoutBlockReason({ ...ok, submitting: true })).toBe("Түр хүлээнэ үү…"));
```
- [ ] **Step 2:** FAIL. **Step 3:** Эхлээд `src/lib/checkout-rules.ts`:
```ts
import { formatMnt } from "./money";
export function checkoutBlockReason(s: { addressLine: string; zone: { id: string; minOrderMnt: number } | null;
  slot: { booked: number; capacity: number } | null; subtotalMnt: number; submitting: boolean }): string | null {
  if (s.submitting) return "Түр хүлээнэ үү…";
  if (!s.addressLine.trim()) return "Хаягаа оруулна уу";
  if (!s.zone) return "Хүргэлтийн бүсээ сонгоно уу";
  if (!s.slot) return "Хүргэлтийн цагаа сонгоно уу";
  if (s.slot.booked >= s.slot.capacity) return "Энэ цонх дүүрсэн, өөр цаг сонгоно уу";
  if (s.subtotalMnt < s.zone.minOrderMnt) return `Хамгийн бага захиалгын дүн ${formatMnt(s.zone.minOrderMnt)}`;
  return null;
}
```
Товчийн `disabled` ба тайлбар текст нь энэ функцээс (`reason !== null`) гарна. Дараа нь хуудсуудыг хэрэгжүүлнэ. Нийт дүнг үргэлж `api.getProductsByIds`-аас авсан одоогийн үнээр `computeTotals`-д өгч тооцно (localStorage-д үнэ хадгалахгүй, зөвхөн `productId`+`qty`). Checkout эхлэхэд нэг удаа сагсыг нөөцтэй тулгана.
- [ ] **Step 4:** PASS. **Step 5:** `git add -A && git commit -m "feat: cart and checkout"`

---

### Task 8: Mock төлбөр, захиалгын түүх, дахин захиалах

**Files:**
- Create: `src/app/pay/[orderId]/page.tsx`, `src/app/orders/page.tsx`, `src/app/orders/[id]/page.tsx`, `src/components/OrderStatusBadge.tsx`, `tests/unit/orders-ui.test.tsx`

**Interfaces:**
- Consumes: `api.getOrder/listOrders/payOrderMock`, `useAuth`, `useCart`.
- Produces: `/pay/[orderId]` (QR placeholder + "QPay-ээр төлөх" тайлбар + **"Төлсөн гэж тэмдэглэх (туршилт)"** товч → `payOrderMock` → `/orders/{id}`), `/orders`, `/orders/[id]` (бараа, дүн, хаяг, цонх, төлөвийн шат), "Дахин захиалах".
- Төлөвийн монгол нэр: `PENDING_PAYMENT` Төлбөр хүлээж буй · `CONFIRMED` Баталгаажсан · `PICKING` Бэлтгэж байна · `OUT_FOR_DELIVERY` Хүргэлтэнд гарсан · `DELIVERED` Хүргэгдсэн · `CANCELLED` Цуцлагдсан.

- [ ] **Step 1: Failing tests**
  - `/orders` хоосон: "Захиалга байхгүй байна".
  - Захиалгууд шинэ нь эхэнд; төлөв badge зөв монгол нэртэй.
  - Өөр хэрэглэгчийн захиалгын id-аар `/orders/[id]` орвол "Захиалга олдсонгүй".
  - `/pay/[orderId]`: "туршилт" товч дарахад төлөв `CONFIRMED` болж шилжинэ; аль хэдийн төлөгдсөн захиалгад дахин орвол шууд захиалгын хуудас руу чиглэнэ.
  - "Дахин захиалах": өмнөх мөрүүдийг сагсанд нэмнэ; нөөц хүрэхгүй бараа нөөцөөр хязгаарлагдана, дууссан нь орхигдоно, мэдэгдэл харуулна; сагс руу шилжинэ.
- [ ] **Step 2:** FAIL. **Step 3:** Хэрэгжүүлнэ. **Step 4:** PASS. **Step 5:** `git add -A && git commit -m "feat: mock payment, order history, reorder"`

---

### Task 9: Админ харагдац (mock)

**Files:**
- Create: `src/app/admin/page.tsx`, `src/app/admin/products/page.tsx`, `src/app/admin/orders/page.tsx`, `src/app/admin/layout.tsx`, `tests/unit/admin.test.tsx`

**Interfaces:**
- Consumes: `api.listProducts/adminSetStock/adminListOrders/adminAdvanceOrder`.
- Produces: `/admin` (өнөөдрийн захиалгын тоо, нийт дүн, нөөц бага барааны жагсаалт), `/admin/products` (нэр, үнэ, нөөц inline засвар), `/admin/orders` (төлвөөр шүүх, "Дараагийн төлөв" товч).
- Admin нэвтрэлт энэ plan-д **байхгүй** (backend ороогүй); `/admin` дээр "Туршилтын админ харагдац: нэвтрэлтгүй" баннер.

- [ ] **Step 1: Failing tests**
  - Нөөцийг `-1` эсвэл `1.5` болгож хадгалахад "Нөөц 0 буюу түүнээс их бүхэл тоо байна" гэсэн алдаа харагдаж утга өөрчлөгдөхгүй; `5` бол хадгалагдаж шинэчлэгдсэн утга харагдана.
  - Захиалгын "Дараагийн төлөв" товч зөвхөн боломжит төлөвт харагдана; `DELIVERED`/`CANCELLED` дээр товч байхгүй.
  - Төлвөөр шүүх ажиллана.
- [ ] **Step 2:** FAIL. **Step 3:** Хэрэгжүүлнэ. **Step 4:** PASS. **Step 5:** `git add -A && git commit -m "feat: mock admin views"`

---

### Task 10: End-to-end тест ба responsive шалгалт

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/purchase.spec.ts`, `tests/e2e/guards.spec.ts`, `README.md`

- [ ] **Step 1: Failing e2e** (`webServer: npm run dev`, viewport 390×844):

```ts
import { test, expect } from "@playwright/test";
test.use({ viewport: { width: 390, height: 844 } });

test("guest browses, logs in, pays with mock QPay, sees order", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Хүнсний ногоо/ }).first().click();
  await page.getByRole("button", { name: "Сагсанд нэмэх" }).first().click();
  await page.getByRole("link", { name: /Сагс/ }).click();
  await page.getByRole("link", { name: "Захиалах" }).click();       // → /login?next=/checkout
  await page.getByLabel("Утасны дугаар").fill("99112233");
  await page.getByRole("button", { name: "Код илгээх" }).click();
  await page.getByLabel("Код").fill("123456");
  await page.getByRole("button", { name: "Нэвтрэх" }).click();
  await expect(page).toHaveURL(/\/checkout/);
  await page.getByLabel("Хаяг").fill("БЗД, 3-р хороо, 12-р байр");
  await page.getByLabel("Бүс").selectOption({ label: "БЗД" });
  await page.getByRole("radio").first().check();
  await page.getByLabel("QPay").check();
  await page.getByRole("button", { name: "Захиалга баталгаажуулах" }).click();
  await page.getByRole("button", { name: /Төлсөн гэж тэмдэглэх/ }).click();
  await expect(page.getByText("Баталгаажсан")).toBeVisible();
  await page.reload();                                               // refresh-д алдагдахгүй
  await expect(page.getByText("Баталгаажсан")).toBeVisible();
});
test("no horizontal scroll on home, category, cart", async ({ page }) => {
  for (const path of ["/", "/c/nogoo", "/cart"]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
test("guards redirect to login", async ({ page }) => {
  for (const p of ["/checkout", "/orders"]) { await page.goto(p); await expect(page).toHaveURL(/\/login\?next=/); }
});
test("corrupt localStorage does not crash", async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem("everly.cart", "{bad"); localStorage.setItem("everly.session", "[["); });
  await page.goto("/"); await expect(page.getByRole("link", { name: /Сагс/ })).toBeVisible();
});
test("sold-out product cannot be added", async ({ page }) => {
  await page.goto("/p/" + SOLD_OUT_SLUG);   // products.ts-д stock=0 болгосон барааны slug (Task 3-т export)
  await expect(page.getByRole("button", { name: "Дууссан" })).toBeDisabled();
});
```
Тестийн дээд талд: `import { SOLD_OUT_SLUG } from "../../src/mocks/products";`

- [ ] **Step 2:** `npx playwright test` → FAIL. **Step 3:** Дутуу label/aria-г UI дээр засна. **Step 4:** `npx vitest run && npx playwright test` → бүгд PASS.
- [ ] **Step 5:** `README.md`: ажиллуулах заавар (`npm i && npm run dev`), mock-ийн дүрэм (OTP `123456`, localStorage түлхүүрүүд, "mock data сэргээх" = DevTools-д `localStorage.clear()`), backend-д шилжүүлэх заавар (`src/data/api.ts`-ийн `Api` интерфейсийг HTTP-ээр хэрэгжүүлж `export const api` солих).
- [ ] **Step 6:** `git add -A && git commit -m "test: e2e flows and README"`

---

## Self-Review

| Spec/шаардлага | Task |
|---|---|
| Каталог, ангилал, бүтээгдэхүүний дэлгэрэнгүй | 3, 5 |
| Хайлт (үсгийн алдаа) | 2, 3, 5 |
| Сагс, refresh-д хадгалагдах | 4, 7, 10 |
| Checkout: хаяг, бүс, цонх, орлуулалт, төлбөрийн арга | 7 |
| Хүргэлтийн цонх (дүүрсэн), доод дүн, хураамж | 3, 7 |
| QPay (mock) ба бэлнээр | 3, 8 |
| OTP нэвтрэлт, захиалгын түүх, дахин захиалах | 3, 6, 8 |
| Захиалгын төлөв | 3, 8, 9 |
| Админ харагдац (бараа, нөөц, захиалга) | 9 |
| Backend-д шилжих боломж | `Api` интерфейс (Task 3), README (Task 10) |
| Mobile-first | Global, Task 10 |

**Хүрээнээс гадуур (энэ plan-д ороогүй):** бодит backend/DB, бодит SMS/QPay, админы нэвтрэлт, SocialPay/Pocket, газрын зургийн pin, SMS мэдэгдэл, тогтмол захиалга, хөнгөлөлт. Эдгээр нь `2026-10-12-everly-mvp-fullstack.md`-д бий (газрын зургийн pin, админы нэвтрэлт хэсэг нь тэнд ч товч).

**Мэдэгдэж буй хязгаарлалт:** mock нь нэг хөтөч дотор (localStorage) ажиллана, тиймээс админ харагдац хэрэглэгчийн захиалгыг зөвхөн ижил хөтөч дээр харна. Нөөц/цонхны race condition бодит олон хэрэглэгчийн хувьд энд тестлэгдэхгүй (backend plan-ын Task 6–7-д бий).
