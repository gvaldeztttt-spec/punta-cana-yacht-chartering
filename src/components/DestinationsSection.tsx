"use client";

import { useTranslations } from "next-intl";
import { DESTINATIONS } from "@/data/fleet";

export function DestinationsSection() {
  const t = useTranslations("destinations");

  return (
    <section id="destinations" className="bg-sand py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-marine sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground/75">{t("subtitle")}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <article
              key={destination}
              className="rounded-3xl border border-sky/50 bg-white p-6 shadow-sm"
            >
              <div className="inline-flex rounded-full bg-sky-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ocean">
                {t(`${destination}.tag`)}
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold text-marine">
                {t(`${destination}.name`)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-foreground/75">
                {t(`${destination}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
