import localFont from "next/font/local";

// One self-hosted variable font for the whole site: Manrope, the brand face of the WordPress
// site, weights 200–800 in a single ~25 KB file (Latin, including accented names). It replaces
// three Google Fonts families (Manrope, Muli, Lato: about 14 files and a render-blocking request
// to another server). Next preloads it and sizes the fallback to match, so text doesn't jump
// when it arrives. Manrope has no italic; browsers slant it for emphasis, which suits a
// geometric sans.
const manrope = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const fontClassName = `${manrope.variable} antialiased`;
