import { PackageSearch } from "lucide-react";

export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-ink/18 bg-white p-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-lg bg-mint text-leaf">
        <PackageSearch size={26} />
      </div>
      <h3 className="mt-5 text-xl font-black text-ink">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-ink/64">{description}</p>
    </div>
  );
}
