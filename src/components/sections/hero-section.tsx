import Image from "next/image";
import type { SiteContent } from "@/lib/content/types";

type HeroSectionProps = {
  hero: SiteContent["hero"];
};

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section id="hero" className="relative left-1/2 right-1/2 h-screen w-screen -translate-x-1/2 overflow-hidden">
      <div className="relative isolate h-full overflow-hidden">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="hero-bg-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1cdd] via-[#1c1c1ca6] to-[#1c1c1c45]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1cb8] via-transparent to-[#f4a05433]" />
        <div className="relative z-10 flex h-full items-end p-7 md:p-12">
          <div className="max-w-3xl space-y-6 text-inverse">
            <p
              className="stagger-in text-xs uppercase tracking-[0.2em] text-accent"
              style={{ animationDelay: "1000ms" }}
            >
              {hero.eyebrow}
            </p>
            <h1
              className="stagger-in text-4xl font-semibold leading-tight md:text-6xl"
              style={{ animationDelay: "1450ms" }}
            >
              {hero.title}
            </h1>
            <p
              className="stagger-in max-w-2xl text-lg leading-relaxed text-[#f9eee1]"
              style={{ animationDelay: "1900ms" }}
            >
              {hero.subtitle}
            </p>
            <div className="stagger-in flex flex-wrap gap-3" style={{ animationDelay: "2350ms" }}>
              <a
                href={hero.ctaPrimary.href}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-ink transition hover:bg-accentStrong"
              >
                {hero.ctaPrimary.label}
              </a>
              <a
                href={hero.ctaSecondary.href}
                className="rounded-full border border-[#f6ebdc8c] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] transition hover:border-accent hover:text-accent"
              >
                {hero.ctaSecondary.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
