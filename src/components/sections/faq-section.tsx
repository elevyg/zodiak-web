import type { FAQItem } from "@/lib/content/types";

type FAQSectionProps = {
  items: FAQItem[];
};

export function FAQSection({ items }: FAQSectionProps) {
  return (
    <section id="faq" className="container-shell py-16 md:py-24">
      <h2 className="mb-8 text-3xl font-semibold md:text-5xl">Preguntas frecuentes</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <details key={item.question} className="group rounded-2xl border border-border bg-surface p-5">
            <summary className="cursor-pointer list-none text-lg font-medium">{item.question}</summary>
            <p className="mt-3 leading-relaxed text-inkMuted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
