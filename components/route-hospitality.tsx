"use client";
import { useState } from "react";
import { BedDouble, ChevronDown, ExternalLink } from "lucide-react";
import { hospitality, HOSPITALITY_SOURCE } from "@/lib/routing/hospitality";
import { copyFor } from "@/lib/routing/copy";
import { mapSearch } from "@/lib/routing/engine";
import type { District, Locale } from "@/lib/routing/types";

export function RouteHospitality({ districts, locale }: { districts: District[]; locale: Locale }) {
  const c = copyFor(locale);
  const [kind, setKind] = useState<"hotel" | "restaurant">("hotel");
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(4);
  const normalize = (s: string) => s.toLocaleLowerCase("tr-TR").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i");
  const results = hospitality.filter(h => h.kind === kind && districts.includes(h.district) && (!district || h.district === district) && normalize(h.name).includes(normalize(search)));
  return <details className="rp-hospitality rp-no-print"><summary><BedDouble size={20} aria-hidden="true" /><span>{c.hospitality}</span><ChevronDown size={17} aria-hidden="true" /></summary><div className="rp-hospitality-content">
    <p>{c.registryNote}</p><div className="rp-segment" role="group" aria-label={c.hospitality}>{(["hotel", "restaurant"] as const).map(k => <button type="button" key={k} aria-pressed={kind === k} className={kind === k ? "selected" : ""} onClick={() => { setKind(k); setLimit(4); }}>{k === "hotel" ? c.hotels : c.dining}</button>)}</div>
    <div className="rp-hospitality-filters"><label>{c.routeDistricts}<select value={district} onChange={e => { setDistrict(e.target.value); setLimit(4); }}><option value="">{c.allDistricts}</option>{districts.map(d => <option key={d}>{d}</option>)}</select></label><label>{c.findFacility}<input type="search" value={search} maxLength={80} onChange={e => { setSearch(e.target.value); setLimit(4); }} /></label></div>
    <p className="rp-small-note" role="status">{results.length} · {kind === "hotel" ? c.hotels : c.dining}</p>
    {results.length ? <ul className="rp-facility-list">{results.slice(0, limit).map(h => <li key={h.id}><div><strong>{h.name}</strong><span>{h.district}</span></div><a href={mapSearch(`${h.name} ${h.district}`)} target="_blank" rel="noreferrer" aria-label={`${c.phoneMap}: ${h.name}`}>Google Maps <ExternalLink size={14} aria-hidden="true" /></a></li>)}</ul> : <p className="rp-small-note">{c.registryEmpty}</p>}
    {results.length > limit && <button type="button" className="rp-text-button" onClick={() => setLimit(n => n + 8)}>{c.more} ({results.length - limit})</button>}
    <a href={HOSPITALITY_SOURCE} className="rp-registry-source" target="_blank" rel="noreferrer">{c.source}<ExternalLink size={14} aria-hidden="true" /></a>
  </div></details>;
}
