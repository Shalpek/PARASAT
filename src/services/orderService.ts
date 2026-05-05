import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { orders as mockOrders } from "../data/orders";
import { db } from "../firebase/firebase";
import type {
  CreateOrderInput,
  DeliveryStatus,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
} from "../types";

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

const legacyStatusToOrderStatus = (status: unknown): OrderStatus => {
  switch (status) {
    case "new":
      return "created";
    case "processing":
      return "in_delivery";
    case "completed":
      return "delivered";
    case "cancelled":
      return "cancelled";
    default:
      return "waiting_payment";
  }
};

const mapItems = (items: unknown): OrderItem[] =>
  Array.isArray(items)
    ? items.map((item) => {
        const candidate = item as {
          productId?: unknown;
          productName?: unknown;
          quantity?: unknown;
          price?: unknown;
          lineTotal?: unknown;
        };
        const quantity = Number(candidate.quantity ?? 1);
        const price = Number(candidate.price ?? 0);

        return {
          productId: String(candidate.productId ?? ""),
          productName: String(candidate.productName ?? ""),
          quantity,
          price,
          lineTotal: Number(candidate.lineTotal ?? quantity * price),
        };
      })
    : [];

const mapOrder = (id: string, data: Record<string, unknown>): Order => {
  const items = mapItems(data.items);
  const subtotal =
    Number(data.subtotal ?? items.reduce((sum, item) => sum + item.lineTotal, 0)) || 0;
  const deliveryPrice = Number(data.deliveryPrice ?? 0) || 0;
  const orderStatus = (data.orderStatus ??
    legacyStatusToOrderStatus(data.status)) as OrderStatus;

  return {
    id: String(data.id ?? id),
    userId: String(data.userId ?? ""),
    customerName: String(data.customerName ?? ""),
    phone: String(data.phone ?? ""),
    city: String(data.city ?? ""),
    address: String(data.address ?? ""),
    companyName: String(data.companyName ?? ""),
    comment: String(data.comment ?? ""),
    items,
    subtotal,
    deliveryPrice,
    total: Number(data.total ?? subtotal + deliveryPrice) || 0,
    paymentMethod: "kaspi_mock",
    paymentStatus: (data.paymentStatus ?? "pending") as PaymentStatus,
    deliveryStatus: (data.deliveryStatus ?? "not_created") as DeliveryStatus,
    orderStatus,
    createdAt: formatDate(data.createdAt),
    updatedAt: formatDate(data.updatedAt),
  };
};

const copyOrder = (order: Order): Order => ({
  ...order,
  items: order.items.map((item) => ({ ...item })),
});

const sortByDateDesc = (orders: Order[]) =>
  [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const orderService = {
  async getOrders(): Promise<Order[]> {
    if (!db) {
      return delay(sortByDateDesc(mockOrders.map(copyOrder)));
    }

    const snapshot = await getDocs(collection(db, ordersCollection));
    return sortByDateDesc(
      snapshot.docs.map((orderDoc) => mapOrder(orderDoc.id, orderDoc.data())),
    );
  },

  async getOrdersByUser(userId: string): Promise<Order[]> {
    if (!db) {
      return delay(
        sortByDateDesc(mockOrders.filter((order) => order.userId === userId).map(copyOrder)),
      );
    }

    const snapshot = await getDocs(
      query(collection(db, ordersCollection), where("userId", "==", userId)),
    );

    return sortByDateDesc(
      snapshot.docs.map((orderDoc) => mapOrder(orderDoc.id, orderDoc.data())),
    );
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    if (!db) {
      const order = mockOrders.find((item) => item.id === orderId);
      return delay(order ? copyOrder(order) : null);
    }

    const snapshot = await getDoc(doc(db, ordersCollection, orderId));
    return snapshot.exists() ? mapOrder(snapshot.id, snapshot.data()) : null;
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (input.items.length === 0) {
      throw new Error("Нельзя создать заказ без товаров.");
    }

    if (!db) {
      const order: Order = {
        ...input,
        id: String(Date.now()),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        items: input.items.map((item) => ({ ...item })),
      };

      mockOrders.unshift(order);
      return delay(copyOrder(order));
    }

    const orderRef = doc(collection(db, ordersCollection));
    await setDoc(orderRef, {
      ...input,
      id: orderRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      ...input,
      id: orderRef.id,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      items: input.items.map((item) => ({ ...item })),
    };
  },

  async updateOrderStatus(orderId: string, orderStatus: OrderStatus): Promise<Order> {
    return this.updateOrderFields(orderId, { orderStatus });
  },

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    orderStatus?: OrderStatus,
  ): Promise<Order> {
    return this.updateOrderFields(orderId, {
      paymentStatus,
      ...(orderStatus ? { orderStatus } : {}),
    });
  },

  async updateDeliveryStatus(
    orderId: string,
    deliveryStatus: DeliveryStatus,
    orderStatus?: OrderStatus,
  ): Promise<Order> {
    return this.updateOrderFields(orderId, {
      deliveryStatus,
      ...(orderStatus ? { orderStatus } : {}),
    });
  },

  async updateOrderFields(
    orderId: string,
    fields: Partial<Pick<Order, "orderStatus" | "paymentStatus" | "deliveryStatus">>,
  ): Promise<Order> {
    if (!db) {
      const index = mockOrders.findIndex((item) => item.id === orderId);

      if (index < 0) {
        throw new Error("Заказ не найден.");
      }

      const updatedOrder: Order = {
        ...mockOrders[index],
        ...fields,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      mockOrders[index] = updatedOrder;
      return delay(copyOrder(updatedOrder));
    }

    await updateDoc(doc(db, ordersCollection, orderId), {
      ...fields,
      updatedAt: serverTimestamp(),
    });

    const updatedOrder = await this.getOrderById(orderId);
    if (!updatedOrder) {
      throw new Error("Заказ не найден.");
    }

    return updatedOrder;
  },
};
