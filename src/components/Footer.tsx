"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-sky/40 bg-marine text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="font-display text-2xl font-semibold">Punta Cana Yacht Charting</div>
          <p className="mt-3 max-w-sm text-sm text-sky-light/90">{t("tagline")}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky">
            {t("fleet")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-sky-light/90">
            <li>
              <Link href="/fleet" className="transition hover:text-white">
                Our Fleet
              </Link>
            </li>
            <li>
              <Link href="/#destinations" className="transition hover:text-white">
                Destinations
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky">
            {t("contact")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-sky-light/90">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="transition hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.marina}</li>
          </ul>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-sky">
            {t("legal")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-sky-light/90">
            <li>
              <Link href="/terms" className="transition hover:text-white">
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-sky-light/70 sm:px-6 lg:px-8">
          {t("rights", { year })}
        </div>
      </div>
    </footer>
  );
}
