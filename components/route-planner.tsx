"use client";

import { useMemo, useState } from "react";
import { Accessibility, Bot, Car, Check, Clock3, ExternalLink, Gauge, MapPin, Printer, Route, ShieldCheck, Sparkles, TrainFront } from "lucide-react";
import { type InterestKey, type MobilityKey, routeFamilies, routeStops } from "@/lib/content";

const interests: Array<{ key: InterestKey; label: string; mark: string }> = [
  { key: "heritage", label: "Tarih ve Frigya", mark: "◈" },
  { key: "faith", label: "İnanç ve irfan", mark: "✦" },
  { key: "nature", label: "Doğa ve su", mark: "≈" },
  { key: "craft", label: "Zanaat", mark: "◆" },
  { key: "taste", label: "Lezzet", mark: "●" },
  { key: "rural", label: "Kırsal üretim", mark: "⌁" },
  { key: "city", label: "Kent kültürü", mark: "▦" },
];

const mobilityOptions: Array<{ key: MobilityKey; label: string; icon: typeof Car }> = [
  { key: "car", label: "Özel araç", icon: Car },
  { key: "public", label: "Toplu ulaşım", icon: TrainFront },
  { key: "easy", label: "Daha kolay erişim", icon: Accessibility },
];

type Pace = "relaxed" | "balanced" | "full";

const paceCopy: Record<Pace, { label: string; perDay: number }> = {
  relaxed: { label: "Sakin", perDay: 2 },
  balanced: { label: "Dengeli", perDay: 3 },
  full: { label: "Yoğun", perDay: 4 },
};

export function RoutePlanner() {
  const [selected, setSelected] = useState<InterestKey[]>(["heritage", "craft"]);
  const [days, setDays] = useState(2);
  const [mobility, setMobility] = useState<MobilityKey>("car");
  const [pace, setPace] = useState<Pace>("balanced");
  const [count, setCount] = useState(3);
  const [confirmed, setConfirmed] = useState(false);

  const suggestions = useMemo(() => routeFamilies
    .map((family) => {
      const overlap = family.interests.filter((interest) => selected.includes(interest)).length;
      const interestRatio = overlap / Math.max(1, selected.length);
      const dayFit = Math.max(0, 18 - Math.abs(family.suggestedDays - days) * 6);
      const modeFit = family.modeFit.includes(mobility) ? 14 : mobility === "car" ? 8 : 1;
      const score = Math.round(Math.min(97, 52 + interestRatio * 30 + dayFit + modeFit));
      const maxStops = Math.max(2, days * paceCopy[pace].perDay);
      const stops = family.stopIds.map((id) => routeStops[id]).filter((stop) => stop?.status === "existing").slice(0, maxStops);
      return { family, score, stops };
    })
    .sort((a, b) => b.score - a.score || Math.abs(a.family.suggestedDays - days) - Math.abs(b.family.suggestedDays - days))
    .slice(0, count), [count, days, mobility, pace, selected]);

  function toggleInterest(key: InterestKey) {
    setConfirmed(false);
    setSelected((current) => current.includes(key) ? (current.length === 1 ? current : current.filter((item) => item !== key)) : [...current, key]);
  }

  const mobilityNote = mobility === "car"
    ? "İlçeler arası bağlantıda özel araç esas alındı; yol ve hava durumunu çıkıştan önce doğrulayın."
    : mobility === "public"
      ? "Kent içi duraklar önce gelir. İlçe aktarmaları, seferler ve son kilometre bağlantısı güncel olarak teyit edilmelidir."
      : "Daha kısa yürüyüş ve dinlenme aralığı önceliklidir; her mekânın güncel fiziksel erişimini ayrıca doğrulayın.";

  return (
    <div className="smart-planner">
      <aside className="planner-controls">
        <div className="flex items-center gap-3"><span className="icon-box"><Bot aria-hidden="true" size={23} /></span><div><p className="text-xs font-extrabold tracking-[.12em] text-[#8e0d2c] uppercase">Akıllı çoklu rota asistanı</p><p className="mt-1 text-xs text-[#65717b]">Çalışan prototip · veri kaydetmez</p></div></div>

        <fieldset className="mt-8">
          <legend className="planner-legend">1. Birden çok ilgi alanı seçin</legend>
          <div className="planner-choice-grid">
            {interests.map((item) => <button className={`planner-choice ${selected.includes(item.key) ? "selected" : ""}`} type="button" aria-pressed={selected.includes(item.key)} onClick={() => toggleInterest(item.key)} key={item.key}><span>{item.mark}</span>{item.label}{selected.includes(item.key) && <Check aria-hidden="true" size={15} />}</button>)}
          </div>
        </fieldset>

        <fieldset className="mt-7"><legend className="planner-legend">2. Süre ve tempo</legend><div className="mt-3 grid grid-cols-4 gap-2">{[1, 2, 3, 4].map((day) => <button className={`planner-tile ${days === day ? "selected" : ""}`} type="button" aria-pressed={days === day} onClick={() => { setDays(day); setConfirmed(false); }} key={day}>{day}<small>gün</small></button>)}</div><div className="mt-2 grid grid-cols-3 gap-2">{(Object.keys(paceCopy) as Pace[]).map((key) => <button className={`planner-mini ${pace === key ? "selected" : ""}`} type="button" aria-pressed={pace === key} onClick={() => { setPace(key); setConfirmed(false); }} key={key}>{paceCopy[key].label}</button>)}</div></fieldset>

        <fieldset className="mt-7"><legend className="planner-legend">3. Ulaşım tercihi</legend><div className="mt-3 grid gap-2">{mobilityOptions.map((item) => { const Icon = item.icon; return <button className={`planner-wide ${mobility === item.key ? "selected" : ""}`} type="button" aria-pressed={mobility === item.key} onClick={() => { setMobility(item.key); setConfirmed(false); }} key={item.key}><Icon aria-hidden="true" size={18} />{item.label}</button>; })}</div></fieldset>

        <fieldset className="mt-7"><legend className="planner-legend">4. Kaç alternatif?</legend><div className="mt-3 grid grid-cols-3 gap-2">{[2, 3, 4].map((value) => <button className={`planner-mini ${count === value ? "selected" : ""}`} type="button" aria-pressed={count === value} onClick={() => { setCount(value); setConfirmed(false); }} key={value}>{value} rota</button>)}</div></fieldset>

        <button className="button-primary mt-8 w-full" type="button" onClick={() => setConfirmed(true)}><Sparkles aria-hidden="true" size={18} />{count} alternatif üret</button>
        <p className="mt-4 flex gap-2 text-[11px] leading-5 text-[#68727a]"><ShieldCheck className="mt-0.5 shrink-0" aria-hidden="true" size={15} />Tercihler yalnızca bu oturumda işlenir. Sonuçlar mevcut ziyaret noktalarıyla sınırlıdır; planlanan festival, akademi, motokros, karşılama ve kamp yatırımları rotaya eklenmez.</p>
      </aside>

      <section className="planner-results" aria-live="polite">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="eyebrow">{confirmed ? "Tercihlerinize göre oluşturuldu" : "Canlı eşleşme önizlemesi"}</p><h2 className="font-serif text-4xl tracking-[-.03em]">{count} uygulanabilir Eskişehir rotası</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#5b6670]">Her alternatif farklı ilçe bileşimi kurar. Eşleşme puanı; ilgi, süre, tempo ve ulaşım tercihlerinizin açıklanabilir ağırlıklandırmasıdır.</p></div>
          <button className="print-button" type="button" onClick={() => window.print()}><Printer aria-hidden="true" size={16} />Yazdır</button>
        </div>

        <div className="mobility-note"><Route aria-hidden="true" size={18} /><span>{mobilityNote}</span></div>

        <div className="route-results-list">
          {suggestions.map(({ family, score, stops }, optionIndex) => {
            const activeDays = Math.min(days, Math.max(1, stops.length));
            const perDay = Math.ceil(stops.length / activeDays);
            const dayGroups = Array.from({ length: activeDays }, (_, index) => stops.slice(index * perDay, (index + 1) * perDay)).filter((group) => group.length);
            const districtCount = new Set(stops.map((stop) => stop.district)).size;
            return (
              <article className="route-result-card" key={family.id}>
                <div className="route-result-head"><div><span className="route-option">Alternatif {optionIndex + 1}</span><h3>{family.label}</h3><p>{family.strapline}</p></div><div className="match-score"><strong>%{score}</strong><span>eşleşme</span></div></div>
                <div className="route-metrics"><span><Clock3 aria-hidden="true" size={15} />{activeDays} gün</span><span><MapPin aria-hidden="true" size={15} />{districtCount} ilçe</span><span><Gauge aria-hidden="true" size={15} />{paceCopy[pace].label} tempo</span></div>
                <div className="route-days">
                  {dayGroups.map((group, dayIndex) => (
                    <div className="route-day" key={`${family.id}-${dayIndex}`}><div className="route-day-label"><span>{dayIndex + 1}</span><strong>{dayIndex + 1}. Gün</strong></div><div className="route-day-stops">{group.map((stop, stopIndex) => <div className="route-stop" key={stop.id}><div className="route-stop-number">{stopIndex + 1}</div><div><div className="flex flex-wrap items-center gap-2"><h4>{stop.name}</h4><span className="district-chip">{stop.district}</span></div><p>{stop.description}</p><div className="stop-meta"><span>{stop.duration}</span><span>{stop.access}</span></div><p className="stay-hook">Katma değer: {stop.stayHook}</p>{stop.officialUrl && <a href={stop.officialUrl} rel="noreferrer" target="_blank">Resmî bilgiyi doğrula <ExternalLink aria-hidden="true" size={13} /></a>}</div></div>)}</div></div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <div className="ai-disclosure"><Bot aria-hidden="true" size={22} /><div><strong>Bu sürüm ne kadar “yapay zekâ”?</strong><p>Yayımdaki araç; denetlenebilir bir akıllı eşleştirme prototipidir. Üretim sürümünde doğrulanmış açılış saatleri, yol, hava, erişilebilirlik, kapasite ve etkinlik verisiyle çalışan öneri katmanı hedeflenir. Ticari sıralama yapılmaz; koruma koşulu, yerel denge ve kamu yararı ağırlıklıdır.</p></div></div>
      </section>
    </div>
  );
}
