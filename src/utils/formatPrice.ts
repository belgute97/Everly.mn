// 18000 → "18,000₮"
export function formatPrice(price: number): string {
  return `${price.toLocaleString('en-US')}₮`
}
