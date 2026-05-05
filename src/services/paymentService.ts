import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { orderService } from "./orderService";
import type { Order, PaymentRecord, PaymentStatus } from "../types";

const paymentsCollection = "payments";
const mockPayments = new Map<string, PaymentRecord>();

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

const mapPayment = (id: string, data: Record<string, unknown>): PaymentRecord => ({
  id: String(data.id ?? id),
  orderId: String(data.orderId ?? id),
  userId: String(data.userId ?? ""),
  provider: "kaspi_mock",
  amount: Number(data.amount ?? 0),
  status: (data.status ?? "pending") as PaymentStatus,
  createdAt: formatDate(data.createdAt),
  updatedAt: formatDate(data.updatedAt),
  paidAt: data.paidAt ? formatDate(data.paidAt) : undefined,
});

const copyPayment = (payment: PaymentRecord): PaymentRecord => ({ ...payment });

export const paymentService = {
  async createKaspiPayment(order: Order): Promise<PaymentRecord> {
    const payment: PaymentRecord = {
      id: order.id,
      orderId: order.id,
      userId: order.userId,
      provider: "kaspi_mock",
      amount: order.total,
      status: "pending",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    if (!db) {
      mockPayments.set(order.id, payment);
      return delay(copyPayment(payment));
    }

    await setDoc(doc(db, paymentsCollection, order.id), {
      ...payment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return payment;
  },

  async confirmMockPayment(orderId: string): Promise<PaymentRecord> {
    const paidAt = new Date().toISOString().slice(0, 10);

    if (!db) {
      const payment = mockPayments.get(orderId);
      if (!payment) {
        throw new Error("Платеж не найден.");
      }

      const updatedPayment: PaymentRecord = {
        ...payment,
        status: "paid",
        paidAt,
        updatedAt: paidAt,
      };
      mockPayments.set(orderId, updatedPayment);
      await orderService.updatePaymentStatus(orderId, "paid", "paid");
      return delay(copyPayment(updatedPayment));
    }

    await updateDoc(doc(db, paymentsCollection, orderId), {
      status: "paid",
      paidAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    await orderService.updatePaymentStatus(orderId, "paid", "paid");

    const payment = await this.getPayment(orderId);
    if (!payment) {
      throw new Error("Платеж не найден.");
    }

    return payment;
  },

  async failMockPayment(orderId: string): Promise<PaymentRecord> {
    if (!db) {
      const payment = mockPayments.get(orderId);
      if (!payment) {
        throw new Error("Платеж не найден.");
      }

      const updatedPayment: PaymentRecord = {
        ...payment,
        status: "failed",
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      mockPayments.set(orderId, updatedPayment);
      await orderService.updatePaymentStatus(orderId, "failed", "waiting_payment");
      return delay(copyPayment(updatedPayment));
    }

    await updateDoc(doc(db, paymentsCollection, orderId), {
      status: "failed",
      updatedAt: serverTimestamp(),
    });
    await orderService.updatePaymentStatus(orderId, "failed", "waiting_payment");

    const payment = await this.getPayment(orderId);
    if (!payment) {
      throw new Error("Платеж не найден.");
    }

    return payment;
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatus> {
    const payment = await this.getPayment(orderId);
    return payment?.status ?? "pending";
  },

  async getPayment(orderId: string): Promise<PaymentRecord | null> {
    if (!db) {
      const payment = mockPayments.get(orderId);
      return delay(payment ? copyPayment(payment) : null);
    }

    const snapshot = await getDoc(doc(db, paymentsCollection, orderId));
    return snapshot.exists() ? mapPayment(snapshot.id, snapshot.data()) : null;
  },
};
