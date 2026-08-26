"use client";

import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useTranslations } from "next-intl";
import { Boat, Destination } from "@/data/fleet";
import { buildQuoteSummary } from "@/lib/quote";
import {
  getCountryPhoneLabel,
  getSortedCountryPhoneCodes,
} from "@/lib/phone-codes";

type QuoteFormProps = {
  boat: Boat;
  locale: "en" | "es";
};

const destinations: Destination[] = ["palmilla", "saona", "catalina"];

function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const countryPhoneCodes = getSortedCountryPhoneCodes();

export function QuoteForm({ boat, locale }: QuoteFormProps) {
  const t = useTranslations("quoteForm");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [duration, setDuration] = useState<"half-day" | "full-day">(
    boat.fullDayPrice ? "full-day" : "half-day",
  );
  const [guests, setGuests] = useState(Math.min(8, boat.passengers));
  const [destination, setDestination] = useState<Destination | "">("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const preferredDate = selectedDate ? toDateString(selectedDate) : "";

  const liveQuote = useMemo(() => {
    if (!preferredDate) return null;
    return buildQuoteSummary({
      boatSlug: boat.slug,
      locale,
      name: name || "Guest",
      email: email || "guest@example.com",
      phoneCountry: phoneCountry || "DO",
      phoneNumber: phoneNumber || "0000000",
      preferredDate,
      duration,
      guests,
      destination: destination || undefined,
      message: message || undefined,
    });
  }, [
    boat.slug,
    destination,
    duration,
    email,
    guests,
    locale,
    message,
    name,
    phoneCountry,
    phoneNumber,
    preferredDate,
  ]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boatSlug: boat.slug,
          locale,
          name,
          email,
          phoneCountry,
          phoneNumber,
          preferredDate,
          duration,
          guests,
          destination: destination || undefined,
          message: message || undefined,
          website,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? t("error"));
      }

      if (data.preview) {
        throw new Error(t("previewError"));
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : t("error"));
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-sky/50 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-marine">{t("successTitle")}</h2>
        <p className="mt-3 text-sm leading-7 text-foreground/75">{t("successMessage")}</p>
        {liveQuote && (
          <div className="mt-4 rounded-2xl bg-sky-light px-4 py-3 text-sm text-marine">
            <p className="font-semibold">{boat.name}</p>
            <p>{liveQuote.formattedDate}</p>
            <p>
              {t("estimatedPrice")}: ${liveQuote.price.toLocaleString()} USD
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      id="quote"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-sky/50 bg-white p-6 shadow-sm"
    >
      <h2 className="font-display text-xl font-semibold text-marine">{t("title")}</h2>
      <p className="mt-2 text-sm leading-7 text-foreground/70">{t("subtitle")}</p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="quote-name" className="text-sm font-medium text-marine">
            {t("name")}
          </label>
          <input
            id="quote-name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-sky/60 px-4 py-3 text-sm outline-none ring-marine/20 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="quote-email" className="text-sm font-medium text-marine">
            {t("email")}
          </label>
          <input
            id="quote-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-sky/60 px-4 py-3 text-sm outline-none ring-marine/20 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="quote-phone" className="text-sm font-medium text-marine">
            {t("phone")}
          </label>
          <div className="mt-2 flex flex-col gap-2">
            <select
              id="quote-country"
              value={phoneCountry}
              onChange={(event) => setPhoneCountry(event.target.value)}
              aria-label={t("phoneCountry")}
              required
              className="w-full rounded-xl border border-sky/60 px-2.5 py-2 text-xs outline-none ring-marine/20 focus:ring-2"
            >
              <option value="" disabled>
                {t("phoneCountryPlaceholder")}
              </option>
              {countryPhoneCodes.map((country) => (
                <option key={country.iso} value={country.iso}>
                  {getCountryPhoneLabel(country, locale)}
                </option>
              ))}
            </select>
            <input
              id="quote-phone"
              type="tel"
              inputMode="numeric"
              required
              value={phoneNumber}
              maxLength={15}
              onChange={(event) =>
                setPhoneNumber(event.target.value.replace(/[^\d\s()-]/g, ""))
              }
              placeholder={t("phonePlaceholder")}
              className="w-full rounded-xl border border-sky/60 px-3 py-2 text-sm outline-none ring-marine/20 focus:ring-2"
            />
          </div>
          <p className="mt-2 text-xs leading-5 text-foreground/60">{t("phoneHint")}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-marine">{t("preferredDate")}</p>
          <div className="mt-2">
            <div className="quote-calendar w-fit max-w-full rounded-xl border border-sky/60 bg-sky-light/40 px-2 py-1.5">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: new Date() }}
                required
              />
            </div>
          </div>
          {selectedDate && (
            <p className="mt-2 text-xs text-foreground/60">
              {t("selectedDate")}: {selectedDate.toLocaleDateString(locale === "es" ? "es-DO" : "en-US")}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="quote-duration" className="text-sm font-medium text-marine">
              {t("duration")}
            </label>
            <select
              id="quote-duration"
              value={duration}
              onChange={(event) =>
                setDuration(event.target.value as "half-day" | "full-day")
              }
              className="mt-2 w-full rounded-2xl border border-sky/60 px-4 py-3 text-sm outline-none ring-marine/20 focus:ring-2"
            >
              {boat.halfDayPrice && (
                <option value="half-day">
                  {t("halfDay")} — ${boat.halfDayPrice.toLocaleString()}
                </option>
              )}
              {boat.fullDayPrice && (
                <option value="full-day">
                  {t("fullDay")} — ${boat.fullDayPrice.toLocaleString()}
                </option>
              )}
            </select>
            <p className="mt-2 text-xs leading-5 text-foreground/60">
              {duration === "half-day" ? t("halfDaySchedule") : t("fullDaySchedule")}
            </p>
          </div>

          <div>
            <label htmlFor="quote-guests" className="text-sm font-medium text-marine">
              {t("guests")}
            </label>
            <input
              id="quote-guests"
              type="number"
              min={1}
              max={boat.passengers}
              required
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-sky/60 px-4 py-3 text-sm outline-none ring-marine/20 focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="quote-destination" className="text-sm font-medium text-marine">
            {t("destination")}
          </label>
          <select
            id="quote-destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value as Destination | "")}
            className="mt-2 w-full rounded-2xl border border-sky/60 px-4 py-3 text-sm outline-none ring-marine/20 focus:ring-2"
          >
            <option value="">{t("destinationOptional")}</option>
            {destinations.map((item) => (
              <option key={item} value={item}>
                {t(`destinations.${item}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quote-message" className="text-sm font-medium text-marine">
            {t("message")}
          </label>
          <input
            id="quote-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className="hidden"
            aria-hidden="true"
          />
          <textarea
            id="quote-message"
            rows={3}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-sky/60 px-4 py-3 text-sm outline-none ring-marine/20 focus:ring-2"
            placeholder={t("messagePlaceholder")}
          />
        </div>

        {liveQuote && (
          <div className="rounded-2xl bg-marine px-4 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-sky-light/80">
              {t("instantQuote")}
            </p>
            <p className="mt-2 text-2xl font-semibold">
              ${liveQuote.price.toLocaleString()} USD
            </p>
            <p className="mt-1 text-sm text-sky-light/90">
              {boat.name} · {liveQuote.formattedDate}
            </p>
          </div>
        )}

        {status === "error" && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={!selectedDate || status === "loading"}
          className="inline-flex w-full items-center justify-center rounded-full bg-marine px-6 py-3 text-sm font-semibold text-white transition hover:bg-marine-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? t("sending") : t("submit")}
        </button>
      </div>
    </form>
  );
}
