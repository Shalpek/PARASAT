import { categories, products } from "../data/products";
import type { Category, Product } from "../types";

export type ProductFilters = {
  query?: string;
  category?: Category | "Все";
};

const delay = <T>(value: T) =>
  new Promise<T>((resolve) => {
    globalThis.setTimeout(() => resolve(value), 120);
  });

const copyProduct = (product: Product): Product => ({ ...product });

export const productService = {
  async getCategories(): Promise<Category[]> {
    return delay([...categories]);
  },

  async getProducts(): Promise<Product[]> {
    return delay(products.map(copyProduct));
  },

  async getProductById(id: number): Promise<Product | null> {
    const product = products.find((item) => item.id === id);
    return delay(product ? copyProduct(product) : null);
  },

  async getPopularProducts(limit = 4): Promise<Product[]> {
    return delay(products.slice(0, limit).map(copyProduct));
  },

  async getRelatedProducts(
    category: Category,
    excludeProductId: number,
    limit = 4,
  ): Promise<Product[]> {
    return delay(
      products
        .filter((item) => item.category === category && item.id !== excludeProductId)
        .slice(0, limit)
        .map(copyProduct),
    );
  },

  async searchProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const normalizedQuery = filters.query?.trim().toLowerCase() ?? "";
    const category = filters.category ?? "Все";

    const filteredProducts = products.filter((product) => {
      const matchesCategory = category === "Все" || product.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return delay(filteredProducts.map(copyProduct));
  },
};
