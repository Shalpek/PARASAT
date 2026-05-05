import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { productService } from "../../services/productService";
import type { Category, Product } from "../../types";

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const [loadedCategories, loadedProducts] = await Promise.all([
          productService.getCategories(),
          productService.getProducts(),
        ]);

        if (isMounted) {
          setCategories(loadedCategories);
          setProducts(loadedProducts);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Ошибка загрузки товаров.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-leaf">
            Управление товарами
          </p>
          <h2 className="mt-2 text-3xl font-black text-ink">Каталог продукции</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/64">
            На текущем этапе данные временные. Форма и таблица подготовлены для
            будущего подключения к базе данных.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-5 py-3 text-sm font-black text-white transition hover:bg-ink"
        >
          <Plus size={18} />
          Добавить товар
        </button>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[360px_1fr]">
        <form className="h-fit rounded-lg border border-ink/10 bg-white p-5">
          <h3 className="text-xl font-black text-ink">Карточка товара</h3>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Название</span>
              <input className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Категория</span>
              <select className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3">
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Описание</span>
              <textarea
                rows={4}
                className="resize-none rounded-lg border border-ink/10 bg-porcelain px-3 py-2"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink">Фасовка</span>
                <input className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink">Наличие</span>
                <select className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3">
                  <option>В наличии</option>
                  <option>Под заказ</option>
                </select>
              </label>
            </div>
            <button
              type="button"
              className="rounded-lg bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-leaf"
            >
              Сохранить
            </button>
          </div>
        </form>

        <section className="rounded-lg border border-ink/10 bg-white p-5">
          {error ? (
            <ErrorState description={error} />
          ) : isLoading ? (
            <LoadingState label="Загрузка товаров" />
          ) : products.length === 0 ? (
            <EmptyState
              title="Товары не найдены"
              description="После подключения Firebase здесь появятся товары из базы данных."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-ink/52">
                  <tr className="border-b border-ink/10">
                    <th className="py-3 font-black">Товар</th>
                    <th className="py-3 font-black">Категория</th>
                    <th className="py-3 font-black">Фасовка</th>
                    <th className="py-3 font-black">Наличие</th>
                    <th className="py-3 text-right font-black">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-ink/6 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg bg-mint object-cover"
                          />
                          <div>
                            <p className="font-black text-ink">{product.name}</p>
                            <p className="text-xs text-ink/52">ID {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-ink/68">{product.category}</td>
                      <td className="py-3 text-ink/68">{product.volume}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-black ${
                            product.stock
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {product.stock ? "В наличии" : "Под заказ"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 text-ink/64 hover:text-leaf"
                            aria-label="Редактировать"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="grid h-9 w-9 place-items-center rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
                            aria-label="Удалить"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
