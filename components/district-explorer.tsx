"use client";

import { useMemo, useState } from "react";
import { Building2, Compass, ExternalLink, Landmark, Search, UsersRound } from "lucide-react";
import { districts } from "@/lib/content";

const filters = ["Tümü", "Çekim", "Deneyim", "Bağlantı ve konaklama"] as const;

function slugify(value: string) {
  return value.toLocaleLowerCase("tr-TR").replaceAll("ı", "i").replaceAll("ş", "s").replaceAll("ç", "c").replaceAll("ğ", "g").replaceAll("ü", "u").replaceAll("ö", "o").replaceAll(" ", "-");
}

export function DistrictExplorer() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tümü");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => districts.filter((district) => {
    const matchesRole = filter === "Tümü" || district.role === filter;
    const normalized = query.toLocaleLowerCase("tr-TR");
    const matchesQuery = !normalized || [district.name, district.theme, district.description, ...district.tags].join(" ").toLocaleLowerCase("tr-TR").includes(normalized);
    return matchesRole && matchesQuery;
  }), [filter, query]);

  const roleIcon = { "Çekim": Landmark, "Deneyim": UsersRound, "Bağlantı ve konaklama": Building2 };

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-[#ded7cc] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button className={`min-h-10 rounded-full px-4 text-xs font-extrabold transition ${filter === item ? "bg-[#65061f] text-white" : "bg-[#f5f1ea] text-[#47525c] hover:bg-[#ece3d7]"}`} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} key={item}>{item}</button>
          ))}
        </div>
        <label className="flex min-h-11 min-w-[260px] items-center gap-2 rounded-xl border border-[#ded7cc] bg-[#fffdf9] px-3">
          <Search className="text-[#8e0d2c]" aria-hidden="true" size={18} />
          <span className="sr-only">İlçe veya tema ara</span>
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-[#8a9298]" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="İlçe veya tema ara" />
        </label>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((district, index) => {
          const Icon = roleIcon[district.role];
          return (
            <article className="card group relative min-h-[330px] overflow-hidden p-7" id={slugify(district.name)} key={district.name}>
              <div className={`absolute inset-x-0 top-0 h-1.5 ${district.role === "Çekim" ? "bg-[#8e0d2c]" : district.role === "Deneyim" ? "bg-[#c89549]" : "bg-[#315c50]"}`} />
              <div className="flex items-start justify-between gap-4">
                <span className="icon-box"><Icon aria-hidden="true" size={21} /></span>
                <span className="font-serif text-4xl text-[#eee6db]">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-7 text-xs font-extrabold tracking-[.12em] text-[#8e0d2c] uppercase">{district.role}</p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-.03em]">{district.name}</h2>
              <h3 className="mt-3 text-sm font-bold text-[#3d4b55]">{district.theme}</h3>
              <p className="mt-4 text-sm leading-7 text-[#65717b]">{district.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">{district.tags.map((tag) => <span className="rounded-full bg-[#f5f1ea] px-3 py-1 text-[11px] font-bold text-[#5c6670]" key={tag}>{tag}</span>)}</div>
              <a className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#8e0d2c]" href={district.source} rel="noreferrer" target="_blank">Resmî ilçe bilgisini doğrula <ExternalLink aria-hidden="true" size={13} /></a>
            </article>
          );
        })}
      </div>
      {visible.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-[#c9c0b4] p-12 text-center"><Compass className="mx-auto text-[#8e0d2c]" aria-hidden="true" size={28} /><p className="mt-4 font-bold">Bu ölçütlerle eşleşen ilçe bulunamadı.</p><button className="mt-3 text-sm font-bold text-[#8e0d2c] underline" type="button" onClick={() => { setFilter("Tümü"); setQuery(""); }}>Filtreleri temizle</button></div>}
    </>
  );
}
