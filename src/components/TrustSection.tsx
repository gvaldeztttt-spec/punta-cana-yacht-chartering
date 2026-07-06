"use client";

import { useTranslations } from "next-intl";

const trustKeys = ["private", "crew", "booking", "destinations"] as const;

export function TrustSection() {
  const t = useTranslations("trust");

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-marine sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground/75">{t("subtitle")}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustKeys.map((key, index) => (
            <article
              key={key}
              className="rounded-3xl border border-sky/50 bg-white p-6 shadow-sm"
            >
              <div className="text-sm font-semibold text-ocean">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold text-marine">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-7 text-foreground/75">
                {t(`items.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
