import { describe, expect, it } from "vitest";
import { CARD_PROCESSING_FEE_BPS, CARD_PROCESSING_FIXED_FEE_CENTS, cardProcessingFeeCents } from "./cardFee";

describe("card processing fee", () => {
  it("uses the disclosed 2.9% + 30¢ fee and rounds the percentage to the nearest cent", () => {
    expect(CARD_PROCESSING_FEE_BPS).toBe(290);
    expect(CARD_PROCESSING_FIXED_FEE_CENTS).toBe(30);
    expect(cardProcessingFeeCents(2_500)).toBe(103);
    expect(cardProcessingFeeCents(1_499)).toBe(73);
  });

  it("does not create a fee for a zero-dollar subtotal", () => {
    expect(cardProcessingFeeCents(0)).toBe(0);
  });
});
