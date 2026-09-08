import { districtNames, foodAreas, origins, placeById, places, roadEdges, cyclingEdges, themeById, themes, urbanZones, zoneNames, CATALOG_VERSION } from "./data";
import type { DayPlan, Interest, Leg, Mode, Plan, PlanningResult, Preferences, ScheduleItem, Zone } from "./types";

export const defaults: Preferences = { days: 2, start: 540, end: 1080, mode: "car", pace: "balanced", interests: ["heritage", "taste"], origin: "center", meal: "local", family: false, lowWalk: false, weather: "outdoors", freeOnly: false, date: "", excluded: [], focus: "", alternatives: 3, districts: [], startMode: "district", cycleKm: 25 };
const modes: Mode[] = ["walk", "transit", "car", "bicycle", "motorcycle"];
const interestKeys: Interest[] = ["heritage", "phrygia", "nature", "craft", "taste", "faith", "city"];
const zones = Object.keys(zoneNames) as Zone[];
function distanceMatrix(edges: [Zone, Zone, number][]) {
  const m = Object.fromEntries(zones.map(a => [a, Object.fromEntries(zones.map(b => [b, a === b ? 0 : Infinity]))])) as Record<Zone, Record<Zone, number>>;
  for (const [a, b, km] of edges) m[a][b] = m[b][a] = km;
  for (const k of zones) for (const a of zones) for (const b of zones) m[a][b] = Math.min(m[a][b], m[a][k] + m[k][b]);
  return m;
}
const matrix = distanceMatrix(roadEdges), cycleMatrix = distanceMatrix(cyclingEdges);
export function districtDiscovery(p: Preferences) { return p.startMode === "district" && ["bicycle", "walk", "transit"].includes(p.mode); }
export function preferencesForDay(day: DayPlan, p: Preferences): Preferences { return { ...p, origin: day.origin, startMode: "fixed" }; }
export function localTravelMode(day: DayPlan, p: Preferences): Mode { return p.mode === "transit" && !urbanZones.includes(day.origin) ? "walk" : p.mode; }
export function cyclingLimit(p: Preferences) { return p.family ? Math.min(18, p.cycleKm) : p.cycleKm; }
const round = (n: number) => Math.round(n * 10) / 10;
const ceil5 = (n: number) => Math.ceil(n / 5) * 5;
const finite = (v: unknown, fallback: number, min: number, max: number) => typeof v === "number" && Number.isFinite(v) ? Math.max(min, Math.min(max, Math.round(v))) : fallback;
export function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^20\d{2}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
/** Validate all externally restored preferences. No arbitrary URL, ID, date or numeric parameter reaches the solver. */
export function normalizePreferences(value: unknown): Preferences {
  const p = value && typeof value === "object" ? value as Partial<Preferences> : {};
  const mode = modes.includes(p.mode as Mode) ? p.mode! : defaults.mode;
  const origin = origins.includes(p.origin as Zone) ? p.origin! : defaults.origin;
  const selected = Array.isArray(p.interests) ? [...new Set(p.interests)].filter(i => interestKeys.includes(i)).slice(0, 7) : defaults.interests;
  const start = finite(p.start, defaults.start, 480, 780);
  return {
    startMode: p.startMode === "fixed" ? "fixed" : "district", cycleKm: [25, 50, 80].includes(p.cycleKm ?? 0) ? p.cycleKm! : 25,
    districts: Array.isArray(p.districts) ? [...new Set(p.districts)].filter(d => districtNames.includes(d)) : [],
    days: finite(p.days, defaults.days, 1, 4), start, end: finite(p.end, defaults.end, start + 180, 1140), mode, origin,
    pace: ["relaxed", "balanced", "full"].includes(p.pace ?? "") ? p.pace! : defaults.pace,
    interests: selected.length ? selected : defaults.interests,
    meal: ["local", "vegetarian", "picnic"].includes(p.meal ?? "") ? p.meal! : defaults.meal,
    family: p.family === true, lowWalk: p.lowWalk === true, freeOnly: p.freeOnly === true,
    weather: p.weather === "indoors" ? "indoors" : "outdoors", date: validDate(p.date) ? p.date : "",
    excluded: Array.isArray(p.excluded) ? [...new Set(p.excluded)].filter(id => typeof id === "string" && Object.hasOwn(placeById, id)).slice(0, places.length) : [],
    focus: typeof p.focus === "string" && Object.hasOwn(themeById, p.focus) ? p.focus : "", alternatives: finite(p.alternatives, 3, 2, 6),
  };
}
export function dateForDay(date: string, offset: number): string {
  if (!validDate(date)) return "";
  const result = new Date(`${date}T12:00:00Z`); result.setUTCDate(result.getUTCDate() + offset); return result.toISOString().slice(0, 10);
}
export function zoneOf(id: string): Zone { return id.startsWith("origin:") ? id.slice(7) as Zone : id.startsWith("food:") ? id.split(":")[1] as Zone : placeById[id].zone; }
const pairKm: Record<string, number> = { "gerdek|hamamkaya": 0.5, "midas|midasvillage": 0.6, "sumer|velespit": 0.6, "atlihan|kursunlu": 0.2, "cam|kentbellegi": 0.1, "balmumu|cam": 0.1, "church|saat": 0.5, "cifteler|sakarya": 2 };
export function estimateLeg(from: string, to: string, mode: Mode): Leg {
  if (from === to) return { from, to, km: 0, minutes: 0, rest: 0 };
  const a = zoneOf(from), b = zoneOf(to), city = urbanZones.includes(a) && urbanZones.includes(b);
  const nearbyFood = a === b && (from.startsWith("food:") || to.startsWith("food:"));
  const km = a === b ? nearbyFood ? 0.4 : pairKm[[from, to].sort().join("|")] ?? (city ? 0.9 : 1.5) : (mode === "bicycle" ? cycleMatrix : matrix)[a][b] + 1;
  if (mode === "transit" && !city && a !== b || mode === "bicycle" && !Number.isFinite(km)) return { from, to, km, minutes: Infinity, rest: 0 };
  if (mode === "walk" && a !== b && !city) return { from, to, km, minutes: Infinity, rest: 0 };
  const walkingLink = mode === "walk" || mode === "transit" && !city || km < 1.5;
  const speed = walkingLink ? 4 : mode === "bicycle" ? city ? 14 : 11 : mode === "transit" ? 18 : city ? 25 : mode === "motorcycle" ? 50 : 55;
  const moving = km / speed * 60;
  const rest = mode === "motorcycle" ? Math.floor(moving / 90) * 15 : mode === "bicycle" ? Math.floor(moving / 50) * 10 : mode === "car" ? Math.floor(moving / 120) * 15 : 0;
  const overhead = walkingLink ? 0 : mode === "transit" ? 15 : mode === "bicycle" ? 5 : 10;
  return { from, to, km: round(km), minutes: ceil5(moving + overhead) + rest, rest };
}
export function eligiblePlaces(p: Preferences, date = p.date) {
  const weekday = validDate(date) ? new Date(`${date}T12:00:00Z`).getUTCDay() : -1;
  return places.filter(place => place.status === "existing" && !p.excluded.includes(place.id)
    && (!p.districts.length || p.districts.includes(place.district))
    && (!p.family || place.family) && (!p.lowWalk || place.lowWalk) && (!p.freeOnly || !place.paid)
    && (p.weather !== "indoors" || place.indoor) && !place.closedDays?.includes(weekday)
    && (districtDiscovery(p) || p.mode !== "bicycle" || Number.isFinite(cycleMatrix[p.origin][place.zone]))
    && (districtDiscovery(p) || !["walk", "transit"].includes(p.mode) || (urbanZones.includes(p.origin) ? urbanZones.includes(place.zone) : place.zone === p.origin)));
}
const landmarkWeight: Record<string, number> = { midas: 100, pessinus: 94, kumbet: 92, ulucami: 94, battal: 91, yunus: 87, eti: 75, gerdek: 84, hamamkaya: 83, sakarya: 90, gurleyik: 88, sorkun: 85, alpu: 81, kayakent: 82, saricakaya: 80, sakarilica: 78, mahmudiye: 79, beylikova: 76, gunyuzu: 75, inonu: 78, odunpazari: 68, devrim: 70, atlihan: 68 };
function walkingForLeg(leg: Leg, mode: Mode) { return mode === "walk" || leg.km < 1.5 || mode === "transit" && !urbanZones.includes(zoneOf(leg.to)) ? leg.km : mode === "transit" ? 0.5 : 0.15; }
function visitMinutes(id: string, p: Preferences) { return ceil5(placeById[id].minutes * (p.pace === "relaxed" ? 1.2 : p.pace === "full" ? 0.9 : 1) * (p.family ? 1.12 : 1)); }
/** Every candidate is independently scheduled with a return to the selected base, including meal transfers and breaks. */
export function schedule(ids: string[], preferences: Preferences, date = preferences.date): DayPlan | null {
  const p = normalizePreferences({ ...preferences, startMode: "fixed" });
  return scheduleNormalized(ids, p, date, new Set(eligiblePlaces(p, date).map(v => v.id)));
}
function scheduleNormalized(ids: string[], p: Preferences, date: string, allowed: Set<string>): DayPlan | null {
  if (!ids.length || new Set(ids).size !== ids.length || ids.some(id => !allowed.has(id))) return null;
  let now = p.start, prev = `origin:${p.origin}`, km = 0, travel = 0, walking = 0;
  const items: ScheduleItem[] = [];
  let lunch = p.start > 840, dinner = false;
  const addLeg = (leg: Leg) => { km += leg.km; travel += leg.minutes; walking += walkingForLeg(leg, p.mode); };
  const meal = (kind: "lunch" | "dinner", zone: Zone): boolean => {
    const id = `food:${zone}:${kind}`;
    const leg = estimateLeg(prev, id, p.mode);
    const earliest = kind === "lunch" ? 720 : 1080, latest = kind === "lunch" ? 840 : 1110;
    const start = Math.max(earliest, now + leg.minutes);
    const duration = p.meal === "picnic" || !foodAreas.some(a => a.zone === zone) ? 35 : p.pace === "relaxed" ? 65 : 50;
    if (start > latest || start + duration > p.end) return false;
    const wait = Math.max(0, earliest - (now + leg.minutes));
    addLeg(leg); items.push({ kind: "meal", id, zone, start, end: start + duration, leg, wait });
    now = start + duration; prev = id;
    if (kind === "lunch") lunch = true; else dinner = true;
    return true;
  };
  for (const id of ids) {
    const place = placeById[id];
    let leg = estimateLeg(prev, id, p.mode);
    const duration = visitMinutes(id, p);
    if (!lunch && now >= 720 && now + leg.minutes + duration > 825) {
      if (!meal("lunch", zoneOf(prev))) return null;
      leg = estimateLeg(prev, id, p.mode);
    }
    const start = Math.max(now + leg.minutes, place.window[0]);
    // A long morning journey must still reach a lunch stop before the lunch window closes.
    if (!lunch && start + duration > 840) {
      if (now + leg.minutes <= 825 && now + leg.minutes >= 690) {
        // Arrive at the destination's food area first; the visit leg is then recomputed.
        if (!meal("lunch", place.zone)) return null;
        leg = estimateLeg(prev, id, p.mode);
      } else return null;
    }
    const visitStart = Math.max(now + leg.minutes, place.window[0]);
    const end = visitStart + duration;
    if (!Number.isFinite(end) || end > place.window[1] || end > p.end) return null;
    const wait = Math.max(0, place.window[0] - (now + leg.minutes));
    addLeg(leg); walking += place.walking;
    items.push({ kind: "visit", id, zone: place.zone, start: visitStart, end, leg, wait }); now = end; prev = id;
    if (!lunch && now >= 720) { if (!meal("lunch", place.zone)) return null; }
  }
  let back = estimateLeg(prev, `origin:${p.origin}`, p.mode);
  if (!lunch && now + back.minutes >= 720) { if (!meal("lunch", zoneOf(prev))) return null; back = estimateLeg(prev, `origin:${p.origin}`, p.mode); }
  if (p.end >= 1140 && now + back.minutes >= 1080 && !dinner) { if (!meal("dinner", zoneOf(prev))) return null; back = estimateLeg(prev, `origin:${p.origin}`, p.mode); }
  if (now + back.minutes > p.end) return null;
  addLeg(back);
  const maxWalking = p.lowWalk ? 4 : p.family ? 8 : p.mode === "walk" || p.mode === "transit" && !urbanZones.includes(p.origin) ? (p.pace === "relaxed" ? 7 : 11) : 12;
  const maxDistance = p.mode === "bicycle" ? cyclingLimit(p) : p.mode === "walk" ? maxWalking : 340;
  if (walking > maxWalking || km > maxDistance || travel > (p.end - p.start) * (p.mode === "bicycle" ? 0.68 : 0.64)) return null;
  items.push({ kind: "return", id: `origin:${p.origin}`, zone: p.origin, start: now + back.minutes, end: now + back.minutes, leg: back, wait: 0 });
  const covered = new Set(ids.flatMap(id => placeById[id].interests));
  const interestFit = p.interests.filter(i => covered.has(i)).length;
  const focusFit = p.focus ? ids.filter(id => themeById[p.focus].stops.includes(id)).length : 0;
  const visits = ids.reduce((n, id) => n + visitMinutes(id, p), 0);
  const relevant = ids.filter(id => placeById[id].interests.some(i => p.interests.includes(i)));
  const quality = relevant.length / ids.length;
  const landmark = Math.max(0, ...relevant.map(id => landmarkWeight[id] ?? 15));
  const rural = ids.some(id => !urbanZones.includes(placeById[id].zone));
  const modeFit = ["bicycle", "motorcycle"].includes(p.mode) && rural ? 15 : 0;
  // Relevance and destination value outrank the number of cheap-to-reach urban stops.
  const score = quality * 95 + interestFit * 25 + landmark * .65 + Math.min(ids.length, 3) * 6
    + Math.min(visits, 220) * .1 + focusFit * 70 + modeFit + (rural ? 10 : 0)
    - travel * .045 - (ids.length - relevant.length) * 12;
  return { date, theme: "", origin: p.origin, items, placeIds: ids, km: round(km), travel, walking: round(walking), finish: now + back.minutes, score };
}
function permutations(ids: string[]): string[][] {
  if (ids.length < 2) return [ids];
  return ids.flatMap((id, i) => permutations(ids.filter((_, j) => j !== i)).map(rest => [id, ...rest]));
}
function subsets(ids: string[], max: number): string[][] {
  const out: string[][] = [];
  for (let bits = 1; bits < 2 ** ids.length; bits++) { const group = ids.filter((_, i) => bits & 1 << i); if (group.length <= max) out.push(group); }
  return out;
}
function dayPoolAt(p: Preferences, offset: number) {
  const date = dateForDay(p.date, offset);
  const allowed = new Set(eligiblePlaces(p, date).map(v => v.id));
  const unique = new Map<string, DayPlan>();
  let evaluated = 0;
  const maxStops = p.pace === "relaxed" || p.family ? 3 : 4;
  const districtSeeds = districtNames.flatMap(district => {
    const stops = places.filter(v => v.district === district && allowed.has(v.id))
      .sort((a, b) => Number(b.interests.some(i => p.interests.includes(i))) - Number(a.interests.some(i => p.interests.includes(i))) || (landmarkWeight[b.id] ?? 15) - (landmarkWeight[a.id] ?? 15)).map(v => v.id);
    return Array.from({ length: Math.ceil(stops.length / 4) }, (_, i) => ({ id: `district:${district}`, stops: stops.slice(i * 4, i * 4 + 5) }));
  });
  for (const theme of [...themes, ...districtSeeds]) {
    const candidates = theme.stops.filter(id => allowed.has(id));
    for (const group of subsets(candidates, maxStops)) {
      const key = [...group].sort().join("|");
      if (unique.has(key)) continue;
      let best: DayPlan | null = null;
      for (const order of permutations(group)) {
        evaluated++;
        const day = scheduleNormalized(order, p, date, allowed);
        if (day && (!best || day.score > best.score)) best = day;
      }
      if (best) { best.theme = theme.id; unique.set(key, best); }
    }
  }
  const ranked = [...unique.values()].sort((a, b) => b.score - a.score || a.placeIds.join().localeCompare(b.placeIds.join()));
  const retained = new Set<DayPlan>();
  // Reserve real candidates for every district before applying the global pool limit.
  for (const district of districtNames) ranked.filter(day => day.placeIds.some(id => placeById[id].district === district)).slice(0, 5).forEach(day => retained.add(day));
  for (const day of ranked) { if (retained.size >= 220) break; retained.add(day); }
  return { days: [...retained].sort((a, b) => b.score - a.score), evaluated };
}
function dayPool(p: Preferences, offset: number) {
  if (!districtDiscovery(p)) return dayPoolAt(p, offset);
  const available = eligiblePlaces(p, dateForDay(p.date, offset));
  const bases = [...new Set(available.map(place => urbanZones.includes(place.zone) ? "center" as Zone : place.zone))];
  const pools = bases.map(origin => dayPoolAt({ ...p, origin, startMode: "fixed" }, offset));
  const ranked = pools.flatMap(pool => pool.days).sort((a, b) => b.score - a.score);
  const retained = new Set<DayPlan>();
  // Local starts are visible plan data, never an unannounced teleport from the city.
  for (const base of bases) ranked.filter(day => day.origin === base).slice(0, 6).forEach(day => retained.add(day));
  for (const day of ranked) { if (retained.size >= 220) break; retained.add(day); }
  return { days: [...retained].sort((a, b) => b.score - a.score), evaluated: pools.reduce((sum, pool) => sum + pool.evaluated, 0) };
}
function similarity(a: string[], b: string[]) { const aa = new Set(a), bb = new Set(b); const overlap = [...aa].filter(id => bb.has(id)).length; return overlap / Math.max(1, new Set([...aa, ...bb]).size); }
export function generatePlans(input: unknown): PlanningResult {
  const p = normalizePreferences(input);
  const pools = Array.from({ length: p.days }, (_, i) => dayPool(p, i));
  let beam: { days: DayPlan[]; used: string[]; score: number }[] = [{ days: [], used: [], score: 0 }];
  for (const pool of pools) {
    const next: typeof beam = [];
    const seen = new Set<string>();
    for (const state of beam) for (const day of pool.days) {
      if (day.placeIds.some(id => state.used.includes(id))) continue;
      const used = [...state.used, ...day.placeIds];
      // Deduplicate by day-by-day stop sets; do not discard different schedules on different dates.
      const signature = [...state.days, day].map(d => `${d.origin}:` + [...d.placeIds].sort().join(",")).join("/");
      if (seen.has(signature)) continue; seen.add(signature);
      next.push({ days: [...state.days, day], used, score: state.score + day.score + [...new Set(day.placeIds.map(id => placeById[id].district))].filter(district => !state.used.some(id => placeById[id].district === district)).length * 9 });
    }
    // Keep the best state of each district combination. Stop-order variants cannot
    // consume the beam and erase every rural destination as in the old solver.
    next.sort((a, b) => b.score - a.score);
    const diverse: typeof beam = [];
    const districtCounts = new Map<string, number>();
    for (const option of next) {
      const key = [...new Set(option.used.map(id => placeById[id].district))].sort().join("|");
      if ((districtCounts.get(key) ?? 0) >= 2) continue;
      diverse.push(option); districtCounts.set(key, (districtCounts.get(key) ?? 0) + 1);
      if (diverse.length >= 96) break;
    }
    beam = diverse;
  }
  const candidates = beam.filter(state => state.days.length === p.days
    && (!p.focus || state.used.some(id => themeById[p.focus].stops.includes(id)))
    && (!p.interests.includes("phrygia") || state.used.some(id => placeById[id].interests.includes("phrygia")))
    && p.districts.every(district => state.used.some(id => placeById[id].district === district)));
  const plans: Plan[] = [];
  const usedSignatures = new Set<string>();
  while (plans.length < p.alternatives) {
    const ranked = candidates.filter(state => !usedSignatures.has([...state.used].sort().join("|")))
      .map(state => {
        const districts = [...new Set(state.used.map(id => placeById[id].district))];
        const stopOverlap = Math.max(0, ...plans.map(plan => similarity(plan.days.flatMap(d => d.placeIds), state.used)));
        const districtOverlap = Math.max(0, ...plans.map(plan => similarity([...new Set(plan.days.flatMap(d => d.placeIds.map(id => placeById[id].district)))], districts)));
        return { state, stopOverlap, selectionScore: state.score - stopOverlap * 65 - districtOverlap * 85 };
      }).filter(item => item.stopOverlap <= .88).sort((a, b) => b.selectionScore - a.selectionScore);
    if (!ranked.length) break;
    const state = ranked[0].state;
    usedSignatures.add([...state.used].sort().join("|"));
    plans.push({ id: state.days.map(d => `${d.origin}:` + d.placeIds.join(".")).join("~"), days: state.days, score: state.score, covered: p.interests.filter(i => state.used.some(id => placeById[id].interests.includes(i))) });
  }
  return { plans, unavailableDistricts: p.districts.filter(d => !eligiblePlaces(p).some(place => place.district === d)), evaluated: pools.reduce((n, pool) => n + pool.evaluated, 0), eligible: eligiblePlaces(p).length, requestedDays: p.days };
}
export function clock(minutes: number) { return `${Math.floor(minutes / 60).toString().padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`; }
export function mapSearch(query: string) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + " Eskişehir Türkiye")}`; }
export function directions(from: string, to: string, mode: Mode) {
  const name = (id: string) => id.startsWith("origin:") ? zoneNames[zoneOf(id)] : id.startsWith("food:") ? `${zoneNames[zoneOf(id)]} restoran` : placeById[id].name;
  const travelmode = mode === "walk" ? "walking" : mode === "bicycle" ? "bicycling" : mode === "transit" ? "transit" : "driving";
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(name(from) + " Eskişehir Türkiye")}&destination=${encodeURIComponent(name(to) + " Eskişehir Türkiye")}&travelmode=${travelmode}`;
}
export function encodePreferences(p: Preferences) { return encodeURIComponent(JSON.stringify({ v: CATALOG_VERSION, p: normalizePreferences(p) })); }
export function decodePreferences(value: string): Preferences | null {
  if (value.length > 12000) return null;
  try { const parsed = JSON.parse(decodeURIComponent(value)); return [CATALOG_VERSION, "2026-09-08.1", "2026-09-08.2"].includes(parsed?.v) && parsed.p ? normalizePreferences(parsed.p) : null; } catch { return null; }
}
/** Demo intent parser: explicit multilingual keywords, no remote LLM call and no free-form factual generation. */
export function parseRequest(raw: string, current: Preferences): { preferences: Preferences; changed: (keyof Preferences)[] } {
  const q = raw.slice(0, 600).replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR");
  const next = { ...current, focus: "" };
  const changed: (keyof Preferences)[] = [];
  const set = <K extends keyof Preferences>(key: K, value: Preferences[K]) => { next[key] = value; if (!changed.includes(key)) changed.push(key); };
  const day = q.match(/([1-4])\s*(?:gun|gün|days?|tage?|jours?|أيام|يوم)/);
  if (day) set("days", Number(day[1]));
  if (/yarım|yarim|half.day|halber|demi.jour|نصف يوم/.test(q)) { set("days", 1); set("end", current.start + 240); }
  if (/bisiklet|bicycle|cycling|bike|fahrrad|velo|دراج/.test(q)) set("mode", "bicycle");
  if (/motosiklet|motor\b|motorcycle|motorbike|motorrad|moto|دراجة نارية/.test(q)) set("mode", "motorcycle");
  else if (/araba|arac|car\b|auto|voiture|سيار/.test(q)) set("mode", "car");
  if (/yuruy|yürü|walk|zu fu|a pied|مشي/.test(q)) set("mode", "walk");
  if (/tram|toplu|transit|public|bus|otobus|حافل/.test(q)) set("mode", "transit");
  if (/cocuk|çocuk|aile|family|children|kind|famille|enfant|عائل|أطفال/.test(q)) set("family", true);
  if (/sakin|yavas|slow|relax|ruhig|calme|هادئ/.test(q)) set("pace", "relaxed");
  if (/az yuru|az yürü|short walk|wenig|peu de marche|مشي قليل/.test(q)) set("lowWalk", true);
  if (/vejet|veget|fleischlos|etsiz|نبات/.test(q)) set("meal", "vegetarian");
  if (/piknik|picnic|picknick|piquenique|نزهة/.test(q)) set("meal", "picnic");
  if (/yagmur|yağmur|rain|regen|pluie|مطر/.test(q)) set("weather", "indoors");
  const selected: Interest[] = [];
  if (/tarih|frig|phryg|heritage|history|geschichte|histoire|تاريخ/.test(q)) selected.push("heritage");
  if (/doga|doğa|nature|natur|طبيع/.test(q)) selected.push("nature");
  if (/lezzet|yemek|food|taste|essen|gastronom|cuisine|طعام/.test(q)) selected.push("taste");
  if (/sanat|zanaat|craft|art|kunst|حرف|فن/.test(q)) selected.push("craft");
  if (/inanc|inanç|faith|mosque|glaube|relig|إيمان/.test(q)) selected.push("faith");
  if (/kent|city|stadt|ville|مدينة/.test(q)) selected.push("city");
  if (selected.length) set("interests", [...new Set(selected)]);
  if (/frig|phryg|yazilikaya|midas|فريج/.test(q)) { set("focus", "phrygia"); set("interests", [...new Set([...next.interests, "phrygia" as Interest])]); }
  if (/sivrihisar|سيفري/.test(q)) set("focus", "unesco");
  const mentioned = districtNames.filter(d => q.includes(d.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("tr-TR")));
  if (mentioned.length) set("districts", mentioned);
  return { preferences: normalizePreferences(next), changed };
}
