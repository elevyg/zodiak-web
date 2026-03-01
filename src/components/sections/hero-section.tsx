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
      className="relative left-1/2 right-1/2 h-screen w-screen -translate-x-1/2 overflow-hidden"
    >
      <div className="flex h-full flex-col">
        <div className="relative h-[85%] overflow-hidden md:h-[87%]">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            priority
            className="hero-bg-zoom object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c1ccc] via-[#1c1c1c86] to-[#1c1c1c3d]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1cbf] via-transparent to-[#f4a05430]" />
          <div className="relative z-10 flex h-full flex-col justify-end p-6 pt-24 md:p-12 md:pt-36">
            <div className="flex w-full max-w-3xl flex-col items-start gap-2 text-inverse">
              <Image
                src="/images/brand/zodiak-leters-white.png"
                alt="Logo Zodiak"
                width={110}
                height={166}
                className="stagger-in h-auto w-[60vw] max-w-[320px] md:mt-16 md:max-w-[300px]"
                style={{ animationDelay: "900ms" }}
                priority
              />
              <p
                className="stagger-in text-left text-base text-[#f9eee1] md:text-lg"
                style={{ animationDelay: "1300ms" }}
              >
                Made with love in Patagonia
              </p>
              <div
                className="stagger-in mt-2 mb-10 flex flex-wrap justify-start gap-2"
                style={{ animationDelay: "1700ms" }}
              >
                <a
                  href={hero.ctaSecondary.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[#f6ebdc8c] bg-[#f6ebdc2b] px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] text-inverse transition hover:border-accent hover:text-accent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.59 2.63a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.45-1.2a2 2 0 0 1 2.11-.45c.85.27 1.73.47 2.63.59A2 2 0 0 1 22 16.92z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#f6ebdc8c] bg-[#f6ebdc2b] px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] text-inverse transition hover:border-accent hover:text-accent"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37a4 4 0 1 1-1.13-2.83A4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
            <h1
              className="stagger-in max-w-2xl text-5xl font-semibold leading-[0.96] text-inverse md:text-7xl"
              style={{ animationDelay: "1500ms" }}
            >
              {hero.title}
            </h1>
          </div>
        </div>

        <div className="h-[15%] border-t border-border bg-inverse md:h-[13%]">
          <div className="container-shell flex h-full flex-col justify-center gap-4">
            <p
              className="stagger-in max-w-3xl text-lg leading-relaxed text-ink md:text-2xl"
              style={{ animationDelay: "2000ms" }}
            >
              {hero.subtitle}
            </p>
            <div
              className="stagger-in flex flex-wrap gap-3"
              style={{ animationDelay: "2300ms" }}
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
