export type PaymentLogoId = "visa" | "mastercard" | "maestro" | "paypal" | "zelle";

export type PaymentLogo = {
  id: PaymentLogoId;
  name: string;
  src: `/payment/${PaymentLogoId}.png`;
  width: number;
  height: number;
};

export const PAYMENT_LOGOS: PaymentLogo[] = [
  { id: "visa", name: "Visa", src: "/payment/visa.png", width: 72, height: 24 },
  { id: "mastercard", name: "Mastercard", src: "/payment/mastercard.png", width: 48, height: 32 },
  { id: "maestro", name: "Maestro", src: "/payment/maestro.png", width: 48, height: 32 },
  { id: "paypal", name: "PayPal", src: "/payment/paypal.png", width: 80, height: 24 },
  { id: "zelle", name: "Zelle", src: "/payment/zelle.png", width: 64, height: 24 },
];

export function getPaymentLogoById(id: PaymentLogoId): PaymentLogo {
  const logo = PAYMENT_LOGOS.find((item) => item.id === id);
  if (!logo) throw new Error(`Unknown payment logo: ${id}`);
  return logo;
}

export function getPaymentLogoUrl(baseUrl: string, id: PaymentLogoId): string {
  return `${baseUrl.replace(/\/$/, "")}/payment/${id}.png`;
}
