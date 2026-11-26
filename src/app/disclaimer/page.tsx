import { StaticPage } from "@/components/StaticPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Disclaimer",
  description: "AmpXa market data is for information only, may be delayed, and is not investment advice.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <StaticPage title="Disclaimer" path="/disclaimer">
      <p>
        All prices, charts and calculations on AmpXa are provided for general information only. Data may be delayed, incomplete or inaccurate, and is
        provided &quot;as is&quot; without warranty of any kind.
      </p>
      <p>
        AmpXa is not a broker, dealer or registered investment adviser. Nothing on this site is a recommendation or solicitation to buy or sell any
        security, commodity or cryptocurrency. Consult a licensed financial professional before making investment decisions.
      </p>
      <p>
        Gold prices shown are spot-based metal values. Actual buying and selling prices at dealers and jewellers include premiums, fees and taxes.
      </p>
    </StaticPage>
  );
}
