import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { orderStatusLabels, orderStatusOptions } from "../../constants/orderStatuses";
import { orderService } from "../../services/orderService";
import type { Order, OrderStatus } from "../../types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        const loadedOrders = await orderService.getOrders();

        if (isMounted) {
          setOrders(loadedOrders);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Ошибка загрузки заявок.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
      setError(null);
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Не удалось обновить статус.",
      );
    }
  };

  return (
    <div>
      <div>
        <p className="text-sm font-black uppercase tracking-normal text-leaf">
          Управление заявками
        </p>
        <h2 className="mt-2 text-3xl font-black text-ink">Заявки клиентов</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/64">
          Заявки загружаются из коллекции orders. Статус можно менять прямо в интерфейсе,
          изменения сохраняются через сервисный слой.
        </p>
      </div>

      <div className="mt-8 grid gap-5">
        {error ? (
          <ErrorState description={error} />
        ) : isLoading ? (
          <LoadingState label="Загрузка заявок" />
        ) : orders.length === 0 ? (
          <EmptyState
            title="Заявок пока нет"
            description="После подключения Firebase здесь будут отображаться заявки клиентов."
          />
        ) : (
          orders.map((order) => (
          <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-black text-ink">#{order.id}</span>
                  <span className="rounded-lg bg-mint px-2.5 py-1 text-xs font-black text-leaf">
                    {order.createdAt}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-black text-ink">
                  {order.companyName || "Компания не указана"}
                </h3>
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
                  {orderStatusOptions.map((status) => (
                    <option key={status} value={status}>
                      {orderStatusLabels[status]}
                    </option>
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
                <p className="mt-3 text-sm leading-6 text-ink/64">
                  {order.comment || "Комментарий не указан."}
                </p>
              </div>
            </div>
          </article>
          ))
        )}
      </div>
    </div>
  );
}
