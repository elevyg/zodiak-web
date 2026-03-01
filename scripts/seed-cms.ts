import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getDocumentBySlug, upsertDocument } from "../src/lib/content/repository";

config({ path: join(process.cwd(), ".env") });

const contentDir = join(process.cwd(), "content");

const TITLES: Record<string, string> = {
  site: "Site",
  products: "Products",
  faq: "FAQ",
  gallery: "Gallery",
  about: "About",
  story: "Story"
};

async function seed() {
  const siteRaw = readFileSync(join(contentDir, "site.es.json"), "utf-8");
  const site = JSON.parse(siteRaw);

  const productsRaw = readFileSync(join(contentDir, "products.es.json"), "utf-8");
  const products = JSON.parse(productsRaw);

  const faqRaw = readFileSync(join(contentDir, "faq.es.json"), "utf-8");
  const faq = JSON.parse(faqRaw);

  const galleryRaw = readFileSync(join(contentDir, "gallery.json"), "utf-8");
  const gallery = JSON.parse(galleryRaw);

  const aboutMd = readFileSync(join(contentDir, "about.md"), "utf-8");
  const about = { markdown: aboutMd };

  const story = {
    image: "/images/galeria-01.jpg",
    imageAlt: "Top Les Vans en entorno de montaña",
    paragraphs: [
      "Por eso tratamos de diseñar un Top perfecto para que te sientas cómoda, hagas lo que hagas.",
      "Muy versátil para cualquier aventura al aire libre, puedes usarlo durante semanas mientras caminas por las montañas, escalas, corres,esquiás, haces yoga o te tiras a un lago. Rompiendo con el diseño clasico de la ropa deportiva, nuestros tops están diseñados para adaptarse a las mujeres modernas ... Sin costuras molestas, reversibles y extremadamente comodos.",
      "Nuestro Top \"Les Vans\" es el compañero perfecto para cualquier aventura. Tenemos una variedad enorme de colores. Todos nuestros Tops son de edición limitada."
    ]
  };

  const docs: { slug: string; content: unknown }[] = [
    { slug: "site", content: site },
    { slug: "products", content: products },
    { slug: "faq", content: faq },
    { slug: "gallery", content: gallery },
    { slug: "about", content: about },
    { slug: "story", content: story }
  ];

  for (const { slug, content } of docs) {
    const existing = await getDocumentBySlug(slug);
    if (existing) {
      console.log(`Skip ${slug} (already exists)`);
      continue;
    }
    const title = TITLES[slug] ?? slug;
    await upsertDocument(slug, title, JSON.stringify(content));
    console.log(`Seeded ${slug}`);
  }
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
