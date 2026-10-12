# Everly MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Улаанбаатарын цөөн бүсэд хүнс хүргэдэг онлайн дэлгүүрийн MVP (каталог → сагс → checkout → QPay → хүргэлт → админ).

**Architecture:** Нэг Next.js (App Router) monolith. Бизнес логик нь `src/server/*` дахь цэвэр модулиудад (DB-ээс хамааралгүй функцууд тусдаа), route handler болон server action нь зөвхөн тэдгээрийг дууддаг. Гадаад үйлчилгээ (SMS, QPay) нь interface-ийн ард, dev/test-д mock хэрэгжилттэй.

**Tech Stack:** Next.js 15 (React 19), TypeScript, Tailwind CSS, PostgreSQL 16, Prisma, Vitest, Playwright, zod, jose (session JWT).

**Spec:** `docs/superpowers-Belgute/specs/2026-10-12-everly-grocery-design.md` (UI: `2026-10-12-everly-frontend-spec.md`)

**Холбоос:** UI-г `2026-10-12-everly-frontend.md` plan-д mock дээр бүтээнэ. Энэ plan нь backend-ийг бүтээж, Task 11-д frontend-ийн `src/data/api.ts`-ийг бодит HTTP-ээр сольж холбоно.

## Global Constraints

- Frontend нь React (Next.js). Бүх UI текст монгол кирилл.
- Валют ₮ (MNT), бүхэл тоо (төгрөг), floating point ашиглахгүй.
- Нэвтрэлт: утасны дугаар + SMS OTP (нууц үггүй). Монгол утас: 8 орон, `[89]` эсвэл `[67]`-оор эхэлнэ.
- Бараа бүр `vendorId` талбартай (одоо бүгд нэг "everly" худалдагч).
- Захиалгын мөр нь захиалгын үеийн үнийг хуулж хадгална.
- Нөөцийг transaction дотор хасна (давхар захиалгаас сэргийлнэ).
- Төлбөр QPay (callback-ээр баталгаажуулна); бэлнээр төлөх сонголт хүргэлт дээр.
- Мутаци хийдэг route бүр `Origin` header-ийг өөрийн host-той тулгана (CSRF); session cookie `SameSite=Lax`, `HttpOnly`.
- Бүх зөвшөөрлийн шалгалт серверт (хэрэглэгч зөвхөн өөрийн захиалга/хаяг/сагсыг харна).
- PostgreSQL нь UTF-8 locale-той (`en_US.utf8`): `pg_trgm` кирилл үсгийг зөв танихад шаардлагатай.
- MVP-д байхгүй: тогтмол захиалга, купон/оноо, жор, жолоочийн апп, олон худалдагч, аймаг, англи хэл.

## Review Focus

1. QPay callback хоёр удаа ирвэл: нэг л удаа төлөгдсөн болно, нөөц давхар хасагдахгүй.
2. Хоёр хэрэглэгч сүүлийн 1 ширхэг бараа зэрэг захиалбал: нэг нь амжилттай, нөгөө нь "дууссан" алдаа авна.
3. Цонхны capacity дүүрэх мөчид хоёр checkout зэрэг ирвэл: capacity хэтрэхгүй.
4. OTP: буруу код олон удаа оруулбал түгждэг, хугацаа дууссан код хүчингүй.
5. Хоосон сагс, тоо хэмжээ 0 эсвэл сөрөг, жишээ нь 10 000 гэх хэт их тоогоор checkout хийхэд ойлгомжтой алдаа буцаана.
6. Хэрэглэгч А хэрэглэгч Б-ийн захиалгыг ID-аар нээхийг оролдвол 404 (IDOR). Task 8 ба 11-д тест бий.
7. Төлөгдөөгүй QPay захиалга 30 минутын дараа цуцлагдаж, нөөц болон цонх буцаж чөлөөлөгдөнө (Task 8).
8. Нэг утсанд OTP-г өдөрт 10-аас олон удаа илгээх боломжгүй (SMS зардлын мөлжлөгөөс сэргийлнэ, Task 4).

---

## File Structure

```
package.json, tsconfig.json, next.config.ts, vitest.config.ts, playwright.config.ts
prisma/schema.prisma
prisma/seed.ts
src/lib/money.ts                    # ₮ форматлах, хураамж тооцоо (цэвэр)
src/lib/phone.ts                    # утасны дугаар normalise/validate (цэвэр)
src/lib/db.ts                       # Prisma client singleton
src/server/catalog.ts               # бүтээгдэхүүн жагсаалт, хайлт
src/server/auth/otp.ts              # OTP үүсгэх/шалгах
src/server/auth/session.ts          # JWT cookie session
src/server/sms/index.ts             # SmsProvider interface + console provider
src/server/cart.ts                  # сагс
src/server/delivery.ts              # бүс, цонх, capacity
src/server/orders.ts                # захиалга үүсгэх, төлөвийн шилжилт
src/server/payments/provider.ts     # PaymentProvider interface
src/server/payments/qpay.ts         # QPay v2 клиент
src/server/payments/mock.ts         # dev/test mock
src/server/payments/confirm.ts      # callback боловсруулалт (idempotent)
src/server/notify.ts                # төлөв өөрчлөгдөхөд SMS
src/app/(shop)/...                  # storefront хуудсууд
src/app/admin/...                   # админ самбар
src/app/api/...                     # route handlers (OTP, payments callback)
tests/unit/*.test.ts, tests/integration/*.test.ts, tests/e2e/*.spec.ts
```

---

### Task 1: Төслийн суурь, DB schema, тестийн орчин

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.env.example`, `docker-compose.yml`, `prisma/schema.prisma`, `src/lib/db.ts`, `tests/integration/schema.test.ts`

**Interfaces:**
- Produces: `prisma` (PrismaClient) from `src/lib/db.ts`; Prisma models `User, Address, Category, Product, Cart, CartItem, DeliveryZone, DeliverySlot, Order, OrderItem, Payment, OtpCode, StaffUser`.

- [ ] **Step 1: Scaffold**

```bash
npx create-next-app@latest . --ts --tailwind --app --src-dir --eslint --use-npm --import-alias "@/*"
npm i prisma @prisma/client zod jose
npm i -D vitest @vitest/coverage-v8 tsx @playwright/test
npx prisma init --datasource-provider postgresql
```

`docker-compose.yml`:
```yaml
services:
  db:
    image: postgres:16
    environment: { POSTGRES_USER: everly, POSTGRES_PASSWORD: everly, POSTGRES_DB: everly, POSTGRES_INITDB_ARGS: "--locale=en_US.utf8" }
    ports: ["5432:5432"]
  db_test:
    image: postgres:16
    environment: { POSTGRES_USER: everly, POSTGRES_PASSWORD: everly, POSTGRES_DB: everly_test, POSTGRES_INITDB_ARGS: "--locale=en_US.utf8" }
    ports: ["5433:5432"]
```

`.env.example`:
```
DATABASE_URL=postgresql://everly:everly@localhost:5432/everly
TEST_DATABASE_URL=postgresql://everly:everly@localhost:5433/everly_test
SESSION_SECRET=change-me-32-chars-minimum-please
QPAY_BASE_URL=https://merchant-sandbox.qpay.mn/v2
QPAY_USERNAME=
QPAY_PASSWORD=
QPAY_INVOICE_CODE=
PAYMENT_PROVIDER=mock
```

- [ ] **Step 2: schema.prisma**

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum OrderStatus { PENDING_PAYMENT CONFIRMED PICKING OUT_FOR_DELIVERY DELIVERED CANCELLED }
enum PaymentMethod { QPAY CASH }
enum PaymentStatus { PENDING PAID FAILED }
enum SubstitutionPref { ALLOW NONE }
enum StaffRole { ADMIN STAFF }
enum Unit { PIECE KG }

model User { id String @id @default(cuid()); phone String @unique; name String?
  addresses Address[]; orders Order[]; cart Cart?; createdAt DateTime @default(now()) }
model Address { id String @id @default(cuid()); userId String; user User @relation(fields: [userId], references: [id])
  line String; lat Float?; lng Float?; zoneId String?; zone DeliveryZone? @relation(fields: [zoneId], references: [id]) }
model Category { id String @id @default(cuid()); name String; slug String @unique; products Product[] }
model Product { id String @id @default(cuid()); vendorId String @default("everly")
  categoryId String; category Category @relation(fields: [categoryId], references: [id])
  name String; slug String @unique; description String @default("")
  unit Unit @default(PIECE); priceMnt Int; stock Int @default(0); active Boolean @default(true)
  imageUrl String?; origin String?; shelfLifeDays Int?
  @@index([name]) }
model Cart { id String @id @default(cuid()); userId String @unique; user User @relation(fields: [userId], references: [id]); items CartItem[] }
model CartItem { id String @id @default(cuid()); cartId String; cart Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId String; product Product @relation(fields: [productId], references: [id]); qty Int
  @@unique([cartId, productId]) }
model DeliveryZone { id String @id @default(cuid()); name String; feeMnt Int; minOrderMnt Int; active Boolean @default(true)
  slots DeliverySlot[]; addresses Address[] }
model DeliverySlot { id String @id @default(cuid()); zoneId String; zone DeliveryZone @relation(fields: [zoneId], references: [id])
  startsAt DateTime; endsAt DateTime; capacity Int; booked Int @default(0); orders Order[]
  @@unique([zoneId, startsAt]) }
model Order { id String @id @default(cuid()); userId String; user User @relation(fields: [userId], references: [id])
  status OrderStatus @default(PENDING_PAYMENT); substitution SubstitutionPref @default(NONE)
  addressLine String; lat Float?; lng Float?; slotId String; slot DeliverySlot @relation(fields: [slotId], references: [id])
  subtotalMnt Int; feeMnt Int; totalMnt Int; paymentMethod PaymentMethod
  items OrderItem[]; payments Payment[]; createdAt DateTime @default(now()) }
model OrderItem { id String @id @default(cuid()); orderId String; order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String; name String; unitPriceMnt Int; qty Int }
model Payment { id String @id @default(cuid()); orderId String; order Order @relation(fields: [orderId], references: [id])
  method PaymentMethod; status PaymentStatus @default(PENDING); externalId String? @unique; amountMnt Int; paidAt DateTime? }
model OtpCode { id String @id @default(cuid()); phone String; codeHash String; attempts Int @default(0)
  expiresAt DateTime; consumedAt DateTime?; createdAt DateTime @default(now()); @@index([phone]) }
model StaffUser { id String @id @default(cuid()); email String @unique; passwordHash String; role StaffRole @default(STAFF) }
```

- [ ] **Step 3: Failing test (schema хүрдэг эсэх)**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  test: { environment: "node", env: { DATABASE_URL: process.env.TEST_DATABASE_URL ?? "postgresql://everly:everly@localhost:5433/everly_test" }, fileParallelism: false },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```
`src/lib/db.ts`:
```ts
import { PrismaClient } from "@prisma/client";
const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
```
`tests/integration/schema.test.ts`:
```ts
import { describe, it, expect, beforeAll } from "vitest";
import { prisma } from "@/lib/db";
describe("schema", () => {
  beforeAll(async () => { await prisma.$executeRawUnsafe('TRUNCATE "Category" CASCADE'); });
  it("creates a product with default vendorId", async () => {
    const c = await prisma.category.create({ data: { name: "Сүү", slug: "suu" } });
    const p = await prisma.product.create({ data: { categoryId: c.id, name: "Сүү 1л", slug: "suu-1l", priceMnt: 3200, stock: 5 } });
    expect(p.vendorId).toBe("everly");
  });
});
```

- [ ] **Step 4: Ажиллуулж алдаа гарахыг харах**

Run: `docker compose up -d && npx vitest run tests/integration/schema.test.ts`
Expected: FAIL (migration хийгдээгүй, хүснэгт байхгүй).

- [ ] **Step 5: Migration хийж давах**

Run: `DATABASE_URL=$TEST_DATABASE_URL npx prisma migrate dev --name init && npx vitest run tests/integration/schema.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js, Prisma schema, test setup"
```

---

### Task 2: Мөнгө, утасны дугаарын цэвэр функцууд

**Files:**
- Create: `src/lib/money.ts`, `src/lib/phone.ts`, `tests/unit/money.test.ts`, `tests/unit/phone.test.ts`

**Interfaces:**
- Produces: `formatMnt(n: number): string`, `computeTotals(items: {unitPriceMnt: number; qty: number}[], feeMnt: number): {subtotalMnt: number; feeMnt: number; totalMnt: number}`, `normalizePhone(input: string): string | null`.

- [ ] **Step 1: Failing tests**

`tests/unit/money.test.ts`:
```ts
import { it, expect } from "vitest";
import { formatMnt, computeTotals } from "@/lib/money";
it("formats", () => expect(formatMnt(12500)).toBe("12,500₮"));
it("totals", () => expect(computeTotals([{ unitPriceMnt: 3200, qty: 2 }, { unitPriceMnt: 1000, qty: 1 }], 3000))
  .toEqual({ subtotalMnt: 7400, feeMnt: 3000, totalMnt: 10400 }));
it("rejects non-positive qty", () => expect(() => computeTotals([{ unitPriceMnt: 100, qty: 0 }], 0)).toThrow());
it("rejects non-integer", () => expect(() => computeTotals([{ unitPriceMnt: 10.5, qty: 1 }], 0)).toThrow());
```
`tests/unit/phone.test.ts`:
```ts
import { it, expect } from "vitest";
import { normalizePhone } from "@/lib/phone";
it("accepts 8 digits", () => expect(normalizePhone("99112233")).toBe("99112233"));
it("strips +976 and spaces", () => expect(normalizePhone("+976 9911-2233")).toBe("99112233"));
it("rejects short", () => expect(normalizePhone("1234")).toBeNull());
it("rejects bad prefix", () => expect(normalizePhone("11112233")).toBeNull());
```

- [ ] **Step 2:** Run `npx vitest run tests/unit` → Expected: FAIL (модуль байхгүй).

- [ ] **Step 3: Implementation**

`src/lib/money.ts`:
```ts
export function formatMnt(n: number): string {
  return `${Math.round(n).toLocaleString("en-US")}₮`;
}
export function computeTotals(items: { unitPriceMnt: number; qty: number }[], feeMnt: number) {
  let subtotalMnt = 0;
  for (const i of items) {
    if (!Number.isInteger(i.unitPriceMnt) || !Number.isInteger(i.qty) || i.qty <= 0 || i.unitPriceMnt < 0)
      throw new Error("Буруу үнэ эсвэл тоо хэмжээ");
    subtotalMnt += i.unitPriceMnt * i.qty;
  }
  return { subtotalMnt, feeMnt, totalMnt: subtotalMnt + feeMnt };
}
```
`src/lib/phone.ts`:
```ts
export function normalizePhone(input: string): string | null {
  let d = input.replace(/[\s-]/g, "");
  if (d.startsWith("+976")) d = d.slice(4);
  else if (d.startsWith("976") && d.length === 11) d = d.slice(3);
  return /^[6789]\d{7}$/.test(d) ? d : null;
}
```

- [ ] **Step 4:** Run `npx vitest run tests/unit` → Expected: PASS

- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: money and phone helpers"`

---

### Task 3: Каталог ба хайлт

**Files:**
- Create: `src/server/catalog.ts`, `prisma/migrations/<ts>_trgm/migration.sql`, `tests/integration/catalog.test.ts`, `prisma/seed.ts`

**Interfaces:**
- Consumes: `prisma`.
- Produces: `listProducts(opts: {categorySlug?: string; q?: string; limit?: number}): Promise<Product[]>`, `getProductBySlug(slug: string): Promise<Product | null>`, `listCategories(): Promise<Category[]>`.

- [ ] **Step 1: Failing test**

```ts
import { describe, it, expect, beforeAll } from "vitest";
import { prisma } from "@/lib/db";
import { listProducts } from "@/server/catalog";
beforeAll(async () => {
  await prisma.$executeRawUnsafe('TRUNCATE "Category" CASCADE');
  const c = await prisma.category.create({ data: { name: "Хүнсний ногоо", slug: "nogoo" } });
  await prisma.product.createMany({ data: [
    { categoryId: c.id, name: "Байцаа", slug: "baitsaa", priceMnt: 1500, stock: 10 },
    { categoryId: c.id, name: "Лууван", slug: "luuvan", priceMnt: 1200, stock: 10 },
    { categoryId: c.id, name: "Нуугдсан", slug: "hidden", priceMnt: 1, stock: 10, active: false },
  ]});
});
describe("catalog", () => {
  it("hides inactive", async () => expect((await listProducts({})).map(p => p.slug).sort()).toEqual(["baitsaa", "luuvan"]));
  it("filters by category", async () => expect(await listProducts({ categorySlug: "nope" })).toEqual([]));
  it("tolerates a typo", async () => expect((await listProducts({ q: "байцаа" })).length).toBe(1));
  it("tolerates a 1-letter typo", async () => expect((await listProducts({ q: "байцаах" }))[0]?.slug).toBe("baitsaa"));
  it("empty query returns all", async () => expect((await listProducts({ q: "  " })).length).toBe(2));
});
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implementation**

Migration (`npx prisma migrate dev --create-only --name trgm`), SQL:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX product_name_trgm ON "Product" USING gin (name gin_trgm_ops);
```
`src/server/catalog.ts`:
```ts
import { prisma } from "@/lib/db";
import type { Product } from "@prisma/client";

export async function listProducts({ categorySlug, q, limit = 60 }: { categorySlug?: string; q?: string; limit?: number }): Promise<Product[]> {
  const term = q?.trim();
  if (term) {
    return prisma.$queryRaw<Product[]>`
      SELECT p.* FROM "Product" p JOIN "Category" c ON c.id = p."categoryId"
      WHERE p.active AND (${categorySlug ?? null}::text IS NULL OR c.slug = ${categorySlug ?? null})
        AND (p.name ILIKE ${"%" + term + "%"} OR similarity(p.name, ${term}) > 0.3)
      ORDER BY similarity(p.name, ${term}) DESC LIMIT ${limit}`;
  }
  return prisma.product.findMany({
    where: { active: true, ...(categorySlug ? { category: { slug: categorySlug } } : {}) },
    orderBy: { name: "asc" }, take: limit,
  });
}
export const getProductBySlug = (slug: string) => prisma.product.findFirst({ where: { slug, active: true } });
export const listCategories = () => prisma.category.findMany({ orderBy: { name: "asc" } });
```

- [ ] **Step 3b: Кирилл trigram-ыг шалгах тест** (locale буруу бол энд тэр дор илрнэ). `catalog.test.ts`-д нэм:
```ts
it("pg_trgm understands Cyrillic", async () => {
  const r = await prisma.$queryRaw<{ s: number }[]>`SELECT similarity('байцаа', 'байцаах')::float AS s`;
  expect(r[0].s).toBeGreaterThan(0.3);
});
```

- [ ] **Step 4:** `npx prisma migrate dev && npx vitest run tests/integration/catalog.test.ts` → PASS. Хэрэв typo тест унавал `similarity` босгыг 0.2 болгож тохируулна.

- [ ] **Step 5: Seed** `prisma/seed.ts` дотор 3 ангилал, 12 бараа үүсгэж, `package.json`-д `"prisma": {"seed": "tsx prisma/seed.ts"}` нэм. Commit: `git commit -am "feat: catalog and fuzzy search"`

---

### Task 4: OTP нэвтрэлт ба session

**Files:**
- Create: `src/server/sms/index.ts`, `src/server/auth/otp.ts`, `src/server/auth/session.ts`, `src/app/api/auth/request-otp/route.ts`, `src/app/api/auth/verify-otp/route.ts`, `tests/integration/otp.test.ts`

**Interfaces:**
- Consumes: `normalizePhone`, `prisma`.
- Produces: `SmsProvider { send(phone: string, text: string): Promise<void> }`, `getSms(): SmsProvider`, `requestOtp(phone: string, now?: Date): Promise<void>`, `verifyOtp(phone: string, code: string, now?: Date): Promise<User>` (алдаа: `"INVALID"|"EXPIRED"|"LOCKED"`), `createSession(userId: string): Promise<void>`, `getSessionUserId(): Promise<string | null>`.

- [ ] **Step 1: Failing tests**

```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { prisma } from "@/lib/db";
import * as sms from "@/server/sms";
import { requestOtp, verifyOtp } from "@/server/auth/otp";

let sent: string[] = [];
beforeEach(async () => {
  await prisma.otpCode.deleteMany(); await prisma.user.deleteMany(); sent = [];
  vi.spyOn(sms, "getSms").mockReturnValue({ send: async (_p, t) => { sent.push(t); } });
});
const last = () => sent.at(-1)!.match(/\d{6}/)![0];

it("verifies correct code and creates the user", async () => {
  await requestOtp("99112233");
  const u = await verifyOtp("99112233", last());
  expect(u.phone).toBe("99112233");
});
it("rejects wrong code", async () => {
  await requestOtp("99112233");
  await expect(verifyOtp("99112233", "000000")).rejects.toThrow("INVALID");
});
it("expires after 5 minutes", async () => {
  const t0 = new Date("2026-01-01T10:00:00Z");
  await requestOtp("99112233", t0);
  await expect(verifyOtp("99112233", last(), new Date(t0.getTime() + 6 * 60_000))).rejects.toThrow("EXPIRED");
});
it("locks after 5 wrong attempts even with the right code", async () => {
  await requestOtp("99112233"); const good = last();
  for (let i = 0; i < 5; i++) await verifyOtp("99112233", "000000").catch(() => {});
  await expect(verifyOtp("99112233", good)).rejects.toThrow("LOCKED");
});
it("code cannot be reused", async () => {
  await requestOtp("99112233"); const c = last();
  await verifyOtp("99112233", c);
  await expect(verifyOtp("99112233", c)).rejects.toThrow();
});
it("caps OTP requests at 10 per phone per 24h", async () => {
  const t0 = new Date("2026-01-01T00:00:00Z");
  for (let i = 0; i < 10; i++) await requestOtp("99112233", new Date(t0.getTime() + i * 61_000));
  await expect(requestOtp("99112233", new Date(t0.getTime() + 11 * 61_000))).rejects.toThrow("DAILY_LIMIT");
  await expect(requestOtp("99112233", new Date(t0.getTime() + 25 * 3600_000))).resolves.toBeUndefined();
});
it("limits resend to 1 per 60s", async () => {
  const t0 = new Date("2026-01-01T10:00:00Z");
  await requestOtp("99112233", t0);
  await expect(requestOtp("99112233", new Date(t0.getTime() + 10_000))).rejects.toThrow("TOO_SOON");
});
```

- [ ] **Step 2:** Run → FAIL.

- [ ] **Step 3: Implementation**

`src/server/sms/index.ts`:
```ts
export interface SmsProvider { send(phone: string, text: string): Promise<void>; }
const consoleSms: SmsProvider = { async send(phone, text) { console.log(`[SMS → ${phone}] ${text}`); } };
export function getSms(): SmsProvider { return consoleSms; } // бодит operator-ийн provider-ыг энд солино
```
`src/server/auth/otp.ts`:
```ts
import { createHash, randomInt } from "node:crypto";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import * as sms from "@/server/sms";

const hash = (phone: string, code: string) => createHash("sha256").update(`${phone}:${code}`).digest("hex");

export async function requestOtp(rawPhone: string, now = new Date()) {
  const phone = normalizePhone(rawPhone); if (!phone) throw new Error("INVALID_PHONE");
  const recent = await prisma.otpCode.findFirst({ where: { phone, createdAt: { gt: new Date(now.getTime() - 60_000) } } });
  if (recent) throw new Error("TOO_SOON");
  const day = await prisma.otpCode.count({ where: { phone, createdAt: { gt: new Date(now.getTime() - 24 * 3600_000) } } });
  if (day >= 10) throw new Error("DAILY_LIMIT");
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await prisma.otpCode.create({ data: { phone, codeHash: hash(phone, code), expiresAt: new Date(now.getTime() + 5 * 60_000), createdAt: now } });
  await sms.getSms().send(phone, `Everly: таны код ${code}`);
}
export async function verifyOtp(rawPhone: string, code: string, now = new Date()) {
  const phone = normalizePhone(rawPhone); if (!phone) throw new Error("INVALID_PHONE");
  const otp = await prisma.otpCode.findFirst({ where: { phone, consumedAt: null }, orderBy: { createdAt: "desc" } });
  if (!otp) throw new Error("INVALID");
  if (otp.attempts >= 5) throw new Error("LOCKED");
  if (otp.expiresAt < now) throw new Error("EXPIRED");
  if (otp.codeHash !== hash(phone, code)) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    throw new Error("INVALID");
  }
  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: now } });
  return prisma.user.upsert({ where: { phone }, update: {}, create: { phone } });
}
```
`src/server/auth/session.ts`:
```ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const key = () => new TextEncoder().encode(process.env.SESSION_SECRET!);
export async function createSession(userId: string) {
  const jwt = await new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(key());
  (await cookies()).set("session", jwt, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 30 * 86400 });
}
export async function getSessionUserId(): Promise<string | null> {
  const t = (await cookies()).get("session")?.value; if (!t) return null;
  try { return (await jwtVerify(t, key())).payload.sub ?? null; } catch { return null; }
}
```
Route handlers `request-otp` ба `verify-otp` нь body-г zod-оор шалгаад дээрх функцийг дуудаж, алдааг 400/429 болгон буцаана; `verify-otp` амжилттай бол `createSession(user.id)` дууддаг.

- [ ] **Step 4:** Run `npx vitest run tests/integration/otp.test.ts` → PASS

- [ ] **Step 5: Commit** `git commit -am "feat: phone OTP auth with lockout and sessions"`

---

### Task 5: Сагс

**Files:**
- Create: `src/server/cart.ts`, `tests/integration/cart.test.ts`

**Interfaces:**
- Consumes: `prisma`.
- Produces: `setCartItem(userId: string, productId: string, qty: number): Promise<void>` (qty 0 → устгана; qty > stock эсвэл `qty < 0` эсвэл бүхэл биш → `Error("INVALID_QTY")`/`"OUT_OF_STOCK"`), `getCart(userId: string): Promise<{items: {productId: string; name: string; unitPriceMnt: number; qty: number}[]}>`, `clearCart(userId: string): Promise<void>`.

- [ ] **Step 1: Failing tests** (setup: user, category, product stock=3)

```ts
it("adds, updates and removes", async () => {
  await setCartItem(u.id, p.id, 2); expect((await getCart(u.id)).items[0].qty).toBe(2);
  await setCartItem(u.id, p.id, 3); expect((await getCart(u.id)).items[0].qty).toBe(3);
  await setCartItem(u.id, p.id, 0); expect((await getCart(u.id)).items).toEqual([]);
});
it("rejects over stock", async () => await expect(setCartItem(u.id, p.id, 4)).rejects.toThrow("OUT_OF_STOCK"));
it("rejects negative and fractional", async () => {
  await expect(setCartItem(u.id, p.id, -1)).rejects.toThrow("INVALID_QTY");
  await expect(setCartItem(u.id, p.id, 1.5)).rejects.toThrow("INVALID_QTY");
});
it("rejects inactive product", async () => { await prisma.product.update({ where: { id: p.id }, data: { active: false } });
  await expect(setCartItem(u.id, p.id, 1)).rejects.toThrow("NOT_FOUND"); });
```

- [ ] **Step 2:** FAIL. **Step 3: Implementation**

```ts
import { prisma } from "@/lib/db";
export async function setCartItem(userId: string, productId: string, qty: number) {
  if (!Number.isInteger(qty) || qty < 0) throw new Error("INVALID_QTY");
  const product = await prisma.product.findFirst({ where: { id: productId, active: true } });
  if (!product) throw new Error("NOT_FOUND");
  if (qty > product.stock) throw new Error("OUT_OF_STOCK");
  const cart = await prisma.cart.upsert({ where: { userId }, update: {}, create: { userId } });
  if (qty === 0) { await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } }); return; }
  await prisma.cartItem.upsert({ where: { cartId_productId: { cartId: cart.id, productId } }, update: { qty }, create: { cartId: cart.id, productId, qty } });
}
export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
  return { items: (cart?.items ?? []).map(i => ({ productId: i.productId, name: i.product.name, unitPriceMnt: i.product.priceMnt, qty: i.qty })) };
}
export async function clearCart(userId: string) { await prisma.cartItem.deleteMany({ where: { cart: { userId } } }); }
```

- [ ] **Step 4:** PASS. **Step 5:** `git commit -am "feat: cart"`

*(Нэвтрээгүй хэрэглэгчийн сагс: UI талд `localStorage`-д хадгалж, нэвтэрсний дараа Task 11-д `setCartItem`-ээр нэгтгэнэ.)*

---

### Task 6: Хүргэлтийн бүс, цонх, capacity

**Files:**
- Create: `src/server/delivery.ts`, `tests/integration/delivery.test.ts`

**Interfaces:**
- Consumes: `prisma`.
- Produces: `listAvailableSlots(zoneId: string, now?: Date): Promise<DeliverySlot[]>` (ирээдүйн, `booked < capacity`), `reserveSlot(tx: Prisma.TransactionClient, slotId: string): Promise<void>` (дүүрсэн бол `Error("SLOT_FULL")`), `releaseSlot(tx, slotId): Promise<void>`.

- [ ] **Step 1: Failing tests**

```ts
it("lists only future non-full slots", async () => {
  // slot A: past, B: future cap 1 booked 1, C: future cap 2 booked 0
  const slots = await listAvailableSlots(zone.id, now);
  expect(slots.map(s => s.id)).toEqual([C.id]);
});
it("reserves up to capacity then throws SLOT_FULL", async () => {
  await prisma.$transaction(tx => reserveSlot(tx, C.id));
  await prisma.$transaction(tx => reserveSlot(tx, C.id));
  await expect(prisma.$transaction(tx => reserveSlot(tx, C.id))).rejects.toThrow("SLOT_FULL");
});
it("never exceeds capacity under concurrency", async () => {
  const results = await Promise.allSettled(Array.from({ length: 10 }, () => prisma.$transaction(tx => reserveSlot(tx, D.id)))); // D capacity 3
  expect(results.filter(r => r.status === "fulfilled").length).toBe(3);
  expect((await prisma.deliverySlot.findUnique({ where: { id: D.id } }))!.booked).toBe(3);
});
it("release decrements but not below zero", async () => { /* release on booked=0 → booked stays 0 */ });
```

- [ ] **Step 2:** FAIL. **Step 3: Implementation** (атомар UPDATE нь race-ээс хамгаална)

```ts
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
export const listAvailableSlots = (zoneId: string, now = new Date()) =>
  prisma.$queryRaw<import("@prisma/client").DeliverySlot[]>`
    SELECT * FROM "DeliverySlot" WHERE "zoneId" = ${zoneId} AND "startsAt" > ${now} AND booked < capacity ORDER BY "startsAt"`;
export async function reserveSlot(tx: Prisma.TransactionClient, slotId: string) {
  const n = await tx.$executeRaw`UPDATE "DeliverySlot" SET booked = booked + 1 WHERE id = ${slotId} AND booked < capacity`;
  if (n === 0) throw new Error("SLOT_FULL");
}
export async function releaseSlot(tx: Prisma.TransactionClient, slotId: string) {
  await tx.$executeRaw`UPDATE "DeliverySlot" SET booked = booked - 1 WHERE id = ${slotId} AND booked > 0`;
}
```

- [ ] **Step 4:** PASS. **Step 5:** `git commit -am "feat: delivery slots with atomic capacity"`

---

### Task 7: Захиалга үүсгэх, нөөц хасах, төлөвийн шилжилт

**Files:**
- Create: `src/server/orders.ts`, `tests/integration/orders.test.ts`, `tests/unit/order-status.test.ts`

**Interfaces:**
- Consumes: `getCart`, `clearCart`, `computeTotals`, `reserveSlot`, `releaseSlot`, `prisma`.
- Produces: `createOrder(input: {userId: string; zoneId: string; slotId: string; addressLine: string; lat?: number; lng?: number; substitution: "ALLOW"|"NONE"; paymentMethod: "QPAY"|"CASH"}): Promise<Order>`, `canTransition(from: OrderStatus, to: OrderStatus): boolean`, `transitionOrder(orderId: string, to: OrderStatus): Promise<Order>`, `cancelOrder(orderId: string): Promise<void>` (нөөц, цонхыг буцаана).
- Алдаа: `EMPTY_CART`, `OUT_OF_STOCK`, `SLOT_FULL`, `BELOW_MINIMUM`, `ZONE_INACTIVE`, `SLOT_ZONE_MISMATCH`.

- [ ] **Step 1: Failing tests**

`tests/unit/order-status.test.ts`:
```ts
import { it, expect } from "vitest";
import { canTransition } from "@/server/orders";
it("allows forward", () => { expect(canTransition("PENDING_PAYMENT", "CONFIRMED")).toBe(true); expect(canTransition("CONFIRMED", "PICKING")).toBe(true); });
it("blocks skipping/backwards", () => { expect(canTransition("CONFIRMED", "DELIVERED")).toBe(false); expect(canTransition("DELIVERED", "PICKING")).toBe(false); });
it("cancel allowed before delivery only", () => { expect(canTransition("PICKING", "CANCELLED")).toBe(true); expect(canTransition("DELIVERED", "CANCELLED")).toBe(false); });
```
`tests/integration/orders.test.ts` (setup: user, zone fee 3000 min 20000, slot cap 5, product price 5000 stock 10):
```ts
it("creates order, snapshots price, decrements stock, books slot, clears cart", async () => {
  await setCartItem(u.id, p.id, 5);
  const o = await createOrder(base);
  expect(o).toMatchObject({ subtotalMnt: 25000, feeMnt: 3000, totalMnt: 28000, status: "PENDING_PAYMENT" });
  await prisma.product.update({ where: { id: p.id }, data: { priceMnt: 9999 } });
  expect((await prisma.orderItem.findFirst({ where: { orderId: o.id } }))!.unitPriceMnt).toBe(5000);
  expect((await prisma.product.findUnique({ where: { id: p.id } }))!.stock).toBe(5);
  expect((await prisma.deliverySlot.findUnique({ where: { id: slot.id } }))!.booked).toBe(1);
  expect((await getCart(u.id)).items).toEqual([]);
});
it("EMPTY_CART", async () => await expect(createOrder(base)).rejects.toThrow("EMPTY_CART"));
it("BELOW_MINIMUM", async () => { await setCartItem(u.id, p.id, 1); await expect(createOrder(base)).rejects.toThrow("BELOW_MINIMUM"); });
it("last item goes to only one of two concurrent buyers", async () => {
  await prisma.product.update({ where: { id: p.id }, data: { stock: 4 } }); // 4*5000=20000 = min
  await setCartItem(u.id, p.id, 4); await setCartItem(u2.id, p.id, 4);
  const r = await Promise.allSettled([createOrder(base), createOrder({ ...base, userId: u2.id })]);
  expect(r.filter(x => x.status === "fulfilled")).toHaveLength(1);
  expect((r.find(x => x.status === "rejected") as PromiseRejectedResult).reason.message).toBe("OUT_OF_STOCK");
  expect((await prisma.product.findUnique({ where: { id: p.id } }))!.stock).toBe(0);
});
it("rolls back stock and slot when the order fails midway (slot full)", async () => { /* capacity 0 slot → SLOT_FULL, stock unchanged */ });
it("cancel restores stock and slot exactly once", async () => { /* cancelOrder ×2, stock restored once, booked back */ });
```

- [ ] **Step 2:** FAIL. **Step 3: Implementation**

```ts
import { prisma } from "@/lib/db";
import { computeTotals } from "@/lib/money";
import { getCart } from "@/server/cart";
import { reserveSlot, releaseSlot } from "@/server/delivery";
import type { OrderStatus } from "@prisma/client";

const NEXT: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ["CONFIRMED", "CANCELLED"], CONFIRMED: ["PICKING", "CANCELLED"],
  PICKING: ["OUT_FOR_DELIVERY", "CANCELLED"], OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [], CANCELLED: [],
};
export const canTransition = (from: OrderStatus, to: OrderStatus) => NEXT[from].includes(to);

export async function createOrder(i: { userId: string; zoneId: string; slotId: string; addressLine: string; lat?: number; lng?: number;
  substitution: "ALLOW" | "NONE"; paymentMethod: "QPAY" | "CASH" }) {
  const cart = await getCart(i.userId);
  if (cart.items.length === 0) throw new Error("EMPTY_CART");
  const zone = await prisma.deliveryZone.findUnique({ where: { id: i.zoneId } });
  if (!zone?.active) throw new Error("ZONE_INACTIVE");
  const totals = computeTotals(cart.items, zone.feeMnt);
  if (totals.subtotalMnt < zone.minOrderMnt) throw new Error("BELOW_MINIMUM");
  return prisma.$transaction(async (tx) => {
    const slot = await tx.deliverySlot.findUnique({ where: { id: i.slotId } });
    if (!slot || slot.zoneId !== i.zoneId) throw new Error("SLOT_ZONE_MISMATCH");
    await reserveSlot(tx, i.slotId);
    for (const it of cart.items) {
      const n = await tx.$executeRaw`UPDATE "Product" SET stock = stock - ${it.qty} WHERE id = ${it.productId} AND stock >= ${it.qty} AND active`;
      if (n === 0) throw new Error("OUT_OF_STOCK");
    }
    const order = await tx.order.create({ data: {
      userId: i.userId, slotId: i.slotId, addressLine: i.addressLine, lat: i.lat, lng: i.lng,
      substitution: i.substitution, paymentMethod: i.paymentMethod, ...totals,
      status: i.paymentMethod === "CASH" ? "CONFIRMED" : "PENDING_PAYMENT",
      items: { create: cart.items.map(c => ({ productId: c.productId, name: c.name, unitPriceMnt: c.unitPriceMnt, qty: c.qty })) },
    }});
    await tx.cartItem.deleteMany({ where: { cart: { userId: i.userId } } });
    return order;
  });
}
export async function transitionOrder(orderId: string, to: OrderStatus) {
  const o = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  if (!canTransition(o.status, to)) throw new Error("INVALID_TRANSITION");
  if (to === "CANCELLED") { await cancelOrder(orderId); return prisma.order.findUniqueOrThrow({ where: { id: orderId } }); }
  return prisma.order.update({ where: { id: orderId }, data: { status: to } });
}
export async function cancelOrder(orderId: string) {
  await prisma.$transaction(async (tx) => {
    const n = await tx.$executeRaw`UPDATE "Order" SET status = 'CANCELLED' WHERE id = ${orderId} AND status NOT IN ('CANCELLED','DELIVERED')`;
    if (n === 0) return; // аль хэдийн цуцлагдсан: давхар буцаахгүй
    const o = await tx.order.findUniqueOrThrow({ where: { id: orderId }, include: { items: true } });
    for (const it of o.items) await tx.$executeRaw`UPDATE "Product" SET stock = stock + ${it.qty} WHERE id = ${it.productId}`;
    await releaseSlot(tx, o.slotId);
  });
}
```

- [ ] **Step 4:** PASS (`npx vitest run tests/unit/order-status.test.ts tests/integration/orders.test.ts`). **Step 5:** `git commit -am "feat: order creation with atomic stock and slot, status machine"`

---

### Task 8: QPay төлбөр ба idempotent callback

**Files:**
- Create: `src/server/payments/provider.ts`, `mock.ts`, `qpay.ts`, `confirm.ts`, `src/app/api/payments/qpay/callback/route.ts`, `tests/integration/payments.test.ts`

**Interfaces:**
- Consumes: `prisma`, `transitionOrder`.
- Produces: `PaymentProvider { createInvoice(o: {orderId: string; amountMnt: number}): Promise<{externalId: string; qrText: string; deepLinks: {name: string; link: string}[]}>; isPaid(externalId: string): Promise<boolean> }`, `getPaymentProvider()`, `startPayment(orderId: string)`, `confirmPayment(externalId: string): Promise<"CONFIRMED"|"ALREADY"|"NOT_PAID">`.

- [ ] **Step 1: Failing tests** (mock provider-тай)

```ts
it("startPayment creates a PENDING payment with externalId", async () => {
  const r = await startPayment(order.id);
  const p = await prisma.payment.findFirstOrThrow({ where: { orderId: order.id } });
  expect(p).toMatchObject({ status: "PENDING", externalId: r.externalId, amountMnt: order.totalMnt });
});
it("confirm marks paid and confirms order", async () => {
  mock.markPaid(ext);
  expect(await confirmPayment(ext)).toBe("CONFIRMED");
  expect((await prisma.order.findUnique({ where: { id: order.id } }))!.status).toBe("CONFIRMED");
});
it("duplicate callback is a no-op", async () => {
  mock.markPaid(ext);
  await Promise.all([confirmPayment(ext), confirmPayment(ext)]);
  expect(await confirmPayment(ext)).toBe("ALREADY");
  expect(await prisma.payment.count({ where: { orderId: order.id, status: "PAID" } })).toBe(1);
});
it("NOT_PAID when provider says unpaid (spoofed callback)", async () => expect(await confirmPayment(ext)).toBe("NOT_PAID"));
it("payment for a cancelled order is not confirmed", async () => { await cancelOrder(order.id); mock.markPaid(ext); expect(await confirmPayment(ext)).toBe("ALREADY"); /* order stays CANCELLED */ });
```

- [ ] **Step 2:** FAIL. **Step 3: Implementation**

`provider.ts`:
```ts
export interface PaymentProvider {
  createInvoice(o: { orderId: string; amountMnt: number }): Promise<{ externalId: string; qrText: string; deepLinks: { name: string; link: string }[] }>;
  isPaid(externalId: string): Promise<boolean>;
}
import { MockPaymentProvider } from "./mock"; import { QPayProvider } from "./qpay";
let mock: MockPaymentProvider | undefined;
export function getPaymentProvider(): PaymentProvider {
  if (process.env.PAYMENT_PROVIDER === "qpay") return new QPayProvider();
  return (mock ??= new MockPaymentProvider());
}
```
`mock.ts`: `Map<string, boolean>`; `createInvoice` → `externalId = "mock_"+orderId`, `markPaid(id)`, `isPaid(id)`.

`qpay.ts` (QPay v2, `QPAY_BASE_URL` sandbox-д ажиллана):
```ts
export class QPayProvider implements PaymentProvider {
  private token?: { v: string; exp: number };
  private async auth() {
    if (this.token && this.token.exp > Date.now() + 30_000) return this.token.v;
    const basic = Buffer.from(`${process.env.QPAY_USERNAME}:${process.env.QPAY_PASSWORD}`).toString("base64");
    const r = await fetch(`${process.env.QPAY_BASE_URL}/auth/token`, { method: "POST", headers: { Authorization: `Basic ${basic}` } });
    if (!r.ok) throw new Error("QPAY_AUTH");
    const j = await r.json(); this.token = { v: j.access_token, exp: Date.now() + (j.expires_in ?? 3600) * 1000 }; return this.token.v;
  }
  async createInvoice({ orderId, amountMnt }: { orderId: string; amountMnt: number }) {
    const r = await fetch(`${process.env.QPAY_BASE_URL}/invoice`, { method: "POST",
      headers: { Authorization: `Bearer ${await this.auth()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ invoice_code: process.env.QPAY_INVOICE_CODE, sender_invoice_no: orderId, invoice_receiver_code: "terminal",
        invoice_description: `Everly захиалга ${orderId}`, amount: amountMnt,
        callback_url: `${process.env.APP_URL}/api/payments/qpay/callback?order=${orderId}` }) });
    if (!r.ok) throw new Error("QPAY_INVOICE");
    const j = await r.json(); return { externalId: j.invoice_id, qrText: j.qr_text, deepLinks: j.urls ?? [] };
  }
  async isPaid(externalId: string) {
    const r = await fetch(`${process.env.QPAY_BASE_URL}/payment/check`, { method: "POST",
      headers: { Authorization: `Bearer ${await this.auth()}`, "Content-Type": "application/json" },
      body: JSON.stringify({ object_type: "INVOICE", object_id: externalId, offset: { page_number: 1, page_limit: 100 } }) });
    if (!r.ok) throw new Error("QPAY_CHECK");
    return ((await r.json()).count ?? 0) > 0;
  }
}
```
(Бодит merchant эрх ирсний дараа sandbox-д хариуны талбаруудыг нягтлах; callback нь зөвхөн дохио, баталгаажуулалт нь үргэлж `isPaid`-аар.)

`confirm.ts`:
```ts
import { prisma } from "@/lib/db";
import { getPaymentProvider } from "./provider";
export async function startPayment(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
  const inv = await getPaymentProvider().createInvoice({ orderId, amountMnt: order.totalMnt });
  await prisma.payment.create({ data: { orderId, method: "QPAY", externalId: inv.externalId, amountMnt: order.totalMnt } });
  return inv;
}
export async function confirmPayment(externalId: string): Promise<"CONFIRMED" | "ALREADY" | "NOT_PAID"> {
  if (!(await getPaymentProvider().isPaid(externalId))) return "NOT_PAID";
  return prisma.$transaction(async (tx) => {
    const n = await tx.$executeRaw`UPDATE "Payment" SET status = 'PAID', "paidAt" = now() WHERE "externalId" = ${externalId} AND status = 'PENDING'`;
    if (n === 0) return "ALREADY" as const;
    const p = await tx.payment.findUniqueOrThrow({ where: { externalId } });
    await tx.$executeRaw`UPDATE "Order" SET status = 'CONFIRMED' WHERE id = ${p.orderId} AND status = 'PENDING_PAYMENT'`;
    return "CONFIRMED" as const;
  });
}
```
Callback route: `externalId`-г `order` query-ээс Payment хүснэгтээр хайж `confirmPayment` дуудаад 200 буцаана.

**Хугацаа хэтэрсэн төлөгдөөгүй захиалгыг цуцлах** (`src/server/payments/expire.ts`), spec §6:
```ts
import { prisma } from "@/lib/db";
import { cancelOrder } from "@/server/orders";
import { getPaymentProvider } from "./provider";
export async function expireUnpaidOrders(now = new Date(), ttlMinutes = 30): Promise<number> {
  const stale = await prisma.order.findMany({ where: { status: "PENDING_PAYMENT", paymentMethod: "QPAY",
    createdAt: { lt: new Date(now.getTime() - ttlMinutes * 60_000) } }, include: { payments: true } });
  let n = 0;
  for (const o of stale) {
    const paid = await Promise.all(o.payments.filter(p => p.externalId).map(p => getPaymentProvider().isPaid(p.externalId!)));
    if (paid.some(Boolean)) continue; // төлөгдсөн бол цуцлахгүй, callback/poll баталгаажуулна
    await cancelOrder(o.id); n++;
  }
  return n;
}
```
Route `src/app/api/cron/expire/route.ts`: `Authorization: Bearer ${CRON_SECRET}` шалгаад `expireUnpaidOrders()` дуудна (минут тутам хуваарьлагдсан cron-оор).
Тестүүд (`payments.test.ts`-д нэм): (1) 31 минутын настай, төлөгдөөгүй QPAY захиалга цуцлагдаж нөөц, цонх буцна; (2) 10 минутын настай захиалга хөндөгдөхгүй; (3) provider "төлөгдсөн" гэвэл 31 минутын настай ч цуцлагдахгүй; (4) CASH захиалга хөндөгдөхгүй; (5) хоёр дахин дуудахад нөөц давхар буцахгүй.

**Poll нөөц зам:** `GET /api/orders/[id]` нь хэрэглэгч өөрийнх нь захиалга биш бол `404` буцаана (IDOR); захиалга `PENDING_PAYMENT` бол `confirmPayment`-ийг нэг удаа оролдоод шинэ төлвийг буцаана (callback алдагдсан үед хамгаална). Тест: хэрэглэгч Б хэрэглэгч А-гийн захиалгын id-г дуудахад 404.

*Цуцлагдсан захиалгад төлбөр ирвэл:* `Payment` PAID болно, захиалга CANCELLED хэвээр үлдэнэ. Админ самбарт "төлөгдсөн боловч цуцлагдсан" жагсаалтаар гараар буцаалт хийнэ (Task 10).

- [ ] **Step 4:** PASS. **Step 5:** `git commit -am "feat: QPay payments with idempotent confirmation"`

---

### Task 9: Захиалгын төлөвийн SMS мэдэгдэл

**Files:**
- Create: `src/server/notify.ts`, `tests/integration/notify.test.ts`
- Modify: `src/server/orders.ts` (`transitionOrder`, `confirmPayment` төлөв өөрчлөх газраас `notifyStatus` дуудах)

**Interfaces:**
- Consumes: `getSms`, `prisma`.
- Produces: `notifyStatus(orderId: string): Promise<void>` (SMS алдаа гарсан ч захиалгыг унагаахгүй), `statusText(status: OrderStatus): string`.

- [ ] **Step 1: Failing tests**

```ts
it("sends SMS text for CONFIRMED to the buyer's phone", async () => {
  await notifyStatus(order.id);
  expect(sent[0]).toMatchObject({ phone: "99112233" }); expect(sent[0].text).toContain("баталгаажлаа");
});
it("swallows SMS failures", async () => {
  vi.spyOn(sms, "getSms").mockReturnValue({ send: async () => { throw new Error("down"); } });
  await expect(notifyStatus(order.id)).resolves.toBeUndefined();
});
it("every status has text", () => { for (const s of ["CONFIRMED","PICKING","OUT_FOR_DELIVERY","DELIVERED","CANCELLED"] as const) expect(statusText(s).length).toBeGreaterThan(5); });
```

- [ ] **Step 2:** FAIL. **Step 3:**

```ts
import { prisma } from "@/lib/db"; import * as sms from "@/server/sms"; import type { OrderStatus } from "@prisma/client";
const TEXT: Partial<Record<OrderStatus, string>> = {
  CONFIRMED: "Таны захиалга баталгаажлаа.", PICKING: "Таны захиалгыг бэлтгэж байна.",
  OUT_FOR_DELIVERY: "Таны захиалга хүргэлтэнд гарлаа.", DELIVERED: "Таны захиалга хүргэгдлээ. Баярлалаа!",
  CANCELLED: "Таны захиалга цуцлагдлаа.",
};
export const statusText = (s: OrderStatus) => TEXT[s] ?? "Захиалгын төлөв өөрчлөгдлөө.";
export async function notifyStatus(orderId: string) {
  try {
    const o = await prisma.order.findUniqueOrThrow({ where: { id: orderId }, include: { user: true } });
    await sms.getSms().send(o.user.phone, `Everly: ${statusText(o.status)}`);
  } catch (e) { console.error("notifyStatus failed", e); }
}
```
`transitionOrder` ба `confirmPayment` (`CONFIRMED` үед) төгсгөлд `await notifyStatus(orderId)` нэм.

- [ ] **Step 4:** PASS. **Step 5:** `git commit -am "feat: SMS status notifications"`

---

### Task 10: Админ самбар

**Files:**
- Create: `src/server/admin/auth.ts`, `src/app/admin/login/page.tsx`, `src/app/admin/(panel)/layout.tsx`, `.../products/page.tsx`, `.../orders/page.tsx`, `.../orders/[id]/page.tsx`, `.../zones/page.tsx`, `src/server/admin/actions.ts`, `tests/integration/admin.test.ts`, `scripts/create-admin.ts`

**Interfaces:**
- Consumes: `transitionOrder`, `prisma`.
- Produces: `requireStaff(role?: "ADMIN"): Promise<StaffUser>` (нэвтрээгүй бол `/admin/login` руу redirect), server actions `upsertProduct`, `setStock`, `updateOrderStatus`, `upsertZone`, `createSlots`.

- [ ] **Step 1: Failing tests** (server action-уудын цэвэр логик)

```ts
it("setStock rejects negative", async () => await expect(setStock(p.id, -1)).rejects.toThrow("INVALID_STOCK"));
it("upsertProduct rejects non-integer price", async () => await expect(upsertProduct({ ...valid, priceMnt: 10.5 })).rejects.toThrow());
it("createSlots generates N slots per day with capacity", async () => {
  await createSlots({ zoneId: z.id, date: "2030-01-05", windows: [["10:00","12:00"],["12:00","14:00"]], capacity: 8 });
  expect(await prisma.deliverySlot.count({ where: { zoneId: z.id } })).toBe(2);
});
it("createSlots is idempotent for same window", async () => { /* дахин дуудахад давхардахгүй (unique zoneId+startsAt) */ });
it("STAFF cannot manage zones", async () => await expect(upsertZone(staffCtx, valid)).rejects.toThrow("FORBIDDEN"));
```

- [ ] **Step 1b: Staff нэвтрэлтийн тест** `tests/integration/staff-auth.test.ts`:
```ts
import { it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/server/admin/auth";
it("verifies the right password only", async () => {
  const h = await hashPassword("s3cret-pass");
  expect(await verifyPassword("s3cret-pass", h)).toBe(true);
  expect(await verifyPassword("wrong", h)).toBe(false);
});
it("salts: same password gives different hashes", async () => expect(await hashPassword("a")).not.toBe(await hashPassword("a")));
it("rejects malformed stored hash without throwing", async () => expect(await verifyPassword("a", "garbage")).toBe(false));
```
`hashPassword`/`verifyPassword`: `scrypt` + 16 byte random salt, формат `scrypt$<saltHex>$<hashHex>`, `timingSafeEqual`-ээр харьцуулна. Нэвтрэх оролдлого email тутамд 5 удаа/15 минут (`StaffUser`-т `failedLogins`, `lockedUntil` талбар нэм).

- [ ] **Step 2:** FAIL. **Step 3: Implementation**

- `scripts/create-admin.ts`: `bcrypt`-гүйгээр `node:crypto.scrypt`-ээр hash хийж `StaffUser` үүсгэнэ. Admin session нь `adminSession` cookie (Task 4-ийн JWT-тэй ижил арга, өөр cookie нэр, `sub = staffId`, `role` claim).
- Хуудсууд: бараа жагсаалт + inline засвар (үнэ, нөөц, идэвхтэй); захиалга жагсаалт (төлөвөөр шүүх), дэлгэрэнгүй дээр бараа, хаяг, орлуулалтын сонголт, "дараагийн төлөв" товч (зөвхөн `canTransition` зөвшөөрсөн төлөв харагдана); бүс/цонх удирдах.
- Төлөгдсөн боловч цуцлагдсан захиалгын тусгай жагсаалт (Task 8-ын тэмдэглэл).
- `createSlots`: `windows` бүрээр `DeliverySlot.createMany({ skipDuplicates: true })`.
- Бүх action эхлээд `requireStaff()` дуудаж, zod-оор оролтыг шалгана.

- [ ] **Step 4:** PASS. **Step 5:** `git commit -am "feat: admin panel for catalog, orders, zones and slots"`

---

### Task 11: Frontend-ийг backend-тэй холбох (HTTP adapter ба contract тест)

**Files:**
- Create: `src/app/api/**/route.ts` (доорх жагсаалт), `src/data/http-api.ts`, `tests/contract/api.contract.ts`, `tests/contract/mock.test.ts`, `tests/contract/http.test.ts`
- Modify: `src/data/api.ts` (`export const api: Api = process.env.NEXT_PUBLIC_API_MODE === "http" ? httpApi : mockApi;`)

**Interfaces:**
- Consumes: frontend plan-ийн `Api` интерфейс (`2026-10-12-everly-frontend.md` Task 3), энэ plan-ийн Task 3–10-ын server функцууд.
- Produces: `httpApi: Api`; route-ууд:
  `GET /api/categories`, `GET /api/products?categorySlug&q`, `GET /api/products/[slug]`, `POST /api/products/by-ids`, `GET /api/zones`, `GET /api/zones/[id]/slots`, `POST /api/auth/request-otp`, `POST /api/auth/verify-otp`, `GET /api/orders`, `POST /api/orders`, `GET /api/orders/[id]`, `POST /api/orders/[id]/pay-mock` (зөвхөн `PAYMENT_PROVIDER=mock`), `GET|POST /api/cart`.

- [ ] **Step 1: Contract тест.** Mock болон http хэрэгжилт хоёулаа ижил дүрмийг биелүүлнэ.

`tests/contract/api.contract.ts`:
```ts
import { describe, it, expect } from "vitest";
import type { Api } from "@/data/api";
export function apiContract(name: string, make: () => Promise<{ api: Api; login: (phone: string) => Promise<void> }>) {
  describe(`Api contract: ${name}`, () => {
    it("lists categories and tolerant product search", async () => {
      const { api } = await make();
      expect((await api.listCategories()).length).toBeGreaterThan(0);
      expect(await api.listProducts({ q: "zzzzqq" })).toEqual([]);
    });
    it("rejects bad phone and wrong OTP with the same error codes", async () => {
      const { api } = await make();
      await expect(api.requestOtp("123")).rejects.toThrow("INVALID_PHONE");
      await expect(api.verifyOtp("99112233", "000000")).rejects.toThrow("INVALID");
    });
    it("order lifecycle: create, pay, scoped reads", async () => {
      const { api, login } = await make(); await login("99112233");
      const [p] = (await api.listProducts({})).filter(p => p.stock >= 5 && p.priceMnt * 5 >= 20000);
      const zone = (await api.listZones())[0]; const slot = (await api.listSlots(zone.id))[0];
      const o = await api.createOrder({ phone: "99112233", lines: [{ productId: p.id, qty: 5 }], zoneId: zone.id, slotId: slot.id,
        addressLine: "БЗД", substitution: "NONE", paymentMethod: "QPAY" });
      expect(o.status).toBe("PENDING_PAYMENT");
      expect((await api.payOrderMock(o.id)).status).toBe("CONFIRMED");
      expect(await api.getOrder(o.id, "88000000")).toBeNull();
    });
    it("error codes: empty cart, qty over stock", async () => {
      const { api, login } = await make(); await login("99112233");
      const zone = (await api.listZones())[0]; const slot = (await api.listSlots(zone.id))[0];
      const base = { phone: "99112233", zoneId: zone.id, slotId: slot.id, addressLine: "x", substitution: "NONE" as const, paymentMethod: "CASH" as const };
      await expect(api.createOrder({ ...base, lines: [] })).rejects.toThrow("EMPTY_CART");
      const [p] = await api.listProducts({});
      await expect(api.createOrder({ ...base, lines: [{ productId: p.id, qty: 99999 }] })).rejects.toThrow(/OUT_OF_STOCK/);
    });
  });
}
```
`mock.test.ts`: `apiContract("mock", async () => ({ api: mockApi, login: async () => {} }))`. `http.test.ts`: `apiContract("http", ...)`. Next серверийг тестийн DB-тэй (`PAYMENT_PROVIDER=mock`) ажиллуулж, `httpApi`-г `fetch` + cookie jar-аар дууддаг; `login` нь OTP-г `/api/test/last-sms`-аас уншина.

- [ ] **Step 2:** `npx vitest run tests/contract` → mock PASS, http FAIL (route, adapter байхгүй).

- [ ] **Step 3: Route-ууд ба adapter.** Route бүр: zod-оор оролтыг шалгах, Task 3–10-ын server функцийг дуудах, алдааг `{ error: "<CODE>" }` + зохих статус (400/401/404/409/429) болгох. `httpApi` нь `{ error }`-ийг `throw new Error(code)` болгож буцаана (frontend-ийн алдааны map-тай нэг кодтой). `phone` талбарыг клиентээс **итгэхгүй**: сервер session-ээс авна (`getSessionUserId`), `createOrder` дотор клиентийн `phone` талбарыг үл тооцно. `GET /api/orders/[id]` нь IDOR-ыг Task 8-ын дагуу шалгана.

- [ ] **Step 4: Frontend-ийн нэвтрэлт.** `AuthContext` нь `NEXT_PUBLIC_API_MODE=http` үед `verifyOtp` хариунд cookie тохируулагдсан гэж үзэж, `localStorage["everly.session"]`-д зөвхөн `phone`-ыг (UI-д харуулахад) хадгална; бодит эрхийг сервер session шийднэ. Сагс: нэвтэрсний дараа `POST /api/cart`-аар локал сагсыг нэгтгэнэ (`mergeCarts`, сервер талд stock-оор хязгаарлана).

- [ ] **Step 5:** `NEXT_PUBLIC_API_MODE=http npx vitest run tests/contract && npx vitest run` → бүгд PASS.
- [ ] **Step 6:** Commit `git commit -am "feat: HTTP api adapter, routes and shared contract tests"`

---

### Task 12: End-to-end тест ба нээхийн өмнөх шалгалт

> Frontend plan-ийн Task 10-ын e2e-г `NEXT_PUBLIC_API_MODE=http` горимд, бодит DB-тэй дахин ажиллуулж, доорх нэмэлт тестүүдийг бичнэ.

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/purchase.spec.ts`, `tests/e2e/admin.spec.ts`, `README.md`

- [ ] **Step 1: Failing e2e** `tests/e2e/purchase.spec.ts` (`PAYMENT_PROVIDER=mock`, console SMS-ийг `/api/test/last-sms` dev-only endpoint-оор уншина; production-д endpoint 404):

```ts
import { test, expect } from "@playwright/test";
test("buyer completes a cash order and admin delivers it", async ({ page, browser }) => {
  await page.goto("/"); await page.getByRole("link", { name: /Байцаа/ }).click();
  await page.getByRole("button", { name: "Сагсанд нэмэх" }).click();
  await page.goto("/cart"); await page.getByRole("link", { name: "Захиалах" }).click();
  await page.getByLabel("Утасны дугаар").fill("99112233"); await page.getByRole("button", { name: "Код илгээх" }).click();
  const code = await (await page.request.get("/api/test/last-sms")).text();
  await page.getByLabel("Код").fill(code.match(/\d{6}/)![0]); await page.getByRole("button", { name: "Нэвтрэх" }).click();
  await page.getByLabel("Хаяг").fill("БЗД, 3-р хороо, 12-р байр");
  await page.getByRole("radio").first().check();
  await page.getByLabel("Бэлнээр төлөх").check();
  await page.getByRole("button", { name: "Захиалга баталгаажуулах" }).click();
  await expect(page.getByText("Захиалга баталгаажлаа")).toBeVisible();
  const admin = await (await browser.newContext()).newPage();
  await admin.goto("/admin/login"); /* нэвтэрч, захиалгыг PICKING → OUT_FOR_DELIVERY → DELIVERED болгох */
  await expect(admin.getByText("Хүргэгдсэн")).toBeVisible();
});
test("QPay flow confirms order after callback", async ({ page, request }) => { /* mock markPaid → callback → "Захиалга баталгаажлаа" */ });
test("full slot is not selectable", async ({ page }) => { /* capacity=0 slot disabled */ });
```

- [ ] **Step 2:** `npx playwright test` → FAIL (урсгал дутуу эсвэл test endpoint байхгүй).
- [ ] **Step 3:** Дутуу хэсгийг засч, `/api/test/last-sms` (зөвхөн `NODE_ENV !== "production"`) нэм.
- [ ] **Step 4:** `npx playwright test && npx vitest run` → бүгд PASS.
- [ ] **Step 5: Нээхийн өмнөх checklist-ийг `README.md`-д бичих:** QPay production credential, SMS provider солих (`getSms`), `SESSION_SECRET`, `PAYMENT_PROVIDER=qpay`, DB backup, HTTPS, анхны админ (`tsx scripts/create-admin.ts`), барааны каталог оруулах.
- [ ] **Step 6:** `git commit -am "test: e2e purchase flow and launch checklist"`

---

## Self-Review (spec-тэй тулгасан)

| Spec хэсэг | Task |
|---|---|
| Каталог, `vendor_id` | 1, 3 |
| Хайлт (үсгийн алдаа) | 3 |
| Сагс (нэвтрээгүй үед ч) | 5, 11 |
| Checkout, хаяг, pin | 7, 11 |
| Хүргэлтийн бүс, цонх, capacity, хураамж, min | 6, 7, 10 |
| Орлуулалт (захиалгын түвшний сонголт) | 1 (`substitution`), 7, 11; админ харна: 10 |
| Төлбөр: QPay + бэлэн | 8, 7 |
| Бүртгэл OTP, хаяг, түүх, дахин захиалах | 4, 11 |
| Захиалгын төлөв ба SMS | 7, 9 |
| Админ самбар | 10 |
| Алдааны зохицуулалт (callback, нөөц, цонх, SMS) | 8, 7, 6, 9 |
| Тест (unit, integration, e2e) | бүх task, 12 |

**Хүрээнээс гадуур тэмдэглэл:** SocialPay/Pocket MVP-д ороогүй (QPay дотор банкны апп-ууд аль хэдийн багтдаг тул). Жингээр зарах барааг ажилтан гараар засна (spec §5), шинэ UI хэрэггүй.

**Тохиромжгүй байж болох зүйл:** Task 11 нь UI тул Task 1–10-аас зөөлөн (бүх JSX-г энд бичээгүй), гэхдээ бүх тооцоолол, дүрэм нь тестлэгдсэн server модулиудад байгаа. Task 8 дахь QPay хариуны талбарууд sandbox эрх олдсоны дараа баталгаажна.
