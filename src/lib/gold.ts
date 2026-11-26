export const GOLD_SYMBOL = "GC=F";
export const SILVER_SYMBOL = "SI=F";

export const GRAMS_PER_OZ = 31.1034768;
export const GRAMS_PER_TOLA = 11.6638038;

export type Karat = {
  slug: string;
  k: number;
  purity: number;
  hallmark: string;
  label: string;
  /** Long-tail phrases this page is written for (from the keyword research). */
  phrases: string[];
  note: string;
};

export const KARATS: Karat[] = [
  { slug: "24k", k: 24, purity: 1, hallmark: "999", label: "24K", phrases: ["24 carat", "999 gold", "999.9", "995 24 carat"], note: "24K is 99.9%+ pure gold, used for bullion bars, coins and investment-grade gold, and is priced at the spot price." },
  { slug: "22k", k: 22, purity: 0.916, hallmark: "916", label: "22K", phrases: ["22 carat", "916 gold", "916 hallmark"], note: "22K (916) is 91.6% gold and the standard for jewellery in India, the Gulf and South Asian jewellers across the USA and Canada." },
  { slug: "21k", k: 21, purity: 0.875, hallmark: "875", label: "21K", phrases: ["21 carat", "875 gold"], note: "21K is 87.5% gold, the most popular jewellery purity in Saudi Arabia, the UAE, Egypt and Jordan." },
  { slug: "18k", k: 18, purity: 0.75, hallmark: "750", label: "18K", phrases: ["18 carat", "750 hallmark", "750 gold"], note: "18K (750) is 75% gold, common in fine jewellery, watches and diamond settings." },
  { slug: "14k", k: 14, purity: 0.585, hallmark: "585", label: "14K", phrases: ["14 carat", "585 gold"], note: "14K (585) is 58.5% gold and the best-selling jewellery purity in the USA and Canada." },
  { slug: "10k", k: 10, purity: 0.417, hallmark: "417", label: "10K", phrases: ["10 carat", "417 gold"], note: "10K is 41.7% gold, the minimum purity that can legally be sold as gold in the United States." },
  { slug: "9k", k: 9, purity: 0.375, hallmark: "375", label: "9K", phrases: ["9 carat", "9ct", "375 gold"], note: "9K (375) is 37.5% gold, the minimum hallmarkable purity in the UK and common in Canada." },
];

export type Unit = {
  slug: string;
  label: string;
  grams: number;
  short: string;
  phrases: string[];
};

export const UNITS: Unit[] = [
  { slug: "per-gram", label: "per gram", grams: 1, short: "g", phrases: ["per gram", "1 gram", "a gram", "by gram", "how much per gram"] },
  { slug: "per-ounce", label: "per troy ounce", grams: GRAMS_PER_OZ, short: "oz", phrases: ["per ounce", "per oz", "1 oz", "troy ounce", "an ounce"] },
  { slug: "per-10-grams", label: "per 10 grams", grams: 10, short: "10g", phrases: ["10 gram", "for 10 grams"] },
  { slug: "per-tola", label: "per tola", grams: GRAMS_PER_TOLA, short: "tola", phrases: ["per tola", "1 tola", "one tola"] },
  { slug: "per-kg", label: "per kilogram", grams: 1000, short: "kg", phrases: ["per kg", "kilo", "one kg"] },
];

export type Location = {
  slug: string;
  name: string;
  /** Display name used inside sentences: "in {inName}". */
  inName: string;
  /** Common search abbreviation shown next to the name, e.g. "KSA". */
  short?: string;
  country: string;
  currency: string;
  units: string[];
  region: "north-america" | "south-asia" | "middle-east" | "europe" | "asia-pacific" | "africa";
  parent?: string;
  blurb: string;
};

const L = (l: Location) => l;

export const LOCATIONS: Location[] = [
  // North America — primary market
  L({ slug: "usa", name: "USA", inName: "the USA", country: "United States", currency: "USD", units: ["per-ounce", "per-gram"], region: "north-america", blurb: "US bullion dealers price gold off the COMEX spot price in US dollars per troy ounce, with a premium added for coins and small bars." }),
  L({ slug: "canada", name: "Canada", inName: "Canada", country: "Canada", currency: "CAD", units: ["per-ounce", "per-gram"], region: "north-america", blurb: "Canadian dealers convert the US-dollar spot price to Canadian dollars; investment-grade gold (99.5%+) is exempt from GST/HST in Canada." }),
  L({ slug: "new-york", name: "New York", inName: "New York", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "New York's Diamond District on 47th Street is the largest gold and jewellery market in the US, buying and selling against live spot." }),
  L({ slug: "new-jersey", name: "New Jersey", inName: "New Jersey (Edison, Jersey City)", country: "United States", currency: "USD", units: ["per-gram", "per-10-grams"], region: "north-america", parent: "usa", blurb: "Edison and Iselin, NJ host many South Asian jewellers that quote 22K gold per gram and per 10 grams." }),
  L({ slug: "chicago", name: "Chicago", inName: "Chicago", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Chicago is home to the CME Group, which operates COMEX — the exchange that sets the benchmark US gold futures price." }),
  L({ slug: "houston", name: "Houston", inName: "Houston", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Houston jewellers on Hillcroft Avenue quote 22K and 24K gold per gram for the city's large South Asian community." }),
  L({ slug: "dallas", name: "Dallas", inName: "Dallas", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Texas exempts gold and silver bullion from sales tax, and Dallas-area buyers can also store metal in the Texas Bullion Depository." }),
  L({ slug: "san-antonio", name: "San Antonio", inName: "San Antonio", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Like the rest of Texas, San Antonio buyers pay no state sales tax on qualifying gold bullion." }),
  L({ slug: "los-angeles", name: "Los Angeles", inName: "Los Angeles", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "The Los Angeles Jewelry District downtown is one of the busiest gold trading areas on the West Coast." }),
  L({ slug: "california", name: "California", inName: "California", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "California exempts bullion purchases of $2,000 or more from sales tax; smaller purchases may be taxed." }),
  L({ slug: "san-jose", name: "San Jose", inName: "San Jose & the Bay Area", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Bay Area buyers in San Jose, Fremont and Sunnyvale often compare 22K jewellery rates against the live per-gram spot price." }),
  L({ slug: "seattle", name: "Seattle", inName: "Seattle", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Washington State exempts investment bullion from sales tax, which makes spot-linked pricing in Seattle relatively transparent." }),
  L({ slug: "atlanta", name: "Atlanta", inName: "Atlanta", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Atlanta-area dealers price coins and bars off the live spot price, plus a dealer premium that varies by product." }),
  L({ slug: "miami", name: "Miami", inName: "Miami", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Miami is a major gateway for Latin American gold trade, and Florida exempts bullion purchases over $500 from sales tax." }),
  L({ slug: "phoenix", name: "Phoenix", inName: "Phoenix", country: "United States", currency: "USD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "usa", blurb: "Arizona treats gold and silver as legal tender for tax purposes, so Phoenix buyers pay no capital-gains tax at the state level." }),
  L({ slug: "toronto", name: "Toronto", inName: "Toronto", country: "Canada", currency: "CAD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "canada", blurb: "Toronto is home to the TSX, the world's largest exchange for gold-mining companies, and to the Royal Canadian Mint's main dealers." }),
  L({ slug: "ontario", name: "Ontario", inName: "Ontario", country: "Canada", currency: "CAD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "canada", blurb: "Ontario buyers from Brampton to Mississauga compare 22K jewellery rates against the live CAD per-gram price." }),
  L({ slug: "vancouver", name: "Vancouver", inName: "Vancouver", country: "Canada", currency: "CAD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "canada", blurb: "Vancouver has an active bullion market serving buyers across British Columbia and the Pacific Rim." }),
  L({ slug: "calgary", name: "Calgary", inName: "Calgary", country: "Canada", currency: "CAD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "canada", blurb: "Alberta has no provincial sales tax, and pure investment gold is GST-exempt, so Calgary prices track spot closely." }),
  L({ slug: "edmonton", name: "Edmonton", inName: "Edmonton", country: "Canada", currency: "CAD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "canada", blurb: "Edmonton dealers quote Maple Leaf coins and bars in Canadian dollars against the live spot price." }),
  L({ slug: "montreal", name: "Montreal", inName: "Montreal", country: "Canada", currency: "CAD", units: ["per-gram", "per-ounce"], region: "north-america", parent: "canada", blurb: "Montreal buyers pay no GST/QST on investment-grade gold bullion of 99.5% purity or more." }),
  // Europe
  L({ slug: "uk", name: "UK", inName: "the UK", country: "United Kingdom", currency: "GBP", units: ["per-gram", "per-ounce"], region: "europe", blurb: "Investment gold is VAT-free in the UK, and UK legal-tender coins such as Britannias are also free of capital gains tax." }),
  L({ slug: "london", name: "London", inName: "London", country: "United Kingdom", currency: "GBP", units: ["per-gram", "per-ounce"], region: "europe", parent: "uk", blurb: "London hosts the LBMA Gold Price auction, set twice daily, which is the global benchmark for physical gold." }),
  L({ slug: "europe", name: "Europe", inName: "Europe (EUR)", country: "Eurozone", currency: "EUR", units: ["per-gram", "per-ounce"], region: "europe", blurb: "Investment gold is exempt from VAT across the European Union under the EU investment-gold scheme." }),
  L({ slug: "switzerland", name: "Switzerland", inName: "Switzerland (Zurich)", country: "Switzerland", currency: "CHF", units: ["per-gram", "per-ounce"], region: "europe", blurb: "Switzerland refines most of the world's gold, and Zurich is a major hub for physical gold storage and trading." }),
  // South Asia
  L({ slug: "india", name: "India", inName: "India", country: "India", currency: "INR", units: ["per-10-grams", "per-gram"], region: "south-asia", blurb: "Indian retail rates add import duty and 3% GST on top of the international price, so jewellers' boards read higher than spot." }),
  L({ slug: "delhi", name: "Delhi", inName: "Delhi", country: "India", currency: "INR", units: ["per-10-grams", "per-gram"], region: "south-asia", parent: "india", blurb: "Delhi's bullion rates are set by local associations each morning, based on international prices plus duties and taxes." }),
  L({ slug: "mumbai", name: "Mumbai", inName: "Mumbai", country: "India", currency: "INR", units: ["per-10-grams", "per-gram"], region: "south-asia", parent: "india", blurb: "Mumbai's Zaveri Bazaar is India's largest bullion market, and the MCX gold contract trades out of Mumbai." }),
  L({ slug: "chennai", name: "Chennai", inName: "Chennai", country: "India", currency: "INR", units: ["per-gram", "per-10-grams"], region: "south-asia", parent: "india", blurb: "Chennai and Tamil Nadu buyers usually quote 22K gold per gram and per sovereign (8 grams)." }),
  L({ slug: "hyderabad", name: "Hyderabad", inName: "Hyderabad", country: "India", currency: "INR", units: ["per-10-grams", "per-gram"], region: "south-asia", parent: "india", blurb: "Hyderabad's jewellery market quotes 22K and 24K gold per 10 grams, updated each morning." }),
  L({ slug: "bangalore", name: "Bangalore", inName: "Bangalore", country: "India", currency: "INR", units: ["per-10-grams", "per-gram"], region: "south-asia", parent: "india", blurb: "Bangalore jewellers publish daily 22K and 24K boards that track the international price plus duties." }),
  L({ slug: "kolkata", name: "Kolkata", inName: "Kolkata", country: "India", currency: "INR", units: ["per-10-grams", "per-gram"], region: "south-asia", parent: "india", blurb: "Kolkata is a major gold jewellery manufacturing centre for eastern India." }),
  L({ slug: "kerala", name: "Kerala", inName: "Kerala", country: "India", currency: "INR", units: ["per-gram", "per-10-grams"], region: "south-asia", parent: "india", blurb: "Kerala has one of the highest per-capita gold consumption rates in India; rates are often quoted per pavan (8 grams)." }),
  L({ slug: "ahmedabad", name: "Ahmedabad", inName: "Ahmedabad", country: "India", currency: "INR", units: ["per-10-grams", "per-gram"], region: "south-asia", parent: "india", blurb: "Ahmedabad and Gujarat are large gold-buying regions, with demand peaking around Dhanteras and wedding season." }),
  L({ slug: "jaipur", name: "Jaipur", inName: "Jaipur", country: "India", currency: "INR", units: ["per-10-grams", "per-gram"], region: "south-asia", parent: "india", blurb: "Jaipur's Johari Bazaar is one of India's best-known traditional jewellery markets." }),
  L({ slug: "pakistan", name: "Pakistan", inName: "Pakistan", country: "Pakistan", currency: "PKR", units: ["per-tola", "per-10-grams"], region: "south-asia", blurb: "Pakistani sarafa markets quote gold per tola (11.66 g); local rates can differ from the converted international price." }),
  L({ slug: "karachi", name: "Karachi", inName: "Karachi", country: "Pakistan", currency: "PKR", units: ["per-tola", "per-10-grams"], region: "south-asia", parent: "pakistan", blurb: "The Karachi Sarafa Association publishes the reference gold rate used across Pakistan." }),
  L({ slug: "nepal", name: "Nepal", inName: "Nepal", country: "Nepal", currency: "NPR", units: ["per-tola", "per-10-grams"], region: "south-asia", blurb: "The Federation of Nepal Gold and Silver Dealers' Association sets the daily per-tola rate, including customs duty." }),
  L({ slug: "bangladesh", name: "Bangladesh", inName: "Bangladesh", country: "Bangladesh", currency: "BDT", units: ["per-tola", "per-gram"], region: "south-asia", blurb: "BAJUS sets jewellery gold rates in Bangladesh per bhori (vori), which equals one tola (11.66 g)." }),
  L({ slug: "sri-lanka", name: "Sri Lanka", inName: "Sri Lanka", country: "Sri Lanka", currency: "LKR", units: ["per-gram", "per-tola"], region: "south-asia", blurb: "Sri Lankan jewellers quote 22K and 24K gold per pavan (8 grams); this page shows the international equivalent in rupees." }),
  // Middle East
  L({ slug: "uae", name: "UAE", inName: "the UAE", country: "United Arab Emirates", currency: "AED", units: ["per-gram", "per-ounce"], region: "middle-east", blurb: "The UAE dirham is pegged to the US dollar, so UAE gold rates move almost exactly with the US spot price." }),
  L({ slug: "dubai", name: "Dubai", inName: "Dubai", country: "United Arab Emirates", currency: "AED", units: ["per-gram", "per-ounce"], region: "middle-east", parent: "uae", blurb: "The Dubai Gold Souk sets daily 24K, 22K, 21K and 18K per-gram rates through the Dubai Gold & Jewellery Group." }),
  L({ slug: "saudi-arabia", name: "Saudi Arabia", inName: "Saudi Arabia (KSA)", short: "KSA", country: "Saudi Arabia", currency: "SAR", units: ["per-gram", "per-ounce"], region: "middle-east", blurb: "Saudi jewellers mostly sell 21K and 18K gold; the riyal is pegged to the dollar at 3.75." }),
  L({ slug: "qatar", name: "Qatar", inName: "Qatar", country: "Qatar", currency: "QAR", units: ["per-gram", "per-ounce"], region: "middle-east", blurb: "The Qatari riyal is pegged to the US dollar, and Doha's Gold Souq quotes 22K and 24K gold per gram." }),
  L({ slug: "kuwait", name: "Kuwait", inName: "Kuwait", country: "Kuwait", currency: "KWD", units: ["per-gram", "per-ounce"], region: "middle-east", blurb: "The Kuwaiti dinar is the world's highest-valued currency unit, so per-gram gold prices look small in KWD." }),
  L({ slug: "oman", name: "Oman", inName: "Oman", country: "Oman", currency: "OMR", units: ["per-gram", "per-ounce"], region: "middle-east", blurb: "The Omani rial is pegged to the US dollar, keeping Muscat gold prices closely aligned with spot." }),
  L({ slug: "jordan", name: "Jordan", inName: "Jordan", country: "Jordan", currency: "JOD", units: ["per-gram", "per-ounce"], region: "middle-east", blurb: "Jordanian jewellers mainly sell 21K gold, quoted per gram in dinars." }),
  L({ slug: "egypt", name: "Egypt", inName: "Egypt", country: "Egypt", currency: "EGP", units: ["per-gram", "per-ounce"], region: "middle-east", blurb: "21K is the most traded purity in Egypt, and local prices react strongly to moves in the Egyptian pound." }),
  // Asia-Pacific
  L({ slug: "australia", name: "Australia", inName: "Australia", country: "Australia", currency: "AUD", units: ["per-ounce", "per-gram"], region: "asia-pacific", blurb: "Australia is one of the world's top gold producers; the Perth Mint sells bullion priced in Australian dollars." }),
  L({ slug: "singapore", name: "Singapore", inName: "Singapore", country: "Singapore", currency: "SGD", units: ["per-gram", "per-ounce"], region: "asia-pacific", blurb: "Investment-grade gold is GST-exempt in Singapore, which has become a major Asian bullion storage hub." }),
  L({ slug: "malaysia", name: "Malaysia", inName: "Malaysia", country: "Malaysia", currency: "MYR", units: ["per-gram", "per-ounce"], region: "asia-pacific", blurb: "Malaysian jewellers price 916 (22K) and 999 (24K) gold per gram in ringgit." }),
  L({ slug: "china", name: "China", inName: "China", country: "China", currency: "CNY", units: ["per-gram", "per-ounce"], region: "asia-pacific", blurb: "The Shanghai Gold Exchange quotes gold per gram in yuan and often trades at a premium to London and New York." }),
  L({ slug: "thailand", name: "Thailand", inName: "Thailand", country: "Thailand", currency: "THB", units: ["per-gram", "per-ounce"], region: "asia-pacific", blurb: "Thai gold shops trade 96.5% gold by the baht-weight (15.2 g); this page shows the international per-gram equivalent." }),
  L({ slug: "vietnam", name: "Vietnam", inName: "Vietnam", country: "Vietnam", currency: "VND", units: ["per-gram", "per-ounce"], region: "asia-pacific", blurb: "Vietnamese SJC gold bars often trade well above the international price because of import controls." }),
  // Africa
  L({ slug: "south-africa", name: "South Africa", inName: "South Africa", country: "South Africa", currency: "ZAR", units: ["per-gram", "per-ounce"], region: "africa", blurb: "South Africa issues the Krugerrand, the world's first modern gold bullion coin, priced in rand off the spot price." }),
  L({ slug: "ethiopia", name: "Ethiopia", inName: "Ethiopia", country: "Ethiopia", currency: "ETB", units: ["per-gram", "per-ounce"], region: "africa", blurb: "Ethiopian prices are shown at the official birr exchange rate; street rates can differ." }),
];

export const CURRENCY_NAMES: Record<string, string> = {
  USD: "US dollars", CAD: "Canadian dollars", GBP: "British pounds", EUR: "euros", CHF: "Swiss francs",
  INR: "Indian rupees", PKR: "Pakistani rupees", NPR: "Nepalese rupees", BDT: "Bangladeshi taka", LKR: "Sri Lankan rupees",
  AED: "UAE dirhams", SAR: "Saudi riyals", QAR: "Qatari riyals", KWD: "Kuwaiti dinars", OMR: "Omani rials",
  JOD: "Jordanian dinars", EGP: "Egyptian pounds", AUD: "Australian dollars", SGD: "Singapore dollars",
  MYR: "Malaysian ringgit", CNY: "Chinese yuan", THB: "Thai baht", VND: "Vietnamese dong", ZAR: "South African rand",
  ETB: "Ethiopian birr",
};

export const CURRENCIES = Object.keys(CURRENCY_NAMES);

export type GoldSlug =
  | { kind: "karat"; karat: Karat }
  | { kind: "unit"; unit: Unit }
  | { kind: "location"; location: Location };

export function resolveGoldSlug(slug: string): GoldSlug | null {
  const karat = KARATS.find((k) => k.slug === slug);
  if (karat) return { kind: "karat", karat };
  const unit = UNITS.find((u) => u.slug === slug);
  if (unit) return { kind: "unit", unit };
  const location = LOCATIONS.find((l) => l.slug === slug);
  if (location) return { kind: "location", location };
  return null;
}

export function allGoldSlugs() {
  return [...KARATS.map((k) => k.slug), ...UNITS.map((u) => u.slug), ...LOCATIONS.map((l) => l.slug)];
}

/** Price of `grams` of gold at `purity`, given USD/oz spot and a USD→currency rate. */
export function goldValue(spotUsdOz: number, fx: number, grams: number, purity = 1) {
  return (spotUsdOz / GRAMS_PER_OZ) * grams * purity * fx;
}
