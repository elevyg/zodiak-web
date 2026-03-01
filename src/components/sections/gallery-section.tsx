import Image from "next/image";
import type { GalleryItem } from "@/lib/content/types";

type GallerySectionProps = {
  items: GalleryItem[];
};

export function GallerySection({ items }: GallerySectionProps) {
  return (
    <section id="galeria" className="container-shell py-16 md:py-24">
      <h2 className="mb-8 text-3xl font-semibold md:text-5xl">Galería</h2>
      <div className="columns-1 gap-4 sm:columns-2 md:columns-3">
        {items.map((item) => (
          <figure key={item.src} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              priority={item.priority}
              className="h-auto w-full object-cover transition duration-500 hover:scale-[1.02]"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
