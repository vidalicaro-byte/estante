import { ImageResponse } from "next/og";
import { BRAND, FONTS } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        borderRadius: 7,
        fontFamily: "Fraunces",
        fontWeight: 600,
        fontSize: 25,
      }}
    >
      E
    </div>,
    { ...size, fonts: [{ ...FONTS.fraunces }] },
  );
}
