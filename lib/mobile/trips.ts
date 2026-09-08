import { CATALOG_VERSION, placeById } from "../routing/data";
import { normalizePreferences, generatePlans } from "../routing/engine";
import type { Plan, Preferences } from "../routing/types";

export const TRIPS_KEY = "etahb-mobile-trips-v1";
export const TRIPS_EVENT = "etahb-trips-updated";
export interface Trip { id: string; title: string; preferences: Preferences; plan: Plan; completed: string[]; savedAt: string; catalogVersion: string; }
export function stopKey(day: number, id: string) { return `${day}:${id}`; }
export function validTrip(value: unknown): value is Trip {
  if (!value || typeof value !== "object") return false;
  const t=value as Trip;
  return typeof t.id==="string" && typeof t.title==="string" && t.title.length<=200 && !!t.preferences
    && t.catalogVersion===CATALOG_VERSION && typeof t.savedAt==="string" && Array.isArray(t.completed)
    && !!t.plan && Array.isArray(t.plan.days) && t.plan.days.length>0 && t.plan.days.length<=4
    && t.plan.days.every(d=>Array.isArray(d.placeIds) && d.placeIds.every(id=>Object.hasOwn(placeById,id))
      && Array.isArray(d.items) && d.items.every(item=>Number.isFinite(item.start) && Number.isFinite(item.end)
        && ["visit","meal","return"].includes(item.kind) && (item.kind!=="visit" || Object.hasOwn(placeById,item.id))));
}
export function readTrips(): Trip[] {
  if (typeof localStorage==="undefined") return [];
  try {
    const stored=localStorage.getItem(TRIPS_KEY);
    const raw=JSON.parse(stored??"[]");
    const trips=Array.isArray(raw)?raw.filter(validTrip).slice(0,40):[];
    if (stored!==null) return trips;
    const legacy=JSON.parse(localStorage.getItem("etahb-discovery-plans-v2")??"[]");
    if (!Array.isArray(legacy)) return [];
    return legacy.slice(0,8).flatMap(item=>{
      if (!item || typeof item.id!=="string" || typeof item.title!=="string") return [];
      const preferences=normalizePreferences(item.p), result=generatePlans(preferences);
      const plan=result.plans.find(p=>p.id===item.planId);
      return plan?[{id:item.id,title:item.title.slice(0,200),preferences,plan,completed:[],savedAt:new Date().toISOString(),catalogVersion:CATALOG_VERSION}]:[];
    });
  } catch { return []; }
}
export function writeTrips(trips: Trip[]) {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips.filter(validTrip).slice(0,40)));
  window.dispatchEvent(new Event(TRIPS_EVENT));
}
export function saveTrip(plan: Plan, preferences: Preferences, title: string): Trip {
  const trips=readTrips(), existing=trips.find(t=>t.plan.id===plan.id && JSON.stringify(t.preferences)===JSON.stringify(preferences));
  const trip: Trip={id:existing?.id??crypto.randomUUID(),title:title.slice(0,200),preferences:normalizePreferences(preferences),plan:structuredClone(plan),completed:existing?.completed??[],savedAt:new Date().toISOString(),catalogVersion:CATALOG_VERSION};
  writeTrips([trip,...trips.filter(t=>t.id!==trip.id)]); return trip;
}
export function toggleVisit(trip: Trip, key: string): Trip {
  const allowed=new Set(trip.plan.days.flatMap((d,i)=>d.items.filter(x=>x.kind!=="return").map(x=>stopKey(i,x.id))));
  if (!allowed.has(key)) return trip;
  return {...trip,completed:trip.completed.includes(key)?trip.completed.filter(x=>x!==key):[...trip.completed,key]};
}
