import { INITIAL_PRODUCTS } from "../data/products.data";
import { Product } from "../types/product.types";

/**
 * Normalizes any slug string into a clean URL path component.
 * e.g. "/products/temprador-woocommerce-landing-page-theme" -> "temprador-woocommerce-landing-page-theme"
 */
export function getCleanSlug(slugOrPath: string): string {
  return slugOrPath
    .replace(/^\/?products\//, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

/**
 * Returns the canonical route path for a product detail page.
 */
export function getProductUrl(slugOrPath: string): string {
  const clean = getCleanSlug(slugOrPath);
  return `/products/${clean}`;
}

/**
 * Finds a product by slug or id from the catalog.
 */
export function findProductBySlug(slug: string, products: Product[] = INITIAL_PRODUCTS): Product | undefined {
  const cleanTarget = getCleanSlug(decodeURIComponent(slug));
  return products.find((p) => {
    const cleanCurrent = getCleanSlug(p.slug);
    return cleanCurrent === cleanTarget || p.id === cleanTarget;
  });
}

/**
 * Retrieves related products in the same category, excluding the active product.
 */
export function getRelatedProducts(activeProduct: Product, limit = 4, products: Product[] = INITIAL_PRODUCTS): Product[] {
  return products
    .filter((p) => p.id !== activeProduct.id && (p.category === activeProduct.category || p.author.name === activeProduct.author.name))
    .concat(products.filter((p) => p.id !== activeProduct.id && p.category !== activeProduct.category))
    .slice(0, limit);
}
