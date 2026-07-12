export function formatPrice(cents: number) {
  if (!cents || cents <= 0) return "Contact for pricing";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
