import {demoRoutes,demoComments,demoEnabled,isSeedUser,isDemoUser,kitItems} from './demo';
import {ApiError,type SocialEnv,type Identity,readJson,nowIso} from './server-contract';
import {requestLimit,newSession} from './auth';
import {placeById} from '../routing/data';
import {z} from 'zod';

// Idempotent curated content import. Migrations stay schema-only. A failed batch is retryable.
export async function ensureDemoContent(env:SocialEnv){
 if(!demoEnabled(env))return;
 if(await env.DB!.prepare('SELECT id FROM social_demo_seeds WHERE id=?').bind('community-v1').first())return;
 const db=env.DB!,statements=demoRoutes.flatMap(r=>[
  db.prepare("INSERT OR IGNORE INTO social_profiles(id,handle,name,public_name,bio,status,created_at) VALUES (?,?,?,?,'','approved',?)").bind(r.userId,'demo_bot_'+r.id.slice(-2),r.name,r.name,r.createdAt),
  db.prepare("INSERT OR IGNORE INTO social_posts(id,user_id,title,body,preferences,place_ids,districts,mode,days,status,ai_state,created_at) VALUES (?,?,?,?,?,?,?,?,?,'approved','curated-demo',?)").bind(r.id,r.userId,r.title,r.body,JSON.stringify(r.preferences),JSON.stringify(r.placeIds),JSON.stringify(r.districts),r.mode,r.days,r.createdAt)
 ]);
 await db.batch(statements);
 await db.batch([...demoComments.map(c=>db.prepare("INSERT OR IGNORE INTO social_comments(id,post_id,user_id,body,status,created_at) VALUES (?,?,?,?,'approved',?)").bind(c.id,c.postId,c.userId,c.body,c.createdAt)),db.prepare('INSERT OR IGNORE INTO social_demo_seeds(id) VALUES (?)').bind('community-v1')]);
}
export async function startDemo(request:Request,env:SocialEnv,identity:Identity|null){
 if(!demoEnabled(env))throw new ApiError('not_found',404);
 await requestLimit(request,env,'demo-session',30,3600);
 // Reuse an existing anonymous demo identity, never a bot identity or administrator identity.
 if(identity&&isDemoUser(identity.id)&&!isSeedUser(identity.id))return newSession(env.DB!,identity.id);
 const uuid=crypto.randomUUID(),id='demo:'+uuid;
 await env.DB!.prepare("INSERT INTO social_profiles(id,handle,name,public_name,bio,status,created_at) VALUES (?,?,'Demo Gezgin','Demo Gezgin','','approved',?)").bind(id,'demo_'+uuid.replaceAll('-',''),nowIso()).run();
 return newSession(env.DB!,id);
}
export function readableDemoPost(post:{user_id:string},identity:Identity|null,env:SocialEnv){
 if(identity?.admin)return true;
 if(demoEnabled(env))return isSeedUser(post.user_id)||post.user_id===identity?.id;
 return !isDemoUser(post.user_id);
}
export async function kitApi(request:Request,env:SocialEnv,user:Identity){
 const db=env.DB!;
 if(request.method==='GET'){const rows=await db.prepare('SELECT kind,ref FROM social_kit WHERE user_id=? ORDER BY created_at DESC').bind(user.id).all<{kind:string;ref:string}>();return {favorites:rows.results.filter(x=>x.kind==='place').map(x=>x.ref),checked:rows.results.filter(x=>x.kind==='check').map(x=>x.ref)};}
 if(request.method!=='PUT')throw new ApiError('not_found',404);
 const b=z.object({kind:z.enum(['place','check']),ref:z.string().max(60),selected:z.boolean()}).strict().parse(await readJson(request));
 if(b.kind==='place'?!placeById[b.ref]:!kitItems.includes(b.ref as never))throw new ApiError('invalid_request');
 if(b.selected)await db.prepare('INSERT OR IGNORE INTO social_kit(user_id,kind,ref,created_at) VALUES (?,?,?,?)').bind(user.id,b.kind,b.ref,nowIso()).run();
 else await db.prepare('DELETE FROM social_kit WHERE user_id=? AND kind=? AND ref=?').bind(user.id,b.kind,b.ref).run();
 return {ok:true};
}
