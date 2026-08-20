export function parseOrderQuantity(value: unknown, fallback = 1) {
  const parsed = Number(value ?? fallback);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0.5, Math.round(parsed * 2) / 2);
}

export function formatQuantity(value: number) {
  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0$/, "");
}

export function isWholeQuantity(value: number) {
  return Number.isInteger(value);
}