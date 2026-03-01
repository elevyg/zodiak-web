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
    <section id="marca" className="container-shell py-16 md:py-24">
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
        <div className="space-y-5 text-base leading-relaxed text-ink/85">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {extraParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
