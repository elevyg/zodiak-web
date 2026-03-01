import { describe, it, expect } from "vitest";
import {
  siteSchema,
  productsSchema,
  faqSchema,
  gallerySchema,
  aboutSchema,
  storySchema
} from "../schemas";

describe("content schemas", () => {
  it("parses valid site document", () => {
    const site = {
      meta: { title: "x", description: "x", ogTitle: "x", ogDescription: "x" },
      nav: [{ label: "a", href: "/" }],
      hero: {
        eyebrow: "",
        title: "Hero",
        subtitle: "Sub",
        ctaPrimary: { label: "C1", href: "/" },
        ctaSecondary: { label: "C2", href: "/" },
        image: "/img.jpg",
        imageAlt: "Alt"
      },
      brandStory: { title: "Story", paragraphs: [] },
      reviews: { title: "R", subtitle: "S", items: [] },
      contact: { title: "C", subtitle: "S", location: "L", phone: "P", whatsappLink: "W" },
      social: { instagram: "" }
    };
    expect(siteSchema.parse(site)).toEqual(site);
  });

  it("parses valid products array", () => {
    const products = [{ id: "1", name: "P", description: "D", features: [], composition: "C", images: [] }];
    expect(productsSchema.parse(products)).toEqual(products);
  });

  it("parses valid faq array", () => {
    const faq = [{ question: "Q?", answer: "A" }];
    expect(faqSchema.parse(faq)).toEqual(faq);
  });

  it("parses valid gallery array", () => {
    const gallery = [{ src: "/a.jpg", alt: "A", width: 100, height: 100 }];
    expect(gallerySchema.parse(gallery)).toEqual(gallery);
  });

  it("parses valid about document", () => {
    const about = { markdown: "# Hi" };
    expect(aboutSchema.parse(about)).toEqual(about);
  });

  it("parses valid story document", () => {
    const story = { image: "/x.jpg", imageAlt: "Alt", paragraphs: ["P1"] };
    expect(storySchema.parse(story)).toEqual(story);
  });

  it("rejects invalid site (missing meta)", () => {
    expect(() => siteSchema.parse({})).toThrow();
  });

  it("rejects invalid story (missing image)", () => {
    expect(() => storySchema.parse({ imageAlt: "", paragraphs: [] })).toThrow();
  });
});
