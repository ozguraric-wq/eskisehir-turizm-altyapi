/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, ChevronDown, ExternalLink, Landmark, Search, ShoppingBag, Sprout, Utensils } from "lucide-react";
import { siteAsset } from "@/lib/site-path";
import { discoveries, type Discovery } from "@/lib/routing/heritage-data";
import { filterDiscoveries, discoveryMapUrl } from "@/lib/routing/heritage";
import { HERITAGE_CHECKED_ON, GI_SOURCE } from "@/lib/routing/heritage-registry";
import { heritageCopy } from "@/lib/routing/heritage-copy";
import type { Locale } from "@/lib/routing/types";

type Category="all"|"taste"|"craft"|"heritage";
const categories:Category[]=["all","taste","craft","heritage"];
const areas=[...new Set(discoveries.map(d => d.area))];
function Entry({entry:d,locale,expanded}:{entry:Discovery;locale:Locale;expanded:boolean}) {
  const c=heritageCopy(locale), ref=useRef<HTMLDetailsElement>(null);
  useEffect(() => { if(expanded && ref.current){ ref.current.open=true; ref.current.scrollIntoView({block:"center"}); } },[expanded]);
  const Icon=d.kind === "heritage" ? Landmark : d.kind === "food" ? Utensils : d.kind === "produce" ? Sprout : ShoppingBag;
  return <article className={`heritage-entry heritage-entry-${d.kind}`} id={d.id}>
    <div className="heritage-entry-top"><span className="heritage-entry-icon"><Icon size={21} strokeWidth={1.6} aria-hidden="true"/></span><span>{d.area === "center" ? c.center : d.area}</span></div>
    <p className={`discovery-status status-${d.status ?? "registered"}`}>{d.status ? c[d.status] : c.registered}{d.year ? ` · ${d.year}` : ""}</p>
    <h2>{d.name[locale]}</h2><p className="heritage-entry-summary">{d.summary[locale]}</p>
    <details ref={ref}><summary>{c.detail}<ChevronDown size={16} aria-hidden="true"/></summary>
      <div className="heritage-entry-detail"><h3>{d.kind === "heritage" ? c.look : c.shopping}</h3><p>{d.tip[locale]}</p>
        {d.registration && <dl><div><dt>{c.number}</dt><dd><bdi>{d.registration.number} · {d.registration.date}</bdi></dd></div><div><dt>{c.registered}</dt><dd>{c[d.registration.type]}</dd></div><div><dt>{c.scope}</dt><dd>{d.scope?.[locale]}</dd></div><div><dt>{c.registrant}</dt><dd>{d.registration.registrant}</dd></div></dl>}
        <div className="discovery-links"><a href={d.source} target="_blank" rel="noreferrer">{d.registration ? c.registry : c.official}<ExternalLink size={13} aria-hidden="true"/></a>{d.secondSource && <a href={d.secondSource} target="_blank" rel="noreferrer">{d.status === "world" ? "UNESCO · 1694-003" : c.official}<ExternalLink size={13} aria-hidden="true"/></a>}{d.kind !== "heritage" && <a href={discoveryMapUrl(d)} target="_blank" rel="noreferrer">{c.map}<ExternalLink size={13} aria-hidden="true"/></a>}</div>
      </div>
    </details>
  </article>;
}
export function HeritageExplorer({locale="tr"}:{locale?:Locale}) {
  const c=heritageCopy(locale), [category,setCategory]=useState<Category>("all"),[area,setArea]=useState(""),[query,setQuery]=useState(""),[expanded,setExpanded]=useState(""),[limit,setLimit]=useState(6);
  useEffect(() => {setLimit(6);},[category,area,query]);
  useEffect(() => {
    const followHash=() => {
      let id="";try{id=decodeURIComponent(window.location.hash.slice(1));}catch{return;}
      if(discoveries.some(d => d.id === id)){setCategory("all");setArea("");setQuery("");setExpanded(id);}
    };followHash();window.addEventListener("hashchange",followHash);return () => window.removeEventListener("hashchange",followHash);
  },[]);
  const filtered=filterDiscoveries(category,area,query,locale);
  const shown=expanded ? filtered : filtered.slice(0,limit);
  const reset=() => {setCategory("all");setArea("");setQuery("");setExpanded("");setLimit(6);};
  const route=`${locale === "tr" ? "" : `/${locale}`}/rotani-olustur`;
  return <main id="ana-icerik" className="heritage-page" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
    <header className="site-shell heritage-intro"><div><p className="eyebrow">{c.eyebrow}</p><h1>{c.title}</h1><p className="heritage-lead">{c.lead}</p><div className="heritage-intro-links"><a href="#kesfet" onClick={reset}>{c.products}<ArrowRight size={16} aria-hidden="true"/></a><a href="#kesfet" onClick={() => {setCategory("heritage");setArea("");setQuery("");}}>{c.heritage}<ArrowRight size={16} aria-hidden="true"/></a></div></div><div className="heritage-intro-image"><img src={siteAsset("/media/eskisehir-hero.webp")} alt="" width={720} height={600}/><span>ESKİŞEHİR · 2026</span></div></header>
    <section className="site-shell heritage-catalog" id="kesfet" aria-label={c.menu}>
      <div className="heritage-controls"><div className="heritage-categories" role="group" aria-label={c.menu}>{categories.map(cat => <Button variant="ghost" type="button" key={cat} aria-pressed={category===cat} onClick={() => {setCategory(cat);setExpanded("");}}>{c[cat]}</Button>)}</div>
        <div className="heritage-filters"><label><span>{c.search}</span><div><Search size={17} aria-hidden="true"/><Input type="search" value={query} onChange={e => {setQuery(e.target.value);setExpanded("");}} placeholder={c.searchHint}/></div></label><label><span>{c.area}</span><NativeSelect value={area} onChange={e => {setArea(e.target.value);setExpanded("");}}><NativeSelectOption value="">{c.anywhere}</NativeSelectOption>{areas.map(a => <NativeSelectOption key={a} value={a}>{a === "center" ? c.center : a}</NativeSelectOption>)}</NativeSelect></label></div>
      </div>
      <div className="heritage-results"><p role="status" aria-live="polite">{filtered.length} {c.results}</p>{(category!=="all"||area||query) && <Button variant="ghost" onClick={reset} type="button">{c.reset}</Button>}</div>
      {filtered.length ? <div className="heritage-grid">{shown.map(d => <Entry key={d.id} entry={d} locale={locale} expanded={expanded===d.id}/>)}</div> : <div className="heritage-empty"><Search aria-hidden="true"/><p>{c.empty}</p><Button variant="ghost" type="button" onClick={reset}>{c.reset}</Button></div>}
      {shown.length < filtered.length && <div className="heritage-load"><Button variant="ghost" type="button" onClick={() => setLimit(n => n+6)}>{c.showMore}<ChevronDown size={16} aria-hidden="true"/></Button><span>{shown.length} / {filtered.length}</span></div>}
      <details className="heritage-explainer"><summary><BookOpen size={18} aria-hidden="true"/>{c.statuses}<ChevronDown size={17} aria-hidden="true"/></summary><div><p>{c.statusNote}</p><p>{c.shoppingNote}</p><a href={GI_SOURCE} target="_blank" rel="noreferrer">TÜRKPATENT · Eskişehir<ExternalLink size={14} aria-hidden="true"/></a><p className="heritage-checked">{c.checked}: <bdi>{HERITAGE_CHECKED_ON}</bdi></p></div></details>
    </section>
    <section className="site-shell heritage-value"><div><p className="eyebrow">VİZYON ESKİŞEHİR 2036</p><h2>{c.valueTitle}</h2><p>{c.value}</p></div><div className="heritage-route-invitation"><BookOpen size={27} strokeWidth={1.5} aria-hidden="true"/><h3>{c.contextual}</h3><p>{c.contextHint}</p><Link href={route} className="button-primary">{c.route}<ArrowRight size={17} aria-hidden="true"/></Link></div></section>
  </main>;
}
