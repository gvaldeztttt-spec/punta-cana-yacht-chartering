import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Boat, BoatCategory } from "@/data/fleet";
import { BoatCard } from "./BoatCard";

type FleetSectionProps = {
  title: string;
  subtitle: string;
  boats: Boat[];
  locale: "en" | "es";
  category: BoatCategory;
  viewAllLabel: string;
};

export async function FleetSection({
  title,
  subtitle,
  boats,
  locale,
  category,
  viewAllLabel,
}: FleetSectionProps) {
  if (boats.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-marine sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground/75">{subtitle}</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {boats.map((boat) => (
            <BoatCard key={boat.slug} boat={boat} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={`/fleet?category=${category}`}
            className="inline-flex rounded-full border border-marine px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-marine transition hover:bg-marine hover:text-white"
          >
            {viewAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
