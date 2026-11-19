import { ImageResponse } from "next/og";
import { BRAND, FONTS } from "@/lib/og";

export const alt = "Estante: catálogo de livros com destaque para a literatura brasileira";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Decorative row of book spines: width, height and color.
const SPINES = [
  { w: 34, h: 150, color: BRAND.accent },
  { w: 28, h: 190, color: BRAND.ink },
  { w: 40, h: 130, color: "#c9a24a" },
  { w: 30, h: 170, color: "#2f6b4f" },
  { w: 36, h: 205, color: BRAND.muted },
  { w: 26, h: 140, color: BRAND.accent },
  { w: 38, h: 180, color: "#d9cfc0" },
  { w: 30, h: 160, color: BRAND.ink },
];

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BRAND.paper,
        color: BRAND.ink,
        padding: "64px 80px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", fontFamily: "Fraunces", fontWeight: 600, fontSize: 48 }}>
          Estante
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 22,
            letterSpacing: 5,
            color: BRAND.muted,
          }}
        >
          CATÁLOGO DE LIVROS
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "Fraunces",
          fontWeight: 600,
          fontSize: 82,
          lineHeight: 1.08,
          letterSpacing: -1.5,
        }}
      >
        <div style={{ display: "flex" }}>Encontre o próximo livro</div>
        <div style={{ display: "flex" }}>
          <span>de que você vai&nbsp;</span>
          <span style={{ fontStyle: "italic", color: BRAND.accent }}>se lembrar.</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          {SPINES.map((spine, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                width: spine.w,
                height: spine.h,
                background: spine.color,
                borderRadius: 3,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", fontFamily: "Inter", fontSize: 26, color: BRAND.muted }}>
          Com destaque para a literatura brasileira
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ ...FONTS.fraunces }, { ...FONTS.frauncesItalic }, { ...FONTS.inter }] },
  );
}
