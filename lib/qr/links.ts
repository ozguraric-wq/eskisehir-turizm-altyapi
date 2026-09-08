import { z } from "zod";
import { qrByCode, type QrEntry } from "./registry";
import { CATALOG_VERSION, placeById, themeById } from "../routing/data";
import { defaults, normalizePreferences, encodePreferences } from "../routing/engine";
import { preferenceSchema } from "../mobile/assistant-contract";
import type { Locale, Preferences } from "../routing/types";

export const QR_PUBLIC_ROOT = "https://ozguraric-wq.github.io/eskisehir-turizm-altyapi";
export type QrTarget = {kind:"entry"; entry:QrEntry} | {kind:"plan"; preferences:Preferences; planId:string};
export function qrPath(locale:Locale="tr") { return `${locale==="tr"?"":`/${locale}`}/qr`; }
export function qrUrl(code:string) { if(!Object.hasOwn(qrByCode,code))throw Error("Unknown code");return `${QR_PUBLIC_ROOT}/qr/#code=${code}`; }
const envelope=z.object({v:z.literal(1),catalog:z.literal(CATALOG_VERSION),p:z.record(z.unknown()),plan:z.string().min(1).max(600)}).strict();
export function planQrUrl(preferences:Preferences,planId:string) {
  const p=normalizePreferences(preferences), baseline=normalizePreferences(defaults);
  const delta=Object.fromEntries(Object.entries(p).filter(([k,v])=>JSON.stringify(v)!==JSON.stringify(baseline[k as keyof Preferences])));
  const json=JSON.stringify({v:1,catalog:CATALOG_VERSION,p:delta,plan:planId});
  const encoded=btoa(String.fromCharCode(...new TextEncoder().encode(json))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
  const url=`${QR_PUBLIC_ROOT}/qr/#trip=${encoded}`;
  if(url.length>2200)throw Error("Route QR too large");
  return url;
}
/** QR input is data, never a URL to navigate to or a script to execute. */
export function parseQrInput(raw:string):QrTarget|null {
  if(typeof raw!=="string" || raw.length>2400)return null;
  const code=raw.trim().toUpperCase().replace(/^([ER])\s*[- ]?\s*(\d{4})$/,"$1-$2");
  if(Object.hasOwn(qrByCode,code))return {kind:"entry",entry:qrByCode[code]};
  try {
    const url=new URL(raw.trim());
    const publicRoot=new URL(QR_PUBLIC_ROOT);
    const web=url.origin===publicRoot.origin && /^\/eskisehir-turizm-altyapi\/(?:en\/|de\/|fr\/|ar\/)?qr\/?$/.test(url.pathname);
    const native=url.protocol==="etahb:" && url.hostname==="qr" && (url.pathname===""||url.pathname==="/");
    if((!web&&!native)||url.username||url.password||url.port)return null;
    const params=new URLSearchParams(url.hash.slice(1)||url.search.slice(1));
    if([...params.keys()].some(k=>!["code","trip"].includes(k))||[...params.keys()].length!==1)return null;
    const c=params.get("code");
    if(c && Object.hasOwn(qrByCode,c))return {kind:"entry",entry:qrByCode[c]};
    const encoded=params.get("trip");
    if(!encoded||!/^[A-Za-z0-9_-]+$/.test(encoded))return null;
    const bytes=Uint8Array.from(atob(encoded.replace(/-/g,"+").replace(/_/g,"/")),char=>char.charCodeAt(0));
    const data=envelope.parse(JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes)));
    const preferences=preferenceSchema.parse({...normalizePreferences(defaults),...data.p});
    return {kind:"plan",preferences:normalizePreferences(preferences),planId:data.plan};
  } catch {return null;}
}
export function targetUrl(target:QrTarget) { return target.kind==="entry"?qrUrl(target.entry.code):planQrUrl(target.preferences,target.planId); }
export function nativeQrUrl(target:QrTarget) { return `etahb://qr?${new URL(targetUrl(target)).hash.slice(1)}`; }
export function targetPath(target:QrTarget,locale:Locale="tr") { return `${qrPath(locale)}${new URL(targetUrl(target)).hash}`; }
export function qrPreferences(entry:QrEntry):Preferences {
  if(entry.kind==="place") {
    const place=placeById[entry.id];
    return normalizePreferences({...defaults,days:1,origin:place.zone,interests:place.interests,required:[place.id],districts:[place.district]});
  }
  const theme=themeById[entry.id], zones=new Set(theme.stops.map(id=>placeById[id].zone));
  return normalizePreferences({...defaults,days:theme.id==="twobazaars"?2:zones.size>2?2:1,focus:theme.id,interests:theme.interests,origin:["faith","heritageweekend"].includes(theme.id)?"center":placeById[theme.stops[0]].zone,mode:["pedal","parkpedal"].includes(theme.id)?"bicycle":"car",required:theme.stops.slice(0,8),districts:[...new Set(theme.stops.map(id=>placeById[id].district))]});
}
export function plannerHref(preferences:Preferences,locale:Locale="tr",planId?:string) {return `${locale==="tr"?"":`/${locale}`}/rotani-olustur#route=${encodePreferences(preferences)}${planId?`&plan=${encodeURIComponent(planId)}`:""}`;}
