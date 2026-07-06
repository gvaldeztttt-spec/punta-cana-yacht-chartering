import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BoatCard } from "@/components/BoatCard";
import { fleet, BoatCategory } from "@/data/fleet";

type Props = {
  params: Promise<{ locale: "en" | "es" }>;
  searchParams: Promise<{ category?: string }>;
};

const categories: Array<{ key: "all" | BoatCategory; labelKey: string }> = [
  { key: "all", labelKey: "filterAll" },
  { key: "yacht", labelKey: "filterYachts" },
  { key: "catamaran", labelKey: "filterCatamarans" },
  { key: "sailboat", labelKey: "filterSailboats" },
];

export default async function FleetPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("fleet");

  const activeCategory = (category ?? "all") as "all" | BoatCategory;
  const filteredFleet =
    activeCategory === "all"
      ? fleet
      : fleet.filter((boat) => boat.category === activeCategory);

  return (
    <div className="bg-sand">
      <section className="border-b border-sky/40 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold text-marine sm:text-5xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/75">
            {t("pageSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(({ key, labelKey }) => {
              const href = key === "all" ? "/fleet" : `/fleet?category=${key}`;
              const active = activeCategory === key;

              return (
                <Link
                  key={key}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-marine text-white"
                      : "border border-marine/20 bg-white text-marine hover:bg-sky-light"
                  }`}
                >
                  {t(labelKey)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredFleet.length === 0 ? (
            <p className="text-center text-foreground/70">{t("noResults")}</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredFleet.map((boat) => (
                <BoatCard key={boat.slug} boat={boat} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
