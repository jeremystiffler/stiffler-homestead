export const CARD_PROCESSING_FEE_BPS = 300;

export function cardProcessingFeeCents(subtotalCents: number) {
  if (!Number.isSafeInteger(subtotalCents) || subtotalCents < 0) {
    throw new Error("Subtotal must be a non-negative whole number of cents.");
  }

  return Math.round((subtotalCents * CARD_PROCESSING_FEE_BPS) / 10_000);
}

export function formatUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
