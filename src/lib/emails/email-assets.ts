import fs from "node:fs";
import path from "node:path";
import { PaymentLogoId, PAYMENT_LOGOS } from "@/lib/payment-methods";
import { siteConfig } from "@/lib/site";

export type QuoteEmailAttachment = {
  cid: string;
  filename: string;
  path: string;
};

function publicPath(...segments: string[]): string {
  return path.join(process.cwd(), "public", ...segments);
}

function resolveBoatImagePath(boatSlug: string): string | null {
  const preferred = publicPath("boats", boatSlug, "01.jpg");
  if (fs.existsSync(preferred)) {
    return preferred;
  }

  const boatDir = publicPath("boats", boatSlug);
  if (!fs.existsSync(boatDir)) {
    return null;
  }

  const fallback = fs
    .readdirSync(boatDir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort()[0];

  return fallback ? path.join(boatDir, fallback) : null;
}

export function buildQuoteEmailAttachments(boatSlug: string): QuoteEmailAttachment[] {
  const attachments: QuoteEmailAttachment[] = [];

  const brandLogo = publicPath("brand", "logo-light.png");
  if (fs.existsSync(brandLogo)) {
    attachments.push({
      cid: "brand-logo",
      filename: "logo-light.png",
      path: brandLogo,
    });
  }

  const boatImage = resolveBoatImagePath(boatSlug);
  if (boatImage) {
    attachments.push({
      cid: "boat-image",
      filename: path.basename(boatImage),
      path: boatImage,
    });
  }

  for (const logo of PAYMENT_LOGOS) {
    const logoPath = publicPath("payment", `${logo.id}.png`);
    if (fs.existsSync(logoPath)) {
      attachments.push({
        cid: `payment-${logo.id}`,
        filename: `${logo.id}.png`,
        path: logoPath,
      });
    }
  }

  return attachments;
}

export function cidSrc(cid: string): string {
  return `cid:${cid}`;
}

export function getEmailSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${siteConfig.domain}`;
  if (/localhost|127\.0\.0\.1/.test(configured)) {
    return `https://${siteConfig.domain}`;
  }
  return configured.replace(/\/$/, "");
}

export function toNodemailerAttachments(attachments: QuoteEmailAttachment[]) {
  return attachments.map((attachment) => ({
    filename: attachment.filename,
    path: attachment.path,
    cid: attachment.cid,
  }));
}

export function toResendAttachments(attachments: QuoteEmailAttachment[]) {
  return attachments.map((attachment) => ({
    filename: attachment.filename,
    content: fs.readFileSync(attachment.path).toString("base64"),
    content_id: attachment.cid,
  }));
}

export function paymentLogoCid(id: PaymentLogoId): string {
  return `payment-${id}`;
}
