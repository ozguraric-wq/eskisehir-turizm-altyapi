import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Compass } from "lucide-react";
import { RoutePlanner } from "@/components/route-planner";
import { copyFor } from "@/lib/routing/copy";
import { internationalCopy, type InternationalLocale } from "@/lib/international";

const locales = Object.keys(internationalCopy) as InternationalLocale[];
export function generateStaticParams() { return locales.map(lang => ({ lang })); }
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as InternationalLocale)) return {};
  const c = copyFor(lang as InternationalLocale);
  return { title: c.eyebrow, description: c.lead };
}
export default async function InternationalRoutePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!locales.includes(lang as InternationalLocale)) notFound();
  const locale = lang as InternationalLocale;
  const c = copyFor(locale), copy = internationalCopy[locale];
  return <main id="ana-icerik" className="rp-page" lang={locale} dir={copy.dir}>
    <header className="route-page-intro site-shell"><Link href={`/${locale}`}><ArrowLeft size={16} aria-hidden="true" />{copy.institutionTitle}</Link><p><Compass size={19} aria-hidden="true" />{c.eyebrow}</p><h1>{c.routeIntro}</h1></header>
    <section className="site-shell rp-main" id="rota-araci"><RoutePlanner locale={locale} /></section>
  </main>;
}
