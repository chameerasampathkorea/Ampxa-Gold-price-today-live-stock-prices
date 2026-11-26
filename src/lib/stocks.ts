export type AssetKind = "stock" | "etf" | "index" | "crypto";

export type Asset = {
  slug: string;
  symbol: string;
  /** Ticker as people search it (e.g. "BRK.B", "S&P 500"). */
  ticker: string;
  name: string;
  kind: AssetKind;
  sector: string;
  country: "US" | "CA" | "Global";
  /** Extra search phrases from keyword research (brand names, nicknames). */
  aliases?: string[];
  popular?: boolean;
};

type Row = [symbol: string, name: string, sector: string, extra?: Partial<Asset>];

const slugify = (s: string) => s.toLowerCase().replace(/\^/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function build(kind: AssetKind, country: Asset["country"], rows: Row[]): Asset[] {
  return rows.map(([symbol, name, sector, extra]) => ({
    slug: extra?.slug ?? slugify(symbol),
    symbol,
    ticker: extra?.ticker ?? symbol.replace("-", "."),
    name,
    kind,
    sector,
    country,
    ...extra,
  }));
}

const US_STOCKS: Row[] = [
  ["NVDA", "NVIDIA", "Semiconductors", { aliases: ["nvidia"], popular: true }],
  ["AAPL", "Apple", "Technology", { aliases: ["apple"], popular: true }],
  ["MSFT", "Microsoft", "Technology", { aliases: ["microsoft"], popular: true }],
  ["AMZN", "Amazon", "Consumer", { aliases: ["amazon"], popular: true }],
  ["GOOGL", "Alphabet (Google) Class A", "Technology", { aliases: ["google", "alphabet"], popular: true }],
  ["GOOG", "Alphabet (Google) Class C", "Technology", { aliases: ["google", "alphabet"] }],
  ["META", "Meta Platforms", "Technology", { aliases: ["meta", "facebook"], popular: true }],
  ["TSLA", "Tesla", "Automotive", { aliases: ["tesla"], popular: true }],
  ["AMD", "Advanced Micro Devices", "Semiconductors", { aliases: ["amd"], popular: true }],
  ["MU", "Micron Technology", "Semiconductors", { aliases: ["micron"], popular: true }],
  ["AVGO", "Broadcom", "Semiconductors", { aliases: ["broadcom"], popular: true }],
  ["PLTR", "Palantir Technologies", "Software", { aliases: ["palantir"], popular: true }],
  ["NFLX", "Netflix", "Media", { aliases: ["netflix"], popular: true }],
  ["ARM", "Arm Holdings", "Semiconductors", { aliases: ["arm"] }],
  ["ASML", "ASML Holding", "Semiconductors", { aliases: ["asml"] }],
  ["TSM", "Taiwan Semiconductor (TSMC)", "Semiconductors", { aliases: ["tsmc"], popular: true }],
  ["INTC", "Intel", "Semiconductors", { aliases: ["intel"], popular: true }],
  ["QCOM", "Qualcomm", "Semiconductors", { aliases: ["qualcomm"] }],
  ["LRCX", "Lam Research", "Semiconductors"],
  ["MRVL", "Marvell Technology", "Semiconductors", { aliases: ["marvell"] }],
  ["SMCI", "Super Micro Computer", "Hardware", { aliases: ["supermicro"] }],
  ["WDC", "Western Digital", "Hardware"],
  ["SNDK", "Sandisk", "Hardware", { aliases: ["sandisk"] }],
  ["DELL", "Dell Technologies", "Hardware", { aliases: ["dell"] }],
  ["HPE", "Hewlett Packard Enterprise", "Hardware"],
  ["ANET", "Arista Networks", "Networking"],
  ["CSCO", "Cisco Systems", "Networking", { aliases: ["cisco"] }],
  ["GLW", "Corning", "Hardware", { aliases: ["corning"] }],
  ["VRT", "Vertiv Holdings", "Industrials", { aliases: ["vertiv"] }],
  ["IBM", "IBM", "Technology", { aliases: ["ibm"] }],
  ["ORCL", "Oracle", "Software", { aliases: ["oracle"], popular: true }],
  ["CRM", "Salesforce", "Software", { aliases: ["salesforce"] }],
  ["NOW", "ServiceNow", "Software", { aliases: ["servicenow"] }],
  ["ADP", "Automatic Data Processing", "Software", { aliases: ["adp"] }],
  ["CRWD", "CrowdStrike", "Cybersecurity", { aliases: ["crowdstrike"] }],
  ["ZS", "Zscaler", "Cybersecurity", { aliases: ["zscaler"] }],
  ["ZM", "Zoom Communications", "Software", { aliases: ["zoom"] }],
  ["CRWV", "CoreWeave", "AI Infrastructure", { aliases: ["coreweave"] }],
  ["NBIS", "Nebius Group", "AI Infrastructure", { aliases: ["nebius"] }],
  ["APLD", "Applied Digital", "AI Infrastructure"],
  ["IREN", "IREN", "AI Infrastructure"],
  ["IONQ", "IonQ", "Quantum Computing", { aliases: ["ionq"] }],
  ["RGTI", "Rigetti Computing", "Quantum Computing", { aliases: ["rigetti"] }],
  ["QBTS", "D-Wave Quantum", "Quantum Computing", { aliases: ["d-wave"] }],
  ["QUBT", "Quantum Computing Inc.", "Quantum Computing"],
  ["NOK", "Nokia", "Networking", { aliases: ["nokia"] }],
  ["UBER", "Uber Technologies", "Transportation", { aliases: ["uber"] }],
  ["RDDT", "Reddit", "Media", { aliases: ["reddit"] }],
  ["HOOD", "Robinhood Markets", "Financials", { aliases: ["robinhood"] }],
  ["SOFI", "SoFi Technologies", "Financials", { aliases: ["sofi"] }],
  ["COIN", "Coinbase Global", "Financials", { aliases: ["coinbase"] }],
  ["EBAY", "eBay", "Consumer", { aliases: ["ebay"] }],
  ["JPM", "JPMorgan Chase", "Banks", { aliases: ["jpmorgan"], popular: true }],
  ["BAC", "Bank of America", "Banks", { aliases: ["bank of america"] }],
  ["WFC", "Wells Fargo", "Banks", { aliases: ["wells fargo"] }],
  ["MS", "Morgan Stanley", "Banks", { aliases: ["morgan stanley"] }],
  ["V", "Visa", "Financials", { aliases: ["visa"] }],
  ["MA", "Mastercard", "Financials", { aliases: ["mastercard"] }],
  ["BRK-B", "Berkshire Hathaway Class B", "Financials", { aliases: ["berkshire hathaway", "brkb"], popular: true }],
  ["BX", "Blackstone", "Financials", { aliases: ["blackstone"] }],
  ["LLY", "Eli Lilly", "Healthcare", { aliases: ["eli lilly", "lilly"], popular: true }],
  ["UNH", "UnitedHealth Group", "Healthcare", { aliases: ["unitedhealth"] }],
  ["JNJ", "Johnson & Johnson", "Healthcare", { aliases: ["johnson & johnson"] }],
  ["ABBV", "AbbVie", "Healthcare", { aliases: ["abbvie"] }],
  ["MRK", "Merck & Co.", "Healthcare", { aliases: ["merck"] }],
  ["PFE", "Pfizer", "Healthcare", { aliases: ["pfizer"] }],
  ["BMY", "Bristol-Myers Squibb", "Healthcare"],
  ["CVS", "CVS Health", "Healthcare", { aliases: ["cvs"] }],
  ["MDT", "Medtronic", "Healthcare", { aliases: ["medtronic"] }],
  ["NVO", "Novo Nordisk", "Healthcare", { aliases: ["novo nordisk"] }],
  ["GEHC", "GE HealthCare", "Healthcare"],
  ["ZTS", "Zoetis", "Healthcare", { aliases: ["zoetis"] }],
  ["ZBH", "Zimmer Biomet", "Healthcare"],
  ["WMT", "Walmart", "Consumer", { aliases: ["walmart"], popular: true }],
  ["COST", "Costco Wholesale", "Consumer", { aliases: ["costco"], popular: true }],
  ["KO", "Coca-Cola", "Consumer", { aliases: ["coca cola", "coke"] }],
  ["PG", "Procter & Gamble", "Consumer", { aliases: ["procter & gamble"] }],
  ["MCD", "McDonald's", "Consumer", { aliases: ["mcdonalds"] }],
  ["NKE", "Nike", "Consumer", { aliases: ["nike"] }],
  ["DIS", "Walt Disney", "Media", { aliases: ["disney"] }],
  ["HD", "Home Depot", "Consumer", { aliases: ["home depot"] }],
  ["LOW", "Lowe's", "Consumer", { aliases: ["lowes"] }],
  ["KR", "Kroger", "Consumer", { aliases: ["kroger"] }],
  ["KHC", "Kraft Heinz", "Consumer"],
  ["KMB", "Kimberly-Clark", "Consumer"],
  ["MO", "Altria Group", "Consumer", { aliases: ["altria"] }],
  ["YUM", "Yum! Brands", "Consumer"],
  ["YUMC", "Yum China", "Consumer"],
  ["YETI", "YETI Holdings", "Consumer"],
  ["CMCSA", "Comcast", "Media", { aliases: ["comcast"] }],
  ["T", "AT&T", "Telecom", { aliases: ["at&t", "att"] }],
  ["VZ", "Verizon", "Telecom", { aliases: ["verizon"] }],
  ["BA", "Boeing", "Aerospace & Defense", { aliases: ["boeing"] }],
  ["RTX", "RTX Corporation", "Aerospace & Defense", { aliases: ["raytheon"] }],
  ["LMT", "Lockheed Martin", "Aerospace & Defense", { aliases: ["lockheed martin"] }],
  ["GD", "General Dynamics", "Aerospace & Defense"],
  ["KTOS", "Kratos Defense", "Aerospace & Defense"],
  ["RKLB", "Rocket Lab", "Aerospace & Defense", { aliases: ["rocket lab"] }],
  ["JOBY", "Joby Aviation", "Aerospace & Defense", { aliases: ["joby"] }],
  ["GE", "GE Aerospace", "Industrials"],
  ["GEV", "GE Vernova", "Energy", { aliases: ["ge vernova"] }],
  ["CAT", "Caterpillar", "Industrials", { aliases: ["caterpillar"] }],
  ["ETN", "Eaton", "Industrials"],
  ["MMM", "3M", "Industrials", { aliases: ["3m"] }],
  ["UPS", "United Parcel Service", "Industrials", { aliases: ["ups"] }],
  ["SHW", "Sherwin-Williams", "Industrials"],
  ["F", "Ford Motor", "Automotive", { aliases: ["ford"] }],
  ["GM", "General Motors", "Automotive", { aliases: ["gm"] }],
  ["RIVN", "Rivian Automotive", "Automotive", { aliases: ["rivian"] }],
  ["NIO", "NIO", "Automotive"],
  ["XOM", "ExxonMobil", "Energy", { aliases: ["exxon", "exxonmobil"] }],
  ["CVX", "Chevron", "Energy", { aliases: ["chevron"] }],
  ["COP", "ConocoPhillips", "Energy"],
  ["PSX", "Phillips 66", "Energy", { aliases: ["phillips 66"] }],
  ["OXY", "Occidental Petroleum", "Energy"],
  ["MPC", "Marathon Petroleum", "Energy"],
  ["BP", "BP", "Energy"],
  ["EPD", "Enterprise Products Partners", "Energy"],
  ["ET", "Energy Transfer", "Energy"],
  ["KMI", "Kinder Morgan", "Energy"],
  ["NEE", "NextEra Energy", "Utilities"],
  ["CEG", "Constellation Energy", "Utilities", { aliases: ["constellation energy"] }],
  ["XEL", "Xcel Energy", "Utilities"],
  ["NEM", "Newmont", "Gold Miners", { aliases: ["newmont"] }],
  ["KGC", "Kinross Gold", "Gold Miners"],
  ["MP", "MP Materials", "Materials", { aliases: ["mp materials"] }],
  ["LAC", "Lithium Americas", "Materials"],
  ["BABA", "Alibaba Group", "Consumer", { aliases: ["alibaba"] }],
  ["DJT", "Trump Media & Technology Group", "Media"],
  ["SPCX", "SpaceX", "Aerospace & Defense", { aliases: ["spacex", "space x"], popular: true }],
  ["USAR", "USA Rare Earth", "Materials"],
  ["KD", "Kyndryl Holdings", "Technology", { aliases: ["kyndryl"] }],
  ["XYZ", "Block", "Financials", { aliases: ["block", "square"] }],
  ["BIDU", "Baidu", "Technology", { aliases: ["baidu"] }],
  ["AAL", "American Airlines", "Transportation", { aliases: ["american airlines"] }],
  ["PRU", "Prudential Financial", "Financials", { aliases: ["prudential"] }],
  ["QS", "QuantumScape", "Automotive", { aliases: ["quantumscape"] }],
  ["QXO", "QXO", "Industrials"],
  ["YELP", "Yelp", "Media", { aliases: ["yelp"] }],
  ["ZETA", "Zeta Global", "Software"],
  ["ZIM", "ZIM Integrated Shipping", "Transportation"],
  ["WU", "Western Union", "Financials", { aliases: ["western union"] }],
  ["WRB", "W. R. Berkley", "Financials"],
  ["YPF", "YPF", "Energy"],
  ["FIVE", "Five Below", "Consumer", { aliases: ["five below"] }],
  ["HUT", "Hut 8", "AI Infrastructure", { aliases: ["hut 8"] }],
  ["EGHT", "8x8", "Software", { aliases: ["8x8"] }],
  ["RPD", "Rapid7", "Cybersecurity", { aliases: ["rapid 7", "rapid7"] }],
  ["DXYZ", "Destiny Tech100", "Financials"],
];

const CA_STOCKS: Row[] = [
  ["RY.TO", "Royal Bank of Canada", "Banks", { ticker: "RY", aliases: ["rbc", "royal bank"], popular: true }],
  ["TD.TO", "Toronto-Dominion Bank", "Banks", { ticker: "TD", aliases: ["td bank"] }],
  ["BNS.TO", "Bank of Nova Scotia", "Banks", { ticker: "BNS", aliases: ["scotiabank"] }],
  ["ENB.TO", "Enbridge", "Energy", { ticker: "ENB", aliases: ["enbridge"] }],
  ["BCE.TO", "BCE Inc. (Bell Canada)", "Telecom", { ticker: "BCE", aliases: ["bell"] }],
  ["T.TO", "TELUS", "Telecom", { ticker: "T", aliases: ["telus"] }],
  ["SHOP.TO", "Shopify", "Software", { ticker: "SHOP", aliases: ["shopify"], popular: true }],
  ["CNQ.TO", "Canadian Natural Resources", "Energy", { ticker: "CNQ" }],
  ["SU.TO", "Suncor Energy", "Energy", { ticker: "SU", aliases: ["suncor"] }],
  ["CNR.TO", "Canadian National Railway", "Industrials", { ticker: "CNR", aliases: ["cn rail"] }],
];

const ETFS: Row[] = [
  ["SPY", "SPDR S&P 500 ETF", "Broad Market", { popular: true }],
  ["QQQ", "Invesco QQQ (Nasdaq-100)", "Broad Market", { aliases: ["invesco qqq"], popular: true }],
  ["QQQM", "Invesco Nasdaq 100 ETF", "Broad Market"],
  ["VOO", "Vanguard S&P 500 ETF", "Broad Market", { popular: true }],
  ["VTI", "Vanguard Total Stock Market ETF", "Broad Market"],
  ["VGT", "Vanguard Information Technology ETF", "Sector"],
  ["VUG", "Vanguard Growth ETF", "Broad Market"],
  ["DIA", "SPDR Dow Jones Industrial Average ETF", "Broad Market"],
  ["JEPI", "JPMorgan Equity Premium Income ETF", "Income"],
  ["XLK", "Technology Select Sector SPDR", "Sector"],
  ["XLF", "Financial Select Sector SPDR", "Sector"],
  ["XLE", "Energy Select Sector SPDR", "Sector"],
  ["XBI", "SPDR S&P Biotech ETF", "Sector"],
  ["GLD", "SPDR Gold Shares", "Commodities", { aliases: ["gold etf"] }],
  ["SLV", "iShares Silver Trust", "Commodities", { aliases: ["silver etf"] }],
  ["GDX", "VanEck Gold Miners ETF", "Commodities"],
];

const INDICES: Row[] = [
  ["^GSPC", "S&P 500", "Index", { slug: "sp-500", ticker: "S&P 500", aliases: ["s&p 500", "spx"], popular: true }],
  ["^DJI", "Dow Jones Industrial Average", "Index", { slug: "dow-jones", ticker: "Dow Jones", aliases: ["dow jones", "dow"], popular: true }],
  ["^IXIC", "Nasdaq Composite", "Index", { slug: "nasdaq", ticker: "Nasdaq", aliases: ["nasdaq"], popular: true }],
  ["^NDX", "Nasdaq-100", "Index", { slug: "nasdaq-100", ticker: "Nasdaq 100", aliases: ["nasdaq 100"] }],
  ["^RUT", "Russell 2000", "Index", { slug: "russell-2000", ticker: "Russell 2000", aliases: ["russell 2000"] }],
  ["^GSPTSE", "S&P/TSX Composite", "Index", { slug: "tsx", ticker: "TSX", aliases: ["tsx"], popular: true }],
];

const CRYPTO: Row[] = [
  ["BTC-USD", "Bitcoin", "Crypto", { slug: "bitcoin", ticker: "BTC", popular: true }],
  ["ETH-USD", "Ethereum", "Crypto", { slug: "ethereum", ticker: "ETH" }],
  ["XRP-USD", "XRP", "Crypto", { slug: "xrp", ticker: "XRP" }],
  ["DOGE-USD", "Dogecoin", "Crypto", { slug: "dogecoin", ticker: "DOGE" }],
];

export const ASSETS: Asset[] = [
  ...build("index", "Global", INDICES).map((a) => ({ ...a, country: (a.symbol === "^GSPTSE" ? "CA" : "US") as Asset["country"] })),
  ...build("stock", "US", US_STOCKS),
  ...build("stock", "CA", CA_STOCKS),
  ...build("etf", "US", ETFS),
  ...build("crypto", "Global", CRYPTO),
];

const BY_SLUG = new Map(ASSETS.map((a) => [a.slug, a]));

export function getAsset(slug: string) {
  return BY_SLUG.get(slug) ?? null;
}

export const MAG7 = ["NVDA", "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA"];

export const INDEX_ASSETS = ASSETS.filter((a) => a.kind === "index");

export function assetsBySymbols(symbols: string[]) {
  return symbols.map((s) => ASSETS.find((a) => a.symbol === s)).filter((a): a is Asset => Boolean(a));
}

/** Related assets: same sector first, then popular names. */
export function relatedAssets(asset: Asset, n = 8) {
  const same = ASSETS.filter((a) => a.slug !== asset.slug && a.sector === asset.sector);
  const pop = ASSETS.filter((a) => a.slug !== asset.slug && a.popular && a.sector !== asset.sector);
  return [...same, ...pop].slice(0, n);
}

/** Every symbol the public quote API may serve (prevents it being used as an open proxy). */
export function allowedSymbols() {
  return new Set<string>([...ASSETS.map((a) => a.symbol), "GC=F", "SI=F"]);
}

export function kindLabel(kind: AssetKind) {
  return { stock: "stock", etf: "ETF", index: "index", crypto: "crypto" }[kind];
}
