import assert from "node:assert/strict";
import test,{after} from "node:test";
import {readFile,writeFile,mkdir,readdir,mkdtemp,rm} from "node:fs/promises";
import {join,resolve} from "node:path";
import {pathToFileURL} from "node:url";
import ts from "typescript";
import QRCode from "qrcode";
import pngjs from "pngjs";

await mkdir("work",{recursive:true});const dir=await mkdtemp(resolve("work/qr-tests-"));
for(const folder of ["routing","mobile","qr"]){await mkdir(join(dir,folder));for(const file of await readdir(`lib/${folder}`)){if(!file.endsWith('.ts'))continue;const source=await readFile(`lib/${folder}/${file}`,'utf8');const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText.replace(/(from\s+["'])(\.[^"']+)(["'])/g,"$1$2.mjs$3");await writeFile(join(dir,folder,file.replace(/\.ts$/,'.mjs')),js);}}
after(()=>rm(dir,{recursive:true,force:true}));
const {qrRegistry,qrByCode}=await import(pathToFileURL(join(dir,'qr/registry.mjs')));
const {parseQrInput,qrUrl,planQrUrl,qrPreferences,nativeQrUrl}=await import(pathToFileURL(join(dir,'qr/links.mjs')));
const {defaults,normalizePreferences,generatePlans}=await import(pathToFileURL(join(dir,'routing/engine.mjs')));
const {places,themes,placeById,CATALOG_VERSION}=await import(pathToFileURL(join(dir,'routing/data.mjs')));
const {decodeQrPixels}=await import(pathToFileURL(join(dir,'qr/scan.mjs')));
const {qrCopy}=await import(pathToFileURL(join(dir,'qr/copy.mjs')));
const {readQrHistory,rememberQr,QR_HISTORY_KEY}=await import(pathToFileURL(join(dir,'qr/history.mjs')));
test('permanent QR identities cover the sourced catalogue and all 14 districts',()=>{
 assert.equal(qrRegistry.length,places.length+themes.length);assert.equal(new Set(qrRegistry.map(q=>q.code)).size,90);assert.equal(qrByCode['E-0022'].id,'midas');assert.equal(qrByCode['R-0002'].id,'phrygia');
 assert.equal(new Set(qrRegistry.filter(q=>q.kind==='place').map(q=>placeById[q.id].district)).size,14);
 for(const q of qrRegistry){assert.ok((q.kind==='place'?places:themes).some(item=>item.id===q.id));assert.equal(parseQrInput(qrUrl(q.code)).entry.code,q.code);}
});
test('unsafe, ambiguous, oversized and unknown QR input never navigates externally',()=>{
 for(const value of ['javascript:alert(1)','https://evil.example/qr/#code=E-0022','https://ozguraric-wq.github.io/another-repo/qr/#code=E-0022','https://ozguraric-wq.github.io.evil.example/eskisehir-turizm-altyapi/qr/#code=E-0022','E-9999','R-9999','A'.repeat(2500),qrUrl('E-0022')+'&code=E-0001',qrUrl('E-0022')+'&redirect=https://evil.example'])assert.equal(parseQrInput(value),null,value);
 assert.equal(parseQrInput(' e 0022 ').entry.id,'midas');const target=parseQrInput(qrUrl('E-0022'));assert.deepEqual(parseQrInput(nativeQrUrl(target)),target);
});
test('shared trip QR round-trips every preference and keeps the exact plan identity',()=>{
 const p=normalizePreferences({...defaults,days:2,mode:'motorcycle',date:'2026-09-12',required:['midas'],interests:['phrygia','heritage'],meal:'vegetarian'});const plan=generatePlans(p).plans[0];assert.ok(plan);
 const url=planQrUrl(p,plan.id),target=parseQrInput(url);assert.equal(target.kind,'plan');assert.deepEqual(target.preferences,p);assert.equal(target.planId,plan.id);assert.ok(generatePlans(target.preferences).plans.some(p=>p.id===target.planId));
 const encode=object=>'https://ozguraric-wq.github.io/eskisehir-turizm-altyapi/qr/#trip='+Buffer.from(JSON.stringify(object)).toString('base64url');
 assert.equal(parseQrInput(encode({v:2,catalog:CATALOG_VERSION,p:{},plan:'id'})),null);assert.equal(parseQrInput(encode({v:1,catalog:'future',p:{},plan:'id'})),null);assert.equal(parseQrInput(encode({v:1,catalog:CATALOG_VERSION,p:{required:['invented']},plan:'id'})),null);assert.equal(parseQrInput(encode({v:1,catalog:CATALOG_VERSION,p:{redirect:'https://evil.example'},plan:'id'})),null);
});
test('generated QR pixels decode to the original links using the scanner engine',async()=>{
 const p=normalizePreferences({...defaults,required:['midas']}),plan=generatePlans(p).plans[0];
 for(const value of [...qrRegistry.map(q=>qrUrl(q.code)),planQrUrl(p,plan.id)]){
  const png=pngjs.PNG.sync.read(await QRCode.toBuffer(value,{width:720,margin:4,errorCorrectionLevel:value.length>900?'M':'Q'}));
  assert.equal(decodeQrPixels(new Uint8ClampedArray(png.data),png.width,png.height),value);
 }
});
test('themed QR routes enforce their listed stops and expose infeasible requests',()=>{
 const unavailable=[];for(const q of qrRegistry.filter(q=>q.kind==='theme')){const p=qrPreferences(q),result=generatePlans(p);if(!result.plans.length)unavailable.push({id:q.id,days:[1,2,3,4].filter(days=>generatePlans({...p,days}).plans.length)});else assert.ok(result.plans.every(plan=>p.required.every(id=>plan.days.some(d=>d.placeIds.includes(id)))));}
 assert.deepEqual(unavailable,[],'Themes needing duration adjustment');
});
test('guide history is local, bounded and clearable; every interface key is translated',()=>{
 const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
 for(const q of qrRegistry.slice(0,16))rememberQr(q.code);assert.equal(readQrHistory().length,12);rememberQr('E-0022');rememberQr('unknown');assert.equal(readQrHistory()[0],'E-0022');storage.set(QR_HISTORY_KEY,'[]');assert.deepEqual(readQrHistory(),[]);delete globalThis.localStorage;
 for(const locale of ['tr','en','de','fr','ar'])assert.ok(Object.values(qrCopy(locale)).every(s=>typeof s==='string'&&s.length>0));
});
