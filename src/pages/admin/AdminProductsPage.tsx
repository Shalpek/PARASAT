import { Pencil, Plus, Trash2, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import EmptyState from "../../components/EmptyState";
import ErrorState from "../../components/ErrorState";
import LoadingState from "../../components/LoadingState";
import { productService } from "../../services/productService";
import type { Category, Product, ProductInput } from "../../types";

const createEmptyForm = (category: Category | ""): ProductInput => ({
  name: "",
  category: category || "Кухонная химия",
  description: "",
  purpose: "",
  price: "Уточнить цену",
  image: "/products/kitchen.svg",
  packageSize: "",
  inStock: true,
});

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductInput>(() => createEmptyForm(""));
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const [loadedCategories, loadedProducts] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(loadedCategories);
      setProducts(loadedProducts);
      setForm((current) => ({
        ...current,
        category: current.category || loadedCategories[0] || "Кухонная химия",
      }));
      setError(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Ошибка загрузки товаров.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setEditingProductId(null);
    setForm(createEmptyForm(categories[0] || "Кухонная химия"));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editingProductId) {
        await productService.updateProduct(editingProductId, form);
      } else {
        await productService.createProduct(form);
      }

      resetForm();
      await loadProducts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не удалось сохранить товар.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      description: product.description,
      purpose: product.purpose,
      price: product.price,
      image: product.image,
      packageSize: product.packageSize,
      inStock: product.inStock,
    });
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Удалить товар "${product.name}"?`)) {
      return;
    }

    try {
      setError(null);
      await productService.deleteProduct(product.id);
      await loadProducts();
      if (editingProductId === product.id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Не удалось удалить товар.");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-leaf">
            Управление товарами
          </p>
          <h2 className="mt-2 text-3xl font-black text-ink">Каталог продукции</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/64">
            Товары загружаются через сервисный слой. При настроенном Firebase данные
            сохраняются в коллекцию products.
          </p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-5 py-3 text-sm font-black text-white transition hover:bg-ink"
        >
          <Plus size={18} />
          Новый товар
        </button>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[390px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-lg border border-ink/10 bg-white p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-black text-ink">
              {editingProductId ? "Редактирование" : "Новый товар"}
            </h3>
            {editingProductId && (
              <button
                type="button"
                onClick={resetForm}
                className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 text-ink/64 hover:text-leaf"
                aria-label="Сбросить форму"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Название</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Категория</span>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value as Category })
                }
                className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3"
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Описание</span>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="resize-none rounded-lg border border-ink/10 bg-porcelain px-3 py-2"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Назначение</span>
              <textarea
                required
                rows={3}
                value={form.purpose}
                onChange={(event) => setForm({ ...form, purpose: event.target.value })}
                className="resize-none rounded-lg border border-ink/10 bg-porcelain px-3 py-2"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink">Фасовка</span>
                <input
                  required
                  value={form.packageSize}
                  onChange={(event) => setForm({ ...form, packageSize: event.target.value })}
                  className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink">Наличие</span>
                <select
                  value={String(form.inStock)}
                  onChange={(event) =>
                    setForm({ ...form, inStock: event.target.value === "true" })
                  }
                  className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3"
                >
                  <option value="true">В наличии</option>
                  <option value="false">Под заказ</option>
                </select>
              </label>
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Цена</span>
              <input
                required
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Изображение</span>
              <input
                required
                value={form.image}
                onChange={(event) => setForm({ ...form, image: event.target.value })}
                className="h-11 rounded-lg border border-ink/10 bg-porcelain px-3"
              />
            </label>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Сохранение..." : "Сохранить"}
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
              description="Добавьте первый товар через форму слева."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
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
                      <td className="py-3 text-ink/68">{product.packageSize}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-black ${
                            product.inStock
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {product.inStock ? "В наличии" : "Под заказ"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 text-ink/64 hover:text-leaf"
                            aria-label="Редактировать"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
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
