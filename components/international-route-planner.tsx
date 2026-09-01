"use client";

import { useMemo, useState } from "react";
import { Bot, Check, MapPin, Sparkles } from "lucide-react";
import { type InterestKey, routeFamilies, routeStops } from "@/lib/content";
import { internationalCopy, type InternationalLocale } from "@/lib/international";

const interestKeys: InterestKey[] = ["heritage", "nature", "craft", "taste", "faith", "city", "rural"];

export function InternationalRoutePlanner({ locale }: { locale: InternationalLocale }) {
  const copy = internationalCopy[locale];
  const interestLabels = copy.interests as Record<InterestKey, string>;
  const routeNames = copy.routeNames as Record<string, string>;
  const [selected, setSelected] = useState<InterestKey[]>(["heritage", "craft"]);
  const [days, setDays] = useState(2);
  const [count, setCount] = useState(3);

  const routes = useMemo(() => routeFamilies.map((family) => {
    const overlap = family.interests.filter((item) => selected.includes(item)).length;
    const score = Math.min(97, Math.round(55 + (overlap / Math.max(1, selected.length)) * 32 + Math.max(0, 10 - Math.abs(days - family.suggestedDays) * 3)));
    const stops = family.stopIds.map((id) => routeStops[id]).filter((stop) => stop?.status === "existing").slice(0, days * 3);
    return { family, score, stops };
  }).sort((a, b) => b.score - a.score).slice(0, count), [count, days, selected]);

  function toggle(key: InterestKey) {
    setSelected((items) => items.includes(key) ? (items.length === 1 ? items : items.filter((item) => item !== key)) : [...items, key]);
  }

  return (
    <div className="intl-planner">
      <div className="intl-planner-controls">
        <div className="flex items-center gap-3"><span className="icon-box"><Bot aria-hidden="true" size={22} /></span><strong>{copy.routesTitle}</strong></div>
        <div className="intl-interest-grid">{interestKeys.map((key) => <button className={selected.includes(key) ? "selected" : ""} type="button" aria-pressed={selected.includes(key)} onClick={() => toggle(key)} key={key}>{interestLabels[key]}{selected.includes(key) && <Check aria-hidden="true" size={14} />}</button>)}</div>
        <div className="intl-planner-row"><div>{[1, 2, 3, 4].map((day) => <button className={days === day ? "selected" : ""} type="button" onClick={() => setDays(day)} key={day}>{day} {copy.days}</button>)}</div><div>{[2, 3, 4].map((value) => <button className={count === value ? "selected" : ""} type="button" onClick={() => setCount(value)} key={value}>{value} {copy.alternatives}</button>)}</div></div>
      </div>
      <div className="intl-route-results">{routes.map(({ family, score, stops }, index) => <article key={family.id}><div className="intl-route-head"><span>0{index + 1}</span><div><h3>{routeNames[family.id] ?? family.label}</h3><p><strong>%{score}</strong> {copy.match} · {new Set(stops.map((stop) => stop.district)).size} {copy.districts}</p></div></div><div className="intl-stop-list">{stops.map((stop) => <div key={stop.id}><MapPin aria-hidden="true" size={15} /><span><strong>{stop.name}</strong><small>{stop.district} · {stop.duration}</small></span></div>)}</div></article>)}</div>
      <p className="intl-planner-note"><Sparkles aria-hidden="true" size={16} />{copy.verify}</p>
    </div>
  );
}
