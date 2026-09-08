import assert from "node:assert/strict";
import test, { after } from "node:test";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Exercise the actual UI engine without a browser or another runtime dependency.
const directory = await mkdtemp(join(tmpdir(), "etahb-routing-"));
for (const module of ["types", "data", "engine", "copy"]) {
  const source = await readFile(new URL(`../lib/routing/${module}.ts`, import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replace(/from "\.\/(types|data|engine|copy)"/g, 'from "./$1.mjs"');
  await writeFile(join(directory, `${module}.mjs`), js);
}
const { generatePlans, normalizePreferences, schedule, estimateLeg, defaults, encodePreferences, decodePreferences, parseRequest, dateForDay, directions } = await import(pathToFileURL(join(directory, "engine.mjs")));
const { places, placeById, themes, urbanZones, foodAreas } = await import(pathToFileURL(join(directory, "data.mjs")));
const { copyFor } = await import(pathToFileURL(join(directory, "copy.mjs")));
after(() => rm(directory, { recursive: true, force: true }));

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

test("36 themes yield dozens of genuinely distinct feasible plans", () => {
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
