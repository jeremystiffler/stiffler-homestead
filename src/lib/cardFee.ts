export const CARD_PROCESSING_FEE_BPS = 290;
export const CARD_PROCESSING_FIXED_FEE_CENTS = 30;

export function cardProcessingFeeCents(subtotalCents: number) {
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents < 0) {
    throw new Error("Subtotal must be a non-negative whole number of cents.");
  }
  if (subtotalCents === 0) return 0;

  return Math.round((subtotalCents * CARD_PROCESSING_FEE_BPS) / 10_000) + CARD_PROCESSING_FIXED_FEE_CENTS;
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
