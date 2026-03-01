import type { SiteContent } from "@/lib/content/types";

type ContactSectionProps = {
  contact: SiteContent["contact"];
  instagram: string;
};

export function ContactSection({ contact, instagram }: ContactSectionProps) {
  return (
    <section id="contacto" className="container-shell py-16 md:py-24">
      <div className="rounded-[2rem] border border-black/15 bg-[#2f2421] p-8 text-cream md:p-12">
        <p className="text-xs uppercase tracking-[0.2em] text-sand">{contact.subtitle}</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">{contact.title}</h2>
        <p className="mt-4 max-w-xl text-cream/85">{contact.location}</p>
        <p className="mt-2 text-cream/80">{contact.phone}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-sand px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-ink transition hover:bg-[#c7a588]"
          >
            WhatsApp
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-cream/50 px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] transition hover:border-cream"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
