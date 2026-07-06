import { z } from "zod";
import { Boat, Destination, getBoatBySlug } from "@/data/fleet";
import {
  COUNTRY_PHONE_CODES,
  formatDisplayPhone,
  normalizePhoneDigits,
  validatePhoneNumber,
} from "@/lib/phone-codes";

const phoneCountryValues = COUNTRY_PHONE_CODES.map((country) => country.iso) as [
  string,
  ...string[],
];

export const quoteRequestSchema = z
  .object({
    boatSlug: z.string().min(1),
    locale: z.enum(["en", "es"]),
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(200),
    phoneCountry: z.enum(phoneCountryValues),
    phoneNumber: z.string().trim().min(1).max(20),
    preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    duration: z.enum(["half-day", "full-day"]),
    guests: z.coerce.number().int().min(1).max(200),
    destination: z.enum(["palmilla", "saona", "catalina"]).optional(),
    message: z.string().trim().max(1000).optional(),
  })
  .superRefine((data, ctx) => {
    if (!validatePhoneNumber(data.phoneCountry, data.phoneNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number for selected country",
        path: ["phoneNumber"],
      });
    }

    if (!/^\d+$/.test(normalizePhoneDigits(data.phoneNumber))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone number must contain digits only",
        path: ["phoneNumber"],
      });
    }
  });

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
export type QuoteRequest = QuoteRequestInput & {
  formattedPhone: string;
};

export type QuoteSummary = {
  boat: Boat;
  duration: QuoteRequestInput["duration"];
  price: number;
  preferredDate: string;
  formattedDate: string;
  destinationLabel?: string;
};

const destinationLabels: Record<Destination, { en: string; es: string }> = {
  palmilla: { en: "Palmilla Beach", es: "Playa Palmilla" },
  saona: { en: "Saona Island", es: "Isla Saona" },
  catalina: { en: "Catalina Island", es: "Isla Catalina" },
};

export function formatQuoteDate(date: string, locale: "en" | "es"): string {
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(locale === "es" ? "es-DO" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

export function buildQuoteSummary(input: QuoteRequestInput): QuoteSummary | null {
  const boat = getBoatBySlug(input.boatSlug);
  if (!boat) return null;

  const price =
    input.duration === "half-day" ? boat.halfDayPrice : boat.fullDayPrice;

  if (price == null) return null;

  return {
    boat,
    duration: input.duration,
    price,
    preferredDate: input.preferredDate,
    formattedDate: formatQuoteDate(input.preferredDate, input.locale),
    destinationLabel: input.destination
      ? destinationLabels[input.destination][input.locale]
      : undefined,
  };
}

export function validateQuoteRequest(data: unknown): {
  success: true;
  data: QuoteRequest;
  summary: QuoteSummary;
} | {
  success: false;
  error: string;
} {
  const parsed = quoteRequestSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const preferred = new Date(`${parsed.data.preferredDate}T12:00:00`);
  if (preferred < today) {
    return { success: false, error: "Preferred date must be today or later" };
  }

  const summary = buildQuoteSummary(parsed.data);
  if (!summary) {
    return { success: false, error: "Selected duration is not available for this boat" };
  }

  if (parsed.data.guests > summary.boat.passengers) {
    return {
      success: false,
      error: `This boat accommodates up to ${summary.boat.passengers} guests`,
    };
  }

  return {
    success: true,
    data: {
      ...parsed.data,
      formattedPhone: formatDisplayPhone(parsed.data.phoneCountry, parsed.data.phoneNumber),
    },
    summary,
  };
}
