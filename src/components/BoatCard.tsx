import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Boat, getBoatCoverImage, getStartingPrice } from "@/data/fleet";

type BoatCardProps = {
  boat: Boat;
};

export async function BoatCard({ boat }: BoatCardProps) {
  const t = await getTranslations("boatCard");
  const cover = getBoatCoverImage(boat.slug);
  const startingPrice = getStartingPrice(boat);

  return (
    <article className="group overflow-hidden rounded-3xl border border-sky/50 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/boats/${boat.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-sky-light">
          <Image
            src={cover}
            alt={boat.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-marine shadow-sm">
            {t("from")} ${startingPrice.toLocaleString()}
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div>
          <Link href={`/boats/${boat.slug}`}>
            <h3 className="font-display text-2xl font-semibold text-marine transition group-hover:text-ocean">
              {boat.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm text-foreground/70">
            {boat.length} | {t("guests", { count: boat.passengers })} | 📍 {t("location")}
          </p>
          <p className="mt-1 text-xs text-foreground/60">
            {t("startingPrice", { price: startingPrice.toLocaleString() })}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={`/boats/${boat.slug}`}
            className="inline-flex flex-1 items-center justify-center rounded-full border border-marine/20 px-4 py-2.5 text-sm font-semibold text-marine transition hover:border-marine hover:bg-sky-light"
          >
            {t("details")}
          </Link>
          <Link
            href={`/boats/${boat.slug}#quote`}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-marine px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-marine-dark"
          >
            {t("getQuote")}
          </Link>
        </div>
      </div>
    </article>
  );
}
