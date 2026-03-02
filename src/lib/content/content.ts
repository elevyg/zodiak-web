import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  getParsedDocument,
  type Locale,
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

async function readJsonFileIfExists<T>(filename: string, schema: { parse: (v: unknown) => T }): Promise<T | null> {
  try {
    return await readJsonFile(filename, schema);
  } catch {
    return null;
  }
}

const defaultStoryContentEs: StoryContent = {
  image: "/images/galeria-01.jpg",
  imageAlt: "Top Les Vans en entorno de montaña",
  paragraphs: [
    "Por eso tratamos de diseñar un Top perfecto para que te sientas cómoda, hagas lo que hagas.",
    "Muy versátil para cualquier aventura al aire libre, puedes usarlo durante semanas mientras caminas por las montañas, escalas, corres,esquiás, haces yoga o te tiras a un lago. Rompiendo con el diseño clasico de la ropa deportiva, nuestros tops están diseñados para adaptarse a las mujeres modernas ... Sin costuras molestas, reversibles y extremadamente comodos.",
    "Nuestro Top \"Les Vans\" es el compañero perfecto para cualquier aventura. Tenemos una variedad enorme de colores. Todos nuestros Tops son de edición limitada."
  ]
};

const defaultStoryContentEn: StoryContent = {
  image: "/images/galeria-01.jpg",
  imageAlt: "Les Vans top in mountain setting",
  paragraphs: [
    "That’s why we set out to design the perfect top so you feel comfortable whatever you do.",
    "Versatile for any outdoor adventure, you can wear it for weeks while hiking, climbing, running, skiing, doing yoga or by the lake. Breaking away from classic sportswear design, our tops are made for modern women … No annoying seams, reversible and extremely comfortable.",
    "Our Les Vans top is the perfect companion for any adventure. We offer a wide range of colours. All our tops are limited edition."
  ]
};

export const getSiteContent = cache(async (locale: Locale = "es"): Promise<SiteContent> => {
  const result = await getParsedDocument<SiteContent>("site", locale);
  if (result) return result.content;
  const file = await readJsonFileIfExists(`site.${locale}.json`, siteSchema);
  if (file) return file;
  return readJsonFile("site.es.json", siteSchema);
});

export const getProducts = cache(async (locale: Locale = "es"): Promise<ProductItem[]> => {
  const result = await getParsedDocument<ProductItem[]>("products", locale);
  if (result) return result.content;
  const file = await readJsonFileIfExists(`products.${locale}.json`, productsSchema);
  if (file) return file;
  return readJsonFile("products.es.json", productsSchema);
});

export const getFaq = cache(async (locale: Locale = "es"): Promise<FAQItem[]> => {
  const result = await getParsedDocument<FAQItem[]>("faq", locale);
  if (result) return result.content;
  const file = await readJsonFileIfExists(`faq.${locale}.json`, faqSchema);
  if (file) return file;
  return readJsonFile("faq.es.json", faqSchema);
});

export const getGallery = cache(async (locale: Locale = "es"): Promise<GalleryItem[]> => {
  const result = await getParsedDocument<GalleryItem[]>("gallery", locale);
  if (result) return result.content;
  const file = await readJsonFileIfExists(`gallery.${locale}.json`, gallerySchema);
  if (file) return file;
  return readJsonFile("gallery.json", gallerySchema);
});

export const getAboutMarkdown = cache(async (locale: Locale = "es"): Promise<string> => {
  const result = await getParsedDocument<AboutContent>("about", locale);
  if (result) return result.content.markdown;
  const enPath = path.join(contentDir, "about.en.md");
  const esPath = path.join(contentDir, "about.md");
  const pathToRead = locale === "en" ? enPath : esPath;
  try {
    const raw = await fs.readFile(pathToRead, "utf-8");
    return aboutSchema.parse({ markdown: raw }).markdown;
  } catch {
    const raw = await fs.readFile(esPath, "utf-8");
    return aboutSchema.parse({ markdown: raw }).markdown;
  }
});

export const getStoryContent = cache(async (locale: Locale = "es"): Promise<StoryContent> => {
  const result = await getParsedDocument<StoryContent>("story", locale);
  if (result) return result.content;
  return locale === "en" ? defaultStoryContentEn : defaultStoryContentEs;
});

export { siteSchema, productsSchema, faqSchema, gallerySchema, aboutSchema, storySchema };
