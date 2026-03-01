import Image from "next/image"
import type { SiteContent } from "@/lib/content/types"

type HeroSectionProps = {
  hero: SiteContent["hero"]
  instagram: string
}

export function HeroSection({ hero, instagram }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative left-1/2 right-1/2 min-h-[86vh] w-screen -translate-x-1/2 overflow-hidden"
    >
      <div className="relative isolate h-full overflow-hidden">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="hero-bg-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1ccc] via-[#1c1c1c8c] to-[#1c1c1c3d]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1cc8] via-transparent to-[#f4a05430]" />
        <div className="relative z-10 flex min-h-[86vh] flex-col justify-between p-6 pt-24 md:p-12 md:pt-28">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 text-inverse">
            <Image
              src="/images/brand/zodiak-leters-white.png"
              alt="Logo Zodiak"
              width={110}
              height={166}
              className="stagger-in h-auto w-[60vw] max-w-[320px] md:max-w-[420px]"
              style={{ animationDelay: "800ms" }}
              priority
            />
            <p
              className="stagger-in text-center text-base text-[#f9eee1] md:text-lg"
              style={{ animationDelay: "1600ms" }}
            >
              Made with love in Patagonia
            </p>
            <div
              className="stagger-in mt-2 flex flex-wrap justify-center gap-2"
              style={{ animationDelay: "1900ms" }}
            >
              <a
                href={hero.ctaSecondary.href}
                className="rounded-full border border-[#f6ebdc8c] bg-[#f6ebdc2b] px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] text-inverse transition hover:border-accent hover:text-accent"
              >
                WhatsApp
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#f6ebdc8c] bg-[#f6ebdc2b] px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] text-inverse transition hover:border-accent hover:text-accent"
              >
                Instagram
              </a>
            </div>
          </div>

          <div className="max-w-2xl space-y-6 text-inverse">
            <h1
              className="stagger-in text-5xl font-semibold leading-[0.96] md:text-7xl"
              style={{ animationDelay: "2300ms" }}
            >
              {hero.title}
            </h1>
            <div
              className="stagger-in flex flex-wrap gap-3"
              style={{ animationDelay: "2700ms" }}
            >
              <a
                href={hero.ctaPrimary.href}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-ink transition hover:bg-accentStrong"
              >
                {hero.ctaPrimary.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
