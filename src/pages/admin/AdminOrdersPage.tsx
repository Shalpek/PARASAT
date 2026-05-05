import { useState } from "react";
import { orders as initialOrders } from "../../data/orders";
import type { Order, OrderStatus } from "../../types";

const statuses: OrderStatus[] = ["Новая", "В обработке", "Выполнена", "Отменена"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateStatus = (orderId: number, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order)),
    );
  };

  return (
    <div>
      <div>
        <p className="text-sm font-black uppercase tracking-normal text-leaf">
          Управление заявками
        </p>
        <h2 className="mt-2 text-3xl font-black text-ink">Заявки клиентов</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/64">
          Статусы можно менять в интерфейсе. Пока изменения живут только в памяти
          браузера, без сохранения на сервер.
        </p>
      </div>

      <div className="mt-8 grid gap-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-black text-ink">#{order.id}</span>
                  <span className="rounded-lg bg-mint px-2.5 py-1 text-xs font-black text-leaf">
                    {order.createdAt}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-black text-ink">{order.companyName}</h3>
                <p className="mt-2 text-sm text-ink/64">
                  {order.customerName}, {order.city}, {order.phone}
                </p>
              </div>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-normal text-ink/52">
                  Статус
                </span>
                <select
                  value={order.status}
                  onChange={(event) =>
                    updateStatus(order.id, event.target.value as OrderStatus)
                  }
                  className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3 text-sm font-bold"
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-lg bg-porcelain p-4">
                <p className="text-sm font-black text-ink">Товары</p>
                <div className="mt-3 grid gap-2">
                  {order.items.map((item) => (
                    <div key={item.productName} className="flex justify-between gap-4 text-sm">
                      <span className="font-bold text-ink">{item.productName}</span>
                      <span className="text-ink/60">{item.quantity} шт</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-porcelain p-4">
                <p className="text-sm font-black text-ink">Комментарий</p>
                <p className="mt-3 text-sm leading-6 text-ink/64">{order.comment}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
