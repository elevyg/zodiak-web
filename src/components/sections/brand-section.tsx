type BrandSectionProps = {
  title: string;
  paragraphs: string[];
  markdown: string;
};

export function BrandSection({ title, paragraphs, markdown }: BrandSectionProps) {
  const extraParagraphs = markdown
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  return (
    <section id="marca" className="relative bg-inverse py-16 md:py-24">
      <div className="container-shell">
        <div className="grid gap-8 rounded-3xl border border-border bg-inverse p-7 md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
          <div className="space-y-5 text-base leading-relaxed text-inkMuted">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {extraParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
