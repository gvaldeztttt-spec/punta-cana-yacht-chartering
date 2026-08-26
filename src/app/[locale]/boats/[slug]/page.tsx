import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { QuoteForm } from "@/components/QuoteForm";
import { BoatGallery } from "@/components/BoatGallery";
import { BoatFaqSection } from "@/components/BoatFaqSection";
import { fleet, getBoatBySlug, getBoatImages, getCharterInclusions } from "@/data/fleet";

type Props = {
  params: Promise<{ locale: "en" | "es"; slug: string }>;
};

export function generateStaticParams() {
  return fleet.flatMap((boat) =>
    ["en", "es"].map((locale) => ({
      locale,
      slug: boat.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const boat = getBoatBySlug(slug);
  if (!boat) return {};

  return {
    title: `${boat.name} | Punta Cana Yacht Charting`,
    description: `Charter the ${boat.name} from Casa de Campo Marina.`,
  };
}

export default async function BoatDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const boat = getBoatBySlug(slug);

  if (!boat) notFound();

  const t = await getTranslations("boatDetail");
  const tDest = await getTranslations("destinations");
  const images = getBoatImages(slug);
  const inclusions = getCharterInclusions(locale);

  const vesselSpecRows = [
    boat.model ? { label: t("model"), value: boat.model } : null,
    boat.year ? { label: t("year"), value: boat.year } : null,
    { label: t("length"), value: boat.length },
    { label: t("capacity"), value: String(boat.passengers) },
    boat.engines ? { label: t("engines"), value: boat.engines } : null,
    boat.maxSpeed ? { label: t("maxSpeed"), value: boat.maxSpeed } : null,
    { label: t("departure"), value: boat.departure },
    { label: t("category"), value: t(`categories.${boat.category}`) },
  ].filter((row): row is { label: string; value: string } => row !== null);

  return (
    <div className="bg-sand">
      <section className="relative overflow-hidden bg-marine text-white">
        <div className="absolute inset-0">
          <Image
            src={images[0]}
            alt={boat.name}
            fill
            priority
            className="object-cover opacity-35"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Link href="/fleet" className="text-sm text-sky-light hover:text-white">
            ← {t("backToFleet")}
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
            {boat.name}
          </h1>
          <p className="mt-3 text-lg text-sky-light/90">
            {boat.length} | {boat.passengers} guests | {boat.departure}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-marine">
                {t("gallery")}
              </h2>
              <div className="mt-6">
                <BoatGallery images={images} boatName={boat.name} />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-sky/50 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-marine">{t("specs")}</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  {vesselSpecRows.map((row, index) => (
                    <div
                      key={row.label}
                      className={`flex justify-between gap-4 ${
                        index < vesselSpecRows.length - 1
                          ? "border-b border-sky/30 pb-3"
                          : ""
                      }`}
                    >
                      <dt className="text-foreground/60">{row.label}</dt>
                      <dd
                        className={`font-semibold text-marine ${
                          row.label === t("departure") ? "text-right" : ""
                        }`}
                      >
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-3xl border border-sky/50 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-marine">{t("pricing")}</h2>
                <dl className="mt-4 space-y-4 text-sm">
                  <div className="border-b border-sky/30 pb-3">
                    <div className="flex justify-between gap-4">
                      <dt className="text-foreground/60">{t("halfDay")}</dt>
                      <dd className="font-semibold text-marine">
                        {boat.halfDayPrice
                          ? `$${boat.halfDayPrice.toLocaleString()}`
                          : t("notAvailable")}
                      </dd>
                    </div>
                    {boat.halfDayPrice && (
                      <dd className="mt-2 text-xs leading-5 text-foreground/60">
                        {t("halfDaySchedule")}
                      </dd>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-foreground/60">{t("fullDay")}</dt>
                      <dd className="font-semibold text-marine">
                        {boat.fullDayPrice
                          ? `$${boat.fullDayPrice.toLocaleString()}`
                          : t("notAvailable")}
                      </dd>
                    </div>
                    {boat.fullDayPrice && (
                      <dd className="mt-2 text-xs leading-5 text-foreground/60">
                        {t("fullDaySchedule")}
                      </dd>
                    )}
                  </div>
                </dl>
              </div>

              <div className="rounded-3xl border border-sky/50 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-marine">{t("includes")}</h2>
                <ul className="mt-4 space-y-2 text-sm text-foreground/75">
                  {inclusions.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-sky/50 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-marine">
                  {t("destinations")}
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-foreground/75">
                  {boat.destinations.map((destination) => (
                    <li key={destination}>• {tDest(`${destination}.name`)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <QuoteForm boat={boat} locale={locale} />
          </aside>
        </div>
      </section>

      <BoatFaqSection />
    </div>
  );
}
