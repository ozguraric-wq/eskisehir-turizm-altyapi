"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ExternalLink, Pause, Play, ShieldCheck } from "lucide-react";
import { internationalCopy } from "@/lib/international";
import { text, type Locale } from "@/lib/routing/types";
import { siteAsset } from "@/lib/site-path";

// Published by the Ministry of Culture and Tourism; keep the original film at its source.
const film = "https://webtvpanel.kultur.gov.tr/WebTV_Contents/Publish/25122015233954/eskisehiripromotionimovieiiieskisehiritanitimifilmiiienglish-360p.mp4";
const source = "https://eskisehir.ktb.gov.tr/TR-338381/tanitim-filmi.html";
const labels = {
  institution: text("Birliği tanıyın", "Meet the Union", "Den Verband kennenlernen", "Découvrir l’Union", "تعرفوا على الاتحاد"),
  projects: text("Projelerimizi inceleyin", "Explore our programmes", "Unsere Projekte", "Explorer nos programmes", "اكتشفوا مشاريعنا"),
  pause: text("Videoyu duraklat", "Pause video", "Video pausieren", "Mettre en pause", "إيقاف الفيديو مؤقتاً"),
  play: text("Eskişehir filmini oynat", "Play the Eskişehir film", "Eskişehir-Film abspielen", "Lire le film d’Eskişehir", "تشغيل فيلم إسكي شهير"),
  film: text("Eskişehir tanıtım filmi · İl Kültür ve Turizm Müdürlüğü", "Eskişehir film · Provincial Culture and Tourism Directorate", "Eskişehir-Film · Direktion für Kultur und Tourismus", "Film d’Eskişehir · Direction de la culture et du tourisme", "فيلم إسكي شهير · مديرية الثقافة والسياحة"),
  districts: text("ilçe, ortak gelecek", "districts, a shared future", "Bezirke, eine Zukunft", "districts, un avenir commun", "مقاطعة ومستقبل مشترك"),
  seasons: text("mevsim yaşayan turizm", "seasons of discovery", "Jahreszeiten voller Entdeckungen", "saisons de découverte", "فصول للاكتشاف"),
  vision: text("Vizyon Eskişehir", "Eskişehir Vision", "Vision Eskişehir", "Vision Eskişehir", "رؤية إسكي شهير"),
  more: text("Şehre katkımızı keşfedin", "Discover our impact", "Unseren Beitrag entdecken", "Découvrir notre contribution", "اكتشفوا أثرنا في المدينة"),
};

export function CityBanner({ locale = "tr" }: { locale?: Locale }) {
  const video = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const wantsPlayback = useRef(true);
  const foreign = locale === "tr" ? null : internationalCopy[locale];
  const title = foreign?.hero ?? "Eskişehir’in değerlerini ortak bir geleceğe taşıyoruz.";
  const lead = foreign?.lead ?? "Valilik öncülüğünde; 14 ilçenin kültürünü, doğasını ve üretim gücünü buluşturuyor, turizm yatırımlarına ve şehrin geleceğine birlikte yön veriyoruz.";

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (!motion.matches && !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType ?? "")) setEnabled(true);
    const stop = () => { if (motion.matches) { wantsPlayback.current = false; video.current?.pause(); } };
    motion.addEventListener("change", stop);
    return () => motion.removeEventListener("change", stop);
  }, []);

  useEffect(() => {
    const node = video.current;
    if (!enabled || !node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && wantsPlayback.current && !document.hidden) void node.play().catch(() => setPlaying(false));
      else node.pause();
    });
    observer.observe(node);
    const visibility = () => { if (document.hidden) node.pause(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", visibility); };
  }, [enabled]);

  function toggleVideo() {
    if (!enabled) { wantsPlayback.current = true; setEnabled(true); return; }
    if (video.current?.paused) { wantsPlayback.current = true; void video.current.play().catch(() => setPlaying(false)); }
    else { wantsPlayback.current = false; video.current?.pause(); }
  }

  return <section className="city-banner" aria-label="Eskişehir">
    <img className="city-banner-poster" src={siteAsset("/media/eskisehir-hero.webp")} alt="" fetchPriority="high" />
    <video ref={video} className={`city-banner-video ${hasFrame ? "has-frame" : ""}`} src={enabled ? film : undefined} muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => { setPlaying(true); setHasFrame(true); }} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setHasFrame(false); }} />
    <div className="city-banner-shade" />
    <div className="site-shell city-banner-inner">
      <div className="city-banner-copy">
        <p className="city-banner-eyebrow"><ShieldCheck size={17} aria-hidden="true" />{foreign?.eyebrow ?? "VALİLİK ÖNCÜLÜĞÜNDE · ORTAK TURİZM VİZYONU"}</p>
        <h1>{title}</h1><p className="city-banner-lead">{lead}</p>
        <div className="city-banner-links"><Link className="button-light" href={locale === "tr" ? "/kurumsal" : `/${locale}#institution`}>{labels.institution[locale]}<ArrowRight size={17} aria-hidden="true" /></Link><Link className="city-banner-secondary" href={locale === "tr" ? "/projeler" : `/${locale}#programmes`}>{labels.projects[locale]}<ArrowRight size={17} aria-hidden="true" /></Link></div>
      </div>
      <div className="city-banner-bottom"><div className="city-banner-facts"><span><strong>14</strong>{labels.districts[locale]}</span><span><strong>4</strong>{labels.seasons[locale]}</span><span><strong>2036</strong>{labels.vision[locale]}</span></div><a className="city-banner-more" href={locale === "tr" ? "#katki" : "#institution"}>{labels.more[locale]}<ArrowDown size={18} aria-hidden="true" /></a></div>
    </div>
    <div className="city-banner-media"><button type="button" onClick={toggleVideo} aria-label={playing ? labels.pause[locale] : labels.play[locale]} title={playing ? labels.pause[locale] : labels.play[locale]}>{playing ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}</button><a href={source} target="_blank" rel="noreferrer">{labels.film[locale]}<ExternalLink size={12} aria-hidden="true" /></a></div>
  </section>;
}
