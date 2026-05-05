import { Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-porcelain px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-lg font-black text-white">
            P
          </span>
          <div>
            <p className="font-black text-ink">Parasat Product Astana</p>
            <p className="text-sm text-ink/58">Вход администратора</p>
          </div>
        </Link>

        <div className="mt-8 grid h-14 w-14 place-items-center rounded-lg bg-mint text-leaf">
          <Lock size={26} />
        </div>
        <h1 className="mt-5 text-3xl font-black text-ink">Админ-панель</h1>
        <p className="mt-3 text-sm leading-6 text-ink/64">
          Сейчас это визуальная форма без авторизации. Подключение Firebase Auth
          можно добавить на следующем этапе.
        </p>

        <form className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Email</span>
            <input
              type="email"
              placeholder="admin@parasat.kz"
              className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Пароль</span>
            <input
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4"
            />
          </label>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-sm font-black text-white transition hover:bg-leaf"
          >
            <LogIn size={18} />
            Войти
          </Link>
        </form>
      </div>
    </div>
  );
}
