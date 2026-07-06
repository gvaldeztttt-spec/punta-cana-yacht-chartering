export const siteConfig = {
  name: "Punta Cana Yacht Charting",
  domain: "puntacanayachtcharting.com",
  email: "info@puntacanayachtcharting.com",
  marina: "Casa de Campo Marina",
  location: "La Romana, Dominican Republic",
} as const;

export function getMailtoUrl(subject: string, body: string): string {
  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
