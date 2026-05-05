import { Lock, LogIn } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorState from "../../components/ErrorState";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    "/admin/dashboard";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      await login(
        String(formData.get("email") ?? ""),
        String(formData.get("password") ?? ""),
      );
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Не удалось войти.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Вход выполняется через Firebase Authentication по email и паролю.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          {error && <ErrorState description={error} />}
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Email</span>
            <input
              required
              name="email"
              type="email"
              placeholder="admin@parasat.kz"
              className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Пароль</span>
            <input
              required
              name="password"
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-3 text-sm font-black text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={18} />
            {isSubmitting ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
