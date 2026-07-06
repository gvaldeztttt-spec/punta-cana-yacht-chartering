import nodemailer from "nodemailer";
import { buildCustomerQuoteEmail } from "@/lib/emails/customer-quote-email";
import { siteConfig } from "@/lib/site";
import { QuoteRequest, QuoteSummary } from "@/lib/quote";

type EmailPayload = {
  request: QuoteRequest;
  summary: QuoteSummary;
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE !== "false";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function durationLabel(duration: QuoteRequest["duration"], locale: "en" | "es"): string {
  if (locale === "es") {
    return duration === "half-day" ? "Medio día" : "Día completo";
  }
  return duration === "half-day" ? "Half day" : "Full day";
}

function buildBusinessEmail({ request, summary }: EmailPayload) {
  const subject = `New quote request: ${summary.boat.name} — ${request.name}`;

  const text = [
    "New instant quote request",
    "",
    `Name: ${request.name}`,
    `Email: ${request.email}`,
    `Phone: ${request.formattedPhone}`,
    `Boat: ${summary.boat.name} (${summary.boat.slug})`,
    `Preferred date: ${summary.formattedDate}`,
    `Duration: ${durationLabel(summary.duration, request.locale)}`,
    `Guests: ${request.guests}`,
    `Quoted price: $${summary.price.toLocaleString()} USD`,
    summary.destinationLabel
      ? `Preferred destination: ${summary.destinationLabel}`
      : "Preferred destination: Not specified",
    request.message ? `Message: ${request.message}` : "Message: None",
    "",
    `Reply to: ${request.email}`,
  ].join("\n");

  return { subject, text };
}

export async function sendQuoteEmails(payload: EmailPayload): Promise<{
  sent: boolean;
  preview: boolean;
}> {
  const transporter = getTransporter();
  const from =
    process.env.SMTP_FROM ?? process.env.SMTP_USER ?? siteConfig.email;
  const businessTo = process.env.QUOTE_TO_EMAIL ?? siteConfig.email;

  const customerEmail = buildCustomerQuoteEmail(payload);
  const businessEmail = buildBusinessEmail(payload);

  if (!transporter) {
    console.info("[quote email preview - customer subject]", customerEmail.subject);
    console.info("[quote email preview - customer text]\n", customerEmail.text);
    console.info("[quote email preview - business]", businessEmail);
    return { sent: false, preview: true };
  }

  await transporter.sendMail({
    from,
    to: payload.request.email,
    replyTo: businessTo,
    subject: customerEmail.subject,
    text: customerEmail.text,
    html: customerEmail.html,
  });

  await transporter.sendMail({
    from,
    to: businessTo,
    replyTo: payload.request.email,
    subject: businessEmail.subject,
    text: businessEmail.text,
  });

  return { sent: true, preview: false };
}
