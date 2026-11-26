import { ImageResponse } from "next/og";

export const alt = "AmpXa — Gold price today and live stock prices";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0b0e14 0%, #1a2130 60%, #3a2a08 100%)",
          color: "#e8ecf3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, color: "#f2b84b" }}>AmpXa</div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 24 }}>Gold Price Today &amp; Live Stock Prices</div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#9aa4b5" }}>Per gram · per ounce · 24K–10K · USD &amp; CAD · S&amp;P 500 · NVDA · TSX</div>
      </div>
    ),
    size,
  );
}
