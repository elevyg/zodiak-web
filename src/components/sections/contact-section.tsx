import type { SiteContent } from "@/lib/content/types";

type ContactSectionProps = {
  contact: SiteContent["contact"];
  instagram: string;
};

export function ContactSection({ contact, instagram }: ContactSectionProps) {
  return (
    <section id="contacto" className="container-shell py-16 md:py-24">
      <div className="rounded-[2rem] border border-border bg-ink p-8 text-inverse md:p-12">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{contact.subtitle}</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">{contact.title}</h2>
        <p className="mt-4 max-w-xl text-[#f5efe6]">{contact.location}</p>
        <p className="mt-2 text-[#eee5da]">{contact.phone}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] text-ink transition hover:bg-accentStrong"
          >
            WhatsApp
          </a>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#f5e8d8] px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] transition hover:border-accent hover:text-accent"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
