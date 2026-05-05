import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { orderService } from "./orderService";
import type { DeliveryRecord, DeliveryStatus, Order } from "../types";

const deliveriesCollection = "deliveries";
const mockDeliveries = new Map<string, DeliveryRecord>();

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

const mapDelivery = (id: string, data: Record<string, unknown>): DeliveryRecord => ({
  id: String(data.id ?? id),
  orderId: String(data.orderId ?? id),
  userId: String(data.userId ?? ""),
  provider: "yandex_delivery_mock",
  city: String(data.city ?? ""),
  address: String(data.address ?? ""),
  price: Number(data.price ?? 0),
  status: (data.status ?? "not_created") as DeliveryStatus,
  createdAt: formatDate(data.createdAt),
  updatedAt: formatDate(data.updatedAt),
});

const copyDelivery = (delivery: DeliveryRecord): DeliveryRecord => ({ ...delivery });

const orderStatusByDeliveryStatus = (status: DeliveryStatus) => {
  if (status === "in_delivery" || status === "courier_assigned") {
    return "in_delivery" as const;
  }

  if (status === "delivered") {
    return "delivered" as const;
  }

  if (status === "cancelled") {
    return "cancelled" as const;
  }

  return "delivery_created" as const;
};

export const deliveryService = {
  async calculateDelivery(address: string, city: string): Promise<number> {
    const normalizedCity = city.trim().toLowerCase();
    const prices: Record<string, number> = {
      астана: 1500,
      алматы: 1800,
      атырау: 2200,
      актау: 2400,
      уральск: 2200,
    };

    const price = prices[normalizedCity] ?? 2500;
    return delay(address.trim().length > 0 ? price : 0);
  },

  async createDelivery(order: Order): Promise<DeliveryRecord> {
    const delivery: DeliveryRecord = {
      id: order.id,
      orderId: order.id,
      userId: order.userId,
      provider: "yandex_delivery_mock",
      city: order.city,
      address: order.address,
      price: order.deliveryPrice,
      status: "created",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    if (!db) {
      mockDeliveries.set(order.id, delivery);
      await orderService.updateDeliveryStatus(order.id, "created", "delivery_created");
      return delay(copyDelivery(delivery));
    }

    await setDoc(doc(db, deliveriesCollection, order.id), {
      ...delivery,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await orderService.updateDeliveryStatus(order.id, "created", "delivery_created");

    return delivery;
  },

  async getDeliveryStatus(orderId: string): Promise<DeliveryStatus> {
    if (!db) {
      return delay(mockDeliveries.get(orderId)?.status ?? "not_created");
    }

    const snapshot = await getDoc(doc(db, deliveriesCollection, orderId));
    return snapshot.exists() ? mapDelivery(snapshot.id, snapshot.data()).status : "not_created";
  },

  async updateMockDeliveryStatus(
    orderId: string,
    status: DeliveryStatus,
  ): Promise<DeliveryRecord | null> {
    if (!db) {
      const current = mockDeliveries.get(orderId);
      if (!current) {
        await orderService.updateDeliveryStatus(orderId, status, orderStatusByDeliveryStatus(status));
        return null;
      }

      const updatedDelivery = {
        ...current,
        status,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      mockDeliveries.set(orderId, updatedDelivery);
      await orderService.updateDeliveryStatus(orderId, status, orderStatusByDeliveryStatus(status));
      return delay(copyDelivery(updatedDelivery));
    }

    const deliveryRef = doc(db, deliveriesCollection, orderId);
    const snapshot = await getDoc(deliveryRef);

    if (!snapshot.exists()) {
      await orderService.updateDeliveryStatus(orderId, status, orderStatusByDeliveryStatus(status));
      return null;
    }

    await updateDoc(deliveryRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    await orderService.updateDeliveryStatus(orderId, status, orderStatusByDeliveryStatus(status));

    const updatedSnapshot = await getDoc(deliveryRef);
    return updatedSnapshot.exists()
      ? mapDelivery(updatedSnapshot.id, updatedSnapshot.data())
      : null;
  },
};
