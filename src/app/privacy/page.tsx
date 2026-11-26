import { StaticPage } from "@/components/StaticPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How AmpXa handles visitor data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" path="/privacy">
      <p>
        AmpXa does not require an account and does not collect personal information through its price pages or calculators. Calculator inputs stay in
        your browser.
      </p>
      <p>
        Our hosting provider may log standard technical data (IP address, browser type, pages visited) for security and performance. If analytics or
        advertising are added in future, this policy will be updated to describe them and any cookie choices.
      </p>
      <p>Questions about privacy can be sent to the site owner.</p>
    </StaticPage>
  );
}
