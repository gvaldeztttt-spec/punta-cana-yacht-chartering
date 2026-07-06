"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PaymentMethods } from "@/components/PaymentMethods";

const faqKeys = [
  "foodDrinks",
  "transportation",
  "casaDeCampoMarina",
  "cancellation",
  "pets",
  "paymentMethods",
] as const;

export function BoatFaqSection() {
  const t = useTranslations("faq");

  return (
    <section className="border-t border-sky/40 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-semibold text-marine sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-8 space-y-3">
          {faqKeys.map((key) => (
            <details
              key={key}
              className="group rounded-2xl border border-sky/50 bg-sand/30 open:bg-white open:shadow-sm"
            >
              <summary className="cursor-pointer list-none px-6 py-4 font-display text-lg font-semibold text-marine marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {t(`items.${key}.question`)}
                  <span className="text-ocean transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <div className="space-y-3 px-6 pb-5 text-sm leading-7 text-foreground/75">
                {key === "transportation" ? (
                  <>
                    <p>{t("items.transportation.answer")}</p>
                    <p>{t("items.transportation.rates")}</p>
                  </>
                ) : key === "cancellation" ? (
                  <p>
                    {t("items.cancellation.answerBeforeLink")}
                    <Link href="/terms" className="font-semibold text-ocean hover:text-marine">
                      {t("termsLink")}
                    </Link>
                    {t("items.cancellation.answerAfterLink")}
                  </p>
                ) : key === "paymentMethods" ? (
                  <>
                    <p>{t("items.paymentMethods.answer")}</p>
                    <PaymentMethods />
                  </>
                ) : (
                  <p>{t(`items.${key}.answer`)}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
