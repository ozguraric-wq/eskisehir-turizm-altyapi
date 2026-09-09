import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,mkdir,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {DatabaseSync} from 'node:sqlite';
import {createHash} from 'node:crypto';
await mkdir('work',{recursive:true});const dir=await mkdtemp(resolve('work/social-tests-'));
const bundle=await build({stdin:{contents:"import {handleSocialApi} from './lib/social/server.ts';export default {fetch:(r,e)=>handleSocialApi(r,e,'standalone')};",resolveDir:process.cwd(),sourcefile:'social-test-entry.ts'},bundle:true,format:'esm',target:'es2022',write:false,platform:'neutral'});
const ADMIN='a1000000-0000-4000-8000-000000000001',adminToken='a'.repeat(43);
// In-process Workers adapter: exercises the real API and migration SQL, without a listening server.
await writeFile(join(dir,'server.mjs'),bundle.outputFiles[0].text);const worker=(await import(pathToFileURL(join(dir,'server.mjs')))).default;
const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');
class Statement{constructor(sql,args=[]){this.sql=sql;this.args=args;}bind(...args){return new Statement(this.sql,args);}async first(){return sqlite.prepare(this.sql).get(...this.args)??null;}async all(){return {results:sqlite.prepare(this.sql).all(...this.args)};}async run(){return {meta:{changes:Number(sqlite.prepare(this.sql).run(...this.args).changes)}};}}
const db={prepare:sql=>new Statement(sql),batch:async statements=>{sqlite.exec('BEGIN');try{const result=statements.map(s=>({meta:{changes:Number(sqlite.prepare(s.sql).run(...s.args).changes)}}));sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
const objects=new Map(),bucket={put:async(key,body)=>{objects.set(key,new Uint8Array(await new Response(body).arrayBuffer()));},get:async key=>{const b=objects.get(key);return b?{body:new Response(b).body,size:b.length}:null;},delete:async keys=>{for(const key of Array.isArray(keys)?keys:[keys])objects.delete(key);},list:async()=>({objects:[...objects.keys()]})};
globalThis.FixedLengthStream=class{constructor(){const t=new TransformStream();this.readable=t.readable;this.writable=t.writable;}};
const env={DB:db,BUCKET:bucket,SOCIAL_SESSION_SECRET:'local-test-secret-not-a-production-credential',SOCIAL_ADMIN_IDS:ADMIN};
const mf={dispatchFetch:async(url,options)=>worker.fetch(new Request(url,options),env),getR2Bucket:async()=>bucket};
after(async()=>{sqlite.close();await rm(dir,{recursive:true,force:true});});
for(const file of (await readdir('drizzle')).filter(f=>f.endsWith('.sql')).sort()){const sql=await readFile('drizzle/'+file,'utf8');for(const part of sql.split('--> statement-breakpoint').map(x=>x.trim()).filter(Boolean))await db.prepare(part).run();}
await db.prepare("INSERT INTO social_profiles(id,handle,name,status,created_at) VALUES (?,?,?,'approved',?)").bind(ADMIN,'test_reviewer','Test reviewer',new Date().toISOString()).run();
await db.prepare('INSERT INTO social_sessions(hash,user_id,expires) VALUES (?,?,?)').bind(createHash('sha256').update(adminToken).digest('base64url'),ADMIN,Date.now()+600000).run();
const pure=await build({stdin:{contents:"export * from './lib/routing/engine.ts';export * from './lib/social/demo-services.ts';export * from './lib/tourism/knowledge.ts';export * from './lib/tourism/camping.ts';export * from './lib/tourism/assistant.ts';export * from './lib/social/moderation.ts';",resolveDir:process.cwd(),sourcefile:'social-pure.ts'},bundle:true,format:'esm',target:'es2022',write:false,platform:'node'});await writeFile(join(dir,'pure.mjs'),pure.outputFiles[0].text);const data=await import(pathToFileURL(join(dir,'pure.mjs')));
let ip=1;async function api(path,method='GET',body,token,extra={}){const headers={'Origin':'https://ozguraric-wq.github.io','CF-Connecting-IP':`192.0.2.${ip++}`,...(token?{Authorization:'Bearer '+token}:{}),...extra};if(body!==undefined)headers['Content-Type']='application/json';const r=await mf.dispatchFetch('https://community.test/api/community'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});const text=await r.text();let payload;try{payload=JSON.parse(text);}catch{payload=text;}return {status:r.status,data:payload,headers:r.headers};}
let alice,bob,postId,mediaId;
const preferences=data.normalizePreferences({days:1,mode:'car',startMode:'district',interests:['phrygia'],date:'2026-09-12'}),plan=data.generatePlans(preferences).plans[0];
test('guest reads published feed; registration uses real D1 accounts and hashed credentials',async()=>{
 assert.equal((await api('/status')).data.ready,true);assert.equal((await api('/status')).data.providers.google,false);assert.equal((await api('/auth/start','POST',{provider:'google',challenge:'a'.repeat(43),returnKind:'native'})).status,503);
 assert.equal((await api('/posts','POST',{})).status,401);assert.equal((await api('/admin/queue','GET',undefined,undefined,{'oai-authenticated-user-id':ADMIN})).status,403);
 for(const [handle,set] of [['alice_travels',v=>alice=v],['bob_travels',v=>bob=v]]){const r=await api('/auth/register','POST',{handle,name:'Test Gezgin',bio:'Gezi notları',password:'test-long-password-unique',acceptedRules:true});assert.equal(r.status,201,JSON.stringify(r.data));set(r.data.token);const account=await db.prepare('SELECT * FROM social_accounts WHERE subject=?').bind('password:'+handle).first();assert.notEqual(account.password_hash,'test-long-password-unique');assert.ok(account.salt);}
 assert.equal((await api('/auth/login','POST',{handle:'alice_travels',password:'wrong'})).status,401);assert.equal((await api('/auth/login','POST',{handle:'alice_travels',password:'test-long-password-unique'})).status,200);
 const r=await api('/posts','POST',{title:'Frigya ile bir gün',body:'Kayaların izinde güzel bir keşif.',preferences,planId:plan.id,acceptedRules:true},alice);assert.equal(r.status,201,JSON.stringify(r.data));postId=r.data.id;
 assert.equal((await api('/posts')).data.posts.length,0);assert.equal((await api('/posts/'+postId,'GET',undefined,bob)).status,404);assert.equal((await api('/posts/'+postId,'GET',undefined,alice)).data.post.preferences.date,'2026-09-12');
});
test('all public fields are filtered; pending media remains private and stale review is rejected',async()=>{
 assert.equal((await api('/posts','POST',{title:'Tehlikeli metin',body:'Bana example@example.com üzerinden ulaşın',preferences,planId:plan.id,acceptedRules:true},alice)).status,400);
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+yEukAAAAASUVORK5CYII=','base64');
 const up=await mf.dispatchFetch('https://community.test/api/community/posts/'+postId+'/media',{method:'POST',headers:{Authorization:'Bearer '+alice,'Content-Type':'image/png','Content-Length':String(png.length),'X-Media-Caption':encodeURIComponent('Kaya dokusu')},body:png});assert.equal(up.status,201,await up.clone().text());mediaId=(await up.json()).id;
 assert.equal((await api('/media/'+mediaId)).status,404);assert.equal((await api('/media/'+mediaId,'GET',undefined,alice)).status,200);
 const q=await api('/admin/queue','GET',undefined,adminToken),post=q.data.posts.find(p=>p.id===postId);assert.equal(post.revision,2);
 assert.equal((await api('/admin/review','POST',{type:'post',id:postId,revision:1,decision:'approved',reviewedAllMedia:true},adminToken)).status,409);
 assert.equal((await api('/admin/review','POST',{type:'post',id:postId,revision:2,decision:'approved',reviewedAllMedia:false},adminToken)).status,400);
 assert.equal((await api('/admin/review','POST',{type:'post',id:postId,revision:2,decision:'approved',reviewedAllMedia:true},adminToken)).status,200);
 assert.equal((await api('/media/'+mediaId)).status,200);const publicPost=(await api('/posts/'+postId)).data.post;assert.equal(publicPost.preferences.date,'');assert.equal(publicPost.author.name,'Gezgin');assert.equal(publicPost.author.handle,'');
 const bad=Buffer.alloc(40,1),fail=await mf.dispatchFetch('https://community.test/api/community/posts/'+postId+'/media',{method:'POST',headers:{Authorization:'Bearer '+alice,'Content-Type':'image/png','Content-Length':'40'},body:bad});assert.equal(fail.status,415);assert.equal((await db.prepare('SELECT COUNT(*) n FROM social_media WHERE post_id=?').bind(postId).first()).n,1);
});
test('votes are one per user, self-votes are blocked, comments require review, trends use actual activity',async()=>{
 assert.equal((await api('/posts/'+postId+'/vote','PUT',{liked:true,rating:5},alice)).status,400);
 for(let n=0;n<2;n++){const r=await api('/posts/'+postId+'/vote','PUT',{liked:true,rating:4},bob);assert.equal(r.status,200);assert.equal(r.data.post.likes,1);assert.equal(r.data.post.ratingCount,1);}
 const r=await api('/posts/'+postId+'/comments','POST',{body:'Bu tarih rotasını çok sevdim.'},bob);assert.equal(r.status,201);assert.equal((await api('/posts/'+postId+'/comments')).data.comments.length,0);assert.equal((await api('/posts/'+postId+'/comments','GET',undefined,bob)).data.comments.length,1);
 assert.equal((await api('/admin/review','POST',{type:'comment',id:r.data.id,revision:1,decision:'approved',reviewedAllMedia:false},adminToken)).status,200);assert.equal((await api('/posts/'+postId+'/comments')).data.comments.length,1);
 const trends=await api('/trends');assert.ok(trends.data.places.length);assert.equal(trends.data.places[0].likes,1);assert.equal(trends.data.places[0].visitors,0);
 assert.equal((await api('/reports','POST',{targetType:'post',targetId:postId,reason:'misinformation',detail:'Test review'},bob)).status,201);
});
test('42 guides cover every district, 40 homes are fictional, independent requests are private',async()=>{
 assert.equal(data.demoGuides.length,42);assert.equal(data.demoHomes.length,40);assert.equal(new Set(data.demoHomes.map(h=>h.id)).size,40);
 const districts=new Set(data.demoGuides.map(g=>g.district));assert.equal(districts.size,14);for(const d of districts){assert.equal(data.demoGuides.filter(g=>g.district===d).length,3);assert.ok(data.demoHomes.some(h=>h.district===d));}
 assert.ok(data.demoGuides.every(g=>g.demo&&!g.licenseVerified));assert.ok(data.demoHomes.every(h=>h.demo&&!h.permitVerified));
 const date=new Date(Date.now()+86400000).toISOString().slice(0,10),request={kind:'guide',district:'Han',listingId:null,date,time:'10:00',people:2,language:'tr',note:'Özel talep notum',acknowledgedDemo:true};
 const r=await api('/requests','POST',request,alice);assert.equal(r.status,201);assert.equal(r.data.delivered,false);assert.equal((await api('/requests','GET',undefined,bob)).data.requests.length,0);assert.equal((await api('/requests','GET',undefined,alice)).data.requests.length,1);
 const home=data.demoHomes[0];assert.equal((await api('/requests','POST',{...request,kind:'home',listingId:home.id,district:home.district,people:20},alice)).status,400);
 const owner=(await api('/posts/'+postId,'GET',undefined,alice)).data.post;assert.equal((await api('/posts/'+postId,'PUT',{title:'Yeni rota adı',body:'Yeni açıklama',revision:owner.revision},alice)).status,200);assert.equal((await api('/posts/'+postId)).status,404);assert.equal((await api('/media/'+mediaId)).status,404);
});
test('bank covers all districts with source dates, Phrygia search is relevant and camps never imply an unverified stay',()=>{
 assert.ok(data.knowledge.length>149);assert.equal(new Set(data.knowledge.map(e=>e.district).filter(Boolean)).size,14);assert.ok(data.knowledge.every(e=>e.source.startsWith('https://')&&e.checkedAt));
 for(const locale of ['tr','en','de','fr','ar'])assert.ok(data.searchKnowledge(locale==='ar'?'فريجيا':'Phrygia',locale).some(e=>e.category==='phrygia'));
 assert.ok(data.camps.every(c=>!data.campCanBeScheduled(c)));
 for(const input of ['harika bir gün','Yazılıkaya ve Frigya tarihi'])assert.equal(data.screenText(input).ok,true);
 for(const input of ['<script>alert(1)</script>','test@example.com','https://spam.example','siktir git'])assert.equal(data.screenText(input).ok,false);
});
test('AI knowledge answers remain unavailable without a key and reject invented source IDs',async()=>{
 const member=(await api('/me','GET',undefined,bob)).data.profile;
 const req=()=>new Request('https://community.test/api/community/knowledge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Yazılıkaya Midas Anıtı nedir?',locale:'tr'})});
 await assert.rejects(()=>data.answerTourismQuestion(req(),env,{id:member.id,admin:false},()=>{throw Error('provider must not run');}),e=>e.code==='ai_unavailable');
 let context;const fake=async(_,options)=>{context=JSON.parse(options.body);const facts=JSON.parse(context.input[0].content).facts;return new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({message:'Kaynağa göre Frig kaya cephesidir.',sourceIds:[facts[0].id]})}]}]}));};
 const result=await data.answerTourismQuestion(req(),{...env,OPENAI_API_KEY:'unit-test-only'},{id:member.id,admin:false},fake);assert.equal(context.store,false);assert.equal(result.provider,'openai');assert.equal(result.liveData,false);assert.ok(result.sources[0].url.startsWith('https://'));
 await assert.rejects(()=>data.answerTourismQuestion(req(),{...env,OPENAI_API_KEY:'unit-test-only'},{id:member.id,admin:false},async()=>new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({message:'Made up',sourceIds:['invented-source']})}]}]}))),e=>e.code==='ai_unavailable');
});
test('account deletion revokes sessions and removes owned media and related data',async()=>{
 assert.equal((await api('/me','DELETE',{confirm:'DELETE'},alice)).status,200);assert.equal((await api('/me','GET',undefined,alice)).data.profile,null);
 assert.equal((await db.prepare('SELECT COUNT(*) n FROM social_posts WHERE id=?').bind(postId).first()).n,0);assert.equal((await db.prepare('SELECT COUNT(*) n FROM social_media WHERE id=?').bind(mediaId).first()).n,0);
 const bucket=await mf.getR2Bucket('BUCKET');assert.equal((await bucket.list()).objects.length,0);
});
