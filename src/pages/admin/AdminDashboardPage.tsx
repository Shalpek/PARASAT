import { CheckCircle2, ClipboardList, CreditCard, Package, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import {
  deliveryStatusLabels,
  orderStatusLabels,
  paymentStatusLabels,
} from "../../constants/orderStatuses";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";
import type { Order, Product } from "../../types";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const [loadedProducts, loadedOrders] = await Promise.all([
          productService.getProducts(),
          orderService.getOrders(),
        ]);

        if (isMounted) {
          setProducts(loadedProducts);
          setOrders(loadedOrders);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Ошибка загрузки панели.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Товары",
        value: products.length,
        icon: Package,
        color: "bg-mint text-leaf",
      },
      {
        label: "Всего заказов",
        value: orders.length,
        icon: ClipboardList,
        color: "bg-amber-50 text-amber-700",
      },
      {
        label: "Оплаченные",
        value: orders.filter((order) => order.paymentStatus === "paid").length,
        icon: CreditCard,
        color: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Ожидают оплаты",
        value: orders.filter((order) => order.paymentStatus === "pending").length,
        icon: CheckCircle2,
        color: "bg-sky-50 text-sky-700",
      },
      {
        label: "В доставке",
        value: orders.filter((order) => order.deliveryStatus === "in_delivery").length,
        icon: Truck,
        color: "bg-violet-50 text-violet-700",
      },
      {
        label: "Доставлены",
        value: orders.filter((order) => order.deliveryStatus === "delivered").length,
        icon: CheckCircle2,
        color: "bg-lime-50 text-lime-700",
      },
    ],
    [orders, products.length],
  );

  if (isLoading) {
    return <LoadingState label="Загрузка админ-панели" />;
  }

  if (error) {
    return <ErrorState description={error} />;
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-leaf">
            Dashboard
          </p>
          <h2 className="mt-2 text-3xl font-black text-ink">Обзор магазина</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/64">
            Панель показывает заказы, оплату Kaspi mock и статусы mock-доставки.
          </p>
        </div>
        <Link
          to="/admin/orders"
          className="inline-flex justify-center rounded-lg bg-leaf px-5 py-3 text-sm font-black text-white transition hover:bg-ink"
        >
          Управлять заказами
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label} className="rounded-lg border border-ink/10 bg-white p-5">
              <div className={`grid h-11 w-11 place-items-center rounded-lg ${stat.color}`}>
                <Icon size={21} />
              </div>
              <p className="mt-5 text-3xl font-black text-ink">{stat.value}</p>
              <p className="mt-1 text-sm font-bold text-ink/58">{stat.label}</p>
            </article>
          );
        })}
      </div>

      <section className="mt-8 rounded-lg border border-ink/10 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-black text-ink">Последние заказы</h3>
          <Link to="/admin/orders" className="text-sm font-black text-leaf">
            Все заказы
          </Link>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-ink/52">
              <tr className="border-b border-ink/10">
                <th className="py-3 font-black">ID</th>
                <th className="py-3 font-black">Клиент</th>
                <th className="py-3 font-black">Сумма</th>
                <th className="py-3 font-black">Оплата</th>
                <th className="py-3 font-black">Доставка</th>
                <th className="py-3 font-black">Заказ</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="border-b border-ink/6 last:border-0">
                    <td className="py-3 font-bold text-ink">#{order.id}</td>
                    <td className="py-3 text-ink/68">{order.customerName}</td>
                    <td className="py-3 font-bold text-ink">
                      {order.total.toLocaleString("ru-RU")} ₸
                    </td>
                    <td className="py-3 text-ink/68">{paymentStatusLabels[order.paymentStatus]}</td>
                    <td className="py-3 text-ink/68">{deliveryStatusLabels[order.deliveryStatus]}</td>
                    <td className="py-3">
                      <span className="rounded-lg bg-mint px-2.5 py-1 text-xs font-black text-leaf">
                        {orderStatusLabels[order.orderStatus]}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 text-center text-sm font-bold text-ink/52" colSpan={6}>
                    Заказов пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
