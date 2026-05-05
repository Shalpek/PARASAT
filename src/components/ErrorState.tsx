import { AlertTriangle } from "lucide-react";

export default function ErrorState({
  title = "Не удалось загрузить данные",
  description,
}: {
  title?: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-red-100 bg-white p-6">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600">
          <AlertTriangle size={22} />
        </span>
        <div>
          <h3 className="font-black text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/64">{description}</p>
        </div>
      </div>
    </div>
  );
}
