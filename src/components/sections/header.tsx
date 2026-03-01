"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/content/types";

type HeaderProps = {
  nav: NavItem[];
};

export function Header({ nav }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "border-b border-border bg-bg/95 shadow-[0_8px_24px_rgba(28,28,28,0.08)] backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-shell flex items-center justify-between py-4">
        <a
          href="#hero"
          className={`text-2xl font-semibold tracking-[0.2em] transition-colors ${
            isScrolled ? "text-ink" : "text-inverse"
          }`}
        >
          ZODIAK
        </a>
        <nav
          aria-label="Principal"
          className={`flex max-w-[60vw] gap-4 overflow-x-auto text-xs uppercase tracking-[0.12em] md:max-w-none md:gap-6 md:text-sm ${
            isScrolled ? "text-ink" : "text-inverse"
          }`}
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`transition ${isScrolled ? "hover:text-accentStrong" : "hover:text-accent"}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
