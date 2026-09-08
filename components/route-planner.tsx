"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bike, Bookmark, CalendarPlus, Check, ChevronDown, Clock3, Compass, Download, ExternalLink, Footprints, MapPin, Navigation, Printer, Route, Share2, SlidersHorizontal, Sparkles, TrainFront, Trash2, Utensils, Car, Motorbike as Motorcycle } from "lucide-react";
import { CATALOG_VERSION, districtNames, foodAreas, origins, placeById, places, sources, themeById, themes, urbanZones, zoneNames } from "@/lib/routing/data";
import { clock, decodePreferences, defaults, encodePreferences, generatePlans, mapSearch, normalizePreferences, parseRequest, districtDiscovery, preferencesForDay, cyclingLimit } from "@/lib/routing/engine";
import { siteAsset } from "@/lib/site-path";
import { RouteHospitality } from "./route-hospitality";
import { calendarFile, legMapUrl, navigationSegments, phoneMapUrl, printDocumentHtml } from "@/lib/routing/exports";
import { copyFor } from "@/lib/routing/copy";
import type { Interest, Locale, Mode, Plan, Preferences } from "@/lib/routing/types";

const transport: { id: Mode; icon: typeof Car }[] = [{ id: "walk", icon: Footprints }, { id: "transit", icon: TrainFront }, { id: "car", icon: Car }, { id: "bicycle", icon: Bike }, { id: "motorcycle", icon: Motorcycle }];
const interestKeys: Interest[] = ["heritage", "phrygia", "nature", "craft", "taste", "faith", "city"];
const STORAGE_KEY = "etahb-discovery-plans-v2";
type SavedPlan = { id: string; title: string; p: Preferences; planId: string; version: string };

export function RoutePlanner({ locale = "tr" }: { locale?: Locale }) {
  const c = copyFor(locale);
  const [draft, setDraft] = useState<Preferences>(defaults);
  const [applied, setApplied] = useState<Preferences>(defaults);
  const [result, setResult] = useState(() => generatePlans(defaults));
  const [active, setActive] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [request, setRequest] = useState("");
  const [notice, setNotice] = useState("");
  const [step, setStep] = useState(0);
  const [editing, setEditing] = useState(true);
  const [hasPlanned, setHasPlanned] = useState(false);
  const [compact, setCompact] = useState(true);
  const [expandedStop, setExpandedStop] = useState<string | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "other">("other");
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [shareFallback, setShareFallback] = useState("");
  const resultRef = useRef<HTMLElement>(null);
  const preferencesRef = useRef<HTMLFormElement>(null);
  const current = result.plans[active];
  const day = current?.days[Math.min(dayIndex, current.days.length - 1)];
  const dirty = JSON.stringify(draft) !== JSON.stringify(applied);
  const planName = (plan: Plan) => applied.focus ? themeById[applied.focus].name[locale] : [...new Set(plan.days.flatMap(d => d.placeIds.map(id => placeById[id].district)))].join(" · ");
  const fmtDuration = (minutes: number) => `${Math.floor(minutes / 60)} ${c.hour}${minutes % 60 ? ` ${minutes % 60} ${c.min}` : ""}`;

  useEffect(() => {
    setPlatform(/android/i.test(navigator.userAgent) ? "android" : /iphone|ipad|ipod/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 ? "ios" : "other");
    const media = window.matchMedia("(max-width: 760px)");
    const sync = () => setCompact(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(parsed)) setSavedPlans(parsed.filter(item => item && [CATALOG_VERSION, "2026-09-08.1", "2026-09-08.2"].includes(item.version) && typeof item.id === "string" && typeof item.title === "string" && typeof item.planId === "string").slice(0, 8).map(item => ({ ...item, p: normalizePreferences(item.p) })));
    } catch { /* An unavailable local store must never prevent route planning. */ }
    const hash = window.location.hash;
    const encoded = hash.match(/(?:^#|&)route=([^&]+)/)?.[1];
    if (encoded) {
      const restored = decodePreferences(encoded);
      if (restored) {
        const next = generatePlans(restored);
        setDraft(restored); setApplied(restored); setResult(next); setHasPlanned(true); setEditing(false);
        try { const id = decodeURIComponent(hash.match(/(?:^#|&)plan=([^&]+)/)?.[1] ?? ""); setActive(Math.max(0, next.plans.findIndex(p => p.id === id))); } catch { setActive(0); }
      }
    }
  }, []);

  function change<K extends keyof Preferences>(key: K, value: Preferences[K]) { setDraft(p => normalizePreferences({ ...p, [key]: value, ...(["interests", "districts"].includes(key) ? { focus: "" } : {}) })); setNotice(""); }
  function goToStep(next: number) {
    setStep(next); setEditing(true);
    requestAnimationFrame(() => preferencesRef.current?.querySelector<HTMLElement>(`[data-step="${next}"]`)?.focus({ preventScroll: false }));
  }
  function calculate(p = draft, selectedId?: string, scroll = false) {
    const safe = normalizePreferences(p); const next = generatePlans(safe);
    setDraft(safe); setApplied(safe); setResult(next); setActive(Math.max(0, next.plans.findIndex(plan => plan.id === selectedId))); setDayIndex(0); setExpandedStop(null); setNotice(""); setShareFallback(""); setHasPlanned(true); setEditing(false);
    if (scroll) requestAnimationFrame(() => { resultRef.current?.focus({ preventScroll: true }); resultRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); });
  }
  function useTheme(id: string) {
    const theme = themeById[id];
    const isLong = ["localweekend", "heritageweekend", "discovery", "archaeology", "twobazaars"].includes(id);
    calculate({ ...draft, focus: id, districts: [], interests: theme.interests, days: isLong ? 2 : 1, mode: ["pedal", "parkpedal"].includes(id) ? "bicycle" : draft.mode }, undefined, true);
  }
  function interpret() {
    const next = parseRequest(request, draft); setDraft(next.preferences); setNotice(next.changed.length ? c.understood : c.notUnderstood); setStep(0); setEditing(true);
  }
  function save() {
    if (!current) return;
    const item = { id: String(Date.now()), title: planName(current), p: applied, planId: current.id, version: CATALOG_VERSION };
    const next = [item, ...savedPlans.filter(p => !(p.planId === item.planId && JSON.stringify(p.p) === JSON.stringify(item.p)))].slice(0, 8);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setSavedPlans(next); setNotice(c.saved); } catch { setNotice(c.storageError); }
  }
  function deleteSaved(id: string) {
    const next = savedPlans.filter(s => s.id !== id);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setSavedPlans(next); } catch { setNotice(c.storageError); }
  }
  async function share() {
    if (!current) return;
    const url = new URL(window.location.href); url.hash = `route=${encodePreferences(applied)}&plan=${encodeURIComponent(current.id)}`;
    try { await navigator.clipboard.writeText(url.href); setNotice(c.copied); setShareFallback(""); } catch { setNotice(c.copyFailed); setShareFallback(url.href); }
  }
  function printPlan() {
    if (!current) return;
    const frame = document.createElement("iframe");
    frame.title = c.itinerary;
    frame.style.cssText = "position:fixed;inset:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none";
    frame.setAttribute("aria-hidden", "true");
    frame.onload = async () => {
      const win = frame.contentWindow, doc = frame.contentDocument;
      if (!win || !doc) { frame.remove(); return; }
      await doc.fonts.ready;
      await Promise.all(Array.from(doc.images).map(img => img.decode().catch(() => undefined)));
      win.addEventListener("afterprint", () => frame.remove(), { once: true });
      win.focus(); win.print();
      window.setTimeout(() => frame.remove(), 60000);
    };
    frame.srcdoc = printDocumentHtml(current, applied, locale, new URL(siteAsset("/brand/logo-mark.webp"), window.location.origin).href);
    document.body.appendChild(frame);
  }
  function exportCalendar() {
    if (!current) return;
    if (!applied.date) { goToStep(0); setNotice(c.calendarDate); return; }
    const url = URL.createObjectURL(new Blob([calendarFile(current, applied, locale)], { type: "text/calendar;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `eskisehir-${applied.date}.ics`; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice(c.calendarNote);
  }
  function download() {
    if (!current) return;
    const lines = [c.eyebrow, planName(current), c.demo, `${c.transport}: ${c[applied.mode]}`, `${c.origin}: ${districtDiscovery(applied) ? c.districtStart : zoneNames[applied.origin]}`, ""];
    current.days.forEach((d, i) => {
      lines.push(`${c.day} ${i + 1}${d.date ? ` · ${d.date}` : ""}`, `${clock(applied.start)} · ${zoneNames[d.origin]}`);
      if (districtDiscovery(applied)) lines.push(c.localAccess, ...(applied.mode === "transit" ? [c.localTransit] : []));
      d.items.forEach(item => {
        const food = foodAreas.find(f => f.zone === item.zone);
        const title = item.kind === "visit" ? placeById[item.id].name : item.kind === "return" ? c.return : `${item.id.endsWith("dinner") ? c.dinner : c.lunch} · ${food?.name ?? zoneNames[item.zone]}`;
        lines.push(`${clock(item.start)}–${clock(item.end)} ${title}`, `  ~${item.leg.km} km · ${item.leg.minutes} ${c.min} ${c.duration}`);
        if (item.kind === "visit") lines.push(`  ${placeById[item.id].summary[locale]}`, `  ${placeById[item.id].source}`);
        if (item.kind === "meal") lines.push(`  ${applied.meal === "picnic" ? c.picnicNote : !food ? c.packedNote : food[applied.meal][locale]}`);
      });
      lines.push("");
    });
    lines.push(c.modelNote, c.mealNote, c.sourceNote);
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/plain;charset=utf-8" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `eskisehir-rota-${locale}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="route-planner-v2" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <details className="rp-assistant rp-no-print">
        <summary><Sparkles size={19} aria-hidden="true" /><span>{c.writePreferences}</span><ChevronDown size={18} aria-hidden="true" /></summary>
        <div className="rp-assistant-content"><p>{c.parserNote}</p><form onSubmit={e => { e.preventDefault(); interpret(); }} className="rp-prompt-form"><label className="sr-only" htmlFor={`route-request-${locale}`}>{c.prompt}</label><input id={`route-request-${locale}`} value={request} onChange={e => setRequest(e.target.value)} placeholder={c.placeholder} maxLength={600} /><button type="submit" disabled={!request.trim()}>{c.interpret}<ArrowRight size={18} aria-hidden="true" /></button></form>{notice && <p role="status">{notice}</p>}</div>
      </details>
      <div className="rp-workspace">
        <aside className="rp-sidebar rp-no-print">
          {!editing && <div className="rp-preference-summary"><span className="rp-summary-label"><Check size={17} aria-hidden="true" />{c.selectionSummary}</span><h2>{draft.days} {c.day} · {c[draft.mode]}</h2><p>{draft.interests.map(i => c[i]).join(" · ")}</p><p>{clock(draft.start)}–{clock(draft.end)} · {c[draft.meal]}{draft.date ? ` · ${draft.date}` : ""}</p><p>{districtDiscovery(draft) ? c.districtStart : zoneNames[draft.origin]}{draft.mode === "bicycle" ? ` · ≤${cyclingLimit(draft)} km` : ""}</p><p>{draft.districts.length ? draft.districts.join(" · ") : c.allDistricts}</p><button type="button" className="rp-edit-preferences" onClick={() => goToStep(0)}><SlidersHorizontal size={18} aria-hidden="true" />{c.editPreferences}</button></div>}
          <form ref={preferencesRef} hidden={!editing} className="rp-filters rp-guided-preferences" id={`route-filters-${locale}`} aria-labelledby={`preferences-title-${locale}`} onSubmit={e => { e.preventDefault(); if (step < 2) goToStep(step + 1); else calculate(draft, undefined, true); }}>
            <header className="rp-preference-heading"><span><SlidersHorizontal size={20} aria-hidden="true" /></span><div><h2 id={`preferences-title-${locale}`}>{c.preferences}</h2><p>{c.preferencesIntro}</p></div></header>
            <ol className="rp-step-nav" aria-label={c.preferences}>{[c.stepTime, c.stepDiscover, c.stepPersonal].map((label, i) => <li key={label}><button type="button" className={step === i ? "selected" : ""} aria-current={step === i ? "step" : undefined} onClick={() => goToStep(i)}><span>{i + 1}</span>{label}</button></li>)}</ol>
            <fieldset className="rp-step-pane" hidden={step !== 0} data-step="0" tabIndex={-1}><legend className="sr-only">1. {c.stepTime}</legend>
              <fieldset><legend>{c.days}</legend><div className="rp-segment">{[1, 2, 3, 4].map(n => <button type="button" key={n} aria-pressed={draft.days === n} className={draft.days === n ? "selected" : ""} onClick={() => change("days", n)}>{n} <span>{c.day}</span></button>)}</div></fieldset>
              <label>{c.date}<input type="date" value={draft.date} onChange={e => change("date", e.target.value)} /></label>
              <div className="rp-two-fields"><label>{c.start}<select value={draft.start} onChange={e => change("start", Number(e.target.value))}>{[480, 540, 600, 660, 720, 780].map(n => <option key={n} value={n}>{clock(n)}</option>)}</select></label><label>{c.end}<select value={draft.end} onChange={e => change("end", Number(e.target.value))}>{[720, 780, 840, 900, 960, 1020, 1080, 1140].filter(n => n >= draft.start + 180).map(n => <option key={n} value={n}>{clock(n)}</option>)}</select></label></div>
              <label>{districtDiscovery(draft) ? c.accessOrigin : c.origin}<select value={draft.origin} onChange={e => change("origin", e.target.value as Preferences["origin"])}>{origins.map(z => <option key={z} value={z}>{zoneNames[z]}</option>)}</select><span className="rp-field-help">{districtDiscovery(draft) ? c.districtStartHelp : c.originNote}</span></label>
            </fieldset>
            <fieldset className="rp-step-pane" hidden={step !== 1} data-step="1" tabIndex={-1}><legend className="sr-only">2. {c.stepDiscover}</legend>
              <fieldset className="rp-transport"><legend>{c.transport}</legend><div>{transport.map(({ id, icon: Icon }) => <button key={id} className={draft.mode === id ? "selected" : ""} aria-pressed={draft.mode === id} onClick={() => change("mode", id)} type="button"><Icon size={21} aria-hidden="true" /><span>{c[id]}</span>{draft.mode === id && <Check size={15} aria-hidden="true" />}</button>)}</div></fieldset>
              {["bicycle", "walk", "transit"].includes(draft.mode) && <fieldset className="rp-start-scope"><legend>{c.startScope}</legend><div className="rp-segment">{(["district", "fixed"] as const).map(scope => <button type="button" key={scope} aria-pressed={draft.startMode === scope} className={draft.startMode === scope ? "selected" : ""} onClick={() => change("startMode", scope)}>{scope === "district" ? c.districtStart : c.fixedStart}</button>)}</div><p className="rp-field-help">{draft.startMode === "district" ? c.districtStartHelp : c.fixedStartHelp}</p>{draft.startMode === "fixed" && <label>{c.origin}<select value={draft.origin} onChange={e => change("origin", e.target.value as Preferences["origin"])}>{origins.map(z => <option key={z} value={z}>{zoneNames[z]}</option>)}</select></label>}</fieldset>}
              {draft.mode === "bicycle" && <label>{c.cycleDistance}<select value={draft.cycleKm} onChange={e => change("cycleKm", Number(e.target.value) as Preferences["cycleKm"])}><option value={25}>{c.cycle25}</option><option value={50}>{c.cycle50}</option><option value={80}>{c.cycle80}</option></select><span className="rp-field-help">{c.cycleDistanceNote}</span></label>}
              <fieldset><legend>{c.interests}</legend><p className="rp-field-help">{c.multiSelect}</p><div className="rp-interest-list">{interestKeys.map(i => <button type="button" key={i} aria-pressed={draft.interests.includes(i)} className={draft.interests.includes(i) ? "selected" : ""} onClick={() => change("interests", draft.interests.includes(i) ? draft.interests.length > 1 ? draft.interests.filter(x => x !== i) : draft.interests : [...draft.interests, i])}><span className="rp-check">{draft.interests.includes(i) && <Check size={13} aria-hidden="true" />}</span>{c[i]}</button>)}</div></fieldset>
              <fieldset className="rp-district-picker"><legend>{c.districts}</legend><p className="rp-field-help">{c.districtHelp}</p><details><summary>{draft.districts.length ? draft.districts.join(" · ") : `${c.allDistricts} (14)`}<ChevronDown size={17} aria-hidden="true" /></summary><div className="rp-toggle-list">{districtNames.map(d => <label key={d}><input type="checkbox" checked={draft.districts.includes(d)} onChange={() => change("districts", draft.districts.includes(d) ? draft.districts.filter(x => x !== d) : [...draft.districts, d])} /><span>{d}</span></label>)}</div>{draft.districts.length > 0 && <button type="button" className="rp-text-button" onClick={() => change("districts", [])}>{c.allDistricts}</button>}</details></fieldset>
            </fieldset>
            <fieldset className="rp-step-pane" hidden={step !== 2} data-step="2" tabIndex={-1}><legend className="sr-only">3. {c.stepPersonal}</legend>
              <fieldset><legend>{c.pace}</legend><div className="rp-segment">{(["relaxed", "balanced", "full"] as const).map(i => <button key={i} type="button" className={draft.pace === i ? "selected" : ""} aria-pressed={draft.pace === i} onClick={() => change("pace", i)}>{c[i]}</button>)}</div></fieldset>
              <label>{c.meal}<select value={draft.meal} onChange={e => change("meal", e.target.value as Preferences["meal"])}>{(["local", "vegetarian", "picnic"] as const).map(i => <option key={i} value={i}>{c[i]}</option>)}</select></label>
              <details className="rp-extra-preferences"><summary>{c.morePreferences}<ChevronDown size={17} aria-hidden="true" /></summary><div>
                <label>{c.weather}<select value={draft.weather} onChange={e => change("weather", e.target.value as Preferences["weather"])}>{(["outdoors", "indoors"] as const).map(i => <option key={i} value={i}>{c[i]}</option>)}</select></label>
                <fieldset><legend>{c.details}</legend><div className="rp-toggle-list">{(["family", "lowWalk", "freeOnly"] as const).map(i => <label key={i}><input type="checkbox" checked={draft[i]} onChange={e => change(i, e.target.checked)} /><span>{c[i]}</span></label>)}</div></fieldset>
                <label>{c.alternatives}<select value={draft.alternatives} onChange={e => change("alternatives", Number(e.target.value))}>{[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
              </div></details>
            </fieldset>
            {draft.focus && <div className="rp-focus"><Compass size={17} aria-hidden="true" />{themeById[draft.focus].name[locale]}<button type="button" onClick={() => change("focus", "")}>{c.clearFocus}</button></div>}
            <div className="rp-current-choices" aria-label={c.selectionSummary}><span>{draft.days} {c.day}</span><span>{c[draft.mode]}</span><span>{c[draft.meal]}</span></div>
            <footer className="rp-preference-footer">{step > 0 && <button type="button" className="rp-back" onClick={() => goToStep(step - 1)}>{c.back}</button>}<button type="submit" className="rp-primary">{step < 2 ? c.next : hasPlanned && dirty ? c.update : c.generate}{step < 2 ? <ArrowRight size={18} aria-hidden="true" /> : <Route size={18} aria-hidden="true" />}</button></footer>
            <button type="button" className="rp-text-button" onClick={() => { setDraft(defaults); setNotice(""); goToStep(0); }}>{c.reset}</button>
          </form>
          <details className="rp-saved"><summary><Bookmark size={18} aria-hidden="true" />{c.savedPlans} <span>{savedPlans.length}</span></summary><p>{c.localSave}</p>{savedPlans.map(s => <div key={s.id}><strong>{s.title}</strong><span>{s.p.days} {c.day} · {c[s.p.mode]}</span><div><button type="button" onClick={() => calculate(s.p, s.planId, true)}>{c.open}</button><button type="button" onClick={() => deleteSaved(s.id)} aria-label={`${c.delete}: ${s.title}`}><Trash2 size={16} aria-hidden="true" /></button></div></div>)}</details>
        </aside>
        <section className="rp-results" ref={resultRef} tabIndex={-1} aria-label={hasPlanned ? c.ready : c.welcomeTitle}>
          {!hasPlanned ? <div className="rp-welcome"><span className="rp-welcome-compass"><Compass size={55} strokeWidth={1.2} aria-hidden="true" /></span><p className="rp-eyebrow">{c.demo}</p><h2>{c.welcomeTitle}</h2><p>{c.welcomeNote}</p><div><span><Route size={19} aria-hidden="true" />{c.alternatives}</span><span><Utensils size={19} aria-hidden="true" />{c.meal}</span><span><Bookmark size={19} aria-hidden="true" />{c.save}</span></div></div> : <>
          <div className="rp-result-title"><div><span>{c.demo}</span><h2>{c.ready}</h2></div><span className="rp-result-count">{result.plans.length} <Route size={19} aria-hidden="true" /></span></div>
          <div role="status" aria-live="polite" className={notice ? "rp-status" : "sr-only"}>{notice}</div>
          {shareFallback && <label className="rp-share-fallback">{c.share}<input readOnly value={shareFallback} onFocus={e => e.target.select()} /></label>}
          {dirty && <div className="rp-dirty rp-no-print"><span>{c.dirty}</span><button type="button" onClick={() => calculate(draft)}>{c.update}<ArrowRight size={16} aria-hidden="true" /></button></div>}
          {result.plans.length > 0 && result.plans.length < applied.alternatives && <p className="rp-small-note">{c.fewer}</p>}
          {result.plans.length === 0 ? <div className="rp-empty"><Compass size={40} aria-hidden="true" /><h3>{c.empty}</h3><p>{c.emptyHint}</p>{result.unavailableDistricts.length > 0 && <p>{c.unavailableDistricts}: <strong>{result.unavailableDistricts.join(" · ")}</strong></p>}<button type="button" className="rp-edit-preferences" onClick={() => goToStep(1)}>{c.editPreferences}</button><button type="button" className="rp-primary" onClick={() => calculate(defaults)}>{c.reset}</button></div> : <>
            <div className="rp-alternatives rp-no-print" role="group" aria-label={c.alternatives}>{result.plans.map((plan, i) => <button key={plan.id} type="button" aria-pressed={active === i} className={active === i ? "selected" : ""} onClick={() => { setActive(i); setDayIndex(0); setExpandedStop(null); setNotice(""); }}><span>{c.option} {String(i + 1).padStart(2, "0")}{active === i && <Check size={17} aria-hidden="true" />}</span><strong>{[...new Set(plan.days.flatMap(d => d.placeIds.map(id => placeById[id].district)))].join(" · ")}</strong><small>{plan.days.reduce((n, d) => n + d.placeIds.length, 0)} {c.stops} · ~{Math.round(plan.days.reduce((n, d) => n + d.km, 0))} km</small></button>)}</div>
            {current && day && <article className="rp-plan">
              <header className="rp-plan-header"><div><span>{current.days.length} {c.day} · {c[applied.mode]}</span><h3>{planName(current)}</h3><p>{current.covered.map(i => c[i]).join(" · ")}</p></div><Compass className="rp-plan-compass" size={74} strokeWidth={1} aria-hidden="true" /></header>
              <details className="rp-action-menu rp-no-print" open={!compact || actionsOpen}><summary onClick={e => { e.preventDefault(); setActionsOpen(!actionsOpen); }}>{c.planActions}<ChevronDown size={17} aria-hidden="true" /></summary><div className="rp-actions"><button type="button" onClick={save}><Bookmark size={17} aria-hidden="true" />{c.save}</button><button type="button" onClick={share}><Share2 size={17} aria-hidden="true" />{c.share}</button><button type="button" onClick={download}><Download size={17} aria-hidden="true" />{c.download}</button><button type="button" onClick={exportCalendar}><CalendarPlus size={17} aria-hidden="true" />{c.calendar}</button><button type="button" onClick={printPlan}><Printer size={17} aria-hidden="true" />{c.print}</button></div><p className="rp-calendar-help">{applied.date ? c.calendarNote : c.calendarDate}{!applied.date && <button type="button" onClick={() => goToStep(0)}>{c.chooseDate} →</button>}</p></details>
              <div className="rp-day-tabs rp-no-print" role="group" aria-label={c.days}>{current.days.map((d, i) => <button type="button" aria-pressed={dayIndex === i} className={dayIndex === i ? "selected" : ""} key={i} onClick={() => { setDayIndex(i); setExpandedStop(null); }}>{c.day} {i + 1}{d.date && <small>{d.date}</small>}</button>)}</div>
              {current.days.map((dayPlan, di) => { const dayPrefs = preferencesForDay(dayPlan, applied); return <div key={di} className={`rp-day-content ${di === dayIndex ? "is-active" : ""}`}>
                <div className="rp-print-day">{c.day} {di + 1} {dayPlan.date}</div>
                <div className="rp-day-start"><div><MapPin size={19} aria-hidden="true" /><strong>{zoneNames[dayPlan.origin]}</strong><span>{clock(applied.start)} · {c.localStart}</span></div>{districtDiscovery(applied) && <><p>{c.localAccess}</p>{applied.mode === "transit" && !urbanZones.includes(dayPlan.origin) && <p>{c.localTransit}</p>}{dayPlan.origin !== applied.origin && <a href={legMapUrl(`origin:${applied.origin}`, `origin:${dayPlan.origin}`, { ...applied, mode: applied.mode === "transit" ? "transit" : "car" })} target="_blank" rel="noreferrer">{c.accessLink}<ExternalLink size={14} aria-hidden="true" /></a>}</>}</div><details className="rp-navigation rp-no-print"><summary><Navigation size={18} aria-hidden="true" />{c.navigation}<ChevronDown size={17} aria-hidden="true" /></summary><div><p>{c.navigationNote}</p>{navigationSegments(dayPlan, applied).map((part, index, parts) => <a key={index} href={part.url} target="_blank" rel="noreferrer">{parts.length > 1 ? `${c.navigationPart} ${index + 1} / ${parts.length}` : c.navigation}<ExternalLink size={15} aria-hidden="true" /></a>)}</div></details><div className="rp-metrics"><div><Navigation size={19} aria-hidden="true" /><strong>~{Math.round(dayPlan.km)} km</strong><span>{c.distance}</span></div><div><Clock3 size={19} aria-hidden="true" /><strong>{fmtDuration(dayPlan.travel)}</strong><span>{c.duration}</span></div><div><Footprints size={19} aria-hidden="true" /><strong>~{dayPlan.walking} km</strong><span>{c.walking}</span></div></div>
                <div className="rp-timeline"><h4>{c.timing}</h4><p className="rp-expand-hint">{c.tapDetails}</p><div className="rp-origin"><span>{clock(applied.start)}</span><MapPin size={19} aria-hidden="true" /><strong>{zoneNames[dayPlan.origin]}</strong><small>{c.depart}</small></div>
                  {dayPlan.items.map((item, i) => {
                    const stop = item.kind === "visit" ? placeById[item.id] : null;
                    const food = item.kind === "meal" ? foodAreas.find(f => f.zone === item.zone) : null;
                    const isPacked = applied.meal === "picnic" || !food;
                    const entryKey = `${di}-${item.id}`;
                    const title = stop?.name ?? (item.kind === "return" ? c.return : isPacked ? `${c.packed} · ${zoneNames[item.zone]}` : food!.name);
                    const meta = stop?.district ?? (item.kind === "return" ? zoneNames[dayPlan.origin] : `${item.id.endsWith("dinner") ? c.dinner : c.lunch} · ${item.end - item.start} ${c.min}`);
                    return <div key={`${item.id}-${i}`} className={`rp-timeline-item rp-${item.kind}`}>
                      <div className="rp-leg"><span>~{item.leg.km} km · {item.leg.minutes} {c.min}{item.leg.rest > 0 ? ` · ${item.leg.rest} ${c.min} ${c.rest}` : ""}</span>{item.leg.km > 0 && <a href={legMapUrl(item.leg.from, item.leg.to, dayPrefs)} target="_blank" rel="noreferrer" aria-label={c.routeLink} title={c.routeLink}><ExternalLink size={15} aria-hidden="true" /></a>}</div>
                      {item.wait > 0 && <p className="rp-wait">{item.wait} {c.min} · {c.wait}</p>}
                      <div className="rp-timeline-content">
                        <div className="rp-time"><time>{clock(item.start)}</time>{item.kind !== "return" && <span>{clock(item.end)}</span>}</div>
                        <div className="rp-marker">{item.kind === "meal" ? <Utensils size={18} aria-hidden="true" /> : item.kind === "return" ? <MapPin size={18} aria-hidden="true" /> : dayPlan.items.slice(0, i + 1).filter(x => x.kind === "visit").length}</div>
                        <details className="rp-stop-body rp-stop-disclosure" open={!compact || expandedStop === entryKey}>
                          <summary onClick={e => { e.preventDefault(); if (compact) setExpandedStop(expandedStop === entryKey ? null : entryKey); }}>
                            <span className="rp-district">{meta}</span><strong>{title}</strong><ChevronDown className="rp-stop-chevron" size={17} aria-hidden="true" />
                          </summary>
                          <div className="rp-stop-detail">
                            <div className="rp-detail-journey"><span>~{item.leg.km} km · {item.leg.minutes} {c.min}{item.leg.rest > 0 ? ` · ${item.leg.rest} ${c.min} ${c.rest}` : ""}</span>{item.wait > 0 && <span>{item.wait} {c.min} · {c.wait}</span>}<a href={legMapUrl(item.leg.from, item.leg.to, dayPrefs)} target="_blank" rel="noreferrer">{c.routeLink}<ExternalLink size={14} aria-hidden="true" /></a><a href={phoneMapUrl(item.id, dayPrefs, platform)} target={platform === "android" ? undefined : "_blank"} rel="noreferrer">{c.phoneMap}<MapPin size={14} aria-hidden="true" /></a></div>
                            {stop ? <><p>{stop.summary[locale]}</p><p className="rp-stop-note">{c[stop.note]}</p><div className="rp-stop-links"><a href={stop.source} target="_blank" rel="noreferrer">{c.source}<ExternalLink size={14} aria-hidden="true" /></a><button type="button" className="rp-no-print" onClick={() => calculate({ ...applied, excluded: [...applied.excluded, stop.id] })} aria-label={`${c.remove}: ${stop.name}`}><Trash2 size={14} aria-hidden="true" />{c.remove}</button></div></> : item.kind === "meal" ? <><p>{applied.meal === "picnic" ? c.picnicNote : !food ? c.packedNote : food[applied.meal][locale]}</p>{!isPacked && <><a className="rp-restaurant-link" target="_blank" rel="noreferrer" href={mapSearch(`${food!.name} restoran`)}>{c.restaurants}<ExternalLink size={15} aria-hidden="true" /></a><p className="rp-stop-note">{c.mealNote}</p><a className="rp-food-source" href={food!.source} target="_blank" rel="noreferrer">{c.source}<ExternalLink size={14} aria-hidden="true" /></a></>}</> : null}
                          </div>
                        </details>
                      </div>
                    </div>;
                  })}
                </div>
              </div>; })}
              <RouteHospitality key={current.id} districts={[...new Set(current.days.flatMap(d => d.placeIds.map(id => placeById[id].district)))]} locale={locale} /><p className="rp-print-note">{c.modelNote}</p>
              <div className="rp-explanation"><h4><Check size={19} aria-hidden="true" />{c.why}</h4><p>{c.reason}</p></div>
            </article>}
          </>}
          {applied.excluded.length > 0 && <div className="rp-exclusions rp-no-print"><strong>{c.exclusions}</strong>{applied.excluded.map(id => <button type="button" key={id} onClick={() => calculate({ ...applied, excluded: applied.excluded.filter(x => x !== id) })}>{placeById[id].name}<span>+ {c.restore}</span></button>)}</div>}
          {applied.mode === "bicycle" && <p className="rp-mode-note"><Bike size={21} aria-hidden="true" />{c.bicycleNote}</p>}
          {applied.mode === "motorcycle" && <p className="rp-mode-note"><Navigation size={21} aria-hidden="true" />{c.motorcycleNote}</p>}
          {applied.mode === "transit" && <p className="rp-mode-note"><TrainFront size={21} aria-hidden="true" />{c.transitNote}<a href="https://www.estram.com.tr/" target="_blank" rel="noreferrer">ESTRAM ↗</a></p>}
          {applied.lowWalk && <p className="rp-small-note">{c.lowWalkNote}</p>}{applied.weather === "indoors" && <p className="rp-small-note">{c.indoorsNote}</p>}
          </>}
        </section>
      </div>
      <section className="rp-inspiration rp-no-print"><div className="rp-section-heading"><div><span>{themes.length} {c.ideas}</span><h2>{c.inspirations}</h2></div><Compass size={28} aria-hidden="true" /></div><div className="rp-theme-grid">{themes.slice(0, 4).map((theme, i) => <button type="button" key={theme.id} onClick={() => useTheme(theme.id)}><span>{String(i + 1).padStart(2, "0")}</span><strong>{theme.name[locale]}</strong><small>{[...new Set(theme.stops.map(id => placeById[id].district))].join(" · ")}</small><ArrowRight size={18} aria-hidden="true" /></button>)}</div><details className="rp-more-themes"><summary>{c.allThemes} ({themes.length})<ChevronDown size={18} aria-hidden="true" /></summary><div className="rp-theme-grid">{themes.slice(4).map((theme, i) => <button type="button" key={theme.id} onClick={() => useTheme(theme.id)}><span>{String(i + 5).padStart(2, "0")}</span><strong>{theme.name[locale]}</strong><small>{[...new Set(theme.stops.map(id => placeById[id].district))].join(" · ")}</small><ArrowRight size={18} aria-hidden="true" /></button>)}</div></details></section>
      <div className="rp-impact rp-no-print"><div><span>VİZYON ESKİŞEHİR 2036</span><h2>{c.effective}</h2></div><p>{c.impact}</p></div>
      <details className="rp-data-note rp-no-print"><summary>{c.sourceTitle}<ChevronDown size={18} aria-hidden="true" /></summary><p>{c.modelNote}</p><p>{c.sourceNote}</p><div>{sources.map(s => <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>{s.name}<ExternalLink size={15} aria-hidden="true" /></a>)}</div></details>
      <p className="rp-demo-disclosure">{c.modelNote}</p>
    </div>
  );
}
