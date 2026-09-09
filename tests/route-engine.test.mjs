import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {build} from "esbuild";

// Exercise the actual UI engine without a browser or another runtime dependency.
const directory = await mkdtemp(join(tmpdir(), "etahb-routing-"));
await build({entryPoints:["types", "data", "engine", "copy", "hospitality", "exports", "transit-data", "transit", "transit-copy", "heritage-registry", "heritage-data", "heritage-copy", "heritage"].map(module=>new URL(`../lib/routing/${module}.ts`,import.meta.url).pathname),outdir:directory,outExtension:{'.js':'.mjs'},bundle:true,splitting:true,platform:'node',format:'esm',logLevel:'silent'});

const { generatePlans, normalizePreferences, schedule, estimateLeg, defaults, encodePreferences, decodePreferences, parseRequest, dateForDay, directions, districtDiscovery, cyclingLimit, preferencesForDay, localTravelMode, timedLeg } = await import(pathToFileURL(join(directory, "engine.mjs")));
const { places, placeById, themes, urbanZones, foodAreas, zoneNames } = await import(pathToFileURL(join(directory, "data.mjs")));
const { copyFor } = await import(pathToFileURL(join(directory, "copy.mjs")));
const { navigationSegments, phoneMapUrl, calendarFile, foldCalendarLine, printDocumentHtml, placeQuery } = await import(pathToFileURL(join(directory, "exports.mjs")));
const { departures, findTransitLeg, serviceGroup } = await import(pathToFileURL(join(directory, "transit.mjs")));
const { buses } = await import(pathToFileURL(join(directory, "transit-data.mjs")));
const { transitCopy } = await import(pathToFileURL(join(directory, "transit-copy.mjs")));
const { hospitality } = await import(pathToFileURL(join(directory, "hospitality.mjs")));
const { discoveriesForDay, filterDiscoveries, discoveryText } = await import(pathToFileURL(join(directory, "heritage.mjs")));
const { discoveries, products, heritage } = await import(pathToFileURL(join(directory, "heritage-data.mjs")));
const { giRegistry } = await import(pathToFileURL(join(directory, "heritage-registry.mjs")));
after(() => rm(directory, { recursive: true, force: true }));

test("heritage catalogue preserves all verified national GI records and UNESCO distinctions", () => {
  assert.equal(giRegistry.length,15);
  assert.deepEqual(products.map(d => d.registration.id).sort((a,b)=>a-b),giRegistry.map(r=>r.id).sort((a,b)=>a-b));
  assert.equal(new Set(discoveries.map(d=>d.id)).size,discoveries.length);
  assert.equal(heritage.find(d=>d.id === "sivrihisar-ulu-camii").status,"world");
  assert.equal(heritage.find(d=>d.id === "daglik-frigya").status,"tentative");
  assert.equal(heritage.find(d=>d.id === "odunpazari-tarihi-alan").status,"tentative");
  assert.equal(heritage.find(d=>d.id === "nasreddin-hoca-anlatilari").status,"living");
  assert.equal(products.find(d=>d.id === "ciborek").scope.tr,"Türkiye");
  assert.match(products.find(d=>d.id === "kizilinler-bal-kabagi").scope.tr,/Tepebaşı ve Odunpazarı/);
  for(const d of discoveries)for(const locale of ["tr","en","de","fr","ar"]){
    assert.ok(d.name[locale] && d.summary[locale] && d.tip[locale],`${d.id}/${locale}`);
    assert.ok(d.source.startsWith("https://"));
    for(const id of d.stopIds ?? [])assert.ok(placeById[id],`unknown discovery stop ${id}`);
  }
});

test("discovery matching follows actual stops, prevents repeats, and respects vegetarian or picnic meals", () => {
  const p=normalizePreferences({...defaults,startMode:"district",mode:"walk",origin:"sivri",districts:["Sivrihisar"],date:"2026-09-08",end:1140});
  const day=schedule(["ulucami","church","saat"],p);assert.ok(day);
  const before=JSON.stringify(day), contexts=discoveriesForDay(day,p), matches=Object.values(contexts).flat();
  assert.ok(contexts.ulucami.some(d=>d.id === "sivrihisar-ulu-camii"));
  assert.ok(matches.some(d=>d.id === "muska-baklavasi"));
  assert.equal(new Set(matches.map(d=>d.id)).size,matches.length);
  assert.ok(!matches.some(d=>["sorkun-comlegi","luletasi","ciborek"].includes(d.id)));
  assert.equal(JSON.stringify(day),before,"advisory content must not mutate the itinerary or timings");
  const marketDay=schedule(["ulucami","sivricarsi","church"],p);assert.ok(marketDay);
  const marketContexts=discoveriesForDay(marketDay,p);
  assert.ok(marketContexts.sivricarsi.some(d=>d.id==="cebe"));
  assert.ok(!marketContexts.ulucami.some(d=>d.kind==="craft"),"prefer the planned market to the mosque for shopping context");
  const vegetarian=Object.values(discoveriesForDay(day,{...p,meal:"vegetarian"})).flat();
  assert.ok(vegetarian.some(d=>d.id === "muska-baklavasi"));
  for(const id of ["arabasi","kelem-dolmasi","dovme-sucugu"])assert.ok(!vegetarian.some(d=>d.id===id),id);
  assert.ok(!Object.values(discoveriesForDay(day,{...p,meal:"picnic"})).flat().some(d=>d.kind === "food"));
  const sorkun=schedule(["sorkun"],{...defaults,origin:"sorkun",mode:"walk",startMode:"district"});assert.ok(sorkun);
  assert.ok(discoveriesForDay(sorkun,defaults).sorkun.some(d=>d.id==="sorkun-comlegi"));
  const gurleyik=schedule(["gurleyik"],{...defaults,origin:"gurleyik",mode:"walk",startMode:"district"});assert.ok(gurleyik);
  assert.ok(!Object.values(discoveriesForDay(gurleyik,defaults)).flat().some(d=>d.id==="sorkun-comlegi"),"sharing a district does not mean visiting Sorkun");
  const midas=schedule(["midas"],{...defaults,end:1140});assert.ok(midas);
  assert.equal(discoveriesForDay(midas,defaults).midas[0].status,"tentative");
  assert.ok(!Object.values(discoveriesForDay(midas,defaults)).flat().some(d=>d.kind!=="heritage"));
});

test("heritage search handles Turkish spellings, translated descriptions, category and area together", () => {
  assert.equal(filterDiscoveries("all","","CIGBOREGI","tr")[0].id,"ciborek");
  assert.equal(filterDiscoveries("craft","Mihalıççık","sorkun","en")[0].id,"sorkun-comlegi");
  assert.equal(filterDiscoveries("heritage","","Phrygia","en")[0].id,"daglik-frigya");
  assert.equal(filterDiscoveries("taste","Sivrihisar","lahana","tr")[0].id,"kelem-dolmasi");
  assert.equal(filterDiscoveries("taste","Sivrihisar","çömlek","tr").length,0);
  assert.equal(filterDiscoveries("craft","","","tr").length,7);
});

test("portable route notes retain discoveries without adding calendar events or navigation stops", () => {
  const p=normalizePreferences({...defaults,mode:"walk",startMode:"district",origin:"sivri",districts:["Sivrihisar"],date:"2026-09-08",end:1140});
  const day=schedule(["ulucami","church","saat"],p);assert.ok(day);
  const plan={id:"heritage-export",days:[day],score:1,covered:["heritage"]};
  for(const locale of ["tr","en","de","fr","ar"]){
    const ics=calendarFile(plan,p,locale).replace(/\r\n /g,"");
    assert.match(ics,/whc.unesco.org/);assert.match(ics,/Sivrihisar Muska Baklavası/);
    assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,day.items.filter(i=>i.kind!=="return" && i.end>i.start).length);
    const html=printDocumentHtml(plan,p,locale,"https://example.com/logo.webp");
    assert.match(html,/discovery-print/);assert.match(html,/Sivrihisar Muska Baklavası/);
    assert.ok(discoveryText(discoveriesForDay(day,p).ulucami,locale,true).length>50);
  }
});

test("regression: heritage alternatives escape the two central districts", () => {
  const result = generatePlans({ ...defaults, interests: ["heritage"], days: 1, alternatives: 3 });
  const districts = new Set(result.plans.flatMap(p => p.days.flatMap(d => d.placeIds.map(id => placeById[id].district))));
  assert.ok(districts.has("Han") || districts.has("Seyitgazi"), [...districts].join(", "));
  assert.ok(districts.size >= 3, "alternatives must offer different destination areas");
});

test("regression: all fourteen districts have schedulable visitor stops", () => {
  const names = ["Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Odunpazarı", "Sarıcakaya", "Seyitgazi", "Sivrihisar", "Tepebaşı"];
  for (const district of names) {
    const local = places.filter(p => p.district === district);
    assert.ok(local.length >= 1, district);
    const p = normalizePreferences({ ...defaults, days: 1, districts: [district], end: 1140 });
    const result = generatePlans(p);
    assert.ok(result.plans.length, district);
    assert.ok(result.plans.every(plan => plan.days.flatMap(d => d.placeIds).every(id => placeById[id].district === district)), district);
  }
});

function assertPlan(plan, p) {
  assert.equal(plan.days.length, p.days, "never present a partial trip as complete");
  const allIds = plan.days.flatMap(d => d.placeIds);
  assert.equal(new Set(allIds).size, allIds.length, "no repeated attractions across days");
  for (const [offset, day] of plan.days.entries()) {
    assert.equal(day.date, dateForDay(p.date, offset));
    assert.ok(day.finish <= p.end, "return must fit requested end time");
    assert.equal(day.items.at(-1).kind, "return");
    assert.equal(day.items.at(-1).id, `origin:${day.origin}`);
    if (!districtDiscovery(p)) assert.equal(day.origin, p.origin);
    assert.equal(day.items.at(-1).end, day.finish);
    assert.ok(day.start >= p.start);
    let previous = day.start;
    for (const item of day.items) {
      assert.ok(Number.isFinite(item.start) && item.start >= previous + item.leg.minutes + item.wait, "no overlap or missing transfer");
      assert.ok(item.end >= item.start);
      previous = item.end;
      if (item.kind === "visit") {
        assert.equal(placeById[item.id].status, "existing");
        assert.ok(!p.excluded.includes(item.id));
        assert.ok(item.start >= placeById[item.id].window[0] && item.end <= placeById[item.id].window[1]);
        if (p.mode === "bicycle") assert.ok(Number.isFinite(estimateLeg(`origin:${day.origin}`, item.id, p.mode).minutes));
        if (p.weather === "indoors") assert.ok(placeById[item.id].indoor);
        if (p.freeOnly) assert.equal(placeById[item.id].paid, false);
        if (p.lowWalk) assert.ok(placeById[item.id].lowWalk);
      }
      if (item.kind === "meal" && item.id.endsWith("lunch")) assert.ok(item.start >= (p.mode === "transit" ? 690 : 720) && item.start <= 840, "lunch window");
    }
    if (day.finish >= 720 && p.start <= 840) assert.equal(day.items.filter(i => i.kind === "meal" && i.id.endsWith("lunch")).length, 1);
    if (p.lowWalk) assert.ok(day.walking <= 4);
    if (p.mode === "bicycle") assert.ok(day.km <= cyclingLimit(p));
    if (p.mode === "walk") assert.ok(day.walking <= (p.family ? 8 : p.pace === "relaxed" ? 7 : 11));
    assert.ok(Math.abs(day.km - day.items.reduce((n, item) => n + item.leg.km, 0)) < 0.11, "return and meal distance included");
    assert.equal(day.travel, day.items.reduce((n, item) => n + item.leg.minutes, 0));
  }
}

test("mode, duration and pace matrix respects time, geography, meals and return", () => {
  let evaluated = 0;
  for (const mode of ["car", "motorcycle", "bicycle", "walk", "transit"]) for (const days of [1, 2, 3, 4]) for (const pace of ["relaxed", "balanced", "full"]) {
    const p = normalizePreferences({ ...defaults, mode, days, pace, date: mode === "transit" ? "2026-09-08" : "" });
    const result = generatePlans(p);
    assert.ok(result.plans.length > 0, `${mode}/${days}/${pace} should yield a usable plan`);
    assert.equal(new Set(result.plans.map(p => p.id)).size, result.plans.length);
    for (const plan of result.plans) { assertPlan(plan, p); evaluated++; }
  }
  assert.ok(evaluated >= 120);
});

test("long rural trips are rejected for walking, transit and bicycles", () => {
  for (const mode of ["walk", "transit", "bicycle"]) assert.equal(schedule(["midas", "battal"], { ...defaults, mode }), null);
  const rural = schedule(["midas"], { ...defaults, days: 1, mode: "car", end: 1140 });
  assert.ok(rural);
  assert.ok(rural.km > 150, "rural journey includes outbound and return");
  assert.equal(schedule(["midas"], { ...defaults, start: 660, end: 840 }), null, "three hours cannot contain a return trip to Midas");
});

test("motorcycle includes rest time and does not claim bicycle routing on rural roads", () => {
  const motor = estimateLeg("origin:center", "gurleyik", "motorcycle");
  assert.ok(motor.rest >= 15);
  assert.ok(motor.minutes > estimateLeg("origin:center", "gurleyik", "car").minutes);
  assert.equal(estimateLeg("origin:center", "gurleyik", "bicycle").minutes, Infinity);
  assert.match(directions("origin:center", "midas", "motorcycle"), /travelmode=driving/);
});

test("meal transfer goes to the local area, and rural packed meals are not restaurant claims", () => {
  const day = schedule(["midas", "midasvillage"], { ...defaults, days: 1, origin: "midas", start: 600 });
  assert.ok(day);
  const lunch = day.items.find(i => i.kind === "meal");
  assert.equal(lunch.zone, "midas");
  assert.equal(foodAreas.find(f => f.zone === lunch.zone), undefined);
  assert.ok(lunch.leg.km < 2, "no implausible city lunch in the middle of a rural route");
});

test("known museum closures, indoor, no-ticket and low-walking requests are hard filters", () => {
  assert.equal(schedule(["cam"], { ...defaults, date: "2026-09-14" }), null);
  assert.ok(schedule(["cam"], { ...defaults, date: "2026-09-15" }));
  for (const patch of [{ lowWalk: true }, { freeOnly: true }, { weather: "indoors", days: 1 }, { family: true, mode: "bicycle", days: 1 }]) {
    const p = normalizePreferences({ ...defaults, ...patch });
    const result = generatePlans(p);
    assert.ok(result.plans.length);
    result.plans.forEach(plan => assertPlan(plan, p));
  }
  assert.equal(schedule(["devrim"], { ...defaults, freeOnly: true }), null);
});

test("removing places actually reschedules and fully excluded catalogue has no fabricated fallback", () => {
  const first = generatePlans(defaults).plans[0];
  const excluded = first.days[0].placeIds;
  const p = { ...defaults, excluded };
  generatePlans(p).plans.forEach(plan => assertPlan(plan, p));
  assert.deepEqual(generatePlans({ ...defaults, excluded: places.map(p => p.id) }).plans, []);
  assert.equal(schedule(["film-festivali"], defaults), null);
  assert.equal(schedule(["porsuk", "porsuk"], defaults), null);
});

test("43 themes yield dozens of genuinely distinct feasible plans", () => {
  const distinct = new Set();
  for (const theme of themes) {
    const p = normalizePreferences({ ...defaults, days: 1, focus: theme.id, interests: theme.interests, end: 1140 });
    for (const plan of generatePlans(p).plans) {
      assert.ok(plan.days.flatMap(d => d.placeIds).some(id => theme.stops.includes(id)));
      assertPlan(plan, p); distinct.add(plan.id);
    }
  }
  assert.ok(distinct.size >= 40, `expected at least 40 distinct plans, got ${distinct.size}`);
});

test("shared and saved preferences validate IDs, dates and numeric limits", () => {
  const p = normalizePreferences({ ...defaults, mode: "motorcycle", excluded: ["cam"], date: "2026-09-15" });
  assert.deepEqual(decodePreferences(encodePreferences(p)), p);
  assert.deepEqual(generatePlans(p), generatePlans(p), "deterministic share reconstruction");
  assert.equal(decodePreferences("broken%"), null);
  assert.equal(decodePreferences("a".repeat(12001)), null);
  const untrusted = normalizePreferences({ days: Infinity, start: -500, end: 99999, origin: "missing", mode: "helicopter", excluded: ["constructor", "porsuk"], interests: [], focus: "__proto__", date: "2026-02-31" });
  assert.equal(untrusted.days, 2); assert.equal(untrusted.date, ""); assert.equal(untrusted.focus, "");
  assert.deepEqual(untrusted.excluded, ["porsuk"]); assert.equal(untrusted.end, 1410);
});

test("five-language preference parser and all user-facing catalogue translations", () => {
  for (const phrase of ["2 gün motosiklet Frigya yemek", "2 days motorcycle Phrygia food", "2 Tage Motorrad Phrygien Essen", "2 jours moto Phrygie cuisine", "٢ أيام دراجة نارية فريجيا طعام"]) {
    const parsed = parseRequest(phrase, defaults);
    assert.equal(parsed.preferences.days, 2, phrase);
    assert.equal(parsed.preferences.mode, "motorcycle", phrase);
    assert.equal(parsed.preferences.focus, "phrygia", phrase);
  }
  assert.equal(parseRequest("bisiklet çocuklarla sakin doğa", defaults).preferences.family, true);
  assert.equal(parseRequest("etsiz ve yağmurlu", defaults).preferences.weather, "indoors");
  assert.equal(parseRequest("not a recognized request xyz", defaults).changed.length, 0);
  for (const locale of ["tr", "en", "de", "fr", "ar"]) {
    for (const str of Object.values(copyFor(locale))) assert.ok(typeof str === "string" && str.length);
    for (const place of places) assert.ok(place.summary[locale]?.length && new URL(place.source).protocol === "https:");
    for (const theme of themes) assert.ok(theme.name[locale]?.length && theme.stops.every(id => placeById[id]));
  }
});


test("Phrygia is mandatory when selected; impossible travel does not fall back to the city", () => {
  for (const mode of ["car", "motorcycle"]) {
    const p = { ...defaults, days: 1, mode, interests: ["phrygia"] };
    const result = generatePlans(p);
    assert.ok(result.plans.length);
    for (const plan of result.plans) assert.ok(plan.days.flatMap(d => d.placeIds).some(id => placeById[id].interests.includes("phrygia")));
  }
  for (const mode of ["walk", "bicycle", "transit"]) assert.equal(generatePlans({ ...defaults, days: 1, mode, startMode: "fixed", interests: ["phrygia"] }).plans.length, 0);
  const result = generatePlans({ ...defaults, days: 2, districts: ["Han", "Seyitgazi"] });
  assert.ok(result.plans.length);
  for (const plan of result.plans) assert.deepEqual([...new Set(plan.days.flatMap(d => d.placeIds.map(id => placeById[id].district)))].sort(), ["Han", "Seyitgazi"]);
});

test("navigation preserves every meal, stop and return across mobile-sized segments", () => {
  for (const mode of ["car", "motorcycle", "bicycle", "walk"]) {
    const p = { ...defaults, mode };
    for (const day of generatePlans(p).plans[0].days) {
      const segments = navigationSegments(day, p);
      const reconstructed = segments.flatMap((part, i) => i ? part.stops.slice(1) : part.stops);
      assert.deepEqual(reconstructed, [`origin:${day.origin}`, ...day.items.map(i => i.id)]);
      for (const part of segments) {
        const params = new URL(part.url).searchParams;
        assert.ok((params.get("waypoints")?.split("|").length ?? 0) <= (localTravelMode(day, p) === "transit" ? 0 : 3));
        assert.equal(params.get("destination"), placeQuery(part.to, p));
      }
    }
  }
  assert.match(phoneMapUrl("midas", defaults, "android"), /^geo:0,0\?q=/);
  assert.equal(new URL(phoneMapUrl("midas", defaults, "ios")).hostname, "maps.apple.com");
  assert.ok(!placeQuery("food:midas:lunch", defaults).includes("restoran"));
  assert.ok(!placeQuery("food:center:lunch", { ...defaults, meal: "picnic" }).includes("restoran"));
});

test("calendar has dated visits and meals in Türkiye time, stable IDs and UTF-8-safe folding", () => {
  const p = { ...defaults, date: "2026-09-15" }, plan = generatePlans(p).plans[0];
  for (const locale of ["tr", "en", "de", "fr", "ar"]) {
    const text = calendarFile(plan, p, locale, new Date("2026-09-08T12:00:00Z"));
    assert.ok(text.endsWith("END:VCALENDAR\r\n"));
    for (const line of text.split("\r\n")) assert.ok(Buffer.byteLength(line, "utf8") <= 75, line);
    const unfolded = text.replace(/\r\n /g, "");
    assert.equal((unfolded.match(/BEGIN:VEVENT/g) || []).length, plan.days.flatMap(d => d.items.filter(i => i.kind !== "return")).length);
    const first = plan.days[0].items[0];
    const expected = new Date(`${p.date}T${String(Math.floor(first.start / 60)).padStart(2,"0")}:${String(first.start % 60).padStart(2,"0")}:00+03:00`).toISOString().replace(/[-:]/g, "").replace(/\.000Z$/, "Z");
    assert.ok(unfolded.includes(`DTSTART:${expected}`));
    assert.deepEqual(text.match(/UID:.+/g), calendarFile(plan, p, locale, new Date("2026-09-09T12:00:00Z")).match(/UID:.+/g));
  }
  assert.throws(() => calendarFile(plan, { ...p, date: "" }, "tr"));
  assert.throws(() => calendarFile(plan, { ...p, date: "2026-09-16" }, "tr"));
  const folded = foldCalendarLine("DESCRIPTION:" + "İstanbul; إسكي شهير 🧭 ".repeat(30));
  assert.ok(!folded.includes("�"));
});

test("real hospitality registry excludes investment certificates and duplicate certificates", () => {
  assert.equal(hospitality.length, 141);
  assert.equal(new Set(hospitality.map(h => h.id)).size, hospitality.length);
  assert.ok(hospitality.every(h => ["Turizm İşletmesi Belgesi", "BASİT KONAKLAMA"].includes(h.certificateType)));
  assert.ok(hospitality.some(h => h.district === "Sivrihisar" && h.kind === "hotel"));
  assert.ok(hospitality.some(h => h.district === "Çifteler" && h.kind === "hotel"));
  assert.ok(hospitality.some(h => h.kind === "restaurant"));
});

test("standalone print document includes all days and meals, no site chrome or executable markup", async () => {
  const p = { ...defaults, date: "2026-09-15" }, plan = generatePlans(p).plans[0];
  for (const locale of ["tr", "en", "de", "fr", "ar"]) {
    const html = printDocumentHtml(plan, p, locale, "https://example.org/logo.webp");
    assert.equal((html.match(/class=\"day\"/g) || []).length, 2);
    assert.ok(html.includes("size:A4"));
    assert.ok(html.includes('dir="' + (locale === "ar" ? "rtl" : "ltr") + '"'));
    for (const day of plan.days) for (const id of day.placeIds) assert.ok(html.includes(placeById[id].name.replace(/&/g, "&amp;")));
    assert.ok(!/<script|<nav|<form/.test(html));
  }
  const id = plan.days[0].placeIds[0], previous = placeById[id].summary.tr;
  placeById[id].summary.tr = '<img src=x onerror="alert(1)">';
  assert.ok(printDocumentHtml(plan, p, "tr", "javascript:alert(1)").includes("&lt;img"));
  placeById[id].summary.tr = previous;
});


test("regression: bicycle origins are not silently reset to the city", () => {
  assert.equal(normalizePreferences({ ...defaults, mode: "bicycle", origin: "midas", startMode: "fixed" }).origin, "midas");
  const result = generatePlans({ ...defaults, mode: "bicycle", startMode: "district", days: 1, interests: ["phrygia"] });
  assert.ok(result.plans.length >= 2);
  const rural = new Set(result.plans.flatMap(p => p.days.flatMap(d => d.placeIds.map(id => placeById[id].district))));
  assert.ok(rural.has("Han"));
  assert.ok(!rural.has("Tepebaşı") && !rural.has("Odunpazarı"));
});

test("regression: district walking and cycling discovery reach all fourteen districts", () => {
  const districts = [...new Set(places.map(p => p.district))];
  for (const mode of ["walk", "bicycle"]) for (const district of districts) {
    const p = normalizePreferences({ ...defaults, mode, startMode: "district", districts: [district], days: 1 });
    const result = generatePlans(p);
    assert.ok(result.plans.length, `${mode}: ${district}`);
    for (const plan of result.plans) for (const day of plan.days) {
      assert.ok(day.origin);
      assert.equal(day.items.at(-1).id, `origin:${day.origin}`);
      assert.ok(day.placeIds.every(id => placeById[id].district === district));
    }
  }
});


test("local departure is consistent in Maps, calendar and PDF, with no fictitious city transfer", () => {
  for (const mode of ["bicycle", "walk"]) {
    const p = normalizePreferences({ ...defaults, mode, days: 1, date: "2026-09-15", districts: ["Han"], interests: ["phrygia"], startMode: "district" });
    const plan = generatePlans(p).plans[0], day = plan.days[0];
    assert.equal(day.origin, "midas");
    const segments = navigationSegments(day, p);
    assert.equal(new URL(segments[0].url).searchParams.get("origin"), placeQuery("origin:midas", p));
    if (mode === "transit") assert.ok(segments.every(s => new URL(s.url).searchParams.get("travelmode") === "walking"));
    const html = printDocumentHtml(plan, p, "tr", "https://example.org/logo.webp");
    assert.ok(html.includes("Bu günün başlangıç ve dönüş noktası: Yazılıkaya"));
    assert.ok(html.includes("Başlangıca ulaşım süresi"));
    assert.ok(!html.includes("Eskişehir Gar / merkez"));
    const ics = calendarFile(plan, p, "tr").replace(/\r\n /g, "");
    assert.ok(ics.includes("Yazılıkaya"));
    assert.ok(ics.includes("Başlangıca ulaşım süresi"));
    assertPlan(plan, p);
  }
});

test("cycling distance and family limits apply on sourced valley connections", () => {
  const p = normalizePreferences({ ...defaults, mode: "bicycle", days: 1, origin: "ilica", startMode: "fixed", start: 480, end: 1140, cycleKm: 80 });
  const long = schedule(["saricakaya"], p);
  assert.ok(long && long.km > 50 && long.km < 80);
  assert.equal(schedule(["saricakaya"], { ...p, cycleKm: 25 }), null);
  assert.equal(schedule(["saricakaya"], { ...p, family: true }), null);
  assert.equal(normalizePreferences({ ...p, cycleKm: 999 }).cycleKm, 25);
  assert.equal(normalizePreferences({ ...p, mode: "transit", origin: "sivri" }).origin, "sivri");
});

test("default cycling and walking alternatives do not collapse to central districts", () => {
  for (const mode of ["bicycle", "walk"]) {
    const p = normalizePreferences({ ...defaults, mode, days: 1 });
    const result = generatePlans(p);
    const districts = new Set(result.plans.flatMap(p => p.days.flatMap(d => d.placeIds.map(id => placeById[id].district))));
    assert.ok(districts.size >= 3, `${mode}: ${[...districts]}`);
    assert.ok(result.plans.some(p => p.days.some(d => !urbanZones.includes(d.origin))), mode);
  }
});


test("longer cycling preference can connect Phrygian visitor areas without starting in the city", () => {
  const p = normalizePreferences({ ...defaults, mode: "bicycle", days: 1, origin: "midas", startMode: "fixed", cycleKm: 50, end: 1140 });
  const day = schedule(["midas", "gerdek", "hamamkaya"], p);
  assert.ok(day && day.km > 25 && day.km <= 50);
  assert.equal(day.origin, "midas");
  assert.equal(schedule(["midas", "gerdek", "hamamkaya"], { ...p, cycleKm: 25 }), null);
});

test("public bus snapshot keeps terminal direction, Fridays, weekends and conditional services", () => {
  const record = id => buses.find(b => b.id === id);
  assert.equal(buses.length,18);
  assert.deepEqual(departures(record(112),0,"2026-09-08"),[1040]);
  assert.deepEqual(departures(record(112),1,"2026-09-08"),[480]);
  assert.deepEqual(departures(record(112),0,"2026-09-13"),[]);
  assert.deepEqual(departures(record(85),1,"2026-09-12"),[570,780,1050]);
  assert.deepEqual(departures(record(85),1,"2026-09-08",true),[570,780,1050]);
  assert.deepEqual(departures(record(109),0,"2026-09-10"),[1030]);
  assert.deepEqual(departures(record(109),0,"2026-09-11"),[600,1030]);
  assert.deepEqual(departures(record(109),1,"2026-09-12"),[510,840]);
  assert.deepEqual(departures(record(109),0,"2026-09-11",true),[]);
  assert.deepEqual(departures(record(108),0,"2026-09-08"),[],"ambiguous coloured Han branches need confirmation");
  assert.ok(!departures(record(23),0,"2026-09-08").includes(1240),"night duty is not a daytime route");
  assert.equal(serviceGroup("2026-09-12"),"saturday");
  assert.ok(departures(record(156),0,"2026-09-12").includes(620));
  assert.deepEqual(departures(record(156),0,"2026-09-08"),[]);
});

test("public transport requires a date and never invents access to Phrygian sites", () => {
  assert.equal(generatePlans({...defaults,mode:"transit"}).plans.length,0);
  const p = {...defaults,mode:"transit",days:1,date:"2026-09-08",start:360,end:1140};
  assert.equal(generatePlans({...p,interests:["phrygia"]}).plans.length,0);
  assert.equal(findTransitLeg("a","b","center","midas",360,p.date),null);
  assert.equal(generatePlans({...p,districts:["Seyitgazi"]}).plans.length,0,"17:20 outbound and 08:00 inbound cannot make a day trip");
  assert.ok(generatePlans({...p,origin:"midas",districts:["Han"]}).plans.length,"an explicitly selected local base remains valid");
});

function assertTransit(plan,p) {
  assertPlan(plan,p);
  for (const day of plan.days) {
    assert.equal(day.origin,p.origin,"transit never relocates the user to a rural base");
    let previous=day.start;
    for (const item of day.items) {
      const journey=item.leg.transit;
      if (journey) {
        assert.ok(journey.rides.length<=3);
        assert.ok(journey.walkingMinutes>0);
        let last=previous;
        for (const ride of journey.rides) {
          assert.ok(ride.depart>=last+5,"boarding and transfer cannot overlap a previous stage");
          assert.ok(ride.arrive>ride.depart);
          assert.ok(ride.source.startsWith("https://www."));
          if (ride.vehicle==="tram") { assert.ok(ride.estimatedBoard && ride.headway>=8); assert.equal(ride.terminalDeparture,undefined); }
          else assert.ok(Number.isFinite(ride.terminalDeparture));
          last=ride.arrive;
        }
        assert.ok(last<=item.start);
      }
      previous=item.end;
    }
  }
}

test("dated rural connections include outbound, boarding buffers and a feasible last return", () => {
  for (const [date,district] of [["2026-09-08","İnönü"],["2026-09-11","Mihalgazi"],["2026-09-12","İnönü"],["2026-09-12","Mihalgazi"],["2026-09-13","İnönü"]]) {
    const p=normalizePreferences({...defaults,mode:"transit",date,start:360,end:1140,days:1,districts:[district]});
    const plans=generatePlans(p).plans;
    assert.ok(plans.length,`${date} ${district}`);
    for (const plan of plans) {
      assertTransit(plan,p);
      const back=plan.days[0].items.at(-1);
      assert.ok(back.leg.transit?.rides.some(r=>r.vehicle==="bus"));
      if (district==="Mihalgazi") assert.equal(plan.days[0].start,480,"do not require idle waiting from 06:00 when 08:00 catches the bus");
    }
  }
  assert.equal(generatePlans({...defaults,mode:"transit",date:"2026-09-13",start:360,end:1140,days:1,districts:["Mihalgazi"]}).plans.length,0);
});

test("transit Maps, PDF and calendar preserve both directions, actual departure and five languages", () => {
  const p=normalizePreferences({...defaults,mode:"transit",date:"2026-09-11",start:360,end:1140,days:1,districts:["Mihalgazi"]});
  const plan=generatePlans(p).plans[0], day=plan.days[0];
  const rides=day.items.flatMap(i=>i.leg.transit?.rides??[]);
  const maps=navigationSegments(day,p);
  assert.equal(maps.filter(s=>new URL(s.url).searchParams.get("travelmode")==="transit").length,rides.length);
  assert.ok(maps.every(s=>!new URL(s.url).searchParams.has("waypoints")));
  for(const locale of ["tr","en","de","fr","ar"]) {
    const c=transitCopy(locale);
    assert.ok(Object.values(c).every(s=>s.length>0));
    const ics=calendarFile(plan,p,locale).replace(/\r\n /g,"");
    assert.equal((ics.match(/BEGIN:VEVENT/g)??[]).length,rides.length+day.items.filter(i=>i.kind!=="return").length);
    assert.equal((ics.match(/BEGIN:VALARM/g)??[]).length,rides.length);
    assert.ok(ics.includes("DTSTART:20260911T070000Z"),"10:00 Turkey bus departure is 07:00 UTC");
    const html=printDocumentHtml(plan,p,locale,"https://example.org/logo.webp");
    assert.ok(html.includes("08:00–"),"PDF uses this day's actual start");
    assert.ok(html.includes(c.snapshot));
    for(const ride of rides) { assert.ok(html.includes(ride.board)); assert.ok(ics.includes(ride.board)); }
  }
});
