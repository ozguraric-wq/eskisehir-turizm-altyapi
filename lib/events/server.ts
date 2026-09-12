import type {SocialEnv} from '../social/server-contract';
import {identify} from '../social/auth';
import {eventSources,sourceById,safeSourceUrl} from './sources';
import {eventSnapshot} from './snapshot';
import {validatedEvents,initialCatalog} from './catalog';
import {parseTepebasi,parseEbbArticle,parseStructured,links,announcementStatus} from './importers';
import {folded} from './venues';
import type {CityEvent,EventCatalog,EventSource,FeedStatus} from './types';
type Row={id:string;payload:string;checked_at:string|null;attempted_at:string|null;state:FeedStatus['state'];lease_until:number};
const TTL=6*60*60*1000,RETRY=30*60*1000,MANUAL_RETRY=5*60*1000;
async function bootstrap(env:SocialEnv){if(!env.DB)return;await env.DB.batch(eventSources.map(s=>env.DB!.prepare('INSERT OR IGNORE INTO city_event_feeds (id,payload,checked_at,state) VALUES (?,?,?,?)').bind(s.id,JSON.stringify(eventSnapshot.filter(e=>e.sourceId===s.id)),eventSnapshot.some(e=>e.sourceId===s.id)?'2026-09-09T09:00:00Z':null,'snapshot')));}
export function mergeOccurrences(events:CityEvent[]){const merged=new Map<string,CityEvent>();for(const e of events){const key=[folded(e.title),e.date,e.time,folded(e.venue)].join('|');const old=merged.get(key);if(!old||Date.parse(e.checkedAt)>=Date.parse(old.checkedAt))merged.set(key,e);}return [...merged.values()].sort((a,b)=>(a.date??'9999').localeCompare(b.date??'9999')||(a.time??'').localeCompare(b.time??''));}
export async function getEventCatalog(env:SocialEnv):Promise<EventCatalog>{
 if(!env.DB)return initialCatalog();await bootstrap(env);
 const {results}=await env.DB.prepare('SELECT * FROM city_event_feeds').all<Row>();
 const rows=results.flatMap(r=>{try{return validatedEvents(JSON.parse(r.payload)).map(e=>({event:e,reviewed:r.id.startsWith('manual:')}));}catch{return [];}}),reviewed=new Set(rows.filter(r=>r.reviewed).map(r=>r.event.id));
 const events=mergeOccurrences(rows.filter(r=>r.reviewed||!reviewed.has(r.event.id)).map(r=>r.event));
 return {events,sources:eventSources.map(s=>{const r=results.find(r=>r.id===s.id);return {sourceId:s.id,checkedAt:r?.checked_at??null,attemptedAt:r?.attempted_at??null,state:r?.state??'snapshot',count:events.filter(e=>e.sourceId===s.id).length};}),generatedAt:new Date().toISOString()};
}
/** Allowlisted HTTPS only; inspect redirects without following them in the Workers runtime. */
export async function fetchOfficial(url:string,source:EventSource,fetcher:typeof fetch=fetch){
 const safe=safeSourceUrl(url,source);if(!safe)throw Error('source_url');
 // Older deployed Workers reject redirect:'error' before making any request.
 const response=await fetcher(safe,{redirect:'manual',signal:AbortSignal.timeout(8000),headers:{Accept:'text/html,application/ld+json;q=0.9','User-Agent':'ETAHB-EventCalendar/1.0'}});
 if(!response.ok||!response.body){await response.body?.cancel().catch(()=>{});throw Error(`source_http_${response.status}`);}
 const reader=response.body.getReader(),chunks:Uint8Array[]=[];let length=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>2_000_000)throw Error('source_too_large');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 const probe=new TextDecoder().decode(bytes.slice(0,2500));
 const encoding=/windows-1254|iso-8859-9/i.test(response.headers.get('Content-Type')+' '+probe)?'windows-1254':'utf-8';return new TextDecoder(encoding).decode(bytes);
}
export async function refreshEventSources(env:SocialEnv,fetcher:typeof fetch=fetch,manual=false){
 if(!env.DB)return;await bootstrap(env);const now=Date.now(),stamp=new Date(now).toISOString();
 const {results}=await env.DB.prepare('SELECT * FROM city_event_feeds WHERE id NOT LIKE ? ORDER BY attempted_at IS NOT NULL,attempted_at ASC').bind('manual:%').all<Row>();
 const due=results.filter(r=>r.lease_until<now&&(!r.attempted_at||now-Date.parse(r.attempted_at)>(manual?MANUAL_RETRY:r.state==='unavailable'?RETRY:TTL))).slice(0,4);
 await Promise.allSettled(due.map(async row=>{
  const source=sourceById[row.id];if(!source)return;
  const lock=await env.DB!.prepare('UPDATE city_event_feeds SET lease_until=? WHERE id=? AND lease_until=?').bind(now+120000,row.id,row.lease_until).run();if(!lock.meta?.changes)return;
  try{
   const html=await fetchOfficial(source.url,source,fetcher);if(html.length<300)throw Error('empty_response');
   let imported:CityEvent[]=[],previous=validatedEvents(JSON.parse(row.payload)),supported=false;
   if(source.adapter==='tepebasi'){imported=parseTepebasi(html,source,stamp);supported=/event-detail|etkinlik-card-body/.test(html);}
   else if(source.adapter==='ebb-news'){
    const candidateLinks=links(html,source).filter(l=>/icerik-detay/.test(l.url)&&/konser|sinema|tiyatro|sergi|festival|ekonomi|turnuva|yesilcam/.test(folded(l.title)));
    const urls=[...new Set([...previous.filter(e=>!e.date||e.date>=stamp.slice(0,10)).map(e=>e.sourceUrl),...candidateLinks.map(l=>l.url)])].slice(0,10);
    const records=await Promise.allSettled(urls.map(async url=>{const html=await fetchOfficial(url,source,fetcher),events=parseEbbArticle(html,source,url,stamp),status=announcementStatus(html);return {url,events:events.length?events:status?previous.filter(e=>e.sourceUrl===url).map(e=>({...e,status,checkedAt:stamp})):[]};}));
    const succeeded=new Set<string>();for(const r of records)if(r.status==='fulfilled'&&r.value.events.length){imported.push(...r.value.events);succeeded.add(r.value.url);}
    // Failed or changed article formats retain their last VERIFIED timestamp, never a false refresh.
    previous=previous.filter(e=>!succeeded.has(e.sourceUrl));supported=succeeded.size>0;
   }else{imported=parseStructured(html,source,stamp);supported=imported.length>0;
    // Follow at most two same-institution calendar/detail links carrying structured records.
    if(!supported){const urls=[...new Set(links(html,source).filter(l=>/etkinlik|event|takvim/i.test(l.url)&&l.url!==source.url).map(l=>l.url))].slice(0,2);
     const results=await Promise.allSettled(urls.map(async url=>parseStructured(await fetchOfficial(url,source,fetcher),source,stamp)));for(const r of results)if(r.status==='fulfilled')imported.push(...r.value);supported=imported.length>0;
    }
   }
   imported=imported.map(e=>{const old=eventSnapshot.find(x=>x.sourceUrl===e.sourceUrl&&x.date===e.date&&x.time===e.time);return old?{...e,id:old.id,title:old.title,summary:old.summary,family:old.family}:e;});
   const matched=new Set(imported.map(e=>e.sourceUrl+'|'+e.date+'|'+e.time));
   const retained=previous.filter(e=>!matched.has(e.sourceUrl+'|'+e.date+'|'+e.time));
   const payload=mergeOccurrences([...retained,...imported]).slice(-600);
   await env.DB!.prepare('UPDATE city_event_feeds SET payload=?,checked_at=?,attempted_at=?,state=?,lease_until=0 WHERE id=?').bind(JSON.stringify(payload),stamp,stamp,supported?'connected':'no-structured-events',row.id).run();
  }catch(error){console.error('event_source_refresh_failed',{sourceId:row.id,message:error instanceof Error?error.message:'unknown_error'});await env.DB!.prepare("UPDATE city_event_feeds SET attempted_at=?,state='unavailable',lease_until=0 WHERE id=?").bind(stamp,row.id).run();}
 }));
}
export async function handleEventApi(request:Request,env:SocialEnv,ctx:{waitUntil(p:Promise<unknown>):void},fetcher:typeof fetch=fetch){
 const url=new URL(request.url),origin=request.headers.get('origin'),allowed=new Set([url.origin,'https://ozguraric-wq.github.io','https://localhost','capacitor://localhost']);
 const headers=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin'});
 if(origin&&allowed.has(origin)){headers.set('Access-Control-Allow-Origin',origin);headers.set('Access-Control-Allow-Credentials','true');headers.set('Access-Control-Allow-Headers','Authorization,Content-Type');headers.set('Access-Control-Allow-Methods','GET,PUT,OPTIONS');}
 const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(origin&&!allowed.has(origin))return json({error:'origin_not_allowed'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(url.pathname!=='/api/events')return json({error:'not_found'},404);
 try{
  if(request.method==='PUT'){
   const identity=await identify(request,env,'sites');if(!identity?.admin)return json({error:'forbidden'},403);
   return json(await writeReviewedEvents(request,env));
  }
  if(request.method!=='GET')return json({error:'method_not_allowed'},405);
  const catalog=await getEventCatalog(env);
  if(url.searchParams.get('refresh')==='1'){await refreshEventSources(env,fetcher,true);return json(await getEventCatalog(env));}
  ctx.waitUntil(refreshEventSources(env,fetcher));return json(catalog);
 }catch{return json({error:'events_unavailable'},503);}
}

export async function writeReviewedEvents(request:Request,env:SocialEnv){
 const raw=await request.text();if(raw.length>50000)throw Error('too_large');const body=JSON.parse(raw);
 if(!sourceById[body.sourceId]||!Array.isArray(body.events)||body.events.length>50)throw Error('invalid_events');
 const events=validatedEvents(body.events.map((e:CityEvent)=>({...e,sourceId:body.sourceId,checkedAt:new Date().toISOString()})));
 if(events.length!==body.events.length)throw Error('invalid_events');
 const id='manual:'+body.sourceId,stored=await env.DB!.prepare('SELECT payload FROM city_event_feeds WHERE id=?').bind(id).first<{payload:string}>();
 const before=stored?.payload??'[]',existing=validatedEvents(JSON.parse(before)),map=new Map(existing.map(e=>[e.id,e]));events.forEach(e=>map.set(e.id,e));
 const payload=JSON.stringify([...map.values()]);if(map.size>600)throw Error('too_large');
 if(stored){const result=await env.DB!.prepare("UPDATE city_event_feeds SET payload=?,checked_at=? WHERE id=? AND payload=?").bind(payload,new Date().toISOString(),id,before).run();if(!result.meta?.changes)throw Error('revision_changed');}
 else await env.DB!.prepare("INSERT INTO city_event_feeds (id,payload,checked_at,state) VALUES (?,?,?,'connected')").bind(id,payload,new Date().toISOString()).run();
 return {ok:true,count:events.length};
}
