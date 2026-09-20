const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

const targetLayout = `export const metadata: Metadata = {
  metadataBase: new URL("https://xlsatusolo.com"),
  robots: { index: true, follow: true },`;

const replacementLayout = `export const metadata: Metadata = {
  metadataBase: new URL("https://xlsatusolo.com"),
  title: {
    default: "XL SATU Solo Raya | Internet Rumah Fiber Optic Tanpa FUP",
    template: "%s | XL SATU Solo Raya"
  },
  openGraph: {
    siteName: "XL SATU Solo Raya",
  },
  robots: { index: true, follow: true },`;

layout = layout.replace(targetLayout, replacementLayout);
fs.writeFileSync('app/layout.tsx', layout);

let page = fs.readFileSync('app/page.tsx', 'utf8');
const targetPage = `title: "Pasang WiFi Solo Raya Tanpa FUP | XL SATU Internet Rumah",`;
const replacementPage = `title: "Pasang WiFi Solo Raya Tanpa FUP | XL SATU Solo Raya",`;

page = page.replace(targetPage, replacementPage);
fs.writeFileSync('app/page.tsx', page);

console.log("Patched layout and page.");
