export type BoatCategory = "yacht" | "catamaran" | "sailboat";

export type Destination = "palmilla" | "saona" | "catalina";

export type Boat = {
  slug: string;
  name: string;
  length: string;
  passengers: number;
  halfDayPrice: number | null;
  fullDayPrice: number | null;
  category: BoatCategory;
  departure: string;
  featured: boolean;
  destinations: Destination[];
  model?: string;
  year?: string;
  engines?: string;
  maxSpeed?: string;
};

export const CHARTER_INCLUSIONS = [
  { key: "presidenteBeers", en: "16 Presidente beers", es: "16 cervezas Presidente" },
  { key: "cocacolas", en: "16 Coca-Colas", es: "16 Coca-Colas" },
  { key: "waterBottles", en: "16 water bottles", es: "16 botellas de agua" },
  { key: "iceBags", en: "5 ice bags", es: "5 bolsas de hielo" },
  { key: "fuel", en: "Fuel to destination", es: "Combustible al destino" },
  { key: "crew", en: "Professional crew", es: "Tripulación profesional" },
] as const;

export function getCharterInclusions(locale: "en" | "es"): string[] {
  return CHARTER_INCLUSIONS.map((item) => item[locale]);
}

export const DEPARTURE = "Casa de Campo Marina";

export const DESTINATIONS: Destination[] = ["palmilla", "saona", "catalina"];

export const fleet: Boat[] = [
  {
    slug: "fairline-43",
    name: "Fairline 43",
    length: "43'",
    passengers: 10,
    halfDayPrice: 1500,
    fullDayPrice: 1650,
    category: "yacht",
    departure: DEPARTURE,
    featured: false,
    destinations: DESTINATIONS,
    model: "Fairline 43",
    year: "2009 (Remodeled 2023)",
    engines: "2×370–435 hp",
    maxSpeed: "~32–34 knots",
  },
  {
    slug: "fairline-43-white",
    name: "Fairline 43 White",
    length: "43'",
    passengers: 10,
    halfDayPrice: 1500,
    fullDayPrice: 1650,
    category: "yacht",
    departure: DEPARTURE,
    featured: false,
    destinations: DESTINATIONS,
    model: "Fairline 43",
    year: "2009 (Remodeled 2023)",
    engines: "2×370–435 hp",
    maxSpeed: "~32–34 knots",
  },
  {
    slug: "cruiser-40",
    name: "Cruiser 40",
    length: "40'",
    passengers: 10,
    halfDayPrice: 1475,
    fullDayPrice: 1600,
    category: "yacht",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
  },
  {
    slug: "princess-42",
    name: "Princess 42",
    length: "42'",
    passengers: 10,
    halfDayPrice: 1575,
    fullDayPrice: 1700,
    category: "yacht",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
    model: "Princess 42",
    year: "2020",
    engines: "2×435 hp Volvo Penta",
    maxSpeed: "~30–32 knots",
  },
  {
    slug: "azimut-55",
    name: "Azimut 55",
    length: "55'",
    passengers: 16,
    halfDayPrice: 2550,
    fullDayPrice: 2800,
    category: "yacht",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
    model: "Azimut 55",
    year: "2010 (Remodeled 2023)",
    engines: "2×700 hp",
    maxSpeed: "30 knots",
  },
  {
    slug: "aicon-60",
    name: "Aicon 60",
    length: "60'",
    passengers: 16,
    halfDayPrice: 2550,
    fullDayPrice: 2800,
    category: "yacht",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
    model: "Aicon Fly 60",
    year: "2008 (Remodeled 2024)",
    engines: "2×800 hp",
    maxSpeed: "30 knots",
  },
  {
    slug: "princess-60",
    name: "Princess 60",
    length: "60'",
    passengers: 15,
    halfDayPrice: 2700,
    fullDayPrice: 3100,
    category: "yacht",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
    model: "Princess 60",
    year: "2007",
    engines: "2×800–900 hp",
    maxSpeed: "~33–35 knots",
  },
  {
    slug: "pacific-mariner-72",
    name: "Pacific Mariner 72",
    length: "72'",
    passengers: 23,
    halfDayPrice: null,
    fullDayPrice: 3850,
    category: "yacht",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
  },
  {
    slug: "sea-ray-53",
    name: "Sea Ray 53",
    length: "53'",
    passengers: 15,
    halfDayPrice: null,
    fullDayPrice: 2500,
    category: "yacht",
    departure: DEPARTURE,
    featured: false,
    destinations: DESTINATIONS,
    model: "Sea Ray 53 Sedan Bridge",
    year: "2015",
    engines: "2× Cummins QSM11 715 hp",
    maxSpeed: "~30–32 knots",
  },
  {
    slug: "sea-ray-54",
    name: "Sea Ray 54",
    length: "54'",
    passengers: 16,
    halfDayPrice: 2550,
    fullDayPrice: 2750,
    category: "yacht",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
    model: "Sea Ray 540 Sundancer",
    year: "1991 (Fully Remodeled 2023)",
    engines: "2×550 hp Diesel",
    maxSpeed: "~28–30 knots",
  },
  {
    slug: "atomic-power-46",
    name: "Atomic Power 46",
    length: "46'",
    passengers: 40,
    halfDayPrice: 1600,
    fullDayPrice: 1900,
    category: "catamaran",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
    model: "Atomic Power 46 Catamaran",
    year: "2024",
    engines: "2×275 hp Mercury Outboards",
    maxSpeed: "~22–25 knots",
  },
  {
    slug: "atomic-slide-46",
    name: "Atomic Slide 46",
    length: "46'",
    passengers: 65,
    halfDayPrice: null,
    fullDayPrice: 2700,
    category: "catamaran",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
  },
  {
    slug: "lagoon-440",
    name: "Lagoon 440",
    length: "44'",
    passengers: 16,
    halfDayPrice: null,
    fullDayPrice: 2050,
    category: "catamaran",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
    model: "Lagoon 440 Power",
    year: "2012 (Refit 2020)",
    engines: "2×100 hp",
    maxSpeed: "24 knots",
  },
  {
    slug: "fountain-pajot-50",
    name: "Fountaine Pajot 50",
    length: "50'",
    passengers: 16,
    halfDayPrice: null,
    fullDayPrice: 2100,
    category: "catamaran",
    departure: DEPARTURE,
    featured: false,
    destinations: DESTINATIONS,
    model: "Fountaine Pajot Saba 50",
    year: "2012 (Fully Remodeled 2025)",
    engines: "2×55–75 hp Diesel",
    maxSpeed: "~9–10 knots under power",
  },
  {
    slug: "custom-privilege-65",
    name: "Custom Privilege 65",
    length: "65'",
    passengers: 35,
    halfDayPrice: null,
    fullDayPrice: 3500,
    category: "catamaran",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
    model: "Custom Privilege 65",
    year: "2013",
    engines: "4× Outboards",
  },
  {
    slug: "atomic-elite-46",
    name: "Atomic Elite 46",
    length: "46'",
    passengers: 25,
    halfDayPrice: null,
    fullDayPrice: 3100,
    category: "sailboat",
    departure: DEPARTURE,
    featured: true,
    destinations: DESTINATIONS,
  },
];

export function getBoatBySlug(slug: string): Boat | undefined {
  return fleet.find((boat) => boat.slug === slug);
}

export function getBoatsByCategory(category: BoatCategory): Boat[] {
  return fleet.filter((boat) => boat.category === category);
}

export function getFeaturedBoats(limit = 3): Boat[] {
  return fleet.filter((boat) => boat.featured).slice(0, limit);
}

export function getStartingPrice(boat: Boat): number {
  return boat.halfDayPrice ?? boat.fullDayPrice ?? 0;
}

export function getBoatImages(slug: string): string[] {
  const dir = `/boats/${slug}`;
  const counts: Record<string, number> = {
    "fairline-43": 17,
    "fairline-43-white": 11,
    "cruiser-40": 19,
    "princess-42": 11,
    "azimut-55": 18,
    "aicon-60": 13,
    "princess-60": 18,
    "pacific-mariner-72": 23,
    "atomic-power-46": 14,
    "atomic-elite-46": 28,
    "atomic-slide-46": 4,
    "lagoon-440": 19,
    "fountain-pajot-50": 15,
    "custom-privilege-65": 9,
    "sea-ray-53": 13,
    "sea-ray-54": 15,
  };

  const count = counts[slug] ?? 0;
  return Array.from({ length: count }, (_, i) => `${dir}/${String(i + 1).padStart(2, "0")}.jpg`);
}

export function getBoatCoverImage(slug: string): string {
  const images = getBoatImages(slug);
  return images[0] ?? "/placeholder-boat.svg";
}
