import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-leaf font-black text-white">
              P
            </span>
            <div>
              <p className="font-black text-ink">Parasat Product Astana</p>
              <p className="text-sm text-ink/62">Профессиональная химия для HoReCa</p>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-6 text-ink/68">
            Каталог профессиональной химии, расходных материалов, бумажной
            продукции, одноразовой посуды и средств индивидуальной защиты для
            гостиниц, ресторанов, кафе и кейтеринга.
          </p>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-normal text-ink">
            Разделы
          </p>
          <div className="mt-4 grid gap-2 text-sm text-ink/68">
            <Link to="/catalog" className="hover:text-leaf">
              Каталог
            </Link>
            <Link to="/cart" className="hover:text-leaf">
              Корзина
            </Link>
            <Link to="/checkout" className="hover:text-leaf">
              Оформление заявки
            </Link>
            <Link to="/admin/login" className="hover:text-leaf">
              Вход в админ-панель
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-normal text-ink">
            Контакты
          </p>
          <div className="mt-4 grid gap-2 text-sm text-ink/68">
            <span>г. Астана, Коктал 9/1</span>
            <a href="tel:+77021724131" className="hover:text-leaf">
              +7 702 172 4131
            </a>
            <a href="mailto:info@parasat.kz" className="hover:text-leaf">
              info@parasat.kz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
