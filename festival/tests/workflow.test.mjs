import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {randomBytes,scryptSync} from 'node:crypto';
import {sampleApplication,initialState} from '../lib/festival/seed.ts';
import {validateApplication,ageAt,businessDue,scoreSummary,deriveSelections,freshApplication} from '../lib/festival/domain.ts';
import {applyAction,redactReviewer} from '../lib/festival/actions.ts';
import {createFestivalServer} from '../server/server.mjs';

test('eligibility boundaries, nationality, one-day cutoff, duration, words and files',()=>{
 const a=sampleApplication();assert.deepEqual(validateApplication(a),[]);
 a.directors[0].dob='1997-03-31';assert(validateApplication(a).some(x=>x.includes('30 yaş')));
 a.directors[0].dob='1997-04-01';assert.deepEqual(validateApplication(a),[]);
 assert(Number.isNaN(ageAt('2002-02-31')));
 a.directors.push({name:'İkinci Yönetmen',dob:'1990-01-01',citizen:true});assert(validateApplication(a).some(x=>x.includes('2. yönetmen')));a.directors.pop();
 a.duration=20;assert.deepEqual(validateApplication(a),[]);a.duration=20.1;assert(validateApplication(a).some(x=>x.includes('süresi')));a.duration=14;
 a.completed='2024-01-01';assert(validateApplication(a).some(x=>x.includes('Yapım')));a.completed='2024-01-02';assert.deepEqual(validateApplication(a),[]);
 a.short=Array(51).fill('film').join(' ');assert(validateApplication(a).some(x=>x.includes('50 kelime')));
 a.short='Kısa tanıtım';a.files=a.files.filter(f=>f.slot!=='rights');assert(validateApplication(a).some(x=>x.includes('Telif izin')));
 assert.equal(businessDue('2027-04-02T10:00:00Z',['2027-04-05']).slice(0,10),'2027-04-12');
});

test('two independent reviews, strict >20 rule, conflict and immutable scoring',()=>{
 const s=initialState();const a=s.applications[2];const admin={id:'admin',role:'admin'};
 assert.throws(()=>applyAction(s,'status',{id:a.id,status:'selected',note:'Early' },admin));
 applyAction(s,'score',{id:a.id,scores:[20,15,15,10,10,10,5,10,5],note:'İlk değerlendirme.'},{id:'juri-1',role:'reviewer'});
 assert.equal(a.status,'review');assert.equal(redactReviewer(a,'juri-2').reviews.length,0);
 assert.throws(()=>applyAction(s,'score',{id:a.id,scores:[20,15,15,10,10,10,5,10,5],note:'Tekrar'},{id:'juri-1',role:'reviewer'}));
 applyAction(s,'score',{id:a.id,scores:[15,12,12,8,8,8,4,8,4],note:'İkinci değerlendirme.'},{id:'juri-2',role:'reviewer'});
 assert.equal(scoreSummary(a).mean,89.5);assert.equal(a.status,'third');
 applyAction(s,'assign',{id:a.id,reviewer:'juri-3'},admin);
 applyAction(s,'score',{id:a.id,scores:[18,14,13,9,9,9,5,9,4],note:'Üçüncü bağımsız görüş.'},{id:'juri-3',role:'reviewer'});
 assert.equal(a.status,'evaluated');assert.equal(scoreSummary(a).count,3);
 applyAction(s,'status',{id:a.id,status:'selected',note:'Kurul gerekçeli seçki kararı.'},admin);assert.equal(a.status,'selected');
 const b=s.applications[0];b.status='review';b.assigned=['juri-1','juri-2'];
 applyAction(s,'score',{id:b.id,conflict:true,note:'Yapım ekibinde görev aldım.'},{id:'juri-1',role:'reviewer'});assert.equal(scoreSummary(b).count,0);
 assert(!deriveSelections(s.applications).youth.includes(a.id));
});

test('live API: persistent encrypted records, attachments, code protection, correction, role isolation and program publication',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'egff-test-'));const password=randomBytes(24).toString('hex');const users=['admin','juri-1','juri-2','juri-3'].map(username=>{const salt=randomBytes(16).toString('hex');return {username,role:username==='admin'?'admin':'reviewer',salt,hash:scryptSync(password,salt,64).toString('hex')};});
 const options={dataDir:dir,encryptionKey:randomBytes(32).toString('base64'),origins:['https://festival.example'],users,openAt:'2020-01-01',closeAt:'2090-01-01',registrationsEnabled:true};
 let server=createFestivalServer(options);await new Promise(r=>server.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+server.address().port;
 const req=async(path,body,token,method=body===undefined?'GET':'POST')=>{const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json',Origin:'https://festival.example',...(token?{Authorization:'Bearer '+token}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});return {status:response.status,body:await response.json()};};
 try{
  assert.equal((await req('/staff/state')).status,401);
  const a=sampleApplication();a.title='API kalıcılık denemesi';const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==';a.files=a.files.map(f=>({...f,name:f.slot+'.png',type:'image/png',data:'data:image/png;base64,'+png}));
  const created=await req('/applications',a);assert.equal(created.status,201,JSON.stringify(created.body));const entry=created.body;assert.equal(entry.demo,false);assert.equal(entry.reviews.length,0);assert.equal(entry.files.length,7);
  assert.equal((await req('/applications',{...a,category:'documentary'})).status,409);
  assert.equal((await req('/track',{email:a.email,code:'WRONG'})).status,404);
  const tracked=await req('/track',{email:a.email,code:entry.code});assert.equal(tracked.status,200);assert.equal(tracked.body.files[0].data,'data:image/png;base64,'+png);
  const admin=(await req('/staff/login',{username:'admin',password})).body.token;
  const j1=(await req('/staff/login',{username:'juri-1',password})).body.token;
  const j2=(await req('/staff/login',{username:'juri-2',password})).body.token;
  assert.equal((await req('/staff/detail',{id:entry.id},j1)).status,403);
  const mutate=(action,payload,token=admin)=>req('/staff/action',{action,payload},token);
  assert.equal((await mutate('status',{id:entry.id,status:'correction',note:'Afişi güncelleyin.'})).status,200);
  assert.equal((await req('/correction',{id:entry.id,code:'WRONG',patch:{note:'Düzeltildi.'}})).status,403);
  const fixed=await req('/correction',{id:entry.id,code:entry.code,patch:{note:'Afiş yenilendi.',category:'feature',duration:999}});assert.equal(fixed.status,200);assert.equal(fixed.body.category,'fiction');assert.equal(fixed.body.duration,14);
  assert.equal((await mutate('status',{id:entry.id,status:'eligible',note:'Belgeler uygundur.'})).status,200);
  assert.equal((await mutate('assign',{id:entry.id,reviewer:'juri-1'})).status,200);assert.equal((await mutate('assign',{id:entry.id,reviewer:'juri-2'})).status,200);
  const juryDetail=(await req('/staff/detail',{id:entry.id},j1)).body;assert.equal(juryDetail.email,'');assert.equal(juryDetail.code,'');assert(!juryDetail.files.some(f=>f.slot==='identity'));
  assert.equal((await mutate('status',{id:entry.id,status:'rejected',note:'Yetkisiz deneme'},j1)).status,400);
  assert.equal((await mutate('score',{id:entry.id,scores:[20,15,15,10,10,10,5,10,5],note:'Bağımsız puan.'},j1)).status,200);
  assert.equal((await req('/staff/detail',{id:entry.id},j2)).body.reviews.length,0);
  const event={id:'event-test',day:24,time:'12:00',title:'Onaylı deneme etkinliği',type:'Söyleşi',place:'Deneme salonu',duration:60,capacity:100,published:false,demo:false};
  assert.equal((await mutate('event',{event})).status,200);assert.equal((await req('/public')).body.events.length,0);await mutate('event',{event:{...event,published:true}});assert.equal((await req('/public')).body.events.length,1);
  await req('/staff/logout',{},j1);assert.equal((await req('/staff/state',undefined,j1)).status,401);
  await new Promise(r=>server.close(r));server=createFestivalServer(options);await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
  const after=(await req('/track',{email:a.email,code:entry.code}));assert.equal(after.status,200);assert.equal(after.body.status,'review');assert.equal(after.body.reviews.length,0);
  assert(!readFileSync(join(dir,'festival.sqlite')).includes(Buffer.from(a.title)));
 }finally{await new Promise(r=>server.close(r));rmSync(dir,{recursive:true,force:true});}
});
