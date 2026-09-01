"use client";

import { Printer, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { charterSections } from "@/lib/charter";

export function CharterViewer() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("tr-TR");
  const sections = useMemo(() => charterSections.map((section) => ({
    ...section,
    articles: section.articles.filter((article) => !normalized || `${article.number} ${article.title} ${article.text}`.toLocaleLowerCase("tr-TR").includes(normalized)),
  })).filter((section) => section.articles.length), [normalized]);
  const resultCount = sections.reduce((sum, section) => sum + section.articles.length, 0);

  return (
    <div className="charter-layout">
      <aside className="charter-sidebar">
        <div className="charter-search"><Search aria-hidden="true" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Madde veya kavram ara" aria-label="Tüzükte ara" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Aramayı temizle"><X aria-hidden="true" size={16} /></button>}</div>
        <p className="charter-count">{resultCount} madde gösteriliyor</p>
        <nav aria-label="Tüzük bölümleri">{charterSections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
        <button className="button-secondary w-full" type="button" onClick={() => window.print()}><Printer aria-hidden="true" size={16} />Yazdır / PDF kaydet</button>
      </aside>
      <div className="charter-content">
        {sections.length ? sections.map((section) => <section id={section.id} key={section.id}><h2>{section.title}</h2><div className="charter-articles">{section.articles.map((article) => <article id={`madde-${article.number}`} key={article.number}><span>Madde {article.number}</span><h3>{article.title}</h3><p>{article.text}</p></article>)}</div></section>) : <div className="charter-empty"><Search aria-hidden="true" size={28} /><h2>Sonuç bulunamadı</h2><p>Farklı bir madde numarası veya kavram deneyin.</p><button type="button" onClick={() => setQuery("")}>Aramayı temizle</button></div>}
      </div>
    </div>
  );
}
