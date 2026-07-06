"use client";

import { useTranslations } from "next-intl";

export function BookingSteps() {
  const t = useTranslations("steps");

  const steps = [
    { number: "1", label: t("step1") },
    { number: "2", label: t("step2") },
    { number: "3", label: t("step3") },
  ];

  return (
    <section className="border-y border-sky/40 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-marine text-lg font-bold text-white">
                {step.number}
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-marine">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
