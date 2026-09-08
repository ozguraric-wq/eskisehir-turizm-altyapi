"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { ArrowLeft,Bookmark,Check,ChevronRight,MapPin,Navigation,Trash2,Utensils } from "lucide-react";
import { mobileCopy } from "@/lib/mobile/copy";
import { readTrips,writeTrips,toggleVisit,stopKey,TRIPS_EVENT,type Trip } from "@/lib/mobile/trips";
import { clock,encodePreferences } from "@/lib/routing/engine";
import { copyFor } from "@/lib/routing/copy";
import { placeById,foodAreas,zoneNames } from "@/lib/routing/data";
import { placeQuery } from "@/lib/routing/exports";
import { QrShare } from "./qr-share";
import { planQrUrl } from "@/lib/qr/links";
import { RouteDiscoveries } from "./route-discoveries";
import { discoveriesForDay } from "@/lib/routing/heritage";
import type { Locale,ScheduleItem } from "@/lib/routing/types";

export function SavedTrips({locale="tr"}:{locale?:Locale}) {
  const c=mobileCopy(locale),rc=copyFor(locale),base=locale==="tr"?"":`/${locale}`;
  const [trips,setTrips]=useState<Trip[]>([]),[loaded,setLoaded]=useState(false),[id,setId]=useState<string|null>(null),[dayIndex,setDay]=useState(0),[error,setError]=useState(""),[deleted,setDeleted]=useState<Trip|null>(null);
  useEffect(()=>{const update=()=>{setTrips(readTrips());setLoaded(true);};update();window.addEventListener(TRIPS_EVENT,update);window.addEventListener("storage",update);return()=>{window.removeEventListener(TRIPS_EVENT,update);window.removeEventListener("storage",update);};},[]);
  const trip=trips.find(t=>t.id===id),day=trip?.plan.days[dayIndex];
  const title=(item:ScheduleItem)=>item.kind==="visit"?placeById[item.id].name:item.kind==="return"?rc.return:`${item.id.endsWith("dinner")?rc.dinner:rc.lunch} · ${foodAreas.find(f=>f.zone===item.zone)?.name??zoneNames[item.zone]}`;
  function persist(next:Trip[]){try{writeTrips(next);setTrips(next);setError("");return true;}catch{setError(c.storageError);return false;}}
  function remove(t:Trip){if(persist(trips.filter(x=>x.id!==t.id))){setDeleted(t);if(id===t.id)setId(null);}}
  const routeHref=(t:Trip)=>`${base}/rotani-olustur#route=${encodePreferences(t.preferences)}&plan=${encodeURIComponent(t.plan.id)}`;
  const nextItem=trip&&(day?.items.find(item=>item.kind!=="return"&&!trip.completed.includes(stopKey(dayIndex,item.id)))??day?.items.find(item=>item.kind==="return"));
  const navigationUrl=nextItem&&trip?`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(placeQuery(nextItem.id,trip.preferences))}&travelmode=${({car:"driving",motorcycle:"driving",bicycle:"bicycling",walk:"walking",transit:"transit"} as const)[trip.preferences.mode]}&dir_action=navigate`:"";
  const discoveries=trip&&day?discoveriesForDay(day,trip.preferences):{};
  return <main id="ana-icerik" className="app-trips site-shell" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
    <header className="app-page-title"><p><Bookmark size={18}/>{c.app}</p><h1>{trip?trip.title:c.trips}</h1><span>{c.savedHint}</span></header>
    {error&&<p className="app-error" role="alert">{error}</p>}
    {deleted&&<div className="app-undo" role="status"><span>{deleted.title} · {c.remove}</span><button type="button" onClick={()=>{if(persist([deleted,...trips.filter(t=>t.id!==deleted.id)]))setDeleted(null);}}>{c.undo}</button></div>}
    {!trip?<>
      {loaded&&!trips.length&&<section className="app-empty"><Bookmark size={38}/><h2>{c.empty}</h2><p>{c.emptyHint}</p><Link className="app-primary" href={`${base}/rotani-olustur`}>{c.route}<ChevronRight size={18}/></Link></section>}
      <div className="app-trip-grid">{trips.map(t=>{const total=t.plan.days.reduce((n,d)=>n+d.items.filter(i=>i.kind!=="return").length,0);return <article className="app-trip-card" key={t.id}><div className="app-trip-icon"><MapPin size={24}/></div><p>{t.preferences.date||rc.date} · {t.plan.days.length} {rc.day}</p><h2>{t.title}</h2><span>{rc[t.preferences.mode]} · {t.completed.length}/{total} {c.done}</span><progress value={t.completed.length} max={total} aria-label={c.done}/><div><button className="app-primary" type="button" onClick={()=>{setId(t.id);setDay(0);setDeleted(null);}}>{c.open}<ChevronRight size={18}/></button><button className="app-icon-button" type="button" onClick={()=>remove(t)} aria-label={`${t.title} · ${c.remove}`}><Trash2 size={19}/></button></div></article>})}</div>
    </>:day&&<section className="app-trip-detail">
      <button type="button" className="app-back" onClick={()=>setId(null)}><ArrowLeft size={18}/>{c.trips}</button>
      <div className="app-day-picker" role="group" aria-label={rc.days}>{trip.plan.days.map((d,i)=><button type="button" key={i} aria-pressed={dayIndex===i} onClick={()=>setDay(i)}>{rc.day} {i+1}<small>{d.date}</small></button>)}</div>
      <div className="app-next-stop"><span>{nextItem?c.remaining:c.complete}</span><h2>{nextItem?title(nextItem):trip.title}</h2>{nextItem&&<><p>{clock(nextItem.start)} · {zoneNames[nextItem.zone]}</p><a className="app-primary" href={navigationUrl} target="_blank" rel="noreferrer"><Navigation size={18}/>{c.navigate}</a><small>{c.navHint}</small></>}</div>
      <ol className="app-trip-timeline">{day.items.filter(item=>item.kind!=="return").map(item=>{const key=stopKey(dayIndex,item.id),done=trip.completed.includes(key);return <li key={key} className={done?"is-complete":""}><button type="button" className="app-visit-toggle" aria-pressed={done} aria-label={`${c.mark}: ${title(item)}`} onClick={()=>persist(trips.map(t=>t.id===trip.id?toggleVisit(t,key):t))}>{done?<Check size={20}/>:item.kind==="meal"?<Utensils size={18}/>:<MapPin size={18}/>}</button><div><span>{clock(item.start)}–{clock(item.end)}</span><h3>{title(item)}</h3><details><summary>{item.kind==="visit"?c.story:c.foodBreak}</summary><p>{item.kind==="visit"?placeById[item.id].summary[locale]:trip.preferences.meal==="picnic"?rc.picnicNote:foodAreas.find(f=>f.zone===item.zone)?.[trip.preferences.meal==="vegetarian"?"vegetarian":"local"][locale]??rc.packedNote}</p>{item.kind==="visit"&&<a href={placeById[item.id].source} target="_blank" rel="noreferrer">{c.sources}</a>}</details>{discoveries[item.id]?.length>0&&<RouteDiscoveries items={discoveries[item.id]} locale={locale} area={`${zoneNames[item.zone]}, Eskişehir`}/>}</div></li>})}</ol>
      <QrShare url={()=>planQrUrl(trip.preferences,trip.plan.id)} title={trip.title} locale={locale}/><p className="app-small">{rc.modelNote}</p><Link className="app-secondary" href={routeHref(trip)}>{c.edit}<ChevronRight size={17}/></Link>
    </section>}
  </main>;
}
