import type { DeliveryStatus, OrderStatus, PaymentStatus } from "../types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  created: "Создан",
  waiting_payment: "Ожидает оплаты",
  paid: "Оплачен",
  delivery_created: "Доставка создана",
  in_delivery: "В доставке",
  delivered: "Доставлен",
  cancelled: "Отменен",
};

export const orderStatusOptions: OrderStatus[] = [
  "created",
  "waiting_payment",
  "paid",
  "delivery_created",
  "in_delivery",
  "delivered",
  "cancelled",
];

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Ожидает оплаты",
  paid: "Оплачено",
  failed: "Ошибка оплаты",
  refunded: "Возврат",
};

export const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  not_created: "Не создана",
  calculating: "Расчет",
  created: "Создана",
  courier_assigned: "Курьер назначен",
  in_delivery: "В доставке",
  delivered: "Доставлена",
  cancelled: "Отменена",
};

export const deliveryStatusOptions: DeliveryStatus[] = [
  "not_created",
  "calculating",
  "created",
  "courier_assigned",
  "in_delivery",
  "delivered",
  "cancelled",
];
