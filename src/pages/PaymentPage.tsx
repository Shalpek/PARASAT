import { CreditCard, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { paymentStatusLabels } from "../constants/orderStatuses";
import { useAuth } from "../context/AuthContext";
import { deliveryService } from "../services/deliveryService";
import { orderService } from "../services/orderService";
import { paymentService } from "../services/paymentService";
import type { Order, PaymentRecord } from "../types";

const formatMoney = (value: number) => `${value.toLocaleString("ru-RU")} ₸`;

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPayment = async () => {
      if (!orderId) {
        return;
      }

      try {
        setIsLoading(true);
        const loadedOrder = await orderService.getOrderById(orderId);

        if (!loadedOrder) {
          throw new Error("Заказ не найден.");
        }

        if (!isAdmin && loadedOrder.userId !== user?.uid) {
          throw new Error("Нет доступа к этому заказу.");
        }

        let loadedPayment = await paymentService.getPayment(orderId);
        if (!loadedPayment) {
          loadedPayment = await paymentService.createKaspiPayment(loadedOrder);
        }

        if (isMounted) {
          setOrder(loadedOrder);
          setPayment(loadedPayment);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Ошибка загрузки оплаты.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPayment();

    return () => {
      isMounted = false;
    };
  }, [isAdmin, orderId, user?.uid]);

  const handleConfirmPayment = async () => {
    if (!order) {
      return;
    }

    try {
      setIsPaying(true);
      const updatedPayment = await paymentService.confirmMockPayment(order.id);
      const updatedOrder = await orderService.getOrderById(order.id);
      if (updatedOrder) {
        await deliveryService.createDelivery(updatedOrder);
      }
      setPayment(updatedPayment);
      navigate(`/payment/success/${order.id}`, { replace: true });
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Ошибка оплаты.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleFailPayment = async () => {
    if (!order) {
      return;
    }

    try {
      setIsPaying(true);
      await paymentService.failMockPayment(order.id);
      navigate(`/payment/failure/${order.id}`, { replace: true });
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Ошибка оплаты.");
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-page py-12">
        <LoadingState label="Загрузка оплаты" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-page py-12">
        <ErrorState description={error ?? "Заказ не найден."} />
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-mint text-leaf">
          <CreditCard size={26} />
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-normal text-leaf">
          Mock Kaspi Pay
        </p>
        <h1 className="mt-3 text-3xl font-black text-ink">Оплата заказа #{order.id}</h1>
        <p className="mt-3 text-sm leading-6 text-ink/64">
          Это демонстрационная страница оплаты. Реальный Kaspi API не подключен.
        </p>

        <div className="mt-6 grid gap-3 rounded-lg bg-porcelain p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-ink/62">Сумма заказа</span>
            <span className="font-black text-ink">{formatMoney(order.total)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink/62">Способ оплаты</span>
            <span className="font-black text-ink">Kaspi mock</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink/62">Статус оплаты</span>
            <span className="font-black text-leaf">
              {paymentStatusLabels[payment?.status ?? order.paymentStatus]}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={isPaying || order.paymentStatus === "paid"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CreditCard size={18} />
            {isPaying ? "Оплата..." : "Оплатить через Kaspi"}
          </button>
          <button
            type="button"
            onClick={handleFailPayment}
            disabled={isPaying || order.paymentStatus === "paid"}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-6 py-3 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <XCircle size={18} />
            Ошибка оплаты
          </button>
        </div>

        <Link to="/my-orders" className="mt-5 inline-flex text-sm font-black text-leaf">
          Вернуться к моим заказам
        </Link>
      </div>
    </div>
  );
}
