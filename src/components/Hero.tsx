"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-marine text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,224,240,0.25),transparent_45%),linear-gradient(135deg,#0b3d5c_0%,#1e6b8c_55%,#0b3d5c_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-light backdrop-blur">
            {t("badge")}
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-light/90">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/fleet"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-marine transition hover:bg-sky-light"
            >
              {t("cta")}
            </Link>
          </div>

          <dl className="mt-12 grid gap-4 sm:grid-cols-3">
            {(["boats", "marina", "destinations"] as const).map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur"
              >
                <dt className="text-xs uppercase tracking-[0.16em] text-sky-light/80">
                  {t(`stats.${key}`)}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
