import { LogIn, Send } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { deliveryService } from "../services/deliveryService";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import type { OrderItem } from "../types";
import {
  type FieldErrors,
  isValidPhone,
  validateRequired,
} from "../utils/validation";

type CheckoutForm = {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  companyName: string;
  comment: string;
};

type CheckoutField = keyof CheckoutForm;

const emptyForm: CheckoutForm = {
  customerName: "",
  phone: "",
  city: "",
  address: "",
  companyName: "",
  comment: "",
};

const formatMoney = (value: number) =>
  value > 0 ? `${value.toLocaleString("ru-RU")} ₸` : "Уточнить цену";

const parsePrice = (price: string) => {
  const numericValue = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 1000;
};

const inputClass = (hasError: boolean) =>
  `h-12 rounded-lg border bg-porcelain px-4 ${
    hasError ? "border-red-300" : "border-ink/10"
  }`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const { clearCart, items, totalItems } = useCart();
  const [form, setForm] = useState<CheckoutForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CheckoutField>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      customerName: profile?.fullName ?? "",
      phone: profile?.phone ?? "",
      city: profile?.city ?? "",
      address: profile?.address ?? "",
      companyName: profile?.companyName ?? "",
    }));
  }, [profile]);

  const updateField = (field: CheckoutField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const orderItems = useMemo<OrderItem[]>(
    () =>
      items.map((item) => {
        const price = parsePrice(item.product.price);
        return {
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price,
          lineTotal: price * item.quantity,
        };
      }),
    [items],
  );

  const subtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [orderItems],
  );

  const validateForm = () => {
    const errors: FieldErrors<CheckoutField> = {};

    validateRequired(errors, "customerName", form.customerName, "Имя");
    validateRequired(errors, "phone", form.phone, "Телефон");
    validateRequired(errors, "city", form.city, "Город");
    validateRequired(errors, "address", form.address, "Адрес доставки");

    if (form.phone.trim() && !isValidPhone(form.phone)) {
      errors.phone = "Укажите телефон в корректном формате: минимум 10 цифр.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError("Проверьте поля формы и исправьте ошибки.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("Для оформления заказа нужно войти в аккаунт.");
      }

      const deliveryPrice = await deliveryService.calculateDelivery(form.address, form.city);
      const order = await orderService.createOrder({
        userId: user.uid,
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        companyName: form.companyName.trim(),
        comment: form.comment.trim(),
        items: orderItems,
        subtotal,
        deliveryPrice,
        total: subtotal + deliveryPrice,
        paymentMethod: "kaspi_mock",
        paymentStatus: "pending",
        deliveryStatus: "not_created",
        orderStatus: "waiting_payment",
      });

      await paymentService.createKaspiPayment(order);
      clearCart();
      navigate(`/payment/${order.id}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Не удалось создать заказ.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container-page py-12">
        <div className="rounded-lg border border-ink/10 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-mint text-leaf">
            <LogIn size={26} />
          </div>
          <h1 className="mt-5 text-3xl font-black text-ink">Войдите для оформления заказа</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ink/64">
            Заказ привязывается к аккаунту клиента, чтобы можно было видеть оплату,
            доставку и историю заказов в личном кабинете.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex justify-center rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="inline-flex justify-center rounded-lg border border-ink/12 bg-white px-6 py-3 text-sm font-black text-ink transition hover:border-leaf/35 hover:text-leaf"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-12">
        <EmptyState
          title="Нет товаров для заказа"
          description="Добавьте товары в корзину, затем вернитесь к оформлению заказа."
        />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div>
        <p className="text-sm font-black uppercase tracking-normal text-leaf">
          Оформление заказа
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink md:text-5xl">
          Доставка и оплата
        </h1>
        <p className="mt-4 max-w-2xl text-ink/64">
          Данные ниже автоматически подставляются из профиля. Их можно изменить для
          конкретного заказа.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5"
        >
          {error && <ErrorState description={error} />}
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              error={fieldErrors.customerName}
              label="Имя"
              name="customerName"
              onChange={(value) => updateField("customerName", value)}
              value={form.customerName}
            />
            <TextInput
              error={fieldErrors.phone}
              label="Телефон"
              name="phone"
              onChange={(value) => updateField("phone", value)}
              placeholder="+7"
              type="tel"
              value={form.phone}
            />
            <TextInput
              error={fieldErrors.city}
              label="Город"
              name="city"
              onChange={(value) => updateField("city", value)}
              value={form.city}
            />
            <TextInput
              label="Компания"
              name="companyName"
              onChange={(value) => updateField("companyName", value)}
              placeholder="Необязательно"
              value={form.companyName}
            />
          </div>
          <TextInput
            error={fieldErrors.address}
            label="Адрес доставки"
            name="address"
            onChange={(value) => updateField("address", value)}
            placeholder="Улица, дом, офис или склад"
            value={form.address}
          />
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Комментарий</span>
            <textarea
              name="comment"
              onChange={(event) => updateField("comment", event.target.value)}
              rows={5}
              placeholder="Например: нужен счет, доставка в определенное время или консультация по аналогам"
              value={form.comment}
              className="resize-none rounded-lg border border-ink/10 bg-porcelain px-4 py-3"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {isSubmitting ? "Создание заказа..." : "Создать заказ и перейти к оплате"}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5">
          <h2 className="text-xl font-black text-ink">Состав заказа</h2>
          <div className="mt-5 grid gap-3">
            {orderItems.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4 text-sm">
                <span className="font-bold text-ink">{item.productName}</span>
                <span className="whitespace-nowrap text-ink/60">
                  {item.quantity} шт · {formatMoney(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-ink/62">Товаров</span>
              <span className="font-black text-ink">{totalItems}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink/62">Товары</span>
              <span className="font-black text-ink">{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink/62">Доставка</span>
              <span className="font-black text-ink">Рассчитается по городу</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-ink/10 pt-3">
              <span className="font-black text-ink">Оплата</span>
              <span className="font-black text-leaf">Kaspi mock</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TextInput({
  error,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  error?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-ink">{label}</span>
      <input
        aria-invalid={Boolean(error)}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
        className={inputClass(Boolean(error))}
      />
      {error && <span className="text-xs font-bold text-red-600">{error}</span>}
    </label>
  );
}
