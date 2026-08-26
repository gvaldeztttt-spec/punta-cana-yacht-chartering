"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/Logo";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/fleet", label: t("fleet") },
    { href: "/#destinations", label: t("destinations") },
    { href: "/#contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-sky/40 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-marine/80 transition hover:text-marine"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <Link
            href="/fleet"
            className="rounded-full bg-marine px-4 py-2 text-sm font-semibold text-white transition hover:bg-marine-dark"
          >
            {t("getQuote")}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-sky/60 p-2 text-marine md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="text-xl leading-none">{open ? "×" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-sky/40 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-marine"
              >
                {link.label}
              </Link>
            ))}
            <LocaleSwitcher />
            <Link
              href="/fleet"
              className="rounded-full bg-marine px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {t("getQuote")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center rounded-full border border-sky/60 bg-sky-light p-1 text-xs font-semibold">
      <Link
        href={pathname}
        locale="en"
        className={`rounded-full px-3 py-1 transition ${
          locale === "en" ? "bg-white text-marine shadow-sm" : "text-marine/70"
        }`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="es"
        className={`rounded-full px-3 py-1 transition ${
          locale === "es" ? "bg-white text-marine shadow-sm" : "text-marine/70"
        }`}
      >
        ES
      </Link>
    </div>
  );
}
