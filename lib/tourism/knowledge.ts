import inventory from './official-inventory.json';
import {places,districtNames,VERIFIED_ON} from '../routing/data';
import {text as t,type Locale,type District,type Localized} from '../routing/types';
export type KnowledgeKind='phrygia'|'museum'|'faith'|'nature'|'city';
export const knowledgeKinds:Record<KnowledgeKind,Localized>={phrygia:t('Arkeoloji & Frigya','Archaeology & Phrygia','Archäologie & Phrygien','Archéologie & Phrygie','الآثار وفريجيا'),museum:t('Müzeler','Museums','Museen','Musées','المتاحف'),faith:t('İnanç & mimarlık','Faith & architecture','Glaube & Architektur','Foi et architecture','الإيمان والعمارة'),nature:t('Doğa','Nature','Natur','Nature','الطبيعة'),city:t('Şehir kültürü','City culture','Stadtkultur','Culture urbaine','ثقافة المدينة')};
export interface KnowledgeEntry {id:string;name:string;region:string;district:District|null;category:KnowledgeKind;source:string;checkedAt:string;detailTr:string;placeId?:string;summary?:Localized;}
export const searchText=(value:string)=>value.toLocaleLowerCase('tr').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
// Exact source/name matching only: ambiguous locations never receive guessed routing coordinates.
const normalizeName=(s:string)=>searchText(s).replace(/\b(cami|camii)\b/g,'cami');
const records:KnowledgeEntry[]=inventory.map(entry=>{const match=places.find(p=>(p.source===entry.source||normalizeName(p.name)===normalizeName(entry.name))&&(!entry.district||p.district===entry.district));return {...entry,category:entry.category as KnowledgeKind,district:match?.district??entry.district as District|null,placeId:match?.id,summary:match?.summary};});
const covered=new Set(records.flatMap(r=>r.placeId?[r.placeId]:[]));
export const knowledge:KnowledgeEntry[]=[...records,...places.filter(p=>!covered.has(p.id)).map(p=>({id:'route-'+p.id,name:p.name,region:p.district,district:p.district,category:(p.interests.includes('phrygia')?'phrygia':p.interests.includes('faith')?'faith':p.interests.includes('nature')?'nature':'city') as KnowledgeKind,source:p.source,checkedAt:VERIFIED_ON,detailTr:'',placeId:p.id,summary:p.summary}))];
export const KNOWLEDGE_SOURCE_COUNT=164;
const synonyms:Record<string,string[]>={frigya:['phrygia','phrygien','phrygie','фригия','فريجيا','midas','yazilikaya'],museum:['museum','musee','museen','muze','متاحف','متحف'],nature:['nature','natur','doga','طبيعة'],faith:['faith','glaube','foi','inanc','cami','مسجد'],city:['city','stadt','ville','sehir','مدينة']};
export function searchKnowledge(query:string,locale:Locale='tr',district='',category=''){
 const tokens=searchText(query).split(' ').filter(Boolean).slice(0,12),expanded=new Set(tokens);
 for(const words of Object.values(synonyms))if(words.some(w=>tokens.includes(w)))for(const w of words)expanded.add(w);
 return knowledge.filter(e=>(!district||e.district===district||e.region===district)&&(!category||e.category===category)).map(entry=>{
  const name=searchText(entry.name),body=searchText([entry.region,entry.category,knowledgeKinds[entry.category][locale],entry.detailTr,entry.summary?.[locale],entry.category==='phrygia'?'frigya phrygien phrygie فريجيا':''].join(' '));
  const score=[...expanded].reduce((n,word)=>n+(name.includes(word)?5:body.includes(word)?1:0),0);
  return {entry,score};
 }).filter(r=>!tokens.length||r.score>0).sort((a,b)=>b.score-a.score||Number(!!b.entry.summary)-Number(!!a.entry.summary)||a.entry.name.localeCompare(b.entry.name,locale)).map(r=>r.entry);
}
export function knowledgeSummary(entry:KnowledgeEntry,locale:Locale){if(locale==='tr'&&entry.detailTr)return entry.detailTr;if(entry.summary)return entry.summary[locale];const category=knowledgeKinds[entry.category][locale];return `${entry.region} · ${category}`;}
export const knowledgeDistricts=districtNames;
