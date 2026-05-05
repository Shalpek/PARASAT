import { useEffect, useMemo, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import {
  deliveryStatusLabels,
  deliveryStatusOptions,
  orderStatusLabels,
  orderStatusOptions,
  paymentStatusLabels,
} from "../../constants/orderStatuses";
import { deliveryService } from "../../services/deliveryService";
import { orderService } from "../../services/orderService";
import type { DeliveryStatus, Order, OrderStatus } from "../../types";

const formatMoney = (value: number) => `${value.toLocaleString("ru-RU")} ₸`;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const loadedOrders = await orderService.getOrders();
      setOrders(loadedOrders);
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Ошибка загрузки заказов.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(
    () =>
      statusFilter === "all"
        ? orders
        : orders.filter((order) => order.orderStatus === statusFilter),
    [orders, statusFilter],
  );

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, status);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? updatedOrder : order)),
      );
      setError(null);
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Не удалось обновить статус заказа.",
      );
    }
  };

  const updateDeliveryStatus = async (orderId: string, status: DeliveryStatus) => {
    try {
      await deliveryService.updateMockDeliveryStatus(orderId, status);
      await loadOrders();
      setError(null);
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Не удалось обновить доставку.",
      );
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-leaf">
            Управление заказами
          </p>
          <h2 className="mt-2 text-3xl font-black text-ink">Заказы клиентов</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/64">
            Здесь видны все заказы, статусы оплаты и mock-доставки. Для демонстрации можно
            вручную менять статус заказа и доставки.
          </p>
        </div>
        <label className="grid gap-2">
          <span className="text-xs font-black uppercase tracking-normal text-ink/52">
            Фильтр
          </span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as OrderStatus | "all")}
            className="h-11 rounded-lg border border-ink/10 bg-white px-3 text-sm font-bold"
          >
            <option value="all">Все статусы</option>
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>
                {orderStatusLabels[status]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-5">
        {error ? (
          <ErrorState description={error} />
        ) : isLoading ? (
          <LoadingState label="Загрузка заказов" />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title="Заказы не найдены"
            description="Попробуйте выбрать другой статус или дождитесь новых заказов клиентов."
          />
        ) : (
          filteredOrders.map((order) => (
            <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-5">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
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
                  <p className="mt-1 text-sm text-ink/64">Адрес: {order.address}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:w-[520px]">
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-normal text-ink/52">
                      Статус заказа
                    </span>
                    <select
                      value={order.orderStatus}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value as OrderStatus)
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
                  <label className="grid gap-2">
                    <span className="text-xs font-black uppercase tracking-normal text-ink/52">
                      Доставка demo
                    </span>
                    <select
                      value={order.deliveryStatus}
                      onChange={(event) =>
                        updateDeliveryStatus(order.id, event.target.value as DeliveryStatus)
                      }
                      className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3 text-sm font-bold"
                    >
                      {deliveryStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {deliveryStatusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <Status label="Сумма" value={formatMoney(order.total)} />
                <Status label="Оплата" value={paymentStatusLabels[order.paymentStatus]} />
                <Status label="Доставка" value={deliveryStatusLabels[order.deliveryStatus]} />
                <Status label="Заказ" value={orderStatusLabels[order.orderStatus]} />
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-lg bg-porcelain p-4">
                  <p className="text-sm font-black text-ink">Товары</p>
                  <div className="mt-3 grid gap-2">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productName}`} className="flex justify-between gap-4 text-sm">
                        <span className="font-bold text-ink">{item.productName}</span>
                        <span className="whitespace-nowrap text-ink/60">
                          {item.quantity} шт · {formatMoney(item.lineTotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-porcelain p-4">
                  <p className="text-sm font-black text-ink">Комментарий</p>
                  <p className="mt-3 text-sm leading-6 text-ink/64">
                    {order.comment || "Комментарий не указан."}
                  </p>
                  <div className="mt-4 grid gap-2 text-sm text-ink/64">
                    <div className="flex justify-between">
                      <span>Товары</span>
                      <span className="font-bold text-ink">{formatMoney(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Доставка</span>
                      <span className="font-bold text-ink">{formatMoney(order.deliveryPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function Status({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-porcelain p-4">
      <p className="text-xs font-black uppercase tracking-normal text-ink/52">{label}</p>
      <p className="mt-2 text-sm font-black text-ink">{value}</p>
    </div>
  );
}
