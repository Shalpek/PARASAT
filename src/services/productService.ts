import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { categories, products as mockProducts } from "../data/products";
import { db } from "../firebase/firebase";
import type { Category, Product, ProductInput } from "../types";

export type ProductFilters = {
  query?: string;
  category?: Category | "Все";
};

const productsCollection = "products";

const delay = <T>(value: T) =>
  new Promise<T>((resolve) => {
    globalThis.setTimeout(() => resolve(value), 120);
  });

const formatDate = (value: unknown): string => {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString().slice(0, 10);
  }

  return String(value);
};

const mapProduct = (id: string, data: Record<string, unknown>): Product => ({
  id: String(data.id ?? id),
  name: String(data.name ?? ""),
  category: data.category as Category,
  description: String(data.description ?? ""),
  purpose: String(data.purpose ?? ""),
  price: String(data.price ?? "Уточнить цену"),
  image: String(data.image ?? "/products/kitchen.svg"),
  packageSize: String(data.packageSize ?? ""),
  inStock: Boolean(data.inStock),
  createdAt: formatDate(data.createdAt),
  updatedAt: formatDate(data.updatedAt),
});

const copyProduct = (product: Product): Product => ({ ...product });

const filterProducts = (products: Product[], filters: ProductFilters = {}) => {
  const normalizedQuery = filters.query?.trim().toLowerCase() ?? "";
  const category = filters.category ?? "Все";

  return products.filter((product) => {
    const matchesCategory = category === "Все" || product.category === category;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
};

const getMockProducts = () => mockProducts.map(copyProduct);

export const productService = {
  async getCategories(): Promise<Category[]> {
    return delay([...categories]);
  },

  async getProducts(): Promise<Product[]> {
    if (!db) {
      return delay(getMockProducts());
    }

    const snapshot = await getDocs(
      query(collection(db, productsCollection), orderBy("createdAt", "desc")),
    );

    return snapshot.docs.map((productDoc) => mapProduct(productDoc.id, productDoc.data()));
  },

  async getProductById(id: string): Promise<Product | null> {
    if (!db) {
      const product = mockProducts.find((item) => item.id === id);
      return delay(product ? copyProduct(product) : null);
    }

    const productDoc = await getDoc(doc(db, productsCollection, id));
    return productDoc.exists() ? mapProduct(productDoc.id, productDoc.data()) : null;
  },

  async getPopularProducts(limit = 4): Promise<Product[]> {
    const products = await this.getProducts();
    return products.slice(0, limit);
  },

  async getRelatedProducts(
    category: Category,
    excludeProductId: string,
    limit = 4,
  ): Promise<Product[]> {
    const products = await this.getProducts();
    return products
      .filter((item) => item.category === category && item.id !== excludeProductId)
      .slice(0, limit);
  },

  async searchProducts(filters: ProductFilters = {}): Promise<Product[]> {
    const products = await this.getProducts();
    return filterProducts(products, filters);
  },

  async createProduct(input: ProductInput): Promise<Product> {
    if (!db) {
      const product: Product = {
        ...input,
        id: String(Date.now()),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      mockProducts.unshift(product);
      return delay(copyProduct(product));
    }

    const productRef = await addDoc(collection(db, productsCollection), {
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await updateDoc(productRef, { id: productRef.id });

    return {
      ...input,
      id: productRef.id,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  },

  async updateProduct(id: string, input: ProductInput): Promise<Product> {
    if (!db) {
      const updatedProduct: Product = {
        ...input,
        id,
        createdAt:
          mockProducts.find((product) => product.id === id)?.createdAt ??
          new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };

      const index = mockProducts.findIndex((product) => product.id === id);
      if (index >= 0) {
        mockProducts[index] = updatedProduct;
      }

      return delay(copyProduct(updatedProduct));
    }

    await updateDoc(doc(db, productsCollection, id), {
      ...input,
      updatedAt: serverTimestamp(),
    });

    const updatedProduct = await this.getProductById(id);
    if (!updatedProduct) {
      throw new Error("Товар не найден.");
    }

    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    if (!db) {
      const index = mockProducts.findIndex((product) => product.id === id);
      if (index >= 0) {
        mockProducts.splice(index, 1);
      }
      return delay(undefined);
    }

    await deleteDoc(doc(db, productsCollection, id));
  },
};
