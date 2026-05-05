import { CheckCircle2 } from "lucide-react";
import SectionTitle from "../components/SectionTitle";

const points = [
  "обеспечение оборудованием, сырьем и материалами в сегменте HoReCa",
  "техническое сопровождение и операционный консалтинг",
  "обучение персонала работе с профессиональными средствами",
  "автоматизация бизнес-процессов и комплексное снабжение удаленных объектов",
];

export default function AboutPage() {
  return (
    <div className="container-page py-10">
      <SectionTitle
        eyebrow="О компании"
        title="Parasat Product Astana работает с профессиональными закупками для HoReCa"
        description="Компания занимается продажей профессиональной химии и расходных материалов для гостиниц, ресторанов, кафе и кейтеринговых компаний."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-ink/10 bg-white p-6">
          <p className="text-5xl font-black text-leaf">7+</p>
          <p className="mt-4 text-lg font-black text-ink">лет в сегменте HoReCa</p>
          <p className="mt-3 text-sm leading-6 text-ink/64">
            Основной фокус - профессиональная бытовая химия, бумажная продукция,
            одноразовая посуда, средства индивидуальной защиты, упаковочные
            материалы и предметы сервировки.
          </p>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-6">
          <h2 className="text-2xl font-black text-ink">Чем занимается компания</h2>
          <div className="mt-6 grid gap-4">
            {points.map((point) => (
              <div key={point} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-leaf" size={20} />
                <p className="text-sm leading-6 text-ink/68">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-10 rounded-lg border border-ink/10 bg-mint p-6">
        <h2 className="text-2xl font-black text-ink">Для кого сайт</h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/68">
          Сайт предназначен для гостиниц, ресторанов, кафе, кейтеринговых компаний,
          клининговых организаций и предприятий, которым нужно быстро подобрать
          профессиональные средства и отправить заявку на поставку.
        </p>
      </section>
    </div>
  );
}
