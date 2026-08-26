import nodemailer from "nodemailer";
import type Transporter from "nodemailer/lib/mailer";
import { Resend } from "resend";
import { buildCustomerQuoteEmail } from "@/lib/emails/customer-quote-email";
import { toNodemailerAttachments, toResendAttachments } from "@/lib/emails/email-assets";
import { siteConfig } from "@/lib/site";
import { QuoteRequest, QuoteSummary } from "@/lib/quote";

type EmailPayload = {
  request: QuoteRequest;
  summary: QuoteSummary;
};

export class EmailNotConfiguredError extends Error {
  constructor() {
    super("Email is not configured");
    this.name = "EmailNotConfiguredError";
  }
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function isEmailConfigured(): boolean {
  return isResendConfigured() || isSmtpConfigured();
}

function getFromAddress(): string {
  const from = process.env.SMTP_FROM ?? process.env.RESEND_FROM ?? siteConfig.email;
  return `${siteConfig.name} <${from}>`;
}

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE === "true";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(port === 587 && !secure ? { requireTLS: true } : {}),
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

function logPreview(payload: EmailPayload) {
  const customerEmail = buildCustomerQuoteEmail(payload);
  const businessEmail = buildBusinessEmail(payload);

  console.info("[quote email preview] Email not configured — messages were not sent");
  console.info("[quote email preview - customer subject]", customerEmail.subject);
  console.info("[quote email preview - customer text]\n", customerEmail.text);
  console.info("[quote email preview - business subject]", businessEmail.subject);
  console.info("[quote email preview - business text]\n", businessEmail.text);
}

async function sendViaResend(
  payload: EmailPayload,
  customerEmail: ReturnType<typeof buildCustomerQuoteEmail>,
  businessEmail: ReturnType<typeof buildBusinessEmail>,
): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = getFromAddress();
  const businessTo = process.env.QUOTE_TO_EMAIL ?? siteConfig.email;

  const customerResult = await resend.emails.send({
    from,
    to: payload.request.email,
    replyTo: businessTo,
    subject: customerEmail.subject,
    text: customerEmail.text,
    html: customerEmail.html,
    attachments: toResendAttachments(customerEmail.attachments),
  });

  if (customerResult.error) {
    throw new Error(customerResult.error.message);
  }

  const businessResult = await resend.emails.send({
    from,
    to: businessTo,
    replyTo: payload.request.email,
    subject: businessEmail.subject,
    text: businessEmail.text,
  });

  if (businessResult.error) {
    throw new Error(businessResult.error.message);
  }
}

async function sendViaSmtp(
  payload: EmailPayload,
  customerEmail: ReturnType<typeof buildCustomerQuoteEmail>,
  businessEmail: ReturnType<typeof buildBusinessEmail>,
): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) {
    throw new EmailNotConfiguredError();
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? siteConfig.email;
  const businessTo = process.env.QUOTE_TO_EMAIL ?? siteConfig.email;

  await transporter.verify();

  await transporter.sendMail({
    from,
    to: payload.request.email,
    replyTo: businessTo,
    subject: customerEmail.subject,
    text: customerEmail.text,
    html: customerEmail.html,
    attachments: toNodemailerAttachments(customerEmail.attachments),
  });

  await transporter.sendMail({
    from,
    to: businessTo,
    replyTo: payload.request.email,
    subject: businessEmail.subject,
    text: businessEmail.text,
  });
}

export async function sendQuoteEmails(payload: EmailPayload): Promise<{
  sent: boolean;
  preview: boolean;
}> {
  if (!isEmailConfigured()) {
    logPreview(payload);

    if (process.env.NODE_ENV === "production") {
      throw new EmailNotConfiguredError();
    }

    return { sent: false, preview: true };
  }

  const customerEmail = buildCustomerQuoteEmail(payload);
  const businessEmail = buildBusinessEmail(payload);

  if (isResendConfigured()) {
    await sendViaResend(payload, customerEmail, businessEmail);
  } else {
    await sendViaSmtp(payload, customerEmail, businessEmail);
  }

  return { sent: true, preview: false };
}

export { isEmailConfigured, isResendConfigured, isSmtpConfigured };
