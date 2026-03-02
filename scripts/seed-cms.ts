import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getDocumentBySlug, upsertDocument, type Locale } from "../src/lib/content/repository";

const contentDir = join(process.cwd(), "content");

const TITLES: Record<string, string> = {
  site: "Site",
  products: "Products",
  faq: "FAQ",
  gallery: "Gallery",
  about: "About",
  story: "Story"
};

const STORY_ES = {
  image: "/images/galeria-01.jpg",
  imageAlt: "Top Les Vans en entorno de montaña",
  paragraphs: [
    "Por eso tratamos de diseñar un Top perfecto para que te sientas cómoda, hagas lo que hagas.",
    "Muy versátil para cualquier aventura al aire libre, puedes usarlo durante semanas mientras caminas por las montañas, escalas, corres,esquiás, haces yoga o te tiras a un lago. Rompiendo con el diseño clasico de la ropa deportiva, nuestros tops están diseñados para adaptarse a las mujeres modernas ... Sin costuras molestas, reversibles y extremadamente comodos.",
    "Nuestro Top \"Les Vans\" es el compañero perfecto para cualquier aventura. Tenemos una variedad enorme de colores. Todos nuestros Tops son de edición limitada."
  ]
};

const STORY_EN = {
  image: "/images/galeria-01.jpg",
  imageAlt: "Les Vans top in mountain setting",
  paragraphs: [
    "That's why we set out to design the perfect top so you feel comfortable whatever you do.",
    "Versatile for any outdoor adventure, you can wear it for weeks while hiking, climbing, running, skiing, doing yoga or by the lake. Breaking away from classic sportswear design, our tops are made for modern women … No annoying seams, reversible and extremely comfortable.",
    "Our Les Vans top is the perfect companion for any adventure. We offer a wide range of colours. All our tops are limited edition."
  ]
};

function loadLocaleContent(locale: Locale): { slug: string; content: unknown }[] {
  const site = JSON.parse(
    readFileSync(join(contentDir, `site.${locale}.json`), "utf-8")
  );
  const products = JSON.parse(
    readFileSync(join(contentDir, `products.${locale}.json`), "utf-8")
  );
  const faq = JSON.parse(
    readFileSync(join(contentDir, `faq.${locale}.json`), "utf-8")
  );
  const galleryFile = locale === "en" ? "gallery.en.json" : "gallery.json";
  const gallery = JSON.parse(
    readFileSync(join(contentDir, galleryFile), "utf-8")
  );
  const aboutFile = locale === "en" ? "about.en.md" : "about.md";
  const about = { markdown: readFileSync(join(contentDir, aboutFile), "utf-8") };
  const story = locale === "en" ? STORY_EN : STORY_ES;

  return [
    { slug: "site", content: site },
    { slug: "products", content: products },
    { slug: "faq", content: faq },
    { slug: "gallery", content: gallery },
    { slug: "about", content: about },
    { slug: "story", content: story }
  ];
}

async function seed() {
  const locales: Locale[] = ["es", "en"];
  for (const locale of locales) {
    console.log(`Seeding locale: ${locale}`);
    const docs = loadLocaleContent(locale);
    for (const { slug, content } of docs) {
      const existing = await getDocumentBySlug(slug, locale);
      if (existing) {
        console.log(`  Skip ${slug} (${locale}) (already exists)`);
        continue;
      }
      const title = TITLES[slug] ?? slug;
      await upsertDocument(slug, locale, title, JSON.stringify(content));
      console.log(`  Seeded ${slug} (${locale})`);
    }
  }
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
