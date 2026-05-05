export default function LoadingState({ label = "Загрузка данных" }: { label?: string }) {
  return (
    <div className="grid place-items-center rounded-lg border border-ink/10 bg-white p-10 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint border-t-leaf" />
      <p className="mt-4 text-sm font-bold text-ink/64">{label}</p>
    </div>
  );
}
