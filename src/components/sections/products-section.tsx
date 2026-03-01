import Image from "next/image";
import type { ProductItem } from "@/lib/content/types";

type ProductsSectionProps = {
  items: ProductItem[];
};

export function ProductsSection({ items }: ProductsSectionProps) {
  return (
    <section id="productos" className="container-shell py-16 md:py-24">
      <div className="mb-8 flex items-end justify-between gap-6">
        <h2 className="text-3xl font-semibold md:text-5xl">Nuestros productos</h2>
        <p className="max-w-sm text-sm text-ink/70">Ediciones hechas a mano en San Carlos de Bariloche.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-3xl border border-black/10 bg-[#fbf6f0] p-5 shadow-card">
            <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
              <div className="relative h-44 overflow-hidden rounded-2xl">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  {item.badge ? (
                    <span className="rounded-full bg-moss px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-cream">
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm leading-relaxed text-ink/80">{item.description}</p>
                <ul className="grid list-disc gap-1 pl-4 text-sm text-ink/80">
                  {item.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <p className="text-xs uppercase tracking-[0.12em] text-clay">{item.composition}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
