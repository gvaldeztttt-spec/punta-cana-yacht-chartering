import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: "en" | "es" }>;
};

const policyKeys = [
  "threeDays",
  "oneToTwoDays",
  "sameDay",
  "naturalPhenomena",
  "holiday",
  "rescheduling",
] as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return {
    title: `${t("title")} | Punta Cana Yacht Charting`,
    description: t("metaDescription"),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  return (
    <div className="bg-sand">
      <section className="border-b border-sky/40 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold text-marine sm:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <article className="rounded-3xl border border-sky/50 bg-white p-8 shadow-sm">
            <h2 className="font-display text-2xl font-semibold text-marine">
              {t("cancellationTitle")}
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-foreground/75">
              {policyKeys.map((key) => (
                <li key={key} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ocean" />
                  <span>{t(`policies.${key}`)}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}
