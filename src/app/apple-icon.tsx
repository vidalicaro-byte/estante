import { ImageResponse } from "next/og";
import { BRAND, FONTS } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND.accent,
        color: BRAND.paper,
        fontFamily: "Fraunces",
        fontWeight: 600,
        fontSize: 128,
      }}
    >
      E
    </div>,
    { ...size, fonts: [{ ...FONTS.fraunces }] },
  );
}
