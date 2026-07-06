"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

export function ContactSection() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="bg-marine py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">{t("title")}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-sky-light/90">
              {t("subtitle")}
            </p>
            <Link
              href="/fleet"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-marine transition hover:bg-sky-light"
            >
              {t("cta")}
            </Link>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="font-semibold uppercase tracking-[0.14em] text-sky">
                  {t("emailLabel")}
                </dt>
                <dd className="mt-2 text-lg">
                  <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold uppercase tracking-[0.14em] text-sky">
                  {t("locationLabel")}
                </dt>
                <dd className="mt-2 text-sky-light/90">{t("location")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
