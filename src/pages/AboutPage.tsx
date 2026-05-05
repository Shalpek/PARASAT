import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  PackageCheck,
  Settings,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import SectionTitle from "../components/SectionTitle";

const directions = [
  {
    icon: PackageCheck,
    title: "Обеспечение HoReCa",
    text: "Комплексные поставки для гостиниц, ресторанов, кафе, столовых, кейтеринга и удаленных объектов.",
  },
  {
    icon: ShieldCheck,
    title: "Профессиональная химия",
    text: "Кухонная, прачечная, индустриальная, дезинфицирующая химия и средства для уборки.",
  },
  {
    icon: ClipboardCheck,
    title: "Расходные материалы",
    text: "Бумажная продукция, упаковочные материалы, одноразовая посуда, средства гигиены и защиты.",
  },
  {
    icon: Settings,
    title: "Техническое сопровождение",
    text: "Подбор решений под оборудование, режимы уборки, дозировки, регламенты и специфику объекта.",
  },
  {
    icon: GraduationCap,
    title: "Обучение персонала",
    text: "Помощь в корректном применении профессиональных средств и соблюдении рабочих процедур.",
  },
  {
    icon: Workflow,
    title: "Автоматизация процессов",
    text: "Поддержка бизнес-процессов снабжения, учета заявок и регулярной закупки материалов.",
  },
];

const advantages = [
  "Более 7 лет практического опыта в сегменте HoReCa.",
  "Каталог собран вокруг реальных закупочных задач бизнеса.",
  "Можно быстро сформировать заявку без сложной регистрации клиента.",
  "Есть филиалы и контакты в нескольких городах Казахстана.",
  "Админ-панель готова к управлению товарами и заявками через Firebase.",
];

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <SectionTitle
        eyebrow="О компании"
        title="Parasat Product Astana помогает HoReCa-бизнесу стабильно закрывать снабжение"
        description="Компания занимается продажей профессиональной химии и расходных материалов для гостиниц, ресторанов, кафе, кейтеринговых компаний, клининга и объектов с регулярной эксплуатационной закупкой."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-lg border border-ink/10 bg-white p-6">
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-mint text-leaf">
            <BadgeCheck size={27} />
          </div>
          <h2 className="mt-6 text-2xl font-black text-ink">Кто такая Parasat Product Astana</h2>
          <p className="mt-4 text-sm leading-6 text-ink/68">
            Parasat Product Astana работает в B2B-сегменте и помогает объектам HoReCa
            подбирать профессиональные средства, расходные материалы и сопутствующие решения
            для ежедневной работы кухни, санитарных зон, прачечных, складов и залов обслуживания.
          </p>
          <p className="mt-4 text-sm leading-6 text-ink/68">
            Проект интернет-магазина делает этот процесс понятным: клиент просматривает каталог,
            фильтрует товары, добавляет нужные позиции в корзину и отправляет заявку менеджеру.
          </p>

          <div className="mt-6 rounded-lg bg-mint p-5">
            <p className="text-5xl font-black text-leaf">7+</p>
            <p className="mt-2 text-sm font-black text-ink">лет на рынке профессионального снабжения</p>
          </div>
        </section>

        <section className="rounded-lg border border-ink/10 bg-white p-6">
          <h2 className="text-2xl font-black text-ink">Основные направления</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {directions.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-lg border border-ink/10 bg-porcelain p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-mint text-leaf">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-4 text-sm font-black text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/64">{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-10 rounded-lg border border-ink/10 bg-ink p-6 text-white md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-mint">
              Для кого работает компания
            </p>
            <h2 className="mt-3 text-3xl font-black">Для объектов, где важны чистота, наличие и регулярность поставок</h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Компания ориентирована на гостиницы, рестораны, кафе, кейтеринговые линии,
              столовые, производственные кухни, клининговые организации и удаленные объекты,
              где требуется надежное снабжение без остановки рабочих процессов.
            </p>
          </div>

          <div className="grid gap-3">
            {advantages.map((advantage) => (
              <div key={advantage} className="flex gap-3 rounded-lg bg-white/10 p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-mint" size={19} />
                <p className="text-sm leading-6 text-white/78">{advantage}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
