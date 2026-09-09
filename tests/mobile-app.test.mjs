import assert from "node:assert/strict";
import test,{after} from "node:test";
import {readFile,writeFile,mkdir,readdir,mkdtemp,rm} from "node:fs/promises";
import {join,resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {build} from "esbuild";

await mkdir("work",{recursive:true});
const dir=await mkdtemp(resolve("work/mobile-tests-"));
await build({entryPoints:['routing/engine','routing/data','mobile/assistant-server','mobile/trips'].map(file=>`lib/${file}.ts`),outbase:'lib',outdir:dir,outExtension:{'.js':'.mjs'},bundle:true,splitting:true,platform:'node',format:'esm',logLevel:'silent'});
after(()=>rm(dir,{recursive:true,force:true}));
const {defaults,normalizePreferences,generatePlans}=await import(pathToFileURL(join(dir,"routing/engine.mjs")));
const {CATALOG_VERSION}=await import(pathToFileURL(join(dir,"routing/data.mjs")));
const {handleAssistantApi,issueAssistantToken,verifyAssistantToken}=await import(pathToFileURL(join(dir,"mobile/assistant-server.mjs")));
const {validTrip,toggleVisit,readTrips,writeTrips,TRIPS_KEY}=await import(pathToFileURL(join(dir,"mobile/trips.mjs")));

test("explicit must-see requests are hard constraints and impossible requests have no fallback",()=>{
  const p=normalizePreferences({...defaults,days:1,required:["midas"],interests:["phrygia"],mode:"car",startMode:"fixed"});
  const result=generatePlans(p);assert.ok(result.plans.length);assert.ok(result.plans.every(plan=>plan.days.some(d=>d.placeIds.includes("midas"))));
  assert.equal(generatePlans({...p,excluded:["midas"]}).plans.length,0);
  assert.equal(generatePlans({...p,mode:"bicycle",origin:"center",startMode:"fixed",cycleKm:25}).plans.length,0);
  const late=normalizePreferences({...p,start:990,end:1080});assert.equal(late.start,990);assert.equal(late.end,1080);
});

class Counts {
  values=new Map();
  prepare(){let args;return {bind(...a){args=a;return this;},first:async()=>{const [key,bucket,limit]=args;const k=key+":"+bucket;const n=this.values.get(k)??0;if(n>=limit)return null;this.values.set(k,n+1);return {count:n+1};}};}
}
const env=()=>({OPENAI_API_KEY:"test-provider-key",SITE_AUTH_USERNAME:"test-user",SITE_AUTH_PASSWORD:"test-password",SITE_AUTH_SESSION_SECRET:"test-only-secret-with-more-than-32-characters",DB:new Counts(),AI_DAILY_LIMIT:"1"});
const req=(path,body,token="",origin="https://localhost")=>new Request(`https://api.example.test/api/mobile/${path}`,{method:"POST",headers:{"Content-Type":"application/json",Origin:origin,...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)});
test("unconfigured assistant is explicitly offline and never calls a provider",async()=>{
  let calls=0;const fake=async()=>{calls++;throw Error();};
  const status=await handleAssistantApi(new Request("https://api.example.test/api/mobile/status"),{},fake);assert.equal((await status.json()).ready,false);
  const response=await handleAssistantApi(req("assist",{}),{},fake);assert.equal(response.status,503);assert.equal(calls,0);
});
test("assistant tokens expire, reject tampering and require server authentication",async()=>{
  const e=env(),now=Date.now(),token=await issueAssistantToken(e.SITE_AUTH_SESSION_SECRET,now);
  assert.equal(await verifyAssistantToken(token,e.SITE_AUTH_SESSION_SECRET,now),true);
  assert.equal(await verifyAssistantToken(token,e.SITE_AUTH_SESSION_SECRET,now+7201000),false);
  assert.equal(await verifyAssistantToken(token+"x",e.SITE_AUTH_SESSION_SECRET,now),false);
  assert.equal((await handleAssistantApi(req("assist",{}),e)).status,401);
  assert.equal((await handleAssistantApi(req("session",{username:"bad",password:"bad"}),e)).status,401);
  assert.equal((await handleAssistantApi(req("session",{username:"test-user",password:"test-password"},"","https://attacker.invalid"),e)).status,403);
});
test("live API adapter uses Responses, validates model output and enforces the daily budget",async()=>{
  const e=env(),token=await issueAssistantToken(e.SITE_AUTH_SESSION_SECRET);
  const p=normalizePreferences({...defaults,days:1,required:["midas"],interests:["phrygia"]});
  let calls=0;const fake=async(url,init)=>{calls++;assert.equal(url,"https://api.openai.com/v1/responses");const body=JSON.parse(init.body);assert.equal(body.store,false);assert.equal(body.text.format.strict,true);assert.equal(body.model,"gpt-4.1-mini");return new Response(JSON.stringify({status:"completed",output:[{type:"message",content:[{type:"output_text",text:JSON.stringify({action:"plan",message:"Midas Anıtı’nı içeren seçenekleri kontrol edelim.",preferences:p,sourcePlaceIds:["midas"]})}]}]}),{headers:{"Content-Type":"application/json"}});};
  const input={message:"Yazılıkaya'yı görmek istiyorum",locale:"tr",catalogVersion:CATALOG_VERSION,preferences:p,history:[]};
  const response=await handleAssistantApi(req("assist",input,token),e,fake);assert.equal(response.status,200);const proposal=await response.json();assert.ok(proposal.planCount>0);assert.deepEqual(proposal.preferences.required,["midas"]);assert.ok(proposal.sources.every(s=>s.url.startsWith("https://")));assert.ok(!JSON.stringify(proposal).includes(e.OPENAI_API_KEY));
  assert.equal((await handleAssistantApi(req("assist",input,token),e,fake)).status,429);assert.equal(calls,1);
});
test("hallucinated places and forged request fields cannot enter a route",async()=>{
  const e=env(),token=await issueAssistantToken(e.SITE_AUTH_SESSION_SECRET);
  const p=normalizePreferences(defaults),input={message:"Bir gezi planla",locale:"tr",catalogVersion:CATALOG_VERSION,preferences:p,history:[]};
  const fake=async()=>new Response(JSON.stringify({status:"completed",output:[{type:"message",content:[{type:"output_text",text:JSON.stringify({action:"plan",message:"A route",preferences:{...p,required:["not-a-real-place"]},sourcePlaceIds:[]})}]}]}));
  assert.equal((await handleAssistantApi(req("assist",{...input,apiKey:"do-not-accept"},token),e,fake)).status,400);
  assert.equal((await handleAssistantApi(req("assist",input,token),e,fake)).status,502);
});
test("saved trip progress is reversible and deleting every trip does not reimport legacy plans",()=>{
  const p=normalizePreferences({...defaults,days:1}),plan=generatePlans(p).plans[0];
  const trip={id:"t1",title:"Eskişehir",preferences:p,plan,completed:[],savedAt:new Date().toISOString(),catalogVersion:CATALOG_VERSION};
  assert.ok(validTrip(trip));const key=`0:${plan.days[0].placeIds[0]}`;assert.deepEqual(toggleVisit(trip,key).completed,[key]);assert.deepEqual(toggleVisit(toggleVisit(trip,key),key).completed,[]);assert.deepEqual(toggleVisit(trip,"0:invented").completed,[]);
  const storage=new Map([["etahb-discovery-plans-v2",JSON.stringify([{id:"old",title:"old",p,planId:plan.id}])]]);
  globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};globalThis.window={dispatchEvent:()=>{}};
  assert.equal(readTrips().length,1);writeTrips([]);assert.equal(storage.get(TRIPS_KEY),"[]");assert.equal(readTrips().length,0);
  delete globalThis.localStorage;delete globalThis.window;
});
