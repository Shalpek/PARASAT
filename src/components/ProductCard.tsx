import { Eye, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-leaf/25 hover:shadow-soft">
      <Link
        to={`/product/${product.id}`}
        className="block aspect-[4/3] overflow-hidden bg-mint"
        aria-label={`Открыть товар ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <span className="rounded-lg bg-mint px-2.5 py-1 text-xs font-bold text-leaf">
            {product.category}
          </span>
          <span className="whitespace-nowrap text-xs font-bold text-ink/58">
            {product.packageSize}
          </span>
        </div>

        <h3 className="text-lg font-black leading-snug text-ink">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/64">
          {product.description}
        </p>

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-sm font-black text-ink">{product.price}</span>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}
            >
              {product.inStock ? "В наличии" : "Под заказ"}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink"
            >
              <ShoppingCart size={17} />
              В корзину
            </button>
            <Link
              to={`/product/${product.id}`}
              className="grid h-10 w-10 place-items-center rounded-lg border border-ink/10 text-ink/72 transition hover:border-leaf hover:text-leaf"
              aria-label="Подробнее"
              title="Подробнее"
            >
              <Eye size={18} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
