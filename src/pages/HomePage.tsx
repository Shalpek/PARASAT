import {
  ArrowRight,
  ClipboardCheck,
  PackageCheck,
  Settings,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import { categories, products } from "../data/products";

const advantages = [
  {
    icon: PackageCheck,
    title: "Комплексное снабжение",
    text: "Химия, бумажная продукция, упаковка, одноразовая посуда и СИЗ в одном каталоге.",
  },
  {
    icon: Settings,
    title: "Техническое сопровождение",
    text: "Подбор средств под оборудование, процессы кухни, прачечной и клининга.",
  },
  {
    icon: ClipboardCheck,
    title: "Обучение персонала",
    text: "Помощь с регламентами, дозировками и корректным применением продукции.",
  },
  {
    icon: Truck,
    title: "Удаленные объекты",
    text: "Поставка для гостиниц, ресторанов, производственных и выездных объектов.",
  },
];

export default function HomePage() {
  const popularProducts = products.slice(0, 4);

  return (
    <div>
      <section className="border-b border-ink/10 bg-white">
        <div className="container-page grid min-h-[calc(100vh-80px)] items-center gap-10 py-10 lg:grid-cols-[1.03fr_0.97fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-leaf">
              HoReCa supply catalog
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.05] text-ink md:text-6xl">
              Parasat Product Astana
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/68">
              Интернет-магазин профессиональной химии и расходных материалов для
              гостиниц, ресторанов, кафе и кейтеринговых компаний.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink"
              >
                Перейти в каталог
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/checkout"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/12 bg-white px-6 py-3 text-sm font-black text-ink transition hover:border-leaf/40 hover:text-leaf"
              >
                Оформить заявку
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[
                ["10", "категорий"],
                ["15+", "товаров MVP"],
                ["B2B", "формат заявок"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-ink/10 bg-porcelain p-4">
                  <p className="text-2xl font-black text-ink">{value}</p>
                  <p className="mt-1 text-xs font-bold text-ink/58">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="grid gap-4 rounded-lg border border-ink/10 bg-porcelain p-4 shadow-soft">
              <div className="grid grid-cols-2 gap-4">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="overflow-hidden rounded-lg border border-ink/10 bg-white transition hover:-translate-y-1 hover:border-leaf/30"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="p-3">
                      <p className="truncate text-sm font-black text-ink">{product.name}</p>
                      <p className="mt-1 truncate text-xs text-ink/58">{product.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-lg bg-ink px-4 py-3 text-white">
                <span className="text-sm font-bold">Заявка из каталога</span>
                <span className="rounded-lg bg-sun px-2.5 py-1 text-xs font-black text-ink">
                  MVP
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionTitle
          eyebrow="Категории"
          title="Основные направления поставки"
          description="Каталог построен вокруг практических закупочных групп для HoReCa: от кухонной химии до упаковки и средств защиты персонала."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/catalog?category=${encodeURIComponent(category)}`}
              className="min-h-28 rounded-lg border border-ink/10 bg-white p-4 transition hover:-translate-y-1 hover:border-leaf/35 hover:shadow-soft"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-leaf">
                <ShieldCheck size={19} />
              </span>
              <p className="mt-4 text-sm font-black leading-5 text-ink">{category}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Популярные позиции"
              title="Товары для стартового каталога"
              description="Временные данные уже лежат внутри проекта и готовы к замене на реальную базу на следующем этапе."
            />
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/12 px-5 py-3 text-sm font-black text-ink transition hover:border-leaf/40 hover:text-leaf"
            >
              Все товары
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionTitle
          eyebrow="Сервис"
          title="Не только поставка товаров"
          description="Компания закрывает задачи обеспечения, сопровождения, обучения и автоматизации процессов для объектов HoReCa."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;
            return (
              <article
                key={advantage.title}
                className="rounded-lg border border-ink/10 bg-white p-5"
              >
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-mint text-leaf">
                  <Icon size={21} />
                </span>
                <h3 className="mt-5 text-lg font-black text-ink">{advantage.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/64">{advantage.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
