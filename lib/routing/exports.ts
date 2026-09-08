import { transitMapUrl } from "./transit";
import { transitCopy, rideText } from "./transit-copy";
import { TRANSIT_CHECKED_ON } from "./transit-data";
import { foodAreas, urbanZones, placeById, zoneNames, VERIFIED_ON } from "./data";
import { clock, dateForDay, normalizePreferences, zoneOf, preferencesForDay, localTravelMode, districtDiscovery } from "./engine";
import { copyFor } from "./copy";
import { hospitality, HOSPITALITY_SOURCE } from "./hospitality";
import type { DayPlan, Locale, Plan, Preferences, ScheduleItem } from "./types";

export function placeQuery(id: string, p: Preferences): string {
  const zone = zoneOf(id);
  const food = foodAreas.find(f => f.zone === zone);
  const name = id.startsWith("origin:") ? zoneNames[zone]
    : id.startsWith("food:") ? p.meal === "picnic" || !food ? zoneNames[zone] : `${zoneNames[zone]} restoran`
    : `${placeById[id].name}, ${placeById[id].district}`;
  return `${name}, Eskişehir, Türkiye`;
}
const travelMode = (p: Preferences) => p.mode === "walk" ? "walking" : p.mode === "bicycle" ? "bicycling" : p.mode === "transit" ? "transit" : "driving";
export function legMapUrl(from: string, to: string, p: Preferences): string {
  if (p.mode === "transit" && zoneOf(from) === zoneOf(to)) p = { ...p, mode: "walk" };
  const query = new URLSearchParams({ api: "1", origin: placeQuery(from, p), destination: placeQuery(to, p), travelmode: travelMode(p) });
  return `https://www.google.com/maps/dir/?${query}`;
}
/** Three intermediate stops is the Google Maps mobile browser limit. Transit has no waypoints. */
export function navigationSegments(day: DayPlan, p: Preferences): { url: string; from: string; to: string; stops: string[] }[] {
  p = { ...preferencesForDay(day, p), mode: localTravelMode(day, p) };
  if (p.mode === "transit") {
    const segments: {url:string;from:string;to:string;stops:string[]}[]=[];
    const walk = (from: string,to: string) => {
      const url = `https://www.google.com/maps/dir/?${new URLSearchParams({api:"1",origin:from,destination:to,travelmode:"walking"})}`;
      segments.push({url,from,to,stops:[from,to]});
    };
    for (const item of day.items) {
      const rides=item.leg.transit?.rides;
      if (!rides) { segments.push({url:legMapUrl(item.leg.from,item.leg.to,{...p,mode:"walk"}),from:item.leg.from,to:item.leg.to,stops:[item.leg.from,item.leg.to]}); continue; }
      walk(placeQuery(item.leg.from,p),`${rides[0].board}, Eskişehir, Türkiye`);
      rides.forEach((ride,i) => {
        segments.push({url:transitMapUrl(ride),from:ride.board,to:ride.alight,stops:[ride.board,ride.alight]});
        const next=rides[i+1];
        if (next && ride.alight!==next.board) walk(`${ride.alight}, Eskişehir, Türkiye`,`${next.board}, Eskişehir, Türkiye`);
      });
      walk(`${rides.at(-1)!.alight}, Eskişehir, Türkiye`,placeQuery(item.id,p));
    }
    return segments;
  }
  const points = [`origin:${p.origin}`, ...day.items.map(item => item.id)];
  const step = 4;
  const segments = [];
  for (let offset = 0; offset < points.length - 1; offset += step) {
    const chunk = points.slice(offset, offset + step + 1);
    const query = new URLSearchParams({ api: "1", origin: placeQuery(chunk[0], p), destination: placeQuery(chunk.at(-1)!, p), travelmode: travelMode(p) });
    if (chunk.length > 2) query.set("waypoints", chunk.slice(1, -1).map(id => placeQuery(id, p)).join("|"));
    segments.push({ url: `https://www.google.com/maps/dir/?${query}`, from: chunk[0], to: chunk.at(-1)!, stops: chunk });
  }
  return segments;
}
/** Android geo is dispatched to a registered maps app; iOS uses Apple's public Maps link. */
export function phoneMapUrl(id: string, p: Preferences, platform: "android" | "ios" | "other"): string {
  const query = placeQuery(id, p);
  if (platform === "android") return `geo:0,0?q=${encodeURIComponent(query)}`;
  if (platform === "ios") return `https://maps.apple.com/?q=${encodeURIComponent(query)}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
export function itemText(item: ScheduleItem, p: Preferences, locale: Locale) {
  const c = copyFor(locale), food = foodAreas.find(f => f.zone === item.zone);
  if (item.kind === "visit") {
    const stop = placeById[item.id];
    return { title: stop.name, area: stop.district, description: stop.summary[locale], note: c[stop.note], source: stop.source };
  }
  if (item.kind === "return") return { title: c.return, area: zoneNames[item.zone], description: "", note: "", source: "" };
  const packed = p.meal === "picnic" || !food;
  return { title: `${item.id.endsWith("dinner") ? c.dinner : c.lunch} · ${packed ? c.packed : food.name}`, area: zoneNames[item.zone], description: p.meal === "picnic" ? c.picnicNote : !food ? c.packedNote : food[p.meal][locale], note: packed ? "" : c.mealNote, source: food?.source ?? "" };
}
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/\r\n|\r|\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
/** Fold by UTF-8 octets, not JavaScript string length (RFC 5545 §3.1). */
export function foldCalendarLine(line: string): string {
  let result = "", part = "", bytes = 0;
  for (const char of line) {
    const size = new TextEncoder().encode(char).length;
    if (bytes + size > 75) { result += part + "\r\n"; part = " "; bytes = 1; }
    part += char; bytes += size;
  }
  return result + part;
}
function hash(s: string): string { let h = 2166136261; for (const char of s) { h ^= char.codePointAt(0)!; h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
function calendarTime(date: string, minutes: number): string {
  return new Date(`${date}T${clock(minutes)}:00+03:00`).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
/** Importable calendar. No account connection or remote calendar mutation. */
export function calendarFile(plan: Plan, preferences: Preferences, locale: Locale, stamp = new Date()): string {
  const p = normalizePreferences(preferences), c = copyFor(locale), tc = transitCopy(locale);
  if (!p.date || plan.days.some((day, i) => day.date !== dateForDay(p.date, i))) throw new Error("A dated, recalculated plan is required");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//ETAHB//Eskisehir Discovery//TR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${icsText(c.itinerary + " · Eskişehir")}`, "X-WR-TIMEZONE:Europe/Istanbul"];
  for (const day of plan.days) {
    const dayP = preferencesForDay(day, p);
    for (const [itemIndex,item] of day.items.entries()) {
    item.leg.transit?.rides.forEach((ride,rideIndex) => {
      const description = [rideText(ride,locale),tc.snapshot,`${tc.checked}: ${TRANSIT_CHECKED_ON}`].join("\n\n");
      lines.push("BEGIN:VEVENT",`UID:${hash(`${plan.id}|${day.date}|ride|${itemIndex}|${rideIndex}`)}@etahb.eskisehir`,`DTSTAMP:${stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`,`DTSTART:${calendarTime(day.date,ride.depart)}`,`DTEND:${calendarTime(day.date,ride.arrive)}`,`SUMMARY:${icsText(`${tc[ride.vehicle]} ${ride.line} · ${ride.board}${ride.estimatedBoard ? ` (${tc.estimate})` : ""}`)}`,`LOCATION:${icsText(ride.board + ", Eskişehir, Türkiye")}`,`DESCRIPTION:${icsText(description)}`,`URL:${transitMapUrl(ride)}`,"STATUS:TENTATIVE","TRANSP:TRANSPARENT","BEGIN:VALARM","TRIGGER:-PT10M","ACTION:DISPLAY",`DESCRIPTION:${icsText(`${tc[ride.vehicle]} ${ride.line}`)}`,"END:VALARM","END:VEVENT");
    });
    if (item.kind === "return" || item.end <= item.start) continue;
    const text = itemText(item, dayP, locale);
    const description = [text.description, text.note, districtDiscovery(p) ? `${c.localStart}: ${zoneNames[day.origin]}. ${c.localAccess}` : "", `${c.duration}: ~${item.leg.km} km · ${item.leg.minutes} ${c.min}`, legMapUrl(item.leg.from, item.id, dayP), text.source, c.printNote].filter(Boolean).join("\n\n");
    lines.push("BEGIN:VEVENT", `UID:${hash(`${plan.id}|${day.date}|${item.id}`)}@etahb.eskisehir`, `DTSTAMP:${stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}`, `DTSTART:${calendarTime(day.date, item.start)}`, `DTEND:${calendarTime(day.date, item.end)}`, `SUMMARY:${icsText(text.title)}`, `LOCATION:${icsText(placeQuery(item.id, dayP))}`, `DESCRIPTION:${icsText(description)}`, `URL:${legMapUrl(item.leg.from, item.id, dayP)}`, "STATUS:TENTATIVE", "TRANSP:TRANSPARENT", "END:VEVENT");
  }
  }
  return [...lines, "END:VCALENDAR"].map(foldCalendarLine).join("\r\n") + "\r\n";
}
export const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
export function printDocumentHtml(plan: Plan, p: Preferences, locale: Locale, logoUrl: string): string {
  const c = copyFor(locale), tc = transitCopy(locale), e = escapeHtml;
  const date = (value: string) => value ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`)) : "—";
  const safeLogo = /^(https?:|data:image\/|file:)/.test(logoUrl) ? logoUrl : "";
  const days = plan.days.map((day, i) => {
    const dayP = preferencesForDay(day, p);
    const districts = [...new Set(day.placeIds.map(id => placeById[id].district))];
    const hotels = districts.flatMap(d => hospitality.filter(h => h.kind === "hotel" && h.district === d).slice(0, 2));
    const rows = day.items.map(item => {
      const text = itemText(item, dayP, locale);
      const transitRows = item.leg.transit?.rides.map(ride => `<tr class="transit"><td class="time">${ride.estimatedBoard ? "~" : ""}${clock(ride.depart)}<br><span>~${clock(ride.arrive)}</span></td><td><div class="stop-title">${e(tc[ride.vehicle])} ${e(ride.line)} · ${e(ride.direction)}</div><p>${e(ride.board)} → ${e(ride.alight)}</p><p class="note">${ride.terminalDeparture !== undefined ? `${e(tc.terminal)}: ${e(ride.terminal)} · ${clock(ride.terminalDeparture)}` : `${e(tc.frequency)}: ${ride.headway} min`}</p><div class="links"><a href="${e(ride.source)}">${e(tc.source)} ↗</a> · <a href="${e(transitMapUrl(ride))}">Google Maps ↗</a></div></td></tr>`).join("") ?? "";
      return transitRows + `<tr class="${item.kind}"><td class="time">${clock(item.start)}${item.end !== item.start ? `<br><span>${clock(item.end)}</span>` : ""}</td><td><div class="stop-title">${e(text.title)}</div><div class="area">${e(text.area)} · ~${item.leg.km} km · ${item.leg.minutes} ${e(c.min)}</div>${text.description ? `<p>${e(text.description)}</p>` : ""}${text.note ? `<p class="note">${e(text.note)}</p>` : ""}<div class="links"><a href="${e(legMapUrl(item.leg.from, item.id, dayP))}">Google Maps ↗</a>${text.source ? ` · <a href="${e(text.source)}">${e(c.source)} ↗</a>` : ""}</div></td></tr>`;
    }).join("");
    return `<section class="day"><header>${safeLogo ? `<img src="${e(safeLogo)}" alt="">` : ""}<div><strong>Eskişehir Turizm Altyapı<br>Hizmet Birliği</strong><small>VİZYON ESKİŞEHİR 2036</small></div><span class="edition">2026<br>ESKİŞEHİR</span></header><div class="eyebrow">${e(c.itinerary)}</div><h1>${e(c.day)} ${i + 1}<span>${e(date(day.date))}</span></h1><h2>${e(districts.join(" · "))}</h2><div class="overview"><span>${e(c[p.mode])} · ${clock(day.start)}–${clock(day.finish)}</span><span>~${Math.round(day.km)} km · ${day.placeIds.length} ${e(c.stops)}</span><span>${e(c.localStart)}: ${e(zoneNames[day.origin])}</span></div>${districtDiscovery(p) ? `<p class="note">${e(c.localAccess)}${p.mode === "transit" ? ` ${e(c.localTransit)}` : ""}</p>` : ""}<p class="interests">${e(p.interests.map(key => c[key]).join(" · "))}</p><table><thead><tr><th>${e(c.timeColumn)}</th><th>${e(c.visitColumn)}</th></tr></thead><tbody>${rows}</tbody></table>${hotels.length ? `<aside><h3>${e(c.hotels)}</h3><p>${hotels.map(h => `${e(h.name)} <span>(${e(h.district)})</span>`).join(" · ")}</p><a href="${HOSPITALITY_SOURCE}">${e(c.source)} ↗</a></aside>` : ""}<footer>${p.mode === "transit" ? `<p>${e(tc.snapshot)}</p><p>${e(tc.checked)}: ${TRANSIT_CHECKED_ON}</p>` : ""}<p>${e(c.printNote)}</p><div><span>ESKİŞEHİR · ${e(c.day)} ${i + 1} / ${plan.days.length}</span><span>${VERIFIED_ON}</span></div></footer></section>`;
  }).join("");
  return `<!doctype html><html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Eskişehir · ${e(c.itinerary)}</title><style>
@page{size:A4;margin:14mm 16mm}*{box-sizing:border-box}body{margin:0;color:#222b30;background:white;font-family:Arial,"DejaVu Sans",sans-serif;font-size:9pt;line-height:1.42}header{display:flex;align-items:center;gap:4mm;padding-bottom:4mm;border-bottom:1.5pt solid #7b122c}header img{width:13mm;height:16mm;object-fit:contain}header strong{font-family:Georgia,"DejaVu Serif",serif;font-size:12pt;line-height:1.2}header small{display:block;color:#7b122c;font-size:7pt;letter-spacing:1pt;margin-top:2mm}.edition{margin-inline-start:auto;text-align:end;font-size:7pt;letter-spacing:1pt;color:#727778}.eyebrow{font-size:8pt;color:#7b122c;margin-top:4mm;text-transform:uppercase;letter-spacing:1pt}h1{font-family:Georgia,"DejaVu Serif",serif;font-size:25pt;font-weight:400;margin:1mm 0;display:flex;justify-content:space-between;align-items:center}h1 span{font-family:Arial,"DejaVu Sans",sans-serif;font-size:10pt;font-weight:400;color:#555}h2{font-size:12pt;font-weight:500;margin:1mm 0 4mm}h3{font-size:9pt;margin:0 0 1mm}.overview{display:flex;flex-wrap:wrap;gap:2mm 6mm;padding:3mm 0;border-top:.5pt solid #ddd;border-bottom:.5pt solid #ddd;font-size:8pt}.overview span:last-child{flex-basis:100%}.interests{font-size:8pt;color:#646a6d;margin:3mm 0}table{width:100%;border-collapse:collapse;table-layout:fixed}thead{display:table-header-group}th{font-size:7pt;font-weight:600;text-align:start;color:#6a7072;padding:2mm 0;border-bottom:.6pt solid #aaa}th:first-child{width:20mm}td{vertical-align:top;padding:2mm 0;border-bottom:.5pt solid #e5e5e5}td.time{font-size:10pt;font-variant-numeric:tabular-nums;color:#7b122c}td.time span{font-size:8pt;color:#727778}.stop-title{font-size:10pt;font-weight:600}.area{font-size:7pt;color:#646a6d;margin:1mm 0}p{margin:1mm 0}p.note{color:#646a6d;font-size:7.5pt}.links{font-size:7pt;margin-top:1mm}a{color:#7b122c;text-decoration:none}.transit td{background:#f5f5f3}.transit .stop-title{font-size:9pt}.transit p{font-size:8pt}.meal .stop-title{color:#60513e}.return td{padding-block:2mm}.return .stop-title{font-size:9pt}tr,aside,footer{break-inside:avoid;page-break-inside:avoid}aside{margin-top:4mm;border-inline-start:2pt solid #ba925c;padding-inline-start:3mm;font-size:7.5pt}aside span{color:#666}footer{margin-top:3mm;padding-top:2mm;border-top:.5pt solid #bbb;color:#646a6d;font-size:7pt}footer>div{display:flex;justify-content:space-between;margin-top:3mm;font-size:6.5pt;letter-spacing:.5pt}.day+.day{break-before:page;page-break-before:always}@media screen{body{max-width:210mm;margin:auto;padding:14mm 16mm}.day+.day{margin-top:18mm}}
.transit-plan td:nth-child(2){padding-inline-start:2.5mm}html[dir=rtl] td.time{direction:ltr;unicode-bidi:isolate;text-align:right}.transit-plan{font-size:8.3pt;line-height:1.3}.transit-plan td{padding:1.3mm 0}.transit-plan .transit td{padding:1mm 0}.transit-plan .transit .links{margin-top:.5mm;font-size:6.5pt}.transit-plan .transit .stop-title{font-size:8.5pt}.transit-plan .transit p{font-size:7.5pt}.transit-plan .transit .note{font-size:7pt}.transit-plan .time{font-size:9pt}.transit-plan .eyebrow{margin-top:3mm}.transit-plan h1{font-size:22pt}.transit-plan h2{margin-bottom:2mm}.transit-plan .overview{padding:2mm 0}.transit-plan .interests{margin:2mm 0}.transit-plan aside{margin-top:2mm}.transit-plan footer{font-size:6.5pt;margin-top:2mm}.transit-plan footer>div{margin-top:2mm}
</style></head><body class="${p.mode === "transit" ? "transit-plan" : ""}">${days}</body></html>`;
}
