"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/content/types";

type HeaderProps = {
  nav: NavItem[];
};

export function Header({ nav }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

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
          className="flex items-center rounded-2xl border border-border bg-border px-3 py-2 shadow-[0_6px_20px_rgba(28,28,28,0.12)]"
        >
          <Image
            src="/images/brand/logo-transparent.png"
            alt="Logo Zodiak"
            width={32}
            height={48}
            className="h-11 w-auto"
            priority
          />
        </a>

        <button
          type="button"
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
          className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border md:hidden ${
            isScrolled || isMenuOpen
              ? "border-border bg-border text-ink"
              : "border-[#f6ebdc8c] bg-[#f6ebdc3b] text-inverse backdrop-blur"
          }`}
        >
          <span className="sr-only">Menú</span>
          <span
            className={`absolute h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
              isMenuOpen ? "rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${
              isMenuOpen ? "-rotate-45" : "translate-y-2"
            }`}
          />
        </button>

        <nav
          aria-label="Principal"
          className={`hidden max-w-[60vw] gap-4 overflow-x-auto text-xs uppercase tracking-[0.12em] md:flex md:max-w-none md:gap-6 md:text-sm ${
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

      <div
        className={`md:hidden ${
          isMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        } absolute left-0 right-0 top-full px-4 transition-all duration-500`}
      >
        <div
          className={`mx-auto w-full max-w-[min(1100px,calc(100%-2rem))] origin-top rounded-3xl border border-border bg-bg/95 p-3 shadow-[0_18px_40px_rgba(28,28,28,0.16)] backdrop-blur-md transition-all duration-500 ${
            isMenuOpen ? "translate-y-2 scale-y-100 opacity-100" : "-translate-y-4 scale-y-95 opacity-0"
          }`}
        >
          <nav aria-label="Menú móvil" className="grid gap-1 text-sm uppercase tracking-[0.14em] text-ink">
            {nav.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-2xl px-4 py-3 transition hover:bg-surface hover:text-accentStrong ${
                  isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
                style={{
                  transitionDuration: "380ms",
                  transitionDelay: `${isMenuOpen ? 90 + index * 70 : 0}ms`
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
