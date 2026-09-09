import {z} from 'zod';
import {demoEnabled,isDemoUser,isSeedUser,demoRouteById,demoTrends} from './demo';
import {ensureDemoContent,startDemo,readableDemoPost,kitApi} from './server-demo';
import {demoMediaFor} from './demo-media';
import {ApiError,readJson,registerSchema,profileSchema,postSchema,voteSchema,requestSchema,visitSchema,handleSchema,type SocialEnv,type Identity,nowIso} from './server-contract';
import {configured,identify,newSession,cookie,createProfile,passwordHash,equal,randomToken,digest,requestLimit,userLimit} from './auth';
import {providers,startOAuth,launchOAuth,finishOAuth} from './oauth';
import {screenText,checkWithAI} from './moderation';
import {getEventCatalog,writeReviewedEvents} from '../events/server';
import {generatePlans,normalizePreferences} from '../routing/engine';
import {placeById,districtNames} from '../routing/data';
import {demoGuides,demoHomes} from './demo-services';
import {readMedia,uploadMedia} from './server-media';
import {adminApi} from './server-admin';
import {answerTourismQuestion} from '../tourism/assistant';
type Row=Record<string,any>;
const textGuard=(text:string)=>{const result=screenText(text);if(!result.ok)throw new ApiError(result.reason!);};
const requireUser=(identity:Identity|null)=>{if(!identity||identity.id.startsWith('sites:'))throw new ApiError('sign_in_required',401);return identity;};
const dateInTurkey=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul'}).format(new Date());
export async function profileDto(env:SocialEnv,identity:Identity){const row=await env.DB!.prepare('SELECT * FROM social_profiles WHERE id=?').bind(identity.id).first<Row>();if(!row)return identity.admin?{id:identity.id,handle:'moderator',name:'İçerik yönetimi',bio:'',status:'approved',admin:true,createdAt:nowIso()}:null;return {demo:isDemoUser(row.id),id:row.id,handle:row.handle,name:row.name,bio:row.bio,status:row.status,revision:row.revision,admin:identity.admin,createdAt:row.created_at};}
export async function postDto(env:SocialEnv,p:Row,identity:Identity|null,origin:string){
 const owner=p.user_id===identity?.id,author=await env.DB!.prepare('SELECT handle,public_name,status FROM social_profiles WHERE id=?').bind(p.user_id).first<Row>();
 const seed=demoRouteById[p.id],demo=demoEnabled(env),scope=demo?"AND user_id=?":"AND user_id NOT LIKE 'demo:%'";
 const stats=await env.DB!.prepare(`SELECT COALESCE(SUM(liked),0) likes,COALESCE(AVG(NULLIF(rating,0)),0) rating,COUNT(NULLIF(rating,0)) ratingCount FROM social_votes WHERE post_id=? ${scope}`).bind(p.id,...(demo?[identity?.id??'']:[])).first<Row>();
 const comments=await env.DB!.prepare(`SELECT COUNT(*) n FROM social_comments WHERE post_id=? AND status='approved' AND ${demo?"(user_id LIKE 'demo:seed:%' OR user_id=?)":"user_id NOT LIKE 'demo:%'"}`).bind(p.id,...(demo?[identity?.id??'']:[])).first<Row>();
 const ratingCount=(seed?.ratingCount??0)+(stats?.ratingCount??0),rating=ratingCount?((seed?seed.rating*seed.ratingCount:0)+(stats?.rating??0)*(stats?.ratingCount??0))/ratingCount:0;
 const files=await env.DB!.prepare('SELECT id,kind,caption,status FROM social_media WHERE post_id=? AND (status=\'approved\' OR ?=1)').bind(p.id,owner||identity?.admin?1:0).all<Row>();
 const vote=identity?await env.DB!.prepare('SELECT liked,rating FROM social_votes WHERE post_id=? AND user_id=?').bind(p.id,identity.id).first<Row>():null;
 const preferences=JSON.parse(p.preferences);if(!owner)preferences.date='';
 return {demo:isDemoUser(p.user_id),id:p.id,author:{id:p.user_id,name:author?.public_name??'Gezgin',handle:author?.status==='approved'?author.handle:''},title:p.title,body:p.body,placeIds:JSON.parse(p.place_ids),districts:JSON.parse(p.districts),mode:p.mode,days:p.days,preferences,status:p.status,revision:p.revision,createdAt:p.created_at,likes:(seed?.likes??0)+(stats?.likes??0),rating,ratingCount,commentCount:comments?.n??0,media:[...demoMediaFor(p.id),...files.results.map(m=>({...m,url:origin+'/api/community/media/'+m.id}))],mine:owner,myVote:vote?{liked:!!vote.liked,rating:vote.rating}:undefined};
}
export async function handleSocialApi(request:Request,env:SocialEnv,platform:'sites'|'standalone'='standalone',fetcher:typeof fetch=fetch):Promise<Response>{
 const url=new URL(request.url),origin=request.headers.get('origin'),allowed=new Set([url.origin,'https://ozguraric-wq.github.io','https://localhost','capacitor://localhost']);
 if(env.SOCIAL_WEB_ORIGIN)try{allowed.add(new URL(env.SOCIAL_WEB_ORIGIN).origin);}catch{}
 const headers=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin','Referrer-Policy':'no-referrer'});
 if(origin&&allowed.has(origin)){headers.set('Access-Control-Allow-Origin',origin);headers.set('Access-Control-Allow-Credentials','true');headers.set('Access-Control-Allow-Headers','Authorization,Content-Type,X-Media-Caption');headers.set('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');}
 const json=(data:unknown,status=200,cookieValue?:string)=>{const h=new Headers(headers);if(cookieValue)h.set('Set-Cookie',cookieValue);return new Response(JSON.stringify(data),{status,headers:h});};
 if(origin&&!allowed.has(origin))return json({error:'origin_not_allowed'},403);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 const path=url.pathname.replace(/^\/api\/community/,'').replace(/\/$/,'')||'/',method=request.method;
 try {
  if(path==='/status'&&method==='GET')return json({demoMode:demoEnabled(env),ready:configured(env),mediaReady:!!env.BUCKET,providers:providers(env),knowledgeAI:!!env.OPENAI_API_KEY,moderation:env.OPENAI_API_KEY?'ai-and-human-review':'human-review'});
  if(!configured(env))return json({error:'service_unavailable'},503);
  if(path==='/oauth/launch'&&method==='GET')return await launchOAuth(request,env);
  if(path==='/oauth/callback'&&method==='GET')return await finishOAuth(request,env,fetcher);
  if(path==='/auth/start'&&method==='POST'){await requestLimit(request,env,'oauth',15,600);const b=z.object({provider:z.enum(['google','facebook']),challenge:z.string(),returnKind:z.enum(['web','native'])}).strict().parse(await readJson(request));return json(await startOAuth(env,request,b.provider,b.challenge,b.returnKind));}
  if(path==='/auth/exchange'&&method==='POST'){await requestLimit(request,env,'exchange',20,600);const b=z.object({code:z.string().regex(/^[A-Za-z0-9_-]{43}$/),verifier:z.string().regex(/^[A-Za-z0-9_-]{43,128}$/)}).strict().parse(await readJson(request));const r=await env.DB!.prepare('DELETE FROM social_handoffs WHERE hash=? AND challenge=? AND expires>? RETURNING user_id').bind(await digest(b.code),await digest(b.verifier),Date.now()).first<Row>();if(!r)throw new ApiError('oauth_expired',401);const s=await newSession(env.DB!,r.user_id);return json(s,200,cookie(s.token));}
  if(path==='/auth/register'&&method==='POST'){
   if(demoEnabled(env))throw new ApiError('demo_mode',409);
   await requestLimit(request,env,'register',4,3600);const b=registerSchema.parse(await readJson(request));textGuard(b.handle+' '+b.name+' '+b.bio);const id=await createProfile(env.DB!,b.handle,b.name,b.bio,'password','password:'+b.handle,b.password);const s=await newSession(env.DB!,id);return json(s,201,cookie(s.token));
  }
  if(path==='/auth/login'&&method==='POST'){
   await requestLimit(request,env,'login',15,600);const b=z.object({handle:handleSchema,password:z.string().min(1).max(128)}).strict().parse(await readJson(request));
   const row=await env.DB!.prepare("SELECT user_id,password_hash,salt FROM social_accounts WHERE subject=? AND provider='password'").bind('password:'+b.handle).first<Row>();
   // A fixed-cost dummy calculation avoids revealing whether a handle is registered.
   const actual=await passwordHash(b.password,row?.salt??'etahb-constant-dummy-salt-2026');if(!row||!equal(actual,row.password_hash))throw new ApiError('invalid_credentials',401);const s=await newSession(env.DB!,row.user_id);return json(s,200,cookie(s.token));
  }
  const identity=await identify(request,env,platform);
  if(path==='/auth/demo'&&method==='POST'){const session=await startDemo(request,env,identity);return json(session,201,cookie(session.token));}
  if(path==='/kit')return json(await kitApi(request,env,requireUser(identity)));
  if((path.startsWith('/posts')||path==='/trends')&&method==='GET')await ensureDemoContent(env);
  if(path==='/knowledge'&&method==='POST')return json(await answerTourismQuestion(request,env,requireUser(identity),fetcher));
  if(path==='/admin/events'&&method==='PUT'){if(!identity?.admin)throw new ApiError('forbidden',403);return json(await writeReviewedEvents(request,env));}
  if(path.startsWith('/admin')){if(!identity?.admin)throw new ApiError('forbidden',403);return json(await adminApi(path,method,request,env,identity));}
  if(path==='/auth/logout'&&method==='POST'){if(identity?.tokenHash)await env.DB!.prepare('DELETE FROM social_sessions WHERE hash=?').bind(identity.tokenHash).run();return json({ok:true},200,cookie('',0));}
  if(path==='/me'&&method==='GET')return json({profile:identity?await profileDto(env,identity):null});
  if(path==='/me'&&method==='PUT'){const user=requireUser(identity),b=profileSchema.parse(await readJson(request));textGuard(b.name+' '+b.bio);await userLimit(env,user.id,'profile',10);await env.DB!.prepare("UPDATE social_profiles SET name=?,bio=?,status=?,revision=revision+1 WHERE id=?").bind(b.name,b.bio,isDemoUser(user.id)?'approved':'pending',user.id).run();return json({profile:await profileDto(env,user)});}
  if(path==='/me'&&method==='DELETE'){
   const user=requireUser(identity),b=z.object({confirm:z.literal('DELETE')}).strict().parse(await readJson(request));void b;
   const files=await env.DB!.prepare('SELECT object_key FROM social_media WHERE user_id=?').bind(user.id).all<{object_key:string}>();
   // Erase bytes before deleting metadata so failed storage deletion remains retryable.
   if(files.results.length&&!env.BUCKET)throw new ApiError('media_unavailable',503);
   for(let i=0;i<files.results.length;i+=100)await env.BUCKET!.delete(files.results.slice(i,i+100).map(x=>x.object_key));
   await env.DB!.prepare('DELETE FROM social_profiles WHERE id=?').bind(user.id).run();return json({ok:true},200,cookie('',0));
  }
  if(path==='/posts'&&method==='GET'){
   const mine=url.searchParams.get('mine')==='1';if(mine)requireUser(identity);
   const district=url.searchParams.get('district')??'',mode=url.searchParams.get('mode')??'',order=url.searchParams.get('sort')??'new',page=Math.min(100,Math.max(0,Number(url.searchParams.get('page'))||0));
   if(district&&!districtNames.includes(district as never))throw new ApiError('invalid_request');if(mode&&!['car','walk','bicycle','motorcycle','transit'].includes(mode))throw new ApiError('invalid_request');
   const demo=demoEnabled(env),query=url.searchParams.get('q')?.trim().slice(0,80)??'';
   const visibility=mine?"p.user_id=? AND p.status!='deleted'":demo?"p.status='approved' AND p.user_id LIKE 'demo:seed:%' AND ? IS NOT NULL":"p.status='approved' AND p.user_id NOT LIKE 'demo:%' AND ? IS NOT NULL";
   const orderSql=order==='popular'?"(SELECT COALESCE(SUM(liked),0) FROM social_votes WHERE post_id=p.id AND user_id NOT LIKE 'demo:%') DESC,p.created_at DESC":"p.created_at DESC";
   const fold=(value:string)=>value.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
   const rows=await env.DB!.prepare(`SELECT p.* FROM social_posts p WHERE ${visibility} AND (?='' OR EXISTS (SELECT 1 FROM json_each(p.districts) WHERE value=?)) AND (?='' OR p.mode=?) ORDER BY ${orderSql} LIMIT 1200`).bind(mine?identity!.id:'public',district,district,mode,mode).all<Row>();
   let selected=rows.results.filter(r=>!query||fold(r.title+' '+r.body).includes(fold(query)));
   if(demo&&order==='popular')selected.sort((a,b)=>(demoRouteById[b.id]?.likes??0)-(demoRouteById[a.id]?.likes??0));
   const enriched=await Promise.all(selected.slice(page*12,page*12+12).map(r=>postDto(env,r,identity,url.origin)));
   return json({posts:enriched,hasMore:selected.length>page*12+12,total:selected.length,demo});
  }

  if(path==='/posts'&&method==='POST'){
   const user=requireUser(identity);await userLimit(env,user.id,'posts',12);const b=postSchema.parse(await readJson(request));textGuard(b.title+' '+b.body);
   const prefs=normalizePreferences(b.preferences),plan=generatePlans(prefs,prefs.events?.length?(await getEventCatalog(env)).events:undefined).plans.find(p=>p.id===b.planId);if(!plan)throw new ApiError('route_changed',409);
   const placeIds=[...new Set(plan.days.flatMap(d=>d.placeIds))],districts=[...new Set(placeIds.map(id=>placeById[id].district))],ai=await checkWithAI(b.title+'\n'+b.body,env.OPENAI_API_KEY,fetcher);if(ai==='flagged')throw new ApiError('unsafe_text');
   const id=crypto.randomUUID();await env.DB!.prepare("INSERT INTO social_posts (id,user_id,title,body,preferences,place_ids,districts,mode,days,status,revision,ai_state,created_at) VALUES (?,?,?,?,?,?,?,?,?,'pending',1,?,?)").bind(id,user.id,b.title,b.body,JSON.stringify(prefs),JSON.stringify(placeIds),JSON.stringify(districts),prefs.mode,plan.days.length,ai,nowIso()).run();return json({id,status:'pending'},201);
  }
  const match=path.match(/^\/posts\/([a-f0-9-]{36})(?:\/(comments|vote|media))?$/);
  if(match){const [,id,action]=match;const post=await env.DB!.prepare('SELECT * FROM social_posts WHERE id=?').bind(id).first<Row>();if(!post||!readableDemoPost(post as {user_id:string},identity,env)||post.status==='deleted'||post.status!=='approved'&&post.user_id!==identity?.id&&!identity?.admin)throw new ApiError('not_found',404);
   if(!action&&method==='GET')return json({post:await postDto(env,post,identity,url.origin)});
   if(!action&&method==='DELETE'){const user=requireUser(identity);if(post.user_id!==user.id)throw new ApiError('forbidden',403);await env.DB!.prepare("UPDATE social_posts SET status='deleted',revision=revision+1 WHERE id=?").bind(id).run();return json({ok:true});}
   if(!action&&method==='PUT'){const user=requireUser(identity);if(post.user_id!==user.id)throw new ApiError('forbidden',403);const b=z.object({title:z.string().trim().min(3).max(90),body:z.string().trim().max(3000),revision:z.number().int().positive()}).strict().parse(await readJson(request));textGuard(b.title+' '+b.body);const r=await env.DB!.prepare("UPDATE social_posts SET title=?,body=?,status='pending',revision=revision+1 WHERE id=? AND revision=? RETURNING id").bind(b.title,b.body,id,b.revision).first();if(!r)throw new ApiError('revision_changed',409);return json({ok:true,status:'pending'});}
   if(action==='media'&&method==='POST'){const user=requireUser(identity);if(post.user_id!==user.id)throw new ApiError('forbidden',403);await userLimit(env,user.id,'media',30);return json(await uploadMedia(request,env,post,user),201);}
   if(action==='vote'&&method==='PUT'){const user=requireUser(identity);if(post.status!=='approved'||post.user_id===user.id)throw new ApiError('vote_not_allowed');await userLimit(env,user.id,'votes',200);const b=voteSchema.parse(await readJson(request));await env.DB!.prepare('INSERT INTO social_votes (post_id,user_id,liked,rating) VALUES (?,?,?,?) ON CONFLICT(post_id,user_id) DO UPDATE SET liked=excluded.liked,rating=excluded.rating').bind(id,user.id,b.liked?1:0,b.rating).run();return json({post:await postDto(env,post,user,url.origin)});}
   if(action==='comments'&&method==='GET'){const demo=demoEnabled(env);const rows=await env.DB!.prepare(`SELECT c.*,p.public_name FROM social_comments c JOIN social_profiles p ON p.id=c.user_id WHERE c.post_id=? AND (c.status='approved' OR (c.user_id=? AND c.status!='deleted')) AND ${demo?"(c.user_id LIKE 'demo:seed:%' OR c.user_id=?)":"c.user_id NOT LIKE 'demo:%'"} ORDER BY c.created_at DESC LIMIT 60`).bind(id,identity?.id??'',...(demo?[identity?.id??'']:[])).all<Row>();return json({comments:rows.results.map(c=>({demo:isDemoUser(c.user_id),id:c.id,postId:id,author:{id:c.user_id,name:c.public_name},body:c.body,status:c.status,createdAt:c.created_at,mine:c.user_id===identity?.id}))});}
   if(action==='comments'&&method==='POST'){const user=requireUser(identity);if(post.status!=='approved')throw new ApiError('not_found',404);await userLimit(env,user.id,'comments',30);const b=z.object({body:z.string().trim().min(2).max(1200)}).strict().parse(await readJson(request));textGuard(b.body);if(await checkWithAI(b.body,env.OPENAI_API_KEY,fetcher)==='flagged')throw new ApiError('unsafe_text');const cid=crypto.randomUUID();await env.DB!.prepare("INSERT INTO social_comments (id,post_id,user_id,body,status,revision,created_at) VALUES (?,?,?,?,'pending',1,?)").bind(cid,id,user.id,b.body,nowIso()).run();return json({id:cid,status:'pending'},201);}
  }
  const comment=path.match(/^\/comments\/([a-f0-9-]{36})$/);if(comment&&method==='DELETE'){const user=requireUser(identity);await env.DB!.prepare("UPDATE social_comments SET status='deleted' WHERE id=? AND user_id=?").bind(comment[1],user.id).run();return json({ok:true});}
  const media=path.match(/^\/media\/([a-f0-9-]{36})$/);if(media&&method==='GET')return await readMedia(env,media[1],identity,headers);
  if(path==='/reports'&&method==='POST'){const user=requireUser(identity);await userLimit(env,user.id,'reports',10);const b=z.object({targetType:z.enum(['post','comment']),targetId:z.string().uuid(),reason:z.enum(['abuse','privacy','spam','misinformation','other']),detail:z.string().trim().max(800)}).strict().parse(await readJson(request));const table=b.targetType==='post'?'social_posts':'social_comments';if(!await env.DB!.prepare(`SELECT id FROM ${table} WHERE id=? AND status='approved'`).bind(b.targetId).first())throw new ApiError('not_found',404);await env.DB!.prepare("INSERT INTO social_reports (id,user_id,target_type,target_id,reason,detail,status,created_at) VALUES (?,?,?,?,?,?,'open',?)").bind(crypto.randomUUID(),user.id,b.targetType,b.targetId,b.reason,b.detail,nowIso()).run();return json({ok:true},201);}
  if(path==='/requests'&&method==='GET'){const user=requireUser(identity),rows=await env.DB!.prepare('SELECT * FROM social_requests WHERE user_id=? ORDER BY created_at DESC LIMIT 80').bind(user.id).all<Row>();return json({requests:rows.results.map(r=>({id:r.id,kind:r.kind,district:r.district,listingId:r.listing_id,date:r.date,time:r.time,people:r.people,language:r.language,note:r.note,status:r.status,createdAt:r.created_at}))});}
  if(path==='/requests'&&method==='POST'){const user=requireUser(identity);await userLimit(env,user.id,'requests',10);const b=requestSchema.parse(await readJson(request));if(b.date<dateInTurkey()||b.date>String(Number(dateInTurkey().slice(0,4))+1)+'-12-31')throw new ApiError('invalid_date');const entries=b.kind==='guide'?demoGuides:demoHomes,listing=b.listingId?entries.find(x=>x.id===b.listingId):null;if(b.listingId&&(!listing||listing.district!==b.district)||b.kind==='home'&&!listing)throw new ApiError('invalid_listing');if(listing&&'capacity' in listing&&listing.capacity<b.people)throw new ApiError('capacity_exceeded');const id=crypto.randomUUID();await env.DB!.prepare("INSERT INTO social_requests (id,user_id,kind,district,listing_id,date,time,people,language,note,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,'demo',?)").bind(id,user.id,b.kind,b.district,b.listingId,b.date,b.time,b.people,b.language,b.note,nowIso()).run();return json({id,status:'demo',delivered:false},201);}
  const req=path.match(/^\/requests\/([a-f0-9-]{36})$/);if(req&&method==='DELETE'){const user=requireUser(identity);await env.DB!.prepare("UPDATE social_requests SET status='cancelled' WHERE id=? AND user_id=?").bind(req[1],user.id).run();return json({ok:true});}
  if(path==='/visits'&&method==='PUT'){const user=requireUser(identity),b=visitSchema.parse(await readJson(request));if(b.date>dateInTurkey())throw new ApiError('invalid_date');await env.DB!.prepare('INSERT INTO social_visits (user_id,place_id,date) VALUES (?,?,?) ON CONFLICT(user_id,place_id) DO UPDATE SET date=excluded.date').bind(user.id,b.placeId,b.date).run();return json({ok:true});}
  if(path==='/trends'&&method==='GET'){
   if(demoEnabled(env))return json({places:demoTrends,basis:'curated-demo',visitsBasis:'none',demo:true});
   const rows=await env.DB!.prepare("SELECT p.id,p.place_ids,COALESCE(SUM(v.liked),0) likes FROM social_posts p LEFT JOIN social_votes v ON v.post_id=p.id AND v.user_id NOT LIKE 'demo:%' WHERE p.status='approved' AND p.user_id NOT LIKE 'demo:%' GROUP BY p.id HAVING COALESCE(SUM(v.liked),0)>0 ORDER BY likes DESC LIMIT 200").all<Row>();const map=new Map<string,{placeId:string;routeCount:number;likes:number;visitors:number}>();for(const p of rows.results)for(const placeId of new Set(JSON.parse(p.place_ids) as string[])){const r=map.get(placeId)??{placeId,routeCount:0,likes:0,visitors:0};r.routeCount++;r.likes+=p.likes;map.set(placeId,r);}
   const visits=await env.DB!.prepare("SELECT place_id,COUNT(*) visitors FROM social_visits WHERE user_id NOT LIKE 'demo:%' GROUP BY place_id HAVING COUNT(*)>=3").all<Row>();for(const v of visits.results)if(map.has(v.place_id))map.get(v.place_id)!.visitors=v.visitors;
   return json({places:[...map.values()].sort((a,b)=>b.likes-a.likes||b.routeCount-a.routeCount).slice(0,12),basis:'approved-liked-routes',visitsBasis:'optional-self-report-minimum-three'});
  }
  throw new ApiError('not_found',404);
 }catch(error){if(error instanceof ApiError)return json({error:error.code},error.status);if(error instanceof z.ZodError)return json({error:'invalid_request'},400);console.error('community_request_failed',{path,method,error:error instanceof Error?error.name:'Unknown'});return json({error:'service_unavailable'},503);}
}
