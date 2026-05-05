import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { orders as mockOrders } from "../data/orders";
import { db } from "../firebase/firebase";
import type { CreateOrderInput, Order, OrderStatus } from "../types";

const ordersCollection = "orders";

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

const mapOrder = (id: string, data: Record<string, unknown>): Order => ({
  id: String(data.id ?? id),
  customerName: String(data.customerName ?? ""),
  phone: String(data.phone ?? ""),
  city: String(data.city ?? ""),
  companyName: String(data.companyName ?? ""),
  comment: String(data.comment ?? ""),
  status: (data.status ?? "new") as OrderStatus,
  createdAt: formatDate(data.createdAt),
  updatedAt: formatDate(data.updatedAt),
  items: Array.isArray(data.items)
    ? data.items.map((item) => ({
        productName: String((item as { productName?: unknown }).productName ?? ""),
        quantity: Number((item as { quantity?: unknown }).quantity ?? 1),
      }))
    : [],
});

const copyOrder = (order: Order): Order => ({
  ...order,
  items: order.items.map((item) => ({ ...item })),
});

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (!db) {
      return delay(mockOrders.map(copyOrder));
    }

    const snapshot = await getDocs(
      query(collection(db, ordersCollection), orderBy("createdAt", "desc")),
    );

    return snapshot.docs.map((orderDoc) => mapOrder(orderDoc.id, orderDoc.data()));
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (input.items.length === 0) {
      throw new Error("Нельзя создать заявку без товаров.");
    }

    if (!db) {
      const order: Order = {
        ...input,
        id: String(Date.now()),
        status: "new",
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        items: input.items.map((item) => ({ ...item })),
      };

      mockOrders.unshift(order);
      return delay(copyOrder(order));
    }

    const orderRef = await addDoc(collection(db, ordersCollection), {
      ...input,
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await updateDoc(orderRef, { id: orderRef.id });

    return {
      ...input,
      id: orderRef.id,
      status: "new",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      items: input.items.map((item) => ({ ...item })),
    };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    if (!db) {
      const order = mockOrders.find((item) => item.id === orderId);

      if (!order) {
        throw new Error("Заявка не найдена.");
      }

      const updatedOrder: Order = {
        ...order,
        status,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      const index = mockOrders.findIndex((item) => item.id === orderId);
      mockOrders[index] = updatedOrder;

      return delay(copyOrder(updatedOrder));
    }

    await updateDoc(doc(db, ordersCollection, orderId), {
      status,
      updatedAt: serverTimestamp(),
    });

    const orders = await this.getOrders();
    const updatedOrder = orders.find((order) => order.id === orderId);
    if (!updatedOrder) {
      throw new Error("Заявка не найдена.");
    }

    return updatedOrder;
  },
};
