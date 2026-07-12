import { PRODUCTS } from "@/content/products";

export function getAllProducts() {
  return PRODUCTS;
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((product) => product.featured);
}

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug) || null;
}

export function isProductOrderable(product: { status: string; availableQuantity: number }) {
  return (product.status === "available" || product.status === "preorder") && product.availableQuantity > 0;
}
