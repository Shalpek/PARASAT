import { orders } from "../data/orders";
import type { CreateOrderInput, Order, OrderStatus } from "../types";

let mockOrders: Order[] = orders.map((order) => ({
  ...order,
  items: order.items.map((item) => ({ ...item })),
}));

const delay = <T>(value: T) =>
  new Promise<T>((resolve) => {
    globalThis.setTimeout(() => resolve(value), 120);
  });

const copyOrder = (order: Order): Order => ({
  ...order,
  items: order.items.map((item) => ({ ...item })),
});

export const orderService = {
  async getOrders(): Promise<Order[]> {
    return delay(mockOrders.map(copyOrder));
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (input.items.length === 0) {
      throw new Error("Нельзя создать заявку без товаров.");
    }

    const nextId =
      mockOrders.length > 0 ? Math.max(...mockOrders.map((order) => order.id)) + 1 : 1001;

    const order: Order = {
      ...input,
      id: nextId,
      status: "Новая",
      createdAt: new Date().toISOString().slice(0, 10),
      items: input.items.map((item) => ({ ...item })),
    };

    mockOrders = [order, ...mockOrders];
    return delay(copyOrder(order));
  },

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const order = mockOrders.find((item) => item.id === orderId);

    if (!order) {
      throw new Error("Заявка не найдена.");
    }

    const updatedOrder: Order = { ...order, status };
    mockOrders = mockOrders.map((item) => (item.id === orderId ? updatedOrder : item));

    return delay(copyOrder(updatedOrder));
  },
};
