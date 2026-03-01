export type NavItem = {
  label: string;
  href: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: NavItem[];
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
    image: string;
    imageAlt: string;
  };
  brandStory: {
    title: string;
    paragraphs: string[];
  };
  reviews: {
    title: string;
    subtitle: string;
    items: {
      name: string;
      age: number;
      quote: string;
    }[];
  };
  contact: {
    title: string;
    subtitle: string;
    location: string;
    phone: string;
    whatsappLink: string;
  };
  social: {
    instagram: string;
  };
};

export type ProductItem = {
  id: string;
  name: string;
  description: string;
  features: string[];
  composition: string;
  images: string[];
  badge?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type GalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};
