import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { FAQItem, GalleryItem, ProductItem, SiteContent } from "@/lib/content/types";

const file = (...segments: string[]) => path.join(process.cwd(), ...segments);

const siteSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string()
  }),
  nav: z.array(
    z.object({
      label: z.string(),
      href: z.string()
    })
  ),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    subtitle: z.string(),
    ctaPrimary: z.object({ label: z.string(), href: z.string() }),
    ctaSecondary: z.object({ label: z.string(), href: z.string() }),
    image: z.string(),
    imageAlt: z.string()
  }),
  brandStory: z.object({
    title: z.string(),
    paragraphs: z.array(z.string())
  }),
  reviews: z.object({
    title: z.string(),
    subtitle: z.string(),
    items: z.array(
      z.object({
        name: z.string(),
        age: z.number(),
        quote: z.string()
      })
    )
  }),
  contact: z.object({
    title: z.string(),
    subtitle: z.string(),
    location: z.string(),
    phone: z.string(),
    whatsappLink: z.string()
  }),
  social: z.object({
    instagram: z.string()
  })
});

const productsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    features: z.array(z.string()),
    composition: z.string(),
    images: z.array(z.string()),
    badge: z.string().optional()
  })
);

const faqSchema = z.array(
  z.object({
    question: z.string(),
    answer: z.string()
  })
);

const gallerySchema = z.array(
  z.object({
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
    priority: z.boolean().optional()
  })
);

const parseJson = async <T>(pathName: string, schema: z.ZodType<T>) => {
  const raw = await fs.readFile(file("content", pathName), "utf-8");
  const data = JSON.parse(raw) as unknown;
  return schema.parse(data);
};

export const getSiteContent = cache(async (_locale: "es" = "es"): Promise<SiteContent> => {
  return parseJson("site.es.json", siteSchema);
});

export const getProducts = cache(async (_locale: "es" = "es"): Promise<ProductItem[]> => {
  return parseJson("products.es.json", productsSchema);
});

export const getFaq = cache(async (_locale: "es" = "es"): Promise<FAQItem[]> => {
  return parseJson("faq.es.json", faqSchema);
});

export const getGallery = cache(async (): Promise<GalleryItem[]> => {
  return parseJson("gallery.json", gallerySchema);
});

export const getAboutMarkdown = cache(async () => {
  return fs.readFile(file("content", "about.md"), "utf-8");
});
