const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'app');

// 1. Create app/[slug]/page.tsx
const slugDir = path.join(appDir, '[slug]');
if (!fs.existsSync(slugDir)) {
  fs.mkdirSync(slugDir);
}

const slugPageCode = `import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Article from "@/components/Article";
import { ARTIKEL } from "@/lib/artikel";
import { decodeEntities } from "@/lib/kota";
import { JsonLd, pageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(ARTIKEL).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = ARTIKEL[slug];
  if (!a) return {};

  const base = pageMetadata({
    title: decodeEntities(a.title),
    description: decodeEntities(a.description),
    path: \`/\${slug}/\`,
    image: a.ogImage || "/images/promo-wifi-rumah-koneksi-pasti.webp",
  });
  return {
    ...base,
    keywords: a.keywords,
    openGraph: {
      ...base.openGraph,
      title: decodeEntities(a.ogTitle || a.title),
      description: decodeEntities(a.ogDescription || a.description),
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const a = ARTIKEL[slug];
  
  if (!a) notFound();

  return (
    <>
      <Article data={a} />
      {a.schemas && a.schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}
`;

fs.writeFileSync(path.join(slugDir, 'page.tsx'), slugPageCode);
console.log('Created app/[slug]/page.tsx');

// 2. Delete the old 11 article folders
const foldersToDelete = [
  "250-mbps-untuk-berapa-orang",
  "5-hal-wajib-dicek-sebelum-pasang-wifi-rumah",
  "biaya-pasang-wifi-solo-raya",
  "cara-daftar-pasang-wifi-xl-satu-solo",
  "internet-rakyat-vs-xl-satu",
  "kecepatan-wifi-ideal-keluarga",
  "paket-wifi-tahunan-bayar-10-dapat-12",
  "panduan-fiber-vs-wireless",
  "panduan-wifi-kos-solo",
  "penyebab-wifi-lemot-cara-mengatasi",
  "solusi-internet-daerah-belum-ada-fiber-optik",
  "xl-satu-vs-indihome-myrepublic-solo"
];

foldersToDelete.forEach(folder => {
  const p = path.join(appDir, folder);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log('Deleted', folder);
  }
});
