import type { SiteContent } from "@/lib/content/types"

type ReviewsSectionProps = {
  reviews: SiteContent["reviews"]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section id="resenas" className="relative bg-inverse py-14 md:py-20">
      <div className="container-shell">
        <div className="mb-8 flex flex-col gap-3 md:mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-inkMuted">
            Reseñas
          </p>
          <h2 className="max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
            {reviews.title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-inkMuted md:text-lg">
            {reviews.subtitle}
          </p>
        </div>

        <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-inverse to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-inverse to-transparent" />
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {reviews.items.map((item) => (
              <li
                key={`${item.name}-${item.age}`}
                className="fade-up min-h-[210px] w-[82%] shrink-0 snap-start rounded-2xl border border-border bg-[#f8efe3] p-5 shadow-[0_12px_28px_-20px_rgba(28,28,28,0.65)] md:w-[36%] md:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">
                    {item.name}, {item.age}
                  </p>
                </div>
                <p className="text-base leading-relaxed text-inkMuted md:text-[1.03rem]">
                  {item.quote}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
