import { BoatCategory, getCharterInclusions } from "@/data/fleet";
import { getCharterSchedule } from "@/lib/charter-schedule";
import { emailBrand, emailFontsHref } from "@/lib/emails/brand";
import {
  buildQuoteEmailAttachments,
  cidSrc,
  getEmailSiteUrl,
  paymentLogoCid,
} from "@/lib/emails/email-assets";
import { getPaymentLogoById, PAYMENT_LOGOS, PaymentLogoId } from "@/lib/payment-methods";
import { siteConfig } from "@/lib/site";
import { QuoteRequest, QuoteSummary } from "@/lib/quote";

type EmailPayload = {
  request: QuoteRequest;
  summary: QuoteSummary;
};

type PaymentMethod = {
  title: string;
  description: string;
  logoIds?: PaymentLogoId[];
};

type EmailCopy = {
  subject: string;
  navFleet: string;
  navDestinations: string;
  navContact: string;
  quoteLabel: string;
  greetingPrefix: string;
  intro: string;
  summaryEyebrow: string;
  summaryTitle: string;
  experienceEyebrow: string;
  experienceTitle: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  date: string;
  tour: string;
  departure: string;
  contact: string;
  contactLink: string;
  tags: string[];
  experienceNote: string;
  model: string;
  year: string;
  length: string;
  capacity: string;
  engines: string;
  maxSpeed: string;
  category: string;
  includesEyebrow: string;
  includesTitle: string;
  includedBadge: string;
  investmentEyebrow: string;
  investmentTitle: string;
  depositLabel: string;
  totalLabel: string;
  paymentEyebrow: string;
  paymentTitle: string;
  paymentIntro: string;
  paymentMethods: PaymentMethod[];
  nextStepsEyebrow: string;
  nextStepsTitle: string;
  nextStepsBody: string;
  nextStepsCatering: string;
  nextStepsMoreOptions: string;
  moreOptionsLink: string;
  cancellationEyebrow: string;
  cancellationTitleLead: string;
  cancellationTitleAccent: string;
  cancellationPolicies: string[];
  footerTagline: string;
};

const { colors: c, fonts: f, charterDeposit } = emailBrand;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function durationLabel(duration: QuoteRequest["duration"], locale: "en" | "es"): string {
  if (locale === "es") {
    return duration === "half-day" ? "MEDIO DÍA" : "DÍA COMPLETO";
  }
  return duration === "half-day" ? "HALF DAY" : "FULL DAY";
}

function categoryLabel(category: BoatCategory, locale: "en" | "es"): string {
  const labels = {
    yacht: { en: "Yacht", es: "Yate" },
    catamaran: { en: "Catamaran", es: "Catamarán" },
    sailboat: { en: "Sailboat", es: "Velero" },
  };
  return labels[category][locale];
}

function formatShortDate(date: string, locale: "en" | "es"): string {
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(locale === "es" ? "es-DO" : "en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function getTourLabel(payload: EmailPayload): string {
  const { request, summary } = payload;
  const duration = durationLabel(summary.duration, request.locale);

  if (summary.destinationLabel) {
    return request.locale === "es"
      ? `${summary.destinationLabel} (${duration})`
      : `${summary.destinationLabel} (${duration})`;
  }

  return duration;
}

function getCopy(payload: EmailPayload): EmailCopy {
  const { request, summary } = payload;
  const siteUrl = getEmailSiteUrl();
  const fleetUrl = `${siteUrl}/${request.locale}/fleet`;
  const shortDate = formatShortDate(summary.preferredDate, request.locale);
  const mailto = `mailto:${siteConfig.email}`;

  if (request.locale === "es") {
    return {
      subject: `Tu cotización — ${summary.boat.name} | ${siteConfig.name}`,
      navFleet: "Flota",
      navDestinations: "Destinos",
      navContact: "Contacto",
      quoteLabel: "Cotización de yate privado",
      greetingPrefix: "HOLA",
      intro: `Gracias por contactar a ${siteConfig.name}. A continuación encontrarás tu propuesta personalizada para el ${summary.boat.name}, con salida desde ${summary.boat.departure}.`,
      summaryEyebrow: "Resumen del charter",
      summaryTitle: `${summary.boat.name} · ${summary.boat.departure}`,
      experienceEyebrow: "Experiencia a bordo",
      experienceTitle: `Características del ${summary.boat.name}`,
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      guests: "Personas",
      date: "Fecha",
      tour: "Tour",
      departure: "Salida",
      contact: "Contacto",
      contactLink: "Enviar un correo",
      tags: [
        categoryLabel(summary.boat.category, "es"),
        "Tripulación incluida",
        "Ideal para celebraciones",
      ],
      experienceNote:
        "La ruta y el horario se coordinan con el capitán según las condiciones del mar y tus preferencias.",
      model: "Modelo",
      year: "Año",
      length: "Eslora",
      capacity: "Capacidad",
      engines: "Motores",
      maxSpeed: "Velocidad máx.",
      category: "Tipo",
      includesEyebrow: "Qué incluye",
      includesTitle: "Incluido en el charter",
      includedBadge: "Incluido",
      investmentEyebrow: "Inversión",
      investmentTitle: "Precio del charter",
      depositLabel: "Depósito para reservar",
      totalLabel: "Total",
      paymentEyebrow: "Métodos de pago",
      paymentTitle: "Opciones seguras y flexibles",
      paymentIntro:
        "Una vez recibido el depósito, confirmaremos la fecha y la embarcación. Te enviaremos las instrucciones de pago al finalizar tu cotización.",
      paymentMethods: [
        {
          title: "Tarjetas",
          description: "Visa, Mastercard, Maestro y Amex",
          logoIds: ["visa", "mastercard", "maestro"],
        },
        {
          title: "PayPal",
          description: "Pago seguro en línea",
          logoIds: ["paypal"],
        },
        {
          title: "Zelle",
          description: "Cuentas bancarias de EE. UU.",
          logoIds: ["zelle"],
        },
        { title: "Transferencia bancaria", description: "Dominicana e internacional" },
      ],
      nextStepsEyebrow: "Siguientes pasos",
      nextStepsTitle: "Confirmación de su charter",
      nextStepsBody: `Nuestro equipo verificará la disponibilidad para el <strong>${shortDate}</strong> a bordo del <strong>${summary.boat.name}</strong>. Para fechas de temporada alta — <strong>24 de diciembre al 7 de enero</strong> y <strong>Semana Santa</strong> — aplican condiciones especiales de depósito según nuestra política de cancelación.`,
      nextStepsCatering: `Si deseas agregar bebidas premium o catering, contáctanos por correo en <a href="${mailto}" style="color:${c.ocean};text-decoration:none;font-weight:600;">${siteConfig.email}</a>.`,
      nextStepsMoreOptions: "¿Buscas otras opciones?",
      moreOptionsLink: "Ver más embarcaciones",
      cancellationEyebrow: "Política de cancelación",
      cancellationTitleLead: "Nuestra",
      cancellationTitleAccent: "política de cancelación",
      cancellationPolicies: [
        "Si la cancelación se realiza <strong>3 días o más</strong> antes de la fecha contratada, reembolsaremos <strong>el 100% del pago</strong>.",
        "Si la cancelación ocurre <strong>1 a 2 días</strong> antes de la fecha contratada, reembolsaremos <strong>el 50% del pago</strong>.",
        "Si la cancelación se realiza el <strong>mismo día</strong> de la fecha contratada, el cliente debe <strong>pagar el 100%</strong>.",
        "Si la cancelación se debe a un <strong>fenómeno natural severo (excepto lluvia)</strong> o a una <strong>prohibición oficial de la Armada Dominicana</strong>, la empresa reembolsará <strong>el 100% del depósito</strong>.",
        "Para <strong>fechas festivas</strong>, las cancelaciones conllevan <strong>el 100% del depósito</strong>. Los feriados incluyen <strong>24 de diciembre al 7 de enero</strong> y <strong>Semana Santa</strong>.",
        "La <strong>reprogramación</strong> puede coordinarse en casos de <strong>lluvias fuertes</strong> cuando la Armada Dominicana determine que el charter <strong>no puede operar de forma segura</strong>.",
      ],
      footerTagline: `${siteConfig.marina} · ${siteConfig.location}`,
    };
  }

  return {
    subject: `Your Charter Quote — ${summary.boat.name} | ${siteConfig.name}`,
    navFleet: "Fleet",
    navDestinations: "Destinations",
    navContact: "Contact",
    quoteLabel: "Private yacht quote",
    greetingPrefix: "HI",
    intro: `Thank you for contacting ${siteConfig.name}. Below is your personalized proposal for the ${summary.boat.name}, departing from ${summary.boat.departure}.`,
    summaryEyebrow: "Charter summary",
    summaryTitle: `${summary.boat.name} · ${summary.boat.departure}`,
    experienceEyebrow: "On-board experience",
    experienceTitle: `${summary.boat.name} specifications`,
    name: "Name",
    email: "Email",
    phone: "Phone",
    guests: "Guests",
    date: "Date",
    tour: "Tour",
    departure: "Departure",
    contact: "Contact",
    contactLink: "Send us an email",
    tags: [
      categoryLabel(summary.boat.category, "en"),
      "Crew included",
      "Ideal for celebrations",
    ],
    experienceNote:
      "Route and schedule are coordinated with the captain based on sea conditions and your preferences.",
    model: "Model",
    year: "Year",
    length: "Length",
    capacity: "Capacity",
    engines: "Engines",
    maxSpeed: "Max speed",
    category: "Type",
    includesEyebrow: "What's included",
    includesTitle: "Included in your charter",
    includedBadge: "Included",
    investmentEyebrow: "Investment",
    investmentTitle: "Charter pricing",
    depositLabel: "Deposit to reserve",
    totalLabel: "Total",
    paymentEyebrow: "Payment methods",
    paymentTitle: "Secure, flexible options",
    paymentIntro:
      "Once we receive your deposit, we will confirm your date and vessel. Payment instructions will be sent when your quote is finalized.",
    paymentMethods: [
      {
        title: "Cards",
        description: "Visa, Mastercard, Maestro, and Amex",
        logoIds: ["visa", "mastercard", "maestro"],
      },
      {
        title: "PayPal",
        description: "Secure online payment",
        logoIds: ["paypal"],
      },
      {
        title: "Zelle",
        description: "U.S. bank accounts",
        logoIds: ["zelle"],
      },
      { title: "Bank transfer", description: "Domestic & international" },
    ],
    nextStepsEyebrow: "Next steps",
    nextStepsTitle: "Charter confirmation",
    nextStepsBody: `Our team will verify availability for <strong>${shortDate}</strong> aboard the <strong>${summary.boat.name}</strong>. For high-season dates — <strong>December 24 through January 7</strong> and <strong>Holy Week</strong> — special deposit conditions apply per our cancellation policy.`,
    nextStepsCatering: `To add premium drinks or catering, contact us at <a href="${mailto}" style="color:${c.ocean};text-decoration:none;font-weight:600;">${siteConfig.email}</a>.`,
    nextStepsMoreOptions: "Looking for other options?",
    moreOptionsLink: "View more vessels",
    cancellationEyebrow: "Cancellation policy",
    cancellationTitleLead: "Our",
    cancellationTitleAccent: "cancellation policy",
    cancellationPolicies: [
      "If cancellation is made <strong>3 or more days</strong> before the contracted date, we will refund <strong>100% of the payment</strong>.",
      "If cancellation occurs <strong>1 to 2 days</strong> before the contracted date, we will refund <strong>50% of the payment</strong>.",
      "If cancellation is on the <strong>same day</strong> as the contracted date, the client must <strong>pay in full</strong>.",
      "If cancellation is due to a <strong>severe natural event (excluding rain)</strong> or an <strong>official prohibition by the Dominican Navy</strong>, the company will refund <strong>100% of the deposit</strong>.",
      "For <strong>holiday dates</strong>, cancellations incur <strong>100% of the deposit</strong>. Holidays include <strong>December 24 through January 7</strong> and <strong>Holy Week</strong>.",
      "<strong>Rescheduling</strong> may be coordinated in cases of <strong>heavy rain</strong> when the Dominican Navy determines the charter <strong>cannot operate safely</strong>.",
    ],
    footerTagline: `${siteConfig.marina} · ${siteConfig.location}`,
  };
}

function eyebrow(text: string): string {
  return `<p style="margin:0 0 8px;font-family:${f.body};font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${c.muted};">${escapeHtml(text)}</p>`;
}

function cardTitle(text: string): string {
  return `<p style="margin:0 0 16px;font-family:${f.display};font-size:22px;font-weight:700;color:${c.foreground};">${escapeHtml(text)}</p>`;
}

function detailRow(label: string, value: string, accent = false): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${c.border};font-family:${f.body};font-size:13px;color:${c.muted};width:38%;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${c.border};font-family:${f.body};font-size:14px;font-weight:600;color:${accent ? c.ocean : c.foreground};text-align:right;vertical-align:top;">
        ${accent ? value : escapeHtml(value)}
      </td>
    </tr>`;
}

function specRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;font-family:${f.body};font-size:13px;font-weight:700;color:${c.foreground};width:42%;vertical-align:top;">
        ${escapeHtml(label)}:
      </td>
      <td style="padding:8px 0;font-family:${f.body};font-size:13px;color:${c.muted};vertical-align:top;">
        ${escapeHtml(value)}
      </td>
    </tr>`;
}

function renderEmailPaymentLogos(logoIds: PaymentLogoId[]): string {
  return logoIds
    .map((id) => {
      const logo = getPaymentLogoById(id);
      return `<img src="${escapeHtml(cidSrc(paymentLogoCid(id)))}" alt="${escapeHtml(logo.name)}" height="28" style="display:inline-block;height:28px;width:auto;max-width:88px;object-fit:contain;margin:0 10px 8px 0;border:0;" />`;
    })
    .join("");
}

function renderPaymentMethodCard(method: PaymentMethod): string {
  const logos = method.logoIds?.length
    ? `<div style="margin-bottom:12px;line-height:0;">${renderEmailPaymentLogos(method.logoIds)}</div>`
    : "";

  return `
    <td width="50%" style="padding:6px;vertical-align:top;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${c.border};border-radius:16px;background:${c.white};">
        <tr>
          <td style="padding:16px 18px;">
            ${logos}
            <p style="margin:0 0 4px;font-family:${f.body};font-size:15px;font-weight:700;color:${c.ocean};">${escapeHtml(method.title)}</p>
            <p style="margin:0;font-family:${f.body};font-size:12px;line-height:1.5;color:${c.muted};">${escapeHtml(method.description)}</p>
          </td>
        </tr>
      </table>
    </td>`;
}

function buildPaymentGrid(methods: PaymentMethod[]): string {
  return methods
    .reduce<string[][]>((rows, method, index) => {
      if (index % 2 === 0) rows.push([]);
      rows[rows.length - 1].push(renderPaymentMethodCard(method));
      return rows;
    }, [])
    .map((cells) => {
      const padded =
        cells.length === 1 ? [...cells, `<td width="50%" style="padding:6px;"></td>`] : cells;
      return `<tr>${padded.join("")}</tr>`;
    })
    .join("");
}

function buildExperienceSpecRows(payload: EmailPayload, copy: EmailCopy): string {
  const { request, summary } = payload;
  const boat = summary.boat;
  const rows: Array<[string, string]> = [
    [copy.model, boat.model ?? boat.name],
    ...(boat.year ? [[copy.year, boat.year] as [string, string]] : []),
    [copy.length, boat.length],
    [
      copy.capacity,
      request.locale === "es"
        ? `Máximo ${boat.passengers} personas`
        : `Up to ${boat.passengers} guests`,
    ],
    ...(boat.engines ? [[copy.engines, boat.engines] as [string, string]] : []),
    ...(boat.maxSpeed ? [[copy.maxSpeed, boat.maxSpeed] as [string, string]] : []),
    [copy.category, categoryLabel(boat.category, request.locale)],
    [copy.departure, boat.departure],
  ];

  return rows.map(([label, value]) => specRow(label, value)).join("");
}

function buildPlainText(payload: EmailPayload, copy: EmailCopy): string {
  const { request, summary } = payload;
  const inclusions = getCharterInclusions(request.locale);
  const fleetUrl = `${getEmailSiteUrl()}/${request.locale}/fleet`;

  return [
    `${copy.greetingPrefix} ${request.name.toUpperCase()}`,
    "",
    copy.intro,
    "",
    copy.summaryTitle,
    `${copy.name}: ${request.name}`,
    `${copy.email}: ${request.email}`,
    `${copy.phone}: ${request.formattedPhone}`,
    `${copy.guests}: ${request.guests}`,
    `${copy.date}: ${summary.formattedDate}`,
    `${copy.tour}: ${getTourLabel(payload)}`,
    `${copy.departure}: ${summary.boat.departure}`,
    "",
    copy.experienceTitle,
    `${copy.model}: ${summary.boat.name}`,
    `${copy.length}: ${summary.boat.length}`,
    `${copy.capacity}: ${summary.boat.passengers}`,
    `${copy.category}: ${categoryLabel(summary.boat.category, request.locale)}`,
    "",
    copy.includesTitle,
    ...inclusions.map((item) => `  • ${item} — ${copy.includedBadge}`),
    "",
    `${copy.depositLabel}: $${charterDeposit.toLocaleString()} USD`,
    `${copy.totalLabel}: $${summary.price.toLocaleString()} USD`,
    "",
    copy.paymentTitle,
    ...copy.paymentMethods.map((method) => `  • ${method.title}: ${method.description}`),
    "",
    copy.nextStepsTitle,
    copy.nextStepsBody.replace(/<\/?strong>/g, ""),
    "",
    copy.cancellationTitleLead + " " + copy.cancellationTitleAccent,
    ...copy.cancellationPolicies.map((policy, index) =>
      `${index + 1}. ${policy.replace(/<\/?strong>/g, "")}`,
    ),
    "",
    copy.nextStepsMoreOptions,
    `${copy.moreOptionsLink}: ${fleetUrl}`,
    "",
    siteConfig.name,
    copy.footerTagline,
    siteConfig.email,
  ].join("\n");
}

function buildHtml(payload: EmailPayload, copy: EmailCopy): string {
  const { request, summary } = payload;
  const inclusions = getCharterInclusions(request.locale);
  const siteUrl = getEmailSiteUrl();
  const fleetUrl = `${siteUrl}/${request.locale}/fleet`;
  const mailto = `mailto:${siteConfig.email}`;
  const displayName = escapeHtml(request.name.toUpperCase());
  const paymentGrid = buildPaymentGrid(copy.paymentMethods);
  const paymentLogoStrip = renderEmailPaymentLogos(PAYMENT_LOGOS.map((logo) => logo.id));

  const inclusionRows = inclusions
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid ${c.border};font-family:${f.body};font-size:14px;color:${c.foreground};">
            ${escapeHtml(item)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid ${c.border};font-family:${f.body};font-size:13px;font-weight:700;color:${c.ocean};text-align:right;white-space:nowrap;">
            ${escapeHtml(copy.includedBadge)}
          </td>
        </tr>`,
    )
    .join("");

  const tagPills = copy.tags
    .map(
      (tag) =>
        `<span style="display:inline-block;margin:0 8px 8px 0;padding:8px 12px;border:1px solid ${c.border};border-radius:999px;background:${c.white};font-family:${f.body};font-size:11px;font-weight:600;color:${c.muted};">${escapeHtml(tag)}</span>`,
    )
    .join("");

  const cancellationList = copy.cancellationPolicies
    .map(
      (policy, index) => `
        <tr>
          <td style="padding:0 0 14px;font-family:${f.body};font-size:14px;line-height:1.7;color:${c.foreground};vertical-align:top;width:24px;">
            ${index + 1}.
          </td>
          <td style="padding:0 0 14px;font-family:${f.body};font-size:14px;line-height:1.7;color:${c.foreground};">
            ${policy}
          </td>
        </tr>`,
    )
    .join("");

  const notesBlock = request.message
    ? `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
        <tr>
          <td style="padding:16px 18px;border:1px solid ${c.border};border-radius:16px;background:${c.white};">
            <p style="margin:0 0 8px;font-family:${f.body};font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${c.muted};">
              ${request.locale === "es" ? "Notas del cliente" : "Client notes"}
            </p>
            <p style="margin:0;font-family:${f.body};font-size:14px;line-height:1.6;color:${c.foreground};white-space:pre-wrap;">
              ${escapeHtml(request.message)}
            </p>
          </td>
        </tr>
      </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="${request.locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(copy.subject)}</title>
    <link href="${emailFontsHref}" rel="stylesheet" />
  </head>
  <body style="margin:0;padding:0;background:${c.skyLight};font-family:${f.body};color:${c.foreground};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${c.skyLight};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;">

            <!-- Header -->
                  <tr>
                    <td style="background:${c.marine};border-radius:20px 20px 0 0;padding:24px 28px;">
                      <img
                        src="${escapeHtml(cidSrc("brand-logo"))}"
                        alt="${escapeHtml(siteConfig.name)}"
                        height="52"
                        style="display:block;height:52px;width:auto;border:0;"
                      />
                      <p style="margin:10px 0 0;font-family:${f.body};font-size:13px;color:${c.sky};">
                        ${escapeHtml(copy.footerTagline)}
                      </p>
                    </td>
                  </tr>

            <!-- Body -->
            <tr>
              <td style="background:${c.white};padding:28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:16px;vertical-align:top;" class="stack-column">
                      ${eyebrow(copy.quoteLabel)}
                      <p style="margin:0 0 16px;font-family:${f.display};font-size:30px;line-height:1.15;font-weight:700;color:${c.foreground};">
                        ${copy.greetingPrefix}
                        <span style="color:${c.ocean};">${displayName}</span>
                      </p>
                      <p style="margin:0;font-family:${f.body};font-size:14px;line-height:1.75;color:${c.muted};">
                        ${escapeHtml(copy.intro)}
                      </p>
                    </td>
                    <td width="240" style="vertical-align:top;" class="stack-column">
                      <img
                        src="${escapeHtml(cidSrc("boat-image"))}"
                        alt="${escapeHtml(summary.boat.name)}"
                        width="240"
                        style="display:block;width:100%;max-width:240px;height:auto;border-radius:18px;border:3px solid ${c.border};"
                      />
                    </td>
                  </tr>
                </table>

                <!-- Summary + Experience -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;background:${c.sand};border:1px solid ${c.border};border-radius:20px;">
                  <tr>
                    <td style="padding:24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding-right:16px;vertical-align:top;width:50%;" class="stack-column">
                            ${eyebrow(copy.summaryEyebrow)}
                            <p style="margin:0 0 16px;font-family:${f.display};font-size:20px;font-weight:700;color:${c.foreground};">
                              ${escapeHtml(copy.summaryTitle)}
                            </p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              ${detailRow(copy.name, request.name)}
                              ${detailRow(copy.email, `<a href="mailto:${escapeHtml(request.email)}" style="color:${c.ocean};text-decoration:none;">${escapeHtml(request.email)}</a>`, true)}
                              ${detailRow(copy.phone, request.formattedPhone)}
                              ${detailRow(copy.guests, String(request.guests))}
                              ${detailRow(copy.date, summary.formattedDate)}
                              ${detailRow(copy.tour, getTourLabel(payload))}
                              ${detailRow(copy.departure, summary.boat.departure, true)}
                              ${detailRow(copy.contact, `<a href="${mailto}" style="color:${c.ocean};text-decoration:none;">${escapeHtml(copy.contactLink)}</a>`, true)}
                            </table>
                            <div style="margin-top:16px;">${tagPills}</div>
                          </td>
                          <td style="padding-left:16px;vertical-align:top;width:50%;border-left:1px solid ${c.border};" class="stack-column">
                            ${eyebrow(copy.experienceEyebrow)}
                            <p style="margin:0 0 16px;font-family:${f.display};font-size:20px;font-weight:700;color:${c.foreground};">
                              ${escapeHtml(copy.experienceTitle)}
                            </p>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              ${buildExperienceSpecRows(payload, copy)}
                            </table>
                            <p style="margin:16px 0 0;font-family:${f.body};font-size:12px;line-height:1.6;color:${c.muted};">
                              ${escapeHtml(copy.experienceNote)}
                            </p>
                          </td>
                        </tr>
                      </table>
                      ${notesBlock}
                    </td>
                  </tr>
                </table>

                <!-- Includes + Investment -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border:1px solid ${c.border};border-radius:20px;background:${c.white};">
                  <tr>
                    <td style="padding:24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding-right:16px;vertical-align:top;width:58%;" class="stack-column">
                            ${eyebrow(copy.includesEyebrow)}
                            ${cardTitle(copy.includesTitle)}
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              ${inclusionRows}
                            </table>
                          </td>
                          <td style="padding-left:16px;vertical-align:top;width:42%;border-left:1px solid ${c.border};" class="stack-column">
                            ${eyebrow(copy.investmentEyebrow)}
                            ${cardTitle(copy.investmentTitle)}
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              <tr>
                                <td style="padding:10px 0;border-bottom:1px solid ${c.border};font-family:${f.body};font-size:14px;color:${c.muted};">
                                  ${escapeHtml(copy.depositLabel)}
                                </td>
                                <td style="padding:10px 0;border-bottom:1px solid ${c.border};font-family:${f.body};font-size:14px;font-weight:600;color:${c.foreground};text-align:right;">
                                  $${charterDeposit.toLocaleString()}
                                </td>
                              </tr>
                              <tr>
                                <td style="padding:16px 0 0;font-family:${f.body};font-size:15px;font-weight:700;color:${c.foreground};">
                                  ${escapeHtml(copy.totalLabel)}
                                </td>
                                <td style="padding:16px 0 0;font-family:${f.display};font-size:32px;font-weight:700;color:${c.ocean};text-align:right;line-height:1;">
                                  $${summary.price.toLocaleString()}
                                </td>
                              </tr>
                            </table>
                            <p style="margin:12px 0 0;font-family:${f.body};font-size:12px;line-height:1.5;color:${c.muted};">
                              ${getCharterSchedule(summary.duration, request.locale)}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Payment methods -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border:1px solid ${c.border};border-radius:20px;background:${c.sand};">
                  <tr>
                    <td style="padding:24px;">
                      ${eyebrow(copy.paymentEyebrow)}
                      ${cardTitle(copy.paymentTitle)}
                      <p style="margin:0 0 16px;font-family:${f.body};font-size:14px;line-height:1.7;color:${c.muted};">
                        ${escapeHtml(copy.paymentIntro)}
                      </p>
                      <div style="margin:0 0 18px;padding:14px 16px;border:1px solid ${c.border};border-radius:16px;background:${c.white};line-height:0;">
                        ${paymentLogoStrip}
                      </div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        ${paymentGrid}
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Next steps -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border:1px solid ${c.border};border-radius:20px;background:${c.white};">
                  <tr>
                    <td style="padding:24px;">
                      ${eyebrow(copy.nextStepsEyebrow)}
                      ${cardTitle(copy.nextStepsTitle)}
                      <p style="margin:0 0 14px;font-family:${f.body};font-size:14px;line-height:1.75;color:${c.foreground};">
                        ${copy.nextStepsBody}
                      </p>
                      <p style="margin:0 0 14px;font-family:${f.body};font-size:14px;line-height:1.75;color:${c.foreground};">
                        ${copy.nextStepsCatering}
                      </p>
                      <p style="margin:0;font-family:${f.body};font-size:14px;line-height:1.75;color:${c.foreground};">
                        ${escapeHtml(copy.nextStepsMoreOptions)}
                        <a href="${fleetUrl}" style="color:${c.ocean};text-decoration:none;font-weight:700;"> ${escapeHtml(copy.moreOptionsLink)}</a>
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Cancellation policy -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;border:1px solid ${c.border};border-radius:20px;background:${c.white};">
                  <tr>
                    <td style="padding:24px;">
                      <p style="margin:0 0 16px;font-family:${f.body};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${c.muted};">
                        ${escapeHtml(copy.cancellationTitleLead)}
                        <span style="color:${c.ocean};"> ${escapeHtml(copy.cancellationTitleAccent)}</span>
                      </p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        ${cancellationList}
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:${c.marineDark};border-radius:0 0 20px 20px;padding:24px 28px;text-align:center;">
                <p style="margin:0 0 6px;font-family:${f.display};font-size:18px;font-weight:700;color:${c.white};">
                  ${escapeHtml(siteConfig.name)}
                </p>
                <p style="margin:0 0 10px;font-family:${f.body};font-size:13px;color:${c.sky};">
                  ${escapeHtml(copy.footerTagline)}
                </p>
                <a href="${mailto}" style="font-family:${f.body};font-size:13px;font-weight:600;color:${c.sky};text-decoration:none;">
                  ${escapeHtml(siteConfig.email)}
                </a>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildCustomerQuoteEmail(payload: EmailPayload) {
  const copy = getCopy(payload);
  const attachments = buildQuoteEmailAttachments(payload.summary.boat.slug);

  return {
    subject: copy.subject,
    text: buildPlainText(payload, copy),
    html: buildHtml(payload, copy),
    attachments,
  };
}
