import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Brand colors, mirrored from the CSS tokens in globals.css (light theme). */
export const BRAND = {
  paper: "#faf7f2",
  ink: "#1f1a17",
  muted: "#6b6258",
  accent: "#8c2f39",
} as const;

const fontFile = (pkg: string, file: string) =>
  readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

// Static assets: read once at module scope so the images can be prerendered at build time.
const [fraunces, frauncesItalic, inter] = await Promise.all([
  fontFile("fraunces", "fraunces-latin-600-normal.woff"),
  fontFile("fraunces", "fraunces-latin-600-italic.woff"),
  fontFile("inter", "inter-latin-400-normal.woff"),
]);

export const FONTS = {
  fraunces: { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
  frauncesItalic: { name: "Fraunces", data: frauncesItalic, weight: 600, style: "italic" },
  inter: { name: "Inter", data: inter, weight: 400, style: "normal" },
} as const;
