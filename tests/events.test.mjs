import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdtemp,mkdir,readFile,readdir,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
await mkdir('work',{recursive:true});const dir=await mkdtemp(resolve('work/event-tests-'));
await build({stdin:{contents:`export * from './lib/events/catalog';export * from './lib/events/sources';export * from './lib/events/importers';export * from './lib/events/server';export * from './lib/events/venues';export * from './lib/routing/engine';export * from './lib/routing/exports';export * from './lib/mobile/trips';export * from './lib/qr/links';export {CATALOG_VERSION} from './lib/routing/data';`,resolveDir:process.cwd()},outfile:join(dir,'entry.mjs'),bundle:true,platform:'node',format:'esm',logLevel:'silent'});
const m=await import(pathToFileURL(join(dir,'entry.mjs')));
const stamp=new Date().toISOString(),date=m.dateForDay(m.turkeyToday(),7);
const event=(overrides={})=>({id:'test-film-evening',title:'Test film screening',category:'cinema',district:'Tepebaşı',date,time:'20:00',endTime:'21:30',venue:'Aktif Yaşam Parkı',venueId:'aktif-yasam',organizer:'Test organiser',sourceId:'ebb',sourceUrl:'https://www.eskisehir.bel.tr/icerik-detay.php?icerik_id=900001',checkedAt:stamp,status:'scheduled',price:'free',bookingUrl:null,summary:'Test data only.',family:true,indoor:false,...overrides});
const pref=(overrides={})=>m.normalizePreferences({...m.defaults,days:1,date,start:600,end:1410,required:['porsuk'],events:['test-film-evening'],eventDurations:{'test-film-evening':120},...overrides});
const sqlite=new DatabaseSync(':memory:');
class Statement{constructor(sql,args=[]){this.sql=sql;this.args=args;}bind(...args){return new Statement(this.sql,args);}async first(){return sqlite.prepare(this.sql).get(...this.args)??null;}async all(){return {results:sqlite.prepare(this.sql).all(...this.args)};}async run(){return {meta:{changes:Number(sqlite.prepare(this.sql).run(...this.args).changes)}};}}
const db={prepare:sql=>new Statement(sql),batch:async statements=>{sqlite.exec('BEGIN');try{const r=statements.map(s=>({meta:{changes:Number(sqlite.prepare(s.sql).run(...s.args).changes)}}));sqlite.exec('COMMIT');return r;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
for(const file of (await readdir('drizzle')).filter(f=>f.endsWith('.sql')).sort())sqlite.exec((await readFile('drizzle/'+file,'utf8')).replaceAll('--> statement-breakpoint',''));
after(async()=>{sqlite.close();await rm(dir,{recursive:true,force:true});});

test('fixed event time, entry buffer, meals and mandatory places survive every alternative',()=>{
 const e=event(),p=pref(),r=m.generatePlans(p,[e]);assert.ok(r.plans.length>=2);
 for(const plan of r.plans){const day=plan.days[0];assert.ok(day.placeIds.includes('porsuk'));assert.equal(day.items.filter(i=>i.kind==='event').length,1);assert.ok(day.items.some(i=>i.kind==='meal'&&i.id.endsWith('dinner')));assert.equal(day.items.at(-1).kind,'return');assert.ok(day.finish<=p.end);
  for(let i=0;i<day.items.length;i++){const item=day.items[i],prev=i?day.items[i-1].end:day.start;if(item.kind==='event'){assert.equal(item.start,1200);assert.equal(item.end,1290);assert.ok(prev+item.leg.minutes<=item.arrivalBy);assert.equal(item.arrivalBy,1180);}else assert.ok(prev+item.leg.minutes<=item.start);}
 }
});
test('two events can be interleaved with visits; actual overlapping sessions are rejected',()=>{
 const a=event({id:'test-first',venueId:'atilla-ozer',venue:'Atilla Özer Karikatürlü Ev',time:'15:00',endTime:'16:00'}),b=event();const p=pref({events:[a.id,b.id]});
 const r=m.generatePlans(p,[a,b]);assert.ok(r.plans.length);for(const plan of r.plans)assert.deepEqual(plan.days[0].items.filter(i=>i.event).map(i=>i.event.id),[a.id,b.id]);
 const overlap=event({id:'test-overlap',time:'20:30',endTime:'21:30'});const bad=m.generatePlans(pref({events:[b.id,overlap.id]}),[b,overlap]);assert.equal(bad.plans.length,0);assert.ok(bad.eventIssues.some(i=>i.code==='overlap'));
});
test('events are never moved to another date, silently removed or treated as a guessed venue',()=>{
 for(const [e,p,code] of [[event(),pref({date:''}),'date'],[event({status:'cancelled'}),pref(),'unconfirmed'],[event({status:'postponed'}),pref(),'unconfirmed'],[event({venueId:null}),pref(),'unconfirmed'],[event({time:null}),pref(),'unconfirmed'],[event({date:m.dateForDay(date,4)}),pref(),'outside'],[event({checkedAt:new Date(Date.now()-80*3600000).toISOString()}),pref(),'stale'],[event({date:m.dateForDay(m.turkeyToday(),-1)}),pref(),'expired']]){const r=m.generatePlans(p,[e]);assert.equal(r.plans.length,0);assert.ok(r.eventIssues.some(i=>i.code===code),code);}
 const missing=m.generatePlans(pref(),[]);assert.equal(missing.plans.length,0);assert.equal(missing.eventIssues[0].code,'missing');
});
test('unknown end times need an explicit allowance; official duration overrides it',()=>{
 const e=event({endTime:null}),bad=m.generatePlans(pref({eventDurations:{}}),[e]);assert.ok(bad.eventIssues.some(i=>i.code==='duration'));
 const a=m.generatePlans(pref({eventDurations:{[e.id]:60}}),[e]).plans[0];assert.ok(a);const item=a.days[0].items.find(i=>i.event);assert.equal(item.end-item.start,60);assert.equal(item.estimatedEnd,true);
 const b=m.generatePlans(pref({eventDurations:{[e.id]:120}}),[e]).plans[0];assert.notEqual(a.id,b.id);
});
test('late rural transit and unsupported cycling/walking transfers have no teleport fallback',()=>{
 for(const mode of ['transit','bicycle','walk']){const p=pref({mode,origin:'midas',startMode:'fixed',required:[],interests:['phrygia'],cycleKm:25});const r=m.generatePlans(p,[event()]);assert.equal(r.plans.length,0,mode);}
 const leg=m.timedLeg(m.eventStopId(event()),'origin:midas',1290,pref({mode:'transit'}),date);assert.equal(leg.minutes,Infinity);
});
test('multiple-day route includes each occurrence exactly once',()=>{
 const a=event(),b=event({id:'test-second-day',date:m.dateForDay(date,1)});const r=m.generatePlans(pref({days:2,events:[a.id,b.id]}),[a,b]);assert.ok(r.plans.length);
 for(const plan of r.plans){assert.equal(plan.days[0].items.find(i=>i.event).event.id,a.id);assert.equal(plan.days[1].items.find(i=>i.event).event.id,b.id);}
});
test('QR, saved trips, directions, PDF and calendar retain the dated event and its source',()=>{
 const e=event({endTime:null}),p=pref(),plan=m.generatePlans(p,[e]).plans[0],item=plan.days[0].items.find(i=>i.event);assert.ok(plan);
 const qr=m.parseQrInput(m.planQrUrl(p,plan.id));assert.deepEqual(qr.preferences.events,p.events);assert.deepEqual(qr.preferences.eventDurations,p.eventDurations);
 assert.ok(m.navigationSegments(plan.days[0],p).some(s=>s.stops.includes(item.id)));assert.match(m.placeQuery(item.id,p),/Aktif Yaşam/);
 const trip={id:'test',title:'Events',preferences:p,plan,completed:[],savedAt:stamp,catalogVersion:m.CATALOG_VERSION};assert.equal(m.validTrip(trip),true);assert.equal(m.validTrip({...trip,plan:{...plan,days:[{...plan.days[0],items:[{...item,event:{...e,sourceUrl:'javascript:alert(1)'}}]}]}}),false);
 for(const locale of ['tr','en','de','fr','ar']){const pdf=m.printDocumentHtml(plan,p,locale,'https://example.org/logo.webp'),ics=m.calendarFile(plan,p,locale).replace(/\r\n /g,'');assert.ok(pdf.includes(e.title));assert.ok(pdf.includes('icerik_id=900001'));assert.ok(ics.includes(e.title));assert.ok(ics.includes('TRIGGER:-PT20M'));assert.ok(ics.includes('TRANSP:OPAQUE'));assert.ok(!pdf.includes('<script'));}
});
test('official imports use event dates, retain cancellations and reject hostile or invalid records',()=>{
 const tepe=`<div class="etkinlikler"><h4><a href="/Etkinlikler/Detay/test">TEST KONSER</a></h4><ul><li>event 18 Eylül 2026 Cuma</li><li>schedule 20:00</li><li>location_on Atilla Özer Karikatürlü Ev</li></ul></div>`;
 const t=m.parseTepebasi(tepe,m.sourceById.tepebasi,stamp);assert.equal(t.length,1);assert.equal(t[0].date,'2026-09-18');assert.equal(t[0].venueId,'atilla-ozer');
 const url='https://www.eskisehir.bel.tr/icerik-detay.php?icerik_id=900001';const h='<h1>EKONOMİ SÖYLEŞİSİ</h1><span>Geri Dön > 08.09.2026</span><p>26 Eylül 2026 Cumartesi günü saat 19.00’da, Atatürk Kültür, Sanat ve Kongre Merkezi’nde gerçekleştirilecek.</p>';
 const a=m.parseEbbArticle(h,m.sourceById.ebb,url,stamp);assert.equal(a.length,1);assert.equal(a[0].date,'2026-09-26');assert.equal(a[0].time,'19:00');assert.equal(m.parseEbbArticle('<h1>KONSER DUYURUSU</h1><p>Geri Dön > 08.09.2026. Konser yakında.</p>',m.sourceById.ebb,url,stamp).length,0);
 const record={'@type':'MusicEvent',name:'Test concert',startDate:date+'T20:00:00+03:00',endDate:date+'T21:00:00+03:00',location:{name:'Aktif Yaşam Parkı'},eventStatus:'https://schema.org/EventCancelled',url,isAccessibleForFree:true};
 const wrap=o=>`<script type="application/ld+json">${JSON.stringify(o)}</script>`;const parsed=m.parseStructured(wrap(record),m.sourceById.ebb,stamp);assert.equal(parsed[0].status,'cancelled');assert.equal(parsed[0].endTime,'21:00');assert.equal(m.parseStructured(wrap({...record,url:'https://evil.example/x'}),m.sourceById.ebb,stamp).length,0);assert.equal(m.validatedEvents([event({date:'2026-02-30'})]).length,0);
});
test('feed cache is idempotent, failures retain truthful timestamps, refreshes are throttled and writes need an administrator',async()=>{
 const env={DB:db},catalog=await m.getEventCatalog(env);assert.equal(catalog.events.length,7);await m.getEventCatalog(env);assert.equal(sqlite.prepare('SELECT count(*) n FROM city_event_feeds').get().n,m.eventSources.length);
 let calls=0;const failed=async()=>{calls++;throw Error('offline');};await m.refreshEventSources(env,failed);assert.equal(calls,4);const after=await m.getEventCatalog(env);assert.equal(after.events[0].checkedAt,catalog.events[0].checkedAt);assert.equal(after.sources.filter(s=>s.state==='unavailable').length,4);
 await m.refreshEventSources(env,failed);assert.equal(calls,8); // next group, never a retry storm on the first four
 const response=await m.handleEventApi(new Request('https://events.test/api/events',{method:'PUT',headers:{'Content-Type':'application/json'},body:'{}'}),env,{waitUntil(){}});assert.equal(response.status,403);
 const denied=await m.handleEventApi(new Request('https://events.test/api/events',{headers:{Origin:'https://evil.example'}}),env,{waitUntil(){}});assert.equal(denied.status,403);
 await assert.rejects(m.fetchOfficial('https://127.0.0.1/admin',m.sourceById.ebb,failed));assert.equal(calls,8);
});

test('reviewed cancellation supersedes imported records and cannot be resurrected by a feed refresh',async()=>{
 const env={DB:db};const e=(await m.getEventCatalog(env)).events.find(e=>e.id==='ebb-yesilcam-2026-09-11');
 await m.writeReviewedEvents(new Request('https://events.test/api/events',{method:'PUT',body:JSON.stringify({sourceId:'ebb',events:[{...e,status:'cancelled'}]})}),env);
 const current=await m.getEventCatalog(env);assert.equal(current.events.filter(x=>x.id===e.id).length,1);assert.equal(current.events.find(x=>x.id===e.id).status,'cancelled');
 await assert.rejects(m.writeReviewedEvents(new Request('https://events.test/api/events',{method:'PUT',body:JSON.stringify({sourceId:'ebb',events:[{...e,sourceUrl:'https://evil.example/'}]})}),env));
});
