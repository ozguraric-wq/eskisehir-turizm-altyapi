"use client";
import Link from "next/link";
import { useEffect,useMemo,useRef,useState } from "react";
import { ArrowLeft,ArrowUpRight,BookOpen,Check,ChevronRight,Clock,ExternalLink,Landmark,MapPin,Navigation,Route,Search,Volume2,Square,QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect,NativeSelectOption } from "@/components/ui/native-select";
import { qrRegistry,qrByCode,codeFor,type QrEntry } from "@/lib/qr/registry";
import { districtStories } from "@/lib/qr/district-stories";
import { qrCopy } from "@/lib/qr/copy";
import { parseQrInput,qrUrl,qrPath,targetPath,targetUrl,nativeQrUrl,qrPreferences,plannerHref,type QrTarget } from "@/lib/qr/links";
import { readQrHistory,rememberQr,QR_HISTORY_KEY } from "@/lib/qr/history";
import { speakGuide,stopGuide } from "@/lib/qr/speech";
import { places,placeById,themeById,districtNames,VERIFIED_ON } from "@/lib/routing/data";
import { heritage,products } from "@/lib/routing/heritage-data";
import { heritageCopy } from "@/lib/routing/heritage-copy";
import { copyFor } from "@/lib/routing/copy";
import {useEvents} from "@/lib/events/client";
import { generatePlans,clock } from "@/lib/routing/engine";
import { searchKey } from "@/lib/routing/heritage";
import { isNativeApp } from "@/lib/mobile/native";
import type { Locale } from "@/lib/routing/types";
import { QrScanner } from "./qr-scanner";
import { QrShare } from "./qr-share";

export function QrGuide({locale="tr"}:{locale?:Locale}){
  const c=qrCopy(locale),rc=copyFor(locale),hc=heritageCopy(locale),base=locale==="tr"?"":`/${locale}`;
  const [target,setTarget]=useState<QrTarget|null>(null),[error,setError]=useState(""),[input,setInput]=useState(""),[recent,setRecent]=useState<string[]>([]),[category,setCategory]=useState<"place"|"theme">("place"),[query,setQuery]=useState(""),[district,setDistrict]=useState(""),[limit,setLimit]=useState(6),[speaking,setSpeaking]=useState(false),[audioError,setAudioError]=useState("");
  const heading=useRef<HTMLHeadingElement>(null),speechGeneration=useRef(0);
  useEffect(()=>{
    const load=()=>{const hash=location.hash;setError("");setTarget(null);if(hash){const parsed=parseQrInput(`https://ozguraric-wq.github.io/eskisehir-turizm-altyapi/qr/${hash}`);if(parsed){setTarget(parsed);if(parsed.kind==="entry")rememberQr(parsed.entry.code);}else setError(c.invalid);}setRecent(readQrHistory());};
    load();window.addEventListener("hashchange",load);return()=>window.removeEventListener("hashchange",load);
  },[c.invalid]);
  useEffect(()=>{speechGeneration.current++;stopGuide();setSpeaking(false);setAudioError("");if(target){heading.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:"instant"});}return()=>{speechGeneration.current++;stopGuide();};},[target,locale]);
  useEffect(()=>{const stop=()=>{if(document.hidden){speechGeneration.current++;stopGuide();setSpeaking(false);}};document.addEventListener("visibilitychange",stop);return()=>document.removeEventListener("visibilitychange",stop);},[]);
  function read(value:string){const parsed=parseQrInput(value);if(!parsed){setError(c.invalid);return;}setError("");setInput("");const hash=new URL(targetUrl(parsed)).hash;if(location.hash===hash)setTarget(parsed);else location.hash=hash;}
  function back(){history.pushState(null,"",location.pathname+location.search);setTarget(null);setError("");window.scrollTo({top:0,behavior:"instant"});}
  const entry=target?.kind==="entry"?target.entry:null,place=entry?.kind==="place"?placeById[entry.id]:null,theme=entry?.kind==="theme"?themeById[entry.id]:null;
  const related=place?heritage.filter(h=>h.stopIds?.includes(place.id)):[];
  const localProducts=place?products.filter(p=>p.zones.includes(place.zone)).slice(0,3):[];
  const {catalog}=useEvents();
  const planResult=useMemo(()=>target?.kind==="plan"?generatePlans(target.preferences,catalog.events):null,[target,catalog]);
  const sharedPlan=target?.kind==="plan"?planResult?.plans.find(p=>p.id===target.planId):null;
  const matching=qrRegistry.filter(e=>{if(e.kind!==category)return false;const ids=e.kind==="place"?[e.id]:themeById[e.id].stops;const ps=ids.map(id=>placeById[id]);const name=e.kind==="place"?placeById[e.id].name:themeById[e.id].name[locale];return (!district||ps.some(p=>p.district===district))&&searchKey([name,e.code,...ps.map(p=>p.district)].join(" ")).includes(searchKey(query.trim()));});
  const title=place?.name??theme?.name[locale]??c.preview;
  async function listen(){if(speaking){speechGeneration.current++;stopGuide();setSpeaking(false);return;}setAudioError("");setSpeaking(true);const ticket=++speechGeneration.current;try{await speakGuide([title,place?.summary[locale],...related.flatMap(h=>[h.summary[locale],h.tip[locale]])].filter(Boolean).join(". "),locale,()=>{if(ticket===speechGeneration.current)setSpeaking(false);});}catch{if(ticket===speechGeneration.current){setSpeaking(false);setAudioError(c.noVoice);}}}
  const entryRow=(e:QrEntry)=>{const p=e.kind==="place"?placeById[e.id]:null,t=e.kind==="theme"?themeById[e.id]:null;return <button key={e.code} type="button" className="qr-library-row" onClick={()=>read(e.code)}><span className="qr-row-icon">{p?<Landmark size={21}/>:<Route size={21}/>}</span><span><strong>{p?.name??t?.name[locale]}</strong><small>{p?.district??`${t?.stops.length} ${c.stops}`} · {e.code}</small></span><ChevronRight size={18}/></button>;};
  return <main id="ana-icerik" className="qr-page" lang={locale} dir={locale==="ar"?"rtl":"ltr"}>
    {target?<>
      <Button type="button" variant="ghost" className="qr-back" onClick={back}><ArrowLeft size={18}/>{c.scan}</Button>
      <header className="qr-detail-header"><span className="qr-eyebrow">{entry?.code??c.preview}{place?` · ${place.district}`:""}</span><h1 ref={heading} tabIndex={-1}>{title}</h1>{place&&<p>{place.summary[locale]}</p>}{theme&&<p>{[...new Set(theme.stops.map(id=>placeById[id].district))].join(" · ")} · {theme.stops.length} {c.stops}</p>}</header>
      {place&&<>
        <div className="qr-detail-facts"><span><Clock size={16}/>{place.minutes} {rc.min}</span><span><MapPin size={16}/>{place.district}</span></div>
        <div className="qr-listen"><Button type="button" variant="outline" onClick={listen}>{speaking?<Square size={17}/>:<Volume2 size={19}/>} {speaking?c.stop:c.listen}</Button><small>{c.audioHint}</small></div>{audioError&&<p className="qr-notice" role="status">{audioError}</p>}
        <section className="qr-story"><h2>{c.story}</h2>{related.length?related.map(h=><div key={h.id}><p className="qr-status">{h.status?hc[h.status]:""}{h.year?` · ${h.year}`:""}</p><p>{h.summary[locale]}</p></div>):<p>{districtStories[place.district][locale]}</p>}</section>
        {related.map(h=><details className="qr-accordion" key={h.id}><summary>{c.detail}<ChevronRight size={18}/></summary><p>{h.tip[locale]}</p></details>)}
        <details className="qr-accordion"><summary>{c.practical}<ChevronRight size={18}/></summary><p>{rc[place.note]}</p><p>{rc.hours}</p>{place.lowWalk===false&&<p>{rc.lowWalk}: {rc.uneven}</p>}</details>
        {localProducts.length>0&&<details className="qr-accordion"><summary>{c.heritage}<ChevronRight size={18}/></summary>{localProducts.map(p=><div className="qr-product" key={p.id}><strong>{p.name[locale]}</strong><p>{p.summary[locale]}</p><p>{p.tip[locale]}</p><a href={p.source} target="_blank" rel="noreferrer">{c.sources}<ExternalLink size={14}/></a></div>)}<p className="qr-note">{hc.shoppingNote}</p></details>}
        <details className="qr-accordion"><summary>{c.sources}<ChevronRight size={18}/></summary><p>{c.sourceHint}</p><p className="qr-note">{VERIFIED_ON}</p>{[...new Set([place.source,"https://eskisehir.ktb.gov.tr/TR-111540/ilceler.html",...related.flatMap(h=>[h.source,h.secondSource].filter(Boolean) as string[])])].map((source,i)=><a key={source} href={source} target="_blank" rel="noreferrer">{c.sources} {i+1}<ExternalLink size={15}/></a>)}</details>
        <div className="qr-detail-actions"><Link className="app-primary" href={plannerHref(qrPreferences(entry!),locale)}><Route size={18}/>{c.plan}</Link><a className="app-secondary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name+" "+place.district+" Eskişehir")}`} target="_blank" rel="noreferrer"><Navigation size={18}/>{c.navigate}</a></div>
      </>}
      {theme&&<><ol className="qr-theme-stops">{theme.stops.map((id,i)=><li key={id}><span>{String(i+1).padStart(2,"0")}</span><button onClick={()=>read(codeFor("place",id)!)} type="button"><strong>{placeById[id].name}</strong><small>{placeById[id].district}</small></button><ChevronRight size={16}/></li>)}</ol><p className="qr-note">{rc.modelNote}</p><Link className="app-primary" href={plannerHref(qrPreferences(entry!),locale)}><Route size={18}/>{c.planTheme}</Link></>}
      {target.kind==="plan"&&<><p className="qr-note">{c.importHint}</p><div className="qr-plan-summary"><span>{rc[target.preferences.mode]}</span><span>{target.preferences.days} {rc.day}</span><span>{clock(target.preferences.start)}–{clock(target.preferences.end)}</span>{target.preferences.date&&<span>{target.preferences.date}</span>}</div>{sharedPlan?<><ol className="qr-theme-stops">{sharedPlan.days.map((day,i)=><li key={i}><span>{i+1}</span><div><strong>{rc.day} {i+1}</strong><p>{day.placeIds.map(id=>placeById[id].name).join(" · ")}</p></div></li>)}</ol><Link className="app-primary" href={plannerHref(target.preferences,locale,target.planId)}>{c.openPlan}<ChevronRight size={18}/></Link></>:<><p className="qr-notice" role="status">{c.unavailable}</p><Link className="app-primary" href={plannerHref(target.preferences,locale)}>{c.planTheme}</Link></>}</>}
      <div className="qr-detail-footer"><QrShare url={targetUrl(target)} title={title} code={entry?.code} locale={locale}/>{!isNativeApp()&&<details className="qr-accordion"><summary>{c.appOpen}<ArrowUpRight size={17}/></summary><p>{c.appHint}</p><a className="app-secondary" href={nativeQrUrl(target)}>{c.appOpen}</a></details>}</div>
    </>:<>
      <header className="qr-page-header"><span className="qr-eyebrow">{c.scan}</span><h1>{c.title}</h1><p>{c.intro}</p></header>
      <section className="qr-start"><div className="qr-start-icon"><QrCode size={38} strokeWidth={1.6}/></div><QrScanner locale={locale} onRead={read} onError={setError}/><p>{c.cameraHint}</p></section>
      <details className="qr-manual" open={!!error}><summary>{c.manual}<ChevronRight size={18}/></summary><form onSubmit={e=>{e.preventDefault();read(input);}}><label htmlFor="qr-manual-code" className="sr-only">{c.manual}</label><Input dir="ltr" id="qr-manual-code" value={input} onChange={e=>setInput(e.target.value)} placeholder={c.placeholder} maxLength={2400} autoCapitalize="characters" autoCorrect="off"/><Button type="submit" disabled={!input.trim()}>{c.open}</Button></form></details>
      {error&&<p className="app-error" role="alert">{error}</p>}
      {recent.length>0&&<section className="qr-recent"><div className="qr-section-heading"><h2>{c.recent}</h2><Button type="button" variant="ghost" onClick={()=>{try{localStorage.removeItem(QR_HISTORY_KEY);}catch{}setRecent([]);}}>{c.clear}</Button></div><div className="qr-recent-chips">{recent.slice(0,4).map(code=><button key={code} type="button" onClick={()=>read(code)}>{qrByCode[code].kind==="place"?placeById[qrByCode[code].id].name:themeById[qrByCode[code].id].name[locale]}</button>)}</div></section>}
      <section className="qr-library"><div className="qr-section-heading"><h2>{c.browse}</h2><BookOpen size={21}/></div><div className="qr-segments" role="group" aria-label={c.browse}>{(["place","theme"] as const).map(value=><button type="button" key={value} aria-pressed={category===value} onClick={()=>{setCategory(value);setLimit(6);}}>{value==="place"?c.places:c.themes}</button>)}</div><label className="qr-search"><Search size={19}/><Input value={query} onChange={e=>{setQuery(e.target.value);setLimit(6);}} type="search" placeholder={c.search} aria-label={c.search}/></label><NativeSelect aria-label={c.all} value={district} onChange={e=>{setDistrict(e.target.value);setLimit(6);}}><NativeSelectOption value="">{c.all}</NativeSelectOption>{districtNames.map(d=><NativeSelectOption value={d} key={d}>{d}</NativeSelectOption>)}</NativeSelect><div className="qr-library-list">{matching.slice(0,limit).map(entryRow)}</div>{matching.length===0&&<p role="status">{c.empty}</p>}{matching.length>limit&&<Button className="qr-more" type="button" variant="outline" onClick={()=>setLimit(limit+8)}>{c.more} · {matching.length-limit}</Button>}</section><p className="qr-note">{c.localOnly}</p><details className="qr-accordion qr-pilot"><summary>{c.code}<ChevronRight size={17}/></summary><p>{c.guideNote}</p></details>
    </>}
  </main>;
}
