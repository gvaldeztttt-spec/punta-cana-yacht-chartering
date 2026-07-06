"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type BoatGalleryProps = {
  images: string[];
  boatName: string;
};

const VISIBLE_COUNT = 3;

export function BoatGallery({ images, boatName }: BoatGalleryProps) {
  const t = useTranslations("boatDetail");
  const [expanded, setExpanded] = useState(false);
  const hiddenCount = Math.max(images.length - VISIBLE_COUNT, 0);
  const visibleImages = expanded ? images : images.slice(0, VISIBLE_COUNT);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {visibleImages.map((image, index) => {
          const isHero = index === 0;
          const isLastVisible = !expanded && index === VISIBLE_COUNT - 1 && hiddenCount > 0;

          return (
            <div
              key={image}
              className={`relative overflow-hidden rounded-3xl bg-white shadow-sm ${
                isHero ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={image}
                alt={`${boatName} photo ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {isLastVisible && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="absolute inset-0 flex items-center justify-center bg-marine/55 text-white transition hover:bg-marine/65"
                  aria-label={t("viewAllPhotos", { count: images.length })}
                >
                  <span className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur">
                    {t("viewAllPhotos", { count: images.length })}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-4 text-sm font-semibold text-ocean transition hover:text-marine"
        >
          {t("showLessPhotos")}
        </button>
      )}
    </div>
  );
}
