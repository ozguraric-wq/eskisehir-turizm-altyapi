import {ApiError,type SocialEnv,type Identity,nowIso} from './server-contract';
import {readableDemoPost} from './server-demo';
import {screenText} from './moderation';
declare const FixedLengthStream:{new(length:number):{writable:WritableStream<Uint8Array>;readable:ReadableStream<Uint8Array>}};
const maxImage=8*1024*1024,maxVideo=25*1024*1024;
export function validMediaSignature(bytes:Uint8Array,mime:string){const s=String.fromCharCode(...bytes);return mime==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:mime==='image/png'?s.startsWith('\x89PNG\r\n\x1a\n'):mime==='image/webp'?s.startsWith('RIFF')&&s.slice(8,12)==='WEBP':mime==='video/mp4'?s.slice(4,8)==='ftyp':mime==='video/webm'?bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3:false;}
export async function uploadMedia(request:Request,env:SocialEnv,post:Record<string,any>,user:Identity){
 if(!env.BUCKET)throw new ApiError('media_unavailable',503);
 const mime=request.headers.get('content-type')?.split(';')[0]??'',kind=mime.startsWith('image/')?'image':'video',limit=kind==='image'?maxImage:maxVideo,size=Number(request.headers.get('content-length'));
 if(!['image/jpeg','image/png','image/webp','video/mp4','video/webm'].includes(mime))throw new ApiError('unsupported_media',415);
 if(!Number.isInteger(size)||size<16||size>limit||!request.body)throw new ApiError('media_too_large',413);
 let caption='';try{caption=decodeURIComponent(request.headers.get('x-media-caption')??'').trim();}catch{throw new ApiError('invalid_request');}if(caption.length>160||!screenText(caption).ok)throw new ApiError('unsafe_text');
 const count=await env.DB!.prepare("SELECT COUNT(*) n FROM social_media WHERE post_id=? AND status!='deleted'").bind(post.id).first<{n:number}>();if((count?.n??0)>=6)throw new ApiError('media_limit');
 const id=crypto.randomUUID(),key=`community/${user.id}/${id}`,fixed=new FixedLengthStream(size);let seen=0,prefix=new Uint8Array(),validated=false;
 const check=new TransformStream<Uint8Array,Uint8Array>({transform(chunk,controller){seen+=chunk.length;if(seen>size||seen>limit)throw new ApiError('media_too_large',413);if(!validated){const take=chunk.slice(0,16-prefix.length),next=new Uint8Array(prefix.length+take.length);next.set(prefix);next.set(take,prefix.length);prefix=next;if(prefix.length>=16){if(!validMediaSignature(prefix,mime))throw new ApiError('unsupported_media',415);validated=true;}}controller.enqueue(chunk);},flush(){if(!validated||seen!==size)throw new ApiError('invalid_media');}});
 try {
  await Promise.all([request.body.pipeThrough(check).pipeTo(fixed.writable),env.BUCKET.put(key,fixed.readable,{httpMetadata:{contentType:mime},customMetadata:{owner:user.id,review:'pending'}})]);
  // D1 batch is transactional: a new attachment and its review revision become visible together.
  const result=await env.DB!.batch([
   env.DB!.prepare("INSERT INTO social_media (id,post_id,user_id,object_key,kind,mime,bytes,caption,status,created_at) SELECT ?,?,?,?,?,?,?,?,'pending',? WHERE (SELECT COUNT(*) FROM social_media WHERE post_id=? AND status!='deleted')<6 AND EXISTS (SELECT 1 FROM social_posts WHERE id=? AND user_id=? AND status!='deleted')").bind(id,post.id,user.id,key,kind,mime,size,caption,nowIso(),post.id,post.id,user.id),
   env.DB!.prepare("UPDATE social_posts SET status='pending',revision=revision+1 WHERE id=? AND EXISTS (SELECT 1 FROM social_media WHERE id=?)").bind(post.id,id)
  ]) as {meta?:{changes?:number}}[];
  if(!result[0]?.meta?.changes)throw new ApiError('media_limit');
  return {id,status:'pending'};
 }catch(error){await env.BUCKET.delete(key).catch(()=>{});await env.DB!.prepare('DELETE FROM social_media WHERE id=?').bind(id).run().catch(()=>{});throw error;}
}
export async function readMedia(env:SocialEnv,id:string,identity:Identity|null,headers:Headers){
 const row=await env.DB!.prepare('SELECT m.*,p.status post_status FROM social_media m JOIN social_posts p ON p.id=m.post_id WHERE m.id=?').bind(id).first<Record<string,any>>();
 if(!row||!readableDemoPost(row as {user_id:string},identity,env)||row.status==='deleted'||row.post_status==='deleted'||!(identity?.admin||row.user_id===identity?.id||row.status==='approved'&&row.post_status==='approved'))throw new ApiError('not_found',404);
 if(!env.BUCKET)throw new ApiError('media_unavailable',503);const object=await env.BUCKET.get(row.object_key);if(!object)throw new ApiError('not_found',404);
 const out=new Headers(headers);out.set('Content-Type',row.mime);out.set('Content-Length',String(object.size));out.set('Cache-Control','private, no-store');out.set('Content-Disposition','inline');out.set('Content-Security-Policy',"default-src 'none'");return new Response(object.body,{headers:out});
}
