import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, totalItems, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          title="Корзина пустая"
          description="Добавьте товары из каталога, чтобы сформировать заявку на поставку."
        />
        <div className="mt-6 text-center">
          <Link
            to="/catalog"
            className="inline-flex rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-leaf">Корзина</p>
          <h1 className="mt-3 text-3xl font-black text-ink md:text-5xl">Заявка на товары</h1>
          <p className="mt-4 text-ink/64">Проверьте количество перед оформлением заявки.</p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white px-5 py-3 text-sm font-bold text-ink/66">
          Всего позиций: {totalItems}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.map((item) => (
            <article
              key={item.product.id}
              className="grid gap-4 rounded-lg border border-ink/10 bg-white p-4 md:grid-cols-[120px_1fr_auto] md:items-center"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="aspect-[4/3] w-full rounded-lg bg-mint object-cover md:w-[120px]"
              />
              <div>
                <p className="text-sm font-bold text-leaf">{item.product.category}</p>
                <h2 className="mt-1 text-xl font-black text-ink">{item.product.name}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/62">{item.product.description}</p>
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <div className="inline-flex items-center rounded-lg border border-ink/10 bg-porcelain">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="grid h-10 w-10 place-items-center text-ink/64 hover:text-leaf"
                    aria-label="Уменьшить количество"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="grid h-10 min-w-10 place-items-center px-2 text-sm font-black">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="grid h-10 w-10 place-items-center text-ink/64 hover:text-leaf"
                    aria-label="Увеличить количество"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                  aria-label="Удалить товар"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5">
          <h2 className="text-xl font-black text-ink">Итог заявки</h2>
          <div className="mt-5 grid gap-3 text-sm text-ink/66">
            <div className="flex justify-between gap-4">
              <span>Товаров</span>
              <span className="font-black text-ink">{totalItems}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Стоимость</span>
              <span className="font-black text-ink">По запросу</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 inline-flex w-full justify-center rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
          >
            Оформить заявку
          </Link>
          <Link
            to="/catalog"
            className="mt-3 inline-flex w-full justify-center rounded-lg border border-ink/12 bg-white px-6 py-3 text-sm font-black text-ink transition hover:border-leaf/35 hover:text-leaf"
          >
            Продолжить покупки
          </Link>
        </aside>
      </div>
    </div>
  );
}
