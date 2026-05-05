type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="mb-3 text-sm font-black uppercase tracking-normal text-leaf">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-black leading-tight text-ink md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-ink/66">{description}</p>
      )}
    </div>
  );
}
