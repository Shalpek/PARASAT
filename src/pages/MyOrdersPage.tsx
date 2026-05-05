import { PackageSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import {
  deliveryStatusLabels,
  orderStatusLabels,
  paymentStatusLabels,
} from "../constants/orderStatuses";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import type { Order } from "../types";

const formatMoney = (value: number) => `${value.toLocaleString("ru-RU")} ₸`;

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);
        const loadedOrders = await orderService.getOrdersByUser(user.uid);

        if (isMounted) {
          setOrders(loadedOrders);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Ошибка загрузки заказов.");
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
  }, [user]);

  return (
    <div className="container-page py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-leaf">
            Личный кабинет
          </p>
          <h1 className="mt-3 text-3xl font-black text-ink md:text-5xl">Мои заказы</h1>
          <p className="mt-4 text-ink/64">
            Здесь отображаются заказы, оплата Kaspi mock и статусы mock-доставки.
          </p>
        </div>
        <Link
          to="/catalog"
          className="inline-flex justify-center rounded-lg bg-leaf px-5 py-3 text-sm font-black text-white transition hover:bg-ink"
        >
          Перейти в каталог
        </Link>
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState description={error} />
        ) : isLoading ? (
          <LoadingState label="Загрузка заказов" />
        ) : orders.length === 0 ? (
          <EmptyState
            title="Заказов пока нет"
            description="Добавьте товары в корзину и оформите первый заказ."
          />
        ) : (
          <div className="grid gap-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-ink/10 bg-white p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-black text-ink">Заказ #{order.id}</span>
                      <span className="rounded-lg bg-mint px-2.5 py-1 text-xs font-black text-leaf">
                        {order.createdAt}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-ink/64">
                      {order.city}, {order.address}
                    </p>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-black text-ink">{formatMoney(order.total)}</p>
                    {order.paymentStatus === "pending" && (
                      <Link
                        to={`/payment/${order.id}`}
                        className="mt-3 inline-flex rounded-lg bg-leaf px-4 py-2 text-sm font-black text-white transition hover:bg-ink"
                      >
                        Перейти к оплате
                      </Link>
                    )}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <Status label="Заказ" value={orderStatusLabels[order.orderStatus]} />
                  <Status label="Оплата" value={paymentStatusLabels[order.paymentStatus]} />
                  <Status label="Доставка" value={deliveryStatusLabels[order.deliveryStatus]} />
                </div>

                <div className="mt-5 rounded-lg bg-porcelain p-4">
                  <p className="flex items-center gap-2 text-sm font-black text-ink">
                    <PackageSearch size={17} />
                    Товары
                  </p>
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
              </article>
            ))}
          </div>
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
