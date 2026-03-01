import type { Metadata } from "next";
import { BrandSection } from "@/components/sections/brand-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FAQSection } from "@/components/sections/faq-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { Header } from "@/components/sections/header";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductsSection } from "@/components/sections/products-section";
import { getAboutMarkdown, getFaq, getGallery, getProducts, getSiteContent } from "@/lib/content/content";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent("es");

  return {
    title: site.meta.title,
    description: site.meta.description,
    openGraph: {
      title: site.meta.ogTitle,
      description: site.meta.ogDescription,
      locale: "es_AR",
      type: "website"
    }
  };
}

export default async function HomePage() {
  const [site, products, faq, gallery, aboutMarkdown] = await Promise.all([
    getSiteContent("es"),
    getProducts("es"),
    getFaq("es"),
    getGallery(),
    getAboutMarkdown()
  ]);

  return (
    <>
      <Header nav={site.nav} />
      <main>
        <HeroSection hero={site.hero} />
        <BrandSection title={site.brandStory.title} paragraphs={site.brandStory.paragraphs} markdown={aboutMarkdown} />
        <ProductsSection items={products} />
        <GallerySection items={gallery} />
        <FAQSection items={faq} />
        <ContactSection contact={site.contact} instagram={site.social.instagram} />
      </main>
      <footer className="container-shell border-t border-border py-8 text-xs uppercase tracking-[0.12em] text-inkMuted">
        © {new Date().getFullYear()} Zodiak. Hecho en Patagonia.
      </footer>
    </>
  );
}
