import {z} from 'zod';
import {districtNames} from '../routing/data';
import {eventSnapshot} from './snapshot';
import {eventSources,sourceById,safeSourceUrl} from './sources';
import {venueById,eventStopId} from './venues';
import type {CityEvent,EventCatalog,EventIssue} from './types';
import type {Preferences} from '../routing/types';
const dateString=z.string().regex(/^20\d{2}-\d{2}-\d{2}$/).refine(d=>{try{return new Date(d+'T12:00:00Z').toISOString().slice(0,10)===d;}catch{return false;}});
export const eventSchema=z.object({
 id:z.string().regex(/^[a-z0-9][a-z0-9-]{1,110}$/),title:z.string().min(2).max(200),category:z.enum(['theatre','musical','concert','cinema','exhibition','festival','sport','workshop','talk','ceremony']),
 district:z.string().refine(d=>districtNames.includes(d as any)).nullable(),date:dateString.nullable(),time:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),endTime:z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable(),
 venue:z.string().max(240),venueId:z.string().refine(id=>Object.hasOwn(venueById,id)).nullable(),organizer:z.string().max(200),sourceId:z.string().refine(id=>Object.hasOwn(sourceById,id)),sourceUrl:z.string().url().max(1200),checkedAt:z.string().datetime(),
 status:z.enum(['scheduled','announced','cancelled','postponed']),price:z.enum(['free','paid','unknown']),bookingUrl:z.string().url().max(1200).nullable(),summary:z.string().max(600),family:z.boolean().nullable(),indoor:z.boolean().nullable(),
}).strict().refine(e=>!!safeSourceUrl(e.sourceUrl,sourceById[e.sourceId])&&(!e.bookingUrl||!!safeSourceUrl(e.bookingUrl,sourceById[e.sourceId]))&&(!e.venueId||e.district===venueById[e.venueId].district));
export function validatedEvents(raw:unknown):CityEvent[]{return Array.isArray(raw)?raw.slice(0,600).flatMap(e=>{const r=eventSchema.safeParse(e);return r.success?[r.data as CityEvent]:[];}):[];}
export function initialCatalog():EventCatalog{return {events:eventSnapshot,sources:eventSources.map(s=>({sourceId:s.id,checkedAt:eventSnapshot.some(e=>e.sourceId===s.id)?'2026-09-09T09:00:00Z':null,attemptedAt:null,state:'snapshot',count:eventSnapshot.filter(e=>e.sourceId===s.id).length})),generatedAt:'2026-09-09T09:00:00Z'};}
export const turkeyToday=(now=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul'}).format(now);
export const minutesOf=(time:string)=>Number(time.slice(0,2))*60+Number(time.slice(3));
export const startOf=(e:CityEvent)=>e.date&&e.time?Date.parse(`${e.date}T${e.time}:00+03:00`):NaN;
export function durationFor(e:CityEvent,p:Preferences){return e.endTime&&e.time?minutesOf(e.endTime)-minutesOf(e.time):p.eventDurations?.[e.id]??0;}
export function basicEventIssue(e:CityEvent,now=Date.now()):EventIssue['code']|null{
 if(e.status!=='scheduled'||!e.date||!e.time||!e.venueId)return 'unconfirmed';
 if(startOf(e)<=now)return 'expired';
 if(now-Date.parse(e.checkedAt)>72*60*60*1000)return 'stale';
 return null;
}
export function validateEventSelection(p:Preferences,catalog:CityEvent[],now=Date.now()):EventIssue[]{
 const ids=p.events??[];if(!ids.length)return [];
 const issues:EventIssue[]=[];if(!p.date)return [{code:'date',eventIds:ids}];
 const dates=Array.from({length:p.days},(_,i)=>{const d=new Date(p.date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+i);return d.toISOString().slice(0,10);});
 const selected:CityEvent[]=[];
 for(const id of ids){const e=catalog.find(e=>e.id===id);if(!e){issues.push({code:'missing',eventIds:[id]});continue;}selected.push(e);
  const basic=basicEventIssue(e,now);if(basic){issues.push({code:basic,eventIds:[id]});continue;}
  const duration=durationFor(e,p);if(duration<15||duration>360){issues.push({code:'duration',eventIds:[id]});continue;}
  if(!dates.includes(e.date!)||minutesOf(e.time!)-20<p.start||minutesOf(e.time!)+duration>p.end)issues.push({code:'outside',eventIds:[id]});
  if(p.freeOnly&&e.price!=='free'||p.weather==='indoors'&&e.indoor!==true||p.family&&e.family===false||p.districts.length&&!p.districts.includes(e.district!))issues.push({code:'preferences',eventIds:[id]});
 }
 for(const date of dates){const day=selected.filter(e=>e.date===date&&e.time).sort((a,b)=>a.time!.localeCompare(b.time!));if(day.length>2)issues.push({code:'limit',eventIds:day.map(e=>e.id)});
  for(let i=1;i<day.length;i++)if(minutesOf(day[i-1].time!)+durationFor(day[i-1],p)+20>minutesOf(day[i].time!))issues.push({code:'overlap',eventIds:[day[i-1].id,day[i].id]});
 }return issues;
}
export function eventSignature(e:CityEvent,p:Preferences){return `${eventStopId(e)}@${e.date}@${e.time}@${durationFor(e,p)}`;}
