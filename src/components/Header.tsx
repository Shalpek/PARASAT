import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { cn } from "../utils/classNames";

const navItems = [
  { to: "/", label: "Главная" },
  { to: "/catalog", label: "Каталог" },
  { to: "/about", label: "О компании" },
  { to: "/contacts", label: "Контакты" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-mint hover:text-leaf",
      isActive ? "bg-mint text-leaf" : "text-ink/76",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-porcelain/92 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-leaf text-lg font-black text-white">
            P
          </span>
          <span className="min-w-0">
            <span className="block text-base font-black leading-tight text-ink sm:text-lg">
              Parasat Product
            </span>
            <span className="block text-xs font-semibold uppercase tracking-normal text-leaf">
              Astana HoReCa
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-leaf/30 hover:text-leaf"
          >
            <User size={17} />
            {isAuthenticated ? "Профиль" : "Войти"}
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-leaf/30 hover:text-leaf"
          >
            <Search size={17} />
            Найти товар
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-leaf"
          >
            <ShoppingCart size={17} />
            Корзина
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-sun px-1 text-xs font-black text-ink">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-lg border border-ink/10 bg-white text-ink lg:hidden"
          aria-label="Открыть меню"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-ink/10 bg-white lg:hidden">
          <div className="container-page grid gap-2 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={navLinkClass}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink"
            >
              <User size={17} />
              {isAuthenticated ? "Профиль" : "Войти"}
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white"
            >
              <ShoppingCart size={17} />
              Корзина: {totalItems}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
