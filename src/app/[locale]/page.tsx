import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BrandSection } from "@/components/sections/brand-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FAQSection } from "@/components/sections/faq-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { Header } from "@/components/sections/header";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductsSection } from "@/components/sections/products-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { StorySection } from "@/components/sections/story-section";
import { getAboutMarkdown, getFaq, getGallery, getProducts, getSiteContent, getStoryContent } from "@/lib/content/content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const site = await getSiteContent(locale as "es" | "en");
  const baseUrl = "https://zodiak-web.vercel.app";

  return {
    title: site.meta.title,
    description: site.meta.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: { es: `${baseUrl}/es`, en: `${baseUrl}/en` }
    },
    openGraph: {
      title: site.meta.ogTitle,
      description: site.meta.ogDescription,
      locale: locale === "es" ? "es_AR" : "en_US",
      type: "website",
      url: `${baseUrl}/${locale}`
    }
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const loc = locale as "es" | "en";

  const [site, products, faq, gallery, aboutMarkdown, story] = await Promise.all([
    getSiteContent(loc),
    getProducts(loc),
    getFaq(loc),
    getGallery(loc),
    getAboutMarkdown(loc),
    getStoryContent(loc)
  ]);

  const t = await getTranslations("footer");

  return (
    <>
      <Header nav={site.nav} locale={loc} />
      <main>
        <HeroSection hero={site.hero} instagram={site.social.instagram} />
        <StorySection image={story.image} imageAlt={story.imageAlt} paragraphs={story.paragraphs} />
        <ReviewsSection reviews={site.reviews} />
        <BrandSection title={site.brandStory.title} paragraphs={site.brandStory.paragraphs} markdown={aboutMarkdown} />
        <ProductsSection items={products} />
        <GallerySection items={gallery} />
        <FAQSection items={faq} />
        <ContactSection contact={site.contact} instagram={site.social.instagram} />
      </main>
      <footer className="container-shell border-t border-border py-8 text-xs uppercase tracking-[0.12em] text-inkMuted">
        © {new Date().getFullYear()} Zodiak. {t("madeIn")}
      </footer>
    </>
  );
}
