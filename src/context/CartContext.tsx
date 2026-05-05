import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "../types";

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: Product["id"]) => void;
  updateQuantity: (productId: Product["id"], quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const storageKey = "parasat-cart";

const isCartItem = (item: unknown): item is CartItem => {
  if (!item || typeof item !== "object") {
    return false;
  }

  const candidate = item as CartItem;
  return (
    typeof candidate.quantity === "number" &&
    candidate.quantity > 0 &&
    Boolean(candidate.product) &&
    typeof candidate.product.id === "number" &&
    typeof candidate.product.name === "string"
  );
};

const readInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    window.localStorage.removeItem(storageKey);
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Корзина остается рабочей в памяти, даже если localStorage недоступен.
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const addToCart = (product: Product) => {
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        return [...current, { product, quantity: 1 }];
      });
    };

    const removeFromCart = (productId: Product["id"]) => {
      setItems((current) => current.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: Product["id"], quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    };

    const clearCart = () => setItems([]);

    return {
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
