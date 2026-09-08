"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { ArrowUpRight,ChevronRight,Compass,Landmark,Leaf,Route,ScanLine,Utensils,Bookmark,Building2 } from "lucide-react";
import { qrCopy } from "@/lib/qr/copy";
import { qrPath } from "@/lib/qr/links";
import { codeFor } from "@/lib/qr/registry";
import { themes } from "@/lib/routing/data";
import { readTrips,TRIPS_EVENT,type Trip } from "@/lib/mobile/trips";
import { siteAsset } from "@/lib/site-path";
import type { Locale } from "@/lib/routing/types";
export function MobileHome({locale}:{locale:Locale}){
  const c=qrCopy(locale),base=locale==="tr"?"":`/${locale}`,[trip,setTrip]=useState<Trip|null>(null);
  useEffect(()=>{const load=()=>setTrip(readTrips()[0]??null);load();window.addEventListener(TRIPS_EVENT,load);return()=>window.removeEventListener(TRIPS_EVENT,load);},[]);
  const featured=[{id:"phrygia",Icon:Landmark,color:"stone"},{id:"unesco",Icon:Compass,color:"wood"},{id:"sakarya-valley",Icon:Leaf,color:"green"},{id:"sivritaste",Icon:Utensils,color:"taste"}];
  return <main id="app-ana-icerik" className="app-home" dir={locale==="ar"?"rtl":"ltr"} lang={locale}>
    <header className="app-home-greeting"><span>ESKİŞEHİR</span><h1>{c.homeTitle}</h1></header>
    <div className="app-home-tools"><Link href={`${base}/rotani-olustur`} className="app-route-tool"><span><Route size={26}/><ArrowUpRight size={19}/></span><strong>{c.routeAction}</strong><small>{c.routeHint}</small></Link><Link href={qrPath(locale)} className="app-scan-tool"><span><ScanLine size={26}/><ArrowUpRight size={19}/></span><strong>{c.scan}</strong><small>{c.scanHint}</small></Link></div>
    {trip&&<Link className="app-resume" href={`${base}/gezilerim`}><span className="app-resume-icon"><Bookmark size={21}/></span><span><small>{c.continue}</small><strong>{trip.title}</strong></span><ChevronRight size={19}/></Link>}
    <section className="app-featured"><div className="app-section-heading"><h2>{c.themesTitle}</h2><Link href={`${qrPath(locale)}#code=R-0002`} aria-label={c.themes}><ArrowUpRight size={21}/></Link></div><Link className="app-city-card" href={qrPath(locale)}><img src={siteAsset("/media/eskisehir-hero.webp")} alt="" width={1200} height={800}/><span className="app-city-caption"><small>14 {locale==="tr"?"İLÇE":locale==="ar"?"مقاطعة":"· ESKİŞEHİR"}</small><strong>Eskişehir</strong><span>{c.browse} <ArrowUpRight size={21}/></span></span></Link><div className="app-theme-grid">{featured.map(({id,Icon,color})=>{const theme=themes.find(t=>t.id===id)!;return <Link href={`${qrPath(locale)}#code=${codeFor("theme",id)}`} key={id} className={`app-theme-tile ${color}`}><Icon size={22}/><strong>{theme.name[locale]}</strong><small>{theme.stops.length} {c.stops}</small></Link>;})}</div></section>
    <Link className="app-editorial-link" href={`${base}/lezzet-ve-miras`}><span className="app-resume-icon"><Utensils size={23}/></span><span><strong>{c.heritage}</strong><small>{c.heritageHint}</small></span><ArrowUpRight size={20}/></Link>
    <Link className="app-institution-link" href={`${base}/birlik`}><Building2 size={22}/><span><strong>{c.institution}</strong><small>{c.institutionHint}</small></span><ChevronRight size={18}/></Link>
  </main>;
}
