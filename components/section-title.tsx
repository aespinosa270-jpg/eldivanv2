type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#1238E8]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-black tracking-[-0.04em] text-[#101828] sm:text-4xl">
        {title}
      </h2>

      <div className="mt-4 h-1 w-12 rounded-full bg-[#E51E35]" />

      {description && (
        <p className="mt-5 leading-7 text-[#1E2D4D]/65">
          {description}
        </p>
      )}
    </div>
  );
}