import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Exercise the actual UI engine without a browser or another runtime dependency.
const directory = await mkdtemp(join(tmpdir(), "etahb-routing-"));
for (const module of ["types", "data", "engine", "copy", "hospitality", "exports"]) {
  const source = await readFile(new URL(`../lib/routing/${module}.ts`, import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replace(/from "\.\/(types|data|engine|copy|hospitality|exports)"/g, 'from "./$1.mjs"');
  await writeFile(join(directory, `${module}.mjs`), js);
}
const { generatePlans, normalizePreferences, schedule, estimateLeg, defaults, encodePreferences, decodePreferences, parseRequest, dateForDay, directions } = await import(pathToFileURL(join(directory, "engine.mjs")));
const { places, placeById, themes, urbanZones, foodAreas } = await import(pathToFileURL(join(directory, "data.mjs")));
const { copyFor } = await import(pathToFileURL(join(directory, "copy.mjs")));
const { navigationSegments, phoneMapUrl, calendarFile, foldCalendarLine, printDocumentHtml, placeQuery } = await import(pathToFileURL(join(directory, "exports.mjs")));
const { hospitality } = await import(pathToFileURL(join(directory, "hospitality.mjs")));
after(() => rm(directory, { recursive: true, force: true }));

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
    assert.equal(day.items.at(-1).id, `origin:${p.origin}`);
    assert.equal(day.items.at(-1).end, day.finish);
    let previous = p.start;
    for (const item of day.items) {
      assert.ok(Number.isFinite(item.start) && item.start >= previous + item.leg.minutes + item.wait, "no overlap or missing transfer");
      assert.ok(item.end >= item.start);
      previous = item.end;
      if (item.kind === "visit") {
        assert.equal(placeById[item.id].status, "existing");
        assert.ok(!p.excluded.includes(item.id));
        assert.ok(item.start >= placeById[item.id].window[0] && item.end <= placeById[item.id].window[1]);
        if (["bicycle", "transit"].includes(p.mode)) assert.ok(urbanZones.includes(item.zone));
        if (p.weather === "indoors") assert.ok(placeById[item.id].indoor);
        if (p.freeOnly) assert.equal(placeById[item.id].paid, false);
        if (p.lowWalk) assert.ok(placeById[item.id].lowWalk);
      }
      if (item.kind === "meal" && item.id.endsWith("lunch")) assert.ok(item.start >= 720 && item.start <= 840, "lunch window");
    }
    if (day.finish >= 720 && p.start <= 840) assert.equal(day.items.filter(i => i.kind === "meal" && i.id.endsWith("lunch")).length, 1);
    if (p.lowWalk) assert.ok(day.walking <= 4);
    if (p.mode === "bicycle") assert.ok(day.km <= (p.family ? 18 : p.pace === "relaxed" ? 22 : 35));
    if (p.mode === "walk") assert.ok(day.walking <= (p.family ? 8 : p.pace === "relaxed" ? 7 : 11));
    assert.ok(Math.abs(day.km - day.items.reduce((n, item) => n + item.leg.km, 0)) < 0.11, "return and meal distance included");
    assert.equal(day.travel, day.items.reduce((n, item) => n + item.leg.minutes, 0));
  }
}

test("mode, duration and pace matrix respects time, geography, meals and return", () => {
  let evaluated = 0;
  for (const mode of ["car", "motorcycle", "bicycle", "walk", "transit"]) for (const days of [1, 2, 3, 4]) for (const pace of ["relaxed", "balanced", "full"]) {
    const p = normalizePreferences({ ...defaults, mode, days, pace });
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
  assert.deepEqual(untrusted.excluded, ["porsuk"]); assert.equal(untrusted.end, 1140);
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
  for (const mode of ["walk", "bicycle", "transit"]) assert.equal(generatePlans({ ...defaults, days: 1, mode, interests: ["phrygia"] }).plans.length, 0);
  const result = generatePlans({ ...defaults, days: 2, districts: ["Han", "Seyitgazi"] });
  assert.ok(result.plans.length);
  for (const plan of result.plans) assert.deepEqual([...new Set(plan.days.flatMap(d => d.placeIds.map(id => placeById[id].district)))].sort(), ["Han", "Seyitgazi"]);
});

test("navigation preserves every meal, stop and return across mobile-sized segments", () => {
  for (const mode of ["car", "motorcycle", "transit", "bicycle", "walk"]) {
    const p = { ...defaults, mode };
    for (const day of generatePlans(p).plans[0].days) {
      const segments = navigationSegments(day, p);
      const reconstructed = segments.flatMap((part, i) => i ? part.stops.slice(1) : part.stops);
      assert.deepEqual(reconstructed, [`origin:${p.origin}`, ...day.items.map(i => i.id)]);
      for (const part of segments) {
        const params = new URL(part.url).searchParams;
        assert.ok((params.get("waypoints")?.split("|").length ?? 0) <= (mode === "transit" ? 0 : 3));
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
