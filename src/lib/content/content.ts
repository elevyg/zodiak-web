import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  getParsedDocument,
  siteSchema,
  productsSchema,
  faqSchema,
  gallerySchema,
  aboutSchema,
  storySchema
} from "./repository";
import type { SiteContent, ProductItem, FAQItem, GalleryItem, AboutContent, StoryContent } from "./types";

const contentDir = path.join(process.cwd(), "content");

async function readJsonFile<T>(filename: string, schema: { parse: (v: unknown) => T }): Promise<T> {
  const raw = await fs.readFile(path.join(contentDir, filename), "utf-8");
  return schema.parse(JSON.parse(raw));
}

const defaultStoryContent: StoryContent = {
  image: "/images/galeria-01.jpg",
  imageAlt: "Top Les Vans en entorno de montaña",
  paragraphs: [
    "Por eso tratamos de diseñar un Top perfecto para que te sientas cómoda, hagas lo que hagas.",
    "Muy versátil para cualquier aventura al aire libre, puedes usarlo durante semanas mientras caminas por las montañas, escalas, corres,esquiás, haces yoga o te tiras a un lago. Rompiendo con el diseño clasico de la ropa deportiva, nuestros tops están diseñados para adaptarse a las mujeres modernas ... Sin costuras molestas, reversibles y extremadamente comodos.",
    "Nuestro Top \"Les Vans\" es el compañero perfecto para cualquier aventura. Tenemos una variedad enorme de colores. Todos nuestros Tops son de edición limitada."
  ]
};

export const getSiteContent = cache(async (_locale: "es" = "es"): Promise<SiteContent> => {
  const result = await getParsedDocument<SiteContent>("site");
  if (result) return result.content;
  return readJsonFile("site.es.json", siteSchema);
});

export const getProducts = cache(async (_locale: "es" = "es"): Promise<ProductItem[]> => {
  const result = await getParsedDocument<ProductItem[]>("products");
  if (result) return result.content;
  return readJsonFile("products.es.json", productsSchema);
});

export const getFaq = cache(async (_locale: "es" = "es"): Promise<FAQItem[]> => {
  const result = await getParsedDocument<FAQItem[]>("faq");
  if (result) return result.content;
  return readJsonFile("faq.es.json", faqSchema);
});

export const getGallery = cache(async (): Promise<GalleryItem[]> => {
  const result = await getParsedDocument<GalleryItem[]>("gallery");
  if (result) return result.content;
  return readJsonFile("gallery.json", gallerySchema);
});

export const getAboutMarkdown = cache(async (): Promise<string> => {
  const result = await getParsedDocument<AboutContent>("about");
  if (result) return result.content.markdown;
  const raw = await fs.readFile(path.join(contentDir, "about.md"), "utf-8");
  return aboutSchema.parse({ markdown: raw }).markdown;
});

export const getStoryContent = cache(async (): Promise<StoryContent> => {
  const result = await getParsedDocument<StoryContent>("story");
  if (result) return result.content;
  return defaultStoryContent;
});

export { siteSchema, productsSchema, faqSchema, gallerySchema, aboutSchema, storySchema };
