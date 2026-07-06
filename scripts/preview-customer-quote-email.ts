/**
 * Run with: npx tsx scripts/preview-customer-quote-email.ts
 * Opens a static HTML preview in your browser.
 */
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { buildCustomerQuoteEmail } from "../src/lib/emails/customer-quote-email";
import { getBoatBySlug } from "../src/data/fleet";

const boat = getBoatBySlug("cruiser-40");
if (!boat) throw new Error("Boat not found");

const payload = {
  request: {
    boatSlug: boat.slug,
    locale: "en" as const,
    name: "Jane Smith",
    email: "jane@example.com",
    phoneCountry: "US",
    phoneNumber: "5551234567",
    formattedPhone: "+1 555 123 4567",
    preferredDate: "2026-07-15",
    duration: "full-day" as const,
    guests: 8,
    destination: "saona" as const,
    message: "Celebrating a birthday — we'd love a sunset return if possible.",
  },
  summary: {
    boat,
    duration: "full-day" as const,
    price: boat.fullDayPrice ?? 0,
    preferredDate: "2026-07-15",
    formattedDate: "Wednesday, July 15, 2026",
    destinationLabel: "Saona Island",
  },
};

const email = buildCustomerQuoteEmail(payload);
const outputPath = join(process.cwd(), "customer-quote-email-preview.html");

writeFileSync(outputPath, email.html, "utf8");
console.log("Subject:", email.subject);
console.log("\nPlain text preview:\n");
console.log(email.text);
console.log(`\nHTML preview written to ${outputPath}`);

try {
  execSync(`open "${outputPath}"`);
} catch {
  // ignore if open is unavailable
}
