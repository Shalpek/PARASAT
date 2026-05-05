import { LogOut, Package, Save, User } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";
import {
  type FieldErrors,
  isValidPhone,
  validateRequired,
} from "../utils/validation";

type ProfileForm = {
  fullName: string;
  phone: string;
  city: string;
  companyName: string;
  address: string;
};

type ProfileField = keyof ProfileForm;

const emptyForm: ProfileForm = {
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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout, profile, updateProfile, user } = useAuth();
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ProfileField>>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm({
      fullName: profile?.fullName ?? "",
      phone: profile?.phone ?? "",
      city: profile?.city ?? "",
      companyName: profile?.companyName ?? "",
      address: profile?.address ?? "",
    });
  }, [profile]);

  const updateField = (field: ProfileField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validateForm = () => {
    const errors: FieldErrors<ProfileField> = {};

    validateRequired(errors, "fullName", form.fullName, "Имя");
    validateRequired(errors, "phone", form.phone, "Телефон");
    validateRequired(errors, "city", form.city, "Город");
    validateRequired(errors, "address", form.address, "Адрес доставки");

    if (form.phone.trim() && !isValidPhone(form.phone)) {
      errors.phone = "Укажите телефон в корректном формате: минимум 10 цифр.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateForm()) {
      setError("Проверьте поля формы и исправьте ошибки.");
      return;
    }

    setIsSaving(true);

    try {
      await updateProfile({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        companyName: form.companyName.trim(),
        address: form.address.trim(),
      });
      setMessage("Профиль обновлен.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не удалось обновить профиль.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="container-page py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-normal text-leaf">
            Личный кабинет
          </p>
          <h1 className="mt-3 text-3xl font-black text-ink md:text-5xl">
            Профиль клиента
          </h1>
          <p className="mt-4 text-ink/64">
            Данные профиля автоматически подставляются при оформлении заказа.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/my-orders"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink/12 bg-white px-5 py-3 text-sm font-black text-ink transition hover:border-leaf/35 hover:text-leaf"
          >
            <Package size={18} />
            Мои заказы
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-black text-white transition hover:bg-leaf"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5">
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-mint text-leaf">
            <User size={26} />
          </div>
          <h2 className="mt-5 text-xl font-black text-ink">{form.fullName || "Клиент"}</h2>
          <div className="mt-4 grid gap-2 text-sm text-ink/64">
            <p>
              Email: <span className="font-bold text-ink">{user?.email || "Не указан"}</span>
            </p>
            <p>
              Роль: <span className="font-bold text-ink">{profile?.role ?? "customer"}</span>
            </p>
            <p>
              Город: <span className="font-bold text-ink">{form.city || "Не указан"}</span>
            </p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5"
        >
          {error && <ErrorState description={error} />}
          {message && (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              {message}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Email</span>
              <input
                value={user?.email ?? ""}
                readOnly
                className="h-12 rounded-lg border border-ink/10 bg-porcelain px-4 text-ink/60"
              />
            </label>
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
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-leaf px-6 py-3 text-sm font-black text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {isSaving ? "Сохранение..." : "Сохранить профиль"}
          </button>
        </form>
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
