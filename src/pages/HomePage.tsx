import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Settings,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import { productService } from "../services/productService";
import type { Category, Product } from "../types";

const advantages = [
  {
    icon: Sparkles,
    title: "Более 7 лет на рынке",
    text: "Практический опыт поставок для гостиниц, ресторанов, кафе, кейтеринга и клининговых служб.",
  },
  {
    icon: PackageCheck,
    title: "Комплексное снабжение HoReCa",
    text: "Профессиональная химия, бумажная продукция, упаковка, одноразовая посуда и СИЗ в одном каталоге.",
  },
  {
    icon: Settings,
    title: "Техническое сопровождение",
    text: "Подбор средств под процессы кухни, прачечной, уборки, дезинфекции и обслуживания оборудования.",
  },
  {
    icon: ClipboardCheck,
    title: "Качественная продукция",
    text: "Ассортимент ориентирован на регулярную B2B-эксплуатацию, безопасность персонала и стабильный результат.",
  },
  {
    icon: Truck,
    title: "Работа по Казахстану",
    text: "Поставка и консультации для объектов в Астане, Алматы, Атырау, Актау, Уральске и других городах.",
  },
];

const partners = [
  "Гостиницы",
  "Рестораны",
  "Кафе",
  "Кейтеринг",
  "Клининг",
  "Удаленные объекты",
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        const [loadedCategories, loadedProducts, loadedPopularProducts] =
          await Promise.all([
            productService.getCategories(),
            productService.getProducts(),
            productService.getPopularProducts(4),
          ]);

        if (!isMounted) {
          return;
        }

        setCategories(loadedCategories);
        setProducts(loadedProducts);
        setPopularProducts(loadedPopularProducts);
        setError(null);
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Ошибка загрузки главной страницы.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroProducts = useMemo(() => products.slice(0, 6), [products]);

  if (isLoading) {
    return (
      <div className="container-page py-12">
        <LoadingState label="Загрузка главной страницы" />
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

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-20 lg:grid lg:grid-cols-2 lg:gap-3 lg:p-8">
          {heroProducts.map((product) => (
            <img
              key={product.id}
              src={product.image}
              alt=""
              className="h-full min-h-36 w-full rounded-lg object-cover"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-ink/70" />

        <div className="container-page relative py-14 md:py-20">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-black uppercase tracking-normal text-mint">
              <ShieldCheck size={17} />
              Parasat Product Astana
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              Профессиональная химия и расходные материалы для HoReCa
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
              Parasat Product Astana помогает гостиницам, ресторанам, кафе и кейтеринговым
              компаниям подбирать профессиональную химию, расходные материалы и решения для
              комплексного снабжения объектов.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-white hover:text-ink"
              >
                Перейти в каталог
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contacts"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white hover:text-ink"
              >
                Связаться с нами
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              ["7+", "лет на рынке"],
              [String(categories.length), "категорий"],
              [String(products.length), "товаров в каталоге"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-4">
                <p className="text-3xl font-black">{value}</p>
                <p className="mt-1 text-sm font-bold text-white/66">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <SectionTitle
          eyebrow="Преимущества"
          title="Поставка, сопровождение и подбор решений для объектов HoReCa"
          description="Компания закрывает не только закупку товаров, но и практические задачи эксплуатации: подбор средств, консультации, обучение персонала и регулярное снабжение."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {advantages.map((advantage) => {
            const Icon = advantage.icon;
            return (
              <article key={advantage.title} className="rounded-lg border border-ink/10 bg-white p-5">
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

      <section className="bg-white py-14">
        <div className="container-page">
          <SectionTitle
            eyebrow="Категории"
            title="Основные направления каталога"
            description="Категории сгруппированы по типовым закупкам для кухни, клининга, прачечной, санитарных зон, упаковки и защиты персонала."
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/catalog?category=${encodeURIComponent(category)}`}
                className="min-h-28 rounded-lg border border-ink/10 bg-porcelain p-4 transition hover:-translate-y-1 hover:border-leaf/35 hover:shadow-soft"
              >
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-leaf">
                  <ShieldCheck size={19} />
                </span>
                <p className="mt-4 text-sm font-black leading-5 text-ink">{category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle
            eyebrow="Популярные товары"
            title="Позиции для регулярной закупки"
            description="Быстрый доступ к товарам, которые чаще всего нужны объектам HoReCa для кухни, уборки, дезинфекции и прачечной."
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
      </section>

      <section className="bg-white py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionTitle
            eyebrow="Партнеры"
            title="Для кого работает Parasat Product Astana"
            description="Каталог ориентирован на компании, которым важны стабильные поставки, понятный ассортимент и возможность быстро отправить заявку менеджеру."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {partners.map((partner) => (
              <div key={partner} className="flex items-center gap-3 rounded-lg border border-ink/10 bg-porcelain p-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-leaf">
                  <Building2 size={19} />
                </span>
                <span className="text-sm font-black text-ink">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-lg border border-ink/10 bg-ink p-6 text-white md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-normal text-mint">
                Контакты
              </p>
              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                Подберите товары для вашего объекта
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
                Добавьте позиции в корзину и отправьте заявку или свяжитесь с менеджером Parasat
                Product Astana для консультации по ассортименту и условиям поставки.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[430px]">
              <a
                href="tel:+77021724131"
                className="flex items-center gap-3 rounded-lg bg-white/10 p-4 transition hover:bg-white hover:text-ink"
              >
                <Phone size={19} />
                <span className="text-sm font-black">+7 702 172 4131</span>
              </a>
              <a
                href="mailto:info@parasat.kz"
                className="flex items-center gap-3 rounded-lg bg-white/10 p-4 transition hover:bg-white hover:text-ink"
              >
                <Mail size={19} />
                <span className="text-sm font-black">info@parasat.kz</span>
              </a>
              <div className="flex items-center gap-3 rounded-lg bg-white/10 p-4 sm:col-span-2">
                <MapPin size={19} />
                <span className="text-sm font-black">Астана, Коктал 9/1</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-white hover:text-ink"
            >
              Перейти в каталог
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white hover:text-ink"
            >
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
