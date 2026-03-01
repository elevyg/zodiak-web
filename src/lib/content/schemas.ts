import { z } from "zod";

export const siteSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
    ogTitle: z.string(),
    ogDescription: z.string()
  }),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
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
    items: z.array(z.object({ name: z.string(), age: z.number(), quote: z.string() }))
  }),
  contact: z.object({
    title: z.string(),
    subtitle: z.string(),
    location: z.string(),
    phone: z.string(),
    whatsappLink: z.string()
  }),
  social: z.object({ instagram: z.string() })
});

export const productsSchema = z.array(
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

export const faqSchema = z.array(z.object({ question: z.string(), answer: z.string() }));

export const gallerySchema = z.array(
  z.object({
    src: z.string(),
    alt: z.string(),
    width: z.number(),
    height: z.number(),
    priority: z.boolean().optional()
  })
);

export const aboutSchema = z.object({ markdown: z.string() });

export const storySchema = z.object({
  image: z.string(),
  imageAlt: z.string(),
  paragraphs: z.array(z.string())
});

export type SiteContent = z.infer<typeof siteSchema>;
export type ProductItem = z.infer<typeof productsSchema>[number];
export type FAQItem = z.infer<typeof faqSchema>[number];
export type GalleryItem = z.infer<typeof gallerySchema>[number];
export type AboutContent = z.infer<typeof aboutSchema>;
export type StoryContent = z.infer<typeof storySchema>;

export const DOCUMENT_SCHEMAS: Record<string, z.ZodType> = {
  site: siteSchema,
  products: productsSchema,
  faq: faqSchema,
  gallery: gallerySchema,
  about: aboutSchema,
  story: storySchema
};

export const CMS_SLUGS = ["site", "products", "faq", "gallery", "about", "story"] as const;
export type CmsSlug = (typeof CMS_SLUGS)[number];
