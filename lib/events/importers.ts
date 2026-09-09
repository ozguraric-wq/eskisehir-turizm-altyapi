import type {CityEvent,EventSource,EventCategory} from './types';
import {resolveVenue,folded} from './venues';
import {safeSourceUrl} from './sources';
import {validatedEvents} from './catalog';
const months=['ocak','subat','mart','nisan','mayis','haziran','temmuz','agustos','eylul','ekim','kasim','aralik'];
export function plain(html:string){return html.replace(/<!--[^]*?-->/g,' ').replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(Math.min(parseInt(n,16),0x10ffff))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Math.min(Number(n),0x10ffff))).replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();}
export function stableId(input:string){let h=2166136261;for(const c of input){h^=c.codePointAt(0)!;h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
export function categoryOf(title:string):EventCategory{const t=folded(title);return /muzikal/.test(t)?'musical':/tiyatro|oyun|sahne/.test(t)?'theatre':/konser|senfoni|muzik/.test(t)?'concert':/sinema|film|yesilcam/.test(t)?'cinema':/sergi/.test(t)?'exhibition':/festival|sempozyum/.test(t)?'festival':/turnuva|futbol|spor|maraton/.test(t)?'sport':/atolye|kurs|ogrenci|egitim/.test(t)?'workshop':/soylesi|ekonomi|panel/.test(t)?'talk':'ceremony';}
function dated(day:string,month:string,year:string){const m=months.indexOf(folded(month))+1;return m?`${year}-${String(m).padStart(2,'0')}-${day.padStart(2,'0')}`:null;}
const datePattern=/(\d{1,2})\s+(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+(20\d{2})/giu;
export function links(html:string,source:EventSource){return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([^]*?)<\/a>/gi)].flatMap(m=>{const url=safeSourceUrl(plain(m[1]),source);return url?[{url,title:plain(m[2])}]:[];});}
function record(source:EventSource,url:string,title:string,venueName:string,date:string|null,time:string|null,checkedAt:string):CityEvent{
 const venue=resolveVenue(venueName),t=folded(title);
 return {id:`${source.id}-${stableId(url+'|'+date+'|'+time)}`,title:title.slice(0,200),category:categoryOf(title),district:venue?.district??source.district,date,time,endTime:null,venue:venueName.slice(0,240),venueId:venue?.id??null,organizer:source.name,sourceId:source.id,sourceUrl:url,checkedAt,status:/iptal/.test(t)?'cancelled':/ertelen/.test(t)?'postponed':/basvuru|ogrenci|kayit|ariyor/.test(t)||!time||!date?'announced':'scheduled',price:'unknown',bookingUrl:null,summary:'',family:null,indoor:null};
}
export function parseTepebasi(html:string,source:EventSource,checkedAt:string){
 const out:CityEvent[]=[];
 for(const block of html.split(/<div\b[^>]*class=["'][^"']*etkinlikler[^"']*["'][^>]*>/i).slice(1)){
  const link=links(block,source).find(l=>new URL(l.url).pathname.startsWith('/Etkinlikler/Detay/'));if(!link)continue;
  const text=plain(block.split('</ul>')[0]),match=[...text.matchAll(datePattern)][0],time=text.match(/schedule\s+(\d{1,2}:\d{2})/)?.[1],venue=text.match(/location_on\s+(.+)$/)?.[1]??'';
  if(match)out.push(record(source,link.url,link.title,venue,dated(match[1],match[2],match[3]),time?.padStart(5,'0')??null,checkedAt));
 }return validatedEvents(out);
}
export function parseEbbArticle(html:string,source:EventSource,url:string,checkedAt:string){
 const headings=[...html.matchAll(/<h[12]\b[^>]*>([^]*?)<\/h[12]>/gi)].map(m=>plain(m[1]));
 const title=headings.find(t=>t.length>15&&!/ESKİŞEHİR BÜYÜKŞEHİR BELEDİYESİ/.test(t))??'';
 let text=plain(html);text=text.slice(text.indexOf('Geri Dön')+8).split('LİNKLER')[0];
 if(!title||!/(konser|sinema|soylesi|festival|sergi|sempozyum|tiyatro|ekonomi|turnuva|etkinlik|yesilcam)/.test(folded(title)))return [];
 const venue=resolveVenue(text.match(/Aktif Yaşam Parkı|Atatürk Kültür,? Sanat ve Kongre Merkezi|Atilla Özer Karikatürlü Ev/iu)?.[0]??'');
 const results:CityEvent[]=[];
 // Only explicit event dates paired with a time. Publication dates are never used as occurrences.
 for(const paragraph of html.split(/<\/p>/i)){
  const line=plain(paragraph);const time=line.match(/(?:saat\s+)?(\d{1,2})[.:](\d{2})[’'‘]?(?:da|de|te|ta|’da|’de)?\s*(?:başlayacak|da|de|te|ta|,|Atatürk)/iu)??line.match(/saat\s+(\d{1,2})[.:](\d{2})/iu);
  if(!time)continue;
  const dates=[...line.matchAll(datePattern)].map(m=>dated(m[1],m[2],m[3]));
  const series=line.match(/(\d{1,2}(?:\s*,\s*\d{1,2})*\s+ve\s+\d{1,2})\s+(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık)\s+(?:Cuma|Cumartesi|Pazar|Pazartesi|Salı|Çarşamba|Perşembe)/iu);
  // This pattern is reviewed for the September 2026 Yeşilçam announcement only; never infer a new year.
  if(series&&new URL(url).searchParams.get('icerik_id')==='13262')for(const day of series[1].match(/\d+/g)??[])dates.push(dated(day,series[2],'2026'));
  for(const date of dates){const e=record(source,url,title,venue?.name??'',date,`${time[1].padStart(2,'0')}:${time[2]}`,checkedAt);if(venue?.id==='aktif-yasam')e.indoor=false;results.push(e);}
 }const state=announcementStatus(text);return validatedEvents(results.map(e=>state?{...e,status:state}:e));
}
/** Schema.org Event import: bounded data only, never executable HTML or arbitrary URLs. */
export function parseStructured(html:string,source:EventSource,checkedAt:string){
 const out:CityEvent[]=[];
 const visit=(value:any,depth=0)=>{
  if(depth>8||!value||typeof value!=='object'||out.length>=100)return;
  if(Array.isArray(value)){value.slice(0,120).forEach(v=>visit(v,depth+1));return;}
  if([].concat(value['@type']??[]).some(t=>typeof t==='string'&&/Event$/.test(t))&&typeof value.name==='string'){
   const start=typeof value.startDate==='string'?value.startDate:'',match=start.match(/^(20\d{2}-\d{2}-\d{2})(?:T(\d{2}:\d{2})(?::\d{2})?\+03:00)?$/);
   const url=typeof value.url==='string'?safeSourceUrl(value.url,source):source.url;
   const location=typeof value.location==='object'?value.location:{name:typeof value.location==='string'?value.location:''};
   const address=typeof location.address==='object'?location.address:{};
   if(match&&url&&(!address.addressRegion||folded(String(address.addressRegion)).includes('eskisehir'))){
    const e=record(source,url,plain(value.name),plain(String(location.name??'')),match[1],match[2]??null,checkedAt);
    if(typeof value.eventStatus==='string'){if(/Cancelled$/.test(value.eventStatus))e.status='cancelled';if(/Postponed$|Rescheduled$/.test(value.eventStatus))e.status='postponed';}
    if(typeof value.endDate==='string'&&value.endDate.startsWith(match[1]+'T')&&value.endDate.endsWith('+03:00'))e.endTime=value.endDate.slice(11,16);
    if(value.isAccessibleForFree===true)e.price='free';else if(value.isAccessibleForFree===false)e.price='paid';
    out.push(e);
   }
  }
  if(value['@graph'])visit(value['@graph'],depth+1);if(value.itemListElement)visit(value.itemListElement,depth+1);if(value.item)visit(value.item,depth+1);
 };
 for(const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([^]*?)<\/script>/gi)){try{visit(JSON.parse(m[1]));}catch{/* A broken item cannot affect the last known catalogue. */}}
 return validatedEvents(out);
}

export function announcementStatus(text:string):'cancelled'|'postponed'|null{const t=folded(plain(text));return /(?:etkinlik|konser|gosteri|program|seans|sinema|geceleri).{0,100}iptal edil(?:di|mistir|ecektir)/.test(t)?'cancelled':/(?:etkinlik|konser|gosteri|program|seans|sinema|geceleri).{0,100}ertelen(?:di|mistir)/.test(t)?'postponed':null;}
