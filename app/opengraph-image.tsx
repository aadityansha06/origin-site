import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0c0e11",
          color: "#eceef1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <svg width="52" height="52" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="15.5" stroke="#c1443a" strokeWidth="2.6" fill="none" />
            <circle cx="20" cy="4.5" r="1.7" fill="#9aa2ae" />
            <circle cx="20" cy="35.5" r="1.7" fill="#9aa2ae" />
            <circle cx="4.5" cy="20" r="1.7" fill="#9aa2ae" />
            <circle cx="35.5" cy="20" r="1.7" fill="#9aa2ae" />
            <circle cx="20" cy="20" r="1.6" fill="#e0594c" />
          </svg>
          <span style={{ fontSize: 34 }}>OriginDB</span>
        </div>
        <div style={{ fontSize: 54, lineHeight: 1.15, maxWidth: 920 }}>
          A vector database a stolen key can never empty.
        </div>
        <div style={{ fontSize: 26, color: "#9aa2ae", marginTop: 28, maxWidth: 820 }}>
          Disk-backed ANN search, written from scratch in C. Deletion can be
          requested over the network — only ever executed locally, by a human.
        </div>
      </div>
    ),
    { ...size }
  );
}
