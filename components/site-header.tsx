/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const languages = [
  ["tr", "Türkçe", "/"],
  ["en", "English", "/en"],
  ["de", "Deutsch", "/de"],
  ["fr", "Français", "/fr"],
  ["ar", "العربية", "/ar"],
] as const;

const labels = {
  tr: { union: "Birlik", city: "Eskişehir", routes: "Rotalar", programs: "Programlar", charter: "Tüzük", gov: "T.C. ESKİŞEHİR VALİLİĞİ ÖNCÜLÜĞÜNDE · KAMU HİZMETİ", home: "Ana sayfa", subtitle: "Vizyon Eskişehir 2036" },
  en: { union: "Institution", city: "Eskişehir", routes: "Routes", programs: "Programmes", charter: "Charter", gov: "UNDER THE LEADERSHIP OF ESKİŞEHİR GOVERNORSHIP · PUBLIC SERVICE", home: "Home", subtitle: "Eskişehir Vision 2036" },
  de: { union: "Institution", city: "Eskişehir", routes: "Routen", programs: "Programme", charter: "Satzung", gov: "UNTER FEDERFÜHRUNG DES GOUVERNEURSAMTS ESKİŞEHİR · ÖFFENTLICHER DIENST", home: "Startseite", subtitle: "Vision Eskişehir 2036" },
  fr: { union: "Institution", city: "Eskişehir", routes: "Itinéraires", programs: "Programmes", charter: "Statuts", gov: "SOUS LA DIRECTION DU GOUVERNORAT D’ESKİŞEHİR · SERVICE PUBLIC", home: "Accueil", subtitle: "Vision Eskişehir 2036" },
  ar: { union: "المؤسسة", city: "إسكي شهير", routes: "المسارات", programs: "البرامج", charter: "النظام الأساسي", gov: "بقيادة ولاية إسكي شهير · خدمة عامة", home: "الرئيسية", subtitle: "رؤية إسكي شهير 2036" },
} as const;

const trGroups = [
  {
    label: "Birlik",
    href: "/kurumsal",
    items: [
      ["Neden Birlik?", "/kurumsal#birlik-hakkinda", "Turizm dinamiklerini yöneten ortak kamu kapasitesi"],
      ["Yönetim Modeli", "/kurumsal#yonetim", "Valilik öncülüğü ve sekretarya yapısı"],
      ["12. Plan ve 2036", "/kurumsal#kalkinma-plani", "Ulusal planla şehir vizyonunun bağı"],
      ["Şeffaflık", "/kurumsal#seffaflik", "Karar, performans ve belge düzeni"],
    ],
  },
  {
    label: "Eskişehir",
    href: "/ilceler",
    items: [
      ["14 İlçe", "/ilceler", "Her ilçeye özgü turizm rolü"],
      ["Tarih ve Frigya", "/ilceler#miras", "Yazılıkaya'dan UNESCO Sivrihisar'a"],
      ["Coğrafi İşaretler", "/ilceler#cografi-isaretler", "Tescilli lezzet ve zanaatlar"],
      ["Resmî Kaynaklar", "/ilceler#kaynaklar", "Ziyaret öncesi doğrulama bağlantıları"],
    ],
  },
] as const;

function localeFrom(pathname: string) {
  const first = pathname.split("/").filter(Boolean)[0];
  return (["en", "de", "fr", "ar"].includes(first) ? first : "tr") as keyof typeof labels;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale = localeFrom(pathname);
  const copy = labels[locale];
  const base = locale === "tr" ? "" : `/${locale}`;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const internationalLinks = [
    [copy.union, `${base}#institution`],
    [copy.city, `${base}#heritage`],
    [copy.routes, `${base}#routes`],
    [copy.programs, `${base}#programmes`],
    [copy.charter, "/tuzuk"],
  ] as const;

  return (
    <>
      <div className="government-bar">
        <div className="site-shell government-bar-inner">
          <span>{copy.gov}</span>
          <a href="https://www.eskisehir.gov.tr/" rel="noreferrer" target="_blank">Eskişehir Valiliği</a>
        </div>
      </div>
      <header className="site-header">
        <div className="site-shell header-main header-shell">
          <Link className="brand-lockup" href={base || "/"} aria-label={copy.home}>
            <img src="/brand/logo-mark.webp" alt="Eskişehir Turizm Altyapı Hizmet Birliği" />
            <span>
              <span className="brand-title">Eskişehir Turizm Altyapı Hizmet Birliği</span>
              <span className="brand-subtitle">{copy.subtitle}</span>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Ana menü">
            {locale === "tr" ? (
              <>
                {trGroups.map((group) => (
                  <div className="nav-group" key={group.label}>
                    <Link className={`nav-trigger ${pathname.startsWith(group.href) ? "active" : ""}`} href={group.href}>
                      {group.label}<ChevronDown aria-hidden="true" size={14} />
                    </Link>
                    <div className="nav-dropdown">
                      {group.items.map(([title, href, description]) => (
                        <Link href={href} key={title}><strong>{title}</strong><span>{description}</span></Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link className={`nav-link ${pathname === "/rotani-olustur" ? "active" : ""}`} href="/rotani-olustur">Rotalar</Link>
                <Link className={`nav-link ${pathname === "/projeler" ? "active" : ""}`} href="/projeler">Programlar</Link>
                <Link className={`nav-link ${pathname === "/tuzuk" ? "active" : ""}`} href="/tuzuk">Tüzük</Link>
              </>
            ) : internationalLinks.map(([title, href]) => <Link className="nav-link" href={href} key={title}>{title}</Link>)}

            <div className="nav-group language-group">
              <button className="nav-trigger language-trigger" type="button" aria-label="Dil seçin">
                <Globe2 aria-hidden="true" size={16} />{locale.toUpperCase()}<ChevronDown aria-hidden="true" size={13} />
              </button>
              <div className="nav-dropdown language-dropdown">
                {languages.map(([code, title, href]) => (
                  <Link className={locale === code ? "language-active" : ""} href={href} hrefLang={code} key={code}>
                    <strong>{title}</strong><span>{code.toUpperCase()}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <button className="mobile-menu-button" type="button" aria-label={open ? "Menüyü kapat" : "Menüyü aç"} aria-expanded={open} aria-controls="mobil-menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={23} />}
          </button>
        </div>

        <div className={`mobile-panel ${open ? "open" : ""}`} id="mobil-menu">
          <nav className="site-shell mobile-nav" aria-label="Mobil menü" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}>
            {locale === "tr" ? (
              <>
                {trGroups.map((group) => (
                  <details key={group.label}>
                    <summary>{group.label}<ChevronDown aria-hidden="true" size={17} /></summary>
                    <div className="mobile-subnav"><Link href={group.href}>Genel Bakış</Link>{group.items.map(([title, href]) => <Link href={href} key={title}>{title}</Link>)}</div>
                  </details>
                ))}
                <Link href="/rotani-olustur">Rotalar</Link><Link href="/projeler">Programlar</Link><Link href="/tuzuk">Tüzük</Link>
                <div className="mobile-utility"><Link href="/duyurular">Duyurular</Link><Link href="/iletisim">İletişim</Link></div>
              </>
            ) : internationalLinks.map(([title, href]) => <Link href={href} key={title}>{title}</Link>)}
            <div className="mobile-languages" aria-label="Dil seçimi">
              {languages.map(([code, title, href]) => <Link className={locale === code ? "active" : ""} href={href} hrefLang={code} key={code}>{title}</Link>)}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
