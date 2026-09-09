import {z} from 'zod';
import {ApiError,readJson,type SocialEnv,type Identity,nowIso} from './server-contract';
import {screenText} from './moderation';
const tables={profile:'social_profiles',post:'social_posts',comment:'social_comments'} as const;
export async function adminApi(path:string,method:string,request:Request,env:SocialEnv,identity:Identity){
 if(!identity.admin)throw new ApiError('forbidden',403);
 if(path==='/admin/queue'&&method==='GET'){
  const [profiles,posts,comments,media,reports]=await Promise.all([env.DB!.prepare("SELECT id,handle,name,bio,status,revision,created_at FROM social_profiles WHERE status='pending' ORDER BY created_at LIMIT 40").all(),env.DB!.prepare("SELECT id,user_id,title,body,place_ids,revision,ai_state,created_at FROM social_posts WHERE status='pending' ORDER BY created_at LIMIT 40").all(),env.DB!.prepare("SELECT id,post_id,user_id,body,revision,created_at FROM social_comments WHERE status='pending' ORDER BY created_at LIMIT 40").all(),env.DB!.prepare("SELECT id,post_id,kind,caption,status FROM social_media WHERE post_id IN (SELECT id FROM social_posts WHERE status='pending' ORDER BY created_at LIMIT 40) AND status!='deleted'").all(),env.DB!.prepare("SELECT r.id,r.target_type,r.target_id,r.reason,r.detail,r.created_at,CASE WHEN r.target_type='post' THEN (SELECT title FROM social_posts WHERE id=r.target_id) ELSE 'Yorum' END target_title,CASE WHEN r.target_type='post' THEN (SELECT body FROM social_posts WHERE id=r.target_id) ELSE (SELECT body FROM social_comments WHERE id=r.target_id) END target_body FROM social_reports r WHERE r.status='open' ORDER BY r.created_at LIMIT 40").all()]);
  return {profiles:profiles.results,posts:posts.results,comments:comments.results,media:media.results,reports:reports.results};
 }
 if(path==='/admin/review'&&method==='POST'){
  const b=z.object({type:z.enum(['profile','post','comment']),id:z.string().uuid(),decision:z.enum(['approved','rejected']),revision:z.number().int().positive(),reviewedAllMedia:z.boolean()}).strict().parse(await readJson(request));
  const table=tables[b.type],row=await env.DB!.prepare(`SELECT * FROM ${table} WHERE id=? AND status='pending' AND revision=?`).bind(b.id,b.revision).first<Record<string,any>>();if(!row)throw new ApiError('revision_changed',409);
  if(b.decision==='approved'){
   const text=b.type==='profile'?row.handle+' '+row.name+' '+row.bio:b.type==='post'?row.title+' '+row.body:row.body;if(!screenText(text).ok)throw new ApiError('unsafe_text');
   if(b.type==='post'){const files=await env.DB!.prepare("SELECT id,caption FROM social_media WHERE post_id=? AND status!='deleted'").bind(b.id).all<{id:string;caption:string}>();if(files.results.length&&!b.reviewedAllMedia)throw new ApiError('review_media_required');if(files.results.some(m=>!screenText(m.caption).ok))throw new ApiError('unsafe_text');}
  }
  // Conditional update prevents a reviewer from approving a stale version.
  const statements=[env.DB!.prepare(`UPDATE ${table} SET status=?${b.type==='profile'?",public_name=CASE WHEN ?='approved' THEN name ELSE public_name END,public_bio=CASE WHEN ?='approved' THEN bio ELSE public_bio END":''} WHERE id=? AND revision=? AND status='pending'`).bind(...(b.type==='profile'?[b.decision,b.decision,b.decision,b.id,b.revision]:[b.decision,b.id,b.revision]))];
  if(b.type==='post')statements.push(env.DB!.prepare("UPDATE social_media SET status=? WHERE post_id=? AND status!='deleted' AND EXISTS (SELECT 1 FROM social_posts WHERE id=? AND revision=? AND status=?)").bind(b.decision,b.id,b.id,b.revision,b.decision));
  statements.push(env.DB!.prepare(`INSERT INTO social_review_log (id,reviewer_id,target_type,target_id,decision,revision,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS (SELECT 1 FROM ${table} WHERE id=? AND revision=? AND status=?)`).bind(crypto.randomUUID(),identity.id,b.type,b.id,b.decision,b.revision,nowIso(),b.id,b.revision,b.decision));
  const changed=await env.DB!.batch(statements) as {meta?:{changes?:number}}[];if(!changed[0]?.meta?.changes)throw new ApiError('revision_changed',409);return {ok:true};
 }
 if(path==='/admin/report'&&method==='POST'){
  const b=z.object({id:z.string().uuid(),removeContent:z.boolean()}).strict().parse(await readJson(request)),report=await env.DB!.prepare("SELECT * FROM social_reports WHERE id=? AND status='open'").bind(b.id).first<Record<string,any>>();if(!report)throw new ApiError('not_found',404);
  const ops=[env.DB!.prepare("UPDATE social_reports SET status='resolved' WHERE id=?").bind(b.id)];
  if(b.removeContent){const table=report.target_type==='post'?'social_posts':'social_comments';ops.push(env.DB!.prepare(`UPDATE ${table} SET status='rejected',revision=revision+1 WHERE id=?`).bind(report.target_id));}
  ops.push(env.DB!.prepare('INSERT INTO social_review_log (id,reviewer_id,target_type,target_id,decision,revision,created_at) VALUES (?,?,?,?,?,?,?)').bind(crypto.randomUUID(),identity.id,report.target_type,report.target_id,b.removeContent?'report-remove':'report-dismiss',0,nowIso()));await env.DB!.batch(ops);return {ok:true};
 }
 throw new ApiError('not_found',404);
}
