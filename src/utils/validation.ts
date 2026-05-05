export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());

export const getPhoneDigits = (phone: string) => phone.replace(/\D/g, "");

export const isValidPhone = (phone: string) => {
  const digits = getPhoneDigits(phone);
  return digits.length >= 10 && digits.length <= 15;
};

export const requiredMessage = (label: string) => `Заполните поле "${label}".`;

export const validateRequired = <T extends string>(
  errors: FieldErrors<T>,
  field: T,
  value: string,
  label: string,
) => {
  if (!value.trim()) {
    errors[field] = requiredMessage(label);
  }
};
