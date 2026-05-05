import type { OrderStatus } from "../types";

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "Новая",
  processing: "В обработке",
  completed: "Выполнена",
  cancelled: "Отменена",
};

export const orderStatusOptions: OrderStatus[] = [
  "new",
  "processing",
  "completed",
  "cancelled",
];
