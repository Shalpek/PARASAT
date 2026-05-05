import { ArrowLeft, PackageCheck, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { productService } from "../services/productService";
import type { Product } from "../types";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          setProduct(null);
          setRelatedProducts([]);
          return;
        }

        const loadedProduct = await productService.getProductById(id);
        const loadedRelatedProducts = loadedProduct
          ? await productService.getRelatedProducts(loadedProduct.category, loadedProduct.id, 4)
          : [];

        if (!isMounted) {
          return;
        }

        setProduct(loadedProduct);
        setRelatedProducts(loadedRelatedProducts);
        setError(null);
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Ошибка загрузки товара.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="container-page py-12">
        <LoadingState label="Загрузка товара" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-page py-12">
        <ErrorState description={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page py-16">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-leaf">
          <ArrowLeft size={17} />
          Вернуться в каталог
        </Link>
        <h1 className="mt-8 text-3xl font-black text-ink">Товар не найден</h1>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-sm font-bold text-leaf">
        <ArrowLeft size={17} />
        Назад в каталог
      </Link>

      <section className="mt-8 grid gap-8 rounded-lg border border-ink/10 bg-white p-5 shadow-sm lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
        <div className="overflow-hidden rounded-lg bg-mint">
          <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-mint px-3 py-1.5 text-sm font-bold text-leaf">
              {product.category}
            </span>
            <span
              className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              }`}
            >
              {product.inStock ? "В наличии" : "Под заказ"}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-black leading-tight text-ink md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink/68">{product.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-ink/10 bg-porcelain p-4">
              <p className="text-xs font-bold text-ink/52">Цена</p>
              <p className="mt-2 font-black text-ink">{product.price}</p>
            </div>
            <div className="rounded-lg border border-ink/10 bg-porcelain p-4">
              <p className="text-xs font-bold text-ink/52">Фасовка</p>
              <p className="mt-2 font-black text-ink">{product.packageSize}</p>
            </div>
            <div className="rounded-lg border border-ink/10 bg-porcelain p-4">
              <p className="text-xs font-bold text-ink/52">Добавлен</p>
              <p className="mt-2 font-black text-ink">{product.createdAt}</p>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-mint p-5">
            <div className="flex items-start gap-3">
              <PackageCheck className="mt-1 text-leaf" size={22} />
              <div>
                <h2 className="font-black text-ink">Назначение</h2>
                <p className="mt-2 text-sm leading-6 text-ink/66">{product.purpose}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addToCart(product)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
            >
              <ShoppingCart size={18} />
              Добавить в корзину
            </button>
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center rounded-lg border border-ink/12 bg-white px-6 py-3 text-sm font-black text-ink transition hover:border-leaf/35 hover:text-leaf"
            >
              Оформить заявку
            </Link>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-black text-ink">Похожие товары</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
