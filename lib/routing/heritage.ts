import { discoveries, products, heritage, type Discovery } from "./heritage-data";
import { heritageCopy } from "./heritage-copy";
import type { DayPlan, Locale, Preferences, ScheduleItem } from "./types";

/** Search normalises Turkish casing/diacritics without changing registered names. */
export const searchKey = (s: string) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g,"i");
export function filterDiscoveries(category: "all" | "taste" | "craft" | "heritage", area: string, query: string, locale: Locale) {
  const words = searchKey(query.trim()).split(/\s+/).filter(Boolean);
  return discoveries.filter(d => (category === "all" || category === "taste" && d.kind === "food" || category === "craft" && ["craft","produce"].includes(d.kind) || category === "heritage" && d.kind === "heritage")
    && (!area || d.area === area)
    && words.every(word => searchKey([d.name[locale],d.name.tr,d.area,d.summary[locale],d.tip[locale],d.registration?.number ?? ""].join(" ")).includes(word)));
}
/** A suggestion is editorial area context, never a certified retailer, extra stop or time allocation. */
export function discoveriesForDay(day: DayPlan, p: Preferences): Record<string, Discovery[]> {
  const result: Record<string, Discovery[]> = {};
  const add = (item: ScheduleItem | undefined, d: Discovery) => { if (item) (result[item.id] ??= []).push(d); };
  for (const h of heritage) add(day.items.find(i => i.kind === "visit" && h.stopIds?.includes(i.id)),h);
  for (const d of products) {
    if (d.kind === "food" && (p.meal === "picnic" || p.meal === "vegetarian" && d.meat)) continue;
    const candidates = day.items.filter(i => i.kind !== "return" && d.zones.includes(i.zone));
    const visits=candidates.filter(i => i.kind === "visit");
    // Prefer an actual craft/market stop already in this day's plan over a nearby monument.
    const preferred=d.stopIds?.map(id => visits.find(i => i.id === id)).find(Boolean)
      ?? (!d.stopIds ? visits.find(i => i.id === "sivricarsi") : undefined);
    const item = d.kind === "food" ? candidates.find(i => i.kind === "meal")
      : preferred ?? visits.find(i => !d.stopIds || d.stopIds.includes(i.id));
    add(item,d);
  }
  return result;
}
export function discoveryBadge(items: Discovery[], locale: Locale) {
  const c=heritageCopy(locale), story=items.find(d => d.kind === "heritage"), count=items.filter(d => d.kind !== "heritage").length;
  return [story?.status ? c[story.status] : "",count ? `${count} ${c.suggestions}` : ""].filter(Boolean).join(" · ");
}
export function discoveryText(items: Discovery[], locale: Locale, detailed = false) {
  const c=heritageCopy(locale);
  return items.slice(0,detailed ? items.length : 2).map(d => detailed
    ? `${d.name[locale]}${d.status ? ` · ${c[d.status]}` : ` · ${c.registered}`}\n${d.summary[locale]}\n${d.tip[locale]}\n${d.source}`
    : `${d.name[locale]}${d.status ? ` (${c[d.status]})` : ` (${c.registered})`}`).join(detailed ? "\n\n" : " · ");
}
export function discoveryMapUrl(d: Discovery, area?: string) {
  const location=area ?? (d.area === "center" ? "Eskişehir merkez" : `${d.area} Eskişehir`);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.name.tr} ${location}`)}`;
}
