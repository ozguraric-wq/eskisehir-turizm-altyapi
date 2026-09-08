"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, ChevronDown, ExternalLink, ShoppingBag } from "lucide-react";
import { heritageCopy, heritagePath } from "@/lib/routing/heritage-copy";
import { discoveryMapUrl } from "@/lib/routing/heritage";
import type { Discovery } from "@/lib/routing/heritage-data";
import type { Locale } from "@/lib/routing/types";

export function RouteDiscoveries({ items, locale, area }: { items: Discovery[]; locale: Locale; area: string }) {
  const [all,setAll]=useState(false), c=heritageCopy(locale);
  if(!items.length) return null;
  const hasProducts=items.some(d => d.kind !== "heritage");
  return <details className="rp-discoveries rp-no-print">
    <summary><BookOpen size={16} aria-hidden="true"/><span>{c.context}</span><ChevronDown size={16} aria-hidden="true"/></summary>
    <div className="rp-discoveries-content">
      {(all ? items : items.slice(0,2)).map(d => <section key={d.id}>
        <p className="discovery-status">{d.status ? c[d.status] : c.registered}{d.year ? ` · ${d.year}` : ""}</p>
        <h5>{d.name[locale]}</h5><p>{d.summary[locale]}</p>
        <p className="discovery-tip">{d.kind !== "heritage" && <ShoppingBag size={14} aria-hidden="true"/>}{d.tip[locale]}</p>
        <div className="discovery-links"><Link href={`${heritagePath(locale)}#${d.id}`} target="_blank" rel="noreferrer">{c.detail}<ExternalLink size={13} aria-hidden="true"/></Link>{d.kind !== "heritage" && <a href={discoveryMapUrl(d,area)} target="_blank" rel="noreferrer">{c.map}<ExternalLink size={13} aria-hidden="true"/></a>}</div>
      </section>)}
      {items.length>2 && <button type="button" className="discovery-more" onClick={() => setAll(!all)}>{all ? c.less : `${c.more} (${items.length-2})`}</button>}
      <p className="discovery-help">{c.noDetour}</p>{hasProducts && <p className="discovery-help">{c.shoppingNote}</p>}
    </div>
  </details>;
}
