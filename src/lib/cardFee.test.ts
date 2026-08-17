import { describe, expect, it } from "vitest";
import { CARD_PROCESSING_FEE_BPS, cardProcessingFeeCents } from "./cardFee";

describe("card processing fee", () => {
  it("uses the disclosed 3% fee and rounds to the nearest cent", () => {
    expect(CARD_PROCESSING_FEE_BPS).toBe(300);
    expect(cardProcessingFeeCents(2_500)).toBe(75);
    expect(cardProcessingFeeCents(1_499)).toBe(45);
  });

  it("does not create a fee for a zero-dollar subtotal", () => {
    expect(cardProcessingFeeCents(0)).toBe(0);
  });
});
