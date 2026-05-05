import { Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const branches = [
  {
    city: "Астана",
    address: "Коктал 9/1",
    phone: "+7 702 172 4131",
    whatsapp: "77021724131",
  },
  {
    city: "Алматы",
    address: "Ауэзова 1Б",
    phone: "+7 (727) 317 92 72",
    whatsapp: "77273179272",
  },
  {
    city: "Атырау",
    address: "мкр. Жулдыз, ул. 19, дом 4А",
    phone: "+7 (7122) 76 30 04",
    whatsapp: "77122763004",
  },
  {
    city: "Актау",
    address: "Промышленная зона, база 45/2",
    phone: "+7 702 544 00 66",
    whatsapp: "77025440066",
  },
  {
    city: "Уральск",
    address: "ул. Аманжолова 133/43",
    phone: "+7 702 433 07 14",
    whatsapp: "77024330714",
  },
];

const whatsappText = encodeURIComponent(
  "Здравствуйте! Хочу получить консультацию по товарам Parasat Product Astana.",
);

export default function ContactsPage() {
  return (
    <div className="container-page py-10">
      <SectionTitle
        eyebrow="Контакты"
        title="Связь с Parasat Product Astana"
        description="Выберите ближайший город, позвоните менеджеру, напишите в WhatsApp или сформируйте заявку через каталог."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <a
          href="tel:+77021724131"
          className="rounded-lg border border-ink/10 bg-white p-5 transition hover:border-leaf/35 hover:shadow-soft"
        >
          <Phone className="text-leaf" size={24} />
          <h2 className="mt-4 text-xl font-black text-ink">Телефон</h2>
          <p className="mt-2 text-sm text-ink/64">+7 702 172 4131</p>
        </a>
        <a
          href="mailto:info@parasat.kz"
          className="rounded-lg border border-ink/10 bg-white p-5 transition hover:border-leaf/35 hover:shadow-soft"
        >
          <Mail className="text-leaf" size={24} />
          <h2 className="mt-4 text-xl font-black text-ink">Email</h2>
          <p className="mt-2 text-sm text-ink/64">info@parasat.kz</p>
        </a>
        <a
          href={`https://wa.me/77021724131?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-ink/10 bg-white p-5 transition hover:border-leaf/35 hover:shadow-soft"
        >
          <MessageCircle className="text-leaf" size={24} />
          <h2 className="mt-4 text-xl font-black text-ink">WhatsApp</h2>
          <p className="mt-2 text-sm text-ink/64">Написать менеджеру</p>
        </a>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-black text-ink">Контакты по городам</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {branches.map((branch) => (
            <article key={branch.city} className="rounded-lg border border-ink/10 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-ink">{branch.city}</h3>
                  <p className="mt-2 flex gap-2 text-sm leading-6 text-ink/64">
                    <MapPin className="mt-1 shrink-0 text-leaf" size={16} />
                    {branch.address}
                  </p>
                  <a
                    href={`tel:${branch.phone.replace(/[^\d+]/g, "")}`}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-leaf"
                  >
                    <Phone size={16} />
                    {branch.phone}
                  </a>
                </div>
              </div>

              <a
                href={`https://wa.me/${branch.whatsapp}?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink/10 bg-porcelain px-4 py-3 text-sm font-black text-ink transition hover:border-leaf/35 hover:text-leaf"
              >
                <MessageCircle size={17} />
                Написать в WhatsApp
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-ink/10 bg-ink p-6 text-white md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-mint">
              Оставьте заявку
            </p>
            <h2 className="mt-3 text-3xl font-black">Соберите список товаров в каталоге</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
              Добавьте нужные позиции в корзину и отправьте заявку. Менеджер уточнит фасовку,
              наличие, объемы, условия поставки и подберет аналоги при необходимости.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-white hover:text-ink"
            >
              Перейти в каталог
              <Send size={17} />
            </Link>
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-black text-white transition hover:bg-white hover:text-ink"
            >
              Оформить заявку
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
