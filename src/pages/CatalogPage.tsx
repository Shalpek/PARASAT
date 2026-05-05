import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import { productService } from "../services/productService";
import type { Category, Product } from "../types";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") as Category | null;
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | "Все">("Все");
  const [query, setQuery] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const loadedCategories = await productService.getCategories();

        if (isMounted) {
          setCategories(loadedCategories);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Ошибка загрузки категорий.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    if (!categoryFromUrl) {
      setActiveCategory("Все");
      return;
    }

    if (categories.includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
      return;
    }

    setActiveCategory("Все");
  }, [categories, categoryFromUrl]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const loadedProducts = await productService.searchProducts({
          category: activeCategory,
          query,
        });

        if (isMounted) {
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
          setIsLoadingProducts(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [activeCategory, query]);

  const handleCategoryChange = (category: Category | "Все") => {
    setActiveCategory(category);
    if (category === "Все") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleResetFilters = () => {
    setQuery("");
    setActiveCategory("Все");
    setSearchParams({});
  };

  return (
    <div className="container-page py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionTitle
          eyebrow="Каталог"
          title="Профессиональная химия и расходные материалы"
          description="Используйте поиск и фильтры, чтобы быстро собрать заявку для кухни, прачечной, клининга, доставки или удаленного объекта."
        />
        <div className="rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink/66">
          Найдено: {products.length}
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-lg border border-ink/10 bg-white p-4">
        <label className="relative block">
          <Search
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/38"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию, описанию или категории"
            className="h-12 w-full rounded-lg border border-ink/10 bg-porcelain pl-12 pr-4 text-sm font-medium text-ink placeholder:text-ink/38"
          />
        </label>
        {isLoadingCategories ? (
          <p className="text-sm font-bold text-ink/54">Загрузка категорий...</p>
        ) : (
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />
        )}
        <div className="flex flex-col justify-between gap-3 rounded-lg bg-porcelain px-4 py-3 text-sm text-ink/66 sm:flex-row sm:items-center">
          <span>
            Показано товаров: <strong className="text-ink">{products.length}</strong>
            {activeCategory !== "Все" && (
              <>
                {" "}
                в категории <strong className="text-ink">{activeCategory}</strong>
              </>
            )}
          </span>
          {(query || activeCategory !== "Все") && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 text-sm font-black text-leaf"
            >
              <X size={16} />
              Сбросить фильтры
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        {error ? (
          <ErrorState description={error} />
        ) : isLoadingProducts ? (
          <LoadingState label="Загрузка товаров" />
        ) : products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div>
            <EmptyState
              title="Товары не найдены"
              description="Попробуйте изменить поисковый запрос или выбрать другую категорию."
            />
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
              >
                Показать все товары
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
