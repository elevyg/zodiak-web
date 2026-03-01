import type { NavItem } from "@/lib/content/types";

type HeaderProps = {
  nav: NavItem[];
};

export function Header({ nav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <a href="#hero" className="text-2xl font-semibold tracking-[0.2em]">
          ZODIAK
        </a>
        <nav aria-label="Principal" className="flex max-w-[60vw] gap-4 overflow-x-auto text-xs uppercase tracking-[0.12em] md:max-w-none md:gap-6 md:text-sm">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-accentStrong">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
