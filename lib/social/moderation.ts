/** A conservative first pass. It never grants publication; human review is required. */
export function normalizedPublicText(value:string){return value.normalize('NFKC').replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g,'').toLocaleLowerCase('tr-TR').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[013457@$]/g,c=>({'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','@':'a','$':'s'}[c]!));}
export function screenText(value:string):{ok:boolean;reason?:'unsafe_text'|'contact_in_public'|'invalid_text'}{
 if(typeof value!=='string'||value.length>6000||/[<>\u0000-\u0008]/.test(value))return {ok:false,reason:'invalid_text'};
 const n=normalizedPublicText(value),compact=n.replace(/[^a-z]/g,'');
 const blocked=['amk','aq','orospu','siktir','sikerim','sikeyim','fuck','fucking','porn','nigger','heilhitler','amcik','ananisik','yarrak','ibne','fickdich','hurensohn','putain','connard'];
 if(blocked.some(w=>new RegExp(`(^|[^a-z])${w}([^a-z]|$)`,'i').test(n))||['ananisik','siktirgit','cocukpornos','heilhitler'].some(w=>compact.includes(w)))return {ok:false,reason:'unsafe_text'};
 if(/\b[^\s@]+@[^\s@]+\.[a-z]{2,}\b|https?:\/\/|www\.|(?:\+?90[\s.-]*)?0?5\d{2}[\s.-]*\d{3}[\s.-]*\d{2}[\s.-]*\d{2}/i.test(value))return {ok:false,reason:'contact_in_public'};
 return {ok:true};
}
export async function checkWithAI(text:string,key?:string,fetcher:typeof fetch=fetch):Promise<'clear'|'flagged'|'unavailable'>{
 if(!key)return 'unavailable';
 try{const r=await fetcher('https://api.openai.com/v1/moderations',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:'omni-moderation-latest',input:text}),signal:AbortSignal.timeout(12000)});if(!r.ok)return 'unavailable';const d=await r.json() as {results?:{flagged?:boolean}[]};return typeof d.results?.[0]?.flagged==='boolean'?(d.results[0].flagged?'flagged':'clear'):'unavailable';}catch{return 'unavailable';}
}
