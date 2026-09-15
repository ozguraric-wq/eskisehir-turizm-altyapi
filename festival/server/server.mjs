import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {randomBytes,createCipheriv,createDecipheriv,createHmac,scryptSync,timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {freshApplication,validateApplication,slotLabels} from '../lib/festival/domain.ts';
import {applyAction,redactApplicant,redactReviewer} from '../lib/festival/actions.ts';

class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
const safe=(v,max=500)=>typeof v==='string'?v.trim().slice(0,max):'';
export function createFestivalServer(options={}){
 const dataDir=resolve(options.dataDir||process.env.DATA_DIR||'./data');mkdirSync(dataDir,{recursive:true,mode:0o700});
 const key=Buffer.from(options.encryptionKey||process.env.EGFF_ENCRYPTION_KEY||'','base64');
 if(key.length!==32)throw Error('EGFF_ENCRYPTION_KEY must be a base64-encoded 32-byte secret.');
 const allowed=new Set(options.origins||String(process.env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean));
 if(!allowed.size)throw Error('ALLOWED_ORIGINS must name the approved frontend origins.');
 const users=options.users||JSON.parse(readFileSync(process.env.STAFF_USERS_FILE||resolve(dataDir,'staff-users.json'),'utf8'));
 if(!Array.isArray(users)||!users.some(u=>u.role==='admin'))throw Error('At least one configured admin account is required.');
 const db=new DatabaseSync(resolve(dataDir,'festival.sqlite'));db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
 db.exec(`CREATE TABLE IF NOT EXISTS applications(id TEXT PRIMARY KEY,email_hash TEXT NOT NULL,code_hash TEXT NOT NULL UNIQUE,fingerprint TEXT UNIQUE,data TEXT NOT NULL);CREATE TABLE IF NOT EXISTS attachments(app_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,slot TEXT NOT NULL,data TEXT NOT NULL,PRIMARY KEY(app_id,slot));CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY,data TEXT NOT NULL);`);
 const hash=v=>createHmac('sha256',key).update(v).digest('hex');
 function encrypt(value){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);const encrypted=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64');}
 function decrypt(value){const b=Buffer.from(value,'base64'),d=createDecipheriv('aes-256-gcm',key,b.subarray(0,12));d.setAuthTag(b.subarray(12,28));return JSON.parse(Buffer.concat([d.update(b.subarray(28)),d.final()]).toString('utf8'));}
 const meta=(k,fallback)=>{const row=db.prepare('SELECT data FROM metadata WHERE key=?').get(k);return row?decrypt(row.data):fallback;};
 const putMeta=(k,v)=>db.prepare('INSERT INTO metadata(key,data) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET data=excluded.data').run(k,encrypt(v));
 const allApps=()=>db.prepare('SELECT data FROM applications').all().map(r=>decrypt(r.data));
 function one(id,files=false){const row=db.prepare('SELECT data FROM applications WHERE id=?').get(id);if(!row)throw new HttpError(404,'Başvuru bulunamadı.');const a=decrypt(row.data);if(files){const rows=db.prepare('SELECT slot,data FROM attachments WHERE app_id=?').all(id);a.files=a.files.map(f=>({...f,data:decrypt(rows.find(r=>r.slot===f.slot)?.data||'')}));}return a;}
 function saveMeta(a){db.prepare('UPDATE applications SET data=? WHERE id=?').run(encrypt({...a,files:a.files.map(f=>({...f,data:''}))}),a.id);}
 function saveAttachments(a){db.prepare('DELETE FROM attachments WHERE app_id=?').run(a.id);for(const f of a.files)db.prepare('INSERT INTO attachments(app_id,slot,data) VALUES(?,?,?)').run(a.id,f.slot,encrypt(f.data));}
 const state=()=>({version:1,applications:allApps(),events:meta('events',[]),reservations:[],selections:meta('selections',{youth:[],local:[]}),updatedAt:new Date().toISOString()});
 function tx(fn){db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}}
 const sessions=new Map(),rates=new Map();
 const timer=setInterval(()=>{const now=Date.now();for(const [k,v]of rates)if(v.until<now)rates.delete(k);for(const[k,v]of sessions)if(v.expires<now)sessions.delete(k);},60000);timer.unref();
 function rate(ip,group,max,window=900000){const k=ip+':'+group;const now=Date.now();let item=rates.get(k);if(!item||item.until<now){item={count:0,until:now+window};rates.set(k,item);}item.count++;if(item.count>max)throw new HttpError(429,'Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.');}
 function authenticate(req){const token=req.headers.authorization?.replace(/^Bearer /,'');const s=token?sessions.get(token):null;if(!s||s.expires<Date.now())throw new HttpError(401,'Oturum açmanız gerekiyor.');return s.actor;}
 async function readJSON(req){let bytes=0;const parts=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>30*1024*1024)throw new HttpError(413,'Başvuru dosyaları çok büyük.');parts.push(chunk);}try{const b=JSON.parse(Buffer.concat(parts).toString('utf8')||'{}');if(!b||typeof b!=='object'||Array.isArray(b))throw Error();return b;}catch{throw new HttpError(400,'Geçerli bir başvuru isteği gerekli.');}}
 function files(raw){if(!Array.isArray(raw)||raw.length>8)throw new HttpError(400,'Belge listesi geçersiz.');const slots=new Set();let size=0;return raw.map(f=>{if(!f||!Object.hasOwn(slotLabels,f.slot)||slots.has(f.slot))throw new HttpError(400,'Belge türü geçersiz veya tekrarlı.');slots.add(f.slot);const type=safe(f.type,80);if(!['application/pdf','image/jpeg','image/png','image/webp'].includes(type))throw new HttpError(400,'Yalnız PDF, JPG, PNG ve WebP dosyaları kullanılabilir.');if(typeof f.data!=='string'||!f.data.startsWith('data:'+type+';base64,'))throw new HttpError(400,'Dosya içeriği geçersiz.');const b64=f.data.slice(f.data.indexOf(',')+1);if(!/^[A-Za-z0-9+/]*={0,2}$/.test(b64))throw new HttpError(400,'Dosya kodlaması geçersiz.');const bytes=Buffer.from(b64,'base64');size+=bytes.length;if(bytes.length===0||bytes.length>5*1024*1024||size>20*1024*1024)throw new HttpError(400,'Dosya boyutu sınırı aşıldı.');const signature=type==='application/pdf'?bytes.subarray(0,5).toString()==='%PDF-':type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:type==='image/png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP';if(!signature)throw new HttpError(400,'Dosya içeriği belirtilen türle eşleşmiyor.');if(['poster','portrait','still1','still2','still3'].includes(f.slot)&&type==='application/pdf')throw new HttpError(400,'Görsel alanına PDF eklenemez.');return {slot:f.slot,name:safe(f.name,160).replace(/[\\/\x00-\x1F]/g,'_'),type,size:bytes.length,data:'data:'+type+';base64,'+bytes.toString('base64')};});}
 function clean(raw){const a=freshApplication();for(const k of ['kind','name','email','phone','title','category','completed','school','city','locations','short','synopsis','bio','note','watchUrl','watchPassword','choice','date'])a[k]=safe(raw[k],['short','synopsis','bio','note'].includes(k)?10000:k==='watchUrl'?2000:500);a.email=a.email.toLowerCase();for(const k of ['rights','consent','thirdParty','localFilm'])a[k]=raw[k]===true;a.duration=Number(raw.duration);if(!Array.isArray(raw.directors)||raw.directors.length>6)throw new HttpError(400,'Yönetmen bilgileri geçersiz.');a.directors=raw.directors.map(d=>({name:safe(d?.name,160),dob:safe(d?.dob,10),citizen:d?.citizen===true}));a.files=files(raw.files||[]);a.demo=false;const errors=validateApplication(a);if(errors.length)throw new HttpError(400,errors.join(' '));return a;}
 const openAt=Date.parse(options.openAt||process.env.APPLICATIONS_OPEN_AT||'2026-12-01T00:00:00+03:00');
 const closeAt=Date.parse(options.closeAt||process.env.APPLICATIONS_CLOSE_AT||'2027-03-31T23:59:59+03:00');
 function findApplicant(email,code,includeFiles=true){const row=db.prepare('SELECT id FROM applications WHERE email_hash=? AND code_hash=?').get(hash(safe(email).toLowerCase()),hash(safe(code)));if(!row)throw new HttpError(404,'E-posta ve takip koduyla eşleşen başvuru bulunamadı.');return one(row.id,includeFiles);}
 const server=createServer(async(req,res)=>{
  const origin=req.headers.origin;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Vary','Origin');
  const send=(status,body)=>{res.writeHead(status);res.end(JSON.stringify(body));};
  try{
   if(origin&&!allowed.has(origin))throw new HttpError(403,'Bu web sitesi için erişim izni yok.');
   if(origin)res.setHeader('Access-Control-Allow-Origin',origin);
   res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
   if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
   const path=new URL(req.url,'http://localhost').pathname;const ip=req.socket.remoteAddress||'unknown';
   if(req.method==='GET'&&path==='/health'){send(200,{ok:true,mode:'live'});return;}
   if(req.method==='GET'&&path==='/public'){send(200,{events:meta('events',[]).filter(e=>e.published&&!e.demo),films:[],selections:{youth:[],local:[]}});return;}
   if(req.method==='POST'&&path==='/staff/login'){
    rate(ip,'login',8);const b=await readJSON(req),u=users.find(u=>u.username===safe(b.username,80));const salt=u?.salt||'invalid-user-dummy-salt';const calculated=scryptSync(safe(b.password,1000),salt,64);const expected=Buffer.from(u?.hash||'00'.repeat(64),'hex');if(!u||expected.length!==64||!timingSafeEqual(calculated,expected))throw new HttpError(401,'Kullanıcı adı veya parola hatalı.');const actor={id:u.username,role:u.role};const token=randomBytes(32).toString('base64url');sessions.set(token,{actor,expires:Date.now()+3600000});send(200,{token,actor});return;
   }
   if(path.startsWith('/staff/')){
    const actor=authenticate(req);
    if(path==='/staff/logout'&&req.method==='POST'){sessions.delete(req.headers.authorization.replace(/^Bearer /,''));send(200,{ok:true});return;}
    if(path==='/staff/state'&&req.method==='GET'){const s=state();if(actor.role==='reviewer'){s.applications=s.applications.filter(a=>a.assigned.includes(actor.id)).map(a=>redactReviewer(a,actor.id));s.events=[];s.selections={youth:[],local:[]};}send(200,s);return;}
    const b=await readJSON(req);
    if(path==='/staff/detail'&&req.method==='POST'){const a=one(safe(b.id),true);if(actor.role==='reviewer'&&!a.assigned.includes(actor.id))throw new HttpError(403,'Bu film size atanmamış.');send(200,actor.role==='reviewer'?redactReviewer(a,actor.id):a);return;}
    if(path==='/staff/action'&&req.method==='POST'){
     const payload=b.payload||{};if(b.action==='assign'&&!users.some(u=>u.username===payload.reviewer&&u.role==='reviewer'))throw new HttpError(400,'Atanabilir jüri hesabı bulunamadı.');
     if(b.action==='event'&&payload.event){payload.event.demo=false;payload.event.published=payload.event.published===true;}
     payload.holidays=String(process.env.OFFICIAL_HOLIDAYS||'').split(',').filter(Boolean);
     tx(()=>{const s=state();applyAction(s,b.action,payload,actor);if(payload.id){const a=s.applications.find(a=>a.id===payload.id);if(a)saveMeta(a);}if(b.action==='event')putMeta('events',s.events);if(b.action==='selections')putMeta('selections',s.selections);});send(200,{ok:true});return;
    }
    throw new HttpError(404,'İşlem bulunamadı.');
   }
   if(req.method==='POST'&&path==='/applications'){
    rate(ip,'submit',15,3600000);const b=await readJSON(req);
    if(b.kind==='film'&&(Date.now()<openAt||Date.now()>closeAt))throw new HttpError(409,'Film başvuru dönemi şu anda açık değil.');
    if(b.kind!=='film'&&!(options.registrationsEnabled||process.env.REGISTRATIONS_ENABLED==='true'))throw new HttpError(409,'Katılım kayıtları henüz açılmadı.');
    const a=clean(b),now=new Date().toISOString();a.id=randomBytes(16).toString('hex');a.code='EGFF-'+randomBytes(24).toString('base64url');a.createdAt=now;a.updatedAt=now;a.history=[{at:now,text:'Başvuru alındı. Uygunluk kontrolü bekleniyor.',actor:'Başvuru sahibi'}];const fingerprint=a.kind==='film'?hash(a.title.toLocaleLowerCase('tr')+'|'+a.directors.map(d=>d.name.toLocaleLowerCase('tr')).sort().join('|')):null;
    tx(()=>{if(fingerprint&&db.prepare('SELECT id FROM applications WHERE fingerprint=?').get(fingerprint))throw new HttpError(409,'Bu film için bir başvuru zaten var. Takip ekranını kullanın.');db.prepare('INSERT INTO applications(id,email_hash,code_hash,fingerprint,data) VALUES(?,?,?,?,?)').run(a.id,hash(a.email),hash(a.code),fingerprint,encrypt({...a,files:a.files.map(f=>({...f,data:''}))}));saveAttachments(a);});send(201,redactApplicant(a));return;
   }
   if(req.method==='POST'&&path==='/track'){rate(ip,'track',30);const b=await readJSON(req);send(200,redactApplicant(findApplicant(b.email,b.code)));return;}
   if(req.method==='POST'&&path==='/correction'){
    rate(ip,'correction',15);const b=await readJSON(req);const result=tx(()=>{const a=one(safe(b.id),true);if(!timingSafeEqual(Buffer.from(hash(safe(b.code)),'hex'),Buffer.from(hash(a.code),'hex')))throw new HttpError(403,'Takip kodu hatalı.');if(a.status!=='correction'||!a.dueAt||Date.parse(a.dueAt)<Date.now())throw new HttpError(409,'Başvuru düzeltmeye açık değil veya düzeltme süresi doldu.');const patch=b.patch||{};for(const k of ['short','synopsis','bio','note','watchUrl','watchPassword'])if(patch[k]!==undefined)a[k]=safe(patch[k],10000);if(patch.files!==undefined)a.files=files(patch.files);const errors=validateApplication(a);if(errors.length)throw new HttpError(400,errors.join(' '));a.status='received';a.dueAt=undefined;a.updatedAt=new Date().toISOString();a.history.push({at:a.updatedAt,text:'Düzeltmeler gönderildi; yeniden kontrol bekleniyor.',actor:'Başvuru sahibi'});saveMeta(a);saveAttachments(a);return redactApplicant(a);});send(200,result);return;
   }
   throw new HttpError(404,'İşlem bulunamadı.');
  }catch(e){const status=e.status||400;send(status,{error:status>=500?'Başvuru hizmeti şu anda yanıt veremiyor.':e.message||'İşlem tamamlanamadı.'});}
 });
 server.requestTimeout=30000;server.headersTimeout=15000;server.on('close',()=>{clearInterval(timer);db.close();});return server;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const server=createFestivalServer();server.listen(Number(process.env.PORT||8787),process.env.HOST||'0.0.0.0',()=>console.log('Festival application service is ready.'));}
