import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "800",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: "bold",
              color: "black",
            }}
          >
            G
          </div>
          <div style={{ display: "flex", fontSize: "56px", fontWeight: "bold", color: "#e4e4e7" }}>
            Git
            <span style={{ color: "#22c55e" }}>Bet</span>
          </div>
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "#71717a",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: "1.4",
          }}
        >
          Predict the future of open source.
          Bet on GitHub repo stars, forks &amp; trends.
        </div>

        <div
          style={{
            marginTop: "50px",
            display: "flex",
            gap: "16px",
          }}
        >
          <div
            style={{
              padding: "12px 32px",
              borderRadius: "12px",
              background: "rgba(34, 197, 94, 0.15)",
              color: "#22c55e",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            YES 67%
          </div>
          <div
            style={{
              padding: "12px 32px",
              borderRadius: "12px",
              background: "rgba(239, 68, 68, 0.15)",
              color: "#ef4444",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            NO 33%
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
    }
  );
}
