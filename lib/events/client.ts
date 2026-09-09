'use client';
import {useEffect,useState} from 'react';
import {COMMUNITY_ORIGIN} from '../social/client';
import {initialCatalog,validatedEvents} from './catalog';
import {eventSources} from './sources';
import type {EventCatalog} from './types';
let cached:EventCatalog|null=null,inflight:Promise<EventCatalog>|null=null;
export async function loadEventCatalog(refresh=false):Promise<EventCatalog>{
 if(!refresh&&cached&&Date.now()-Date.parse(cached.generatedAt)<60000)return cached;
 if(!inflight)inflight=(async()=>{
  const r=await fetch(`${COMMUNITY_ORIGIN}/api/events${refresh?'?refresh=1':''}`,{signal:AbortSignal.timeout(35000),credentials:'omit'});if(!r.ok)throw Error('events_unavailable');
  const data=await r.json();if(!Array.isArray(data.events)||!Array.isArray(data.sources))throw Error('invalid_catalog');
  cached={events:validatedEvents(data.events),sources:data.sources.filter((s:any)=>eventSources.some(e=>e.id===s.sourceId)&&['connected','snapshot','unavailable','no-structured-events'].includes(s.state)),generatedAt:new Date().toISOString()};return cached;
 })().finally(()=>{inflight=null;});return inflight;
}
export function useEvents(){const [catalog,setCatalog]=useState<EventCatalog>(()=>cached??initialCatalog()),[loading,setLoading]=useState(false),[failed,setFailed]=useState(false),[ready,setReady]=useState(false);
 const refresh=async()=>{setLoading(true);try{setCatalog(await loadEventCatalog(true));setFailed(false);}catch{setFailed(true);}finally{setLoading(false);setReady(true);}};
 useEffect(()=>{let live=true;setLoading(true);loadEventCatalog().then(c=>{if(live){setCatalog(c);setFailed(false);}},()=>{if(live)setFailed(true);}).finally(()=>{if(live){setLoading(false);setReady(true);}});return()=>{live=false;};},[]);
 return {catalog,loading,failed,ready,refresh};
}
