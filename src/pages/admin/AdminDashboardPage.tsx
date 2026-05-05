import { ClipboardList, Package, ShoppingCart, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
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
          setError(
            loadError instanceof Error ? loadError.message : "Ошибка загрузки панели.",
          );
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
        label: "Заявки",
        value: orders.length,
        icon: ClipboardList,
        color: "bg-amber-50 text-amber-700",
      },
      {
        label: "Товаров в наличии",
        value: products.filter((product) => product.stock).length,
        icon: ShoppingCart,
        color: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Клиенты MVP",
        value: orders.length,
        icon: Users,
        color: "bg-sky-50 text-sky-700",
      },
    ],
    [orders.length, products],
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
        </div>
        <Link
          to="/admin/products"
          className="inline-flex justify-center rounded-lg bg-leaf px-5 py-3 text-sm font-black text-white transition hover:bg-ink"
        >
          Управлять товарами
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-lg border border-ink/10 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-black text-ink">Последние заявки</h3>
            <Link to="/admin/orders" className="text-sm font-black text-leaf">
              Все заявки
            </Link>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-ink/52">
                <tr className="border-b border-ink/10">
                  <th className="py-3 font-black">ID</th>
                  <th className="py-3 font-black">Клиент</th>
                  <th className="py-3 font-black">Компания</th>
                  <th className="py-3 font-black">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-ink/6 last:border-0">
                    <td className="py-3 font-bold text-ink">#{order.id}</td>
                    <td className="py-3 text-ink/68">{order.customerName}</td>
                    <td className="py-3 text-ink/68">{order.companyName}</td>
                    <td className="py-3">
                      <span className="rounded-lg bg-mint px-2.5 py-1 text-xs font-black text-leaf">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-ink/10 bg-white p-5">
          <h3 className="text-xl font-black text-ink">Готовность разделов</h3>
          <div className="mt-5 grid gap-3">
            {[
              ["Каталог", "готов"],
              ["Корзина", "готова"],
              ["Оформление заявки", "frontend"],
              ["Авторизация", "макет"],
              ["Backend", "следующий этап"],
            ].map(([name, status]) => (
              <div
                key={name}
                className="flex items-center justify-between gap-4 rounded-lg bg-porcelain px-4 py-3"
              >
                <span className="text-sm font-bold text-ink">{name}</span>
                <span className="text-xs font-black uppercase tracking-normal text-ink/52">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
