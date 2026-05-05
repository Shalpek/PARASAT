import { CheckCircle2, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function PaymentResultPage({ type }: { type: "success" | "failure" }) {
  const { orderId } = useParams();
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-xl rounded-lg border border-ink/10 bg-white p-8 text-center shadow-soft">
        <div
          className={`mx-auto grid h-14 w-14 place-items-center rounded-lg ${
            isSuccess ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          <Icon size={28} />
        </div>
        <h1 className="mt-5 text-3xl font-black text-ink">
          {isSuccess ? "Оплата прошла успешно" : "Оплата не прошла"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/64">
          {isSuccess
            ? `Заказ #${orderId} оплачен. Mock-доставка создана автоматически.`
            : `Заказ #${orderId} остался в ожидании оплаты. Можно повторить оплату.`}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/my-orders"
            className="inline-flex justify-center rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
          >
            Мои заказы
          </Link>
          {!isSuccess && (
            <Link
              to={`/payment/${orderId}`}
              className="inline-flex justify-center rounded-lg border border-ink/12 bg-white px-6 py-3 text-sm font-black text-ink transition hover:border-leaf/35 hover:text-leaf"
            >
              Повторить оплату
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
