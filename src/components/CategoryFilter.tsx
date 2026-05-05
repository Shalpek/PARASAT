import type { ProductCategory } from "../types";
import { cn } from "../utils/classNames";

type CategoryFilterProps = {
  categories: ProductCategory[];
  activeCategory: ProductCategory | "Все";
  onChange: (category: ProductCategory | "Все") => void;
};

export default function CategoryFilter({
  categories,
  activeCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible">
      {(["Все", ...categories] as Array<ProductCategory | "Все">).map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cn(
            "whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-bold transition",
            activeCategory === category
              ? "border-leaf bg-leaf text-white"
              : "border-ink/10 bg-white text-ink/70 hover:border-leaf/40 hover:text-leaf",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
