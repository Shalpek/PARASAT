import { UserPlus } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";
import {
  type FieldErrors,
  isValidEmail,
  isValidPhone,
  validateRequired,
} from "../utils/validation";

type RegisterForm = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  city: string;
  companyName: string;
  address: string;
};

type RegisterField = keyof RegisterForm;

const emptyForm: RegisterForm = {
  email: "",
  password: "",
  fullName: "",
  phone: "",
  city: "",
  companyName: "",
  address: "",
};

const inputClass = (hasError: boolean) =>
  `h-12 rounded-lg border bg-porcelain px-4 ${
    hasError ? "border-red-300" : "border-ink/10"
  }`;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<RegisterForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterField>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: RegisterField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateForm = () => {
    const errors: FieldErrors<RegisterField> = {};

    validateRequired(errors, "email", form.email, "Email");
    validateRequired(errors, "password", form.password, "Пароль");
    validateRequired(errors, "fullName", form.fullName, "Имя");
    validateRequired(errors, "phone", form.phone, "Телефон");
    validateRequired(errors, "city", form.city, "Город");
    validateRequired(errors, "address", form.address, "Адрес доставки");

    if (form.email.trim() && !isValidEmail(form.email)) {
      errors.email = "Укажите корректный email, например client@example.com.";
    }

    if (form.password && form.password.length < 6) {
      errors.password = "Пароль должен быть не короче 6 символов.";
    }

    if (form.phone.trim() && !isValidPhone(form.phone)) {
      errors.phone = "Укажите телефон в корректном формате: минимум 10 цифр.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      setError("Проверьте поля формы и исправьте ошибки.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(form.email.trim(), form.password, {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        companyName: form.companyName.trim(),
        address: form.address.trim(),
      });
      navigate("/profile", { replace: true });
    } catch (registerError) {
      setError(
        registerError instanceof Error ? registerError.message : "Не удалось зарегистрироваться.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-page grid place-items-center py-12">
      <div className="w-full max-w-2xl rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <div className="grid h-14 w-14 place-items-center rounded-lg bg-mint text-leaf">
          <UserPlus size={26} />
        </div>
        <h1 className="mt-5 text-3xl font-black text-ink">Регистрация клиента</h1>
        <p className="mt-3 text-sm leading-6 text-ink/64">
          Эти данные сохраняются в профиле и затем автоматически подставляются при оформлении заказа.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          {error && <ErrorState description={error} />}
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              error={fieldErrors.email}
              label="Email"
              name="email"
              onChange={(value) => updateField("email", value)}
              type="email"
              value={form.email}
            />
            <TextInput
              error={fieldErrors.password}
              label="Пароль"
              name="password"
              onChange={(value) => updateField("password", value)}
              type="password"
              value={form.password}
            />
            <TextInput
              error={fieldErrors.fullName}
              label="Имя"
              name="fullName"
              onChange={(value) => updateField("fullName", value)}
              value={form.fullName}
            />
            <TextInput
              error={fieldErrors.phone}
              label="Телефон"
              name="phone"
              onChange={(value) => updateField("phone", value)}
              placeholder="+7"
              type="tel"
              value={form.phone}
            />
            <TextInput
              error={fieldErrors.city}
              label="Город"
              name="city"
              onChange={(value) => updateField("city", value)}
              value={form.city}
            />
            <TextInput
              label="Компания"
              name="companyName"
              onChange={(value) => updateField("companyName", value)}
              value={form.companyName}
            />
          </div>
          <TextInput
            error={fieldErrors.address}
            label="Адрес доставки"
            name="address"
            onChange={(value) => updateField("address", value)}
            value={form.address}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus size={18} />
            {isSubmitting ? "Создание аккаунта..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink/64">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="font-black text-leaf">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

function TextInput({
  error,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  error?: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-ink">{label}</span>
      <input
        aria-invalid={Boolean(error)}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
        className={inputClass(Boolean(error))}
      />
      {error && <span className="text-xs font-bold text-red-600">{error}</span>}
    </label>
  );
}
