import { LogIn } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";
import { isValidEmail } from "../utils/validation";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/profile";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Заполните email.";
    } else if (!isValidEmail(email)) {
      errors.email = "Укажите корректный email.";
    }

    if (!password) {
      errors.password = "Заполните пароль.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError("Проверьте email и пароль.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Не удалось войти.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-page grid place-items-center py-12">
      <div className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-mint text-leaf">
          <LogIn size={26} />
        </div>
        <h1 className="mt-5 text-3xl font-black text-ink">Вход клиента</h1>
        <p className="mt-3 text-sm leading-6 text-ink/64">
          Войдите, чтобы оформить заказ, оплатить его через mock Kaspi и отслеживать доставку.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          {error && <ErrorState description={error} />}
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Email</span>
            <input
              aria-invalid={Boolean(fieldErrors.email)}
              name="email"
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }}
              type="email"
              value={email}
              className={`h-12 rounded-lg border bg-porcelain px-4 ${
                fieldErrors.email ? "border-red-300" : "border-ink/10"
              }`}
            />
            {fieldErrors.email && (
              <span className="text-xs font-bold text-red-600">{fieldErrors.email}</span>
            )}
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-ink">Пароль</span>
            <input
              aria-invalid={Boolean(fieldErrors.password)}
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldErrors((current) => ({ ...current, password: undefined }));
              }}
              type="password"
              value={password}
              className={`h-12 rounded-lg border bg-porcelain px-4 ${
                fieldErrors.password ? "border-red-300" : "border-ink/10"
              }`}
            />
            {fieldErrors.password && (
              <span className="text-xs font-bold text-red-600">{fieldErrors.password}</span>
            )}
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={18} />
            {isSubmitting ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/64">
          Нет аккаунта?{" "}
          <Link to="/register" className="font-black text-leaf">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
}
