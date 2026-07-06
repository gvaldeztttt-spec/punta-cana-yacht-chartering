import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/Hero";
import { BookingSteps } from "@/components/BookingSteps";
import { FleetSection } from "@/components/FleetSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { TrustSection } from "@/components/TrustSection";
import { ContactSection } from "@/components/ContactSection";
import { fleet } from "@/data/fleet";

type Props = {
  params: Promise<{ locale: "en" | "es" }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("fleet");

  const featuredYachts = fleet.filter((boat) => boat.category === "yacht" && boat.featured).slice(0, 3);
  const featuredCatamarans = fleet
    .filter((boat) => boat.category === "catamaran" && boat.featured)
    .slice(0, 3);
  const featuredSailboats = fleet.filter((boat) => boat.category === "sailboat");

  return (
    <>
      <Hero />
      <BookingSteps />
      <FleetSection
        title={t("popularYachts.title")}
        subtitle={t("popularYachts.subtitle")}
        boats={featuredYachts}
        locale={locale}
        category="yacht"
        viewAllLabel={t("viewAll", { category: locale === "es" ? "Yates" : "Yachts" })}
      />
      <FleetSection
        title={t("catamarans.title")}
        subtitle={t("catamarans.subtitle")}
        boats={featuredCatamarans}
        locale={locale}
        category="catamaran"
        viewAllLabel={t("viewAll", { category: locale === "es" ? "Catamaranes" : "Catamarans" })}
      />
      {featuredSailboats.length > 0 && (
        <FleetSection
          title={t("sailboats.title")}
          subtitle={t("sailboats.subtitle")}
          boats={featuredSailboats}
          locale={locale}
          category="sailboat"
          viewAllLabel={t("viewAll", { category: locale === "es" ? "Veleros" : "Sailboats" })}
        />
      )}
      <DestinationsSection />
      <TrustSection />
      <ContactSection />
    </>
  );
}
