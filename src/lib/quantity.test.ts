import { describe, expect, it } from "vitest";
import { isAllowedOrderQuantity } from "./halfOrders";

describe("per-product half-order eligibility", () => {
  it("allows whole quantities for every product", () => {
    expect(isAllowedOrderQuantity({ allow_half_orders: false }, 1)).toBe(true);
    expect(isAllowedOrderQuantity({}, 2)).toBe(true);
  });

  it("rejects half quantities unless the product explicitly opts in", () => {
    expect(isAllowedOrderQuantity({ allow_half_orders: false }, 0.5)).toBe(false);
    expect(isAllowedOrderQuantity({ allow_half_orders: true }, 0.5)).toBe(true);
  });
});