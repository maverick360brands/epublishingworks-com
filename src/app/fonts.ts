import localFont from "next/font/local";

// Self-hosted variable fonts: no render-blocking request to Google Fonts.
const montserrat = localFont({
  src: "../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2",
  variable: "--font-montserrat",
  weight: "100 900",
  display: "swap",
});
const workSans = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/work-sans/files/work-sans-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-work-sans",
  weight: "100 900",
  display: "swap",
});
// Book titles on author and spotlight pages use Poppins; the About page quote uses Alice.
const poppins = localFont({
  src: [
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/poppins/files/poppins-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-poppins",
  display: "swap",
});
const alice = localFont({
  src: "../../node_modules/@fontsource/alice/files/alice-latin-400-normal.woff2",
  variable: "--font-alice",
  weight: "400",
  display: "swap",
});

export const fontClassName = `${montserrat.variable} ${workSans.variable} ${poppins.variable} ${alice.variable} antialiased`;
