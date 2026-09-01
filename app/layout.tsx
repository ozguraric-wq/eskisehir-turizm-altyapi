import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
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
    images: [{ url: "/opengraph.webp", width: 1200, height: 630, alt: "Eskişehir Turizm Altyapı Hizmet Birliği" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eskişehir Turizm Altyapı Hizmet Birliği",
    description: "14 ilçe · ortak rota · güçlü altyapı",
    images: ["/opengraph.webp"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
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
