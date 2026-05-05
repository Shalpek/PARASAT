import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-16 text-center">
      <div>
        <p className="text-sm font-black uppercase tracking-normal text-leaf">404</p>
        <h1 className="mt-3 text-4xl font-black text-ink">Страница не найдена</h1>
        <p className="mt-4 text-ink/64">Проверьте адрес или вернитесь в каталог.</p>
        <Link
          to="/catalog"
          className="mt-6 inline-flex rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
        >
          В каталог
        </Link>
      </div>
    </div>
  );
}
