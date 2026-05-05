import { Mail, MapPin, Phone } from "lucide-react";
import SectionTitle from "../components/SectionTitle";

const branches = [
  ["Астана", "Коктал 9/1", "+7 702 172 4131"],
  ["Алматы", "Ауэзова 1Б", "+7 (727) 317 92 72"],
  ["Атырау", "мкр. Жулдыз, ул. 19, дом 4А", "+7 (7122) 76 30 04"],
  ["Актау", "Промышленная зона, база 45/2", "+7 702 544 00 66"],
  ["Уральск", "ул. Аманжолова 133/43", "+7 702 433 07 14"],
];

export default function ContactsPage() {
  return (
    <div className="container-page py-10">
      <SectionTitle
        eyebrow="Контакты"
        title="Связь с Parasat Product Astana"
        description="Оставьте заявку через корзину или свяжитесь с ближайшим филиалом для уточнения поставки."
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
        <div className="rounded-lg border border-ink/10 bg-white p-5">
          <MapPin className="text-leaf" size={24} />
          <h2 className="mt-4 text-xl font-black text-ink">Головной адрес</h2>
          <p className="mt-2 text-sm text-ink/64">г. Астана, Коктал 9/1</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-black text-ink">Филиалы</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {branches.map(([city, address, phone]) => (
            <article key={city} className="rounded-lg border border-ink/10 bg-white p-5">
              <h3 className="text-lg font-black text-ink">{city}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/64">{address}</p>
              <p className="mt-3 text-sm font-bold text-leaf">{phone}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
