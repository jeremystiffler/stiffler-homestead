type ProductInventoryShape = {
  infinite_quantity?: boolean | null;
  infiniteQuantity?: boolean | null;
  slug?: string | null;
  category?: string | null;
  name?: string | null;
};

export function isInfiniteQuantityProduct(product: ProductInventoryShape) {
  const slug = String(product.slug || "").toLowerCase();
  const category = String(product.category || "").toLowerCase();
  const name = String(product.name || "").toLowerCase();

  return Boolean(product.infinite_quantity || product.infiniteQuantity) || slug === "farm-fresh-eggs" || category === "eggs" || name.includes("egg");
}
