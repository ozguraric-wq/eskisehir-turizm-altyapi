import type { Metadata } from "next";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";

export const metadata: Metadata = {
  metadataBase: isGitHubPages ? new URL("https://ozguraric-wq.github.io") : undefined,
  title: {
    default: "Eskişehir Turizm Altyapı Hizmet Birliği",
    template: "%s | Eskişehir Turizm Altyapı Hizmet Birliği",
  },
  description:
    "Eskişehir'in 14 ilçesinde turizm altyapısını, ziyaretçi deneyimini ve sürdürülebilir destinasyon yönetimini buluşturan Vizyon Eskişehir 2036 projesi.",
  openGraph: {
    title: "Eskişehir Turizm Altyapı Hizmet Birliği",
    description: "14 ilçe · ortak rota · güçlü altyapı",
    locale: "tr_TR",
    type: "website",
    images: [{ url: `${basePath}/opengraph.webp`, width: 1200, height: 630, alt: "Eskişehir Turizm Altyapı Hizmet Birliği" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eskişehir Turizm Altyapı Hizmet Birliği",
    description: "14 ilçe · ortak rota · güçlü altyapı",
    images: [`${basePath}/opengraph.webp`],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={isGitHubPages ? "auth-pending" : undefined}>
      {isGitHubPages ? <Script src={`${basePath}/auth.js`} strategy="beforeInteractive" /> : null}
      <body>
        <a className="skip-link" href="#ana-icerik">
          Ana içeriğe geç
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
