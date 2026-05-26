import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "200",
          height: "200",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            width: "140",
            height: "140",
            borderRadius: "35px",
            background: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "80px",
            fontWeight: "bold",
            color: "#0a0a0f",
          }}
        >
          G
        </div>
      </div>
    ),
    {
      width: 200,
      height: 200,
    }
  );
}
