import { Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useCart } from "../context/CartContext";
import { orderService } from "../services/orderService";

export default function CheckoutPage() {
  const { clearCart, items, totalItems } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);

      await orderService.createOrder({
        customerName: String(formData.get("customerName") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        city: String(formData.get("city") ?? ""),
        companyName: String(formData.get("companyName") ?? ""),
        comment: String(formData.get("comment") ?? ""),
        items: items.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setIsSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Не удалось создать заявку.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container-page py-12">
        <div className="rounded-lg border border-emerald-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
            <Send size={26} />
          </div>
          <h1 className="mt-5 text-3xl font-black text-ink">Заявка подготовлена</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/64">
            В этой frontend-версии заявка не отправляется на сервер. После подключения
            backend здесь будет сохранение в базу данных и уведомление менеджера.
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          title="Нет товаров для заявки"
          description="Добавьте товары в корзину, затем вернитесь к оформлению."
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div>
        <p className="text-sm font-black uppercase tracking-normal text-leaf">
          Оформление заявки
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink md:text-5xl">
          Контактные данные клиента
        </h1>
        <p className="mt-4 max-w-2xl text-ink/64">
          Укажите данные компании, чтобы менеджер мог уточнить объемы, наличие и
          условия поставки.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5">
          {error && <ErrorState description={error} />}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Имя</span>
              <input
                required
                name="customerName"
                className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Телефон</span>
              <input
                required
                name="phone"
                type="tel"
                placeholder="+7"
                className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Город</span>
              <input
                required
                name="city"
                className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Компания</span>
              <input
                required
                name="companyName"
                className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4"
              />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Комментарий</span>
            <textarea
              name="comment"
              rows={6}
              placeholder="Например: нужна консультация по дозировкам или регулярная поставка"
              className="resize-none rounded-lg border border-ink/10 bg-porcelain px-4 py-3"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
          >
            <Send size={18} />
            {isSubmitting ? "Отправка..." : "Отправить заявку"}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5">
          <h2 className="text-xl font-black text-ink">Состав заявки</h2>
          <div className="mt-5 grid gap-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between gap-4 text-sm">
                <span className="font-bold text-ink">{item.product.name}</span>
                <span className="text-ink/60">{item.quantity} шт</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-ink/10 pt-4 text-sm font-black text-ink">
            Всего товаров: {totalItems}
          </div>
        </aside>
      </div>
    </div>
  );
}
