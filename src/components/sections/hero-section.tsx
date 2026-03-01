import Image from "next/image";
import type { SiteContent } from "@/lib/content/types";

type HeroSectionProps = {
  hero: SiteContent["hero"];
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section id="hero" className="container-shell grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
      <div className="fade-up space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] text-accentStrong">{hero.eyebrow}</p>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">{hero.title}</h1>
        <p className="max-w-prose text-lg leading-relaxed text-inkMuted">{hero.subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <a
            href={hero.ctaPrimary.href}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-ink transition hover:bg-accentStrong"
          >
            {hero.ctaPrimary.label}
          </a>
          <a
            href={hero.ctaSecondary.href}
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] transition hover:border-ink"
          >
            {hero.ctaSecondary.label}
          </a>
        </div>
      </div>
      <div className="fade-up relative overflow-hidden rounded-[2rem] border border-border shadow-card">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          width={900}
          height={1200}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </section>
  );
}
