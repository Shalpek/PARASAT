import { ClipboardList, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { cn } from "../utils/classNames";

const adminLinks = [
  { to: "/admin/dashboard", label: "Панель", icon: LayoutDashboard },
  { to: "/admin/products", label: "Товары", icon: Package },
  { to: "/admin/orders", label: "Заявки", icon: ClipboardList },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-porcelain">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ink/10 bg-white p-5 lg:block">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-lg font-black text-white">
            P
          </span>
          <span>
            <span className="block font-black text-ink">Parasat Admin</span>
            <span className="block text-xs font-semibold text-ink/58">
              Управление каталогом
            </span>
          </span>
        </Link>

        <nav className="mt-8 grid gap-2">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition",
                    isActive
                      ? "bg-ink text-white"
                      : "text-ink/68 hover:bg-mint hover:text-leaf",
                  )
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-ink/10 bg-porcelain/92 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 md:px-8">
            <div>
              <p className="text-sm font-bold text-leaf">Админ-панель</p>
              <h1 className="text-xl font-black text-ink">Parasat Product Astana</h1>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:text-leaf"
            >
              <ShoppingBag size={17} />
              На сайт
            </Link>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-ink/10 px-4 py-3 lg:hidden">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold",
                      isActive ? "bg-ink text-white" : "bg-white text-ink/70",
                    )
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </header>

        <main className="px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
