import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("desktop navigation is compact and exposes the charter and languages", async () => {
  const header = await read("components/site-header.tsx");
  for (const label of ["Birlik", "Eskişehir", "Rotalar", "Programlar", "Tüzük", "English", "Deutsch", "Français", "العربية"]) assert.match(header, new RegExp(label));
  assert.doesNotMatch(header, /header-cta/);
});

test("route catalogue contains only existing visitor stops", async () => {
  const content = await read("lib/content.ts");
  const stopBlock = content.split("export const routeStops")[1].split("export type RouteFamily")[0];
  assert.match(stopBlock, /status: "existing"/);
  assert.doesNotMatch(stopBlock, /Film Festivali|Film Akademisi|Motokros Merkezi|Karşılama Noktası|Kamp ve Karavan Alanı/);
  assert.equal((content.match(/name: "(?:Alpu|Beylikova|Çifteler|Günyüzü|Han|İnönü|Mahmudiye|Mihalgazi|Mihalıççık|Odunpazarı|Sarıcakaya|Seyitgazi|Sivrihisar|Tepebaşı)"/g) ?? []).length, 14);
});

test("charter and four international portals are present", async () => {
  const charter = await read("lib/charter.ts");
  const international = await read("lib/international.ts");
  assert.match(charter, /a\(63, "Yürürlük ve yürütme"/);
  for (const locale of ["en", "de", "fr", "ar"]) assert.match(international, new RegExp(`\\n  ${locale}: \\{`));
});

test("Afyonkarahisar reference model is not published", async () => {
  const files = await Promise.all([
    read("app/projeler/page.tsx"),
    read("app/[lang]/page.tsx"),
    read("lib/international.ts"),
    read("app/globals.css"),
  ]);
  assert.doesNotMatch(files.join("\n"), /Afyon|MXGP|benchmark-panel|intl-benchmark/i);
});
