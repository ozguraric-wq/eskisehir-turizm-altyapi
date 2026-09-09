import {ApiError,type SocialEnv,type Identity,type Database,nowIso} from './server-contract';
const encoder=new TextEncoder();
export const base64url=(bytes:Uint8Array)=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
export const randomToken=()=>base64url(crypto.getRandomValues(new Uint8Array(32)));
export async function digest(text:string){return base64url(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(text))));}
export async function hmac(text:string,secret:string){const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return base64url(new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode(text))));}
export const equal=(a:string,b:string)=>{let d=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)d|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return d===0;};
export async function passwordHash(password:string,salt:string){const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);return base64url(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:encoder.encode(salt),iterations:100000},key,256)));}
export function configured(env:SocialEnv){return !!(env.DB&&env.SOCIAL_SESSION_SECRET&&env.SOCIAL_SESSION_SECRET.length>=32);}
export async function consume(db:Database,key:string,bucket:number,limit:number){const r=await db.prepare('INSERT INTO ai_usage (key,bucket,count) VALUES (?,?,1) ON CONFLICT(key,bucket) DO UPDATE SET count=count+1 WHERE count<? RETURNING count').bind(key,bucket,limit).first();if(!r)throw new ApiError('rate_limited',429);}
export async function requestLimit(request:Request,env:SocialEnv,scope:string,limit:number,window=60){const ip=request.headers.get('cf-connecting-ip')??'unknown';await consume(env.DB!,'social:'+scope+':'+await hmac(ip,env.SOCIAL_SESSION_SECRET!),Math.floor(Date.now()/1000/window),limit);}
export async function userLimit(env:SocialEnv,userId:string,scope:string,limit:number){await consume(env.DB!,'social:'+scope+':'+userId,Math.floor(Date.now()/86400000),limit);}
export async function newSession(db:Database,userId:string){const token=randomToken(),expires=Date.now()+7*86400000;await db.prepare('INSERT INTO social_sessions (hash,user_id,expires) VALUES (?,?,?)').bind(await digest(token),userId,expires).run();return {token,expires};}
export function cookie(token:string,maxAge=604800){return `etahb_social=${token}; Path=/api/community; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;}
export async function identify(request:Request,env:SocialEnv,platform:'sites'|'standalone'):Promise<Identity|null>{
 const bearer=request.headers.get('authorization')?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1],stored=request.headers.get('cookie')?.match(/(?:^|;\s*)etahb_social=([A-Za-z0-9_-]{43})(?:;|$)/)?.[1],token=bearer??stored;
 const admins=new Set((env.SOCIAL_ADMIN_IDS??'').split(',').map(x=>x.trim()).filter(Boolean));
 // Only the Sites dispatcher supplies this trusted identity; standalone Workers ignore these headers.
 const platformId=platform==='sites'?request.headers.get('oai-authenticated-user-id'):null;
 const platformEmail=platform==='sites'?request.headers.get('oai-authenticated-user-email')?.toLowerCase():null;
 const adminEmails=new Set((env.SOCIAL_ADMIN_EMAILS??'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean));
 const platformAdmin=!!platformId&&(admins.has('sites:'+platformId)||!!platformEmail&&adminEmails.has(platformEmail));
 if(token){const hash=await digest(token),r=await env.DB!.prepare('SELECT user_id FROM social_sessions WHERE hash=? AND expires>?').bind(hash,Date.now()).first<{user_id:string}>();if(r)return {id:r.user_id,tokenHash:hash,admin:admins.has(r.user_id)||platformAdmin};}
 if(platformAdmin)return {id:'sites:'+platformId,admin:true};
 return null;
}
export async function createProfile(db:Database,handle:string,name:string,bio:string,provider:string,subject:string,password?:string){const id=crypto.randomUUID(),salt=password?randomToken():null,hash=password?await passwordHash(password,salt!):null;
 try{await db.batch([db.prepare('INSERT INTO social_profiles (id,handle,name,bio,status,revision,created_at) VALUES (?,?,?,?,\'pending\',1,?)').bind(id,handle,name,bio,nowIso()),db.prepare('INSERT INTO social_accounts (id,user_id,provider,subject,password_hash,salt) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),id,provider,subject,hash,salt)]);}catch(e){if(String(e).includes('UNIQUE'))throw new ApiError('handle_taken',409);throw e;}return id;
}
