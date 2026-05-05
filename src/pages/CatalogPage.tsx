import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../components/CategoryFilter";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import { categories, products } from "../data/products";
import type { ProductCategory } from "../types";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") as ProductCategory | null;
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "Все">(
    categoryFromUrl && categories.includes(categoryFromUrl) ? categoryFromUrl : "Все",
  );
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "Все" || product.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const handleCategoryChange = (category: ProductCategory | "Все") => {
    setActiveCategory(category);
    if (category === "Все") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
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
          Найдено: {filteredProducts.length}
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
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />
      </div>

      <div className="mt-8">
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Товары не найдены"
            description="Попробуйте изменить запрос или выбрать другую категорию. Временные данные можно расширить в файле products.ts."
          />
        )}
      </div>
    </div>
  );
}
