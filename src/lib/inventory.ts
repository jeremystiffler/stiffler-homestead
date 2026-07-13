type ProductInventoryShape = {
  infinite_quantity?: boolean | null;
  infiniteQuantity?: boolean | null;
};

export function isInfiniteQuantityProduct(product: ProductInventoryShape) {
  return Boolean(product.infinite_quantity || product.infiniteQuantity);
}
