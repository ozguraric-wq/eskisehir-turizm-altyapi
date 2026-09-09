import {createRemoteJWKSet,jwtVerify} from 'jose';
import {ApiError,type SocialEnv} from './server-contract';
import {digest,randomToken,equal,createProfile,hmac} from './auth';
const googleKeys=createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
export function providers(env:SocialEnv){return {google:!!(env.GOOGLE_CLIENT_ID&&env.GOOGLE_CLIENT_SECRET),facebook:!!(env.FACEBOOK_CLIENT_ID&&env.FACEBOOK_CLIENT_SECRET&&/^v\d+\.\d+$/.test(env.FACEBOOK_GRAPH_VERSION??''))};}
export function apiOrigin(env:SocialEnv,request:Request){const value=env.SOCIAL_PUBLIC_ORIGIN??new URL(request.url).origin;const url=new URL(value);if(url.protocol!=='https:'&&!['localhost','127.0.0.1','terminal.local'].includes(url.hostname))throw new ApiError('service_unavailable',503);return url.origin;}
export async function startOAuth(env:SocialEnv,request:Request,provider:'google'|'facebook',challenge:string,returnKind:'web'|'native'){
 if(!providers(env)[provider])throw new ApiError('provider_unavailable',503);
 if(!/^[A-Za-z0-9_-]{43}$/.test(challenge))throw new ApiError('invalid_request');
 const state=randomToken();await env.DB!.prepare('INSERT INTO social_oauth_states (hash,provider,nonce,verifier,app_challenge,return_kind,expires) VALUES (?,?,?,?,?,?,?)').bind(await digest(state),provider,randomToken(),randomToken(),challenge,returnKind,Date.now()+600000).run();
 return {url:apiOrigin(env,request)+'/api/community/oauth/launch?ticket='+state};
}
export async function launchOAuth(request:Request,env:SocialEnv){
 const token=new URL(request.url).searchParams.get('ticket')??'';if(!/^[A-Za-z0-9_-]{43}$/.test(token))throw new ApiError('invalid_request');
 const state=await env.DB!.prepare('SELECT * FROM social_oauth_states WHERE hash=? AND expires>?').bind(await digest(token),Date.now()).first<Record<string,string>>();if(!state)throw new ApiError('oauth_expired');
 const callback=apiOrigin(env,request)+'/api/community/oauth/callback';const google=state.provider==='google';
 const u=new URL(google?'https://accounts.google.com/o/oauth2/v2/auth':`https://www.facebook.com/${env.FACEBOOK_GRAPH_VERSION}/dialog/oauth`);
 u.searchParams.set('client_id',google?env.GOOGLE_CLIENT_ID!:env.FACEBOOK_CLIENT_ID!);u.searchParams.set('redirect_uri',callback);u.searchParams.set('response_type','code');u.searchParams.set('state',token);u.searchParams.set('scope',google?'openid profile email':'public_profile');
 if(google){u.searchParams.set('nonce',state.nonce);u.searchParams.set('code_challenge',await digest(state.verifier));u.searchParams.set('code_challenge_method','S256');}
 return new Response(null,{status:302,headers:{location:u.toString(),'cache-control':'no-store','referrer-policy':'no-referrer','set-cookie':`etahb_oauth=${token}; Path=/api/community/oauth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`}});
}
export async function finishOAuth(request:Request,env:SocialEnv,fetcher:typeof fetch=fetch){
 const u=new URL(request.url),stateToken=u.searchParams.get('state')??'',code=u.searchParams.get('code')??'',browser=request.headers.get('cookie')?.match(/(?:^|;\s*)etahb_oauth=([A-Za-z0-9_-]{43})(?:;|$)/)?.[1]??'';
 if(!/^[A-Za-z0-9_-]{43}$/.test(stateToken)||!equal(stateToken,browser)||!code||code.length>4000)throw new ApiError('oauth_cancelled');
 const state=await env.DB!.prepare('DELETE FROM social_oauth_states WHERE hash=? AND expires>? RETURNING *').bind(await digest(stateToken),Date.now()).first<Record<string,string>>();if(!state)throw new ApiError('oauth_expired');
 const callback=apiOrigin(env,request)+'/api/community/oauth/callback',google=state.provider==='google';
 const endpoint=google?'https://oauth2.googleapis.com/token':`https://graph.facebook.com/${env.FACEBOOK_GRAPH_VERSION}/oauth/access_token`;
 const params=new URLSearchParams({client_id:google?env.GOOGLE_CLIENT_ID!:env.FACEBOOK_CLIENT_ID!,client_secret:google?env.GOOGLE_CLIENT_SECRET!:env.FACEBOOK_CLIENT_SECRET!,redirect_uri:callback,code});if(google){params.set('grant_type','authorization_code');params.set('code_verifier',state.verifier);}
 const response=await fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:params,signal:AbortSignal.timeout(15000)});if(!response.ok)throw new ApiError('oauth_failed',401);
 const token=await response.json() as {id_token?:string;access_token?:string};let subject='',name='Gezgin';
 if(google){if(!token.id_token)throw new ApiError('oauth_failed',401);const {payload}=await jwtVerify(token.id_token,googleKeys,{issuer:['https://accounts.google.com','accounts.google.com'],audience:env.GOOGLE_CLIENT_ID,algorithms:['RS256']});if(payload.nonce!==state.nonce||typeof payload.sub!=='string')throw new ApiError('oauth_failed',401);subject=payload.sub;name=typeof payload.name==='string'?payload.name:name;}
 else {
  if(!token.access_token)throw new ApiError('oauth_failed',401);
  const url=new URL(`https://graph.facebook.com/${env.FACEBOOK_GRAPH_VERSION}/me`);url.searchParams.set('fields','id,name');url.searchParams.set('appsecret_proof',await facebookProof(token.access_token,env.FACEBOOK_CLIENT_SECRET!));
  const me=await fetcher(url,{headers:{Authorization:'Bearer '+token.access_token},signal:AbortSignal.timeout(12000)});if(!me.ok)throw new ApiError('oauth_failed',401);const data=await me.json() as {id?:string;name?:string};if(!data.id)throw new ApiError('oauth_failed',401);subject=data.id;name=data.name??name;
 }
 // Provider subject is the key. Email addresses never silently link two accounts.
 const key=state.provider+':'+subject;let account=await env.DB!.prepare('SELECT user_id FROM social_accounts WHERE subject=?').bind(key).first<{user_id:string}>();
 if(!account){const userId=await createProfile(env.DB!,'gezgin_'+crypto.randomUUID().replaceAll('-','').slice(0,12),name.replace(/[<>\u0000-\u001f]/g,'').slice(0,60)||'Gezgin','',state.provider,key);account={user_id:userId};}
 const handoff=randomToken();await env.DB!.prepare('INSERT INTO social_handoffs (hash,user_id,challenge,expires) VALUES (?,?,?,?)').bind(await digest(handoff),account.user_id,state.app_challenge,Date.now()+120000).run();
 const webOrigin=new URL(env.SOCIAL_WEB_ORIGIN??'https://ozguraric-wq.github.io/eskisehir-turizm-altyapi/');
 if(webOrigin.protocol!=='https:')throw new ApiError('service_unavailable',503);
 const target=state.return_kind==='native'?`etahb://auth?code=${handoff}`:webOrigin.toString().replace(/\/$/,'')+`/profil/#auth=${handoff}`;
 const escaped=target.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
 return new Response(`<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Eskişehir Cebimde</title><style>body{font:17px system-ui;background:#f8f9fb;color:#18232b;padding:12vh 24px;max-width:460px;margin:auto;line-height:1.6}a{display:block;background:#81112b;color:white;text-align:center;text-decoration:none;padding:16px;border-radius:14px}p{color:#52616c}</style><h1>Giriş tamamlandı.</h1><p>Eskişehir Cebimde uygulamasına dönerek devam edebilirsiniz.</p><a href="${escaped}">Uygulamaya dön</a></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",'Set-Cookie':'etahb_oauth=; Path=/api/community/oauth; HttpOnly; Secure; SameSite=Lax; Max-Age=0'}});
}
async function facebookProof(token:string,secret:string){const encoded=await hmac(token,secret);return [...Uint8Array.from(atob(encoded.replace(/-/g,'+').replace(/_/g,'/')),x=>x.charCodeAt(0))].map(n=>n.toString(16).padStart(2,'0')).join('');}
