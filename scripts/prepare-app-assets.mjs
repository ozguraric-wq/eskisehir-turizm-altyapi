import { readFile,writeFile,readdir,cp,mkdir,rm } from "node:fs/promises";
import { join,resolve } from "node:path";
const native=process.argv[2]==="native";
const root=resolve("out");
const base=native?"":"/eskisehir-turizm-altyapi";
const manifest={id:`${base}/`,name:"Eskişehir Cebimde",short_name:"Eskişehir Cebimde",description:"Eskişehir’de rotalar, QR keşif ve etkinlikler.",start_url:`${base}/?app=1`,scope:`${base}/`,display:"standalone",background_color:"#ffffff",theme_color:"#790d28",lang:"tr",icons:[{src:`${base}/brand/app-192.png`,sizes:"192x192",type:"image/png",purpose:"any"},{src:`${base}/brand/app-512.png`,sizes:"512x512",type:"image/png",purpose:"any"}]};
await writeFile(join(root,"manifest.webmanifest"),JSON.stringify(manifest));
if(process.env.NEXT_PUBLIC_AI_BASE_URL){const u=new URL(process.env.NEXT_PUBLIC_AI_BASE_URL);if(u.protocol!=="https:"||u.pathname!=="/"||u.username||u.password||u.search||u.hash)throw Error("AI base must be an HTTPS origin");await writeFile(join(root,"mobile-config.json"),JSON.stringify({apiBaseUrl:u.origin}));}
if(native){
  const auth=await readFile(join(root,"auth.js"),"utf8");
  if(!auth.includes('const BASE_PATH = "/eskisehir-turizm-altyapi";'))throw Error("Unexpected auth asset");
  await writeFile(join(root,"auth.js"),auth.replace('const BASE_PATH = "/eskisehir-turizm-altyapi";','const BASE_PATH = "";'));
  const destination=resolve("mobile/www");
  if(!destination.endsWith("/mobile/www"))throw Error("Unexpected app destination");
  await mkdir(resolve("mobile"),{recursive:true});
  await rm(destination,{recursive:true,force:true});await cp(root,destination,{recursive:true});
  // Capacitor resolves the bundled document for each exported Next.js route.
  console.log("Native app assets prepared in mobile/www");
}else{
  // Cache the exported app shell, pages and assets. API/auth session responses are never cached.
  async function files(dir,prefix=""){const out=[];for(const entry of await readdir(dir,{withFileTypes:true})){const rel=join(prefix,entry.name);if(entry.isDirectory())out.push(...await files(join(dir,entry.name),rel));else if(/\.(html|js|css|txt|webp|png|svg|woff2?|webmanifest)$/.test(rel)&&!rel.includes("sw.js"))out.push(rel);}return out;}
  const all=await files(root);const urls=all.map(f=>`${base}/${f.replaceAll("\\","/")}`);
  const revision="etahb-app-"+(await import("node:crypto")).createHash("sha256").update(urls.join("|")+(await readFile(join(root,"index.html"),"utf8"))).digest("hex").slice(0,12);
  const sw=`const CACHE=${JSON.stringify(revision)},ROOT=${JSON.stringify(base+"/")},FILES=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);for(let i=0;i<FILES.length;i+=12){await Promise.all(FILES.slice(i,i+12).map(async url=>{try{const r=await fetch(url,{cache:'reload'});if(r.ok)await cache.put(url,r);}catch{}}));}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('etahb-app-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(ROOT)||u.pathname.includes('/api/')||u.pathname.endsWith('mobile-config.json'))return;
 if(event.request.mode==='navigate'){event.respondWith((async()=>{try{return await fetch(event.request);}catch{const cache=await caches.open(CACHE);const path=u.pathname.endsWith('/')?u.pathname+'index.html':u.pathname.endsWith('.html')?u.pathname:u.pathname+'/index.html';return await cache.match(path)||await cache.match(ROOT+'index.html')||Response.error();}})());}
 else if(FILES.includes(u.pathname)){event.respondWith((async()=>{const cached=await caches.match(u.pathname);return cached||fetch(event.request);})());}
});`;
  await writeFile(join(root,"sw.js"),sw);console.log("Installable app assets prepared");
}
