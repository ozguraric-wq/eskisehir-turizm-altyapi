/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BarChart3, Building2, Database, ExternalLink, Landmark, Mountain, ShieldCheck, UsersRound } from "lucide-react";
import { InternationalRoutePlanner } from "@/components/international-route-planner";
import { internationalCopy, type InternationalLocale } from "@/lib/international";

const locales = Object.keys(internationalCopy) as InternationalLocale[];

export function generateStaticParams() { return locales.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!locales.includes(lang as InternationalLocale)) return {};
  const copy = internationalCopy[lang as InternationalLocale];
  return { title: copy.hero, description: copy.lead };
}

export default async function InternationalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!locales.includes(lang as InternationalLocale)) notFound();
  const locale = lang as InternationalLocale;
  const copy = internationalCopy[locale];
  const impactIcons = [Building2, Database, BarChart3, ShieldCheck];
  const heritageIcons = [Mountain, Landmark, ShieldCheck, UsersRound];

  return (
    <main id="ana-icerik" lang={locale} dir={copy.dir} className={copy.dir === "rtl" ? "rtl-page" : ""}>
      <section className="intl-hero">
        <img src="/media/eskisehir-hero.webp" alt="Eskişehir landscape" />
        <div className="intl-hero-overlay" />
        <div className="site-shell intl-hero-inner"><span>{copy.eyebrow}</span><h1>{copy.hero}</h1><p>{copy.lead}</p><div className="flex flex-wrap gap-3"><a className="button-light" href="#institution">{copy.institutionTitle}<ArrowRight aria-hidden="true" size={16} /></a><a className="intl-ghost-button" href="#routes">{copy.routesTitle}</a></div></div>
      </section>

      <section className="content-section" id="institution"><div className="site-shell"><div className="max-w-4xl"><p className="eyebrow">2036</p><h2 className="section-title">{copy.institutionTitle}</h2><p className="section-copy">{copy.institutionLead}</p></div><div className="intl-card-grid">{copy.institution.map(([title, text], index) => { const Icon = impactIcons[index]; return <article className="card" key={title}><span className="icon-box"><Icon aria-hidden="true" size={21} /></span><h3>{title}</h3><p>{text}</p></article>; })}</div></div></section>

      <section className="content-section intl-plan" id="impact"><div className="site-shell grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">12th Development Plan × 2036</p><h2 className="section-title">{copy.planTitle}</h2><p className="section-copy">{copy.plan}</p><a className="button-secondary mt-7" href="https://www.sbb.gov.tr/wp-content/uploads/2023/12/On-Ikinci-Kalkinma-Plani_2024-2028_11122023.pdf" rel="noreferrer" target="_blank">Official plan <ExternalLink aria-hidden="true" size={15} /></a></div><div className="intl-value-chain">{copy.value.map((item, index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></article>)}</div></div></section>

      <section className="content-section" id="heritage"><div className="site-shell"><div className="max-w-4xl"><p className="eyebrow">Eskişehir</p><h2 className="section-title">{copy.heritageTitle}</h2></div><div className="intl-card-grid">{copy.heritage.map(([title, text], index) => { const Icon = heritageIcons[index]; return <article className="card" key={title}><span className="icon-box"><Icon aria-hidden="true" size={21} /></span><h3>{title}</h3><p>{text}</p></article>; })}</div><div className="mt-8 flex flex-wrap gap-3"><a className="button-secondary" href="https://eskisehir.ktb.gov.tr/TR-111540/ilceler.html" rel="noreferrer" target="_blank">14 districts <ExternalLink aria-hidden="true" size={15} /></a><a className="button-secondary" href="https://ci.turkpatent.gov.tr/cografi-isaretler/liste?il=26" rel="noreferrer" target="_blank">Registered geographical indications <ExternalLink aria-hidden="true" size={15} /></a></div></div></section>

      <section className="content-section soft-section" id="routes"><div className="site-shell"><div className="max-w-4xl"><p className="eyebrow">Smart route prototype</p><h2 className="section-title">{copy.routesTitle}</h2><p className="section-copy">{copy.routesLead}</p></div><div className="mt-10"><InternationalRoutePlanner locale={locale} /></div></div></section>

      <section className="content-section" id="programmes"><div className="site-shell"><div className="max-w-4xl"><p className="eyebrow">Planned portfolio</p><h2 className="section-title">{copy.programmesTitle}</h2></div><div className="intl-programmes">{copy.programmes.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="pb-24"><div className="site-shell intl-final"><ShieldCheck aria-hidden="true" size={27} /><div><h2>{copy.valueTitle}</h2><p>{copy.verify}</p></div><Link className="button-light" href="/tuzuk">Draft charter <ArrowRight aria-hidden="true" size={16} /></Link></div></section>
    </main>
  );
}
