# AmpXa — Gold Price Today & Live Stock Prices (USA, Canada)

**[ampxa.com](https://ampxa.com)** shows the **live gold price today** per gram, per ounce and by karat (24K, 22K, 21K, 18K, 14K, 10K, 9K) in US dollars, Canadian dollars and 25 other currencies, plus **live stock prices** for the S&P 500, Nasdaq, Dow Jones, TSX, the Magnificent 7, popular ETFs and crypto. It works on phones and desktops and refreshes about every minute.

[![Live site](https://img.shields.io/badge/live-ampxa.com-a87408)](https://ampxa.com)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-f38020)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Features

- **Gold price today** — live spot price per gram, ounce, 10 grams, tola and kilogram, with a 1-day to 10-year chart and the last 30 days of closing prices.
- **Gold rate by karat** — [24K](https://ampxa.com/gold-price-today/24k), [22K (916)](https://ampxa.com/gold-price-today/22k), [21K](https://ampxa.com/gold-price-today/21k), [18K (750)](https://ampxa.com/gold-price-today/18k), [14K (585)](https://ampxa.com/gold-price-today/14k), [10K](https://ampxa.com/gold-price-today/10k) and [9ct](https://ampxa.com/gold-price-today/9k) per gram.
- **Gold price by country and city** — 54 local pages in local currency, including the [USA](https://ampxa.com/gold-price-today/usa), [Canada](https://ampxa.com/gold-price-today/canada), [Toronto](https://ampxa.com/gold-price-today/toronto), [New York](https://ampxa.com/gold-price-today/new-york), [UK](https://ampxa.com/gold-price-today/uk), [Saudi Arabia (KSA)](https://ampxa.com/gold-price-today/saudi-arabia), [Dubai](https://ampxa.com/gold-price-today/dubai) and [India](https://ampxa.com/gold-price-today/india).
- **[Gold calculator](https://ampxa.com/gold-price-today/calculator)** — melt value by weight (g, oz, tola, dwt, kg), purity and currency, with an optional premium.
- **[Silver price today](https://ampxa.com/silver-price-today)** and the gold-to-silver ratio.
- **[Stock prices today](https://ampxa.com/stock-price-today)** — about 190 tickers, each with a live quote, chart, day range, 52-week high/low and FAQ. Examples: [NVIDIA (NVDA)](https://ampxa.com/stock-price-today/nvda), [Apple (AAPL)](https://ampxa.com/stock-price-today/aapl), [SpaceX (SPCX)](https://ampxa.com/stock-price-today/spcx), [Royal Bank of Canada (TSX: RY)](https://ampxa.com/stock-price-today/ry-to), [S&P 500](https://ampxa.com/stock-price-today/sp-500), [GDX](https://ampxa.com/stock-price-today/gdx), [Bitcoin](https://ampxa.com/stock-price-today/bitcoin).

## SEO built in

- Titles that include today's price and the exact search wording (e.g. *"14K Gold Price Today Per Gram: $73.17 (14 Carat, 585)"*).
- Unique meta descriptions, canonical URLs, Open Graph and Twitter cards on every page.
- JSON-LD structured data: `Organization`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`.
- `sitemap.xml` (~260 URLs), `robots.txt`, web manifest and a generated Open Graph image.
- Real 404s for unknown URLs, plus 308 redirects from search variants (`/916` → `/22k`, `/nyc` → `/new-york`).
- Long-tail coverage of 1,032 researched keywords: `npm run keywords` writes [`keywords/keyword-map.csv`](keywords/keyword-map.csv), mapping each keyword to its target page.
- Mobile-first layout with no horizontal scroll at 375 px, light and dark themes.

## Tech stack

| Part | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Hosting | Cloudflare Workers via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) |
| Market data | Yahoo Finance chart endpoint (gold/silver: COMEX futures). Cached 1 min in memory and at the Cloudflare edge. |

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run preview    # production build in the local Workers runtime
```

## Deploy

```bash
npx wrangler login   # once
npm run deploy       # build + deploy the "ampxa" Worker to ampxa.com
```

The canonical domain for URLs, the sitemap and Open Graph tags defaults to `https://ampxa.com`; set `NEXT_PUBLIC_SITE_URL` (e.g. in `.env.production`) to override it.

Cache Components is deliberately **off**: it hangs requests on the Workers runtime. Pages render per request, and market data is cached in [`src/lib/market.ts`](src/lib/market.ts).

## Project structure

```
src/app/gold-price-today/        gold hub, [slug] karat/unit/location pages, calculator
src/app/stock-price-today/       market overview and [slug] ticker pages
src/app/silver-price-today/      silver page
src/lib/gold.ts                  karats, units, 54 locations
src/lib/stocks.ts                ticker catalog (stocks, ETFs, indices, crypto)
src/lib/market.ts                market data fetching and caching
src/lib/seo.ts                   metadata and JSON-LD helpers
keywords/                        keyword research CSVs and keyword → page map
```

## Disclaimer

Prices are for information only and may be delayed. Gold prices are spot-based metal values and exclude dealer premiums, making charges and taxes. Nothing here is financial advice.

## License

[MIT](LICENSE) © 2026 Chameera Sampath. Market data belongs to its providers and is not covered by this license.
